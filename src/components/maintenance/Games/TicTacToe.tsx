// src/components/maintenance/Games/TicTacToe.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRedo, FaTrophy, FaUser, FaRobot } from 'react-icons/fa';

type Cell = 'X' | 'O' | null;
type Winner = 'X' | 'O' | 'draw' | null;

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Winner>(null);
  const [wins, setWins] = useState(() => Number(localStorage.getItem('maha-ttt-wins') || 0));
  const [losses, setLosses] = useState(() => Number(localStorage.getItem('maha-ttt-losses') || 0));
  const [draws, setDraws] = useState(() => Number(localStorage.getItem('maha-ttt-draws') || 0));

  const checkWinner = (b: Cell[]): Winner => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6], // diagonals
    ];
    for (const [a, b1, c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a] as 'X' | 'O';
    }
    if (b.every((c) => c !== null)) return 'draw';
    return null;
  };

  // Computer move — Minimax algorithm
  const computerMove = (currentBoard: Cell[]) => {
    const bestMove = minimax(currentBoard, 'O');
    if (bestMove.index !== -1) {
      const newBoard = [...currentBoard];
      newBoard[bestMove.index] = 'O';
      setBoard(newBoard);
      const w = checkWinner(newBoard);
      if (w) handleGameEnd(w);
      else setIsPlayerTurn(true);
    }
  };

  const minimax = (b: Cell[], player: 'X' | 'O'): { index: number; score: number } => {
    const w = checkWinner(b);
    if (w === 'O') return { index: -1, score: 10 };
    if (w === 'X') return { index: -1, score: -10 };
    if (w === 'draw') return { index: -1, score: 0 };

    const moves: { index: number; score: number }[] = [];
    b.forEach((cell, i) => {
      if (cell === null) {
        const newBoard = [...b];
        newBoard[i] = player;
        const result = minimax(newBoard, player === 'O' ? 'X' : 'O');
        moves.push({ index: i, score: result.score });
      }
    });

    return player === 'O'
      ? moves.reduce((best, m) => (m.score > best.score ? m : best), { index: -1, score: -Infinity })
      : moves.reduce((best, m) => (m.score < best.score ? m : best), { index: -1, score: Infinity });
  };

  const handleGameEnd = (w: Winner) => {
    setWinner(w);
    if (w === 'X') {
      const newWins = wins + 1;
      setWins(newWins);
      localStorage.setItem('maha-ttt-wins', String(newWins));
    } else if (w === 'O') {
      const newLosses = losses + 1;
      setLosses(newLosses);
      localStorage.setItem('maha-ttt-losses', String(newLosses));
    } else if (w === 'draw') {
      const newDraws = draws + 1;
      setDraws(newDraws);
      localStorage.setItem('maha-ttt-draws', String(newDraws));
    }
  };

  const handleClick = (i: number) => {
    if (board[i] || winner || !isPlayerTurn) return;
    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    const w = checkWinner(newBoard);
    if (w) handleGameEnd(w);
    else setIsPlayerTurn(false);
  };

  // Computer turn
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        computerMove(board);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, winner]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">❌⭕</span>
          <h4 className="text-white font-bold text-sm sm:text-base">Tic Tac Toe</h4>
        </div>
        <button onClick={reset} className="flex items-center gap-1 text-white/50 hover:text-[#D4AF37] transition text-xs">
          <FaRedo size={12} />
          Reset
        </button>
      </div>

      {/* Score */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-green-500/10 border border-green-400/20 rounded-lg p-2 text-center">
          <p className="text-[10px] text-green-400 uppercase flex items-center justify-center gap-1">
            <FaUser size={8} />You
          </p>
          <p className="text-green-400 font-bold text-base">{wins}</p>
        </div>
        <div className="bg-gray-500/10 border border-gray-400/20 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-400 uppercase">Draws</p>
          <p className="text-gray-400 font-bold text-base">{draws}</p>
        </div>
        <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-2 text-center">
          <p className="text-[10px] text-red-400 uppercase flex items-center justify-center gap-1">
            <FaRobot size={8} />CPU
          </p>
          <p className="text-red-400 font-bold text-base">{losses}</p>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mb-3">
        <AnimatePresence mode="wait">
          <motion.p
            key={winner || String(isPlayerTurn)}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="text-white/80 text-xs sm:text-sm font-medium"
          >
            {winner === 'X' && '🎉 You Won!'}
            {winner === 'O' && '😢 CPU Won!'}
            {winner === 'draw' && '🤝 Draw!'}
            {!winner && isPlayerTurn && '👤 Your Turn (X)'}
            {!winner && !isPlayerTurn && '🤖 CPU thinking...'}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            onClick={() => handleClick(i)}
            whileHover={{ scale: cell || winner ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!!cell || !!winner || !isPlayerTurn}
            className={`
              aspect-square rounded-lg
              flex items-center justify-center
              text-3xl sm:text-4xl font-bold
              transition-all duration-200
              ${
                cell
                  ? cell === 'X'
                    ? 'bg-green-500/20 border-2 border-green-400/40 text-green-400'
                    : 'bg-red-500/20 border-2 border-red-400/40 text-red-400'
                  : 'bg-white/5 border-2 border-white/10 hover:bg-white/10 cursor-pointer'
              }
              disabled:cursor-not-allowed
            `}
          >
            <AnimatePresence>
              {cell && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {cell}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Winner overlay */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-center"
          >
            <button
              onClick={reset}
              className="bg-[#D4AF37] hover:bg-[#F59E0B] text-gray-900 font-semibold px-4 py-2 rounded-full text-sm transition-all active:scale-95"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      {!winner && !board.some((c) => c === null) && (
        <p className="text-center text-white/40 text-[10px] mt-2">
          Game over. Reset to play again.
        </p>
      )}
    </div>
  );
};

export default TicTacToe;
// src/components/maintenance/Games/Game2048.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRedo, FaTrophy, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

type Tile = { id: number; value: number; row: number; col: number; isNew: boolean; isMerged: boolean };

const Game2048: React.FC = () => {
  const [board, setBoard] = useState<(Tile | null)[][]>(() => createEmptyBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('maha-2048-best') || 0));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [tileIdCounter, setTileIdCounter] = useState(1000);

  function createEmptyBoard(): (Tile | null)[][] {
    return Array(4).fill(null).map(() => Array(4).fill(null));
  }

  // Initialize with 2 tiles
  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const newBoard = createEmptyBoard();
    let counter = 1000;
    for (let i = 0; i < 2; i++) {
      const { board: b, newCounter } = addRandomTile(newBoard, counter);
      counter = newCounter;
    }
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setTileIdCounter(counter + 100);
  };

  const addRandomTile = (currentBoard: (Tile | null)[][], counter: number) => {
    const empty: { row: number; col: number }[] = [];
    currentBoard.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (!cell) empty.push({ row: r, col: c });
      })
    );
    if (empty.length === 0) return { board: currentBoard, newCounter: counter };

    const { row, col } = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    const newBoard = currentBoard.map((r) => [...r]);
    newBoard[row][col] = {
      id: counter,
      value,
      row,
      col,
      isNew: true,
      isMerged: false,
    };
    return { board: newBoard, newCounter: counter + 1 };
  };

  const move = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (gameOver) return;

      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => row.map((cell) => (cell ? { ...cell, isNew: false, isMerged: false } : null)));
        let moved = false;
        let gained = 0;

        const getCell = (r: number, c: number) => newBoard[r][c];
        const setCell = (r: number, c: number, val: Tile | null) => {
          newBoard[r][c] = val;
        };

        const processLine = (line: (Tile | null)[]) => {
          const filtered = line.filter((t) => t !== null) as Tile[];
          const result: Tile[] = [];
          let i = 0;
          while (i < filtered.length) {
            if (i + 1 < filtered.length && filtered[i].value === filtered[i + 1].value) {
              const newValue = filtered[i].value * 2;
              result.push({ ...filtered[i], value: newValue, isMerged: true });
              gained += newValue;
              if (newValue === 2048) setWon(true);
              i += 2;
              moved = true;
            } else {
              result.push(filtered[i]);
              i += 1;
            }
          }
          while (result.length < 4) result.push(null as any);
          return result;
        };

        if (direction === 'left') {
          for (let r = 0; r < 4; r++) {
            const line = [getCell(r, 0), getCell(r, 1), getCell(r, 2), getCell(r, 3)];
            const newLine = processLine(line);
            for (let c = 0; c < 4; c++) setCell(r, c, newLine[c]);
            if (line.some((t, i) => t !== newLine[i])) moved = true;
          }
        } else if (direction === 'right') {
          for (let r = 0; r < 4; r++) {
            const line = [getCell(r, 3), getCell(r, 2), getCell(r, 1), getCell(r, 0)];
            const newLine = processLine(line);
            for (let c = 0; c < 4; c++) setCell(r, 3 - c, newLine[c]);
            if (line.some((t, i) => t !== newLine[i])) moved = true;
          }
        } else if (direction === 'up') {
          for (let c = 0; c < 4; c++) {
            const line = [getCell(0, c), getCell(1, c), getCell(2, c), getCell(3, c)];
            const newLine = processLine(line);
            for (let r = 0; r < 4; r++) setCell(r, c, newLine[r]);
            if (line.some((t, i) => t !== newLine[i])) moved = true;
          }
        } else if (direction === 'down') {
          for (let c = 0; c < 4; c++) {
            const line = [getCell(3, c), getCell(2, c), getCell(1, c), getCell(0, c)];
            const newLine = processLine(line);
            for (let r = 0; r < 4; r++) setCell(3 - r, c, newLine[r]);
            if (line.some((t, i) => t !== newLine[i])) moved = true;
          }
        }

        if (moved) {
          const { board: b, newCounter } = addRandomTile(newBoard, tileIdCounter);
          setTileIdCounter(newCounter);
          setScore((s) => {
            const newScore = s + gained;
            if (newScore > bestScore) {
              setBestScore(newScore);
              localStorage.setItem('maha-2048-best', String(newScore));
            }
            return newScore;
          });

          // Check game over
          if (isGameOver(b)) setGameOver(true);
          return b;
        }
        return prevBoard;
      });
    },
    [gameOver, tileIdCounter, bestScore]
  );

  const isGameOver = (b: (Tile | null)[][]) => {
    // Check empty cells
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!b[r][c]) return false;
      }
    }
    // Check adjacent
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = b[r][c]!.value;
        if (c < 3 && b[r][c + 1]?.value === val) return false;
        if (r < 3 && b[r + 1][c]?.value === val) return false;
      }
    }
    return true;
  };

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        move(e.key.replace('Arrow', '').toLowerCase() as any);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [move]);

  // Touch/Swipe
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) move('right');
      else if (dx < -30) move('left');
    } else {
      if (dy > 30) move('down');
      else if (dy < -30) move('up');
    }
    setTouchStart(null);
  };

  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      2: 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800',
      4: 'bg-gradient-to-br from-amber-100 to-amber-200 text-gray-800',
      8: 'bg-gradient-to-br from-orange-400 to-orange-500 text-white',
      16: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
      32: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
      64: 'bg-gradient-to-br from-red-600 to-red-700 text-white',
      128: 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white',
      256: 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white',
      512: 'bg-gradient-to-br from-[#D4AF37] to-[#B8941F] text-white',
      1024: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
      2048: 'bg-gradient-to-br from-pink-500 to-pink-600 text-white',
    };
    return colors[value] || 'bg-gradient-to-br from-[#0F766E] to-[#065F46] text-white';
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <h4 className="text-white font-bold text-sm sm:text-base">2048</h4>
        </div>
        <button
          onClick={initGame}
          className="flex items-center gap-1 text-white/50 hover:text-[#D4AF37] transition text-xs"
        >
          <FaRedo size={12} />
          New Game
        </button>
      </div>

      {/* Score */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-[10px] text-white/50 uppercase">Score</p>
          <p className="text-white font-bold text-base">{score}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-[10px] text-white/50 uppercase flex items-center justify-center gap-1">
            <FaTrophy size={9} className="text-[#D4AF37]" />
            Best
          </p>
          <p className="text-[#D4AF37] font-bold text-base">{bestScore}</p>
        </div>
      </div>

      {/* Board */}
      <div
        className="relative bg-white/5 rounded-xl p-2 touch-none select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-4 gap-2 aspect-square">
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className="relative rounded-lg bg-white/5 flex items-center justify-center"
              >
                <AnimatePresence>
                  {cell && (
                    <motion.div
                      key={cell.id}
                      initial={cell.isNew ? { scale: 0, opacity: 0 } : false}
                      animate={{
                        scale: cell.isMerged ? [1, 1.2, 1] : 1,
                        opacity: 1,
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`
                        absolute inset-0
                        rounded-lg
                        flex items-center justify-center
                        font-bold
                        ${getTileColor(cell.value)}
                        ${cell.value >= 1024 ? 'text-sm sm:text-lg' : cell.value >= 128 ? 'text-base sm:text-xl' : 'text-lg sm:text-2xl'}
                        shadow-lg
                      `}
                    >
                      {cell.value}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {(gameOver || won) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center"
            >
              <p className="text-2xl mb-2">{won ? '🏆' : '😢'}</p>
              <p className="text-white font-bold text-lg mb-1">
                {won ? 'You Won!' : 'Game Over!'}
              </p>
              <p className="text-white/60 text-xs mb-3">Score: {score}</p>
              <button
                onClick={initGame}
                className="bg-[#D4AF37] hover:bg-[#F59E0B] text-gray-900 font-semibold px-4 py-2 rounded-full text-sm transition-all active:scale-95"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Hint */}
      <div className="mt-3 text-center">
        <p className="text-white/40 text-[10px] flex items-center justify-center gap-2">
          <FaArrowUp size={10} />
          <FaArrowLeft size={10} />
          <FaArrowDown size={10} />
          <FaArrowRight size={10} />
          Swipe or use arrow keys
        </p>
      </div>
    </div>
  );
};

export default Game2048;
// src/components/pages/MaintenancePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEnvelope, FaWhatsapp, FaFacebook, FaInstagram, FaYoutube, FaTiktok,
  FaClock, FaMapMarkerAlt, FaCheckCircle, FaRocket, FaShieldAlt, FaHeart,
  FaSpinner, FaTools, FaPaintBrush, FaMobile, FaCreditCard, FaTruck,
  FaSearch, FaChevronDown, FaChevronUp, FaBell, FaGift,
  FaRedo, FaTrophy, FaUser, FaRobot, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight,
} from 'react-icons/fa';
import { Sparkles, RefreshCw, ArrowRight, Zap, Send, Gamepad2, X } from 'lucide-react';

const LOGO_URL = 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787685509/logo_mhrzum.png';

// ============================================================
// GAME 1: 2048
// ============================================================
type Tile = { id: number; value: number; isNew: boolean; isMerged: boolean };

const Game2048: React.FC = () => {
  const createEmptyBoard = (): (Tile | null)[][] => Array(4).fill(null).map(() => Array(4).fill(null));

  const [board, setBoard] = useState<(Tile | null)[][]>(() => createEmptyBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('maha-2048-best') || 0));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [tileIdCounter, setTileIdCounter] = useState(1000);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const addRandomTile = (currentBoard: (Tile | null)[][], counter: number) => {
    const empty: { row: number; col: number }[] = [];
    currentBoard.forEach((row, r) => row.forEach((cell, c) => { if (!cell) empty.push({ row: r, col: c }); }));
    if (empty.length === 0) return { newCounter: counter };
    const { row, col } = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    currentBoard[row][col] = { id: counter, value, isNew: true, isMerged: false };
    return { newCounter: counter + 1 };
  };

  const isGameOver = (b: (Tile | null)[][]) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!b[r][c]) return false;
        const val = b[r][c]!.value;
        if (c < 3 && b[r][c + 1]?.value === val) return false;
        if (r < 3 && b[r + 1][c]?.value === val) return false;
      }
    }
    return true;
  };

  const initGame = useCallback(() => {
    const newBoard = createEmptyBoard();
    let counter = 1000;
    for (let i = 0; i < 2; i++) {
      const res = addRandomTile(newBoard, counter);
      counter = res.newCounter;
    }
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setTileIdCounter(counter + 100);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row) => row.map((cell) => (cell ? { ...cell, isNew: false, isMerged: false } : null)));
      let moved = false;
      let gained = 0;
      let reached2048 = false;

      const processLine = (line: (Tile | null)[]) => {
        const filtered = line.filter((t) => t !== null) as Tile[];
        const result: Tile[] = [];
        let i = 0;
        while (i < filtered.length) {
          if (i + 1 < filtered.length && filtered[i].value === filtered[i + 1].value) {
            const newValue = filtered[i].value * 2;
            result.push({ id: filtered[i].id, value: newValue, isNew: false, isMerged: true });
            gained += newValue;
            if (newValue === 2048) reached2048 = true;
            i += 2;
          } else { result.push(filtered[i]); i += 1; }
        }
        while (result.length < 4) result.push(null as any);
        return result;
      };

      const getCell = (r: number, c: number) => newBoard[r][c];
      const setCell = (r: number, c: number, val: Tile | null) => { newBoard[r][c] = val; };

      if (direction === 'left') {
        for (let r = 0; r < 4; r++) {
          const line = [getCell(r, 0), getCell(r, 1), getCell(r, 2), getCell(r, 3)];
          const nl = processLine(line);
          for (let c = 0; c < 4; c++) setCell(r, c, nl[c]);
          if (line.some((t, i) => t !== nl[i])) moved = true;
        }
      } else if (direction === 'right') {
        for (let r = 0; r < 4; r++) {
          const line = [getCell(r, 3), getCell(r, 2), getCell(r, 1), getCell(r, 0)];
          const nl = processLine(line);
          for (let c = 0; c < 4; c++) setCell(r, 3 - c, nl[c]);
          if (line.some((t, i) => t !== nl[i])) moved = true;
        }
      } else if (direction === 'up') {
        for (let c = 0; c < 4; c++) {
          const line = [getCell(0, c), getCell(1, c), getCell(2, c), getCell(3, c)];
          const nl = processLine(line);
          for (let r = 0; r < 4; r++) setCell(r, c, nl[r]);
          if (line.some((t, i) => t !== nl[i])) moved = true;
        }
      } else if (direction === 'down') {
        for (let c = 0; c < 4; c++) {
          const line = [getCell(3, c), getCell(2, c), getCell(1, c), getCell(0, c)];
          const nl = processLine(line);
          for (let r = 0; r < 4; r++) setCell(3 - r, c, nl[r]);
          if (line.some((t, i) => t !== nl[i])) moved = true;
        }
      }

      if (moved) {
        const res = addRandomTile(newBoard, tileIdCounter);
        setTileIdCounter(res.newCounter);
        setScore((s) => {
          const ns = s + gained;
          if (ns > bestScore) { setBestScore(ns); localStorage.setItem('maha-2048-best', String(ns)); }
          return ns;
        });
        if (reached2048) setWon(true);
        if (isGameOver(newBoard)) setGameOver(true);
        return newBoard;
      }
      return prevBoard;
    });
  }, [gameOver, tileIdCounter, bestScore]);

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

  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      2: 'from-gray-200 to-gray-300 text-gray-800',
      4: 'from-amber-100 to-amber-200 text-gray-800',
      8: 'from-orange-400 to-orange-500 text-white',
      16: 'from-orange-500 to-orange-600 text-white',
      32: 'from-red-500 to-red-600 text-white',
      64: 'from-red-600 to-red-700 text-white',
      128: 'from-yellow-400 to-yellow-500 text-white',
      256: 'from-yellow-500 to-yellow-600 text-white',
      512: 'from-[#D4AF37] to-[#B8941F] text-white',
      1024: 'from-purple-500 to-purple-600 text-white',
      2048: 'from-pink-500 to-pink-600 text-white',
    };
    return colors[value] || 'from-[#0F766E] to-[#065F46] text-white';
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2"><span className="text-xl">🎯</span><h4 className="text-white font-bold text-sm">2048</h4></div>
        <button onClick={initGame} className="flex items-center gap-1 text-white/50 hover:text-[#D4AF37] transition text-xs"><FaRedo size={12} /> New</button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-[10px] text-white/50 uppercase">Score</p>
          <p className="text-white font-bold text-base">{score}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-[10px] text-white/50 uppercase flex items-center justify-center gap-1"><FaTrophy size={9} className="text-[#D4AF37]" /> Best</p>
          <p className="text-[#D4AF37] font-bold text-base">{bestScore}</p>
        </div>
      </div>

      <div
        className="relative bg-white/5 rounded-xl p-2 touch-none select-none"
        onTouchStart={(e) => setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchEnd={(e) => {
          if (!touchStart) return;
          const dx = e.changedTouches[0].clientX - touchStart.x;
          const dy = e.changedTouches[0].clientY - touchStart.y;
          if (Math.abs(dx) > Math.abs(dy)) { if (dx > 30) move('right'); else if (dx < -30) move('left'); }
          else { if (dy > 30) move('down'); else if (dy < -30) move('up'); }
          setTouchStart(null);
        }}
      >
        <div className="grid grid-cols-4 gap-2 aspect-square">
          {board.map((row, r) => row.map((cell, c) => (
            <div key={`${r}-${c}`} className="relative rounded-lg bg-white/5 flex items-center justify-center">
              <AnimatePresence>
                {cell && (
                  <motion.div
                    key={cell.id}
                    initial={cell.isNew ? { scale: 0, opacity: 0 } : false}
                    animate={{ scale: cell.isMerged ? [1, 1.2, 1] : 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute inset-0 rounded-lg flex items-center justify-center font-bold bg-gradient-to-br ${getTileColor(cell.value)} ${cell.value >= 1024 ? 'text-sm' : cell.value >= 128 ? 'text-base' : 'text-lg'} shadow-lg`}
                  >
                    {cell.value}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )))}
        </div>

        <AnimatePresence>
          {(gameOver || won) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center">
              <p className="text-2xl mb-2">{won ? '🏆' : '😢'}</p>
              <p className="text-white font-bold text-base mb-1">{won ? 'You Won!' : 'Game Over!'}</p>
              <p className="text-white/60 text-xs mb-3">Score: {score}</p>
              <button onClick={initGame} className="bg-[#D4AF37] hover:bg-[#F59E0B] text-gray-900 font-semibold px-4 py-2 rounded-full text-sm active:scale-95">Play Again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-3 text-white/40 text-[10px] flex items-center justify-center gap-2">
        <FaArrowUp size={10} /><FaArrowLeft size={10} /><FaArrowDown size={10} /><FaArrowRight size={10} />
        Swipe or arrow keys
      </p>
    </div>
  );
};

// ============================================================
// GAME 2: TIC TAC TOE
// ============================================================
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
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a, b1, c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a] as 'X' | 'O';
    }
    if (b.every((c) => c !== null)) return 'draw';
    return null;
  };

  const minimax = (b: Cell[], player: 'X' | 'O'): { index: number; score: number } => {
    const w = checkWinner(b);
    if (w === 'O') return { index: -1, score: 10 };
    if (w === 'X') return { index: -1, score: -10 };
    if (w === 'draw') return { index: -1, score: 0 };
    const moves: { index: number; score: number }[] = [];
    b.forEach((cell, i) => {
      if (cell === null) {
        const nb = [...b]; nb[i] = player;
        moves.push({ index: i, score: minimax(nb, player === 'O' ? 'X' : 'O').score });
      }
    });
    return player === 'O'
      ? moves.reduce((best, m) => (m.score > best.score ? m : best), { index: -1, score: -Infinity })
      : moves.reduce((best, m) => (m.score < best.score ? m : best), { index: -1, score: Infinity });
  };

  const handleGameEnd = (w: Winner) => {
    setWinner(w);
    if (w === 'X') { const n = wins + 1; setWins(n); localStorage.setItem('maha-ttt-wins', String(n)); }
    else if (w === 'O') { const n = losses + 1; setLosses(n); localStorage.setItem('maha-ttt-losses', String(n)); }
    else if (w === 'draw') { const n = draws + 1; setDraws(n); localStorage.setItem('maha-ttt-draws', String(n)); }
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const t = setTimeout(() => {
        const best = minimax(board, 'O');
        if (best.index !== -1) {
          const nb = [...board]; nb[best.index] = 'O';
          setBoard(nb);
          const w = checkWinner(nb);
          if (w) handleGameEnd(w);
          else setIsPlayerTurn(true);
        }
      }, 400);
      return () => clearTimeout(t);
    }
  }, [isPlayerTurn, board, winner]);

  const handleClick = (i: number) => {
    if (board[i] || winner || !isPlayerTurn) return;
    const nb = [...board]; nb[i] = 'X';
    setBoard(nb);
    const w = checkWinner(nb);
    if (w) handleGameEnd(w);
    else setIsPlayerTurn(false);
  };

  const reset = () => { setBoard(Array(9).fill(null)); setWinner(null); setIsPlayerTurn(true); };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2"><span className="text-lg">❌⭕</span><h4 className="text-white font-bold text-sm">Tic Tac Toe</h4></div>
        <button onClick={reset} className="flex items-center gap-1 text-white/50 hover:text-[#D4AF37] transition text-xs"><FaRedo size={12} /> Reset</button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-green-500/10 border border-green-400/20 rounded-lg p-2 text-center">
          <p className="text-[10px] text-green-400 uppercase flex items-center justify-center gap-1"><FaUser size={8} />You</p>
          <p className="text-green-400 font-bold text-base">{wins}</p>
        </div>
        <div className="bg-gray-500/10 border border-gray-400/20 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-400 uppercase">Draws</p>
          <p className="text-gray-400 font-bold text-base">{draws}</p>
        </div>
        <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-2 text-center">
          <p className="text-[10px] text-red-400 uppercase flex items-center justify-center gap-1"><FaRobot size={8} />CPU</p>
          <p className="text-red-400 font-bold text-base">{losses}</p>
        </div>
      </div>

      <div className="text-center mb-3">
        <AnimatePresence mode="wait">
          <motion.p key={winner || String(isPlayerTurn)} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="text-white/80 text-xs font-medium">
            {winner === 'X' && '🎉 You Won!'}
            {winner === 'O' && '😢 CPU Won!'}
            {winner === 'draw' && '🤝 Draw!'}
            {!winner && isPlayerTurn && '👤 Your Turn (X)'}
            {!winner && !isPlayerTurn && '🤖 CPU thinking...'}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            onClick={() => handleClick(i)}
            whileHover={{ scale: cell || winner ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!!cell || !!winner || !isPlayerTurn}
            className={`aspect-square rounded-lg flex items-center justify-center text-3xl font-bold transition-all duration-200 ${
              cell
                ? cell === 'X' ? 'bg-green-500/20 border-2 border-green-400/40 text-green-400' : 'bg-red-500/20 border-2 border-red-400/40 text-red-400'
                : 'bg-white/5 border-2 border-white/10 hover:bg-white/10 cursor-pointer'
            } disabled:cursor-not-allowed`}
          >
            <AnimatePresence>
              {cell && (
                <motion.span initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ duration: 0.3 }}>
                  {cell}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {winner && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-center">
            <button onClick={reset} className="bg-[#D4AF37] hover:bg-[#F59E0B] text-gray-900 font-semibold px-4 py-2 rounded-full text-sm active:scale-95">Play Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================
// GAME 3: TAP THE COLOR
// ============================================================
const COLORS = [
  { name: 'Red', hex: '#EF4444' }, { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#22C55E' }, { name: 'Yellow', hex: '#EAB308' },
  { name: 'Purple', hex: '#A855F7' }, { name: 'Pink', hex: '#EC4899' },
  { name: 'Orange', hex: '#F97316' }, { name: 'Teal', hex: '#14B8A6' },
];

const TapTheColor: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [grid, setGrid] = useState<typeof COLORS>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('maha-tapcolor-best') || 0));
  const [gameOver, setGameOver] = useState(false);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const generateRound = () => {
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(target);
    const items = [target];
    while (items.length < 6) {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      items.push(c);
    }
    setGrid(items.sort(() => Math.random() - 0.5));
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    generateRound();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsPlaying(false);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleTap = (color: typeof COLORS[0]) => {
    if (!isPlaying) return;
    if (color.name === targetColor.name) {
      setFeedback('correct');
      setScore((s) => {
        const ns = s + 1;
        if (ns > bestScore) { setBestScore(ns); localStorage.setItem('maha-tapcolor-best', String(ns)); }
        return ns;
      });
      setTimeout(() => { setFeedback(null); generateRound(); }, 200);
    } else {
      setFeedback('wrong');
      setTimeLeft((t) => Math.max(0, t - 2));
      setTimeout(() => setFeedback(null), 300);
    }
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2"><span className="text-xl">🎨</span><h4 className="text-white font-bold text-sm">Tap the Color</h4></div>
        <button onClick={startGame} className="flex items-center gap-1 text-white/50 hover:text-[#D4AF37] transition text-xs"><FaRedo size={12} /> {isPlaying ? 'Restart' : 'Start'}</button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-[10px] text-white/50 uppercase">Score</p>
          <p className="text-white font-bold text-base">{score}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-[10px] text-white/50 uppercase">Time</p>
          <p className={`font-bold text-base ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-[10px] text-white/50 uppercase flex items-center justify-center gap-1"><FaTrophy size={9} className="text-[#D4AF37]" /> Best</p>
          <p className="text-[#D4AF37] font-bold text-base">{bestScore}</p>
        </div>
      </div>

      {isPlaying && (
        <motion.div
          animate={feedback === 'wrong' ? { x: [-5, 5, -5, 5, 0] } : {}}
          className="text-center mb-3 bg-white/5 rounded-xl p-3"
        >
          <p className="text-white/60 text-[10px] uppercase tracking-wider mb-1">Tap this color</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 shadow-lg" style={{ background: targetColor.hex }} />
            <p className="text-white font-bold text-sm">{targetColor.name}</p>
          </div>
          {feedback === 'correct' && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-xs mt-1">+1 ✅</motion.p>}
          {feedback === 'wrong' && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-1">-2s ❌</motion.p>}
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-2 aspect-square max-w-[280px] mx-auto">
        {isPlaying ? (
          grid.map((color, i) => (
            <motion.button
              key={`${color.name}-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTap(color)}
              className="rounded-xl shadow-lg border-2 border-white/20 hover:border-white/40 transition-all active:scale-95"
              style={{ background: color.hex }}
            />
          ))
        ) : gameOver ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-3 flex flex-col items-center justify-center aspect-square">
            <p className="text-4xl mb-2">🏁</p>
            <p className="text-white font-bold text-lg mb-1">Time's Up!</p>
            <p className="text-white/60 text-sm mb-3">Score: {score}</p>
            <button onClick={startGame} className="bg-[#D4AF37] hover:bg-[#F59E0B] text-gray-900 font-semibold px-5 py-2 rounded-full text-sm active:scale-95">Play Again</button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-3 flex flex-col items-center justify-center aspect-square bg-white/5 rounded-xl">
            <p className="text-5xl mb-3">🎨</p>
            <p className="text-white font-bold text-base mb-1">Tap the Color</p>
            <p className="text-white/50 text-xs mb-4 text-center px-4">Tap the color shown. 30 seconds. How many can you get?</p>
            <button onClick={startGame} className="bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-gray-900 font-bold px-6 py-2.5 rounded-full text-sm active:scale-95 shadow-lg">Start Game</button>
          </motion.div>
        )}
      </div>

      {isPlaying && (
        <p className="text-center text-white/40 text-[10px] mt-3">⚡ Correct: +1 | ❌ Wrong: -2 seconds</p>
      )}
    </div>
  );
};

// ============================================================
// MAIN MAINTENANCE PAGE
// ============================================================
interface MaintenancePageProps {
  message?: string;
  expectedBack?: string;
  progress?: number;
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({
  message,
  expectedBack,
  progress,
}) => {
  const [progressValue, setProgressValue] = useState(progress || 0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [selectedGame, setSelectedGame] = useState<'2048' | 'tictactoe' | 'tapcolor'>('2048');

  useEffect(() => {
    if (progress !== undefined) { setProgressValue(progress); return; }
    const timer = setInterval(() => {
      setProgressValue((prev) => (prev >= 85 ? prev : Math.min(prev + 1, 85)));
    }, 800);
    return () => clearInterval(timer);
  }, [progress]);

  const liveStatuses = [
    'Upgrading database servers',
    'Optimizing image delivery',
    'Testing new checkout flow',
    'Deploying security patches',
    'Loading new product categories',
    'Running final quality checks',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStatus((prev) => (prev + 1) % liveStatuses.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) { alert('Please enter a valid email'); return; }
    setSubscribing(true);
    setTimeout(() => { setSubscribed(true); setSubscribing(false); setEmail(''); }, 1500);
  };

  const faqs = [
    { q: 'When will the website be back online?', a: "We're working as fast as possible! Most upgrades complete within 24-48 hours. Follow us on WhatsApp for live updates." },
    { q: 'Are my existing orders safe?', a: 'Absolutely! All existing orders are 100% safe and will be processed normally.' },
    { q: 'Can I still place new orders?', a: "Currently, new orders can't be placed. But we'll be back very soon!" },
    { q: 'Will my account and data be preserved?', a: 'Yes! All accounts, wishlists, addresses, and order history are fully preserved.' },
    { q: 'How can I contact support?', a: 'Via WhatsApp (+92 303 3169725) or email (mahaonehypermarket@gmail.com).' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <FaFacebook />, url: 'https://www.facebook.com/share/1CS3PhXJh9/', color: 'hover:bg-[#1877F2]' },
    { name: 'Instagram', icon: <FaInstagram />, url: 'https://www.instagram.com/mahaonehypermarket', color: 'hover:bg-gradient-to-br hover:from-[#E4405F] hover:via-[#F58529] hover:to-[#833AB4]' },
    { name: 'YouTube', icon: <FaYoutube />, url: 'https://www.youtube.com/@MahaOneHyperMarket', color: 'hover:bg-[#FF0000]' },
    { name: 'TikTok', icon: <FaTiktok />, url: 'https://www.tiktok.com/@maha.one.hyper.ma', color: 'hover:bg-black' },
  ];

  const whatsNew = [
    { icon: <FaMobile />, title: 'Mobile-First Design', desc: 'Faster, smoother on every device' },
    { icon: <FaSearch />, title: 'Smarter Search', desc: 'AI-powered product discovery' },
    { icon: <FaCreditCard />, title: 'Easier Checkout', desc: 'Simplified payment process' },
    { icon: <FaTruck />, title: 'Better Tracking', desc: 'Real-time order updates' },
    { icon: <FaPaintBrush />, title: 'New Categories', desc: 'More products coming soon' },
    { icon: <FaGift />, title: 'Loyalty Rewards', desc: 'Earn points on every purchase' },
  ];

  const reasons = [
    { icon: <FaRocket />, title: 'Speed Boost', desc: '10x faster loading' },
    { icon: <FaShieldAlt />, title: 'Better Security', desc: 'Enhanced data protection' },
    { icon: <Sparkles />, title: 'New Features', desc: 'Based on your requests' },
    { icon: <FaTools />, title: 'Bug Fixes', desc: 'Smoother experience' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F766E] flex items-center justify-center p-3 sm:p-4 lg:p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#0F766E]/30 rounded-full blur-3xl -ml-20 -mb-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 md:p-8 pb-0">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-4">
            <img src={LOGO_URL} alt="MAHA ONE" className="w-32 sm:w-40 md:w-48 h-auto mx-auto drop-shadow-2xl" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="mt-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                <span className="text-[#D4AF37]">MAHA</span><span className="text-white"> ONE</span>
              </h1>
              <p className="text-[9px] sm:text-[10px] text-white/50 tracking-[0.4em] uppercase mt-1">HYPERMART</p>
            </div>
          </motion.div>

          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center mb-4">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-white/5 p-4 sm:p-5 rounded-full border border-white/10">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                  <FaTools className="text-3xl sm:text-4xl md:text-5xl text-[#D4AF37]" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              We're Building Something Better! 🚀
            </h2>
            <p className="text-white/60 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {message || "We're upgrading MAHA ONE to serve you faster, better, and stronger. Your shopping experience is about to get a whole lot better!"}
            </p>
            {expectedBack && <p className="text-[#D4AF37] text-xs sm:text-sm mt-2 font-medium">{expectedBack}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="max-w-md mx-auto mb-4">
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.p key={currentStatus} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-white/80 text-xs sm:text-sm truncate">
                    {liveStatuses[currentStatus]}...
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="max-w-md mx-auto mb-5">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-white/60 flex items-center gap-1.5"><RefreshCw size={11} className="animate-spin" />Upgrade Progress</span>
              <span className="text-[#D4AF37] font-bold">{progressValue}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressValue}%` }} className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] rounded-full shadow-lg shadow-[#D4AF37]/30" />
            </div>
          </motion.div>

          {/* GAME BUTTON */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="max-w-md mx-auto mb-6">
            <button
              onClick={() => setShowGame(!showGame)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 hover:border-purple-400/50 text-white font-bold px-6 py-3 rounded-full transition-all active:scale-95"
            >
              <Gamepad2 size={18} className="text-[#D4AF37]" />
              <span>{showGame ? 'Hide Games' : 'Play While You Wait 🎮'}</span>
              {showGame ? <X size={16} /> : <ArrowRight size={16} />}
            </button>
          </motion.div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 md:p-8 pt-0">
          {/* GAME SECTION */}
          <AnimatePresence>
            {showGame && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                <div className="flex gap-2 mb-3">
                  {[
                    { id: '2048', label: '🎯 2048' },
                    { id: 'tictactoe', label: '❌⭕ Tic Tac Toe' },
                    { id: 'tapcolor', label: '🎨 Tap Color' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGame(g.id as any)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition ${
                        selectedGame === g.id ? 'bg-[#D4AF37] text-gray-900' : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>

                {selectedGame === '2048' && <Game2048 />}
                {selectedGame === 'tictactoe' && <TicTacToe />}
                {selectedGame === 'tapcolor' && <TapTheColor />}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Why We're Down */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-6">
            <h3 className="text-white text-center text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 flex items-center justify-center gap-2">
              <Zap className="text-[#D4AF37]" size={14} />What We're Working On<Zap className="text-[#D4AF37]" size={14} />
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {reasons.map((reason, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.05 }} className="bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/10 text-center">
                  <div className="text-[#D4AF37] text-xl sm:text-2xl mb-1.5 flex justify-center">{reason.icon}</div>
                  <h4 className="text-white font-semibold text-[11px] sm:text-xs mb-0.5">{reason.title}</h4>
                  <p className="text-white/50 text-[10px]">{reason.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* What's Coming */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mb-6">
            <h3 className="text-white text-center text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 flex items-center justify-center gap-2">
              <FaGift className="text-[#D4AF37]" size={14} />What's Coming Soon<FaGift className="text-[#D4AF37]" size={14} />
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {whatsNew.map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + index * 0.04 }} className="flex items-start gap-2 bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 text-[#D4AF37] text-sm">{item.icon}</div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-white font-semibold text-[11px] sm:text-xs mb-0.5">{item.title}</h4>
                    <p className="text-white/50 text-[10px] leading-tight">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mb-6">
            <h3 className="text-white text-center text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">❓ Frequently Asked Questions</h3>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between gap-2 p-3 text-left hover:bg-white/5 transition">
                    <span className="text-white/90 text-xs sm:text-sm font-medium flex-1">{faq.q}</span>
                    {openFaq === index ? <FaChevronUp className="text-[#D4AF37]" size={12} /> : <FaChevronDown className="text-[#D4AF37]" size={12} />}
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="px-3 pb-3 text-white/60 text-xs sm:text-sm leading-relaxed border-t border-white/5 pt-2">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Email Subscription */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mb-6">
            <div className="bg-gradient-to-r from-[#D4AF37]/15 via-[#F59E0B]/15 to-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaBell className="text-[#D4AF37]" size={18} />
                <h3 className="text-white text-sm sm:text-base font-bold">Get Notified When We're Back!</h3>
              </div>

              {subscribed ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                    <FaCheckCircle className="text-green-400 text-2xl" />
                  </div>
                  <p className="text-white font-semibold text-sm">You're on the list! 🎉</p>
                </motion.div>
              ) : (
                <>
                  <p className="text-white/70 text-xs sm:text-sm text-center mb-3">Enter your email — we'll send you an alert!</p>
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#D4AF37] focus:bg-white/15 text-sm" disabled={subscribing} />
                    <button type="submit" disabled={subscribing} className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-gray-900 font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap">
                      {subscribing ? <FaSpinner className="animate-spin" /> : <><Send size={14} />Notify Me</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>

          {/* WhatsApp CTA */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mb-6 text-center">
            <p className="text-white/50 text-xs mb-3">Want instant updates? Join our WhatsApp</p>
            <a href="https://wa.me/923033169725?text=Hi! Please notify me when Maha One is back online." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold px-6 py-3 rounded-full transition-all active:scale-95 group">
              <FaWhatsapp className="text-lg" /><span>Get WhatsApp Updates</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mb-6">
            <p className="text-white/50 text-center text-xs mb-3">Need urgent help? We're just a message away:</p>
            <div className="grid grid-cols-2 gap-2">
              <a href="mailto:mahaonehypermarket@gmail.com" className="flex items-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-all border border-white/5">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0"><FaEnvelope className="text-[#D4AF37]" size={12} /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] text-white/40 uppercase">Email</p>
                  <p className="text-[11px] sm:text-xs truncate">mahaonehypermarket@gmail.com</p>
                </div>
              </a>
              <a href="https://wa.me/923033169725" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-all border border-white/5">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center flex-shrink-0"><FaWhatsapp className="text-[#25D366]" size={12} /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] text-white/40 uppercase">WhatsApp</p>
                  <p className="text-[11px] sm:text-xs">+92 303 3169725</p>
                </div>
              </a>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-white/5 rounded-xl text-white/60 border border-white/5">
                <FaMapMarkerAlt className="text-[#D4AF37] flex-shrink-0" size={14} />
                <div className="min-w-0">
                  <p className="text-[9px] text-white/40 uppercase">Location</p>
                  <p className="text-[11px] sm:text-xs">Ayesha Manzil, Karachi</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-white/5 rounded-xl text-white/60 border border-white/5">
                <FaClock className="text-[#D4AF37] flex-shrink-0" size={14} />
                <div className="min-w-0">
                  <p className="text-[9px] text-white/40 uppercase">Hours</p>
                  <p className="text-[11px] sm:text-xs">Mon-Sat: 9AM - 9PM</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mb-4">
            <p className="text-center text-white/30 text-[10px] uppercase tracking-[0.3em] mb-3">Follow us on social media</p>
            <div className="flex justify-center gap-2.5 flex-wrap">
              {socialLinks.map((social, index) => (
                <motion.a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 + index * 0.05 }} whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.95 }} className={`inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all border border-white/10 hover:border-white/30 ${social.color}`} title={social.name}>
                  <span className="text-base sm:text-lg">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Safe Data */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl p-3 mb-4">
            <div className="flex items-start gap-2">
              <FaCheckCircle className="text-[#D4AF37] flex-shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-white/80 text-xs font-medium">Your orders and data are 100% safe!</p>
                <p className="text-white/50 text-[10px] mt-0.5">All existing orders will be processed normally.</p>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="text-center">
            <div className="text-white/30 text-[10px] space-y-1">
              <p className="flex items-center justify-center gap-1.5">Made with <FaHeart className="text-red-400 text-[10px] animate-pulse" /> in Pakistan</p>
              <p>© {new Date().getFullYear()} Maha One Hypermart. All rights reserved.</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
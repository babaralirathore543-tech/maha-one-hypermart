// src/components/maintenance/Games/TapTheColor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRedo, FaTrophy, FaHeart } from 'react-icons/fa';

const COLORS = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Teal', hex: '#14B8A6' },
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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const generateRound = () => {
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(target);

    // Generate 6 grid items (ensure target is present)
    const items = [target];
    while (items.length < 6) {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      if (c.name !== target.name || items.filter((i) => i.name === target.name).length < 1) {
        items.push(c);
      }
    }
    // Shuffle but ensure target is in there
    setGrid(items.sort(() => Math.random() - 0.5));
  };

  const handleTap = (color: typeof COLORS[0]) => {
    if (!isPlaying) return;

    if (color.name === targetColor.name) {
      setFeedback('correct');
      setScore((s) => {
        const newScore = s + 1;
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('maha-tapcolor-best', String(newScore));
        }
        return newScore;
      });
      setTimeout(() => {
        setFeedback(null);
        generateRound();
      }, 200);
    } else {
      setFeedback('wrong');
      setTimeLeft((t) => Math.max(0, t - 2));
      setTimeout(() => setFeedback(null), 300);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎨</span>
          <h4 className="text-white font-bold text-sm sm:text-base">Tap the Color</h4>
        </div>
        <button onClick={startGame} className="flex items-center gap-1 text-white/50 hover:text-[#D4AF37] transition text-xs">
          <FaRedo size={12} />
          {isPlaying ? 'Restart' : 'Start'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-[10px] text-white/50 uppercase">Score</p>
          <p className="text-white font-bold text-base">{score}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-[10px] text-white/50 uppercase flex items-center justify-center gap-1">
            <FaHeart size={9} className="text-red-400" />
            Time
          </p>
          <p className={`font-bold text-base ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-[10px] text-white/50 uppercase flex items-center justify-center gap-1">
            <FaTrophy size={9} className="text-[#D4AF37]" />
            Best
          </p>
          <p className="text-[#D4AF37] font-bold text-base">{bestScore}</p>
        </div>
      </div>

      {/* Target */}
      {isPlaying && (
        <motion.div
          animate={feedback === 'wrong' ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="text-center mb-3 bg-white/5 rounded-xl p-3"
        >
          <p className="text-white/60 text-[10px] uppercase tracking-wider mb-1">Tap this color</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 shadow-lg" style={{ background: targetColor.hex }} />
            <p className="text-white font-bold text-sm">{targetColor.name}</p>
          </div>
          {feedback === 'correct' && (
            <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-green-400 text-xs mt-1">
              +1 ✅
            </motion.p>
          )}
          {feedback === 'wrong' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-1">
              -2s ❌
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2 aspect-square max-w-[280px] mx-auto">
        <AnimatePresence>
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-3 flex flex-col items-center justify-center aspect-square"
            >
              <p className="text-4xl mb-2">🏁</p>
              <p className="text-white font-bold text-lg mb-1">Time's Up!</p>
              <p className="text-white/60 text-sm mb-3">Score: {score}</p>
              <button
                onClick={startGame}
                className="bg-[#D4AF37] hover:bg-[#F59E0B] text-gray-900 font-semibold px-5 py-2 rounded-full text-sm transition-all active:scale-95"
              >
                Play Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-3 flex flex-col items-center justify-center aspect-square bg-white/5 rounded-xl"
            >
              <p className="text-5xl mb-3">🎨</p>
              <p className="text-white font-bold text-base mb-1">Tap the Color</p>
              <p className="text-white/50 text-xs mb-4 text-center px-4">
                Tap the color shown above. 30 seconds. How many can you get?
              </p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-gray-900 font-bold px-6 py-2.5 rounded-full text-sm transition-all active:scale-95 shadow-lg"
              >
                Start Game
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isPlaying && (
        <p className="text-center text-white/40 text-[10px] mt-3">
          ⚡ Correct: +1 | ❌ Wrong: -2 seconds
        </p>
      )}
    </div>
  );
};

export default TapTheColor;
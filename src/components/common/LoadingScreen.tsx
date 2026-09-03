// src/components/common/LoadingScreen.tsx
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-gradient-to-br from-[#0F766E] via-[#0F766E] to-[#065F46]"
    >
      <div className="text-center">
        
        {/* ==================================================
            🔥 NAYA LOGO + BRAND NAME
        ================================================== */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          {/* 🔥 NAYA LOGO IMAGE - with animation */}
          <motion.img
            src="https://res.cloudinary.com/kw3pdwrb/image/upload/v1787685509/logo_mhrzum.png"
            alt="MAHA ONE HYPERMARKET Logo"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
            className="w-48 sm:w-56 md:w-72 lg:w-80 mx-auto mb-6 drop-shadow-2xl"
          />
          
          {/* 🔥 TEXT VERSION - as fallback or additional detail */}
          <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold">
            <span className="text-[#D4AF37]">MAHA</span>
            <span className="text-white"> ONE</span>
          </div>
          <div className="text-[10px] sm:text-xs text-white/60 tracking-[0.3em] uppercase mt-1">
            HYPERMARKET
          </div>
        </motion.div>

        {/* ==================================================
            ANIMATED DOTS
        ================================================== */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                y: [0, -12, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-[#D4AF37] rounded-full shadow-lg shadow-[#D4AF37]/30"
            />
          ))}
        </div>

        {/* ==================================================
            LOADING TEXT
        ================================================== */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/70 text-sm mt-4 font-light tracking-wide"
        >
          Loading your experience...
        </motion.p>

        {/* ==================================================
            PROGRESS BAR
        ================================================== */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="mt-6 w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] rounded-full"
          />
        </motion.div>
        
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
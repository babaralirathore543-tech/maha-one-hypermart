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
            🔥 LOGO WITH MULTI-COLOR ROTATING CIRCLE
        ================================================== */}
        <div className="relative inline-block mb-6">
          
          {/* 🔥 MULTI-COLOR ROTATING CIRCLE */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 rounded-full"
            style={{
              border: '4px solid transparent',
              borderTop: '4px solid #D4AF37',      // Gold
              borderRight: '4px solid #F59E0B',     // Amber
              borderBottom: '4px solid #0F766E',    // Teal
              borderLeft: '4px solid #EC4899',      // Pink
              borderRadius: '50%',
              padding: '8px',
              boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)',
            }}
          />
          
          {/* 🔥 SECOND MULTI-COLOR CIRCLE (Opposite direction) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 rounded-full"
            style={{
              border: '3px solid transparent',
              borderTop: '3px solid #8B5CF6',      // Purple
              borderRight: '3px solid #3B82F6',     // Blue
              borderBottom: '3px solid #10B981',    // Green
              borderLeft: '3px solid #F43F5E',      // Rose
              borderRadius: '50%',
              padding: '14px',
              opacity: 0.7,
            }}
          />
          
          {/* 🔥 THIRD CIRCLE - Dotted */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px dotted rgba(212, 175, 55, 0.4)',
              borderRadius: '50%',
              padding: '20px',
            }}
          />
          
          {/* 🔥 LOGO IMAGE */}
          <motion.img
            src="https://res.cloudinary.com/kw3pdwrb/image/upload/v1787685509/logo_mhrzum.png"
            alt="MAHA ONE HYPERMARKET Logo"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
            className="w-32 sm:w-40 md:w-48 lg:w-56 mx-auto relative z-10 drop-shadow-2xl"
          />
          
        </div>
        
        {/* ==================================================
            BRAND NAME
        ================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
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
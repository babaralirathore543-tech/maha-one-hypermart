// src/components/common/LoadingScreen.tsx
import { motion, useReducedMotion } from 'framer-motion';

const LoadingScreen = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-gradient-to-br from-[#0F766E] via-[#0F766E] to-[#065F46]"
    >
      <div className="text-center px-4">

        {/* ==================================================
            LOGO + ROTATING CIRCLES
        ================================================== */}
        <div className="relative inline-block mb-5 sm:mb-6">
          {/* Outer ring — multi-color, opposite spin */}
          <motion.div
            animate={prefersReducedMotion ? undefined : { rotate: -360 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 rounded-full"
            style={{
              border: '3px solid transparent',
              borderTop: '3px solid #8B5CF6',
              borderRight: '3px solid #3B82F6',
              borderBottom: '3px solid #10B981',
              borderLeft: '3px solid #F43F5E',
              borderRadius: '50%',
              padding: '14px',
              opacity: 0.7,
            }}
          />

          {/* Dotted ring */}
          <motion.div
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px dotted rgba(212, 175, 55, 0.4)',
              borderRadius: '50%',
              padding: '20px',
            }}
          />

          {/* Primary ring — gold/amber/teal/pink */}
          <motion.div
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 rounded-full"
            style={{
              border: '4px solid transparent',
              borderTop: '4px solid #D4AF37',
              borderRight: '4px solid #F59E0B',
              borderBottom: '4px solid #0F766E',
              borderLeft: '4px solid #EC4899',
              borderRadius: '50%',
              padding: '8px',
              boxShadow: '0 0 40px rgba(212, 175, 55, 0.35)',
            }}
          />

          {/* Logo */}
          <motion.img
            src="https://res.cloudinary.com/kw3pdwrb/image/upload/v1787685509/logo_mhrzum.png"
            alt="MAHA ONE HYPERMARKET"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              type: 'spring',
              stiffness: 120,
            }}
            className="w-28 sm:w-36 md:w-44 lg:w-52 mx-auto relative z-10 drop-shadow-2xl"
          />
        </div>

        {/* ==================================================
            BRAND NAME
        ================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
            <span className="text-[#D4AF37]">MAHA</span>
            <span className="text-white"> ONE</span>
          </div>
          <div className="text-[9px] sm:text-[10px] md:text-xs text-white/60 tracking-[0.3em] uppercase mt-1">
            HYPERMARKET
          </div>
        </motion.div>

        {/* ==================================================
            ANIMATED DOTS
        ================================================== */}
        {!prefersReducedMotion && (
          <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [0.6, 1, 0.6],
                  y: [0, -8, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#D4AF37] rounded-full shadow-lg shadow-[#D4AF37]/40"
              />
            ))}
          </div>
        )}

        {/* ==================================================
            LOADING TEXT
        ================================================== */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="text-white/70 text-xs sm:text-sm mt-4 font-light tracking-wide"
        >
          Loading your experience...
        </motion.p>

        {/* ==================================================
            PROGRESS BAR
        ================================================== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mt-5 sm:mt-6 w-40 sm:w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            className="w-full h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] rounded-full"
          />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default LoadingScreen;
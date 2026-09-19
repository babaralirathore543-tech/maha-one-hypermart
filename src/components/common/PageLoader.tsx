// src/components/common/PageLoader.tsx
import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto"
        />
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
// src/components/common/PageLoader.tsx
import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto"
        />
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
// src/components/seller/store-builder/StoreBuilderCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StoreBuilderCard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/seller/store-builder');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        relative overflow-hidden
        rounded-2xl
        bg-gradient-to-br from-[#0F766E] via-[#0F766E] to-[#065F46]
        p-5 sm:p-6
        text-white
        shadow-xl
        w-full
      "
    >
      {/* Decorative blur circle */}
      <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 pointer-events-none" />

      {/* Content */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left — Text */}
        <div className="flex-1 min-w-0">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-2">
            <Sparkles
              className="text-[#D4AF37] shrink-0"
              size={20}
            />
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
              AI Store Builder
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 leading-tight">
            Build Your Store with AI ✨
          </h2>

          {/* Subtitle */}
          <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
            Create a professional online store in less than a minute.
          </p>
        </div>

        {/* Right — CTA Button */}
        <button
          type="button"
          onClick={handleClick}
          className="
            group
            flex items-center justify-center gap-2
            w-full sm:w-auto
            bg-[#D4AF37] hover:bg-[#C5A338]
            text-gray-900
            px-5 sm:px-6 py-3
            rounded-xl
            font-semibold
            text-sm sm:text-base
            transition-all
            whitespace-nowrap
            shrink-0
            active:scale-95
            shadow-md hover:shadow-lg
          "
          aria-label="Create my store"
        >
          <Store size={16} className="sm:hidden" />
          <span>Create My Store</span>
          <ArrowRight
            size={16}
            className="hidden sm:inline group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </motion.div>
  );
};

export default StoreBuilderCard;
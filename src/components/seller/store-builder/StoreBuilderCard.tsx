// src/components/seller/store-builder/StoreBuilderCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StoreBuilderCard = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F766E] via-[#0F766E] to-[#065F46] p-6 text-white shadow-xl"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-[#D4AF37]" size={22} />
            <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
              AI Store Builder
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Build Your Store with AI ✨</h2>
          <p className="text-teal-100 text-sm">
            Create a professional online store in less than a minute.
          </p>
        </div>

        <button
          onClick={() => navigate('/seller/store-builder')}
          className="group flex items-center gap-2 bg-[#D4AF37] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-[#C5A338] transition-all whitespace-nowrap"
        >
          Create My Store
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default StoreBuilderCard;
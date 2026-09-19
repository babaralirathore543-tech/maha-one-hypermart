// src/components/pages/admin/AdminCategorySelector.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, ChevronRight } from 'lucide-react';
import { categoryConfigs } from '../../../config/productConfig';

const AdminCategorySelector: React.FC = () => {
  const navigate = useNavigate();

  const handleSelect = (categoryId: string) => {
    navigate(`/admin/products/add/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0F766E] transition mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </motion.button>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0F766E]/10 to-[#D4AF37]/10 border border-[#0F766E]/20 mb-4">
            <Sparkles size={14} className="text-[#D4AF37]" />
            <span className="text-xs font-bold tracking-wide text-[#0F766E] uppercase">
              Admin Mode
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3">
            Add New Product
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto">
            Choose a category to continue. Your product will go live immediately.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {categoryConfigs.map((category, index) => {
            const Icon = category.iconComponent;

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(category.id)}
                className="
                  group relative
                  bg-white rounded-2xl
                  border border-gray-100
                  hover:border-transparent
                  shadow-sm hover:shadow-2xl
                  overflow-hidden
                  transition-all duration-300
                  text-left
                "
              >
                {/* Gradient overlay */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-br ${category.gradient}
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                  `}
                />

                {/* Content */}
                <div className="relative z-10 p-4 sm:p-6">
                  <div
                    className={`
                      w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16
                      rounded-2xl
                      bg-gradient-to-br ${category.gradient}
                      group-hover:bg-white/20 group-hover:backdrop-blur-sm
                      flex items-center justify-center
                      mb-3 sm:mb-4
                      shadow-lg group-hover:shadow-none
                      transition-all duration-300
                    `}
                  >
                    <Icon
                      size={28}
                      className="text-white group-hover:scale-110 transition-transform duration-300"
                      strokeWidth={1.8}
                    />
                  </div>

                  <h3 className="
                    font-bold text-sm sm:text-base lg:text-lg
                    text-gray-900 group-hover:text-white
                    mb-1 transition-colors duration-300
                    leading-tight
                  ">
                    {category.name}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-white/80 transition-colors duration-300">
                    <span>Add product</span>
                    <ChevronRight
                      size={12}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Corner decoration */}
                <div
                  className={`
                    absolute -bottom-6 -right-6
                    w-20 h-20 rounded-full
                    bg-gradient-to-br ${category.gradient}
                    opacity-10 group-hover:opacity-20
                    transition-opacity duration-300
                  `}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 sm:mt-12 text-center"
        >
          <p className="text-xs text-gray-400">
            💡 Products added by admin go live immediately without approval
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminCategorySelector;
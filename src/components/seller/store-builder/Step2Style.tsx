// src/components/seller/store-builder/Step2Style.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { WizardData, StoreStyle } from './StoreBuilderWizard';

interface Props {
  data: WizardData;
  onNext: (d: Partial<WizardData>) => void;
  onBack: () => void;
}

// ============================================================
// STYLES — component ke bahar define karo (re-render pe re-create na ho)
// ============================================================
const STYLES: Array<{
  id: StoreStyle;
  label: string;
  desc: string;
  emoji: string;
}> = [
  {
    id: 'luxury',
    label: 'Luxury',
    desc: 'Rich, elegant, premium feel',
    emoji: '👑',
  },
  {
    id: 'modern',
    label: 'Modern',
    desc: 'Clean, trendy, bold',
    emoji: '✨',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    desc: 'Simple, whitespace, focused',
    emoji: '⚪',
  },
  {
    id: 'traditional',
    label: 'Traditional',
    desc: 'Cultural, warm, classic',
    emoji: '🏛️',
  },
];

const Step2Style = ({ data, onNext, onBack }: Props) => {
  const [style, setStyle] = useState<StoreStyle>(data.style);
  const [preferredColors, setPreferredColors] = useState(
    data.preferredColors || ''
  );
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!style) {
      setError('Please select a style');
      return;
    }
    setError('');
    onNext({ style, preferredColors: preferredColors.trim() });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8"
    >
      {/* Header */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
        Choose Your Style
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-5 sm:mb-6">
        How should your store look and feel?
      </p>

      {/* Style Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
        {STYLES.map((s) => {
          const isSelected = style === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setStyle(s.id);
                setError('');
              }}
              className={`
                relative text-left p-4 sm:p-5 rounded-xl
                border-2 transition-all duration-200
                active:scale-[0.98]
                ${
                  isSelected
                    ? 'border-[#0F766E] bg-[#0F766E]/5 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {/* Selected Check */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-[#0F766E] rounded-full flex items-center justify-center shadow-md">
                  <Check size={14} className="text-white" strokeWidth={3} />
                </div>
              )}

              {/* Emoji */}
              <div className="text-3xl sm:text-4xl mb-2">{s.emoji}</div>

              {/* Label */}
              <p
                className={`font-semibold text-sm sm:text-base ${
                  isSelected ? 'text-[#0F766E]' : 'text-gray-800'
                }`}
              >
                {s.label}
              </p>

              {/* Desc */}
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {s.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 mb-4 -mt-2">{error}</p>
      )}

      {/* Preferred Colors */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Preferred colors (optional)
        </label>
        <input
          type="text"
          value={preferredColors}
          onChange={(e) => setPreferredColors(e.target.value)}
          placeholder="e.g. black and gold, pastel pink"
          maxLength={100}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none transition"
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-[10px] sm:text-xs text-gray-400">
            AI will decide based on your style if left blank
          </p>
          <span className="text-[10px] sm:text-xs text-gray-400">
            {preferredColors.length}/100
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 sm:gap-3 mt-6 sm:mt-8">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-5 sm:px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base active:scale-95"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="w-full sm:w-auto bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all text-sm sm:text-base active:scale-95"
        >
          Next →
        </button>
      </div>
    </motion.div>
  );
};

export default Step2Style;
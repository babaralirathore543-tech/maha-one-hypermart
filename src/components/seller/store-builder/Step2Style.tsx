// src/components/seller/store-builder/Step2Style.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WizardData } from './StoreBuilderWizard';
import { Check } from 'lucide-react';

interface Props {
  data: WizardData;
  onNext: (d: Partial<WizardData>) => void;
  onBack: () => void;                    // ✅ yeh zaroori hai
}

const STYLES = [
  { id: 'luxury', label: 'Luxury', desc: 'Rich, elegant, premium feel', emoji: '👑' },
  { id: 'modern', label: 'Modern', desc: 'Clean, trendy, bold', emoji: '✨' },
  { id: 'minimal', label: 'Minimal', desc: 'Simple, whitespace, focused', emoji: '⚪' },
  { id: 'traditional', label: 'Traditional', desc: 'Cultural, warm, classic', emoji: '🏛️' },
] as const;

const Step2Style = ({ data, onNext, onBack }: Props) => {   // ✅ onBack destructure
  const [style, setStyle] = useState<WizardData['style']>(data.style);
  const [preferredColors, setPreferredColors] = useState(data.preferredColors || '');

  const handleNext = () => {
    onNext({ style, preferredColors });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Style</h2>
      <p className="text-gray-500 mb-6">How should your store look and feel?</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStyle(s.id)}
            className={`relative text-left p-5 rounded-xl border-2 transition-all ${
              style === s.id
                ? 'border-[#0F766E] bg-[#0F766E]/5 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {style === s.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-[#0F766E] rounded-full flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            )}
            <div className="text-3xl mb-2">{s.emoji}</div>
            <p className="font-semibold text-gray-800">{s.label}</p>
            <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred colors (optional)
        </label>
        <input
          type="text"
          value={preferredColors}
          onChange={(e) => setPreferredColors(e.target.value)}
          placeholder="e.g. black and gold, pastel pink"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent"
        />
        <p className="text-xs text-gray-400 mt-1">
          AI will decide based on your style if left blank
        </p>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          className="bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Next →
        </button>
      </div>
    </motion.div>
  );
};

export default Step2Style;
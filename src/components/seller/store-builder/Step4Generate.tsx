// src/components/seller/store-builder/Step4Generate.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Store, Palette, FileText, Hash } from 'lucide-react';
import { WizardData, STORE_STYLES } from './StoreBuilderWizard';

interface Props {
  data: WizardData;
  loading: boolean;
  onGenerate: () => void;
  onBack: () => void;
}

// ============================================================
// STYLE LABELS — display ke liye
// ============================================================
const STYLE_LABELS: Record<string, string> = {
  luxury: '👑 Luxury',
  modern: '✨ Modern',
  minimal: '⚪ Minimal',
  traditional: '🏛️ Traditional',
};

const Step4Generate = ({ data, loading, onGenerate, onBack }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 text-center"
    >
      {/* Sparkles Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#0F766E] to-[#065F46] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
        <Sparkles className="text-[#D4AF37]" size={36} />
      </div>

      {/* Heading */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
        Ready to Generate ✨
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-5 sm:mb-6 px-2">
        AI will create a professional store design for{' '}
        <strong className="text-gray-800 break-words">
          {data.storeName}
        </strong>
      </p>

      {/* Summary Box */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-5 mb-5 sm:mb-6 text-left max-w-md mx-auto space-y-3">
        {/* Store Name */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#0F766E]/10 rounded-lg flex items-center justify-center shrink-0">
            <Store size={16} className="text-[#0F766E]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
              Store Name
            </p>
            <p className="text-sm font-semibold text-gray-800 break-words">
              {data.storeName || '—'}
            </p>
          </div>
        </div>

        {/* Business Type */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#0F766E]/10 rounded-lg flex items-center justify-center shrink-0">
            <FileText size={16} className="text-[#0F766E]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
              Business Type
            </p>
            <p className="text-sm font-semibold text-gray-800 break-words">
              {data.businessType || '—'}
            </p>
          </div>
        </div>

        {/* Style */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#0F766E]/10 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-[#0F766E]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
              Style
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {STYLE_LABELS[data.style] || data.style || '—'}
            </p>
          </div>
        </div>

        {/* Preferred Colors (conditional) */}
        {data.preferredColors && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#0F766E]/10 rounded-lg flex items-center justify-center shrink-0">
              <Palette size={16} className="text-[#0F766E]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                Colors
              </p>
              <p className="text-sm font-semibold text-gray-800 break-words">
                {data.preferredColors}
              </p>
            </div>
          </div>
        )}

        {/* Logo (conditional) */}
        {data.logo && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#0F766E]/10 rounded-lg flex items-center justify-center shrink-0">
              <Hash size={16} className="text-[#0F766E]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                Logo
              </p>
              <div className="flex items-center gap-2 mt-1">
                <img
                  src={data.logo}
                  alt="Logo"
                  className="w-10 h-10 object-contain rounded-lg border border-gray-200 bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="text-xs text-green-600 font-medium">
                  ✓ Uploaded
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg p-3 mb-5 sm:mb-6 max-w-md mx-auto">
        <p className="text-xs sm:text-sm text-gray-700">
          ⚡ <strong>AI will take 10-30 seconds</strong> to generate your store
          design. Please don't close this page.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="w-full sm:w-auto px-5 sm:px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base active:scale-95"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Creating your store...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Store
            </>
          )}
        </button>
      </div>

      {/* Loading Overlay Message */}
      {loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs sm:text-sm text-[#0F766E] font-medium mt-4"
        >
          🎨 AI is designing your store... please wait
        </motion.p>
      )}
    </motion.div>
  );
};

export default Step4Generate;
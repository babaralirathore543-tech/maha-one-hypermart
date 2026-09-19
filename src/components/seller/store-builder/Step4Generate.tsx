// src/components/seller/store-builder/Step4Generate.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { WizardData } from './StoreBuilderWizard';
import { Sparkles, Loader2 } from 'lucide-react';

interface Props {
  data: WizardData;
  loading: boolean;
  onGenerate: () => void;
  onBack: () => void;
}

const Step4Generate = ({ data, loading, onGenerate, onBack }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-lg p-8 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-[#0F766E] to-[#065F46] rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles className="text-[#D4AF37]" size={40} />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Generate ✨</h2>
      <p className="text-gray-500 mb-6">
        AI will create a professional store design for <strong>{data.storeName}</strong>
      </p>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left max-w-md mx-auto space-y-2 text-sm">
        <p><span className="text-gray-500">Store:</span> <strong>{data.storeName}</strong></p>
        <p><span className="text-gray-500">Business:</span> {data.businessType}</p>
        <p><span className="text-gray-500">Style:</span> {data.style}</p>
        {data.preferredColors && (
          <p><span className="text-gray-500">Colors:</span> {data.preferredColors}</p>
        )}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          onClick={onGenerate}
          disabled={loading}
          className="bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
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
    </motion.div>
  );
};

export default Step4Generate;
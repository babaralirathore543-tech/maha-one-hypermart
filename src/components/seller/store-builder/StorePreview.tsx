// src/components/seller/store-builder/StorePreview.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StoreConfigOutput } from '../../../services/aiStoreBuilder';
import { WizardData } from './StoreBuilderWizard';
import { Monitor, Smartphone, Rocket, RefreshCw, Edit3 } from 'lucide-react';

interface Props {
  config: StoreConfigOutput;
  data: WizardData;
  loading: boolean;
  onEdit: (feedback: string) => void;
  onRegenerate: () => void;
  onPublish: () => void;
  onBack: () => void;
}

const StorePreview = ({
  config,
  data,
  loading,
  onEdit,
  onRegenerate,
  onPublish,
  onBack,
}: Props) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [feedback, setFeedback] = useState('');
  const [showEdit, setShowEdit] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Your Store is Ready 🎉</h2>
        <p className="text-gray-500 mt-1">Review karo, edit karo, phir publish karo</p>
      </div>

      {/* Device toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setDevice('desktop')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            device === 'desktop' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-600'
          }`}
        >
          <Monitor size={16} /> Desktop
        </button>
        <button
          onClick={() => setDevice('mobile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            device === 'mobile' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-600'
          }`}
        >
          <Smartphone size={16} /> Mobile
        </button>
      </div>

      {/* Preview */}
      <div className="flex justify-center">
        <div
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all ${
            device === 'mobile' ? 'w-[375px]' : 'w-full max-w-4xl'
          }`}
        >
          {/* Dynamic Preview */}
          <div style={{ background: config.colors.background }}>
            <div
              className="p-8 text-center"
              style={{
                background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})`,
              }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">{config.hero.heading}</h1>
              <p className="text-white/80">{config.hero.subtitle}</p>
              <p className="text-white/60 text-sm mt-3 italic">"{config.tagline}"</p>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-500 mb-3">Sections:</p>
              <div className="flex flex-wrap gap-2">
                {config.sections.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 text-xs rounded-full"
                    style={{
                      background: config.colors.primary + '20',
                      color: config.colors.primary,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">About:</p>
                <p className="text-sm text-gray-700">{config.about}</p>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">SEO Title:</p>
                <p className="text-sm text-gray-700">{config.seo.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit with AI */}
      {showEdit && (
        <div className="bg-white rounded-xl shadow-lg p-4 max-w-2xl mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kya change karna hai? AI ko batao:
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="e.g. Make it more luxurious and use black & gold"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E]"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setShowEdit(false)}
              className="px-4 py-2 text-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onEdit(feedback);
                setShowEdit(false);
                setFeedback('');
              }}
              disabled={loading || !feedback.trim()}
              className="bg-[#0F766E] text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Apply Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-5 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          onClick={() => setShowEdit(!showEdit)}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-3 border border-[#0F766E] text-[#0F766E] rounded-lg font-medium hover:bg-[#0F766E]/5 disabled:opacity-50"
        >
          <Edit3 size={16} /> Edit with AI
        </button>
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Regenerate
        </button>
        <button
          onClick={onPublish}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50"
        >
          <Rocket size={16} /> Publish Store
        </button>
      </div>
    </motion.div>
  );
};

export default StorePreview;
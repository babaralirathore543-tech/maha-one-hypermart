// src/components/seller/store-builder/StorePreview.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  Smartphone,
  Rocket,
  RefreshCw,
  Edit3,
  Loader2,
} from 'lucide-react';
import { StoreConfigOutput } from '../../../services/aiStoreBuilder';
import { WizardData } from './StoreBuilderWizard';

interface Props {
  config: StoreConfigOutput;
  data: WizardData;
  loading: boolean;
  onEdit: (feedback: string) => void;
  onRegenerate: () => void;
  onPublish: () => void;
  onBack: () => void;
}

// ============================================================
// ✅ Safe helpers — config missing ho to crash na ho
// ============================================================
const safeColors = (config: any) => ({
  primary: config?.colors?.primary || '#0F766E',
  secondary: config?.colors?.secondary || '#D4AF37',
  background: config?.colors?.background || '#FFFDF7',
});

const safeHero = (config: any) => ({
  heading: config?.hero?.heading || 'Welcome to Our Store',
  subtitle: config?.hero?.subtitle || 'Discover our premium collection',
});

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

  // ✅ Safe extraction
  const colors = safeColors(config);
  const hero = safeHero(config);
  const sections = Array.isArray(config?.sections) ? config.sections : [];
  const tagline = config?.tagline || '';
  const about = config?.about || '';
  const seoTitle = config?.seo?.title || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Your Store is Ready 🎉
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Review karo, edit karo, phir publish karo
        </p>
      </div>

      {/* Device toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setDevice('desktop')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
            device === 'desktop'
              ? 'bg-[#0F766E] text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Monitor size={16} /> Desktop
        </button>
        <button
          onClick={() => setDevice('mobile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
            device === 'mobile'
              ? 'bg-[#0F766E] text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Smartphone size={16} /> Mobile
        </button>
      </div>

      {/* Preview */}
      <div className="flex justify-center">
        <div
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all ${
            device === 'mobile' ? 'w-[320px] sm:w-[375px]' : 'w-full max-w-4xl'
          }`}
        >
          {/* Dynamic Preview */}
          <div style={{ background: colors.background }}>
            {/* Hero */}
            <div
              className="p-6 sm:p-8 text-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              <h1 className="text-xl sm:text-3xl font-bold text-white mb-2 break-words">
                {hero.heading}
              </h1>
              <p className="text-sm sm:text-base text-white/80 break-words">
                {hero.subtitle}
              </p>
              {tagline && (
                <p className="text-xs sm:text-sm text-white/60 mt-3 italic break-words">
                  "{tagline}"
                </p>
              )}
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Sections */}
              {sections.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-3">Sections:</p>
                  <div className="flex flex-wrap gap-2">
                    {sections.map((s, idx) => (
                      <span
                        key={`${s}-${idx}`}
                        className="px-3 py-1 text-xs rounded-full"
                        style={{
                          background: colors.primary + '20',
                          color: colors.primary,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* About */}
              {about && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">About:</p>
                  <p className="text-sm text-gray-700 break-words">{about}</p>
                </div>
              )}

              {/* SEO */}
              {seoTitle && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">SEO Title:</p>
                  <p className="text-sm text-gray-700 break-words">
                    {seoTitle}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit with AI */}
      {showEdit && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 max-w-2xl mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kya change karna hai? AI ko batao:
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="e.g. Make it more luxurious and use black & gold"
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none resize-y"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => {
                setShowEdit(false);
                setFeedback('');
              }}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm transition"
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
              className="bg-[#0F766E] text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-[#065F46] transition text-sm active:scale-95"
            >
              {loading ? 'Updating...' : 'Apply Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-4 sm:px-5 py-2.5 sm:py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 text-sm transition active:scale-95"
        >
          ← Back
        </button>
        <button
          onClick={() => setShowEdit(!showEdit)}
          disabled={loading}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 border border-[#0F766E] text-[#0F766E] rounded-lg font-medium hover:bg-[#0F766E]/5 disabled:opacity-50 text-sm transition active:scale-95"
        >
          <Edit3 size={16} /> Edit with AI
        </button>
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 text-sm transition active:scale-95"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Regenerate
        </button>
        <button
          onClick={onPublish}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 text-sm transition active:scale-95"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Rocket size={16} />
          )}
          Publish Store
        </button>
      </div>
    </motion.div>
  );
};

export default StorePreview;
// src/components/seller/store-builder/StoreBuilderWizard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../context/AuthContext';
import {
  generateStoreConfig,
  slugify,
  StoreConfigOutput,
} from '../../../services/aiStoreBuilder';

import Step1BasicInfo from './Step1BasicInfo';
import Step2Style from './Step2Style';
import Step3LogoUpload from './Step3LogoUpload';
import Step4Generate from './Step4Generate';
import StorePreview from './StorePreview';

// ============================================================
// ✅ Type-safe store style
// ============================================================
export const STORE_STYLES = [
  'luxury',
  'modern',
  'minimal',
  'traditional',
] as const;

export type StoreStyle = (typeof STORE_STYLES)[number];

export interface WizardData {
  storeName: string;
  businessType: string;
  description: string;
  style: StoreStyle;
  preferredColors: string;
  logo: string | null;
}

// ============================================================
// PROGRESS STEPS
// ============================================================
const PROGRESS_STEPS = [
  { num: 1, label: 'Basic' },
  { num: 2, label: 'Style' },
  { num: 3, label: 'Logo' },
  { num: 4, label: 'Generate' },
  { num: 5, label: 'Preview' },
];

const StoreBuilderWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<StoreConfigOutput | null>(null);

  const [data, setData] = useState<WizardData>({
    storeName: '',
    businessType: '',
    description: '',
    style: 'modern',
    preferredColors: '',
    logo: null,
  });

  const updateData = (partial: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  // ============================================================
  // ✅ GENERATE — Firestore save PEHLE, phir setConfig
  // ============================================================
  const handleGenerate = async (feedback?: string) => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    if (!data.storeName || !data.businessType || !data.description) {
      toast.error('Please fill all required fields first');
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      const input = {
        storeName: data.storeName,
        businessType: data.businessType,
        description: feedback
          ? `${data.description}. Additional feedback: ${feedback}`
          : data.description,
        style: data.style,
        preferredColors: data.preferredColors,
      };

      if (import.meta.env.DEV) {
        console.log('🎨 Generating store config...', input);
      }

      const result = await generateStoreConfig(input);

      if (import.meta.env.DEV) {
        console.log('✅ AI Result:', result);
      }

      // ✅ Step 1: Firestore mein save karo (SIRF stores collection)
      const slug = slugify(data.storeName);

      await setDoc(
        doc(db, 'stores', user.uid),
        {
          sellerId: user.uid,
          slug,
          storeName: data.storeName,
          businessType: data.businessType,
          description: data.description,
          theme: result.theme,
          colors: result.colors,
          hero: result.hero,
          tagline: result.tagline,
          sections: result.sections,
          about: result.about,
          seo: result.seo,
          logo: data.logo,
          status: 'draft',
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      // ✅ Step 2: Firestore save SUCCESS — ab state update karo
      setConfig(result);
      setStep(5);

      toast.success('🎨 Store design generated!');
    } catch (error: any) {
      console.error('❌ AI generation failed:', error);
      // ✅ State clean rahe — config set nahi hui
      toast.error(
        '❌ AI generation failed: ' + (error.message || 'Unknown error')
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ✅ PUBLISH — navigate use karo, window.location nahi
  // ============================================================
  const handlePublish = async () => {
    if (!user || !config) return;

    setLoading(true);
    try {
      const slug = slugify(data.storeName);

      await setDoc(
        doc(db, 'stores', user.uid),
        {
          status: 'published',
          publishedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success('🎉 Store published successfully!');

      // ✅ Small delay for toast to show
      setTimeout(() => {
        navigate(`/store/${slug}`);
      }, 800);
    } catch (error: any) {
      console.error('❌ Publish failed:', error);
      toast.error('❌ Publish failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          ✨ AI Store Builder
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-2">
          Create your professional store in less than a minute
        </p>
      </div>

      {/* ✅ Progress Indicator — 5 steps */}
      <div className="mb-6 sm:mb-8 flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto">
        {PROGRESS_STEPS.map((s, idx) => (
          <div key={s.num} className="flex items-center shrink-0">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 sm:w-10 sm:h-10
                  rounded-full flex items-center justify-center
                  font-semibold text-xs sm:text-sm
                  transition-all
                  ${
                    step >= s.num
                      ? 'bg-[#0F766E] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="text-[10px] sm:text-xs text-gray-500 mt-1">
                {s.label}
              </span>
            </div>
            {idx < PROGRESS_STEPS.length - 1 && (
              <div
                className={`
                  w-6 sm:w-12 h-0.5 mx-1 sm:mx-2
                  transition-all
                  ${step > s.num ? 'bg-[#0F766E]' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <Step1BasicInfo
            key="step1"
            data={data}
            onNext={(d) => {
              updateData(d);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <Step2Style
            key="step2"
            data={data}
            onBack={() => setStep(1)}
            onNext={(d) => {
              updateData(d);
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <Step3LogoUpload
            key="step3"
            data={data}
            onBack={() => setStep(2)}
            onNext={(d) => {
              updateData(d);
              setStep(4);
            }}
          />
        )}

        {step === 4 && (
          <Step4Generate
            key="step4"
            data={data}
            loading={loading}
            onBack={() => setStep(3)}
            onGenerate={() => handleGenerate()}
          />
        )}

        {step === 5 && config && (
          <StorePreview
            key="preview"
            config={config}
            data={data}
            loading={loading}
            onEdit={(feedback) => handleGenerate(feedback)}
            onRegenerate={() => handleGenerate()}
            onPublish={handlePublish}
            onBack={() => setStep(4)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoreBuilderWizard;
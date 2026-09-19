// src/components/seller/store-builder/StoreBuilderWizard.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
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

// ✅ WizardData export — baaki step files isko import karti hain
export interface WizardData {
  storeName: string;
  businessType: string;
  description: string;
  style: 'luxury' | 'modern' | 'minimal' | 'traditional';
  preferredColors: string;
  logo: string | null;
}

const StoreBuilderWizard = () => {
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

  // ✅ AI Generate
  const handleGenerate = async (feedback?: string) => {
    if (!user) {
      alert('Please login first');
      return;
    }
    if (!data.storeName || !data.businessType || !data.description) {
      alert('Please fill all required fields first');
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

      console.log('🎨 Generating store config...', input);

      const result = await generateStoreConfig(input);
      console.log('✅ AI Result:', result);
      setConfig(result);

      // ✅ Save to Firestore (draft)
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

      // ✅ Also update sellers collection
      await setDoc(
        doc(db, 'sellers', user.uid),
        {
          storeConfig: {
            slug,
            ...result,
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      console.log('✅ Store saved to Firestore');
      setStep(5); // preview
    } catch (error: any) {
      console.error('❌ AI generation failed:', error);
      alert('❌ AI generation failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Publish
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

      alert('🎉 Store published successfully!');
      window.location.href = `/store/${slug}`;
    } catch (error: any) {
      console.error('❌ Publish failed:', error);
      alert('❌ Publish failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          ✨ AI Store Builder
        </h1>
        <p className="text-gray-500 mt-2">
          Create your professional store in less than a minute
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= s
                  ? 'bg-[#0F766E] text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > s ? '✓' : s}
            </div>
            {s < 4 && (
              <div
                className={`w-16 h-1 mx-1 transition-all ${
                  step > s ? 'bg-[#0F766E]' : 'bg-gray-200'
                }`}
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
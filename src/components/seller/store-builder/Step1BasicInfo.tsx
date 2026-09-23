// src/components/seller/store-builder/Step1BasicInfo.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WizardData } from './StoreBuilderWizard';

interface Props {
  data: WizardData;
  onNext: (d: Partial<WizardData>) => void;
}

const Step1BasicInfo = ({ data, onNext }: Props) => {
  const [form, setForm] = useState({
    storeName: data.storeName,
    businessType: data.businessType,
    description: data.description,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================================
  // ✅ STRONG VALIDATION
  // ============================================================
  const validate = () => {
    const e: Record<string, string> = {};

    // Store Name
    const storeName = form.storeName.trim();
    if (!storeName) {
      e.storeName = 'Store name required';
    } else if (storeName.length < 3) {
      e.storeName = 'Store name must be at least 3 characters';
    } else if (storeName.length > 50) {
      e.storeName = 'Store name must be less than 50 characters';
    }

    // Business Type
    const businessType = form.businessType.trim();
    if (!businessType) {
      e.businessType = 'Business type required';
    } else if (businessType.length < 3) {
      e.businessType = 'Please be more specific (min 3 characters)';
    } else if (businessType.length > 100) {
      e.businessType = 'Business type must be less than 100 characters';
    }

    // Description
    const description = form.description.trim();
    if (!description) {
      e.description = 'Description required';
    } else if (description.length < 20) {
      e.description = `Please write at least 20 characters (${description.length}/20)`;
    } else if (description.length > 500) {
      e.description = `Description must be less than 500 characters (${description.length}/500)`;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({
        storeName: form.storeName.trim(),
        businessType: form.businessType.trim(),
        description: form.description.trim(),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
        Basic Information
      </h2>
      <p className="text-sm text-gray-500 mb-6">Tell us about your store</p>

      <div className="space-y-4">
        {/* Store Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store Name *
          </label>
          <input
            type="text"
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            placeholder="e.g. Noor Fashion"
            maxLength={50}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition ${
              errors.storeName ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.storeName ? (
              <p className="text-xs text-red-500">{errors.storeName}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400">
              {form.storeName.length}/50
            </span>
          </div>
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What do you sell? *
          </label>
          <input
            type="text"
            value={form.businessType}
            onChange={(e) =>
              setForm({ ...form, businessType: e.target.value })
            }
            placeholder="e.g. Women's Pakistani Fashion"
            maxLength={100}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition ${
              errors.businessType ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.businessType ? (
              <p className="text-xs text-red-500">{errors.businessType}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400">
              {form.businessType.length}/100
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Describe your store *
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={4}
            maxLength={500}
            placeholder="e.g. Premium embroidered dresses for women"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition resize-y ${
              errors.description ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-xs text-red-500">{errors.description}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400">
              {form.description.length}/500
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          className="bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all text-sm sm:text-base active:scale-95"
        >
          Next →
        </button>
      </div>
    </motion.div>
  );
};

export default Step1BasicInfo;
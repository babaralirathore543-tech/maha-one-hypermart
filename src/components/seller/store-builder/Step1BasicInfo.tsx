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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.storeName.trim()) e.storeName = 'Store name required';
    if (!form.businessType.trim()) e.businessType = 'Business type required';
    if (!form.description.trim()) e.description = 'Description required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
      <p className="text-gray-500 mb-6">Tell us about your store</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store Name *
          </label>
          <input
            type="text"
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            placeholder="e.g. Noor Fashion"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent ${
              errors.storeName ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.storeName && (
            <p className="text-xs text-red-500 mt-1">{errors.storeName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What do you sell? *
          </label>
          <input
            type="text"
            value={form.businessType}
            onChange={(e) => setForm({ ...form, businessType: e.target.value })}
            placeholder="e.g. Women's Pakistani Fashion"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent ${
              errors.businessType ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.businessType && (
            <p className="text-xs text-red-500 mt-1">{errors.businessType}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Describe your store *
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="e.g. Premium embroidered dresses for women"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent ${
              errors.description ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-8">
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

export default Step1BasicInfo;
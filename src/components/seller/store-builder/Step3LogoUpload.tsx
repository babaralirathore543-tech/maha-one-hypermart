// src/components/seller/store-builder/Step3LogoUpload.tsx
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { WizardData } from './StoreBuilderWizard';
import { Upload, X } from 'lucide-react';

interface Props {
  data: WizardData;
  onNext: (d: Partial<WizardData>) => void;
  onBack: () => void;
}

const Step3LogoUpload = ({ data, onNext, onBack }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<string | null>(data.logo);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo 2MB se chota hona chahiye');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Logo</h2>
      <p className="text-gray-500 mb-6">Optional — skip karo agar nahi hai</p>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6">
        {logo ? (
          <div className="relative">
            <img src={logo} alt="Logo" className="w-32 h-32 object-contain rounded-lg" />
            <button
              onClick={() => setLogo(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <Upload className="text-gray-400 mb-2" size={48} />
            <p className="text-gray-500 mb-3">Click to upload or drag and drop</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="bg-[#0F766E] text-white px-6 py-2 rounded-lg hover:bg-[#065F46]"
            >
              Select File
            </button>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
        >
          ← Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onNext({ logo: null })}
            className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium"
          >
            Skip
          </button>
          <button
            onClick={() => onNext({ logo })}
            className="bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg"
          >
            Next →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step3LogoUpload;
// src/components/seller/store-builder/Step3LogoUpload.tsx
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { WizardData } from './StoreBuilderWizard';

// ============================================================
// CLOUDINARY CONFIG — apni values daalo
// ============================================================
const CLOUDINARY_CLOUD_NAME = 'kw3pdwrb';
const CLOUDINARY_UPLOAD_PRESET = 'maha-one-unsigned'; // apna preset

interface Props {
  data: WizardData;
  onNext: (d: Partial<WizardData>) => void;
  onBack: () => void;
}

const Step3LogoUpload = ({ data, onNext, onBack }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<string | null>(data.logo);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // ============================================================
  // ✅ Cloudinary upload — base64 nahi
  // ============================================================
  const uploadToCloudinary = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo must be less than 2MB');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'maha-one/store-logos');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const result = await res.json();
      setLogo(result.secure_url);
      toast.success('Logo uploaded!');
    } catch (error: any) {
      console.error('Logo upload error:', error);
      toast.error('Failed to upload logo. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadToCloudinary(file);
    // Reset input so same file can be selected again
    if (fileRef.current) fileRef.current.value = '';
  };

  // ============================================================
  // ✅ Drag & Drop handlers
  // ============================================================
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) uploadToCloudinary(file);
  };

  const handleRemove = () => {
    setLogo(null);
    toast.success('Logo removed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
        Upload Logo
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Optional — skip karo agar nahi hai
      </p>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center
          border-2 border-dashed rounded-xl p-6 sm:p-8 mb-6
          transition-colors
          ${dragActive ? 'border-[#0F766E] bg-[#0F766E]/5' : 'border-gray-300'}
          ${uploading ? 'opacity-60 pointer-events-none' : ''}
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="text-[#0F766E] animate-spin" size={48} />
            <p className="text-sm text-gray-500">Uploading...</p>
          </div>
        ) : logo ? (
          <div className="relative">
            <img
              src={logo}
              alt="Logo"
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-lg bg-white"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition"
              aria-label="Remove logo"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Upload
              className={dragActive ? 'text-[#0F766E]' : 'text-gray-400'}
              size={48}
            />
            <p className="text-sm text-gray-500 mt-3 mb-3 text-center">
              {dragActive
                ? 'Drop your logo here'
                : 'Click to upload or drag and drop'}
            </p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="bg-[#0F766E] text-white px-5 py-2 rounded-lg hover:bg-[#065F46] transition text-sm font-medium active:scale-95"
            >
              Select File
            </button>
            <p className="text-xs text-gray-400 mt-2">PNG, JPG (max 2MB)</p>
          </>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={uploading}
          className="px-5 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 text-sm active:scale-95"
        >
          ← Back
        </button>
        <div className="flex gap-2 sm:gap-3">
          {/* ✅ Skip button sirf tab dikhao jab logo na ho */}
          {!logo && (
            <button
              type="button"
              onClick={() => onNext({ logo: null })}
              disabled={uploading}
              className="flex-1 sm:flex-none px-5 py-3 text-gray-500 hover:text-gray-700 font-medium transition text-sm"
            >
              Skip
            </button>
          )}
          <button
            type="button"
            onClick={() => onNext({ logo })}
            disabled={uploading}
            className="flex-1 sm:flex-none bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 text-sm active:scale-95"
          >
            Next →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step3LogoUpload;
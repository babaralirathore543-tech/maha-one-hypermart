// src/components/common/PremiumImageUploader.tsx
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  GripVertical,
} from 'lucide-react';

// ============================================================
// PROPS
// ============================================================
interface PremiumImageUploaderProps {
  /** Current image URLs */
  value: string[];
  /** Called when images change */
  onChange: (urls: string[]) => void;
  /** Cloudinary folder path */
  folder?: string;
  /** Max number of images (0 or undefined = unlimited) */
  maxImages?: number;
  /** Max file size in MB (default 5) */
  maxSizeMB?: number;
  /** Label shown on top (optional) */
  label?: string;
  /** Helper text below */
  helperText?: string;
  /** Single image mode — only 1 image allowed */
  single?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Compact mode for smaller UI */
  compact?: boolean;
}

// ============================================================
// CLOUDINARY CONFIG
// ============================================================
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// ============================================================
// COMPONENT
// ============================================================
const PremiumImageUploader: React.FC<PremiumImageUploaderProps> = ({
  value,
  onChange,
  folder = 'maha-one/products',
  maxImages = 0,
  maxSizeMB = 5,
  label,
  helperText,
  single = false,
  disabled = false,
  compact = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successFlash, setSuccessFlash] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================
  // VALIDATION
  // ============================================================
  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return `"${file.name}" is not an image`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `"${file.name}" exceeds ${maxSizeMB}MB`;
    }
    return null;
  };

  // ============================================================
  // UPLOAD SINGLE FILE
  // ============================================================
  const uploadFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', folder);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      });

      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
      );

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            reject(new Error(err.error?.message || 'Upload failed'));
          } catch {
            reject(new Error('Upload failed'));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(formData);
    });
  };

  // ============================================================
  // HANDLE FILES (drag-drop or input)
  // ============================================================
  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);

      if (fileArray.length === 0) return;

      // Single mode check
      if (single && value.length >= 1) {
        setError('Only one image allowed. Remove existing first.');
        return;
      }

      // Max images check
      const availableSlots =
        maxImages > 0
          ? Math.max(0, maxImages - value.length)
          : Infinity;

      if (availableSlots === 0) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      // Trim if too many
      const toUpload = single
        ? fileArray.slice(0, 1)
        : fileArray.slice(0, availableSlots);

      if (fileArray.length > toUpload.length) {
        setError(
          `Only ${toUpload.length} of ${fileArray.length} uploaded (limit reached)`
        );
      }

      // Validate each
      for (const file of toUpload) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      // Upload
      setUploading(true);
      setProgress(0);

      try {
        const newUrls: string[] = [];
        for (let i = 0; i < toUpload.length; i++) {
          setProgress(Math.round((i / toUpload.length) * 100));
          const url = await uploadFile(toUpload[i]);
          newUrls.push(url);
        }

        const final = single ? newUrls : [...value, ...newUrls];
        onChange(final);

        setSuccessFlash(true);
        setTimeout(() => setSuccessFlash(false), 1500);
      } catch (err: any) {
        setError(err.message || 'Upload failed');
      } finally {
        setUploading(false);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [value, onChange, single, maxImages, maxSizeMB, folder]
  );

  // ============================================================
  // DRAG HANDLERS
  // ============================================================
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) handleFiles(files);
  };

  // ============================================================
  // REMOVE IMAGE
  // ============================================================
  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  // ============================================================
  // CLICK TO BROWSE
  // ============================================================
  const handleBrowseClick = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };

  // ============================================================
  // COMPUTED
  // ============================================================
  const canUploadMore =
    !single || value.length === 0
      ? maxImages === 0 || value.length < maxImages
      : false;

  const showDropzone = canUploadMore || value.length === 0;

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="w-full space-y-3">
      {/* LABEL */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {maxImages > 0 && (
            <span className="text-xs text-gray-400">
              {value.length} / {maxImages}
            </span>
          )}
        </div>
      )}

      {/* ERROR */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg"
          >
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS FLASH */}
      <AnimatePresence>
        {successFlash && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-lg"
          >
            <CheckCircle2 size={16} />
            <span>Upload complete</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DROPZONE */}
      {showDropzone && (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`
            relative border-2 border-dashed rounded-2xl
            transition-all duration-200 cursor-pointer
            ${compact ? 'p-4 sm:p-6' : 'p-6 sm:p-10'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${
              isDragging
                ? 'border-[#0F766E] bg-[#0F766E]/5 scale-[1.01]'
                : 'border-gray-300 hover:border-[#0F766E] hover:bg-gray-50/50'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={!single}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
            disabled={disabled || uploading}
          />

          <div className="flex flex-col items-center justify-center text-center gap-3">
            {/* ICON */}
            <div
              className={`
                rounded-2xl flex items-center justify-center
                transition-all duration-300
                ${compact ? 'w-12 h-12' : 'w-16 h-16'}
                ${
                  isDragging
                    ? 'bg-[#0F766E] text-white scale-110'
                    : 'bg-gradient-to-br from-[#0F766E]/10 to-[#D4AF37]/10 text-[#0F766E]'
                }
              `}
            >
              {uploading ? (
                <Loader2
                  size={compact ? 24 : 32}
                  className="animate-spin"
                />
              ) : isDragging ? (
                <ImageIcon size={compact ? 24 : 32} />
              ) : (
                <Upload size={compact ? 24 : 32} />
              )}
            </div>

            {/* TEXT */}
            {uploading ? (
              <div className="w-full max-w-xs space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Uploading... {progress}%
                </p>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#0F766E] to-[#D4AF37] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p
                    className={`font-semibold text-gray-800 ${
                      compact ? 'text-sm' : 'text-base'
                    }`}
                  >
                    {isDragging
                      ? 'Drop images here'
                      : 'Drag & drop or click to upload'}
                  </p>
                  <p
                    className={`text-gray-500 mt-1 ${
                      compact ? 'text-xs' : 'text-sm'
                    }`}
                  >
                    {single
                      ? 'Single image'
                      : maxImages > 0
                      ? `Up to ${maxImages} images`
                      : 'Unlimited images'}
                    {' • '}
                    JPG, PNG, WEBP up to {maxSizeMB}MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseClick();
                  }}
                  className="
                    inline-flex items-center gap-2
                    bg-[#0F766E] hover:bg-[#065F46]
                    text-white font-medium
                    px-4 py-2 rounded-lg
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                    text-sm
                  "
                >
                  <Upload size={16} />
                  Browse Files
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* IMAGE PREVIEWS */}
      {value.length > 0 && (
        <div
          className={`
            grid gap-3
            ${
              compact
                ? 'grid-cols-3 sm:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
            }
          `}
        >
          <AnimatePresence>
            {value.map((url, index) => (
              <motion.div
                key={url + index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50"
              >
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* PRIMARY BADGE (first image) */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-[#D4AF37] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    {single ? 'IMAGE' : 'MAIN'}
                  </div>
                )}

                {/* OVERLAY ON HOVER */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="
                      bg-red-500 hover:bg-red-600
                      text-white rounded-full
                      p-2 transition-transform
                      hover:scale-110 shadow-lg
                    "
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* DRAG HANDLE (top right, visual only for now) */}
                <div className="absolute top-2 right-2 bg-black/50 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={12} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* HELPER TEXT */}
      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default PremiumImageUploader;
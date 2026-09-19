// src/components/common/ColorImageUploader.tsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  X,
  Plus,
  Trash2,
  Palette,
  Check,
  Loader2,
  Upload,
} from 'lucide-react';
import { COLOR_PALETTE, type ColorFamily, type ColorVariant } from '../../data/colorPalette';

export interface ColorImageEntry {
  id: string;
  colorName: string;
  colorHex: string;
  variantName: string;
  variantHex: string;
  images: string[];
}

interface ColorImageUploaderProps {
  value: ColorImageEntry[];
  onChange: (entries: ColorImageEntry[]) => void;
  folder?: string;
  disabled?: boolean;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const genId = () => `ci_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// ============================================================
// SWATCH
// ============================================================
const ColorSwatch: React.FC<{ hex: string; size?: number; className?: string }> = ({
  hex,
  size = 20,
  className = '',
}) => (
  <span
    className={`inline-block rounded-full border border-gray-300 shadow-sm flex-shrink-0 ${className}`}
    style={{ width: size, height: size, backgroundColor: hex }}
  />
);

// ============================================================
// COLOR DROPDOWN (searchable)
// ============================================================
interface ColorDropdownProps {
  value: ColorFamily | null;
  onSelect: (color: ColorFamily) => void;
  excludeColors?: string[];
}

const ColorDropdown: React.FC<ColorDropdownProps> = ({
  value,
  onSelect,
  excludeColors = [],
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return COLOR_PALETTE.filter((c) => {
      if (excludeColors.includes(c.name)) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.variants.some((v) => v.name.toLowerCase().includes(q))
      );
    });
  }, [search, excludeColors]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
      setHighlightIndex(0);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[highlightIndex]) {
        onSelect(filtered[highlightIndex]);
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${highlightIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlightIndex, open]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        className={`
          w-full flex items-center justify-between
          px-3 sm:px-4 py-2.5 sm:py-3
          bg-white border rounded-lg
          text-left text-sm sm:text-base
          transition-all duration-200
          ${open ? 'border-[#0F766E] ring-2 ring-[#0F766E]/20' : 'border-gray-200 hover:border-gray-300'}
        `}
      >
        {value ? (
          <div className="flex items-center gap-2 min-w-0">
            <ColorSwatch hex={value.hex} size={20} />
            <span className="font-medium text-gray-800 truncate">{value.name}</span>
          </div>
        ) : (
          <span className="text-gray-400">Select colour...</span>
        )}
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="
              absolute z-50 mt-1 w-full
              bg-white border border-gray-200
              rounded-xl shadow-2xl overflow-hidden
            "
          >
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setHighlightIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search colours..."
                  className="
                    w-full pl-9 pr-3 py-2 text-sm
                    bg-gray-50 border border-gray-200
                    rounded-lg outline-none
                    focus:border-[#0F766E] focus:bg-white
                    transition-colors
                  "
                />
              </div>
            </div>

            <div ref={listRef} className="max-h-64 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-400">
                  No colours found
                </div>
              ) : (
                filtered.map((color, index) => (
                  <button
                    key={color.name}
                    data-index={index}
                    type="button"
                    onClick={() => {
                      onSelect(color);
                      setOpen(false);
                    }}
                    onMouseEnter={() => setHighlightIndex(index)}
                    className={`
                      w-full flex items-center gap-3 px-3 sm:px-4 py-2.5
                      text-left transition-colors
                      ${
                        index === highlightIndex
                          ? 'bg-[#0F766E]/10'
                          : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <ColorSwatch hex={color.hex} size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {color.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {color.variants.length} variant
                        {color.variants.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {value?.name === color.name && (
                      <Check size={16} className="text-[#0F766E] flex-shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================
// VARIANT DROPDOWN
// ============================================================
interface VariantDropdownProps {
  variants: ColorVariant[];
  value: string;
  onSelect: (variant: ColorVariant) => void;
}

const VariantDropdown: React.FC<VariantDropdownProps> = ({
  variants,
  value,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const selected = variants.find((v) => v.name === value);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          w-full flex items-center justify-between
          px-3 sm:px-4 py-2.5
          bg-white border rounded-lg
          text-left text-sm
          transition-all duration-200
          ${open ? 'border-[#0F766E] ring-2 ring-[#0F766E]/20' : 'border-gray-200 hover:border-gray-300'}
        `}
      >
        {selected ? (
          <div className="flex items-center gap-2 min-w-0">
            <ColorSwatch hex={selected.hex} size={16} />
            <span className="font-medium text-gray-800 truncate">
              {selected.name}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">Select variant...</span>
        )}
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="
              absolute z-40 mt-1 w-full
              bg-white border border-gray-200
              rounded-xl shadow-2xl overflow-hidden
            "
          >
            <div className="max-h-56 overflow-y-auto py-1">
              {variants.map((variant) => (
                <button
                  key={variant.name}
                  type="button"
                  onClick={() => {
                    onSelect(variant);
                    setOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2
                    text-left text-sm transition-colors
                    ${
                      value === variant.name
                        ? 'bg-[#0F766E]/10'
                        : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <ColorSwatch hex={variant.hex} size={16} />
                  <span className="flex-1 font-medium text-gray-700 truncate">
                    {variant.name}
                  </span>
                  {value === variant.name && (
                    <Check size={14} className="text-[#0F766E]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const ColorImageUploader: React.FC<ColorImageUploaderProps> = ({
  value,
  onChange,
  folder = 'maha-one/products',
  disabled = false,
}) => {
  const [adding, setAdding] = useState(false);
  const [draftColor, setDraftColor] = useState<ColorFamily | null>(null);
  const [draftVariant, setDraftVariant] = useState<ColorVariant | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetEntryIdRef = useRef<string | null>(null);

  const usedColors = useMemo(() => value.map((e) => e.colorName), [value]);

  const startAdd = () => {
    setAdding(true);
    setDraftColor(null);
    setDraftVariant(null);
    setError(null);
  };

  const cancelAdd = () => {
    setAdding(false);
    setDraftColor(null);
    setDraftVariant(null);
    setError(null);
  };

  const confirmAdd = () => {
    if (!draftColor || !draftVariant) {
      setError('Please select both colour and variant');
      return;
    }
    const duplicate = value.some(
      (e) =>
        e.colorName === draftColor.name && e.variantName === draftVariant.name
    );
    if (duplicate) {
      setError('This colour + variant already exists');
      return;
    }
    const newEntry: ColorImageEntry = {
      id: genId(),
      colorName: draftColor.name,
      colorHex: draftColor.hex,
      variantName: draftVariant.name,
      variantHex: draftVariant.hex,
      images: [],
    };
    onChange([...value, newEntry]);
    setAdding(false);
    setDraftColor(null);
    setDraftVariant(null);
    setError(null);
  };

  const handleDelete = (id: string) => {
    const entry = value.find((e) => e.id === id);
    if (!entry) return;
    const message =
      entry.images.length > 0
        ? `Delete "${entry.colorName} → ${entry.variantName}" and its ${entry.images.length} image(s)?`
        : `Delete "${entry.colorName} → ${entry.variantName}"?`;
    if (!window.confirm(message)) return;
    onChange(value.filter((e) => e.id !== id));
  };

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return `"${file.name}" is not an image`;
    }
    if (file.size > 5 * 1024 * 1024) {
      return `"${file.name}" exceeds 5MB`;
    }
    return null;
  };

  const uploadFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', folder);
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      });
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
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

  const handleUploadClick = (entryId: string) => {
    if (disabled) return;
    targetEntryIdRef.current = entryId;
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (files: FileList) => {
    const entryId = targetEntryIdRef.current;
    if (!entryId) return;
    setError(null);
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;
    for (const file of fileArray) {
      const err = validateFile(file);
      if (err) {
        setError(err);
        return;
      }
    }
    setUploadingId(entryId);
    setProgress(0);
    try {
      const urls: string[] = [];
      for (let i = 0; i < fileArray.length; i++) {
        setProgress(Math.round((i / fileArray.length) * 100));
        const url = await uploadFile(fileArray[i]);
        urls.push(url);
      }
      onChange(
        value.map((e) =>
          e.id === entryId ? { ...e, images: [...e.images, ...urls] } : e
        )
      );
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploadingId(null);
      setProgress(0);
      targetEntryIdRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (entryId: string, imageIndex: number) => {
    onChange(
      value.map((e) =>
        e.id === entryId
          ? { ...e, images: e.images.filter((_, i) => i !== imageIndex) }
          : e
      )
    );
  };

  return (
    <div className="w-full space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFileSelected(e.target.files)}
        className="hidden"
      />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg"
          >
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

      {/* EXISTING ENTRIES */}
      <div className="space-y-3">
        <AnimatePresence>
          {value.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <ColorSwatch hex={entry.colorHex} size={22} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {entry.colorName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <ColorSwatch hex={entry.variantHex} size={12} />
                      <p className="text-xs text-gray-500 truncate">
                        {entry.variantName}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  disabled={disabled}
                  className="
                    p-2 text-red-500 hover:text-red-700
                    hover:bg-red-50 rounded-lg
                    transition-colors flex-shrink-0
                    disabled:opacity-50
                  "
                  title="Delete this colour"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-3 sm:p-4">
                {entry.images.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => handleUploadClick(entry.id)}
                    disabled={disabled || uploadingId === entry.id}
                    className="
                      w-full flex flex-col items-center justify-center gap-2
                      border-2 border-dashed border-gray-300
                      rounded-lg py-6 sm:py-8
                      hover:border-[#0F766E] hover:bg-[#0F766E]/5
                      transition-all duration-200
                      disabled:opacity-50
                    "
                  >
                    {uploadingId === entry.id ? (
                      <>
                        <Loader2 size={28} className="animate-spin text-[#0F766E]" />
                        <p className="text-sm font-medium text-gray-700">
                          Uploading... {progress}%
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-[#0F766E]/10 flex items-center justify-center">
                          <Upload size={20} className="text-[#0F766E]" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          Upload images for this variant
                        </p>
                        <p className="text-xs text-gray-400">
                          Click to browse or drag & drop
                        </p>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {entry.images.map((url, idx) => (
                      <div
                        key={url + idx}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                      >
                        <img
                          src={url}
                          alt={`${entry.variantName} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(entry.id, idx)}
                            disabled={disabled}
                            className="
                              bg-red-500 hover:bg-red-600
                              text-white rounded-full p-1.5
                              transition-transform hover:scale-110
                              disabled:opacity-50
                            "
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleUploadClick(entry.id)}
                      disabled={disabled || uploadingId === entry.id}
                      className="
                        aspect-square rounded-lg
                        border-2 border-dashed border-gray-300
                        hover:border-[#0F766E] hover:bg-[#0F766E]/5
                        transition-all duration-200
                        flex items-center justify-center
                        disabled:opacity-50
                      "
                    >
                      {uploadingId === entry.id ? (
                        <Loader2 size={20} className="animate-spin text-[#0F766E]" />
                      ) : (
                        <Plus size={20} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ADD NEW COLOR FORM */}
      {adding && (
        <div className="bg-gradient-to-br from-[#0F766E]/5 to-[#D4AF37]/5 rounded-xl border border-[#0F766E]/20 p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Palette size={18} className="text-[#0F766E]" />
            <h4 className="text-sm font-semibold text-gray-800">
              Add New Colour
            </h4>
          </div>

          {/* STEP 1: COLOR */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Step 1: Select Colour
            </label>
            <ColorDropdown
              value={draftColor}
              onSelect={(c) => {
                console.log('🎨 Color selected:', c.name, '| Variants:', c.variants.length);
                setDraftColor(c);
                setDraftVariant(null);
              }}
              excludeColors={usedColors}
            />
          </div>

          {/* STEP 2: VARIANT — simple div, no motion */}
          {draftColor && (
            <div className="pt-3 border-t border-[#0F766E]/10">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Step 2: Select {draftColor.name} Variant ({draftColor.variants.length} options)
              </label>
              <VariantDropdown
                variants={draftColor.variants}
                value={draftVariant?.name || ''}
                onSelect={(v) => {
                  console.log('🎨 Variant selected:', v.name);
                  setDraftVariant(v);
                }}
              />
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={confirmAdd}
              disabled={!draftColor || !draftVariant}
              className="
                flex-1 inline-flex items-center justify-center gap-2
                bg-[#0F766E] hover:bg-[#065F46]
                text-white text-sm font-medium
                px-4 py-2.5 rounded-lg
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <Check size={16} />
              Add Colour
            </button>
            <button
              type="button"
              onClick={cancelAdd}
              className="
                flex-1 sm:flex-none inline-flex items-center justify-center gap-2
                bg-gray-100 hover:bg-gray-200
                text-gray-700 text-sm font-medium
                px-4 py-2.5 rounded-lg
                transition-colors
              "
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ADD BUTTON */}
      {!adding && (
        <>
          {value.length === 0 ? (
            <button
              type="button"
              onClick={startAdd}
              disabled={disabled}
              className="
                w-full flex flex-col items-center justify-center gap-3
                border-2 border-dashed border-gray-300
                rounded-xl py-8 sm:py-10
                hover:border-[#0F766E] hover:bg-[#0F766E]/5
                transition-all duration-200
                disabled:opacity-50
              "
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0F766E]/10 to-[#D4AF37]/10 flex items-center justify-center">
                <Palette size={24} className="text-[#0F766E]" />
              </div>
              <div className="text-center px-4">
                <p className="text-sm font-semibold text-gray-800">
                  Add Colour Images
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Upload images for different colour variants (Red, Blue, etc.)
                </p>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={startAdd}
              disabled={disabled}
              className="
                w-full inline-flex items-center justify-center gap-2
                bg-white hover:bg-gray-50
                border-2 border-dashed border-gray-300 hover:border-[#0F766E]
                text-[#0F766E] text-sm font-medium
                px-4 py-3 rounded-xl
                transition-all duration-200
                disabled:opacity-50
              "
            >
              <Plus size={18} />
              Add Another Colour
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ColorImageUploader;
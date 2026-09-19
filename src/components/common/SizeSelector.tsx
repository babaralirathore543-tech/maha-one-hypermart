// src/components/common/SizeSelector.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Ruler } from 'lucide-react';
import { getSizesForProductType } from '../../data/sizeOptions';

interface SizeSelectorProps {
  /** Currently selected sizes (multi-select) */
  value: string[];
  /** Called when selection changes */
  onChange: (sizes: string[]) => void;
  /** Product type drives which sizes appear */
  productType: string;
  /** Optional: warn if productType is empty */
  onMissingProductType?: () => void;
  /** Disabled */
  disabled?: boolean;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  value,
  onChange,
  productType,
  onMissingProductType,
  disabled = false,
}) => {
  const sizes = useMemo(() => getSizesForProductType(productType), [productType]);

  const toggle = (size: string) => {
    if (disabled) return;
    if (value.includes(size)) {
      onChange(value.filter((s) => s !== size));
    } else {
      onChange([...value, size]);
    }
  };

  const selectAll = () => {
    if (disabled) return;
    onChange(sizes.map((s) => s.value));
  };

  const clearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  // If no productType selected yet
  if (!productType) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-3">
          <Ruler size={16} className="text-amber-600 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-amber-700">
            Please select <strong>Product Type</strong> first to see available sizes.
          </p>
        </div>
        {onMissingProductType && (
          <button
            type="button"
            onClick={onMissingProductType}
            className="mt-2 text-xs text-[#0F766E] hover:underline"
          >
            Go to Product Type field →
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Ruler size={16} className="text-[#0F766E]" />
          <span className="text-sm font-medium text-gray-700">
            Available Sizes
          </span>
          <span className="text-xs text-gray-400">
            ({value.length} selected)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            disabled={disabled || value.length === sizes.length}
            className="text-xs text-[#0F766E] hover:text-[#065F46] disabled:opacity-40 font-medium"
          >
            Select All
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled || value.length === 0}
            className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-40 font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Size chips */}
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const selected = value.includes(size.value);
          return (
            <motion.button
              key={size.value}
              type="button"
              onClick={() => toggle(size.value)}
              disabled={disabled}
              whileTap={{ scale: 0.95 }}
              className={`
                relative inline-flex items-center gap-1.5
                px-3 sm:px-4 py-2 rounded-lg
                text-sm font-medium
                transition-all duration-200
                border-2
                ${
                  selected
                    ? 'bg-[#0F766E] border-[#0F766E] text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-[#0F766E] hover:text-[#0F766E]'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {selected && <Check size={14} />}
              {size.label}
            </motion.button>
          );
        })}
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        Tap sizes to toggle. Selected sizes will be available to customers.
      </p>
    </div>
  );
};

export default SizeSelector;
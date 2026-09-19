// src/components/common/SizeChartBuilder.tsx
import React, { useEffect, useState } from 'react';
import { Ruler, Plus, Trash2, Info, RotateCcw, Image as ImageIcon } from 'lucide-react';
import {
  getSizeChartTemplate,
  createDefaultSizeChart,
  type SizeChartRow,
  type SizeChartTemplate,
} from '../../data/sizeChartTemplates';
import PremiumImageUploader from './PremiumImageUploader';

export interface SizeChartData {
  templateId: string;
  unit: string;
  rows: SizeChartRow[];
  imageUrl?: string;
}

interface SizeChartBuilderProps {
  value: SizeChartData | null;
  onChange: (data: SizeChartData | null) => void;
  productType: string;
  folder?: string;
  disabled?: boolean;
}

const SizeChartBuilder: React.FC<SizeChartBuilderProps> = ({
  value,
  onChange,
  productType,
  folder = 'maha-one/products/size-charts',
  disabled = false,
}) => {
  const [template, setTemplate] = useState<SizeChartTemplate | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Get template based on productType
  useEffect(() => {
    if (!productType) {
      setTemplate(null);
      return;
    }
    const t = getSizeChartTemplate(productType);
    setTemplate(t);

    // If existing chart templateId doesn't match, replace with default
    if (value && value.templateId !== t.id) {
      onChange(createDefaultSizeChart(t));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productType]);

  // Initialize if missing
  useEffect(() => {
    if (template && !value) {
      onChange(createDefaultSizeChart(template));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  if (!productType) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-3">
          <Ruler size={16} className="text-amber-600 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-amber-700">
            Please select <strong>Product Type</strong> to configure the size chart.
          </p>
        </div>
      </div>
    );
  }

  if (!template || !value) {
    return null;
  }

  const updateCell = (rowIndex: number, key: string, newValue: string) => {
    const newRows = value.rows.map((row, i) =>
      i === rowIndex
        ? { ...row, values: { ...row.values, [key]: newValue } }
        : row
    );
    onChange({ ...value, rows: newRows });
  };

  const addRow = () => {
    const emptyRow: SizeChartRow = {
      size: '',
      values: template.columns.reduce((acc, col) => {
        acc[col.key] = '';
        return acc;
      }, {} as Record<string, string>),
    };
    onChange({ ...value, rows: [...value.rows, emptyRow] });
  };

  const removeRow = (index: number) => {
    if (value.rows.length <= 1) return;
    onChange({
      ...value,
      rows: value.rows.filter((_, i) => i !== index),
    });
  };

  // ✅ Reset to prefilled defaults
  const resetToDefault = () => {
    if (!window.confirm('Reset all values to standard defaults? Your edits will be lost.')) {
      return;
    }
    const fresh = createDefaultSizeChart(template);
    onChange({ ...fresh, imageUrl: value.imageUrl || '' });
  };

  const handleImageChange = (urls: string[]) => {
    onChange({ ...value, imageUrl: urls[0] || '' });
  };

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Ruler size={16} className="text-[#0F766E]" />
          <span className="text-sm font-medium text-gray-700">
            {template.label} Size Chart
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-medium">
            {value.unit}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetToDefault}
            disabled={disabled}
            className="text-xs text-[#0F766E] hover:text-[#065F46] disabled:opacity-40 font-medium inline-flex items-center gap-1"
          >
            <RotateCcw size={12} />
            Reset
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={addRow}
            disabled={disabled}
            className="text-xs text-[#0F766E] hover:text-[#065F46] disabled:opacity-40 font-medium inline-flex items-center gap-1"
          >
            <Plus size={12} />
            Add Size
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
        <Info size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          Standard values are prefilled. Edit any cell if needed. Empty rows will be hidden from customers.
        </p>
      </div>

      {/* Table — Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200 w-24">
                Size
              </th>
              {template.columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 border-b border-gray-200 w-12">
                {/* Delete */}
              </th>
            </tr>
          </thead>
          <tbody>
            {value.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50/50">
                <td className="px-2 py-1.5 border-b border-gray-100">
                  <input
                    type="text"
                    value={row.size}
                    onChange={(e) => {
                      const newRows = value.rows.map((r, i) =>
                        i === rowIndex ? { ...r, size: e.target.value } : r
                      );
                      onChange({ ...value, rows: newRows });
                    }}
                    disabled={disabled}
                    placeholder="Size"
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none disabled:bg-gray-100"
                  />
                </td>
                {template.columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-2 py-1.5 border-b border-gray-100"
                  >
                    <input
                      type="text"
                      value={row.values[col.key] || ''}
                      onChange={(e) =>
                        updateCell(rowIndex, col.key, e.target.value)
                      }
                      disabled={disabled}
                      placeholder={col.placeholder}
                      className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none disabled:bg-gray-100"
                    />
                  </td>
                ))}
                <td className="px-2 py-1.5 border-b border-gray-100 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(rowIndex)}
                    disabled={disabled || value.rows.length <= 1}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards — Mobile */}
      <div className="md:hidden space-y-2">
        {value.rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="bg-white border border-gray-200 rounded-lg p-3 space-y-2"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={row.size}
                onChange={(e) => {
                  const newRows = value.rows.map((r, i) =>
                    i === rowIndex ? { ...r, size: e.target.value } : r
                  );
                  onChange({ ...value, rows: newRows });
                }}
                disabled={disabled}
                placeholder="Size"
                className="flex-1 px-2 py-1.5 text-sm font-semibold border border-gray-200 rounded focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={() => removeRow(rowIndex)}
                disabled={disabled || value.rows.length <= 1}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-30"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {template.columns.map((col) => (
                <div key={col.key}>
                  <label className="block text-[10px] text-gray-500 mb-0.5">
                    {col.label}
                  </label>
                  <input
                    type="text"
                    value={row.values[col.key] || ''}
                    onChange={(e) =>
                      updateCell(rowIndex, col.key, e.target.value)
                    }
                    disabled={disabled}
                    placeholder={col.placeholder}
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none disabled:bg-gray-100"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Optional Image Upload */}
      <div className="pt-2 border-t border-gray-100">
        {!showImageUpload && !value.imageUrl ? (
          <button
            type="button"
            onClick={() => setShowImageUpload(true)}
            disabled={disabled}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0F766E] hover:text-[#065F46] transition disabled:opacity-50"
          >
            <ImageIcon size={16} />
            Add Size Chart Image (Optional)
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-[#0F766E]" />
                Size Chart Image (Optional)
              </label>
              {(value.imageUrl || showImageUpload) && (
                <button
                  type="button"
                  onClick={() => {
                    setShowImageUpload(false);
                    if (value.imageUrl) {
                      if (window.confirm('Remove size chart image?')) {
                        onChange({ ...value, imageUrl: '' });
                      }
                    }
                  }}
                  disabled={disabled}
                  className="text-xs text-gray-400 hover:text-red-500 transition"
                >
                  {value.imageUrl ? 'Remove image' : 'Cancel'}
                </button>
              )}
            </div>
            <PremiumImageUploader
              value={value.imageUrl ? [value.imageUrl] : []}
              onChange={handleImageChange}
              folder={folder}
              single={true}
              maxImages={1}
              label=""
              helperText="Upload a size chart image (e.g. from brand). Table above will still be shown to customers."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeChartBuilder;
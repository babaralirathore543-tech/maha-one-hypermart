// src/components/common/SizeChartModal.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler } from 'lucide-react';
import type { SizeChartRow } from '../../data/sizeChartTemplates';

export interface SizeChartData {
  templateId: string;
  unit: string;
  rows: SizeChartRow[];
  imageUrl?: string;
}

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SizeChartData | null;
  columns: { key: string; label: string }[];
  title?: string;
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  data,
  columns,
  title = 'Size Chart',
}) => {
  // Close on ESC + lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handle);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handle);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!data) return null;

  const validRows = data.rows.filter((row) =>
    Object.values(row.values).some((v) => v && v.trim() !== '')
  );

  if (validRows.length === 0 && !data.imageUrl) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="
              bg-white rounded-2xl shadow-2xl
              w-full max-w-2xl
              max-h-[85vh] overflow-hidden
              flex flex-col
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-[#0F766E]/10 flex items-center justify-center">
                  <Ruler size={18} className="text-[#0F766E]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    All measurements in {data.unit}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* ✅ TABLE FIRST */}
              {validRows.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Size
                        </th>
                        {columns.map((col) => (
                          <th
                            key={col.key}
                            className="px-3 sm:px-4 py-2.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200"
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {validRows.map((row, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                        >
                          <td className="px-3 sm:px-4 py-3 font-semibold text-gray-900">
                            {row.size}
                          </td>
                          {columns.map((col) => (
                            <td
                              key={col.key}
                              className="px-3 sm:px-4 py-3 text-gray-700"
                            >
                              {row.values[col.key] || '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ✅ IMAGE BELOW (if uploaded) */}
              {data.imageUrl && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Size Chart Image
                  </p>
                  <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={data.imageUrl}
                      alt="Size Chart"
                      className="w-full h-auto object-contain max-h-[400px] mx-auto"
                    />
                  </div>
                </div>
              )}

              {/* Tip */}
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs text-blue-700">
                  💡 <strong>Tip:</strong> If you're between sizes, we recommend
                  choosing the larger size for a more comfortable fit.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SizeChartModal;
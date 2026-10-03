// src/components/products/UniversalProductForm.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaSpinner, FaMagic } from 'react-icons/fa';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import {
  getCategoryById,
  getAttributeTemplate,
  Category,
  AttributeTemplate,
  AttributeField,
  AttributeSection,
} from '../../services/categoryService';
import PremiumImageUploader from '../common/PremiumImageUploader';
import ColorImageUploader, { type ColorImageEntry } from '../common/ColorImageUploader';
import SizeSelector from '../common/SizeSelector';
import SizeChartBuilder, { type SizeChartData } from '../common/SizeChartBuilder';
import { generateSku } from '../../utils/generateSku';

// ============================================================
// PROPS
// ============================================================
interface UniversalProductFormProps {
  mode: 'admin' | 'seller';
  categoryId: string;
  productId?: string;
  onSuccess?: () => void;
}

// ============================================================
// DEFAULTS
// ============================================================
const PRODUCT_DEFAULTS: Record<string, any> = {
  name: '',
  brand: '',
  sku: '',
  status: 'active',
  price: 0,
  oldPrice: 0,
  discount: 0,
  costPrice: 0,
  stock: 0,
  lowStockAlert: 5,
  image: '',
  images: [],
  shortDescription: '',
  description: '',
  isNew: false,
  isFeatured: false,
  isBestSeller: false,
  isOnSale: false,
  approvalStatus: 'pending',
  displayOrder: 0,
  attributes: {},   // ✅ NEW — dynamic fields yahan jaayenge
};

const ProductForm: React.FC<UniversalProductFormProps> = ({
  mode,
  categoryId,
  productId,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!productId;

  const [category, setCategory] = useState<Category | null>(null);
  const [template, setTemplate] = useState<AttributeTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({ ...PRODUCT_DEFAULTS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingSku, setGeneratingSku] = useState(false);
  const [existingData, setExistingData] = useState<Record<string, any>>({});

  // ============================================================
  // INIT: Load category + template + product
  // ============================================================
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // 1. Category load karo
        const cat = await getCategoryById(categoryId);
        if (!cat) throw new Error(`Category not found: ${categoryId}`);
        setCategory(cat);

        // 2. Attribute template load karo
        const tmpl = await getAttributeTemplate(cat.attributeTemplateId);
        if (!tmpl) throw new Error(`Template not found: ${cat.attributeTemplateId}`);
        setTemplate(tmpl);

        // 3. Edit mode → product load karo
        if (isEditMode) {
          const productSnap = await getDoc(doc(db, 'products', productId!));
          if (productSnap.exists()) {
            const data = productSnap.data();
            setExistingData(data);

            // Merge attributes
            const merged = {
              ...PRODUCT_DEFAULTS,
              ...data,
              attributes: data.attributes || {},
              image: typeof data.image === 'string' ? data.image : (Array.isArray(data.image) ? data.image[0] : ''),
              images: Array.isArray(data.images) ? data.images : [],
            };
            setFormData(merged);
          }
        }
      } catch (err: any) {
        console.error('❌ Init error:', err);
        alert(`Failed to load form: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [categoryId, productId, isEditMode]);

  // ============================================================
  // CHANGE HANDLER — Supports dot notation & attributes
  // ============================================================
  const handleChange = (name: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev };

      // Check if field is in template (attributes)
      const isAttribute = template?.sections.some(s =>
        s.fields.some(f => f.key === name)
      );

      if (isAttribute) {
        updated.attributes = { ...updated.attributes, [name]: value };
      } else {
        updated[name] = value;
      }

      return updated;
    });
  };

  // ============================================================
  // AUTO-CALC DISCOUNT
  // ============================================================
  useEffect(() => {
    const price = Number(formData.price) || 0;
    const oldPrice = Number(formData.oldPrice) || 0;
    const newDiscount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

    if (formData.discount !== newDiscount) {
      setFormData(prev => ({ ...prev, discount: newDiscount }));
    }
  }, [formData.price, formData.oldPrice]);

  // ============================================================
  // AUTO SKU
  // ============================================================
  useEffect(() => {
    if (isEditMode || formData.sku || !category) return;
    const generate = async () => {
      setGeneratingSku(true);
      try {
        const prefix = category.id.substring(0, 3).toUpperCase();
        const sku = await generateSku(prefix);
        setFormData(prev => ({ ...prev, sku }));
      } catch (err) {
        console.error('SKU error:', err);
      } finally {
        setGeneratingSku(false);
      }
    };
    generate();
  }, [category?.id, isEditMode]);

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !template) return;

    setSaving(true);
    try {
      const id = productId || doc(collection(db, 'products')).id;

      // Base data
      const baseData: Record<string, any> = {
        ...formData,
        categoryId: category.id,
        categorySlug: category.slug,
        categoryPath: [category.parentId, category.id].filter(Boolean),
        updatedAt: serverTimestamp(),
      };

      // Auto-discount
      baseData.discount = Number(baseData.oldPrice) > Number(baseData.price)
        ? Math.round(((baseData.oldPrice - baseData.price) / baseData.oldPrice) * 100)
        : 0;

      // Mode-specific
      if (mode === 'seller') {
        baseData.sellerId = user?.uid;
        baseData.status = 'pending';
        baseData.approvalStatus = 'pending';
        baseData.createdByRole = 'seller';
      } else {
        baseData.sellerId = 'admin';
        baseData.createdByRole = 'admin';
        if (!isEditMode) {
          baseData.status = 'active';
          baseData.approvalStatus = 'approved';
          baseData.isActive = true;
        }
      }

      const productRef = doc(db, 'products', id);

      if (isEditMode) {
        await updateDoc(productRef, {
          ...existingData,
          ...baseData,
          createdAt: existingData.createdAt || serverTimestamp(),
        });
      } else {
        await setDoc(productRef, {
          ...baseData,
          createdAt: serverTimestamp(),
        });
      }

      alert(mode === 'seller' ? '✅ Submitted for approval!' : '✅ Product saved!');
      if (onSuccess) onSuccess();
      else navigate(mode === 'seller' ? '/seller/products' : '/admin/products');
    } catch (err: any) {
      console.error('❌ Submit error:', err);
      alert(`Failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // RENDER FIELD (dynamic — template-driven)
  // ============================================================
  const renderField = (field: AttributeField) => {
    // Field is in attributes object if from template
    const value = formData.attributes?.[field.key] ?? formData[field.key];

    const baseClass = 'w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none transition';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'date':
        return (
          <input
            type={field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : field.type === 'date' ? 'date' : 'text'}
            value={value || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseClass}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value ?? 0}
            onChange={(e) => {
              const num = Number(e.target.value);
              if (isNaN(num)) return;
              const clamped = Math.max(field.min ?? -Infinity, Math.min(field.max ?? Infinity, num));
              handleChange(field.key, clamped);
            }}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            required={field.required}
            className={baseClass}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className={`${baseClass} resize-y`}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            required={field.required}
            className={baseClass}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleChange(field.key, e.target.checked)}
              className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{field.label}</span>
          </label>
        );

      case 'tags':
        return (
          <input
            type="text"
            value={Array.isArray(value) ? value.join(', ') : (value || '')}
            onChange={(e) => handleChange(field.key, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            placeholder={field.placeholder || 'Comma separated'}
            className={baseClass}
          />
        );

      case 'image':
        return (
          <PremiumImageUploader
            value={value ? [value] : []}
            onChange={(urls) => handleChange(field.key, urls[0] || '')}
            folder={`maha-one/products/${categoryId}`}
            single={true}
            maxImages={1}
            label={field.label}
            helperText={field.helperText}
          />
        );

      case 'images':
        return (
          <PremiumImageUploader
            value={Array.isArray(value) ? value : []}
            onChange={(urls) => handleChange(field.key, urls)}
            folder={`maha-one/products/${categoryId}`}
            single={false}
            label={field.label}
          />
        );

      case 'colorImages':
        return (
          <ColorImageUploader
            value={Array.isArray(value) ? value : []}
            onChange={(entries) => handleChange(field.key, entries)}
            folder={`maha-one/products/${categoryId}`}
          />
        );

      case 'sizes':
        return (
          <SizeSelector
            value={Array.isArray(value) ? value : []}
            onChange={(sizes) => handleChange(field.key, sizes)}
            productType={formData.attributes?.productType || ''}
          />
        );

      case 'sizeChart':
        return (
          <SizeChartBuilder
            value={value || null}
            onChange={(data) => handleChange(field.key, data)}
            productType={formData.attributes?.productType || ''}
          />
        );

      case 'color':
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder="#000000"
              className={`${baseClass} flex-1`}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================
  // RENDER SECTION
  // ============================================================
  const renderSection = (section: AttributeSection) => {
    if (!section.fields || section.fields.length === 0) return null;

    return (
      <div
        key={section.id}
        className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 dark:border-gray-700"
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {section.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.fields.map((field) => {
            const isFullWidth = ['textarea', 'image', 'images', 'colorImages', 'sizes', 'sizeChart'].includes(field.type) ||
                                field.key === 'name' ||
                                field.key === 'description' ||
                                field.key === 'shortDescription';

            const hasOwnLabel = ['image', 'images', 'colorImages', 'sizes', 'sizeChart'].includes(field.type);

            return (
              <div key={field.key} className={isFullWidth ? 'md:col-span-2' : ''}>
                {field.type !== 'checkbox' && !hasOwnLabel && (
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                {renderField(field)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-[#0F766E]" />
      </div>
    );
  }

  if (!category || !template) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        ❌ Failed to load category "{categoryId}"
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto pb-24 sm:pb-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">{category.icon}</span>
            {isEditMode ? 'Edit' : 'Add'} {category.name} Product
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {mode === 'seller' ? '⏳ Will be reviewed before going live' : '👑 Admin Mode'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="hidden sm:flex bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition items-center gap-2 text-sm"
        >
          <FaTimes /> Cancel
        </button>
      </div>

      {/* SKU Banner */}
      <div className="bg-gradient-to-r from-[#0F766E]/5 to-[#D4AF37]/5 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-[#0F766E]/10">
        <div className="flex items-center gap-3">
          <FaMagic className="text-[#D4AF37]" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Auto-generated SKU</p>
            <code className="font-mono text-sm font-semibold text-[#0F766E] bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border">
              {generatingSku ? '...' : formData.sku || 'Generating...'}
            </code>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {template.sections.map(section => renderSection(section))}

        {/* Sticky Submit */}
        <div className="fixed sm:sticky bottom-0 sm:bottom-auto left-0 right-0 sm:left-auto sm:right-auto z-30 bg-white/95 dark:bg-gray-800/95 backdrop-blur border-t sm:border dark:border-gray-700 p-3 sm:p-4 flex gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 sm:flex-none bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 sm:px-6 py-3 sm:py-2 rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 sm:flex-none bg-[#0F766E] text-white px-4 sm:px-6 py-3 sm:py-2 rounded-lg hover:bg-[#065F46] flex items-center justify-center gap-2 disabled:opacity-50 text-sm font-medium"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {saving ? 'Saving...' : mode === 'seller' ? 'Submit for Approval' : 'Save Product'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;
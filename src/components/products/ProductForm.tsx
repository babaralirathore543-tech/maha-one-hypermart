// src/components/products/ProductForm.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaSpinner, FaMagic } from 'react-icons/fa';
import {
  doc, setDoc, getDoc, updateDoc, serverTimestamp, collection,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import PremiumImageUploader from '../common/PremiumImageUploader';
import ColorImageUploader, { type ColorImageEntry } from '../common/ColorImageUploader';
import SizeSelector from '../common/SizeSelector';
import SizeChartBuilder, { type SizeChartData } from '../common/SizeChartBuilder';
import {
  getCategoryConfig,
  sectionTitles,
  ProductField,
} from '../../config/productConfig';
import { generateSku } from '../../utils/generateSku';
import { calculateDiscount } from '../../utils/calculateDiscount';

// ============================================================
// PROPS
// ============================================================
interface ProductFormProps {
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
  colorImages: [],
  sizes: [],
  sizeChart: null,
  colors: [],
  weightVariants: [],
  benefits: [],
  dietaryInfo: [],
  ingredients: [],
  isNew: false,
  isFeatured: false,
  isBestSeller: false,
  isOnSale: false,
  isOrganic: false,
  isPremium: false,
  isGlutenFree: false,
  isVegan: false,
  isSugarFree: false,
  isNatural: false,
  isHalal: false,
  cakeDetails: {
    flavor: '', weight: '', shape: '', servings: '',
    eggless: false, customizationAvailable: false,
    advanceOrderRequired: false, preparationTime: '', customMessage: '',
  },
  foodDetails: {
    weight: '', quantity: 1, expiryDate: '', storageInstructions: '',
  },
  approvalStatus: 'pending',
  displayOrder: 0,
};

const ProductForm: React.FC<ProductFormProps> = ({
  mode, categoryId, productId, onSuccess,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const config = getCategoryConfig(categoryId);
  const isEditMode = !!productId;

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(!!productId);
  const [saving, setSaving] = useState(false);
  const [generatingSku, setGeneratingSku] = useState(false);
  const [existingData, setExistingData] = useState<Record<string, any>>({});

  // ============================================================
  // INIT
  // ============================================================
  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    } else {
      setFormData({ ...PRODUCT_DEFAULTS });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, mode]);

  const fetchProduct = async () => {
    try {
      const snap = await getDoc(doc(db, 'products', productId!));
      if (snap.exists()) {
        const data = snap.data();
        setExistingData(data);

        let colorImages: ColorImageEntry[] = [];
        if (Array.isArray(data.colorImages)) {
          colorImages = data.colorImages;
        }

        const merged = {
          ...PRODUCT_DEFAULTS,
          ...data,
          image: typeof data.image === 'string'
            ? data.image
            : (Array.isArray(data.image) ? data.image[0] || '' : ''),
          images: Array.isArray(data.images) ? data.images : [],
          colorImages,
          sizes: Array.isArray(data.sizes) ? data.sizes : [],
          sizeChart: data.sizeChart || null,
          cakeDetails: { ...PRODUCT_DEFAULTS.cakeDetails, ...(data.cakeDetails || {}) },
          foodDetails: { ...PRODUCT_DEFAULTS.foodDetails, ...(data.foodDetails || {}) },
        };
        setFormData(merged);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HANDLE CHANGE
  // ============================================================
  const handleChange = (name: string, value: any) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...(prev[parent] || {}), [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ============================================================
  // AUTO-CALC DISCOUNT
  // ============================================================
  useEffect(() => {
    const price = Number(formData.price) || 0;
    const oldPrice = Number(formData.oldPrice) || 0;
    const newDiscount = calculateDiscount(oldPrice, price);

    if (formData.discount !== newDiscount) {
      setFormData((prev) => ({ ...prev, discount: newDiscount }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.price, formData.oldPrice]);

  const liveDiscount = useMemo(
    () => calculateDiscount(formData.oldPrice, formData.price),
    [formData.oldPrice, formData.price]
  );

  // ============================================================
  // AUTO-GENERATE SKU
  // ============================================================
  useEffect(() => {
    if (isEditMode || !config || formData.sku) return;
    const generate = async () => {
      setGeneratingSku(true);
      try {
        const sku = await generateSku(config.skuPrefix);
        setFormData((prev) => ({ ...prev, sku }));
      } catch (err) {
        console.error('Failed to generate SKU:', err);
      } finally {
        setGeneratingSku(false);
      }
    };
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.id, isEditMode]);

  const handleRegenerateSku = async () => {
    if (!config) return;
    setGeneratingSku(true);
    try {
      const sku = await generateSku(config.skuPrefix);
      setFormData((prev) => ({ ...prev, sku }));
    } catch (err) {
      alert('Could not generate SKU. Try again.');
    } finally {
      setGeneratingSku(false);
    }
  };

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const id = productId || doc(collection(db, 'products')).id;

      const baseData: Record<string, any> = {
        ...formData,
        category: config?.firestoreCategory || categoryId,
        updatedAt: serverTimestamp(),
      };

      baseData.discount = calculateDiscount(baseData.oldPrice, baseData.price);

      if (mode === 'seller') {
        baseData.sellerId = user?.uid;
        baseData.sellerName = 'My Store';
        baseData.status = 'pending';
        baseData.approvalStatus = 'pending';
        baseData.createdBy = user?.uid;
        baseData.createdByRole = 'seller';
      } else {
        baseData.sellerId = 'admin';
        baseData.sellerName = 'MAHA ONE';
        baseData.createdBy = user?.uid;
        baseData.createdByRole = 'admin';

        if (!isEditMode) {
          baseData.status = baseData.status || 'active';
          baseData.approvalStatus = 'approved';
          baseData.approvedAt = serverTimestamp();
          baseData.approvedBy = user?.uid;
        }
      }

      const productRef = doc(db, 'products', id);

      if (isEditMode) {
        const mergedData: Record<string, any> = {
          ...existingData,
          ...baseData,
          createdAt: existingData.createdAt || serverTimestamp(),
          sellerId: existingData.sellerId || baseData.sellerId,
          sellerName: existingData.sellerName || baseData.sellerName,
        };

        if (mode === 'seller') {
          mergedData.status = 'pending';
          mergedData.approvalStatus = 'pending';
        }

        await updateDoc(productRef, mergedData);
        alert(
          mode === 'seller'
            ? '✅ Product updated & resubmitted for approval!'
            : '✅ Product updated!'
        );
      } else {
        await setDoc(productRef, {
          ...baseData,
          createdAt: serverTimestamp(),
        });
        alert(
          mode === 'seller'
            ? '✅ Submitted for approval!'
            : '✅ Product created!'
        );
      }

      if (onSuccess) onSuccess();
      else navigate(mode === 'seller' ? '/seller/products' : '/admin/products');
    } catch (error: any) {
      console.error('❌ Submit error:', error);
      alert(`❌ Failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // RENDER FIELD
  // ============================================================
  const renderField = (field: ProductField) => {
    const value = field.name.includes('.')
      ? field.name.split('.').reduce((obj: any, key) => obj?.[key], formData)
      : formData[field.name];

    const baseClass =
      'w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none transition';

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseClass}
          />
        );

      case 'number': {
        const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
          const num = Number(e.target.value);
          const clamped = Math.max(
            field.min ?? -Infinity,
            Math.min(field.max ?? Infinity, num)
          );
          handleChange(field.name, clamped);
        };
        return (
          <input
            type="number"
            value={value ?? 0}
            onChange={handleNumber}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            required={field.required}
            className={baseClass}
          />
        );
      }

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
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
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            className={baseClass}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
            />
            <span className="text-sm text-gray-700">{field.label}</span>
          </label>
        );

      case 'tags':
        return (
          <input
            type="text"
            value={Array.isArray(value) ? value.join(', ') : value || ''}
            onChange={(e) =>
              handleChange(
                field.name,
                e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
              )
            }
            placeholder={field.placeholder || 'Comma separated values'}
            className={baseClass}
          />
        );

      case 'image':
        return (
          <PremiumImageUploader
            value={value ? [value] : []}
            onChange={(urls) => handleChange(field.name, urls[0] || '')}
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
            value={Array.isArray(value) ? value : value ? [value] : []}
            onChange={(urls) => handleChange(field.name, urls)}
            folder={`maha-one/products/${categoryId}`}
            single={false}
            label={field.label}
            helperText={field.helperText}
          />
        );

      case 'colorImages':
        return (
          <ColorImageUploader
            value={Array.isArray(value) ? value : []}
            onChange={(entries) => handleChange(field.name, entries)}
            folder={`maha-one/products/${categoryId}`}
          />
        );

      // ✅ DYNAMIC SIZE SELECTOR
      case 'sizes':
        return (
          <SizeSelector
            value={Array.isArray(value) ? value : []}
            onChange={(sizes) => handleChange(field.name, sizes)}
            productType={formData.productType || ''}
          />
        );

      // ✅ DYNAMIC SIZE CHART BUILDER
      case 'sizeChart':
        return (
          <SizeChartBuilder
            value={value || null}
            onChange={(data) => handleChange(field.name, data)}
            productType={formData.productType || ''}
          />
        );

      default:
        return null;
    }
  };

  // ============================================================
  // RENDER SECTION
  // ============================================================
  const renderSection = (sectionId: string) => {
    if (!config) return null;
    const fields = config.fields.filter((f) => f.section === sectionId);
    if (fields.length === 0) return null;

    return (
      <div
        key={sectionId}
        className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100"
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
          {sectionTitles[sectionId] || sectionId}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => {
            const isFullWidth =
              ['textarea', 'image', 'images', 'colorImages', 'sizes', 'sizeChart'].includes(field.type) ||
              field.name === 'name' ||
              field.name === 'description' ||
              field.name === 'shortDescription';

            const hasOwnLabel = ['image', 'images', 'colorImages', 'sizes', 'sizeChart'].includes(field.type);

            return (
              <div
                key={field.name}
                className={isFullWidth ? 'md:col-span-2' : ''}
              >
                {field.type !== 'checkbox' && !hasOwnLabel && (
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}{' '}
                    {field.required && <span className="text-red-500">*</span>}
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
  // STATES
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-[#0F766E]" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        ❌ Unknown category: {categoryId}
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
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">{config.icon}</span>
            {isEditMode ? 'Edit' : 'Add'} {config.name} Product
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {mode === 'seller'
              ? '⏳ Will be reviewed by admin before going live'
              : '👑 Admin Mode — goes live immediately'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="hidden sm:flex bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition items-center gap-2 text-sm"
        >
          <FaTimes /> Cancel
        </button>
      </div>

      {/* AUTO BANNER */}
      <div className="bg-gradient-to-r from-[#0F766E]/5 to-[#D4AF37]/5 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-[#0F766E]/10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <FaMagic className="text-[#D4AF37]" /> Auto-generated SKU
            </p>
            <div className="flex items-center gap-2">
              <code className="font-mono text-sm sm:text-base font-semibold text-[#0F766E] bg-white px-3 py-1.5 rounded-lg border border-gray-200 flex-1">
                {generatingSku ? '...' : formData.sku || 'Generating...'}
              </code>
              <button
                type="button"
                onClick={handleRegenerateSku}
                disabled={generatingSku}
                className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                title="Regenerate SKU"
              >
                {generatingSku ? <FaSpinner className="animate-spin" /> : '↻'}
              </button>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Discount (auto)</p>
            <div className="flex items-center gap-2">
              {liveDiscount > 0 ? (
                <>
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                    -{liveDiscount}%
                  </span>
                  <span className="text-xs text-gray-500">
                    Rs. {Number(formData.oldPrice).toLocaleString()} → Rs. {Number(formData.price).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-xs text-gray-400 py-1.5">
                  No discount (set Old Price higher than Price)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {config.sections.map((sectionId) => renderSection(sectionId))}

        {/* STICKY SUBMIT BAR */}
        <div className="fixed sm:sticky bottom-0 sm:bottom-auto left-0 right-0 sm:left-auto sm:right-auto z-30 bg-white/95 backdrop-blur border-t sm:border border-gray-200 sm:rounded-lg p-3 sm:p-4 flex gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-4 sm:px-6 py-3 sm:py-2 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 sm:flex-none bg-[#0F766E] text-white px-4 sm:px-6 py-3 sm:py-2 rounded-lg hover:bg-[#065F46] transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base font-medium"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {saving
              ? 'Saving...'
              : mode === 'seller'
              ? 'Submit for Approval'
              : isEditMode
              ? 'Update'
              : 'Add Product'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;
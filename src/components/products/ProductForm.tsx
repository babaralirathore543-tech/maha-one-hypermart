// src/components/products/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaPlus, FaSpinner, FaTrash, FaLink, FaCloudUploadAlt } from 'react-icons/fa';
// ✅ FIXED: Added collection import
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import CloudinaryUpload from '../common/CloudinaryUpload';
import {
  categoryConfigs,
  getCategoryConfig,
  getFieldsBySection,
  sectionTitles,
  ProductField,
} from '../../config/productConfig';

// ============================================================
// PROPS
// ============================================================
interface ProductFormProps {
  mode: 'admin' | 'seller';
  categoryId: string;
  productId?: string;
  onSuccess?: () => void;
}

// ✅ FIXED: Define type for baseData
interface BaseProductData {
  [key: string]: any;
  category: string;
  updatedAt: any;
  sellerId?: string;
  sellerName?: string;
  status?: string;
  approvalStatus?: string;
  createdAt?: any;
}

const ProductForm: React.FC<ProductFormProps> = ({ mode, categoryId, productId, onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const config = getCategoryConfig(categoryId);
  const isEditMode = !!productId;

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(!!productId);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ Initialize form
  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    } else {
      const initial: Record<string, any> = {
        name: '',
        brand: '',
        sku: '',
        status: mode === 'seller' ? 'pending' : 'active',
        price: 0,
        oldPrice: 0,
        discount: 0,
        costPrice: 0,
        stock: 0,
        lowStockAlert: 5,
        image: '',
        images: [],
        sizes: [],
        colors: [],
        colorImages: {},
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
        cakeDetails: {
          flavor: '', weight: '', shape: '', servings: '',
          eggless: false, customizationAvailable: false,
          advanceOrderRequired: false, preparationTime: '', customMessage: '',
        },
        foodDetails: {
          weight: '', quantity: 1, expiryDate: '', storageInstructions: '',
        },
      };
      setFormData(initial);
    }
  }, [productId]);

  // ✅ Fetch product for edit
  const fetchProduct = async () => {
    try {
      const snap = await getDoc(doc(db, 'products', productId!));
      if (snap.exists()) {
        const data = snap.data();
        if (mode === 'seller' && data.sellerId !== user?.uid) {
          alert('❌ You can only edit your own products');
          navigate('/seller/products');
          return;
        }
        setFormData({ ...data });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle field change
  const handleChange = (name: string, value: any) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const id = productId || doc(collection(db, 'products')).id;

      // ✅ FIXED: Type annotation
      const baseData: BaseProductData = {
        ...formData,
        category: config?.firestoreCategory || categoryId,
        updatedAt: serverTimestamp(),
      };

      // ✅ ROLE-BASED LOGIC
      if (mode === 'seller') {
        baseData.sellerId = user?.uid;
        baseData.sellerName = formData.sellerName || 'My Store';
        baseData.status = 'pending';
        baseData.approvalStatus = 'pending';
      } else {
        baseData.sellerId = 'admin';
        baseData.sellerName = 'MAHA ONE';
      }

      const productRef = doc(db, 'products', id);

      if (isEditMode) {
        await updateDoc(productRef, baseData);
        alert('✅ Product updated!');
      } else {
        await setDoc(productRef, { ...baseData, createdAt: serverTimestamp() });
        alert(mode === 'seller' ? '✅ Submitted for approval!' : '✅ Product created!');
      }

      if (onSuccess) onSuccess();
      else navigate(mode === 'seller' ? '/seller/products' : '/admin/products');
    } catch (error: any) {
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

    const baseClass = "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none";

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

      case 'number':
        return (
          <input
            type="number"
            value={value || 0}
            onChange={(e) => handleChange(field.name, Number(e.target.value))}
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
            {field.options?.map(opt => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
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
            onChange={(e) => handleChange(field.name, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            placeholder={field.placeholder || 'Comma separated values'}
            className={baseClass}
          />
        );

      case 'images':
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <CloudinaryUpload
                onUploadSuccess={(url) => handleChange(field.name, [url])}
                buttonText="📤 Upload"
                folder={`maha-one/products/${categoryId}`}
              />
              <input
                type="text"
                placeholder="Or paste image URL..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const url = (e.target as HTMLInputElement).value.trim();
                    if (url) {
                      handleChange(field.name, [url]);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
                className={`${baseClass} flex-1 min-w-[200px]`}
              />
            </div>
            {value && (
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(value) ? value : [value]).map((url: string, i: number) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="Product" className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200" />
                    <button
                      type="button"
                      onClick={() => {
                        const arr = Array.isArray(value) ? value.filter((_: any, idx: number) => idx !== i) : [];
                        handleChange(field.name, arr);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================
  // RENDER SECTION
  // ============================================================
  const renderSection = (sectionId: string) => {
    const fields = getFieldsBySection(categoryId, sectionId, mode);
    if (fields.length === 0) return null;

    return (
      <div key={sectionId} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {sectionTitles[sectionId] || sectionId}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(field => (
            <div
              key={field.name}
              className={
                ['textarea', 'images', 'tags'].includes(field.type) || field.name === 'name'
                  ? 'md:col-span-2'
                  : ''
              }
            >
              {field.type !== 'checkbox' && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
              )}
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>
    );
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">{config.icon}</span>
            {isEditMode ? 'Edit' : 'Add'} {config.name} Product
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'seller' ? '⏳ Product will be reviewed by admin' : '👑 Admin Mode'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2 text-sm"
        >
          <FaTimes /> Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {config.sections.map(sectionId => renderSection(sectionId))}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0F766E] text-white px-6 py-2 rounded-lg hover:bg-[#065F46] transition flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {saving ? 'Saving...' : mode === 'seller' ? 'Submit for Approval' : (isEditMode ? 'Update' : 'Add Product')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;
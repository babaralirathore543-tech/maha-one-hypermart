// src/components/admin/AdminHerbalForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaSave, FaTimes, FaPlus, FaTrash,
  FaSpinner, FaArrowLeft, FaLink,
  FaCloudUploadAlt, FaLeaf, FaBox,
  FaTag, FaDollarSign, FaHeart
} from 'react-icons/fa';
import { db } from '../../config/firebase';
import {
  collection, addDoc, getDoc, doc, updateDoc,
  query, where, getDocs
} from 'firebase/firestore';

// ✅ Cloudinary Upload
const CLOUDINARY_UPLOAD_PRESET = 'maha_one_uploads';
const CLOUDINARY_CLOUD_NAME = 'kw3pdwrb';

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'herbal');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload image');
  }
  const data = await response.json();
  return data.secure_url;
};

// ✅ Herbal Product Interface
interface HerbalProductData {
  name: string;
  brand: string;
  sku: string;
  subCategory: string;
  productType: string;
  price: number;
  oldPrice: number;
  discount: number;
  costPrice: number;
  stock: number;
  lowStockAlert: number;
  weight: string;
  weightUnit: string;
  origin: string;
  packaging: string;
  shelfLife: string;
  storageInstructions: string;
  image: string;
  images: string[];
  shortDescription: string;
  description: string;
  ingredients: string;
  usage: string;
  benefits: string[];
  warnings: string;
  nutritionalInfo: string;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  isOrganic: boolean;
  isNatural: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isHalal: boolean;
  status: 'active' | 'draft' | 'out-of-stock';
  rating: number;
  reviewCount: number;
}

// ✅ Herbal Categories
const herbalCategories = [
  { id: 'herbal-tea', label: 'Herbal Tea', icon: '🍵' },
  { id: 'herbal-powder', label: 'Herbal Powder', icon: '🥄' },
  { id: 'herbal-oil', label: 'Herbal Oil', icon: '🧴' },
  { id: 'herbal-capsules', label: 'Herbal Capsules', icon: '💊' },
  { id: 'herbal-soap', label: 'Herbal Soap', icon: '🧼' },
  { id: 'herbal-shampoo', label: 'Herbal Shampoo', icon: '🧴' },
  { id: 'herbal-cream', label: 'Herbal Cream', icon: '🫙' },
  { id: 'herbal-honey', label: 'Herbal Honey', icon: '🍯' },
  { id: 'herbal-juice', label: 'Herbal Juice', icon: '🧃' },
  { id: 'herbal-seeds', label: 'Herbal Seeds', icon: '🌱' },
  { id: 'herbal-leaves', label: 'Herbal Leaves', icon: '🍃' },
  { id: 'herbal-roots', label: 'Herbal Roots', icon: '🪴' },
  { id: 'herbal-flowers', label: 'Herbal Flowers', icon: '🌸' },
  { id: 'herbal-mix', label: 'Herbal Mix', icon: '🌿' },
];

const weightUnits = [
  { value: 'g', label: 'Grams (g)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'ml', label: 'Milliliters (ml)' },
  { value: 'L', label: 'Liters (L)' },
  { value: 'pcs', label: 'Pieces' },
  { value: 'pack', label: 'Pack' },
];

const origins = [
  'Pakistan', 'India', 'China', 'Nepal', 'Sri Lanka',
  'Iran', 'Turkey', 'Egypt', 'Morocco', 'Local', 'Organic Farms'
];

const packagingTypes = [
  'Plastic Pouch', 'Glass Jar', 'Paper Box', 'Tin Can',
  'Gift Box', 'Vacuum Pack', 'Bulk Pack', 'Eco-friendly',
  'Resealable Bag', 'Premium Tin'
];

const shelfLifeOptions = [
  '3 Months', '6 Months', '9 Months', '12 Months',
  '18 Months', '24 Months', '36 Months'
];

const productTypes = [
  'Raw', 'Dried', 'Powdered', 'Liquid', 'Extract',
  'Organic', 'Premium', 'Handmade', 'Cold-Pressed',
  'Sun-Dried', 'Wild-Crafted'
];

const benefitOptions = [
  'Immunity Booster', 'Anti-Inflammatory', 'Antioxidant Rich',
  'Digestive Health', 'Detox', 'Skin Health',
  'Hair Health', 'Weight Management', 'Stress Relief',
  'Better Sleep', 'Heart Health', 'Liver Support',
  'Blood Sugar Control', 'Bone Health', 'Energy Boost',
  'Respiratory Health', 'Hormonal Balance', 'Anti-Aging'
];

const generateSku = (category: string, index: number) => {
  const prefix = 'MHB';
  const catCode = category.substring(0, 3).toUpperCase();
  return `${prefix}-${catCode}-${String(index).padStart(3, '0')}`;
};

const AdminHerbalForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<HerbalProductData>({
    name: '',
    brand: '',
    sku: '',
    subCategory: '',
    productType: '',
    price: 0,
    oldPrice: 0,
    discount: 0,
    costPrice: 0,
    stock: 0,
    lowStockAlert: 5,
    weight: '',
    weightUnit: 'g',
    origin: '',
    packaging: '',
    shelfLife: '',
    storageInstructions: '',
    image: '',
    images: [],
    shortDescription: '',
    description: '',
    ingredients: '',
    usage: '',
    benefits: [],
    warnings: '',
    nutritionalInfo: '',
    isNew: false,
    isFeatured: false,
    isBestSeller: false,
    isOnSale: false,
    isOrganic: false,
    isNatural: true,
    isVegan: false,
    isGlutenFree: false,
    isHalal: true,
    status: 'active',
    rating: 0,
    reviewCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [usedSkus, setUsedSkus] = useState<string[]>([]);

  // ✅ Auto SKU
  useEffect(() => {
    if (formData.subCategory && formData.sku === '') {
      const count = usedSkus.length + 1;
      setFormData(prev => ({ ...prev, sku: generateSku(formData.subCategory, count) }));
    }
  }, [formData.subCategory, usedSkus]);

  // ✅ Fetch used SKUs
  useEffect(() => {
    const fetchUsedSkus = async () => {
      try {
        const q = query(collection(db, 'products'), where('category', '==', 'herbal'));
        const snapshot = await getDocs(q);
        setUsedSkus(snapshot.docs.map(d => d.data().sku).filter(Boolean));
      } catch (error) {
        console.error('Error fetching SKUs:', error);
      }
    };
    fetchUsedSkus();
  }, []);

  // ✅ Edit mode
  useEffect(() => {
    if (isEditMode && id) fetchProduct(id);
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const snap = await getDoc(doc(db, 'products', productId));
      if (snap.exists()) {
        const data = snap.data();
        setFormData({
          name: data.name || '',
          brand: data.brand || '',
          sku: data.sku || '',
          subCategory: data.subCategory || '',
          productType: data.productType || '',
          price: data.price || 0,
          oldPrice: data.oldPrice || 0,
          discount: data.discount || 0,
          costPrice: data.costPrice || 0,
          stock: data.stock || 0,
          lowStockAlert: data.lowStockAlert || 5,
          weight: data.weight || '',
          weightUnit: data.weightUnit || 'g',
          origin: data.origin || '',
          packaging: data.packaging || '',
          shelfLife: data.shelfLife || '',
          storageInstructions: data.storageInstructions || '',
          image: data.image || '',
          images: data.images || [],
          shortDescription: data.shortDescription || '',
          description: data.description || '',
          ingredients: data.ingredients || '',
          usage: data.usage || '',
          benefits: data.benefits || [],
          warnings: data.warnings || '',
          nutritionalInfo: data.nutritionalInfo || '',
          isNew: data.isNew || false,
          isFeatured: data.isFeatured || false,
          isBestSeller: data.isBestSeller || false,
          isOnSale: data.isOnSale || false,
          isOrganic: data.isOrganic || false,
          isNatural: data.isNatural !== false,
          isVegan: data.isVegan || false,
          isGlutenFree: data.isGlutenFree || false,
          isHalal: data.isHalal !== false,
          status: data.status || 'active',
          rating: data.rating || 0,
          reviewCount: data.reviewCount || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Image upload
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleMainImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData(prev => ({ ...prev, image: imageUrlInput }));
    setImageUrlInput('');
    setShowUrlInput(false);
  };

  const handleGalleryImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadToCloudinary(file));
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (error) {
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleBenefitToggle = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { alert('Please enter product name'); return; }
    if (!formData.subCategory) { alert('Please select category'); return; }
    if (!formData.price) { alert('Please enter price'); return; }
    if (!formData.image) { alert('Please add main image'); return; }

    setSaving(true);
    setError(null);

    try {
      const productData = {
        ...formData,
        category: 'herbal',
        sellerId: 'admin',
        sellerName: 'MAHA ONE',
        updatedAt: new Date(),
      };

      if (isEditMode && id) {
        await updateDoc(doc(db, 'products', id), productData);
        alert('✅ Herbal product updated!');
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date(),
        });
        alert('✅ Herbal product added!');
      }
      navigate('/admin/products');
    } catch (error: any) {
      console.error('❌ Error:', error);
      alert(`❌ Failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-emerald-600" />
        <p className="mt-4 text-gray-500">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/products')}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaLeaf className="text-emerald-600" />
              {isEditMode ? '✏️ Edit' : '➕ Add'} Herbal & Natural Product
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode ? 'Update herbal product details' : 'Add a new herbal or natural product'}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2 text-sm"
        >
          <FaTimes /> Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. BASIC */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaTag className="text-emerald-600" /> 1. Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleInputChange}
                placeholder="e.g., Organic Herbal Green Tea"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleInputChange}
                placeholder="e.g., MAHA HERBAL"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleInputChange}
                placeholder="MHB-TEA-001"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="subCategory" value={formData.subCategory} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" required>
                <option value="">Select Category</option>
                {herbalCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
              <select name="productType" value={formData.productType} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Select Type</option>
                {productTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select name="status" value={formData.status} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="active">🟢 Active</option>
                <option value="draft">🟡 Draft</option>
                <option value="out-of-stock">🔴 Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. PRICING */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaDollarSign className="text-emerald-600" /> 2. Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange}
                placeholder="990"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
              <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleInputChange}
                placeholder="1200"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
              <input type="number" name="discount" value={formData.discount} onChange={handleInputChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
              <input type="number" name="costPrice" value={formData.costPrice} onChange={handleInputChange}
                placeholder="700"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
        </div>

        {/* 3. WEIGHT & DETAILS */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaBox className="text-emerald-600" /> 3. Weight & Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
              <div className="flex gap-2">
                <input type="text" name="weight" value={formData.weight} onChange={handleInputChange}
                  placeholder="250"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                <select name="weightUnit" value={formData.weightUnit} onChange={handleInputChange}
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                  {weightUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
              <select name="origin" value={formData.origin} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Select Origin</option>
                {origins.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Packaging</label>
              <select name="packaging" value={formData.packaging} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Select Packaging</option>
                {packagingTypes.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* 4. INVENTORY */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaBox className="text-emerald-600" /> 4. Inventory
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleInputChange}
                placeholder="50"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
              <input type="number" name="lowStockAlert" value={formData.lowStockAlert} onChange={handleInputChange}
                placeholder="5"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Life</label>
              <select name="shelfLife" value={formData.shelfLife} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Select Shelf Life</option>
                {shelfLifeOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* 5. IMAGES */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCloudUploadAlt className="text-emerald-600" /> 5. Images
          </h3>

          {/* Main Image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Product Image *</label>
            <div className="flex items-center gap-4 mb-2">
              <input type="file" accept="image/*" onChange={handleMainImageUpload}
                className="hidden" id="herbalMainImage" disabled={uploading} />
              <label htmlFor="herbalMainImage"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition cursor-pointer text-sm flex items-center gap-2">
                {uploading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />}
                {uploading ? 'Uploading...' : 'Upload Image'}
              </label>
              <button type="button" onClick={() => setShowUrlInput(!showUrlInput)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm flex items-center gap-2">
                <FaLink /> Add URL
              </button>
            </div>
            {showUrlInput && (
              <div className="flex items-center gap-2 mb-2">
                <input type="text" placeholder="https://example.com/image.jpg"
                  value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm" />
                <button type="button" onClick={handleMainImageUrl}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm">Add</button>
                <button type="button" onClick={() => { setShowUrlInput(false); setImageUrlInput(''); }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm">Cancel</button>
              </div>
            )}
            {formData.image && (
              <div className="relative inline-block mt-2">
                <img src={formData.image} alt="Main" className="w-24 h-24 object-cover rounded-lg border" />
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
              </div>
            )}
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images</label>
            <input type="file" accept="image/*" multiple onChange={handleGalleryImagesUpload}
              className="hidden" id="herbalGalleryImages" disabled={uploading} />
            <label htmlFor="herbalGalleryImages"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition cursor-pointer text-sm inline-flex items-center gap-2">
              {uploading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />}
              {uploading ? 'Uploading...' : 'Upload Images'}
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.images.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} alt={`Gallery ${index}`} className="w-20 h-20 object-cover rounded-lg border" />
                  <button type="button" onClick={() => removeGalleryImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. HERBAL DETAILS */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaLeaf className="text-emerald-600" /> 6. Herbal Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
              <textarea name="ingredients" value={formData.ingredients} onChange={handleInputChange}
                placeholder="e.g., Green Tea Leaves, Mint, Ginger..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-y" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">How to Use</label>
              <textarea name="usage" value={formData.usage} onChange={handleInputChange}
                placeholder="e.g., Add 1 tsp in hot water, steep for 3-5 min..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-y" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warnings / Side Effects</label>
              <textarea name="warnings" value={formData.warnings} onChange={handleInputChange}
                placeholder="e.g., Consult doctor if pregnant..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-y" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Storage Instructions</label>
              <input type="text" name="storageInstructions" value={formData.storageInstructions} onChange={handleInputChange}
                placeholder="e.g., Store in a cool, dry place"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nutritional Info</label>
              <textarea name="nutritionalInfo" value={formData.nutritionalInfo} onChange={handleInputChange}
                placeholder="Calories, Protein, etc..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-y" />
            </div>
          </div>
        </div>

        {/* 7. DESCRIPTION */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaTag className="text-emerald-600" /> 7. Description
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange}
                placeholder="Brief description..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange}
                placeholder="Full description..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-y" />
            </div>
          </div>
        </div>

        {/* 8. BENEFITS */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaHeart className="text-emerald-600" /> 8. Health Benefits
          </h3>
          <div className="flex flex-wrap gap-2">
            {benefitOptions.map((benefit) => (
              <button key={benefit} type="button" onClick={() => handleBenefitToggle(benefit)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  formData.benefits.includes(benefit)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {formData.benefits.includes(benefit) ? '✓' : '+'} {benefit}
              </button>
            ))}
          </div>
        </div>

        {/* 9. LABELS */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaTag className="text-emerald-600" /> 9. Labels & Tags
          </h3>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded" /> 🆕 New
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded" /> ⭐ Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded" /> 🏆 Best Seller
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" name="isOnSale" checked={formData.isOnSale} onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded" /> 🔥 On Sale
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" name="isOrganic" checked={formData.isOrganic} onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded" /> 🌿 Organic
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" name="isNatural" checked={formData.isNatural} onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded" /> 🍃 Natural
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" name="isVegan" checked={formData.isVegan} onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded" /> 🌱 Vegan
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" name="isGlutenFree" checked={formData.isGlutenFree} onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded" /> 🚫 Gluten Free
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" name="isHalal" checked={formData.isHalal} onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded" /> ☪️ Halal
            </label>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/admin/products')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300" disabled={saving}>
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50">
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {saving ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminHerbalForm;
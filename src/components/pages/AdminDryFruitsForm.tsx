// src/components/pages/AdminDryFruitsForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaSave, FaTimes, FaPlus, FaTrash,
  FaSpinner, FaArrowLeft,
  FaLink, FaCloudUploadAlt,
  FaSeedling, FaWeightHanging,
  FaBox, FaTag, FaList
} from 'react-icons/fa';
import { db, storage } from '../../config/firebase';
import { 
  collection, addDoc, getDoc, doc, updateDoc,
  query, where, getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// ✅ Dry Fruits Product Interface
interface DryFruitsProductData {
  name: string;
  brand: string;
  sku: string;
  category: string;
  subCategory: string;
  productType: string;
  // ✅ Base price (default)
  price: number;
  oldPrice: number;
  discount: number;
  costPrice: number;
  stock: number;
  lowStockAlert: number;
  // ✅ Weight Variants
  weightVariants: WeightVariant[];
  // Other fields
  weight: string;
  weightUnit: string;
  origin: string;
  harvestYear: string;
  packaging: string;
  shelfLife: string;
  storageInstructions: string;
  image: string;
  images: string[];
  shortDescription: string;
  description: string;
  nutritionalInfo: string;
  benefits: string[];
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  isOrganic: boolean;
  isPremium: boolean;
  status: 'active' | 'draft' | 'out-of-stock';
  rating: number;
  reviewCount: number;
}

// ✅ Weight Variant Interface
interface WeightVariant {
  id: string;
  weight: string;
  weightUnit: string;
  price: number;
  oldPrice: number;
  discount: number;
  stock: number;
  sku: string;
}

// ✅ Dry Fruits Categories
const dryFruitsCategories = [
  { id: 'almonds', label: 'Almonds (Badam)', icon: '🥜' },
  { id: 'cashews', label: 'Cashews (Kaju)', icon: '🥜' },
  { id: 'pistachios', label: 'Pistachios (Pista)', icon: '🥜' },
  { id: 'walnuts', label: 'Walnuts (Akhrot)', icon: '🥜' },
  { id: 'raisins', label: 'Raisins (Kishmish)', icon: '🍇' },
  { id: 'dates', label: 'Dates (Khajoor)', icon: '🌴' },
  { id: 'apricots', label: 'Apricots (Khubani)', icon: '🍑' },
  { id: 'figs', label: 'Figs (Anjeer)', icon: '🍐' },
  { id: 'prunes', label: 'Prunes (Aloo Bukhara)', icon: '🍒' },
  { id: 'mixed', label: 'Mixed Dry Fruits', icon: '🫘' },
  { id: 'seeds', label: 'Seeds (Chia, Pumpkin, etc.)', icon: '🌱' },
  { id: 'coconut', label: 'Coconut Products', icon: '🥥' },
];

// ✅ Weight Units
const weightUnits = [
  { value: 'g', label: 'Grams (g)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'oz', label: 'Ounces (oz)' },
];

// ✅ Common Weight Options
const weightOptions = [
  '50', '100', '150', '200', '250', '300', '400', '500',
  '750', '1000', '1500', '2000', '2500', '3000', '5000'
];

// ✅ Origins
const origins = [
  'Pakistan', 'India', 'China', 'Turkey', 'Iran', 'Afghanistan',
  'USA', 'California', 'Chile', 'Australia', 'Spain', 'Italy',
  'Greece', 'Middle East', 'Central Asia', 'South America'
];

// ✅ Packaging Types
const packagingTypes = [
  'Plastic Pouch', 'Stand-up Pouch', 'Glass Jar', 'Tin Can',
  'Cardboard Box', 'Gift Box', 'Vacuum Pack', 'Bulk Pack',
  'Resealable Bag', 'Premium Tin', 'Eco-friendly Pack'
];

// ✅ Shelf Life Options
const shelfLifeOptions = [
  '6 Months', '12 Months', '18 Months', '24 Months',
  '36 Months', '5 Years'
];

// ✅ Product Types
const productTypes = [
  'Raw', 'Roasted', 'Salted', 'Unsalted',
  'Honey Roasted', 'Chocolate Coated', 'Spiced',
  'Organic', 'Premium', 'Jumbo', 'Premium Quality'
];

// ✅ Benefits
const benefitOptions = [
  'Rich in Antioxidants', 'Heart Healthy', 'Brain Food',
  'High in Protein', 'Good for Skin', 'Boosts Immunity',
  'Rich in Fiber', 'Natural Energy', 'Weight Management',
  'Bone Health', 'Digestive Health', 'Diabetes Friendly'
];

// ✅ Generate SKU
const generateSku = (category: string, index: number) => {
  const prefix = 'MDF';
  const catCode = category.substring(0, 3).toUpperCase();
  return `${prefix}-${catCode}-${String(index).padStart(3, '0')}`;
};

// ✅ Generate Variant SKU
const generateVariantSku = (baseSku: string, weight: string) => {
  return `${baseSku}-${weight}`;
};

const AdminDryFruitsForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<DryFruitsProductData>({
    name: '',
    brand: '',
    sku: '',
    category: '',
    subCategory: '',
    productType: '',
    price: 0,
    oldPrice: 0,
    discount: 0,
    costPrice: 0,
    stock: 0,
    lowStockAlert: 5,
    weightVariants: [],
    weight: '',
    weightUnit: 'g',
    origin: '',
    harvestYear: '',
    packaging: '',
    shelfLife: '',
    storageInstructions: '',
    image: '',
    images: [],
    shortDescription: '',
    description: '',
    nutritionalInfo: '',
    benefits: [],
    isNew: false,
    isFeatured: false,
    isBestSeller: false,
    isOnSale: false,
    isOrganic: false,
    isPremium: false,
    status: 'active',
    rating: 0,
    reviewCount: 0
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [usedSkus, setUsedSkus] = useState<string[]>([]);

  // ✅ New Variant State
  const [newVariant, setNewVariant] = useState<WeightVariant>({
    id: '',
    weight: '',
    weightUnit: 'g',
    price: 0,
    oldPrice: 0,
    discount: 0,
    stock: 0,
    sku: ''
  });

  // ✅ Generate SKU on category change
  useEffect(() => {
    if (formData.category && formData.sku === '') {
      const count = usedSkus.length + 1;
      const newSku = generateSku(formData.category, count);
      setFormData(prev => ({ ...prev, sku: newSku }));
    }
  }, [formData.category, usedSkus]);

  // ✅ Fetch used SKUs
  useEffect(() => {
    const fetchUsedSkus = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('category', 'in', ['dryfruits', 'dry-fruits'])
        );
        const snapshot = await getDocs(q);
        const skus = snapshot.docs.map(doc => doc.data().sku).filter(Boolean);
        setUsedSkus(skus);
      } catch (error) {
        console.error('Error fetching SKUs:', error);
      }
    };
    fetchUsedSkus();
  }, []);

  // ✅ Fetch product if edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchProduct(id);
    }
  }, [id, isEditMode]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (productDoc.exists()) {
        const data = productDoc.data();
        setFormData({
          name: data.name || '',
          brand: data.brand || '',
          sku: data.sku || '',
          category: data.subCategory || data.category || '',
          subCategory: data.subCategory || '',
          productType: data.productType || '',
          price: data.price || 0,
          oldPrice: data.oldPrice || 0,
          discount: data.discount || 0,
          costPrice: data.costPrice || 0,
          stock: data.stock || 0,
          lowStockAlert: data.lowStockAlert || 5,
          weightVariants: data.weightVariants || [],
          weight: data.weight || '',
          weightUnit: data.weightUnit || 'g',
          origin: data.origin || '',
          harvestYear: data.harvestYear || '',
          packaging: data.packaging || '',
          shelfLife: data.shelfLife || '',
          storageInstructions: data.storageInstructions || '',
          image: data.image || '',
          images: data.images || [],
          shortDescription: data.shortDescription || '',
          description: data.description || '',
          nutritionalInfo: data.nutritionalInfo || '',
          benefits: data.benefits || [],
          isNew: data.isNew || false,
          isFeatured: data.isFeatured || false,
          isBestSeller: data.isBestSeller || false,
          isOnSale: data.isOnSale || false,
          isOrganic: data.isOrganic || false,
          isPremium: data.isPremium || false,
          status: data.status || 'active',
          rating: data.rating || 0,
          reviewCount: data.reviewCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `dryfruits/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: url }));
      setImageUrlInput('');
    } catch (error) {
      console.error('Error uploading main image:', error);
      alert('Failed to upload main image');
    } finally {
      setUploading(false);
    }
  };

  const handleMainImageUrl = () => {
    if (!imageUrlInput.trim()) {
      alert('Please enter a valid image URL');
      return;
    }
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
        const url = await uploadImage(file);
        urls.push(url);
      }
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...urls] 
      }));
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      alert('Failed to upload gallery images');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleBenefitToggle = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  // ✅ Check if SKU is used
  const isSkuUsed = (sku: string) => {
    return usedSkus.includes(sku) && sku !== formData.sku;
  };

  // ✅ Add Variant
  const addVariant = () => {
    if (!newVariant.weight) {
      alert('Please select weight');
      return;
    }
    if (!newVariant.price || newVariant.price <= 0) {
      alert('Please enter valid price');
      return;
    }
    
    // Check if weight already exists
    if (formData.weightVariants.some(v => v.weight === newVariant.weight && v.weightUnit === newVariant.weightUnit)) {
      alert('This weight variant already exists');
      return;
    }

    const variantId = Date.now().toString();
    const variantSku = generateVariantSku(formData.sku || 'MDF', newVariant.weight);
    
    setFormData(prev => ({
      ...prev,
      weightVariants: [...prev.weightVariants, {
        ...newVariant,
        id: variantId,
        sku: variantSku
      }]
    }));

    // Reset new variant form
    setNewVariant({
      id: '',
      weight: '',
      weightUnit: 'g',
      price: 0,
      oldPrice: 0,
      discount: 0,
      stock: 0,
      sku: ''
    });
  };

  // ✅ Remove Variant
  const removeVariant = (id: string) => {
    if (!confirm('Remove this weight variant?')) return;
    setFormData(prev => ({
      ...prev,
      weightVariants: prev.weightVariants.filter(v => v.id !== id)
    }));
  };

  // ✅ Update Variant
  const updateVariant = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      weightVariants: prev.weightVariants.map(v => 
        v.id === id ? { ...v, [field]: value } : v
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name) { alert('Please enter product name'); return; }
    if (!formData.category) { alert('Please select category'); return; }
    if (!formData.image) { alert('Please upload or add main image URL'); return; }
    if (formData.weightVariants.length === 0 && !formData.price) { 
      alert('Please add at least one weight variant OR set a base price'); 
      return; 
    }

    setSaving(true);
    setError(null);

    try {
      const productData = {
        name: formData.name,
        brand: formData.brand || '',
        sku: formData.sku || '',
        category: 'dryfruits',
        subCategory: formData.category,
        productType: formData.productType || '',
        // ✅ Base price (default - use first variant price if available)
        price: formData.weightVariants.length > 0 ? formData.weightVariants[0].price : formData.price,
        oldPrice: formData.weightVariants.length > 0 ? formData.weightVariants[0].oldPrice : formData.oldPrice,
        discount: formData.discount || 0,
        costPrice: formData.costPrice || 0,
        stock: formData.stock || 0,
        lowStockAlert: formData.lowStockAlert || 5,
        // ✅ Weight Variants
        weightVariants: formData.weightVariants,
        weight: formData.weight || '',
        weightUnit: formData.weightUnit || 'g',
        origin: formData.origin || '',
        harvestYear: formData.harvestYear || '',
        packaging: formData.packaging || '',
        shelfLife: formData.shelfLife || '',
        storageInstructions: formData.storageInstructions || '',
        image: formData.image,
        images: formData.images || [],
        shortDescription: formData.shortDescription || '',
        description: formData.description || '',
        nutritionalInfo: formData.nutritionalInfo || '',
        benefits: formData.benefits || [],
        isNew: formData.isNew || false,
        isFeatured: formData.isFeatured || false,
        isBestSeller: formData.isBestSeller || false,
        isOnSale: formData.isOnSale || false,
        isOrganic: formData.isOrganic || false,
        isPremium: formData.isPremium || false,
        status: formData.status || 'active',
        rating: formData.rating || 0,
        reviewCount: formData.reviewCount || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('🔵 Dry Fruits Product Data:', productData);

      if (isEditMode && id) {
        await updateDoc(doc(db, 'products', id), productData);
        alert('✅ Dry fruits product updated successfully!');
      } else {
        const docRef = await addDoc(collection(db, 'products'), productData);
        console.log('✅ Dry fruits product added with ID:', docRef.id);
        alert('✅ Dry fruits product added successfully!');
      }
      
      navigate('/admin/products');
    } catch (error: any) {
      console.error('❌ Error:', error);
      alert(`❌ Failed to save product: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E]"></div>
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
            className="text-gray-500 hover:text-gray-700 transition p-2 rounded-lg hover:bg-gray-100"
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {isEditMode ? '✏️ Edit' : '➕ Add'} Dry Fruits Product
              <span className="text-sm font-normal text-gray-400 bg-[#F8FAFC] px-3 py-1 rounded-full">
                <FaSeedling className="inline mr-1" /> Premium Quality
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode ? 'Update dry fruits product details' : 'Create a new dry fruits product'}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2 text-sm"
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
        {/* ============================================================
        1. BASIC INFORMATION
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaTag className="text-[#D4AF37]" /> 1. Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Premium American Almonds"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g., MAHA ONE"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="MDF-ALM-001"
                  className={`flex-1 px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none ${
                    isSkuUsed(formData.sku) ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {formData.sku && (
                  <span className={`text-xs font-medium ${isSkuUsed(formData.sku) ? 'text-red-500' : 'text-green-600'}`}>
                    {isSkuUsed(formData.sku) ? '🔴 Used' : '🟢 Available'}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
              >
                <option value="">Select Category</option>
                {dryFruitsCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              >
                <option value="">Select Type</option>
                {productTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              >
                <option value="active">🟢 Active</option>
                <option value="draft">🟡 Draft</option>
                <option value="out-of-stock">🔴 Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* ============================================================
        2. WEIGHT VARIANTS - Multiple Prices
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaList className="text-[#D4AF37]" /> 2. Weight Variants (Different Prices)
          </h3>
          
          {/* Add Variant Form */}
          <div className="bg-[#F8FAFC] p-4 rounded-lg border border-gray-200 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Weight</label>
                <select
                  value={newVariant.weight}
                  onChange={(e) => setNewVariant({ ...newVariant, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
                >
                  <option value="">Select</option>
                  {weightOptions.map((w) => (
                    <option key={w} value={w}>{w}g</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                <select
                  value={newVariant.weightUnit}
                  onChange={(e) => setNewVariant({ ...newVariant, weightUnit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
                >
                  {weightUnits.map((unit) => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Price (Rs.)</label>
                <input
                  type="number"
                  placeholder="1250"
                  value={newVariant.price}
                  onChange={(e) => setNewVariant({ ...newVariant, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Old Price</label>
                <input
                  type="number"
                  placeholder="1500"
                  value={newVariant.oldPrice}
                  onChange={(e) => setNewVariant({ ...newVariant, oldPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
                <input
                  type="number"
                  placeholder="50"
                  value={newVariant.stock}
                  onChange={(e) => setNewVariant({ ...newVariant, stock: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addVariant}
                  className="w-full bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition text-sm flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Variants List */}
          {formData.weightVariants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Weight</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Old Price</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                    <th className="px-4 py-2 text-left">SKU</th>
                    <th className="px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.weightVariants.map((variant) => (
                    <tr key={variant.id}>
                      <td className="px-4 py-2 font-medium">
                        {variant.weight}{variant.weightUnit}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) => updateVariant(variant.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={variant.oldPrice}
                          onChange={(e) => updateVariant(variant.id, 'oldPrice', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => updateVariant(variant.id, 'stock', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
                        />
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-500 font-mono">{variant.sku}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeVariant(variant.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm">
              No weight variants added. Add at least one variant.
            </div>
          )}
        </div>

        {/* ============================================================
        3. WEIGHT & PACKAGING (Base)
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaWeightHanging className="text-[#D4AF37]" /> 3. Weight & Packaging (Base Info)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Weight</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="250"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                />
                <select
                  name="weightUnit"
                  value={formData.weightUnit}
                  onChange={handleInputChange}
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                >
                  {weightUnits.map((unit) => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
              <select
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              >
                <option value="">Select Origin</option>
                {origins.map((origin) => (
                  <option key={origin} value={origin}>{origin}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Packaging</label>
              <select
                name="packaging"
                value={formData.packaging}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              >
                <option value="">Select Packaging</option>
                {packagingTypes.map((pkg) => (
                  <option key={pkg} value={pkg}>{pkg}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ============================================================
        4. INVENTORY
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaBox className="text-[#D4AF37]" /> 4. Inventory
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="50"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Or set per variant above</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
              <input
                type="number"
                name="lowStockAlert"
                value={formData.lowStockAlert}
                onChange={handleInputChange}
                placeholder="5"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Life</label>
              <select
                name="shelfLife"
                value={formData.shelfLife}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              >
                <option value="">Select Shelf Life</option>
                {shelfLifeOptions.map((life) => (
                  <option key={life} value={life}>{life}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ============================================================
        5. IMAGES
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCloudUploadAlt className="text-[#D4AF37]" /> 5. Images
          </h3>
          
          {/* Main Image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Product Image *</label>
            <div className="flex items-center gap-4 mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="hidden"
                id="mainImageUpload"
                disabled={uploading}
              />
              <label
                htmlFor="mainImageUpload"
                className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition cursor-pointer text-sm flex items-center gap-2"
              >
                {uploading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />}
                {uploading ? 'Uploading...' : 'Upload Image'}
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm flex items-center gap-2"
              >
                <FaLink /> Add URL
              </button>
            </div>
            {showUrlInput && (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={handleMainImageUrl}
                  className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition text-sm"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => { setShowUrlInput(false); setImageUrlInput(''); }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
            {formData.image && (
              <div className="relative inline-block mt-2">
                <img src={formData.image} alt="Main" className="w-24 h-24 object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Product Images</label>
            <div className="flex items-center gap-4 mb-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImagesUpload}
                className="hidden"
                id="galleryImagesUpload"
                disabled={uploading}
              />
              <label
                htmlFor="galleryImagesUpload"
                className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition cursor-pointer text-sm flex items-center gap-2"
              >
                {uploading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />}
                {uploading ? 'Uploading...' : 'Upload Images'}
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm flex items-center gap-2"
              >
                <FaLink /> Add URL
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.images.map((img: string, index: number) => (
                <div key={index} className="relative">
                  <img src={img} alt={`Gallery ${index}`} className="w-20 h-20 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
        6. DESCRIPTION & DETAILS
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaTag className="text-[#D4AF37]" /> 6. Description & Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Brief product description..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Full product description..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nutritional Information</label>
              <textarea
                name="nutritionalInfo"
                value={formData.nutritionalInfo}
                onChange={handleInputChange}
                placeholder="Calories, Protein, Fat, etc..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Storage Instructions</label>
              <input
                type="text"
                name="storageInstructions"
                value={formData.storageInstructions}
                onChange={handleInputChange}
                placeholder="e.g., Store in a cool, dry place away from direct sunlight"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
          </div>
        </div>

        {/* ============================================================
        7. BENEFITS
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaSeedling className="text-[#D4AF37]" /> 7. Health Benefits
          </h3>
          <div className="flex flex-wrap gap-2">
            {benefitOptions.map((benefit) => (
              <button
                key={benefit}
                type="button"
                onClick={() => handleBenefitToggle(benefit)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  formData.benefits.includes(benefit)
                    ? 'bg-[#0F766E] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {formData.benefits.includes(benefit) ? '✓' : '+'} {benefit}
              </button>
            ))}
          </div>
          {formData.benefits.length > 0 && (
            <div className="mt-3 p-3 bg-[#F8FAFC] rounded-lg">
              <p className="text-sm text-gray-600">Selected Benefits: {formData.benefits.join(', ')}</p>
            </div>
          )}
        </div>

        {/* ============================================================
        8. LABELS & TAGS
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaTag className="text-[#D4AF37]" /> 8. Labels & Tags
          </h3>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              🆕 New Arrival
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              ⭐ Featured Product
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              🏆 Best Seller
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isOnSale"
                checked={formData.isOnSale}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              🔥 On Sale
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isOrganic"
                checked={formData.isOrganic}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              🌿 Organic
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isPremium"
                checked={formData.isPremium}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              💎 Premium Quality
            </label>
          </div>
        </div>

        {/* ============================================================
        9. SUBMIT
        ============================================================ */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0F766E] text-white px-6 py-2 rounded-lg hover:bg-[#065F46] transition flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {saving ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDryFruitsForm;
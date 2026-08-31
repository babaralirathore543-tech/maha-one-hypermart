// src/components/pages/AdminSweetsForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaSave, FaTimes, FaPlus,
  FaSpinner, FaArrowLeft,
  FaLink, FaCloudUploadAlt,
  FaCookie, FaBox, FaTag, FaDollarSign,
  FaLeaf, FaStar
} from 'react-icons/fa';
import { db, storage } from '../../config/firebase';
import { 
  collection, addDoc, getDoc, doc, updateDoc,
  query, where, getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// ✅ Sweets Product Interface
interface SweetsProductData {
  name: string;
  brand: string;
  sku: string;
  category: string;
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
  flavor: string;
  ingredients: string;
  origin: string;
  packaging: string;
  shelfLife: string;
  storageInstructions: string;
  dietaryInfo: string[];
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
  isGlutenFree: boolean;
  isVegan: boolean;
  isSugarFree: boolean;
  status: 'active' | 'draft' | 'out-of-stock';
  rating: number;
  reviewCount: number;
}

// ✅ Sweets Categories
const sweetsCategories = [
  { id: 'chocolates', label: 'Chocolates', icon: '🍫' },
  { id: 'candy', label: 'Candies', icon: '🍬' },
  { id: 'toffees', label: 'Toffees & Caramels', icon: '🍭' },
  { id: 'wafer', label: 'Wafers & Crisps', icon: '🧇' },
  { id: 'biscuits', label: 'Biscuits & Cookies', icon: '🍪' },
  { id: 'cakes', label: 'Cakes & Pastries', icon: '🎂' },
  { id: 'brownies', label: 'Brownies & Fudges', icon: '🍫' },
  { id: 'ice-cream', label: 'Ice Cream & Frozen', icon: '🍦' },
  { id: 'puddings', label: 'Puddings & Custards', icon: '🍮' },
  { id: 'jams', label: 'Jams & Spreads', icon: '🍯' },
  { id: 'nuts', label: 'Chocolate Nuts', icon: '🥜' },
  { id: 'gourmet', label: 'Gourmet Sweets', icon: '✨' },
];

// ✅ Weight Units
const weightUnits = [
  { value: 'g', label: 'Grams (g)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'pcs', label: 'Pieces (pcs)' },
  { value: 'pack', label: 'Pack' },
];

// ✅ Flavors
const flavorOptions = [
  'Chocolate', 'Dark Chocolate', 'Milk Chocolate', 'White Chocolate',
  'Caramel', 'Vanilla', 'Strawberry', 'Mango', 'Orange', 'Lemon',
  'Mint', 'Coconut', 'Almond', 'Hazelnut', 'Pistachio', 'Walnut',
  'Coffee', 'Mocha', 'Cappuccino', 'Red Velvet', 'Cheesecake',
  'Tiramisu', 'Matcha', 'Rose', 'Salted Caramel'
];

// ✅ Ingredients
const ingredientOptions = [
  'Cocoa Butter', 'Cocoa Powder', 'Sugar', 'Milk Powder', 'Condensed Milk',
  'Butter', 'Cream', 'Nuts', 'Almonds', 'Hazelnuts', 'Pistachios', 'Walnuts',
  'Dried Fruits', 'Raisins', 'Dates', 'Coconut', 'Honey', 'Maple Syrup',
  'Vanilla Extract', 'Natural Flavors'
];

// ✅ Dietary Info
const dietaryOptions = [
  'Gluten Free', 'Vegan', 'Vegetarian', 'Organic', 'Non-GMO',
  'Sugar Free', 'Low Sugar', 'Low Fat', 'No Artificial Colors',
  'No Artificial Flavors', 'No Preservatives', 'Kosher', 'Halal'
];

// ✅ Benefits
const benefitOptions = [
  'Rich in Antioxidants', 'Boosts Energy', 'Mood Enhancer',
  'Good for Heart', 'Brain Food', 'Natural Sweetness',
  'Premium Quality', 'Handcrafted', 'Artisan Made',
  'Perfect Gift', 'Party Favorite', 'Kids Love It'
];

// ✅ Product Types
const productTypes = [
  'Premium', 'Classic', 'Gourmet', 'Artisan', 'Organic',
  'Sugar Free', 'Gluten Free', 'Vegan', 'Handmade', 'Imported'
];

// ✅ Origins
const origins = [
  'Pakistan', 'Switzerland', 'Belgium', 'France', 'Italy', 'USA',
  'UK', 'Germany', 'Turkey', 'UAE', 'India', 'China'
];

// ✅ Packaging Types
const packagingTypes = [
  'Box', 'Tin Can', 'Glass Jar', 'Plastic Container', 'Paper Box',
  'Gift Box', 'Plastic Pouch', 'Stand-up Pouch', 'Cardboard Box',
  'Eco-friendly Pack', 'Premium Box', 'Wooden Box'
];

// ✅ Shelf Life Options
const shelfLifeOptions = [
  '1 Month', '2 Months', '3 Months', '4 Months', '6 Months',
  '8 Months', '10 Months', '12 Months', '15 Months', '18 Months',
  '24 Months', '36 Months'
];

// ✅ Generate SKU
const generateSku = (category: string, index: number) => {
  const prefix = 'MSS';
  const catCode = category.substring(0, 3).toUpperCase();
  return `${prefix}-${catCode}-${String(index).padStart(3, '0')}`;
};

const AdminSweetsForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<SweetsProductData>({
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
    weight: '',
    weightUnit: 'g',
    flavor: '',
    ingredients: '',
    origin: '',
    packaging: '',
    shelfLife: '',
    storageInstructions: '',
    dietaryInfo: [],
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
    isGlutenFree: false,
    isVegan: false,
    isSugarFree: false,
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
  const [selectedIngredient, setSelectedIngredient] = useState('');

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
          where('category', '==', 'sweets')
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
          weight: data.weight || '',
          weightUnit: data.weightUnit || 'g',
          flavor: data.flavor || '',
          ingredients: data.ingredients || '',
          origin: data.origin || '',
          packaging: data.packaging || '',
          shelfLife: data.shelfLife || '',
          storageInstructions: data.storageInstructions || '',
          dietaryInfo: data.dietaryInfo || [],
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
          isGlutenFree: data.isGlutenFree || false,
          isVegan: data.isVegan || false,
          isSugarFree: data.isSugarFree || false,
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
    const storageRef = ref(storage, `sweets/${Date.now()}_${file.name}`);
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

  const handleDietaryToggle = (dietary: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryInfo: prev.dietaryInfo.includes(dietary)
        ? prev.dietaryInfo.filter(d => d !== dietary)
        : [...prev.dietaryInfo, dietary]
    }));
  };

  const addIngredient = () => {
    if (!selectedIngredient) return;
    if (formData.ingredients) {
      setFormData(prev => ({
        ...prev,
        ingredients: prev.ingredients ? `${prev.ingredients}, ${selectedIngredient}` : selectedIngredient
      }));
    } else {
      setFormData(prev => ({ ...prev, ingredients: selectedIngredient }));
    }
    setSelectedIngredient('');
  };

  // ✅ Check if SKU is used
  const isSkuUsed = (sku: string) => {
    return usedSkus.includes(sku) && sku !== formData.sku;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name) { alert('Please enter product name'); return; }
    if (!formData.category) { alert('Please select category'); return; }
    if (!formData.price) { alert('Please enter price'); return; }
    if (!formData.image) { alert('Please upload or add main image URL'); return; }

    setSaving(true);
    setError(null);

    try {
      const productData = {
        name: formData.name,
        brand: formData.brand || '',
        sku: formData.sku || '',
        category: 'sweets',
        subCategory: formData.category,
        productType: formData.productType || '',
        price: formData.price,
        oldPrice: formData.oldPrice || 0,
        discount: formData.discount || 0,
        costPrice: formData.costPrice || 0,
        stock: formData.stock || 0,
        lowStockAlert: formData.lowStockAlert || 5,
        weight: formData.weight || '',
        weightUnit: formData.weightUnit || 'g',
        flavor: formData.flavor || '',
        ingredients: formData.ingredients || '',
        origin: formData.origin || '',
        packaging: formData.packaging || '',
        shelfLife: formData.shelfLife || '',
        storageInstructions: formData.storageInstructions || '',
        dietaryInfo: formData.dietaryInfo || [],
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
        isGlutenFree: formData.isGlutenFree || false,
        isVegan: formData.isVegan || false,
        isSugarFree: formData.isSugarFree || false,
        status: formData.status || 'active',
        rating: formData.rating || 0,
        reviewCount: formData.reviewCount || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('🔵 Sweets Product Data:', productData);

      if (isEditMode && id) {
        await updateDoc(doc(db, 'products', id), productData);
        alert('✅ Sweets product updated successfully!');
      } else {
        const docRef = await addDoc(collection(db, 'products'), productData);
        console.log('✅ Sweets product added with ID:', docRef.id);
        alert('✅ Sweets product added successfully!');
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
              {isEditMode ? '✏️ Edit' : '➕ Add'} Sweets Product
              <span className="text-sm font-normal text-gray-400 bg-[#F8FAFC] px-3 py-1 rounded-full">
                <FaCookie className="inline mr-1" /> Sweet Treats
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode ? 'Update sweets product details' : 'Create a new sweets product'}
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
                placeholder="e.g., Premium Chocolate Bar"
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
                  placeholder="MSS-CHO-001"
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
                {sweetsCategories.map((cat) => (
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
        2. WEIGHT & DETAILS
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaBox className="text-[#D4AF37]" /> 2. Weight & Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Flavor</label>
              <select
                name="flavor"
                value={formData.flavor}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              >
                <option value="">Select Flavor</option>
                {flavorOptions.map((flavor) => (
                  <option key={flavor} value={flavor}>{flavor}</option>
                ))}
              </select>
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
          </div>
        </div>

        {/* ============================================================
        3. PRICING
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaDollarSign className="text-[#D4AF37]" /> 3. Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="1290"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
              <input
                type="number"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleInputChange}
                placeholder="1500"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleInputChange}
                placeholder="1000"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="50"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
              />
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
        5. INGREDIENTS
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaLeaf className="text-[#D4AF37]" /> 5. Ingredients
          </h3>
          <div className="flex gap-2 mb-3">
            <select
              value={selectedIngredient}
              onChange={(e) => setSelectedIngredient(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
            >
              <option value="">Select Ingredient</option>
              {ingredientOptions.map((ing) => (
                <option key={ing} value={ing}>{ing}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={addIngredient}
              className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition text-sm"
            >
              <FaPlus /> Add
            </button>
          </div>
          {formData.ingredients && (
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">{formData.ingredients}</p>
            </div>
          )}
        </div>

        {/* ============================================================
        6. IMAGES
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCloudUploadAlt className="text-[#D4AF37]" /> 6. Images
          </h3>
          
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images</label>
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
        7. DESCRIPTION & NUTRITION
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaTag className="text-[#D4AF37]" /> 7. Description & Nutrition
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
                placeholder="Calories, Sugar, Fat, Protein, etc..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none resize-y"
              />
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
        8. DIETARY & BENEFITS
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaStar className="text-[#D4AF37]" /> 8. Dietary & Benefits
          </h3>
          
          {/* Dietary Info */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Information</label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((dietary) => (
                <button
                  key={dietary}
                  type="button"
                  onClick={() => handleDietaryToggle(dietary)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    formData.dietaryInfo.includes(dietary)
                      ? 'bg-[#0F766E] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {formData.dietaryInfo.includes(dietary) ? '✓' : '+'} {dietary}
                </button>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
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
          </div>
        </div>

        {/* ============================================================
        9. LABELS & TAGS
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaTag className="text-[#D4AF37]" /> 9. Labels & Tags
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
              ⭐ Featured
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
                name="isGlutenFree"
                checked={formData.isGlutenFree}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              🚫 Gluten Free
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isVegan"
                checked={formData.isVegan}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              🌱 Vegan
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isSugarFree"
                checked={formData.isSugarFree}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              🍬 Sugar Free
            </label>
          </div>
        </div>

        {/* ============================================================
        10. SUBMIT
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

export default AdminSweetsForm;
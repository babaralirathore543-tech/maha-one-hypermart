// src/components/pages/AdminCakesProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaSave, FaTimes, FaPlus, 
  FaSpinner, FaArrowLeft, FaLink, FaCloudUploadAlt,
  FaChevronRight, FaCircle, FaUtensils, 
  FaClock, FaEgg, FaBirthdayCake,
} from 'react-icons/fa';
import { db, storage } from '../../config/firebase';
import { 
  collection, addDoc, getDoc, doc, updateDoc,
  query, where, getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// ✅ Product Interface
interface ProductFormData {
  // Basic
  name: string;
  brand: string;
  sku: string;
  
  // Category
  category: string;
  department: string;
  productType: string;
  style: string;
  
  // Pricing
  price: number;
  oldPrice: number;
  discount: number;
  costPrice: number;
  
  // Inventory
  stock: number;
  lowStockAlert: number;
  orderType: 'ready-stock' | 'made-to-order' | 'pre-order';
  
  // Images
  image: string;
  images: string[];
  
  // Variants
  sizes: string[];
  colors: string[];
  
  // Cake Details
  cakeDetails: {
    flavor: string;
    weight: string;
    shape: string;
    servings: string;
    eggless: boolean;
    customizationAvailable: boolean;
    advanceOrderRequired: boolean;
    preparationTime: string;
    customMessage: string;
  };
  
  // Food Details (Bakery/Savory)
  foodDetails: {
    weight: string;
    quantity: number;
    ingredients: string[];
    expiryDate: string;
    storageInstructions: string;
  };
  
  // Details
  shortDescription: string;
  description: string;
  ingredients: string[];
  nutritionalInfo: string;
  
  // Labels
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  
  // Status
  status: 'active' | 'draft' | 'out-of-stock';
  
  // System
  rating: number;
  reviewCount: number;
}

// ✅ Category Data
const categoryData: Record<string, any> = {
  'cakes-bakery': {
    label: 'Cakes & Bakery',
    icon: '🎂',
    prefix: 'MOB',
    departments: {
      'cakes': {
        label: 'Cakes',
        icon: '🎂',
        productTypes: {
          'birthday-cakes': { label: 'Birthday Cakes' },
          'wedding-cakes': { label: 'Wedding Cakes' },
          'anniversary-cakes': { label: 'Anniversary Cakes' },
          'customized-cakes': { label: 'Customized Cakes' },
          'bento-cakes': { label: 'Bento Cakes' },
          'cupcakes': { label: 'Cupcakes' },
          'cheesecakes': { label: 'Cheesecakes' },
          'pastry-cakes': { label: 'Pastry Cakes' }
        },
        styles: {
          'birthday-cakes': ['Chocolate', 'Vanilla', 'Strawberry', 'Red Velvet', 'Blueberry', 'Caramel', 'Pistachio', 'Mango'],
          'wedding-cakes': ['Classic White', 'Gold', 'Rose', 'Lavender', 'Pearl', 'Rustic', 'Elegant'],
          'anniversary-cakes': ['Chocolate', 'Red Velvet', 'Caramel', 'Strawberry', 'Cream', 'Fruit'],
          'customized-cakes': ['Photo Cake', 'Themed Cake', 'Name Cake', 'Number Cake', 'Character Cake'],
          'bento-cakes': ['Chocolate', 'Vanilla', 'Strawberry', 'Matcha', 'Oreo'],
          'cupcakes': ['Chocolate', 'Vanilla', 'Strawberry', 'Red Velvet', 'Caramel', 'Sprinkles'],
          'cheesecakes': ['Classic', 'Strawberry', 'Blueberry', 'Chocolate', 'Caramel', 'Lemon'],
          'pastry-cakes': ['Chocolate', 'Vanilla', 'Strawberry', 'Caramel', 'Cream']
        }
      },
      'bakery': {
        label: 'Bakery',
        icon: '🍞',
        productTypes: {
          'bread': { label: 'Bread' },
          'buns-rolls': { label: 'Buns & Rolls' },
          'croissants': { label: 'Croissants' },
          'donuts': { label: 'Donuts' },
          'cookies-biscuits': { label: 'Cookies & Biscuits' },
          'brownies': { label: 'Brownies' },
          'muffins': { label: 'Muffins' },
          'pastries': { label: 'Pastries' }
        },
        styles: {
          'bread': ['White', 'Brown', 'Whole Wheat', 'Sourdough', 'Garlic', 'Multigrain'],
          'buns-rolls': ['White', 'Brown', 'Sesame', 'Brioche', 'Cinnamon'],
          'croissants': ['Classic', 'Chocolate', 'Almond', 'Butter', 'Ham & Cheese'],
          'donuts': ['Glazed', 'Chocolate', 'Strawberry', 'Sprinkles', 'Caramel', 'Custard'],
          'cookies-biscuits': ['Chocolate Chip', 'Oatmeal', 'Butter', 'Sugar', 'Peanut Butter'],
          'brownies': ['Classic', 'Walnut', 'Chocolate Chip', 'Fudge', 'Caramel'],
          'muffins': ['Blueberry', 'Chocolate', 'Banana', 'Strawberry', 'Carrot'],
          'pastries': ['Cream', 'Fruit', 'Chocolate', 'Almond', 'Custard']
        }
      },
      'savory-snacks': {
        label: 'Savory & Snacks',
        icon: '🍕',
        productTypes: {
          'pizza': { label: 'Pizza' },
          'patties': { label: 'Patties' },
          'sandwiches': { label: 'Sandwiches' },
          'burgers': { label: 'Burgers' },
          'rolls': { label: 'Rolls' },
          'samosas': { label: 'Samosas' }
        },
        styles: {
          'pizza': ['Chicken', 'Beef', 'Veggie', 'Pepperoni', 'Margherita', 'BBQ Chicken'],
          'patties': ['Chicken', 'Beef', 'Veggie', 'Fish', 'Cheese'],
          'sandwiches': ['Chicken', 'Beef', 'Veggie', 'Club', 'Grilled Cheese'],
          'burgers': ['Chicken', 'Beef', 'Veggie', 'Cheese', 'Mushroom'],
          'rolls': ['Chicken', 'Beef', 'Veggie', 'Spring Roll', 'Egg Roll'],
          'samosas': ['Chicken', 'Beef', 'Veggie', 'Cheese']
        }
      },
      'specials': {
        label: 'Special & Seasonal',
        icon: '🎁',
        productTypes: {
          'gift-boxes': { label: 'Gift Boxes' },
          'ramadan-specials': { label: 'Ramadan Specials' },
          'eid-specials': { label: 'Eid Specials' },
          'valentine-specials': { label: "Valentine's Specials" }
        },
        styles: {
          'gift-boxes': ['Premium Box', 'Standard Box', 'Mini Box', 'Custom Box'],
          'ramadan-specials': ['Dates Box', 'Dry Fruits Box', 'Sweets Box', 'Combo Pack'],
          'eid-specials': ['Eid Gift Box', 'Eid Sweets', 'Eid Combo', 'Eid Bakery'],
          'valentine-specials': ['Heart Cake', 'Valentine Box', 'Love Combo', 'Chocolate Box']
        }
      }
    }
  }
};

// ✅ Size Options
const sizeOptions = ['Small', 'Medium', 'Large', 'Extra Large', 'One Size', 'Free Size'];

// ✅ Cake Shapes
const cakeShapes = ['Round', 'Square', 'Heart', 'Oval', 'Rectangle', 'Custom'];

// ✅ Order Types
const orderTypes = [
  { value: 'ready-stock', label: 'Ready Stock' },
  { value: 'made-to-order', label: 'Made to Order' },
  { value: 'pre-order', label: 'Pre-Order' }
];

// ✅ Flavor Options (Common)
const flavorOptions = [
  'Chocolate', 'Vanilla', 'Strawberry', 'Red Velvet', 'Blueberry',
  'Caramel', 'Pistachio', 'Mango', 'Lemon', 'Orange', 'Coffee',
  'Matcha', 'Oreo', 'Cream', 'Fruit'
];

const AdminCakesProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    sku: '',
    category: '',
    department: '',
    productType: '',
    style: '',
    price: 0,
    oldPrice: 0,
    discount: 0,
    costPrice: 0,
    stock: 0,
    lowStockAlert: 5,
    orderType: 'ready-stock',
    image: '',
    images: [],
    sizes: [],
    colors: [],
    cakeDetails: {
      flavor: '',
      weight: '',
      shape: '',
      servings: '',
      eggless: false,
      customizationAvailable: false,
      advanceOrderRequired: false,
      preparationTime: '',
      customMessage: ''
    },
    foodDetails: {
      weight: '',
      quantity: 1,
      ingredients: [],
      expiryDate: '',
      storageInstructions: ''
    },
    shortDescription: '',
    description: '',
    ingredients: [],
    nutritionalInfo: '',
    isNew: false,
    isFeatured: false,
    isBestSeller: false,
    isOnSale: false,
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
  const [newSize, setNewSize] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [usedProductIds, setUsedProductIds] = useState<string[]>([]);

  // ✅ Get current category data
  const currentCategory = formData.category ? categoryData[formData.category] : null;
  const categoryPrefix = currentCategory?.prefix || '';

  // ✅ Get current department data
  const currentDepartment = formData.department && currentCategory
    ? currentCategory.departments[formData.department]
    : null;

  // ✅ Get current product type data

  // ✅ Get styles for current product type
  const getStyles = (): string[] => {
    if (!formData.department || !formData.productType) return [];
    const styles = currentDepartment?.styles || {};
    return styles[formData.productType] || [];
  };

  // ✅ Get departments
  const getDepartments = () => {
    if (!formData.category || !currentCategory) return {};
    return currentCategory.departments || {};
  };

  // ✅ Get product types
  const getProductTypes = () => {
    if (!formData.department || !currentDepartment) return {};
    return currentDepartment.productTypes || {};
  };

  // ✅ Generate Product IDs
  const generateProductIds = (prefix: string) => {
    const ids: string[] = [];
    for (let i = 1; i <= 100; i++) {
      ids.push(`${prefix}-${String(i).padStart(3, '0')}`);
    }
    return ids;
  };

  // ✅ Fetch used product IDs
  const fetchUsedProductIds = async (prefix: string) => {
    try {
      const q = query(
        collection(db, 'products'),
        where('sku', '>=', `${prefix}-001`),
        where('sku', '<=', `${prefix}-100`)
      );
      const snapshot = await getDocs(q);
      const usedIds = snapshot.docs.map(doc => doc.data().sku);
      setUsedProductIds(usedIds);
    } catch (error) {
      console.error('Error fetching product IDs:', error);
    }
  };

  // ✅ When category changes, update product IDs
  useEffect(() => {
    if (formData.category && categoryPrefix) {
      fetchUsedProductIds(categoryPrefix);
      if (!formData.sku) {
        const allIds = generateProductIds(categoryPrefix);
        const available = allIds.filter(id => !usedProductIds.includes(id));
        if (available.length > 0) {
          setFormData(prev => ({ ...prev, sku: available[0] }));
        }
      }
    }
  }, [formData.category, categoryPrefix]);

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
          category: data.category || '',
          department: data.department || '',
          productType: data.productType || '',
          style: data.style || '',
          price: data.price || 0,
          oldPrice: data.oldPrice || 0,
          discount: data.discount || 0,
          costPrice: data.costPrice || 0,
          stock: data.stock || 0,
          lowStockAlert: data.lowStockAlert || 5,
          orderType: data.orderType || 'ready-stock',
          image: data.image || '',
          images: data.images || [],
          sizes: data.sizes || [],
          colors: data.colors || [],
          cakeDetails: data.cakeDetails || {
            flavor: '',
            weight: '',
            shape: '',
            servings: '',
            eggless: false,
            customizationAvailable: false,
            advanceOrderRequired: false,
            preparationTime: '',
            customMessage: ''
          },
          foodDetails: data.foodDetails || {
            weight: '',
            quantity: 1,
            ingredients: [],
            expiryDate: '',
            storageInstructions: ''
          },
          shortDescription: data.shortDescription || '',
          description: data.description || '',
          ingredients: data.ingredients || [],
          nutritionalInfo: data.nutritionalInfo || '',
          isNew: data.isNew || false,
          isFeatured: data.isFeatured || false,
          isBestSeller: data.isBestSeller || false,
          isOnSale: data.isOnSale || false,
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
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
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

  const handleGalleryImageUrl = () => {
    if (!imageUrlInput.trim()) {
      alert('Please enter a valid image URL');
      return;
    }
    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, imageUrlInput] 
    }));
    setImageUrlInput('');
    setShowUrlInput(false);
  };

  const addSize = () => {
    if (!newSize.trim()) {
      alert('Please select a size');
      return;
    }
    if (formData.sizes.includes(newSize)) {
      alert('This size already exists');
      return;
    }
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, newSize]
    }));
    setNewSize('');
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addIngredient = () => {
    if (!newIngredient.trim()) {
      alert('Please enter an ingredient');
      return;
    }
    if (formData.ingredients.includes(newIngredient)) {
      alert('This ingredient already exists');
      return;
    }
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient]
    }));
    setNewIngredient('');
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Handle nested cakeDetails
    if (name.startsWith('cakeDetails.')) {
      const field = name.replace('cakeDetails.', '');
      setFormData(prev => ({
        ...prev,
        cakeDetails: {
          ...prev.cakeDetails,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
      return;
    }

    // Handle nested foodDetails
    if (name.startsWith('foodDetails.')) {
      const field = name.replace('foodDetails.', '');
      setFormData(prev => ({
        ...prev,
        foodDetails: {
          ...prev.foodDetails,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  // ✅ Handle Category Change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      category: value,
      department: '',
      productType: '',
      style: '',
      sku: ''
    }));
  };

  // ✅ Handle Department Change
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      department: value,
      productType: '',
      style: ''
    }));
  };

  // ✅ Handle Product Type Change
  const handleProductTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      productType: value,
      style: ''
    }));
  };

  // ✅ Check if SKU is used
  const isSkuUsed = (sku: string) => {
    return usedProductIds.includes(sku);
  };

  // ✅ Get status color for SKU
  const getSkuStatus = (sku: string) => {
    if (isSkuUsed(sku)) {
      return 'bg-red-100 text-red-700 border-red-300';
    }
    return 'bg-green-100 text-green-700 border-green-300';
  };

  // ✅ Calculate discount automatically
  useEffect(() => {
    if (formData.oldPrice > formData.price) {
      const discount = Math.round(((formData.oldPrice - formData.price) / formData.oldPrice) * 100);
      setFormData(prev => ({ ...prev, discount }));
    } else {
      setFormData(prev => ({ ...prev, discount: 0 }));
    }
  }, [formData.price, formData.oldPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name) { alert('Please enter product name'); return; }
    if (!formData.price) { alert('Please enter price'); return; }
    if (!formData.category) { alert('Please select category'); return; }
    if (!formData.department) { alert('Please select department'); return; }
    if (!formData.productType) { alert('Please select product type'); return; }
    if (!formData.image) { alert('Please upload or add main image URL'); return; }

    setSaving(true);
    setError(null);

    try {
      const productData = {
        // Basic
        name: formData.name,
        brand: formData.brand || '',
        sku: formData.sku || '',
        
        // Category
        category: formData.category,
        department: formData.department,
        productType: formData.productType,
        style: formData.style || '',
        
        // Pricing
        price: formData.price,
        oldPrice: formData.oldPrice || 0,
        discount: formData.discount || 0,
        costPrice: formData.costPrice || 0,
        
        // Inventory
        stock: formData.stock || 0,
        lowStockAlert: formData.lowStockAlert || 5,
        orderType: formData.orderType || 'ready-stock',
        
        // Images
        image: formData.image,
        images: formData.images || [],
        
        // Variants
        sizes: formData.sizes || [],
        colors: formData.colors || [],
        
        // Cake Details
        cakeDetails: formData.cakeDetails,
        
        // Food Details
        foodDetails: formData.foodDetails,
        
        // Details
        shortDescription: formData.shortDescription || '',
        description: formData.description || '',
        ingredients: formData.ingredients || [],
        nutritionalInfo: formData.nutritionalInfo || '',
        
        // Labels
        isNew: formData.isNew || false,
        isFeatured: formData.isFeatured || false,
        isBestSeller: formData.isBestSeller || false,
        isOnSale: formData.isOnSale || false,
        
        // Status
        status: formData.status || 'active',
        
        // System
        rating: formData.rating || 0,
        reviewCount: formData.reviewCount || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('🔵 Product Data:', productData);

      if (isEditMode && id) {
        await updateDoc(doc(db, 'products', id), productData);
        alert('✅ Product updated successfully!');
      } else {
        const docRef = await addDoc(collection(db, 'products'), productData);
        console.log('✅ Product added with ID:', docRef.id);
        alert('✅ Product added successfully!');
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

  // ✅ Get all select options
  const departments = getDepartments();
  const productTypes = getProductTypes();
  const styles = getStyles();

  // ✅ Show cake details only when department is 'cakes'
  const showCakeDetails = formData.department === 'cakes';
  
  // ✅ Show food details only when department is 'bakery' or 'savory-snacks'
  const showFoodDetails = formData.department === 'bakery' || formData.department === 'savory-snacks';

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
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditMode ? '✏️ Edit Product' : '➕ Add New Product'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode ? 'Update product details' : 'Create a new cake or bakery product'}
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 1. Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Premium Chocolate Birthday Cake"
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
                placeholder="e.g., Maha One Bakery"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU / Code</label>
              <div className="flex items-center gap-2">
                <select
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  className={`flex-1 px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none ${getSkuStatus(formData.sku)}`}
                >
                  <option value="">Select SKU</option>
                  {generateProductIds(categoryPrefix).map((id) => (
                    <option key={id} value={id} className={isSkuUsed(id) ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'}>
                      {id} {isSkuUsed(id) ? '🔴 (Used)' : '🟢 (Available)'}
                    </option>
                  ))}
                </select>
                <span className="text-xs whitespace-nowrap">
                  {formData.sku && (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSkuStatus(formData.sku)}`}>
                      <FaCircle className="text-[8px]" />
                      {isSkuUsed(formData.sku) ? 'Used' : 'Available'}
                    </span>
                  )}
                </span>
              </div>
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
        2. CATEGORY
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏷️ 2. Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Category *</label>
              <select
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
              >
                <option value="">Select Category</option>
                <option value="cakes-bakery">🎂 Cakes & Bakery</option>
              </select>
            </div>

            {/* Department */}
            {formData.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select
                  value={formData.department}
                  onChange={handleDepartmentChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                  required
                >
                  <option value="">Select Department</option>
                  {Object.keys(departments).map((key) => (
                    <option key={key} value={key}>
                      {departments[key]?.icon || '📦'} {departments[key]?.label || key}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Product Type */}
            {formData.department && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
                <select
                  value={formData.productType}
                  onChange={handleProductTypeChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                  required
                >
                  <option value="">Select Product Type</option>
                  {Object.keys(productTypes).map((key) => (
                    <option key={key} value={key}>
                      {productTypes[key]?.label || key}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Style */}
            {formData.productType && styles.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style/Variant</label>
                <select
                  value={formData.style}
                  onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                >
                  <option value="">Select Style</option>
                  {styles.map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Category Path Display */}
            {formData.category && (
              <div className="md:col-span-2">
                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-gray-200 flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                  <span className="text-xl">🎂</span>
                  <span className="font-medium">Cakes & Bakery</span>
                  {formData.department && (
                    <>
                      <FaChevronRight className="text-gray-400 text-xs" />
                      <span>{departments[formData.department]?.icon || ''} {departments[formData.department]?.label || formData.department}</span>
                    </>
                  )}
                  {formData.productType && (
                    <>
                      <FaChevronRight className="text-gray-400 text-xs" />
                      <span>{productTypes[formData.productType]?.label || formData.productType}</span>
                    </>
                  )}
                  {formData.style && (
                    <>
                      <FaChevronRight className="text-gray-400 text-xs" />
                      <span className="text-[#D4AF37] font-medium">{formData.style}</span>
                    </>
                  )}
                  {formData.sku && (
                    <>
                      <FaChevronRight className="text-gray-400 text-xs" />
                      <span className={`font-mono font-semibold ${isSkuUsed(formData.sku) ? 'text-red-500' : 'text-green-600'}`}>
                        {formData.sku}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
        3. ORDER TYPE
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📦 3. Order Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Type *</label>
              <select
                name="orderType"
                value={formData.orderType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              >
                {orderTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            {formData.orderType === 'made-to-order' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time</label>
                <input
                  type="text"
                  name="cakeDetails.preparationTime"
                  value={formData.cakeDetails.preparationTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 24 Hours"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
        4. PRICING
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 4. Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="2500"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Old / Regular Price</label>
              <input
                type="number"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleInputChange}
                placeholder="2800"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (Auto)</label>
              <div className="px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-semibold">
                {formData.discount || 0}%
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (Admin)</label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleInputChange}
                placeholder="2000"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
          </div>
        </div>

        {/* ============================================================
        5. INVENTORY
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📦 5. Inventory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="10"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
              <input
                type="number"
                name="lowStockAlert"
                value={formData.lowStockAlert}
                onChange={handleInputChange}
                placeholder="3"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
          </div>
        </div>

        {/* ============================================================
        6. CAKE DETAILS (Conditional)
        ============================================================ */}
        {showCakeDetails && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaBirthdayCake className="text-[#D4AF37]" /> 6. Cake Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flavor</label>
                <select
                  name="cakeDetails.flavor"
                  value={formData.cakeDetails.flavor}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight / Size</label>
                <input
                  type="text"
                  name="cakeDetails.weight"
                  value={formData.cakeDetails.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 Pound, 1kg"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
                <select
                  name="cakeDetails.shape"
                  value={formData.cakeDetails.shape}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                >
                  <option value="">Select Shape</option>
                  {cakeShapes.map((shape) => (
                    <option key={shape} value={shape}>{shape}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
                <input
                  type="text"
                  name="cakeDetails.servings"
                  value={formData.cakeDetails.servings}
                  onChange={handleInputChange}
                  placeholder="e.g., 8-10 People"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                />
              </div>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="cakeDetails.eggless"
                    checked={formData.cakeDetails.eggless}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
                  />
                  <FaEgg className="text-gray-400" /> Eggless
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="cakeDetails.customizationAvailable"
                    checked={formData.cakeDetails.customizationAvailable}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
                  />
                  🎨 Customization Available
                </label>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="cakeDetails.advanceOrderRequired"
                    checked={formData.cakeDetails.advanceOrderRequired}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
                  />
                  <FaClock className="text-gray-400" /> Advance Order Required
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Message</label>
                <input
                  type="text"
                  name="cakeDetails.customMessage"
                  value={formData.cakeDetails.customMessage}
                  onChange={handleInputChange}
                  placeholder="e.g., Happy Birthday! 🎂"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
        7. FOOD DETAILS (Conditional)
        ============================================================ */}
        {showFoodDetails && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaUtensils className="text-[#D4AF37]" /> 7. Food Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <input
                  type="text"
                  name="foodDetails.weight"
                  value={formData.foodDetails.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 500g, 1kg"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity per Pack</label>
                <input
                  type="number"
                  name="foodDetails.quantity"
                  value={formData.foodDetails.quantity}
                  onChange={handleInputChange}
                  placeholder="1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  name="foodDetails.expiryDate"
                  value={formData.foodDetails.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage Instructions</label>
                <input
                  type="text"
                  name="foodDetails.storageInstructions"
                  value={formData.foodDetails.storageInstructions}
                  onChange={handleInputChange}
                  placeholder="e.g., Store in a cool, dry place"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
        8. IMAGES
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🖼️ 8. Images</h3>
          
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
                  onClick={handleGalleryImageUrl}
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
        9. SIZES
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📏 9. Sizes</h3>
          <div className="flex flex-wrap gap-3">
            <select
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
            >
              <option value="">Select Size</option>
              {sizeOptions.map((s: string) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={addSize}
              className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition text-sm"
            >
              <FaPlus className="inline mr-1" /> Add Size
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.sizes.map((size: string) => (
              <span
                key={size}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {size}
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
            {formData.sizes.length === 0 && (
              <span className="text-sm text-gray-400">No sizes added yet</span>
            )}
          </div>
        </div>

        {/* ============================================================
        10. INGREDIENTS
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🧾 10. Ingredients</h3>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Enter ingredient"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
            />
            <button
              type="button"
              onClick={addIngredient}
              className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition text-sm"
            >
              <FaPlus className="inline mr-1" /> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.ingredients.map((ingredient: string, index: number) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {ingredient}
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
            {formData.ingredients.length === 0 && (
              <span className="text-sm text-gray-400">No ingredients added yet</span>
            )}
          </div>
        </div>

        {/* ============================================================
        11. DETAILS
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 11. Product Details</h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Nutritional Info</label>
              <input
                type="text"
                name="nutritionalInfo"
                value={formData.nutritionalInfo}
                onChange={handleInputChange}
                placeholder="e.g., Calories: 250 kcal per serving"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
          </div>
        </div>

        {/* ============================================================
        12. LABELS
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏷️ 12. Product Labels</h3>
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
          </div>
        </div>

        {/* ============================================================
        13. SUBMIT
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

export default AdminCakesProductForm;
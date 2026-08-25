// src/components/pages/AdminProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaSave, FaTimes, FaPlus, FaTrash, 
  FaPalette,  FaSpinner, FaArrowLeft,
   FaRuler,
  FaLink, FaCloudUploadAlt
} from 'react-icons/fa';
import { db, storage } from '../../config/firebase';
import { 
  collection, addDoc, getDoc, doc, updateDoc,
  
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ProductFormData {
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  category: string;
  subCategory: string;
  image: string;
  images: string[];
  colorImages: { [key: string]: string[] };
  sizes: string[];
  colors: string[];
  stock: number;
  description: string;
  material: string;
  careInstructions: string;
  isNew: boolean;
  isFeatured: boolean;
}

const AdminProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    oldPrice: 0,
    discount: 0,
    rating: 0,
    category: '',
    subCategory: '',
    image: '',
    images: [],
    colorImages: {},
    sizes: [],
    colors: [],
    stock: 0,
    description: '',
    material: '',
    careInstructions: '',
    isNew: false,
    isFeatured: false
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  
  const [newColor, setNewColor] = useState('');
  const [newColorImages, setNewColorImages] = useState<string[]>([]);
  const [newColorUrlInput, setNewColorUrlInput] = useState('');
  const [showColorUrlInput, setShowColorUrlInput] = useState(false);
  
  const [newSize, setNewSize] = useState('');

  const categoryOptions = [
    'women', 'men', 'kids', 'fashion', 'sarees', 
    'dresses', 'jewellery', 'unstitched', 'shoes',
    'accessories', 'bags', 'dryfruits', 'sweets', 'cakes'
  ];

  const subCategoryOptions = [
    'Sarees', 'Dresses', 'Jewellery', 'Unstitched',
    'Shoes', 'Accessories', 'Bags', 'Dry Fruits',
    'Sweets', 'Cakes', 'Bridal', 'Festive'
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size', 'Free Size'];

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
          price: data.price || 0,
          oldPrice: data.oldPrice || 0,
          discount: data.discount || data.discountPrice || 0,
          rating: data.rating || 0,
          category: data.category || '',
          subCategory: data.subCategory || '',
          image: data.image || '',
          images: data.images || [],
          colorImages: data.colorImages || {},
          sizes: data.sizes || [],
          colors: data.colors || [],
          stock: data.stock || 0,
          description: data.description || '',
          material: data.material || '',
          careInstructions: data.careInstructions || '',
          isNew: data.isNew || false,
          isFeatured: data.isFeatured || false
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

  const handleColorImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !newColor) {
      alert('Please add a colour name first');
      return;
    }

    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        urls.push(url);
      }
      setNewColorImages(prev => [...prev, ...urls]);
    } catch (error) {
      console.error('Error uploading colour images:', error);
      alert('Failed to upload colour images');
    } finally {
      setUploading(false);
    }
  };

  const handleColorImageUrl = () => {
    if (!newColorUrlInput.trim()) {
      alert('Please enter a valid image URL');
      return;
    }
    if (!newColor) {
      alert('Please add a colour name first');
      return;
    }
    setNewColorImages(prev => [...prev, newColorUrlInput]);
    setNewColorUrlInput('');
    setShowColorUrlInput(false);
  };

  const addColor = () => {
    if (!newColor.trim()) {
      alert('Please enter a colour name');
      return;
    }
    if (formData.colors.includes(newColor)) {
      alert('This colour already exists');
      return;
    }

    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, newColor],
      colorImages: { ...prev.colorImages, [newColor]: newColorImages }
    }));
    setNewColor('');
    setNewColorImages([]);
    setNewColorUrlInput('');
  };

  const removeColor = (color: string) => {
    if (!confirm(`Remove colour "${color}"?`)) return;
    const newColors = formData.colors.filter(c => c !== color);
    const newColorImages = { ...formData.colorImages };
    delete newColorImages[color];
    setFormData(prev => ({
      ...prev,
      colors: newColors,
      colorImages: newColorImages
    }));
  };

  const addSize = () => {
    if (!newSize.trim()) {
      alert('Please enter a size');
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

  const removeColorImage = (color: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      colorImages: {
        ...prev.colorImages,
        [color]: prev.colorImages[color].filter((_, i) => i !== index)
      }
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

  // ✅ FIXED: Submit with correct field mapping
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name) { alert('Please enter product name'); return; }
    if (!formData.price) { alert('Please enter price'); return; }
    if (!formData.category) { alert('Please select category'); return; }
    if (!formData.image) { alert('Please upload or add main image URL'); return; }
    if (formData.colors.length === 0) { alert('Please add at least one colour'); return; }
    if (formData.sizes.length === 0) { alert('Please add at least one size'); return; }

    setSaving(true);
    setError(null);

    try {
      // ✅ Calculate discountPrice (match existing structure)
      const discountPrice = formData.discount || 
        (formData.oldPrice > formData.price ? 
          Math.round(((formData.oldPrice - formData.price) / formData.oldPrice) * 100) : 0);

      // ✅ Map fields to match existing Firestore structure
      const productData = {
        name: formData.name,
        price: formData.price,
        discountPrice: discountPrice,  // ✅ Instead of discount
        rating: formData.rating || 0,
        category: formData.category,
        subCategory: formData.subCategory || '',
        image: formData.image,
        images: formData.images || [],
        colorImages: formData.colorImages || {},
        sizes: formData.sizes || [],
        colors: formData.colors || [],
        stock: formData.stock || 0,
        description: formData.description || '',
        material: formData.material || '',
        careInstructions: formData.careInstructions || '',
        isActive: true,  // ✅ Existing field
        isNew: formData.isNew || false,
        isFeatured: formData.isFeatured || false,
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
              {isEditMode ? 'Update product details' : 'Create a new product with colours and sizes'}
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
        {/* ========== BASIC INFO ========== */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., MARIA B Exclusive Heavy Embroidered Saree"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
              />
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
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              >
                <option value="">Select Sub Category</option>
                {subCategoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ========== PRICING ========== */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Pricing & Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="6250"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                placeholder="17"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="15"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                placeholder="4.9"
                step="0.1"
                min="0"
                max="5"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
          </div>
        </div>

        {/* ========== IMAGES ========== */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🖼️ Images</h3>
          
          {/* Main Image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Image *</label>
            
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

          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
            
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
              {formData.images.map((img, index) => (
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

        {/* ========== COLOURS ========== */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaPalette className="text-[#0F766E]" /> Colours with Images
          </h3>
          
          <div className="border rounded-lg p-4 mb-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Colour name (e.g., Grey, Pink, Black)"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleColorImagesUpload}
                  className="hidden"
                  id="colorImagesUpload"
                  disabled={uploading}
                />
                <label
                  htmlFor="colorImagesUpload"
                  className="bg-[#0F766E] text-white px-3 py-2 rounded-lg hover:bg-[#065F46] transition cursor-pointer text-sm flex items-center gap-2"
                >
                  {uploading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />}
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowColorUrlInput(!showColorUrlInput)}
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition text-sm flex items-center gap-2"
                >
                  <FaLink /> Add URL
                </button>
              </div>
              <button
                type="button"
                onClick={addColor}
                className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition text-sm"
              >
                <FaPlus className="inline mr-1" /> Add Colour
              </button>
            </div>

            {showColorUrlInput && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  placeholder="https://example.com/colour-image.jpg"
                  value={newColorUrlInput}
                  onChange={(e) => setNewColorUrlInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={handleColorImageUrl}
                  className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition text-sm"
                >
                  Add URL
                </button>
                <button
                  type="button"
                  onClick={() => { setShowColorUrlInput(false); setNewColorUrlInput(''); }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            )}

            {newColorImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {newColorImages.map((img, i) => (
                  <img key={i} src={img} className="w-12 h-12 object-cover rounded border" />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {formData.colors.map((color) => (
              <div key={color} className="border rounded-lg p-3 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">{color}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.colorImages[color]?.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img} className="w-12 h-12 object-cover rounded border" />
                      <button
                        type="button"
                        onClick={() => removeColorImage(color, i)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {(!formData.colorImages[color] || formData.colorImages[color].length === 0) && (
                    <span className="text-xs text-gray-400">No images</span>
                  )}
                </div>
              </div>
            ))}
            {formData.colors.length === 0 && (
              <div className="col-span-3 text-center text-gray-400 text-sm py-4">
                No colours added yet. Add colours with images above.
              </div>
            )}
          </div>
        </div>

        {/* ========== SIZES ========== */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaRuler className="text-[#0F766E]" /> Sizes
          </h3>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
            >
              <option value="">Select Size</option>
              {sizeOptions.map(s => (
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

          <div className="flex flex-wrap gap-2 mt-3">
            {formData.sizes.map((size) => (
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

        {/* ========== DESCRIPTION ========== */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Description & Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product description..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                placeholder="e.g., Net Saree with Embroidered Net Fabric"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
              <input
                type="text"
                name="careInstructions"
                value={formData.careInstructions}
                onChange={handleInputChange}
                placeholder="e.g., Dry clean only"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
          </div>
        </div>

        {/* ========== FEATURES ========== */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">⭐ Features</h3>
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
          </div>
        </div>

        {/* ========== SUBMIT ========== */}
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

export default AdminProductForm;
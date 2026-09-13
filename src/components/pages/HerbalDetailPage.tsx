import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaLeaf, FaSpinner, FaArrowLeft, FaShoppingCart,
  FaHeart, FaStar, FaCheck, FaTruck, FaShieldAlt,
  FaUndo, FaBox, FaWeightHanging, FaGlobe, FaClock,
  FaSeedling, FaExclamationTriangle
} from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';

// ✅ CORRECT PATHS
import { db } from '../../config/firebase';
import { useCart } from '../../context/CartContext';

interface HerbalProduct {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: string;
  subCategory: string;
  productType: string;
  price: number;
  oldPrice: number;
  discount: number;
  stock: number;
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
  status: string;
  rating: number;
  reviewCount: number;
}

const HerbalDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<HerbalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'usage' | 'benefits'>('description');

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const snap = await getDoc(doc(db, 'products', productId));
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as HerbalProduct;
        setProduct(data);
        setSelectedImage(data.image);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock <= 0) {
      alert('❌ Product is out of stock');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      category: 'herbal',
      sellerId: 'admin',
    });
    alert('✅ Added to cart!');
  };

  const handleBuyNow = () => {
    if (!product) return;
    handleAddToCart();
    navigate('/checkout');
  };

  // ✅ Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-emerald-600 mx-auto" />
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  // ✅ Not found
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <FaLeaf className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">This herbal product may have been removed.</p>
          <Link to="/herbal" className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700">
            Browse Herbal Products
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-6 sm:py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ✅ Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Herbal
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* ============================================================
              LEFT — IMAGES
          ============================================================ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[400px] sm:h-[500px] object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    🆕 NEW
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    🏆 BEST SELLER
                  </span>
                )}
                {product.isOnSale && product.discount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    🔥 {product.discount}% OFF
                  </span>
                )}
                {product.isOrganic && (
                  <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    🌿 ORGANIC
                  </span>
                )}
                {product.isNatural && (
                  <span className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    🍃 100% NATURAL
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? 'border-emerald-600 shadow-md scale-105'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${index}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ============================================================
              RIGHT — DETAILS
          ============================================================ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Brand + SKU */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-600 uppercase tracking-wider">
                {product.brand || 'MAHA HERBAL'}
              </span>
              <span className="text-xs text-gray-400 font-mono">{product.sku}</span>
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={star <= (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating || 0} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>
            )}

            {/* ✅ Price */}
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-emerald-700">
                  Rs. {product.price?.toLocaleString()}
                </span>
                {product.oldPrice > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      Rs. {product.oldPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-emerald-600 mt-1">
                ✅ Inclusive of all taxes
              </p>
            </div>

            {/* ✅ Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 10 ? (
                <span className="flex items-center gap-2 text-green-600 font-medium">
                  <FaCheck /> In Stock ({product.stock} available)
                </span>
              ) : product.stock > 0 ? (
                <span className="flex items-center gap-2 text-orange-500 font-medium">
                  <FaExclamationTriangle /> Only {product.stock} left!
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-600 font-medium">
                  <FaExclamationTriangle /> Out of Stock
                </span>
              )}
            </div>

            {/* ✅ Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <span className="px-6 py-3 font-semibold text-gray-800 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaShoppingCart /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 bg-[#0F766E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#065F46] transition-colors disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* ✅ Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                <FaTruck className="text-emerald-600 text-xl mx-auto mb-1" />
                <p className="text-xs text-gray-600">Fast Delivery</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                <FaShieldAlt className="text-emerald-600 text-xl mx-auto mb-1" />
                <p className="text-xs text-gray-600">100% Authentic</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                <FaUndo className="text-emerald-600 text-xl mx-auto mb-1" />
                <p className="text-xs text-gray-600">Easy Returns</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                <FaLeaf className="text-emerald-600 text-xl mx-auto mb-1" />
                <p className="text-xs text-gray-600">Natural</p>
              </div>
            </div>

            {/* ✅ Herbal Info Cards */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaLeaf className="text-emerald-600" /> Product Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {product.subCategory && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium text-gray-800 capitalize">{product.subCategory.replace('-', ' ')}</span>
                  </div>
                )}
                {product.productType && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium text-gray-800">{product.productType}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex items-center gap-2">
                    <FaWeightHanging className="text-gray-400" />
                    <span className="text-gray-500">Weight:</span>
                    <span className="font-medium text-gray-800">{product.weight}{product.weightUnit}</span>
                  </div>
                )}
                {product.origin && (
                  <div className="flex items-center gap-2">
                    <FaGlobe className="text-gray-400" />
                    <span className="text-gray-500">Origin:</span>
                    <span className="font-medium text-gray-800">{product.origin}</span>
                  </div>
                )}
                {product.packaging && (
                  <div className="flex items-center gap-2">
                    <FaBox className="text-gray-400" />
                    <span className="text-gray-500">Packaging:</span>
                    <span className="font-medium text-gray-800">{product.packaging}</span>
                  </div>
                )}
                {product.shelfLife && (
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-400" />
                    <span className="text-gray-500">Shelf Life:</span>
                    <span className="font-medium text-gray-800">{product.shelfLife}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ Labels */}
            <div className="flex flex-wrap gap-2">
              {product.isOrganic && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">🌿 Organic</span>
              )}
              {product.isNatural && (
                <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium">🍃 Natural</span>
              )}
              {product.isVegan && (
                <span className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-xs font-medium">🌱 Vegan</span>
              )}
              {product.isGlutenFree && (
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">🚫 Gluten Free</span>
              )}
              {product.isHalal && (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">☪️ Halal</span>
              )}
            </div>
          </motion.div>
        </div>

        {/* ============================================================
            BOTTOM — TABS (Description, Ingredients, Usage, Benefits)
        ============================================================ */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {/* Tabs Header */}
          <div className="flex overflow-x-auto border-b border-gray-200">
            {[
              { id: 'description', label: '📝 Description', icon: FaLeaf },
              { id: 'ingredients', label: '🧾 Ingredients', icon: FaSeedling },
              { id: 'usage', label: '☕ How to Use', icon: FaClock },
              { id: 'benefits', label: '💚 Benefits', icon: FaHeart },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[140px] px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tabs Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                {product.description ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">No description available.</p>
                )}
                {product.nutritionalInfo && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Nutritional Information</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{product.nutritionalInfo}</p>
                  </div>
                )}
                {product.storageInstructions && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Storage Instructions</h4>
                    <p className="text-sm text-blue-700">{product.storageInstructions}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                {product.ingredients ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.ingredients}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">No ingredients listed.</p>
                )}
                {product.warnings && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                      <FaExclamationTriangle /> Warnings
                    </h4>
                    <p className="text-sm text-yellow-700">{product.warnings}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'usage' && (
              <div>
                {product.usage ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.usage}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">No usage instructions available.</p>
                )}
              </div>
            )}

            {activeTab === 'benefits' && (
              <div>
                {product.benefits && product.benefits.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {product.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3 bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                          <FaCheck size={12} />
                        </div>
                        <span className="text-sm font-medium text-emerald-800">{benefit}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No benefits listed.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            RELATED PRODUCTS (Optional)
        ============================================================ */}
        <div className="mt-12 text-center">
          <Link
            to="/herbal"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            <FaLeaf /> Browse All Herbal Products
          </Link>
        </div>

      </div>
    </div>
  );
};

export default HerbalDetailPage;
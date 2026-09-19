// src/components/pages/HerbalDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaLeaf, FaSpinner, FaArrowLeft, FaShoppingCart,
  FaHeart, FaStar, FaCheck, FaTruck, FaShieldAlt,
  FaUndo, FaBox, FaWeightHanging, FaGlobe, FaClock,
  FaSeedling, FaExclamationTriangle, FaChevronLeft, FaChevronRight,
  FaShare, FaWhatsapp, FaCalendarAlt, FaQuoteLeft
} from 'react-icons/fa';
import { doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';

import { db } from '../../config/firebase';
import { useCart } from '../../context/CartContext';
import ImageLightbox from '../common/ImageLightbox';

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

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

const HerbalDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<HerbalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'usage' | 'benefits'>('description');

  // ✅ Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // ✅ Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' });

  // ✅ Suggested products
  const [suggestedProducts, setSuggestedProducts] = useState<HerbalProduct[]>([]);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
      fetchReviews(id);
      fetchSuggested(id);
    }
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

  const fetchReviews = async (productId: string) => {
    try {
      setReviewLoading(true);
      const reviewsRef = collection(db, 'products', productId, 'reviews');
      const reviewsSnap = await getDocs(reviewsRef);
      const data: Review[] = reviewsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Review));
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewLoading(false);
    }
  };

  const fetchSuggested = async (currentId: string) => {
    try {
      const snap = await getDocs(collection(db, 'products'));
      const items: HerbalProduct[] = [];
      snap.forEach((doc) => {
        const data = doc.data();
        if (doc.id !== currentId && data.category === 'herbal') {
          items.push({ id: doc.id, ...data } as HerbalProduct);
        }
      });
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      setSuggestedProducts(shuffled.slice(0, 8));
    } catch (error) {
      console.error('Error fetching suggested:', error);
    }
  };

  const submitReview = async () => {
    if (!id) return;
    if (!newReview.comment.trim() || !newReview.name.trim()) {
      alert('Please fill all fields');
      return;
    }

    try {
      const reviewData = {
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newReview.name)}&background=0F766E&color=fff&size=60`,
      };

      await addDoc(collection(db, 'products', id, 'reviews'), reviewData);
      await fetchReviews(id);
      setNewReview({ rating: 5, comment: '', name: '' });
      setShowReviewForm(false);
      alert('✅ Review submitted!');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to submit review');
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

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // ✅ Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-[#0F766E] mx-auto" />
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  // ✅ Not found
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <FaLeaf className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">This herbal product may have been removed.</p>
          <Link to="/herbal" className="inline-block bg-[#0F766E] text-white px-6 py-2 rounded-lg hover:bg-[#065F46]">
            Browse Herbal Products
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const currentPrice = product.discount > 0
    ? product.price - (product.price * product.discount / 100)
    : product.price;
  const isInStock = product.stock > 0;

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-white py-6 sm:py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ✅ Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0F766E] mb-4 text-sm transition-colors"
        >
          <FaArrowLeft /> Back to Herbal
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-14">

          {/* ============================================================
              LEFT — IMAGES (Clickable, no emerald border)
          ============================================================ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div
              className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] mx-auto cursor-zoom-in group relative"
              onClick={() => {
                const idx = allImages.indexOf(selectedImage);
                openLightbox(idx >= 0 ? idx : 0);
              }}
            >
              <div className="w-full aspect-[3/4] relative">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className={`w-full h-full object-contain p-2 transition-all duration-500 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/600x800/D4AF37/FFFFFF?text=${encodeURIComponent(product.name)}`;
                    setImageLoaded(true);
                  }}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* ✅ Zoom hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">Click to zoom</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
              {product.discount > 0 && (
                <span className="bg-[#E8604C] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                  -{product.discount}%
                </span>
              )}
              {product.isNew && (
                <span className="bg-[#D4AF37] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                  NEW
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="overflow-x-auto pb-2 max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] mx-auto">
                <div className="flex gap-2 min-w-max justify-center">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImage(img);
                        setImageLoaded(false);
                      }}
                      onDoubleClick={() => openLightbox(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === img
                          ? 'border-[#0F766E]'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${index}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* ============================================================
              RIGHT — DETAILS
          ============================================================ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            {/* Brand + SKU */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-medium">
                🌿 {product.brand || 'MAHA HERBAL'}
              </span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={12}
                    className={i < Math.floor(product.rating || 0) ? 'text-[#D4AF37]' : 'text-gray-300'}
                  />
                ))}
                <span className="text-gray-400 text-xs ml-1">({product.rating || 0})</span>
              </div>
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* ✅ Price */}
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-[#E8604C]">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {product.oldPrice > 0 && product.oldPrice > currentPrice && (
                <span className="text-gray-400 line-through text-base">
                  Rs. {product.oldPrice.toLocaleString()}
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-green-100 text-green-600 text-xs font-medium px-3 py-1 rounded-full">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* ✅ Stock Status */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isInStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className={`text-sm font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                {isInStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* ✅ Herbal Info Cards */}
            <div className="grid grid-cols-2 gap-2">
              {product.subCategory && (
                <div className="p-3 bg-gradient-to-br from-[#0F766E]/5 to-[#0F766E]/10 rounded-xl border border-[#0F766E]/20">
                  <p className="text-[10px] text-[#0F766E] font-semibold uppercase tracking-wider">Category</p>
                  <p className="text-sm text-gray-700 font-medium capitalize">{product.subCategory.replace('-', ' ')}</p>
                </div>
              )}
              {product.weight && (
                <div className="p-3 bg-gradient-to-br from-[#D4AF37]/5 to-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
                  <p className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">Weight</p>
                  <p className="text-sm text-gray-700 font-medium">{product.weight}{product.weightUnit}</p>
                </div>
              )}
              {product.origin && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Origin</p>
                  <p className="text-sm text-gray-700 font-medium">{product.origin}</p>
                </div>
              )}
              {product.shelfLife && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Shelf Life</p>
                  <p className="text-sm text-gray-700 font-medium">{product.shelfLife}</p>
                </div>
              )}
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

            {/* ✅ Quantity + Add to Cart */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Qty</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 transition flex items-center justify-center border border-gray-200"
                >
                  <span className="font-medium">-</span>
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 transition flex items-center justify-center border border-gray-200"
                >
                  <span className="font-medium">+</span>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`flex-1 px-6 py-3 rounded-full text-sm font-semibold transition shadow-lg flex items-center justify-center gap-2 ${
                  isInStock
                    ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart />
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!isInStock}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition shadow-lg flex items-center justify-center ${
                  isInStock
                    ? 'bg-[#D4AF37] text-white hover:bg-[#b8941f]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* ✅ Share */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const text = `Check out ${product.name} at Maha One Hypermart!`;
                  if (navigator.share) {
                    navigator.share({ title: product.name, text, url: window.location.href }).catch(() => {});
                    return;
                  }
                  navigator.clipboard.writeText(`${text}\n${window.location.href}`).then(() => {
                    alert('✅ Link copied!');
                  });
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-full text-xs font-medium transition flex items-center justify-center gap-1"
              >
                <FaShare /> Share
              </button>
              <button
                onClick={() => {
                  const msg = `Check out ${product.name} at Maha One Hypermart! ${window.location.href}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="flex-1 bg-[#25D366] hover:bg-[#1DA851] text-white px-3 py-2 rounded-full text-xs font-medium transition flex items-center justify-center gap-1"
              >
                <FaWhatsapp /> WhatsApp
              </button>
            </div>

            {/* ✅ Trust Badges */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                <FaTruck className="text-[#D4AF37] text-lg mx-auto" />
                <p className="text-[10px] text-gray-500 mt-1">Delivery PK</p>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                <FaShieldAlt className="text-[#D4AF37] text-lg mx-auto" />
                <p className="text-[10px] text-gray-500 mt-1">Authentic</p>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                <FaLeaf className="text-[#D4AF37] text-lg mx-auto" />
                <p className="text-[10px] text-gray-500 mt-1">Natural</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ============================================================
            BOTTOM — TABS
        ============================================================ */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {[
              { id: 'description', label: '📝 Description' },
              { id: 'ingredients', label: '🧾 Ingredients' },
              { id: 'usage', label: '☕ How to Use' },
              { id: 'benefits', label: '💚 Benefits' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[140px] px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#0F766E] border-b-2 border-[#0F766E] bg-[#0F766E]/5'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                {product.description ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">No description available.</p>
                )}
                {product.nutritionalInfo && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Nutritional Information</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{product.nutritionalInfo}</p>
                  </div>
                )}
                {product.storageInstructions && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2 text-sm">Storage Instructions</h4>
                    <p className="text-sm text-blue-700">{product.storageInstructions}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                {product.ingredients ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                    {product.ingredients}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">No ingredients listed.</p>
                )}
                {product.warnings && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2 text-sm">
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
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
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
                      <div key={index} className="flex items-center gap-3 bg-[#0F766E]/5 rounded-lg p-3 border border-[#0F766E]/20">
                        <div className="w-8 h-8 bg-[#0F766E] text-white rounded-full flex items-center justify-center flex-shrink-0">
                          <FaCheck size={12} />
                        </div>
                        <span className="text-sm font-medium text-[#0F766E]">{benefit}</span>
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
            SUGGESTED PRODUCTS
        ============================================================ */}
        {suggestedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-[#D4AF37]">✨</span> You May Also Like
              </h2>
              <Link to="/herbal" className="text-[#D4AF37] hover:text-[#b8941f] text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {suggestedProducts.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  to={`/herbal/${p.id}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 mb-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/300x400/D4AF37/FFFFFF?text=${encodeURIComponent(p.name)}`;
                      }}
                    />
                    {p.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-[#E8604C] text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                        -{p.discount}%
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-gray-800 text-xs line-clamp-2 min-h-[2rem]">
                    {p.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[#E8604C] font-bold text-sm">
                      Rs. {p.price.toLocaleString()}
                    </span>
                    {p.oldPrice > p.price && (
                      <span className="text-gray-400 line-through text-[10px]">
                        Rs. {p.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            REVIEWS
        ============================================================ */}
        <div className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[#D4AF37]">⭐</span> Customer Reviews
              <span className="text-sm font-normal text-gray-400">({reviews.length})</span>
            </h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-[#D4AF37] hover:text-[#b8941f] text-sm font-medium"
            >
              {showReviewForm ? '✕ Close' : '✏️ Write a Review'}
            </button>
          </div>

          {showReviewForm && (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 mb-6">
              <div className="space-y-4">
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                />
                <div className="flex gap-1 text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <FaStar className={star <= newReview.rating ? 'text-[#D4AF37]' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none resize-y"
                />
                <div className="flex gap-3">
                  <button onClick={submitReview} className="bg-[#0F766E] text-white px-6 py-2 rounded-lg hover:bg-[#065F46] transition font-medium">
                    Submit
                  </button>
                  <button onClick={() => setShowReviewForm(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {reviewLoading ? (
            <div className="text-center py-8">
              <FaSpinner className="animate-spin text-2xl text-[#D4AF37] mx-auto" />
            </div>
          ) : reviews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1 text-[#D4AF37] mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={12} className={i < review.rating ? 'text-[#D4AF37]' : 'text-gray-300'} />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      <FaQuoteLeft className="text-[#D4AF37]/30 text-xs inline mr-1" />
                      {review.comment}
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{review.name}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <FaCalendarAlt size={10} />
                          {review.date ? new Date(review.date).toLocaleDateString('en-PK') : 'Recent'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rating summary */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-[#D4AF37]">{avgRating.toFixed(1)}</div>
                  <div>
                    <div className="flex gap-0.5 text-[#D4AF37] text-sm">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.round(avgRating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">Based on {reviews.length} reviews</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-2xl">
              <p className="text-gray-400">No reviews yet. Be the first! ⭐</p>
            </div>
          )}
        </div>

        {/* ✅ Browse All */}
        <div className="mt-12 text-center">
          <Link
            to="/herbal"
            className="inline-flex items-center gap-2 bg-[#0F766E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#065F46] transition-colors"
          >
            <FaLeaf /> Browse All Herbal Products
          </Link>
        </div>
      </div>

      {/* ✅ Fullscreen Image Lightbox */}
      <ImageLightbox
        images={allImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => {
          setLightboxIndex(idx);
          setSelectedImage(allImages[idx]);
        }}
      />
    </div>
  );
};

export default HerbalDetailPage;
// src/components/pages/UniversalProductDetailPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaStar, FaShoppingCart, FaArrowLeft,
  FaTruck, FaShieldAlt, FaLeaf, FaChevronLeft, FaChevronRight,
  FaCircle, FaSpinner, FaShare, FaWhatsapp, FaCalendarAlt, FaQuoteLeft,
  FaHeart, FaRegHeart,
} from 'react-icons/fa';
import { Store, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useCart } from '../../context/CartContext';
import {
  db,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from '../../config/firebase';
import { getStoreSlug } from '../../utils/getStoreSlug';
import {
  getCategoryById,
  getAttributeTemplate,
  Category,
  AttributeTemplate,
  AttributeSection,
  AttributeField,
} from '../../services/categoryService';
import ImageLightbox from '../common/ImageLightbox';
import SizeChartModal, { type SizeChartData } from '../common/SizeChartModal';
import { getSizeChartTemplate } from '../../data/sizeChartTemplates';
import { isInWishlist, addToWishlist, removeFromWishlist } from '../../services/wishlistService';

// ============================================================
// TYPES
// ============================================================
interface ProductAttribute {
  [key: string]: any;
}

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  discountPrice?: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  images?: string[];
  stock: number;
  shortDescription?: string;
  description?: string;
  categoryId: string;
  categorySlug: string;
  categoryPath?: string[];
  attributes: ProductAttribute;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  sellerId?: string;
  status?: string;
  approvalStatus?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

// ============================================================
// HELPERS
// ============================================================
const formatDescription = (text: string) => {
  if (!text) return [];
  const lines = text.split('\n').filter(line => line.trim());
  return lines.map(line => {
    if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
      return line.trim();
    }
    if (line.includes(':')) {
      return `• ${line.trim()}`;
    }
    if (line.trim().length < 30 && line.trim() === line.trim().toUpperCase()) {
      return line.trim();
    }
    return `• ${line.trim()}`;
  });
};

const formatLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
    .trim();
};

const formatSubCategory = (sub: string) =>
  sub.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

// Fields that shouldn't show in specs (already shown elsewhere)
const HIDDEN_IN_SPECS = [
  'name', 'brand', 'shortDescription', 'description',
  'price', 'oldPrice', 'costPrice', 'stock',
  'image', 'images', 'colorImages',
  'shortDescription', 'benefits',
  'subCategory', 'productType', 'style',
];

// ============================================================
// COMPONENT
// ============================================================
const UniversalProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Data
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [template, setTemplate] = useState<AttributeTemplate | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [storeSlug, setStoreSlug] = useState<string | null>(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, any>>({});

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Size chart
  const [showSizeChart, setShowSizeChart] = useState(false);

  // Wishlist
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const userId = localStorage.getItem('userId') || 'guest';

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' });

  const sliderRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // FETCH PRODUCT
  // ============================================================
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const docSnap = await getDoc(doc(db, 'products', id));
        if (!docSnap.exists()) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        const data = docSnap.data();

        // Status check
        const isActive = data.status === 'active' || data.approvalStatus === 'approved';
        if (!isActive) {
          setError('Product not available');
          setLoading(false);
          return;
        }

        const productData: Product = {
          id: docSnap.id,
          name: data.name || '',
          price: data.price || 0,
          oldPrice: data.oldPrice || 0,
          discount: data.discount || 0,
          discountPrice: data.discountPrice || 0,
          rating: data.rating || 0,
          reviewCount: data.reviewCount || 0,
          image: data.image || '',
          images: data.images || [],
          stock: data.stock || 0,
          shortDescription: data.shortDescription || '',
          description: data.description || '',
          categoryId: data.categoryId || '',
          categorySlug: data.categorySlug || '',
          categoryPath: data.categoryPath || [],
          attributes: data.attributes || {},
          isNew: data.isNew || false,
          isFeatured: data.isFeatured || false,
          isBestSeller: data.isBestSeller || false,
          isOnSale: data.isOnSale || false,
          sellerId: data.sellerId || '',
          status: data.status,
          approvalStatus: data.approvalStatus,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };

        setProduct(productData);

        // Set initial image
        if (productData.images && productData.images.length > 0) {
          setMainImage(productData.images[0]);
        } else if (productData.image) {
          setMainImage(productData.image);
        }

        // Default variants
        const initialVariants: Record<string, any> = {};
        if (productData.attributes) {
          // Auto-select first color if colors array exists
          if (Array.isArray(productData.attributes.colors) && productData.attributes.colors.length > 0) {
            initialVariants.color = productData.attributes.colors[0];
          }
          if (Array.isArray(productData.attributes.sizes) && productData.attributes.sizes.length > 0) {
            initialVariants.size = productData.attributes.sizes[0];
          }
        }
        setSelectedVariants(initialVariants);

        // Load category + template
        if (productData.categoryId) {
          const cat = await getCategoryById(productData.categoryId);
          setCategory(cat);

          if (cat?.attributeTemplateId) {
            const tmpl = await getAttributeTemplate(cat.attributeTemplateId);
            setTemplate(tmpl);
          }
        }

        // Load reviews + suggested
        await Promise.all([
          fetchReviews(docSnap.id),
          fetchSuggestedProducts(docSnap.id, productData.categorySlug),
        ]);
      } catch (err: any) {
        console.error('❌ Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestedProducts = async (currentId: string, categorySlug: string) => {
      try {
        if (!categorySlug) return;
        const q = query(
          collection(db, 'products'),
          where('categorySlug', '==', categorySlug),
          where('status', '==', 'active')
        );
        const snap = await getDocs(q);
        const items: Product[] = [];
        snap.forEach(d => {
          if (d.id !== currentId) {
            const data = d.data();
            items.push({
              id: d.id,
              name: data.name,
              price: data.price || 0,
              oldPrice: data.oldPrice,
              discount: data.discount,
              image: data.image,
              images: data.images || [],
              stock: data.stock || 0,
              categoryId: data.categoryId || '',
              categorySlug: data.categorySlug || '',
              attributes: data.attributes || {},
              isNew: data.isNew || false,
              isBestSeller: data.isBestSeller || false,
            });
          }
        });
        const shuffled = items.sort(() => 0.5 - Math.random());
        setSuggestedProducts(shuffled.slice(0, 8));
      } catch (err) {
        console.error('Error fetching suggested:', err);
      }
    };

    const fetchReviews = async (productId: string) => {
      try {
        setReviewLoading(true);
        const snap = await getDocs(collection(db, 'products', productId, 'reviews'));
        const data: Review[] = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        } as Review));
        setReviews(data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setReviewLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ============================================================
  // STORE SLUG
  // ============================================================
  useEffect(() => {
    if (!product?.sellerId || product.sellerId === 'admin') {
      setStoreSlug(null);
      return;
    }
    getStoreSlug(product.sellerId).then(setStoreSlug);
  }, [product?.sellerId]);

  // ============================================================
  // WISHLIST CHECK
  // ============================================================
  useEffect(() => {
    if (userId === 'guest' || !product) return;
    const check = async () => {
      try {
        const result = await isInWishlist(userId, product.id);
        setInWishlist(result);
      } catch (err) {
        console.error('Wishlist check failed:', err);
      }
    };
    check();
  }, [product?.id, userId]);

  const handleWishlist = async () => {
    if (userId === 'guest') {
      alert('Please login to add to wishlist');
      return;
    }
    if (!product) return;

    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(userId, product.id);
        setInWishlist(false);
      } else {
        await addToWishlist(userId, product.id);
        setInWishlist(true);
      }
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err: any) {
      console.error('Wishlist error:', err);
      alert('Failed: ' + err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  // ============================================================
  // PRICE HELPERS
  // ============================================================
  const getDiscountedPrice = (): number => {
    if (!product) return 0;
    const hasDiscount =
      (product.discount && product.discount > 0) ||
      (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price);

    if (!hasDiscount) return product.price;
    if (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price) {
      return product.discountPrice;
    }
    if (product.discount && product.discount > 0) {
      return product.price - (product.price * product.discount) / 100;
    }
    return product.price;
  };

  const getDiscountPercent = (): number => {
    if (!product) return 0;
    if (product.discount && product.discount > 0) return product.discount;
    if (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  // ============================================================
  // IMAGE HANDLERS
  // ============================================================
  const getAllImages = (): string[] => {
    if (!product) return [];
    const imgs = product.images || [];
    return imgs.length > 0 ? imgs : (product.image ? [product.image] : []);
  };

  const nextImage = () => {
    const images = getAllImages();
    if (images.length <= 1) return;
    const idx = images.indexOf(mainImage);
    const next = (idx + 1) % images.length;
    setMainImage(images[next]);
    setImageLoaded(false);
  };

  const prevImage = () => {
    const images = getAllImages();
    if (images.length <= 1) return;
    const idx = images.indexOf(mainImage);
    const prev = (idx - 1 + images.length) % images.length;
    setMainImage(images[prev]);
    setImageLoaded(false);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // ============================================================
  // SIZE CHART
  // ============================================================
  const sizeChartColumns = (() => {
    if (!product?.attributes?.sizeChart?.templateId) return [];
    try {
      return getSizeChartTemplate(product.attributes.sizeChart.templateId).columns;
    } catch {
      return [];
    }
  })();

  // ============================================================
  // ADD TO CART
  // ============================================================
  const isInStock = () => product ? product.stock > 0 : false;

  const handleAddToCart = () => {
    if (!product) return;
    if (!isInStock()) {
      alert('❌ Out of stock');
      return;
    }

    const currentPrice = getDiscountedPrice();

    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      image: mainImage || product.image,
      quantity,
      category: product.categorySlug,
      sellerId: product.sellerId,
      colour: selectedVariants.color || null,
      size: selectedVariants.size || null,
      variantId: selectedVariants.variantId || null,
      totalPrice: currentPrice * quantity,
    });

    alert('✅ Added to Cart!');
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!isInStock()) {
      alert('❌ Out of stock');
      return;
    }
    handleAddToCart();
    navigate('/checkout');
  };

  // ============================================================
  // SUBMIT REVIEW
  // ============================================================
  const submitReview = async () => {
    if (!id) return;
    if (!newReview.comment.trim() || !newReview.name.trim()) {
      alert('Please fill all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'products', id, 'reviews'), {
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newReview.name)}&background=0F766E&color=fff&size=60`,
      });

      // Reload reviews
      const snap = await getDocs(collection(db, 'products', id, 'reviews'));
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() } as Review)));

      setNewReview({ rating: 5, comment: '', name: '' });
      setShowReviewForm(false);
      alert('✅ Review submitted!');
    } catch (err: any) {
      console.error('Review error:', err);
      alert('❌ Failed: ' + err.message);
    }
  };

  // ============================================================
  // SHARE
  // ============================================================
  const handleShare = () => {
    if (!product) return;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} at Maha One Hypermart!`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
      return;
    }

    const fullText = `${shareData.text}\n${shareData.url}`;
    navigator.clipboard.writeText(fullText).then(() => {
      alert('✅ Link copied!');
    }).catch(() => {
      window.location.href = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(fullText)}`;
    });
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const msg = `Check out ${product.name} at Maha One Hypermart! ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ============================================================
  // RENDER DYNAMIC FIELD
  // ============================================================
  const renderFieldValue = (field: AttributeField, value: any) => {
    if (value === undefined || value === null || value === '') return null;

    switch (field.type) {
      case 'checkbox':
        return value ? '✓ Yes' : '✗ No';

      case 'tags':
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1.5">
              {value.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          );
        }
        return String(value);

      case 'number':
        return Number(value).toLocaleString();

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-5 rounded border border-gray-300"
              style={{ backgroundColor: value }}
            />
            <span>{value}</span>
          </div>
        );

      default:
        return String(value);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FFFDF7] dark:bg-[#0F172A]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#D4AF37] mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================
  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFDF7] dark:bg-[#0F172A] px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">{category?.icon || '📦'}</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {error || 'Product does not exist.'}
          </p>
          <Link
            to="/"
            className="inline-block mt-4 bg-[#D4AF37] text-white px-6 py-2 rounded-full hover:bg-[#b8941f] transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================
  // COMPUTED VALUES
  // ============================================================
  const currentPrice = getDiscountedPrice();
  const totalPrice = currentPrice * quantity;
  const images = getAllImages();
  const discountPercent = getDiscountPercent();
  const descriptionLines = formatDescription(product.description || product.shortDescription || '');

  const attributes = product.attributes || {};

  // Colors
  const colors: string[] = Array.isArray(attributes.colors) ? attributes.colors : [];
  // Sizes
  const sizes: string[] = Array.isArray(attributes.sizes) ? attributes.sizes : [];
  // Benefits
  const benefits: string[] = Array.isArray(attributes.benefits)
    ? attributes.benefits
    : (attributes.benefits ? [attributes.benefits] : []);

  // Avail rating stats
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : (product.rating || 0);

  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) ratingDistribution[r.rating - 1]++;
  });

  // ============================================================
  // BUILD SPECS LIST
  // ============================================================
  const buildSpecs = () => {
    if (!template) {
      // Fallback: show raw attributes
      return Object.entries(attributes)
        .filter(([key, val]) =>
          !HIDDEN_IN_SPECS.includes(key) &&
          val !== undefined &&
          val !== null &&
          val !== '' &&
          !Array.isArray(val)
        )
        .map(([key, val]) => ({ key, label: formatLabel(key), value: val, type: 'text' as const }));
    }

    const specs: Array<{ key: string; label: string; value: any; type: string }> = [];

    template.sections.forEach(section => {
      section.fields.forEach(field => {
        if (HIDDEN_IN_SPECS.includes(field.key)) return;
        if (['image', 'images', 'colorImages', 'sizes', 'sizeChart'].includes(field.type)) return;

        const value = attributes[field.key];
        if (value === undefined || value === null || value === '') return;
        if (Array.isArray(value) && value.length === 0) return;
        if (field.type === 'checkbox' && !value) return;

        specs.push({
          key: field.key,
          label: field.label,
          value,
          type: field.type,
        });
      });
    });

    return specs;
  };

  const specs = buildSpecs();

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="bg-[#FFFDF7] dark:bg-[#0F172A] min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-16 sm:pt-20 pb-8">
        {/* Back */}
        <Link
          to={category ? `/category/${category.slug}` : '/shop'}
          className="inline-flex items-center gap-2 text-[#0F766E] dark:text-[#14b8a6] hover:text-[#D4AF37] transition mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base"
        >
          <FaArrowLeft className="text-xs sm:text-sm md:text-base" />
          Back to {category?.name || 'Shop'}
        </Link>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          {/* ============================================================
              LEFT — IMAGES
          ============================================================ */}
          <div className="relative">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg relative">
              <div
                className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] relative flex items-center justify-center cursor-zoom-in group"
                onClick={() => {
                  const idx = images.indexOf(mainImage);
                  openLightbox(idx >= 0 ? idx : 0);
                }}
              >
                <img
                  src={mainImage || product.image}
                  alt={product.name}
                  className={`max-w-full max-h-full object-contain transition-all duration-500 p-2 ${
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
                    <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {/* Zoom hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                    <span className="text-xs font-medium text-gray-700">Click to zoom</span>
                  </div>
                </div>
              </div>

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 rounded-full p-2 sm:p-3 hover:bg-white transition shadow-lg z-10"
                  >
                    <FaChevronLeft className="text-gray-700 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 rounded-full p-2 sm:p-3 hover:bg-white transition shadow-lg z-10"
                  >
                    <FaChevronRight className="text-gray-700 dark:text-gray-300" />
                  </button>
                </>
              )}

              {/* Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full z-10">
                  {images.indexOf(mainImage) + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
              {discountPercent > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                  -{discountPercent}%
                </span>
              )}
              {product.isNew && (
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                  NEW
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-[#D4AF37] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                  ★ BEST SELLER
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-3 sm:mt-4 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex gap-2 sm:gap-2.5 min-w-max justify-center">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setMainImage(img);
                        setImageLoaded(false);
                      }}
                      onDoubleClick={() => openLightbox(i)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${
                        mainImage === img
                          ? 'border-[#0F766E] shadow-md'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/100x100/D4AF37/FFFFFF?text=${i + 1}`;
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ============================================================
              RIGHT — INFO
          ============================================================ */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Category badge + rating */}
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <Link
                  to={`/category/${category.slug}`}
                  className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-medium capitalize hover:bg-[#D4AF37]/20 transition"
                >
                  {category.icon} {attributes.subCategory ? formatSubCategory(String(attributes.subCategory)) : category.name}
                </Link>
              )}
              {attributes.productType && (
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                  {String(attributes.productType)}
                </span>
              )}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < Math.floor(avgRating) ? 'text-[#D4AF37]' : 'text-gray-300'}
                    size={12}
                  />
                ))}
                <span className="text-gray-400 text-xs ml-1">
                  ({avgRating.toFixed(1)})
                </span>
              </div>
            </div>

            {/* Visit store */}
            {storeSlug && (
              <Link
                to={`/store/${storeSlug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#0F766E] dark:text-[#14b8a6] hover:text-[#065F46] transition px-3 py-2 rounded-lg hover:bg-[#0F766E]/5 border border-[#0F766E]/20 w-fit"
              >
                <Store size={16} />
                <span>Visit Store</span>
                <ChevronRightIcon size={14} className="opacity-60" />
              </Link>
            )}

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Short description */}
            {product.shortDescription && (
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-[#D4AF37]">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {product.oldPrice && product.oldPrice > currentPrice && (
                <span className="text-gray-400 line-through text-base">
                  Rs. {product.oldPrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium px-3 py-1 rounded-full">
                  Save {discountPercent}%
                </span>
              )}
              {product.isOnSale && (
                <span className="bg-red-100 text-red-600 text-xs font-medium px-3 py-1 rounded-full animate-pulse">
                  🔥 On Sale
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isInStock() ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${isInStock() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isInStock() ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* ============================================================
                VARIANT SELECTORS — Dynamic
            ============================================================ */}
            {colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Color <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, color }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedVariants.color === color
                          ? 'bg-[#0F766E] text-white shadow-md'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && sizes[0] !== 'One Size' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Size <span className="text-red-500">*</span>
                  </label>
                  {attributes.sizeChart && sizeChartColumns.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowSizeChart(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0F766E] dark:text-[#14b8a6] hover:underline"
                    >
                      📏 Size Chart
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, size }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedVariants.size === size
                          ? 'bg-[#0F766E] text-white shadow-md'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Qty</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-center border border-gray-200 dark:border-gray-700"
                >
                  <span className="text-base font-medium">−</span>
                </button>
                <span className="w-10 text-center font-semibold dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-center border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                >
                  <span className="text-base font-medium">+</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock()}
                className={`flex-1 px-6 py-3 rounded-full text-sm font-semibold transition shadow-lg flex items-center justify-center gap-2 ${
                  isInStock()
                    ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart />
                {isInStock() ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!isInStock()}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition shadow-lg ${
                  isInStock()
                    ? 'bg-[#D4AF37] text-white hover:bg-[#b8941f]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                Buy Now
              </button>
              <button
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className={`p-3 rounded-full border transition ${
                  inWishlist
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-500'
                }`}
                aria-label="Wishlist"
              >
                {inWishlist ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            {/* Share */}
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-full text-xs font-medium transition flex items-center justify-center gap-1"
              >
                <FaShare /> Share
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex-1 bg-[#25D366] hover:bg-[#1DA851] text-white px-3 py-2 rounded-full text-xs font-medium transition flex items-center justify-center gap-1"
              >
                <FaWhatsapp /> WhatsApp
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                <FaTruck className="text-[#D4AF37] text-lg mx-auto" />
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Delivery PK</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                <FaShieldAlt className="text-[#D4AF37] text-lg mx-auto" />
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Secure</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                <FaLeaf className="text-[#D4AF37] text-lg mx-auto" />
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            DESCRIPTION + SPECS TABS
        ============================================================ */}
        <div className="mt-10 sm:mt-12 md:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              📝 Description
            </h2>
            <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-1">
              {descriptionLines.length > 0 ? (
                descriptionLines.map((line, idx) => {
                  if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                    return (
                      <div key={idx} className="flex items-start gap-2 py-0.5">
                        <FaCircle className="text-[#D4AF37] text-[5px] mt-2 flex-shrink-0" />
                        <span>{line.replace(/^[•\-*]\s*/, '')}</span>
                      </div>
                    );
                  }
                  if (line.length < 40 && line === line.toUpperCase()) {
                    return (
                      <div key={idx} className="font-semibold text-gray-900 dark:text-white mt-2 first:mt-0">
                        {line}
                      </div>
                    );
                  }
                  return <div key={idx} className="py-0.5">{line}</div>;
                })
              ) : (
                <p className="text-gray-400 italic">No description available.</p>
              )}
            </div>
          </div>

          {/* Specifications (dynamic) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              📋 Specifications
            </h2>

            {specs.length === 0 ? (
              <p className="text-gray-400 italic text-sm">No specifications available.</p>
            ) : (
              <div className="space-y-3">
                {specs.map(spec => (
                  <div
                    key={spec.key}
                    className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 pb-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide sm:w-32 shrink-0">
                      {spec.label}
                    </span>
                    <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">
                      {renderFieldValue(
                        { key: spec.key, label: spec.label, type: spec.type } as AttributeField,
                        spec.value
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  ✨ Key Features
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {benefits.map((benefit, i) => (
                    <span
                      key={i}
                      className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            SUGGESTED PRODUCTS
        ============================================================ */}
        {suggestedProducts.length > 0 && (
          <div className="mt-10 sm:mt-12 md:mt-14">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-[#D4AF37]">✨</span> You May Also Like
              </h2>
              {category && (
                <Link
                  to={`/category/${category.slug}`}
                  className="text-[#D4AF37] hover:text-[#b8941f] text-sm font-medium"
                >
                  View All →
                </Link>
              )}
            </div>
            <SuggestedSlider
              products={suggestedProducts}
              sliderRef={sliderRef}
              onAddToCart={(p) => {
                addToCart({
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  image: p.image,
                  quantity: 1,
                  category: p.categorySlug,
                });
                alert(`✅ ${p.name} added to cart!`);
              }}
            />
          </div>
        )}

        {/* ============================================================
            REVIEWS
        ============================================================ */}
        <div className="mt-10 sm:mt-12 md:mt-14">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
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

          {/* Review form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden"
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                  />
                  <div className="flex gap-1 text-2xl">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none hover:scale-110 transition"
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
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none resize-y"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={submitReview}
                      className="bg-[#0F766E] text-white px-6 py-2 rounded-lg hover:bg-[#065F46] font-medium text-sm"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Review list */}
          {reviewLoading ? (
            <div className="text-center py-8">
              <FaSpinner className="animate-spin text-2xl text-[#D4AF37] mx-auto" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map(review => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-1 text-[#D4AF37] mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={12}
                        className={i < review.rating ? 'text-[#D4AF37]' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                    <FaQuoteLeft className="text-[#D4AF37]/30 text-xs inline mr-1" />
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <img
                      src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=0F766E&color=fff&size=60`}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=User&background=0F766E&color=fff&size=60`;
                      }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {review.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <FaCalendarAlt size={10} />
                        {review.date ? new Date(review.date).toLocaleDateString('en-PK') : 'Recent'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <p className="text-gray-400">No reviews yet. Be the first! ⭐</p>
            </div>
          )}

          {/* Rating summary */}
          {reviews.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
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
          )}
        </div>
      </div>

      {/* ============================================================
          LIGHTBOX
      ============================================================ */}
      <ImageLightbox
        images={images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => {
          setLightboxIndex(idx);
          setMainImage(images[idx]);
        }}
      />

      {/* ============================================================
          SIZE CHART MODAL
      ============================================================ */}
      {attributes.sizeChart && sizeChartColumns.length > 0 && (
        <SizeChartModal
          isOpen={showSizeChart}
          onClose={() => setShowSizeChart(false)}
          data={attributes.sizeChart as SizeChartData}
          columns={sizeChartColumns}
          title={`${category?.name || 'Product'} Size Chart`}
        />
      )}
    </div>
  );
};

// ============================================================
// SUGGESTED SLIDER
// ============================================================
interface SuggestedSliderProps {
  products: Product[];
  sliderRef: React.RefObject<HTMLDivElement>;
  onAddToCart: (p: Product) => void;
}

const SuggestedSlider: React.FC<SuggestedSliderProps> = ({
  products,
  sliderRef,
  onAddToCart,
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => sliderRef.current?.scrollBy({ left: -280, behavior: 'smooth' })}
        className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        <FaChevronLeft className="text-gray-600 dark:text-gray-300" />
      </button>

      <div
        ref={sliderRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map(product => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 group"
          >
            <div className="relative aspect-square bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=${encodeURIComponent(product.name)}`;
                }}
              />
              {product.discount && product.discount > 0 && (
                <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  -{product.discount}%
                </span>
              )}
              {product.isNew && (
                <span className="absolute top-1 left-10 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  NEW
                </span>
              )}
            </div>
            <div className="p-2 sm:p-3">
              <h4 className="font-semibold text-gray-800 dark:text-white text-[11px] sm:text-xs line-clamp-2 min-h-[2rem]">
                {product.name}
              </h4>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[#D4AF37] font-bold text-xs sm:text-sm">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-gray-400 line-through text-[10px]">
                    Rs. {product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart(product);
                }}
                disabled={product.stock === 0}
                className={`w-full mt-1.5 px-2 py-1 rounded-full text-[10px] font-medium transition flex items-center justify-center gap-1 ${
                  product.stock > 0
                    ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart className="text-[10px]" />
                {product.stock > 0 ? 'Add' : 'Sold'}
              </button>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={() => sliderRef.current?.scrollBy({ left: 280, behavior: 'smooth' })}
        className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        <FaChevronRight className="text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
};

export default UniversalProductDetailPage;
// src/components/pages/FashionDetailPage.tsx
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo } from 'react';
import {
  FaStar, FaShoppingCart, FaArrowLeft,
  FaTruck, FaShieldAlt, FaLeaf, FaChevronLeft, FaChevronRight,
  FaCircle, FaSpinner, FaShare, FaWhatsapp, FaCalendarAlt, FaQuoteLeft
} from 'react-icons/fa';
import { Ruler, Store, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { db, doc, getDoc, collection, getDocs, addDoc } from '../../config/firebase';
import ImageLightbox from '../common/ImageLightbox';
import SizeChartModal, { type SizeChartData } from '../common/SizeChartModal';
import { getSizeChartTemplate } from '../../data/sizeChartTemplates';
import { getStoreSlug } from '../../utils/getStoreSlug';

// ============================================================
// TYPES
// ============================================================
interface ColorImageEntry {
  id: string;
  colorName: string;
  colorHex: string;
  variantName: string;
  variantHex: string;
  images: string[];
}

interface FashionProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discountPrice?: number;
  discount?: number;
  rating: number;
  category: string;
  gender?: string;
  productType?: string;
  subCategory: string;
  subSubCategory: string;
  style?: string;
  productId: string;
  image: string;
  images: string[];
  colorImages?: ColorImageEntry[] | { [key: string]: string[] };
  sizes: string[];
  sizeChart?: SizeChartData | null;
  colors: string[];
  stock: number;
  description: string;
  shortDescription?: string;
  material?: string;
  careInstructions?: string;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  status?: string;
  sellerId?: string;
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
const categoryIcons: Record<string, string> = {
  'clothing': '👗', 'footwear': '👠', 'bags': '👜', 'accessories': '💎',
  'unstitched': '🧵', 'ready-to-wear': '👔', 'sarees': '🥻', 'abayas': '🧕',
  'nightwear': '🌙', 'heels': '👠', 'flats': '👟', 'slippers': '🩴',
  'sandals': '👡', 'khussa': '👞', 'sneakers': '👟', 'hand-bags': '👜',
  'shoulder-bags': '👜', 'tote-bags': '👜', 'crossbody-bags': '👜',
  'clutches': '👛', 'wallets': '👛', 'jewellery': '💍', 'watches': '⌚',
  'sunglasses': '🕶️', 'scarves-hijabs': '🧣', 'hair-accessories': '🎀',
};

const genderIcons: Record<string, string> = {
  'women': '👩', 'men': '👨', 'kids': '🧒', 'unisex': '👤'
};

const formatDescription = (text: string) => {
  if (!text) return [];
  const lines = text.split('\n').filter(line => line.trim());
  return lines.map((line) => {
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

const buildColorImageMap = (
  colorImages: FashionProduct['colorImages']
): Record<string, string[]> => {
  if (!colorImages) return {};

  if (Array.isArray(colorImages)) {
    const map: Record<string, string[]> = {};
    colorImages.forEach((entry) => {
      const key = entry.colorName;
      if (!map[key]) map[key] = [];
      map[key] = [...map[key], ...(entry.images || [])];
    });
    return map;
  }

  return colorImages;
};

// ============================================================
// COMPONENT
// ============================================================
const FashionDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<FashionProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<FashionProduct[]>([]);
  const [subCategoryProducts, setSubCategoryProducts] = useState<FashionProduct[]>([]);
  const [dryFruitsProducts, setDryFruitsProducts] = useState<FashionProduct[]>([]);
  const [sweetsProducts, setSweetsProducts] = useState<FashionProduct[]>([]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [storeSlug, setStoreSlug] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' });

  const sliderRef = useRef<HTMLDivElement>(null);
  const subSliderRef = useRef<HTMLDivElement>(null);
  const drySliderRef = useRef<HTMLDivElement>(null);
  const sweetsSliderRef = useRef<HTMLDivElement>(null);

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

        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          if (data.category === 'fashion') {
            const productData: FashionProduct = {
              id: docSnap.id,
              name: data.name || '',
              price: data.price || 0,
              oldPrice: data.oldPrice || 0,
              discountPrice: data.discountPrice || 0,
              discount: data.discount || 0,
              rating: data.rating || 0,
              category: data.category || 'fashion',
              gender: data.gender || '',
              productType: data.productType || '',
              subCategory: data.subCategory || '',
              subSubCategory: data.subSubCategory || '',
              style: data.style || '',
              productId: data.productId || '',
              image: data.image || '',
              images: data.images || [],
              colorImages: data.colorImages || [],
              sizes: data.sizes || [],
              sizeChart: data.sizeChart || null,
              colors: data.colors || [],
              stock: data.stock || 0,
              description: data.description || '',
              shortDescription: data.shortDescription || '',
              material: data.material || '',
              careInstructions: data.careInstructions || '',
              isNew: data.isNew || false,
              isFeatured: data.isFeatured || false,
              isBestSeller: data.isBestSeller || false,
              isOnSale: data.isOnSale || false,
              status: data.status || 'active',
              sellerId: data.sellerId || '',
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            };

            setProduct(productData);

            if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
            if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);

            const images = data.images || [];
            if (images.length > 0) setMainImage(images[0]);
            else if (data.image) setMainImage(data.image);

            await fetchAllProducts(docSnap.id, data);
            await fetchReviews(docSnap.id);
          } else {
            setError('Product not found in fashion category');
          }
        } else {
          setError('Product not found');
        }
      } catch (error: any) {
        console.error('Error fetching fashion product:', error);
        setError(error.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    const fetchAllProducts = async (currentId: string, currentData: any) => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const fashionProducts: FashionProduct[] = [];
        const dryFruits: FashionProduct[] = [];
        const sweets: FashionProduct[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (doc.id !== currentId) {
            const baseProduct = {
              id: doc.id,
              name: data.name || '',
              price: data.price || 0,
              oldPrice: data.oldPrice || 0,
              discountPrice: data.discountPrice || 0,
              discount: data.discount || 0,
              rating: data.rating || 0,
              category: data.category || '',
              gender: data.gender || '',
              productType: data.productType || '',
              subCategory: data.subCategory || '',
              subSubCategory: data.subSubCategory || '',
              style: data.style || '',
              productId: data.productId || '',
              image: data.image || '',
              images: data.images || [],
              colorImages: data.colorImages || [],
              sizes: data.sizes || [],
              sizeChart: data.sizeChart || null,
              colors: data.colors || [],
              stock: data.stock || 0,
              description: data.description || '',
              shortDescription: data.shortDescription || '',
              material: data.material || '',
              careInstructions: data.careInstructions || '',
              isNew: data.isNew || false,
              isFeatured: data.isFeatured || false,
              isBestSeller: data.isBestSeller || false,
              isOnSale: data.isOnSale || false,
              status: data.status || 'active',
              sellerId: data.sellerId || '',
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            };

            if (data.category === 'fashion') fashionProducts.push(baseProduct);
            if (data.category === 'dryfruits' || data.category === 'dry-fruits') dryFruits.push(baseProduct);
            if (data.category === 'sweets') sweets.push(baseProduct);
          }
        });

        const shuffled = [...fashionProducts].sort(() => 0.5 - Math.random());
        setSuggestedProducts(shuffled.slice(0, 8));

        const sameSubCategory = fashionProducts.filter(p =>
          p.subCategory === currentData.subCategory && p.id !== currentId
        );
        setSubCategoryProducts(sameSubCategory.slice(0, 8));
        setDryFruitsProducts(dryFruits.slice(0, 8));
        setSweetsProducts(sweets.slice(0, 8));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchReviews = async (productId: string) => {
      try {
        setReviewLoading(true);
        const reviewsRef = collection(db, 'products', productId, 'reviews');
        const reviewsSnap = await getDocs(reviewsRef);
        const reviewsData: Review[] = reviewsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Review));
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setReviewLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ Fetch seller's store slug
  useEffect(() => {
    if (!product?.sellerId) {
      setStoreSlug(null);
      return;
    }
    getStoreSlug(product.sellerId).then(setStoreSlug);
  }, [product?.sellerId]);

  const colorImageMap = useMemo(
    () => buildColorImageMap(product?.colorImages),
    [product?.colorImages]
  );

  const sizeChartColumns = useMemo(() => {
    if (!product?.sizeChart?.templateId) return [];
    try {
      return getSizeChartTemplate(product.sizeChart.templateId).columns;
    } catch {
      return [];
    }
  }, [product?.sizeChart]);

  const submitReview = async () => {
    if (!id) { alert('Product ID is missing'); return; }
    if (!newReview.comment.trim() || !newReview.name.trim()) {
      alert('Please fill all fields'); return;
    }

    try {
      const reviewData = {
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newReview.name)}&background=0F766E&color=fff&size=60`
      };

      await addDoc(collection(db, 'products', id, 'reviews'), reviewData);

      const reviewsRef = collection(db, 'products', id, 'reviews');
      const reviewsSnap = await getDocs(reviewsRef);
      const reviewsData: Review[] = reviewsSnap.docs.map(doc => ({
        id: doc.id, ...doc.data()
      } as Review));
      setReviews(reviewsData);

      setNewReview({ rating: 5, comment: '', name: '' });
      setShowReviewForm(false);
      alert('✅ Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('❌ Failed to submit review');
    }
  };

  const getDiscountedPrice = () => {
    if (!product) return 0;
    if (product.discountPrice && product.discountPrice < product.price) return product.discountPrice;
    if (product.discount && product.discount > 0) {
      return product.price - (product.price * product.discount / 100);
    }
    return product.price;
  };

  const getDiscountPercent = () => {
    if (!product) return 0;
    if (product.discount) return product.discount;
    if (product.discountPrice && product.discountPrice < product.price) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  const getAllImages = () => {
    if (!product) return [];
    const images = product.images || [];
    return images.length > 0 ? images : (product.image ? [product.image] : []);
  };

  const isInStock = () => product ? product.stock > 0 : false;

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

  const colorMap: Record<string, string> = {
    'Red': 'bg-red-500', 'Blue': 'bg-blue-500', 'Green': 'bg-green-500',
    'Yellow': 'bg-yellow-400', 'Black': 'bg-black', 'White': 'bg-white border-2 border-gray-300',
    'Pink': 'bg-pink-400', 'Gold': 'bg-yellow-600', 'Silver': 'bg-gray-300',
    'Brown': 'bg-amber-700', 'Grey': 'bg-gray-400', 'Beige': 'bg-amber-100',
    'Rose Gold': 'bg-rose-300', 'Tan': 'bg-amber-500', 'Orange': 'bg-orange-500',
    'Purple': 'bg-purple-500', 'Navy': 'bg-blue-900', 'Teal': 'bg-teal-500',
    'Maroon': 'bg-red-800', 'Olive': 'bg-green-700', 'Peach': 'bg-orange-200',
    'Lavender': 'bg-purple-200', 'Mint': 'bg-green-200', 'Coral': 'bg-red-300',
    'Cream': 'bg-amber-50', 'Turquoise': 'bg-teal-400'
  };

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) ref.current.scrollBy({ left: -280, behavior: 'smooth' });
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) ref.current.scrollBy({ left: 280, behavior: 'smooth' });
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    const colorImages = colorImageMap[color];
    if (colorImages && colorImages.length > 0) {
      setMainImage(colorImages[0]);
      setImageLoaded(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#D4AF37] mx-auto" />
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">👗</div>
          <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
          <p className="text-gray-500 mt-2">{error || 'Product does not exist.'}</p>
          <Link to="/fashion" className="inline-block mt-4 bg-[#D4AF37] text-white px-6 py-2 rounded-full hover:bg-[#b8941f] transition">
            Back to Fashion
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = getDiscountedPrice();
  const totalPrice = currentPrice * quantity;
  const images = getAllImages();
  const discountPercent = getDiscountPercent();
  const descriptionLines = formatDescription(product.description);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) ratingDistribution[r.rating - 1]++;
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-16 sm:pt-20 pb-8">

        <Link to="/fashion" className="inline-flex items-center gap-2 text-[#0F766E] hover:text-[#D4AF37] transition mb-4 text-sm">
          <FaArrowLeft /> Back to Fashion
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">

          {/* PRODUCT IMAGE */}
          <div className="relative">
            <div
              className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] mx-auto cursor-zoom-in group relative"
              onClick={() => {
                const idx = images.indexOf(mainImage);
                openLightbox(idx >= 0 ? idx : 0);
              }}
            >
              <div className="w-full aspect-[3/4] relative">
                <img
                  src={mainImage || product.image}
                  alt={product.name}
                  className={`w-full h-full object-contain p-2 transition-all duration-500 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/600x800/D4AF37/FFFFFF?text=${product.name}`;
                    setImageLoaded(true);
                  }}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">Click to zoom</span>
                  </div>
                </div>
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 transition shadow-md z-10"
                  >
                    <FaChevronLeft className="text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 transition shadow-md z-10"
                  >
                    <FaChevronRight className="text-gray-700" />
                  </button>
                </>
              )}
            </div>

            <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
              {discountPercent > 0 && (
                <span className="bg-[#E8604C] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                  -{discountPercent}%
                </span>
              )}
              {product.isNew && (
                <span className="bg-[#D4AF37] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                  NEW
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 overflow-x-auto pb-2 max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] mx-auto">
                <div className="flex gap-2 min-w-max justify-center">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { setMainImage(img); setImageLoaded(false); }}
                      onDoubleClick={() => openLightbox(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                        mainImage === img || (mainImage === '' && i === 0)
                          ? 'border-[#0F766E]'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${i+1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/100x100/D4AF37/FFFFFF?text=${i+1}`;
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="flex flex-col gap-4">

            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-medium capitalize">
                {categoryIcons[product.productType || ''] || '👗'} {product.productType?.replace(/-/g, ' ') || product.subCategory || 'Fashion'}
              </span>
              {product.gender && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium capitalize">
                  {genderIcons[product.gender] || '👤'} {product.gender}
                </span>
              )}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} size={12} />
                ))}
                <span className="text-gray-400 text-xs ml-1">({product.rating})</span>
              </div>
            </div>

            {/* ✅ VISIT STORE BUTTON */}
            {storeSlug && (
              <Link
                to={`/store/${storeSlug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#0F766E] hover:text-[#065F46] transition-all duration-200 px-3 py-2 rounded-lg hover:bg-[#0F766E]/5 border border-[#0F766E]/20 w-fit"
              >
                <Store size={16} />
                <span>Visit Store</span>
                <ChevronRight size={14} className="opacity-60" />
              </Link>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-[#E8604C]">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {product.oldPrice && product.oldPrice > currentPrice && (
                <span className="text-gray-400 line-through text-base">
                  Rs. {product.oldPrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-green-100 text-green-600 text-xs font-medium px-3 py-1 rounded-full">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isInStock() ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className={`text-sm font-medium ${isInStock() ? 'text-green-600' : 'text-red-600'}`}>
                {isInStock() ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-gray-700 text-sm leading-relaxed space-y-1">
                {descriptionLines.length > 0 ? (
                  descriptionLines.map((line, idx) => {
                    if (line.includes('👑') || line.includes('💎') || line.includes('👗') ||
                        line.includes('✨') || line.includes('⭐') || line.includes('🌟') ||
                        (line.length < 40 && line === line.toUpperCase() && line.trim().length > 0)) {
                      return (
                        <div key={idx} className="font-semibold text-gray-900 text-sm mt-2 first:mt-0">
                          {line}
                        </div>
                      );
                    }
                    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                      return (
                        <div key={idx} className="flex items-start gap-2 py-0.5">
                          <FaCircle className="text-[#D4AF37] text-[5px] mt-2 flex-shrink-0" />
                          <span className="text-gray-600 text-xs">
                            {line.replace(/^[•\-*]\s*/, '')}
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className="text-gray-600 text-xs py-0.5">{line}</div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">No description available.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {product.material && (
                <div className="p-3 bg-gradient-to-br from-[#0F766E]/5 to-[#0F766E]/10 rounded-xl border border-[#0F766E]/20">
                  <p className="text-[10px] text-[#0F766E] font-semibold uppercase tracking-wider">Material</p>
                  <p className="text-sm text-gray-700 font-medium">{product.material}</p>
                </div>
              )}
              {product.careInstructions && (
                <div className="p-3 bg-gradient-to-br from-[#D4AF37]/5 to-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
                  <p className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">Care</p>
                  <p className="text-sm text-gray-700 font-medium">{product.careInstructions}</p>
                </div>
              )}
            </div>

            {/* SIZE SELECTOR */}
            {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'One Size' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Size <span className="text-red-500">*</span>
                  </label>
                  {product.sizeChart && sizeChartColumns.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowSizeChart(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0F766E] hover:text-[#065F46] transition px-2 py-1 rounded-lg hover:bg-[#0F766E]/5"
                    >
                      <Ruler size={14} />
                      Size Chart
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedSize === size
                          ? 'bg-[#0F766E] text-white shadow-md'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* COLOR SELECTOR */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Color <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => {
                    const bgColor = colorMap[color] || 'bg-gray-200';
                    return (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition ${
                          selectedColor === color
                            ? 'bg-[#0F766E] text-white shadow-md'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full ${bgColor} ${color === 'White' ? 'border border-gray-300' : ''}`}></span>
                        <span className="text-xs">{color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 transition flex items-center justify-center border border-gray-200"
                >
                  <span className="font-medium">+</span>
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => {
                  if (!selectedColor) { alert('Please select a color'); return; }
                  addToCart({
                    ...product,
                    price: currentPrice,
                    size: selectedSize || 'One Size',
                    color: selectedColor || 'Default',
                    quantity: quantity,
                    totalPrice: totalPrice
                  });
                  alert('✅ Added to Cart!');
                }}
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
                onClick={() => {
                  if (!selectedColor) { alert('Please select a color'); return; }
                  addToCart({
                    ...product,
                    price: currentPrice,
                    size: selectedSize || 'One Size',
                    color: selectedColor || 'Default',
                    quantity: quantity,
                    totalPrice: totalPrice
                  });
                  window.location.href = '/checkout';
                }}
                disabled={!isInStock()}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition shadow-lg flex items-center justify-center ${
                  isInStock()
                    ? 'bg-[#D4AF37] text-white hover:bg-[#b8941f]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                Buy Now
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const shareData = {
                    title: product.name,
                    text: `Check out ${product.name} at Maha One Hypermart!`,
                    url: window.location.href
                  };
                  if (navigator.share) {
                    navigator.share(shareData).catch(() => {});
                    return;
                  }
                  navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`).then(() => {
                    alert('✅ Link copied!');
                  });
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-full text-xs font-medium transition flex items-center justify-center gap-1"
              >
                <FaShare /> Share
              </button>
              <button
                onClick={() => {
                  const message = `Check out ${product.name} at Maha One Hypermart! ${window.location.href}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="flex-1 bg-[#25D366] hover:bg-[#1DA851] text-white px-3 py-2 rounded-full text-xs font-medium transition flex items-center justify-center gap-1"
              >
                <FaWhatsapp /> WhatsApp
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                <FaTruck className="text-[#D4AF37] text-lg mx-auto" />
                <p className="text-[10px] text-gray-500 mt-1">Delivery PK</p>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                <FaShieldAlt className="text-[#D4AF37] text-lg mx-auto" />
                <p className="text-[10px] text-gray-500 mt-1">Premium</p>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                <FaLeaf className="text-[#D4AF37] text-lg mx-auto" />
                <p className="text-[10px] text-gray-500 mt-1">Authentic</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sliders */}
        {suggestedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-[#D4AF37]">✨</span> You May Also Like
              </h2>
              <Link to="/fashion" className="text-[#D4AF37] hover:text-[#b8941f] text-sm font-medium">
                View All →
              </Link>
            </div>
            <ProductSlider products={suggestedProducts} sliderRef={sliderRef} scrollLeft={() => scrollLeft(sliderRef)} scrollRight={() => scrollRight(sliderRef)} addToCart={addToCart} />
          </div>
        )}

        {subCategoryProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-[#D4AF37]">📂</span> More in {product.subCategory?.replace(/-/g, ' ') || 'This Category'}
              </h2>
            </div>
            <ProductSlider products={subCategoryProducts} sliderRef={subSliderRef} scrollLeft={() => scrollLeft(subSliderRef)} scrollRight={() => scrollRight(subSliderRef)} addToCart={addToCart} />
          </div>
        )}

        {dryFruitsProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-[#D4AF37]">🥜</span> Premium Dry Fruits
              </h2>
            </div>
            <ProductSlider products={dryFruitsProducts} sliderRef={drySliderRef} scrollLeft={() => scrollLeft(drySliderRef)} scrollRight={() => scrollRight(drySliderRef)} addToCart={addToCart} />
          </div>
        )}

        {sweetsProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-[#D4AF37]">🍬</span> Sweet Collection
              </h2>
            </div>
            <ProductSlider products={sweetsProducts} sliderRef={sweetsSliderRef} scrollLeft={() => scrollLeft(sweetsSliderRef)} scrollRight={() => scrollRight(sweetsSliderRef)} addToCart={addToCart} />
          </div>
        )}

        {/* Reviews */}
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
                  onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                />
                <div className="flex gap-1 text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <FaStar className={star <= newReview.rating ? 'text-[#D4AF37]' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
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
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-2xl">
              <p className="text-gray-400">No reviews yet. Be the first! ⭐</p>
            </div>
          )}
        </div>
      </div>

      <ImageLightbox
        images={images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />

      {product.sizeChart && sizeChartColumns.length > 0 && (
        <SizeChartModal
          isOpen={showSizeChart}
          onClose={() => setShowSizeChart(false)}
          data={product.sizeChart}
          columns={sizeChartColumns}
          title={`${product.productType || 'Product'} Size Chart`}
        />
      )}
    </div>
  );
};

// ✅ Product Slider Component
interface ProductSliderProps {
  products: FashionProduct[];
  sliderRef: React.RefObject<HTMLDivElement>;
  scrollLeft: () => void;
  scrollRight: () => void;
  addToCart: (product: any) => void;
}

const ProductSlider: React.FC<ProductSliderProps> = ({
  products, sliderRef, scrollLeft, scrollRight, addToCart
}) => {
  return (
    <div className="relative">
      <button
        onClick={scrollLeft}
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50 transition"
      >
        <FaChevronLeft className="text-gray-600" size={14} />
      </button>

      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => {
          const linkTo = product.category === 'dryfruits' || product.category === 'dry-fruits'
            ? `/dry-product/${product.id}`
            : product.category === 'sweets'
              ? `/sweet-product/${product.id}`
              : `/fashion/${product.id}`;

          return (
            <Link
              key={product.id}
              to={linkTo}
              className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] group"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/300x400/D4AF37/FFFFFF?text=${product.name}`;
                  }}
                />
                {product.discount && product.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-[#E8604C] text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                    -{product.discount}%
                  </span>
                )}
              </div>
              <h4 className="font-medium text-gray-800 text-xs line-clamp-2 min-h-[2rem]">
                {product.name}
              </h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[#E8604C] font-bold text-sm">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-gray-400 line-through text-[10px]">
                    Rs. {product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <button
        onClick={scrollRight}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50 transition"
      >
        <FaChevronRight className="text-gray-600" size={14} />
      </button>
    </div>
  );
};

export default FashionDetailPage;
// src/components/pages/SweetsDetailPage.tsx
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  FaStar, FaShoppingCart, FaArrowLeft, 
  FaTruck, FaShieldAlt, FaLeaf, FaChevronLeft, FaChevronRight,
  FaCircle, FaSpinner, FaShare, FaWhatsapp, FaCalendarAlt, FaQuoteLeft
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { db, doc, getDoc, collection, getDocs } from '../../config/firebase';

// ✅ Product Interface
interface SweetsProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  discountPrice?: number;
  rating: number;
  category: string;
  subCategory: string;
  productType?: string;
  image: string;
  images: string[];
  stock: number;
  description: string;
  shortDescription?: string;
  benefits: string[];
  flavor?: string;
  ingredients?: string;
  origin?: string;
  packaging?: string;
  shelfLife?: string;
  nutritionalInfo?: string;
  dietaryInfo?: string[];
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  isOrganic?: boolean;
  isGlutenFree?: boolean;
  isVegan?: boolean;
  isSugarFree?: boolean;
  status?: string;
  createdAt?: any;
  updatedAt?: any;
}

// ✅ Review Interface
interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

// ✅ Helper function to convert description to bullet points
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

const SweetsDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<SweetsProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<SweetsProduct[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // ✅ Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  // ✅ Fetch Product from Firebase
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
          
          if (data.category === 'sweets') {
            const productData: SweetsProduct = {
              id: docSnap.id,
              name: data.name || '',
              price: data.price || 0,
              oldPrice: data.oldPrice || 0,
              discount: data.discount || 0,
              discountPrice: data.discountPrice || 0,
              rating: data.rating || 0,
              category: data.category || 'sweets',
              subCategory: data.subCategory || '',
              productType: data.productType || '',
              image: data.image || '',
              images: data.images || [],
              stock: data.stock || 0,
              description: data.description || '',
              shortDescription: data.shortDescription || '',
              benefits: data.benefits || [],
              flavor: data.flavor || '',
              ingredients: data.ingredients || '',
              origin: data.origin || '',
              packaging: data.packaging || '',
              shelfLife: data.shelfLife || '',
              nutritionalInfo: data.nutritionalInfo || '',
              dietaryInfo: data.dietaryInfo || [],
              isNew: data.isNew || false,
              isFeatured: data.isFeatured || false,
              isBestSeller: data.isBestSeller || false,
              isOnSale: data.isOnSale || false,
              isOrganic: data.isOrganic || false,
              isGlutenFree: data.isGlutenFree || false,
              isVegan: data.isVegan || false,
              isSugarFree: data.isSugarFree || false,
              status: data.status || 'active',
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            };
            
            setProduct(productData);
            
            const images = data.images || [];
            if (images.length > 0) {
              setMainImage(images[0]);
            } else if (data.image) {
              setMainImage(data.image);
            }

            // ✅ Fetch suggested products
            await fetchSuggestedProducts(docSnap.id);
            // ✅ Fetch reviews
            await fetchReviews(docSnap.id);
          } else {
            setError('Product not found in sweets category');
          }
        } else {
          setError('Product not found');
        }
      } catch (error: any) {
        console.error('Error fetching sweets product:', error);
        setError(error.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestedProducts = async (currentId: string) => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const sweetsProducts: SweetsProduct[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (doc.id !== currentId && data.category === 'sweets') {
            sweetsProducts.push({
              id: doc.id,
              name: data.name || '',
              price: data.price || 0,
              oldPrice: data.oldPrice || 0,
              discount: data.discount || 0,
              discountPrice: data.discountPrice || 0,
              rating: data.rating || 0,
              category: data.category || 'sweets',
              subCategory: data.subCategory || '',
              productType: data.productType || '',
              image: data.image || '',
              images: data.images || [],
              stock: data.stock || 0,
              description: data.description || '',
              shortDescription: data.shortDescription || '',
              benefits: data.benefits || [],
              flavor: data.flavor || '',
              ingredients: data.ingredients || '',
              origin: data.origin || '',
              packaging: data.packaging || '',
              shelfLife: data.shelfLife || '',
              nutritionalInfo: data.nutritionalInfo || '',
              dietaryInfo: data.dietaryInfo || [],
              isNew: data.isNew || false,
              isFeatured: data.isFeatured || false,
              isBestSeller: data.isBestSeller || false,
              isOnSale: data.isOnSale || false,
              isOrganic: data.isOrganic || false,
              isGlutenFree: data.isGlutenFree || false,
              isVegan: data.isVegan || false,
              isSugarFree: data.isSugarFree || false,
              status: data.status || 'active',
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            });
          }
        });

        // Shuffle and get 8 products
        const shuffled = [...sweetsProducts].sort(() => 0.5 - Math.random());
        setSuggestedProducts(shuffled.slice(0, 8));
      } catch (error) {
        console.error('Error fetching suggested products:', error);
      }
    };

    // ✅ Fetch Reviews from Firebase
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

  // ✅ Get price with discount - Only if explicitly set
  const getDiscountedPrice = () => {
    if (!product) return 0;
    
    const hasDiscount = (product.discount && product.discount > 0) || 
                        (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price);
    
    if (!hasDiscount) {
      return product.price;
    }
    
    if (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price) {
      return product.discountPrice;
    }
    
    if (product.discount && product.discount > 0) {
      return product.price - (product.price * product.discount / 100);
    }
    
    return product.price;
  };

  const getDiscountPercent = () => {
    if (!product) return 0;
    if (product.discount && product.discount > 0) {
      return product.discount;
    }
    if (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  const getAllImages = () => {
    if (!product) return [];
    const images = product.images || [];
    return images.length > 0 ? images : (product.image ? [product.image] : []);
  };

  const isInStock = () => {
    if (!product) return false;
    return product.stock > 0;
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

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FFFDF7] dark:bg-[#111827]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#D4AF37] mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFDF7] dark:bg-[#111827]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🍬</div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Product Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {error || 'The product you are looking for does not exist.'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Product ID: {id}</p>
          <Link to="/sweets" className="inline-block mt-4 bg-[#D4AF37] text-white px-6 py-2 rounded-full hover:bg-[#b8941f] transition">
            Back to Sweets
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

  // ✅ Calculate review stats
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;
  
  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingDistribution[r.rating - 1]++;
    }
  });

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-16 sm:pt-6 md:pt-8 lg:pt-12 pb-4 sm:pb-6 md:pb-8 lg:pb-12">
        
        <Link to="/sweets" className="inline-flex items-center gap-2 text-[#0F766E] dark:text-[#14b8a6] hover:text-[#D4AF37] transition mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base">
          <FaArrowLeft className="text-xs sm:text-sm md:text-base" /> Back to Sweets
        </Link>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          
          {/* ============================================================
          PRODUCT IMAGES GALLERY
          ============================================================ */}
          <div className="relative">
            <div className="bg-[#F5F3FF] dark:bg-[#1F2937] rounded-3xl overflow-hidden border-4 border-purple-500 shadow-xl shadow-purple-500/20 relative">
              <div className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] relative flex items-center justify-center bg-[#F5F3FF] dark:bg-[#1F2937]">
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
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 rounded-full p-2 sm:p-3 hover:bg-white dark:hover:bg-gray-700 transition shadow-lg z-10 border-2 border-purple-300"
                  >
                    <FaChevronLeft className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 rounded-full p-2 sm:p-3 hover:bg-white dark:hover:bg-gray-700 transition shadow-lg z-10 border-2 border-purple-300"
                  >
                    <FaChevronRight className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/70 text-white text-[10px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full z-10 border border-white/20">
                {images.indexOf(mainImage) + 1} / {images.length}
              </div>
            )}

            <div className="mt-3 sm:mt-4 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-2 sm:gap-2.5 min-w-max">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMainImage(img);
                      setImageLoaded(false);
                    }}
                    className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${
                      mainImage === img || (mainImage === '' && i === 0)
                        ? 'border-purple-500 shadow-md shadow-purple-500/30'
                        : 'border-transparent hover:border-purple-300'
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

            {/* Badges */}
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg z-10 border-2 border-white/50">
                -{discountPercent}%
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-3 left-14 sm:top-4 sm:left-20 bg-green-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg z-10 border-2 border-white/50">
                NEW
              </span>
            )}
            {product.isBestSeller && (
              <span className="absolute top-3 left-28 sm:top-4 sm:left-36 bg-[#D4AF37] text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg z-10 border-2 border-white/50">
                ★ BEST
              </span>
            )}
            {product.isOrganic && (
              <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-green-700 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg z-10 border-2 border-white/50">
                🌿 Organic
              </span>
            )}
            {product.isGlutenFree && (
              <span className="absolute top-12 right-3 sm:top-14 sm:right-4 bg-yellow-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg z-10 border-2 border-white/50">
                🚫 GF
              </span>
            )}
            {product.isVegan && (
              <span className="absolute top-20 right-3 sm:top-24 sm:right-4 bg-emerald-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg z-10 border-2 border-white/50">
                🌱 Vegan
              </span>
            )}
          </div>

          {/* ============================================================
          PRODUCT INFO
          ============================================================ */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 overflow-visible">
            
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium capitalize">
                🍬 {product.subCategory || 'Sweets'}
              </span>
              {product.flavor && (
                <span className="bg-pink-100 text-pink-600 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
                  {product.flavor}
                </span>
              )}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                ))}
                <span className="text-gray-400 dark:text-gray-500 text-[10px] ml-0.5">({product.rating})</span>
              </div>
            </div>

            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#111827] dark:text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#D4AF37]">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {product.oldPrice && product.oldPrice > currentPrice && (
                <span className="text-gray-400 dark:text-gray-500 line-through text-sm sm:text-base">
                  Rs. {product.oldPrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                  Save {discountPercent}%
                </span>
              )}
              {product.isOnSale && (
                <span className="bg-red-100 text-red-600 text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full animate-pulse">
                  🔥 On Sale!
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isInStock() ? 'bg-green-500 animate-blink' : 'bg-red-500'}`}></span>
              <span className={`text-[10px] sm:text-xs md:text-sm font-medium ${isInStock() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isInStock() ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            <div className="bg-[#F8FAFC] dark:bg-[#1F2937] rounded-xl border border-[#E5E7EB] dark:border-gray-700 p-3 sm:p-4 max-h-[200px] overflow-y-auto">
              <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed space-y-1">
                {descriptionLines.length > 0 ? (
                  descriptionLines.map((line, idx) => {
                    if (line.includes('🍫') || line.includes('🍬') || line.includes('🍭') || 
                        line.includes('✨') || line.includes('⭐') || line.includes('🌟') ||
                        (line.length < 40 && line === line.toUpperCase() && line.trim().length > 0)) {
                      return (
                        <div key={idx} className="font-semibold text-[#111827] dark:text-white text-xs sm:text-sm mt-2 first:mt-0">
                          {line}
                        </div>
                      );
                    }
                    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                      return (
                        <div key={idx} className="flex items-start gap-1.5 sm:gap-2 py-0.5">
                          <FaCircle className="text-[#D4AF37] text-[4px] sm:text-[6px] mt-1.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs">
                            {line.replace(/^[•\-*]\s*/, '')}
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className="text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs py-0.5">
                        {line}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">No description available.</p>
                )}
              </div>
            </div>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="p-2.5 sm:p-3 md:p-4 bg-[#F8FAFC] dark:bg-[#1F2937] rounded-xl border border-[#E5E7EB] dark:border-gray-700">
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-[#111827] dark:text-white mb-1">✨ Key Benefits:</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.benefits.map((benefit, i) => (
                    <span key={i} className="bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-gray-700 px-2 py-0.5 rounded-full text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dietary Info */}
            {product.dietaryInfo && product.dietaryInfo.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.dietaryInfo.map((dietary, i) => (
                  <span key={i} className="bg-[#F8FAFC] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-gray-700 px-2 py-0.5 rounded-full text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
                    {dietary}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {product.origin && (
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-[#0F766E]/5 to-[#0F766E]/10 rounded-xl border border-[#0F766E]/20">
                  <p className="text-[8px] sm:text-[10px] text-[#0F766E] font-semibold uppercase tracking-wider">Origin</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium">{product.origin}</p>
                </div>
              )}
              {product.shelfLife && (
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-[#D4AF37]/5 to-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
                  <p className="text-[8px] sm:text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">Shelf Life</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium">{product.shelfLife}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <label className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Qty</label>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#F8FAFC] dark:bg-[#1F2937] hover:bg-[#E5E7EB] dark:hover:bg-gray-700 transition flex items-center justify-center"
                >
                  <span className="text-sm sm:text-base font-medium">-</span>
                </button>
                <span className="w-6 sm:w-7 md:w-8 text-center font-semibold text-sm sm:text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#F8FAFC] dark:bg-[#1F2937] hover:bg-[#E5E7EB] dark:hover:bg-gray-700 transition flex items-center justify-center"
                >
                  <span className="text-sm sm:text-base font-medium">+</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col xs:flex-row gap-2 sm:gap-2.5 md:gap-3 mt-1">
              <button
                onClick={() => {
                  addToCart({
                    ...product,
                    price: currentPrice,
                    quantity: quantity,
                    totalPrice: totalPrice
                  });
                  alert('✅ Added to Cart!');
                }}
                disabled={!isInStock()}
                className={`flex-1 px-3 py-2 sm:px-5 sm:py-2.5 md:px-7 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 ${
                  isInStock()
                    ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart className="text-xs sm:text-sm" />
                <span>{isInStock() ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
              <button
                onClick={() => {
                  if (!isInStock()) {
                    alert('❌ This product is out of stock!');
                    return;
                  }
                  addToCart({
                    ...product,
                    price: currentPrice,
                    quantity: quantity,
                    totalPrice: totalPrice
                  });
                  window.location.href = '/checkout';
                }}
                disabled={!isInStock()}
                className={`px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 ${
                  isInStock() 
                    ? 'bg-[#D4AF37] text-white hover:bg-[#b8941f] cursor-pointer' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
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

                  const fullText = `${shareData.text}\n${shareData.url}`;
                  navigator.clipboard.writeText(fullText).then(() => {
                    alert('✅ Link copied to clipboard! Share it anywhere.');
                  }).catch(() => {
                    window.location.href = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(fullText)}`;
                  });
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-full text-[10px] sm:text-xs font-medium transition flex items-center justify-center gap-1"
              >
                <FaShare /> Share
              </button>

              <button
                onClick={() => {
                  const message = `Check out ${product.name} at Maha One Hypermart! ${window.location.href}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="flex-1 bg-[#25D366] hover:bg-[#1DA851] text-white px-3 py-2 rounded-full text-[10px] sm:text-xs font-medium transition flex items-center justify-center gap-1"
              >
                <FaWhatsapp /> WhatsApp
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-1">
              <div className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur p-1.5 sm:p-2 md:p-2.5 rounded-xl border border-[#E5E7EB] dark:border-gray-700 text-center">
                <FaTruck className="text-[#D4AF37] text-sm sm:text-base md:text-lg mx-auto" />
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">Delivery Across Pakistan</p>
              </div>
              <div className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur p-1.5 sm:p-2 md:p-2.5 rounded-xl border border-[#E5E7EB] dark:border-gray-700 text-center">
                <FaShieldAlt className="text-[#D4AF37] text-sm sm:text-base md:text-lg mx-auto" />
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">Premium Quality</p>
              </div>
              <div className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur p-1.5 sm:p-2 md:p-2.5 rounded-xl border border-[#E5E7EB] dark:border-gray-700 text-center">
                <FaLeaf className="text-[#D4AF37] text-sm sm:text-base md:text-lg mx-auto" />
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">100% Natural</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
        SUGGESTED PRODUCTS SLIDER
        ============================================================ */}
        {suggestedProducts.length > 0 && (
          <div className="mt-8 sm:mt-10 md:mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827] dark:text-white flex items-center gap-2">
                <span className="text-[#D4AF37]">✨</span> You May Also Like
              </h2>
              <Link to="/sweets" className="text-[#D4AF37] hover:text-[#b8941f] transition text-xs sm:text-sm font-medium flex items-center gap-1">
                View All <span className="text-xs">→</span>
              </Link>
            </div>
            <ProductSlider 
              products={suggestedProducts} 
              sliderRef={sliderRef}
              scrollLeft={() => scrollLeft(sliderRef)}
              scrollRight={() => scrollRight(sliderRef)}
              addToCart={addToCart}
            />
          </div>
        )}

        {/* ============================================================
        CUSTOMER REVIEWS
        ============================================================ */}
        <div className="mt-10 sm:mt-12 md:mt-14">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827] dark:text-white flex items-center gap-2">
              <span className="text-[#D4AF37]">⭐</span> Customer Reviews
              <span className="text-sm font-normal text-gray-400">({reviews.length} reviews)</span>
            </h2>
          </div>

          {reviewLoading ? (
            <div className="text-center py-8">
              <FaSpinner className="animate-spin text-2xl text-[#D4AF37] mx-auto" />
              <p className="text-gray-500 mt-2">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {reviews.map((review) => (
                <div 
                  key={review.id}
                  className="bg-white dark:bg-[#1F2937] rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-1 text-[#D4AF37] text-sm sm:text-base mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < (review.rating || 0) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                    <FaQuoteLeft className="text-[#D4AF37]/30 text-xs inline mr-1" />
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <img 
                      src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name || 'User')}&background=0F766E&color=fff&size=60`} 
                      alt={review.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37]/30"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=User&background=0F766E&color=fff&size=60`;
                      }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{review.name || 'Anonymous'}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <FaCalendarAlt className="text-[10px]" />
                        {review.date ? new Date(review.date).toLocaleDateString('en-PK', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 'Recent'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white dark:bg-[#1F2937] rounded-2xl border border-gray-100 dark:border-gray-700">
              <p className="text-gray-400">No reviews yet. Be the first to review this product! ⭐</p>
            </div>
          )}

          {reviews.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 p-4 bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
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
              <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
              {[5, 4, 3].map((star) => {
                const count = ratingDistribution[star - 1] || 0;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="text-center">
                    <p className="text-sm text-gray-500">⭐ {star} star</p>
                    <div className="flex items-center gap-2">
                      <div className="w-24 sm:w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${star >= 4 ? 'bg-green-500' : star >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-400">{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Product Slider Component
interface ProductSliderProps {
  products: SweetsProduct[];
  sliderRef: React.RefObject<HTMLDivElement>;
  scrollLeft: () => void;
  scrollRight: () => void;
  addToCart: (product: any) => void;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ 
  products, 
  sliderRef, 
  scrollLeft, 
  scrollRight,
  addToCart 
}) => {
  return (
    <div className="relative">
      <button
        onClick={scrollLeft}
        className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-[#1F2937] rounded-full p-1.5 sm:p-2 shadow-lg border border-[#E5E7EB] dark:border-gray-700 hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition"
      >
        <FaChevronLeft className="text-gray-600 dark:text-gray-400 text-sm sm:text-base" />
      </button>

      <div
        ref={sliderRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/sweet-product/${product.id}`}
            className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] bg-white dark:bg-[#1F2937] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[#E5E7EB] dark:border-gray-700 hover:-translate-y-1 group"
          >
            <div className="relative aspect-square bg-[#F5F3FF] dark:bg-[#1F2937] flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=${encodeURIComponent(product.name)}`;
                }}
              />
              {product.discount && product.discount > 0 && (
                <span className="absolute top-1 left-1 bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  -{product.discount}%
                </span>
              )}
              {product.isNew && (
                <span className="absolute top-1 left-10 bg-green-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  NEW
                </span>
              )}
              <div className="absolute bottom-1 right-1 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-blink' : 'bg-red-500'}`}></span>
              </div>
            </div>
            <div className="p-2 sm:p-3">
              <h4 className="font-semibold text-[#111827] dark:text-white text-[10px] sm:text-xs line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                {product.name}
              </h4>
              <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                <span className="text-[#D4AF37] font-bold text-xs sm:text-sm">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-gray-400 line-through text-[8px] sm:text-[10px]">
                    Rs. {product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (product.stock > 0) {
                    addToCart({ ...product, quantity: 1 });
                    alert(`✅ ${product.name} added to cart!`);
                  }
                }}
                disabled={product.stock === 0}
                className={`w-full mt-1 px-2 py-1 rounded-full text-[8px] sm:text-[10px] font-medium transition flex items-center justify-center gap-1 ${
                  product.stock > 0
                    ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart className="text-[8px] sm:text-[10px]" />
                {product.stock > 0 ? 'Add' : 'Sold'}
              </button>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={scrollRight}
        className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-[#1F2937] rounded-full p-1.5 sm:p-2 shadow-lg border border-[#E5E7EB] dark:border-gray-700 hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition"
      >
        <FaChevronRight className="text-gray-600 dark:text-gray-400 text-sm sm:text-base" />
      </button>
    </div>
  );
};

export default SweetsDetailPage;
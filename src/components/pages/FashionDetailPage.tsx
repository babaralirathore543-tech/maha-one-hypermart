// src/components/pages/FashionDetailPage.tsx
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  FaStar, FaShoppingCart, FaArrowLeft, 
  FaTruck, FaShieldAlt, FaLeaf, FaChevronLeft, FaChevronRight,
  FaCircle, FaSpinner, FaShare, FaWhatsapp
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { db, doc, getDoc, collection, getDocs } from '../../config/firebase';

// ✅ Product Interface - Matching Admin Product Form
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
  colorImages?: { [key: string]: string[] };
  sizes: string[];
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
  createdAt?: any;
  updatedAt?: any;
}

// ✅ Category Icons Mapping
const categoryIcons: Record<string, string> = {
  'clothing': '👗',
  'footwear': '👠',
  'bags': '👜',
  'accessories': '💎',
  'unstitched': '🧵',
  'ready-to-wear': '👔',
  'sarees': '🥻',
  'abayas': '🧕',
  'nightwear': '🌙',
  'heels': '👠',
  'flats': '👟',
  'slippers': '🩴',
  'sandals': '👡',
  'khussa': '👞',
  'sneakers': '👟',
  'hand-bags': '👜',
  'shoulder-bags': '👜',
  'tote-bags': '👜',
  'crossbody-bags': '👜',
  'clutches': '👛',
  'wallets': '👛',
  'jewellery': '💍',
  'watches': '⌚',
  'sunglasses': '🕶️',
  'scarves-hijabs': '🧣',
  'hair-accessories': '🎀',
  'shirts': '👔',
  't-shirts': '👕',
  'jeans': '👖',
  'kurta': '👕',
  'trousers': '👖',
  'suits': '🤵',
  'formal-shoes': '👞',
  'casual-shoes': '👟',
  'backpacks': '🎒',
  'messenger-bags': '💼',
  'briefcases': '💼',
  'belts': '🔗',
  'ties': '👔',
  'boys': '👦',
  'girls': '👧',
  'baby': '👶',
  'dresses': '👗',
  'frocks': '👗',
  'kurti': '👕',
  'lawn': '🌿',
  'onesies': '👶',
  'sleepwear': '🌙',
  'hats': '🧢'
};

// ✅ Gender Icons
const genderIcons: Record<string, string> = {
  'women': '👩',
  'men': '👨',
  'kids': '🧒',
  'unisex': '👤'
};

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
  const [otherProducts, setOtherProducts] = useState<FashionProduct[]>([]);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const subSliderRef = useRef<HTMLDivElement>(null);
  const otherSliderRef = useRef<HTMLDivElement>(null);

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
          
          // ✅ Check if product is in fashion category
          if (data.category === 'fashion') {
            const productData: FashionProduct = {
              id: docSnap.id,
              name: data.name || '',
              price: data.price || 0,
              oldPrice: data.oldPrice || 0,
              discountPrice: data.discountPrice || 0,
              discount: data.discount || data.discountPrice || 0,
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
              colorImages: data.colorImages || {},
              sizes: data.sizes || [],
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
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            };
            
            setProduct(productData);
            
            // ✅ Set default selections
            if (data.sizes && data.sizes.length > 0) {
              setSelectedSize(data.sizes[0]);
            }
            if (data.colors && data.colors.length > 0) {
              setSelectedColor(data.colors[0]);
            }
            
            // ✅ Set main image
            const images = data.images || [];
            if (images.length > 0) {
              setMainImage(images[0]);
            } else if (data.image) {
              setMainImage(data.image);
            }

            // ✅ Fetch all products for suggestions
            await fetchAllProducts(docSnap.id, data);
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
        const products: FashionProduct[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.category === 'fashion' && doc.id !== currentId) {
            products.push({
              id: doc.id,
              name: data.name || '',
              price: data.price || 0,
              oldPrice: data.oldPrice || 0,
              discountPrice: data.discountPrice || 0,
              discount: data.discount || data.discountPrice || 0,
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
              colorImages: data.colorImages || {},
              sizes: data.sizes || [],
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
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            });
          }
        });

        // ✅ Suggested Products (random 8)
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setSuggestedProducts(shuffled.slice(0, 8));

        // ✅ Subcategory Products (same subCategory)
        const sameSubCategory = products.filter(p => 
          p.subCategory === currentData.subCategory && p.id !== currentId
        );
        setSubCategoryProducts(sameSubCategory.slice(0, 8));

        // ✅ Other Products (different subCategory)
        const other = products.filter(p => 
          p.subCategory !== currentData.subCategory
        );
        setOtherProducts(other.slice(0, 8));

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ Get price with discount
  const getDiscountedPrice = () => {
    if (!product) return 0;
    if (product.discountPrice && product.discountPrice < product.price) {
      return product.discountPrice;
    }
    if (product.discount && product.discount > 0) {
      return product.price - (product.price * product.discount / 100);
    }
    return product.price;
  };

  // ✅ Get discount percentage
  const getDiscountPercent = () => {
    if (!product) return 0;
    if (product.discount) return product.discount;
    if (product.discountPrice && product.discountPrice < product.price) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  // ✅ Get all images
  const getAllImages = () => {
    if (!product) return [];
    const images = product.images || [];
    return images.length > 0 ? images : (product.image ? [product.image] : []);
  };

  // ✅ Check if product is in stock
  const isInStock = () => {
    if (!product) return false;
    return product.stock > 0;
  };

  // ✅ Image Navigation
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

  // ✅ Color Map for color picker
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

  // ✅ Scroll functions for sliders
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
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FFFDF7]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#D4AF37] mx-auto" />
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFDF7] dark:bg-[#111827]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">👗</div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Product Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {error || 'The product you are looking for does not exist.'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Product ID: {id}</p>
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

  // ✅ Format description
  const descriptionLines = formatDescription(product.description);

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-16 sm:pt-6 md:pt-8 lg:pt-12 pb-4 sm:pb-6 md:pb-8 lg:pb-12">
        
        <Link to="/fashion" className="inline-flex items-center gap-2 text-[#0F766E] dark:text-[#14b8a6] hover:text-[#D4AF37] transition mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base">
          <FaArrowLeft className="text-xs sm:text-sm md:text-base" /> Back to Fashion
        </Link>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          
          {/* ============================================================
          ✅ PRODUCT IMAGES GALLERY
          ============================================================ */}
          <div className="relative">
            <div className="bg-[#F5F3FF] dark:bg-[#1F2937] rounded-xl sm:rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-gray-700 relative">
              <div className="w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] relative">
                <img
                  src={mainImage || product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-all duration-500 ${
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
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 rounded-full p-1.5 sm:p-2.5 hover:bg-white dark:hover:bg-gray-700 transition shadow-lg z-10"
                  >
                    <FaChevronLeft className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 rounded-full p-1.5 sm:p-2.5 hover:bg-white dark:hover:bg-gray-700 transition shadow-lg z-10"
                  >
                    <FaChevronRight className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/70 text-white text-[10px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full z-10">
                {images.indexOf(mainImage) + 1} / {images.length}
              </div>
            )}

            <div className="mt-2 sm:mt-3 md:mt-4 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-1.5 sm:gap-2 min-w-max">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMainImage(img);
                      setImageLoaded(false);
                    }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                      mainImage === img || (mainImage === '' && i === 0)
                        ? 'border-[#D4AF37] shadow-md'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
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
              <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-lg z-10">
                -{discountPercent}%
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-2 left-12 sm:top-3 sm:left-16 bg-green-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-lg z-10">
                NEW
              </span>
            )}
            {product.isBestSeller && (
              <span className="absolute top-2 left-24 sm:top-3 sm:left-28 bg-[#D4AF37] text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-lg z-10">
                ★ BEST
              </span>
            )}
            {product.isFeatured && (
              <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-purple-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-lg z-10">
                ★ Featured
              </span>
            )}
          </div>

          {/* ============================================================
          ✅ PRODUCT INFO - CARD STYLE DESCRIPTION
          ============================================================ */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
            
            {/* Category & Gender Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium capitalize">
                {categoryIcons[product.productType || ''] || '👗'} {product.productType?.replace(/-/g, ' ') || product.subCategory || 'Fashion'}
              </span>
              {product.gender && (
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium capitalize">
                  {genderIcons[product.gender] || '👤'} {product.gender}
                </span>
              )}
              {product.subCategory && (
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium capitalize">
                  {product.subCategory.replace(/-/g, ' ')}
                </span>
              )}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                ))}
                <span className="text-gray-400 dark:text-gray-500 text-[10px] ml-0.5">({product.rating})</span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#111827] dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Product ID */}
            {product.productId && (
              <p className="text-xs text-gray-400 font-mono">ID: {product.productId}</p>
            )}

            {/* Price */}
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

            {/* ✅ STOCK INDICATOR - Blinking Green Dot */}
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isInStock() ? 'bg-green-500 animate-blink' : 'bg-red-500'}`}></span>
              <span className={`text-[10px] sm:text-xs md:text-sm font-medium ${isInStock() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isInStock() ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* ✅ CARD STYLE DESCRIPTION */}
            <div className="bg-[#F8FAFC] dark:bg-[#1F2937] rounded-xl border border-[#E5E7EB] dark:border-gray-700 p-3 sm:p-4">
              <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed space-y-1">
                {descriptionLines.length > 0 ? (
                  descriptionLines.map((line, idx) => {
                    // ✅ Title/Heading lines
                    if (line.includes('👑') || line.includes('💎') || line.includes('👗') || 
                        line.includes('✨') || line.includes('⭐') || line.includes('🌟') ||
                        (line.length < 40 && line === line.toUpperCase() && line.trim().length > 0)) {
                      return (
                        <div key={idx} className="font-semibold text-[#111827] dark:text-white text-xs sm:text-sm mt-2 first:mt-0">
                          {line}
                        </div>
                      );
                    }
                    // ✅ Bullet points
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
                    // ✅ Regular lines
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

            {/* ✅ Material & Care - Highlighted */}
            <div className="grid grid-cols-2 gap-2">
              {product.material && (
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-[#0F766E]/5 to-[#0F766E]/10 rounded-xl border border-[#0F766E]/20">
                  <p className="text-[8px] sm:text-[10px] text-[#0F766E] font-semibold uppercase tracking-wider">Material</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium">{product.material}</p>
                </div>
              )}
              {product.careInstructions && (
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-[#D4AF37]/5 to-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
                  <p className="text-[8px] sm:text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">Care</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium">{product.careInstructions}</p>
                </div>
              )}
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'One Size' && (
              <div>
                <label className="block text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                  Select Size <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-2.5 py-1 sm:px-3.5 sm:py-1.5 md:px-4 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition ${
                        selectedSize === size
                          ? 'bg-[#D4AF37] text-white shadow-md'
                          : 'bg-[#F8FAFC] dark:bg-[#1F2937] text-gray-600 dark:text-gray-300 hover:bg-[#E5E7EB] dark:hover:bg-gray-700 border border-[#E5E7EB] dark:border-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                  Select Color <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.colors.map(color => {
                    const bgColor = colorMap[color] || 'bg-gray-200';
                    return (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColor(color);
                          if (product.colorImages && product.colorImages[color]) {
                            setMainImage(product.colorImages[color][0]);
                            setImageLoaded(false);
                          }
                        }}
                        className={`flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition ${
                          selectedColor === color
                            ? 'bg-[#D4AF37] text-white shadow-md'
                            : 'bg-[#F8FAFC] dark:bg-[#1F2937] text-gray-600 dark:text-gray-300 hover:bg-[#E5E7EB] dark:hover:bg-gray-700 border border-[#E5E7EB] dark:border-gray-700'
                        }`}
                      >
                        <span className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${bgColor} ${color === 'White' ? 'border border-gray-300' : ''}`}></span>
                        <span className="text-[10px] sm:text-xs">{color}</span>
                        {selectedColor === color && (
                          <span className="text-white text-[8px] sm:text-[10px]">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
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

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-2.5 md:gap-3 mt-1">
              <button
                onClick={() => {
                  if (!selectedColor) {
                    alert('Please select a color');
                    return;
                  }
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
                className={`flex-1 px-3 py-2 sm:px-5 sm:py-2.5 md:px-7 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 ${(
                  isInStock()
                    ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                )}`}
              >
                <FaShoppingCart className="text-xs sm:text-sm" />
                <span>{isInStock() ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
              <button
                onClick={() => {
                  if (!selectedColor) {
                    alert('Please select a color');
                    return;
                  }
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
                className={`px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 ${(
                  isInStock() 
                    ? 'bg-[#D4AF37] text-white hover:bg-[#b8941f] cursor-pointer' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
                )}`}
              >
                Buy Now
              </button>
            </div>

            {/* ✅ Share & WhatsApp - Clickable */}
            <div className="flex gap-2">
              {/* ✅ Share Button - Clickable with Fallback */}
              <button
                onClick={() => {
                  const shareData = {
                    title: product.name,
                    text: `Check out ${product.name} at Maha One Hypermart!`,
                    url: window.location.href
                  };

                  // Try native share first (mobile)
                  if (navigator.share) {
                    navigator.share(shareData).catch(() => {});
                    return;
                  }

                  // Fallback: Copy to clipboard
                  const fullText = `${shareData.text}\n${shareData.url}`;
                  navigator.clipboard.writeText(fullText).then(() => {
                    alert('✅ Link copied to clipboard! Share it anywhere.');
                  }).catch(() => {
                    // Final fallback: Open email
                    window.location.href = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(fullText)}`;
                  });
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-full text-[10px] sm:text-xs font-medium transition flex items-center justify-center gap-1"
              >
                <FaShare /> Share
              </button>

              {/* ✅ WhatsApp Button */}
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

            {/* Delivery Info */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-1">
              <div className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur p-1.5 sm:p-2 md:p-2.5 rounded-xl border border-[#E5E7EB] dark:border-gray-700 text-center">
                <FaTruck className="text-[#D4AF37] text-sm sm:text-base md:text-lg mx-auto" />
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">Delivery Across the Pakistan</p>
              </div>
              <div className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur p-1.5 sm:p-2 md:p-2.5 rounded-xl border border-[#E5E7EB] dark:border-gray-700 text-center">
                <FaShieldAlt className="text-[#D4AF37] text-sm sm:text-base md:text-lg mx-auto" />
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">Premium Quality</p>
              </div>
              <div className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur p-1.5 sm:p-2 md:p-2.5 rounded-xl border border-[#E5E7EB] dark:border-gray-700 text-center">
                <FaLeaf className="text-[#D4AF37] text-sm sm:text-base md:text-lg mx-auto" />
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">100% Authentic</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
        ✅ 1. SUGGESTED PRODUCTS SLIDER
        ============================================================ */}
        {suggestedProducts.length > 0 && (
          <div className="mt-8 sm:mt-10 md:mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827] dark:text-white flex items-center gap-2">
                <span className="text-[#D4AF37]">✨</span> You May Also Like
              </h2>
              <Link to="/fashion" className="text-[#D4AF37] hover:text-[#b8941f] transition text-xs sm:text-sm font-medium flex items-center gap-1">
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
        ✅ 2. SUBCATEGORY PRODUCTS SLIDER
        ============================================================ */}
        {subCategoryProducts.length > 0 && (
          <div className="mt-8 sm:mt-10 md:mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827] dark:text-white flex items-center gap-2">
                <span className="text-[#D4AF37]">📂</span> More in {product.subCategory?.replace(/-/g, ' ') || 'This Category'}
              </h2>
              <Link to={`/fashion?category=${product.subCategory}`} className="text-[#D4AF37] hover:text-[#b8941f] transition text-xs sm:text-sm font-medium flex items-center gap-1">
                View All <span className="text-xs">→</span>
              </Link>
            </div>
            <ProductSlider 
              products={subCategoryProducts} 
              sliderRef={subSliderRef}
              scrollLeft={() => scrollLeft(subSliderRef)}
              scrollRight={() => scrollRight(subSliderRef)}
              addToCart={addToCart}
            />
          </div>
        )}

        {/* ============================================================
        ✅ 3. OTHER CATEGORIES SLIDER
        ============================================================ */}
        {otherProducts.length > 0 && (
          <div className="mt-8 sm:mt-10 md:mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827] dark:text-white flex items-center gap-2">
                <span className="text-[#D4AF37]">🛍️</span> Other Categories
              </h2>
              <Link to="/fashion" className="text-[#D4AF37] hover:text-[#b8941f] transition text-xs sm:text-sm font-medium flex items-center gap-1">
                Explore All <span className="text-xs">→</span>
              </Link>
            </div>
            <ProductSlider 
              products={otherProducts} 
              sliderRef={otherSliderRef}
              scrollLeft={() => scrollLeft(otherSliderRef)}
              scrollRight={() => scrollRight(otherSliderRef)}
              addToCart={addToCart}
            />
          </div>
        )}
      </div>
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
            to={`/fashion/${product.id}`}
            className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] bg-white dark:bg-[#1F2937] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[#E5E7EB] dark:border-gray-700 hover:-translate-y-1 group"
          >
            <div className="relative aspect-square bg-[#F5F3FF] dark:bg-[#1F2937]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=${product.name}`;
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
              {/* Stock Dot on product image */}
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
                className={`w-full mt-1 px-2 py-1 rounded-full text-[8px] sm:text-[10px] font-medium transition flex items-center justify-center gap-1 ${(
                  product.stock > 0
                    ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                )}`}
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

export default FashionDetailPage;
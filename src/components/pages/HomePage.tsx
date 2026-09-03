// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStar, FaHeart, FaShoppingCart, FaArrowRight, FaSpinner,
  FaAppleAlt, FaMale, FaFemale, FaChild, FaCookie, 
  FaShoePrints, FaShoppingBag, FaGem
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { db, collection, getDocs, query, where, limit } from '../../config/firebase';

// ✅ Category Banner Component - Clean Image Only (No Text Overlay)
interface CategoryHeroBannerProps {
  image: string;
  alt: string;
  link: string;
}

const CategoryHeroBanner: React.FC<CategoryHeroBannerProps> = ({
  image,
  alt,
  link
}) => {
  return (
    <Link to={link} className="block w-full">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl group">
        <div className="w-full aspect-[16/6] sm:aspect-[16/5] md:aspect-[16/4] lg:aspect-[16/3.5]">
          <img
            src={image}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/1200x300/D4AF37/FFFFFF?text=${alt}`;
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
      </div>
    </Link>
  );
};

// ✅ Product Card Component - Like Fashion Page
const ProductCard = ({ product, addToCart }: { product: any; addToCart: (product: any) => void }) => {
  const isInStock = product.stock > 0;
  const [imageError, setImageError] = useState(false);
  
  const getDetailLink = () => {
    if (product.category === 'sweets') return `/sweet-product/${product.id}`;
    if (product.category === 'fashion') {
      if (product.gender === 'men') return `/fashion/${product.id}`;
      if (product.gender === 'women') return `/fashion/${product.id}`;
      if (product.gender === 'kids') return `/fashion/${product.id}`;
      return `/fashion/${product.id}`;
    }
    if (product.category === 'dryfruits' || product.category === 'dry-fruits') {
      return `/dry-product/${product.id}`;
    }
    return `/product/${product.id}`;
  };

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:-translate-y-1 h-full flex flex-col group">
      <Link to={getDetailLink()}>
        <div className="relative overflow-hidden bg-[#F8FAFC] dark:bg-[#1F2937] aspect-square rounded-2xl m-2 sm:m-3 border-4 border-purple-500 shadow-md shadow-purple-500/20">
          <img
            src={imageError ? `https://via.placeholder.com/400x400/D4AF37/FFFFFF?text=${product.name}` : product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 rounded-xl p-2"
            loading="lazy"
            onError={() => setImageError(true)}
          />
          
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.discount && product.discount > 0 && (
              <span className="bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg border-2 border-white/50">
                -{product.discount}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-green-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg border-2 border-white/50">
                NEW
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-[#D4AF37] text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg border-2 border-white/50">
                ★ BEST
              </span>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              alert('❤️ Added to Wishlist!');
            }}
            className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full p-1.5 sm:p-2 hover:bg-[#D4AF37] transition shadow-md border-2 border-purple-300"
          >
            <FaHeart className="text-xs sm:text-sm text-gray-600 group-hover:text-white transition" />
          </button>
          
          {product.category && (
            <div className="absolute bottom-2 right-2">
              <span className="text-[8px] sm:text-[10px] bg-black/60 backdrop-blur text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full capitalize border border-purple-300/30">
                {product.category === 'dryfruits' ? '🥜' : 
                 product.category === 'sweets' ? '🍬' : 
                 product.category === 'fashion' ? '👗' : '📦'} {product.category}
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-2.5 sm:p-3 md:p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-0.5 text-[#D4AF37] text-[8px] sm:text-[10px]">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < Math.floor(product.rating || 0) ? 'text-[#D4AF37]' : 'text-gray-300 dark:text-gray-600'} />
          ))}
          <span className="text-gray-400 dark:text-gray-500 ml-0.5 text-[8px] sm:text-[10px]">({product.rating || 0})</span>
        </div>

        <Link to={getDetailLink()}>
          <h3 className="font-semibold text-[#111827] dark:text-white text-xs sm:text-sm md:text-base mt-0.5 line-clamp-2 group-hover:text-[#D4AF37] transition">
            {product.name}
          </h3>
        </Link>

        {product.subCategory && (
          <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {product.subCategory}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-1">
          <span className={`w-2 h-2 rounded-full ${isInStock ? 'bg-green-500 animate-blink' : 'bg-red-500'}`}></span>
          <span className={`text-[10px] sm:text-xs font-medium ${isInStock ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
            {isInStock ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
          <span className="text-[#D4AF37] font-bold text-sm sm:text-base md:text-lg">
            Rs. {product.price?.toLocaleString() || 0}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-gray-400 dark:text-gray-500 line-through text-[10px] sm:text-xs">
              Rs. {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isInStock) {
              addToCart(product);
            } else {
              alert('❌ This product is out of stock!');
            }
          }}
          disabled={!isInStock}
          className={`w-full mt-2 sm:mt-3 px-2 py-1.5 sm:py-2 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium transition flex items-center justify-center gap-1 sm:gap-2 ${
            isInStock
              ? 'bg-[#0F766E] text-white hover:bg-[#065F46] active:scale-95'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          <FaShoppingCart className="text-[8px] sm:text-[10px] md:text-xs" />
          <span>{isInStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>

        {product.isOnSale && (
          <div className="mt-1 text-[8px] sm:text-[10px] text-red-500 font-medium text-center animate-pulse">
            🔥 On Sale!
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ Category Product Section Component
interface CategoryProductSectionProps {
  title: string;
  emoji: string;
  products: any[];
  viewAllLink: string;
  addToCart: (product: any) => void;
  loading?: boolean;
}

const CategoryProductSection: React.FC<CategoryProductSectionProps> = ({
  title,
  emoji,
  products,
  viewAllLink,
  addToCart,
  loading = false
}) => {
  return (
    <section className="py-4 sm:py-5 md:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl md:text-2xl">{emoji}</span>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#111827] dark:text-white">
              {title}
            </h2>
          </div>
          <Link 
            to={viewAllLink} 
            className="text-[#D4AF37] hover:text-[#b8941f] transition flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-medium group"
          >
            View All <FaArrowRight className="text-[8px] sm:text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <FaSpinner className="animate-spin text-2xl text-[#D4AF37]" />
            <span className="ml-3 text-gray-500 dark:text-gray-400">Loading products...</span>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            No products available in this category
          </div>
        )}
      </div>
    </section>
  );
};

// ✅ Shop by Category Component - Premium Design with Vector Icons (White Fill + Green Border)
const ShopByCategory = () => {
  // ✅ Categories with Vector Icons (White Fill + Green Border Style)
  const categories = [
    { 
      id: 'dryfruits', 
      name: 'Dry Fruits', 
      icon: <FaAppleAlt className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#0F766E] group-hover:text-white transition-colors" />,
      link: '/shop', 
      color: 'from-amber-600 to-amber-800', 
      bg: 'bg-amber-50 dark:bg-amber-900/20' 
    },
    { 
      id: 'mens-fashion', 
      name: "Men's Fashion", 
      icon: <FaMale className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#0F766E] group-hover:text-white transition-colors" />,
      link: '/fashion?gender=men', 
      color: 'from-blue-600 to-blue-800', 
      bg: 'bg-blue-50 dark:bg-blue-900/20' 
    },
    { 
      id: 'womens-fashion', 
      name: "Women's Fashion", 
      icon: <FaFemale className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#0F766E] group-hover:text-white transition-colors" />,
      link: '/fashion?gender=women', 
      color: 'from-purple-600 to-purple-800', 
      bg: 'bg-purple-50 dark:bg-purple-900/20' 
    },
    { 
      id: 'kids-fashion', 
      name: "Kids Fashion", 
      icon: <FaChild className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#0F766E] group-hover:text-white transition-colors" />,
      link: '/fashion?gender=kids', 
      color: 'from-pink-500 to-pink-700', 
      bg: 'bg-pink-50 dark:bg-pink-900/20' 
    },
    { 
      id: 'sweets', 
      name: 'Sweets', 
      icon: <FaCookie className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#0F766E] group-hover:text-white transition-colors" />,
      link: '/sweets', 
      color: 'from-rose-500 to-rose-700', 
      bg: 'bg-rose-50 dark:bg-rose-900/20' 
    },
    { 
      id: 'footwear', 
      name: 'Footwear', 
      icon: <FaShoePrints className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#0F766E] group-hover:text-white transition-colors" />,
      link: '/fashion?category=footwear', 
      color: 'from-emerald-600 to-emerald-800', 
      bg: 'bg-emerald-50 dark:bg-emerald-900/20' 
    },
    { 
      id: 'bags', 
      name: 'Bags', 
      icon: <FaShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#0F766E] group-hover:text-white transition-colors" />,
      link: '/fashion?category=bags', 
      color: 'from-indigo-600 to-indigo-800', 
      bg: 'bg-indigo-50 dark:bg-indigo-900/20' 
    },
    { 
      id: 'accessories', 
      name: 'Accessories', 
      icon: <FaGem className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#0F766E] group-hover:text-white transition-colors" />,
      link: '/fashion?category=accessories', 
      color: 'from-amber-500 to-amber-700', 
      bg: 'bg-amber-50 dark:bg-amber-900/20' 
    },
  ];

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-b from-[#FFFDF7] to-[#F8FAFC] dark:from-[#111827] dark:to-[#1F2937]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-[#D4AF37] font-medium text-[10px] sm:text-xs tracking-wider uppercase">Categories</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] dark:text-white mt-2">
            Shop by <span className="text-[#D4AF37]">Category</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Explore our premium collection across all categories
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className={`group relative overflow-hidden rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 text-center ${category.bg} hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border-2 border-transparent hover:border-[#D4AF37]/30`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-90 transition-all duration-500`}></div>
              
              <div className="relative z-10">
                {/* ✅ Vector Icon with White Fill + Green Border Circle */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white border-2 border-[#0F766E] flex items-center justify-center mx-auto mb-1 sm:mb-2 shadow-sm transition-all duration-300 group-hover:border-[#D4AF37] group-hover:shadow-md">
                  {category.icon}
                </div>
                
                <h3 className="text-gray-700 dark:text-gray-300 group-hover:text-white font-semibold text-[8px] sm:text-xs md:text-sm lg:text-base transition-colors duration-300 leading-tight">
                  {category.name}
                </h3>
                <span className="inline-block mt-0.5 sm:mt-1 text-[#D4AF37] group-hover:text-white text-[6px] sm:text-[8px] md:text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-0.5 group-hover:translate-y-0">
                  Shop →
                </span>
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#D4AF37] rounded-full mx-auto mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const { addToCart } = useCart();

  // ✅ State for Firebase Products
  const [dryFruitsProducts, setDryFruitsProducts] = useState<any[]>([]);
  const [mensFashionProducts, setMensFashionProducts] = useState<any[]>([]);
  const [womensFashionProducts, setWomensFashionProducts] = useState<any[]>([]);
  const [kidsFashionProducts, setKidsFashionProducts] = useState<any[]>([]);
  const [sweetsProducts, setSweetsProducts] = useState<any[]>([]);

  // ✅ Loading states
  const [loadingDryFruits, setLoadingDryFruits] = useState(true);
  const [loadingMens, setLoadingMens] = useState(true);
  const [loadingWomens, setLoadingWomens] = useState(true);
  const [loadingKids, setLoadingKids] = useState(true);
  const [loadingSweets, setLoadingSweets] = useState(true);

  // ============================================================
  // ✅ HERO SLIDES - MOBILE RESPONSIVE WITH BORDER
  // ============================================================
  const slides = [
    {
      id: 0,
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1788241099/1788240235024_uw5fhn.jpg',
      link: '/shop',
      alt: 'Premium Dry Fruits Collection'
    },
    {
      id: 1,
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1788241098/1788240235094_w5m6ak.jpg',
      link: '/sweets',
      alt: 'Sweet Collection'
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1788240934/1788240234961_tqja27.jpg',
      link: '/fashion',
      alt: 'Fashion Collection'
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // ✅ FETCH PRODUCTS FROM FIREBASE
  // ============================================================

  // Fetch Dry Fruits
  useEffect(() => {
    const fetchDryFruits = async () => {
      try {
        setLoadingDryFruits(true);
        const q = query(
          collection(db, 'products'),
          where('category', 'in', ['dryfruits', 'dry-fruits']),
          where('status', '==', 'active'),
          limit(8)
        );
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDryFruitsProducts(products);
      } catch (error) {
        console.error('Error fetching dry fruits:', error);
      } finally {
        setLoadingDryFruits(false);
      }
    };
    fetchDryFruits();
  }, []);

  // Fetch Men's Fashion
  useEffect(() => {
    const fetchMensFashion = async () => {
      try {
        setLoadingMens(true);
        const q = query(
          collection(db, 'products'),
          where('category', '==', 'fashion'),
          where('gender', '==', 'men'),
          where('status', '==', 'active'),
          limit(8)
        );
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMensFashionProducts(products);
      } catch (error) {
        console.error('Error fetching men\'s fashion:', error);
      } finally {
        setLoadingMens(false);
      }
    };
    fetchMensFashion();
  }, []);

  // Fetch Women's Fashion
  useEffect(() => {
    const fetchWomensFashion = async () => {
      try {
        setLoadingWomens(true);
        const q = query(
          collection(db, 'products'),
          where('category', '==', 'fashion'),
          where('gender', '==', 'women'),
          where('status', '==', 'active'),
          limit(8)
        );
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWomensFashionProducts(products);
      } catch (error) {
        console.error('Error fetching women\'s fashion:', error);
      } finally {
        setLoadingWomens(false);
      }
    };
    fetchWomensFashion();
  }, []);

  // Fetch Kids Fashion
  useEffect(() => {
    const fetchKidsFashion = async () => {
      try {
        setLoadingKids(true);
        const q = query(
          collection(db, 'products'),
          where('category', '==', 'fashion'),
          where('gender', '==', 'kids'),
          where('status', '==', 'active'),
          limit(8)
        );
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setKidsFashionProducts(products);
      } catch (error) {
        console.error('Error fetching kids fashion:', error);
      } finally {
        setLoadingKids(false);
      }
    };
    fetchKidsFashion();
  }, []);

  // Fetch Sweets
  useEffect(() => {
    const fetchSweets = async () => {
      try {
        setLoadingSweets(true);
        const q = query(
          collection(db, 'products'),
          where('category', '==', 'sweets'),
          where('status', '==', 'active'),
          limit(8)
        );
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSweetsProducts(products);
      } catch (error) {
        console.error('Error fetching sweets:', error);
      } finally {
        setLoadingSweets(false);
      }
    };
    fetchSweets();
  }, []);

  // ============================================================
  // ✅ BANNER IMAGES CONFIGURATION
  // ============================================================
  const bannerImages = [
    {
      id: 'dryfruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787928030/1787927127977_tfpbae.jpg',
      alt: 'Premium Dry Fruits Collection',
      link: '/shop'
    },
    {
      id: 'mens-fashion',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787928029/1787927127796_r6gpwk.jpg',
      alt: "Men's Fashion Collection",
      link: '/fashion?gender=men'
    },
    {
      id: 'womens-fashion',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787928035/1787927127894_tf8wge.jpg',
      alt: "Women's Fashion Collection",
      link: '/fashion?gender=women'
    },
    {
      id: 'kids-fashion',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787928033/1787927127833_unljm2.jpg',
      alt: "Kids Fashion Collection",
      link: '/fashion?gender=kids'
    },
    {
      id: 'sweets',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787928037/1787927127742_eifbns.jpg',
      alt: 'Sweets & Chocolates Collection',
      link: '/sweets'
    }
  ];

  // Banner + Product Section Mappings with Section IDs
  const sectionConfigs = [
    {
      id: 'dryfruits-section',
      banner: bannerImages[0],
      title: 'Premium Dry Fruits',
      emoji: '🥜',
      products: dryFruitsProducts,
      loading: loadingDryFruits,
      viewAllLink: '/shop'
    },
    {
      id: 'mens-fashion-section',
      banner: bannerImages[1],
      title: "Men's Fashion",
      emoji: '👔',
      products: mensFashionProducts,
      loading: loadingMens,
      viewAllLink: '/fashion?gender=men'
    },
    {
      id: 'womens-fashion-section',
      banner: bannerImages[2],
      title: "Women's Fashion",
      emoji: '👗',
      products: womensFashionProducts,
      loading: loadingWomens,
      viewAllLink: '/fashion?gender=women'
    },
    {
      id: 'kids-fashion-section',
      banner: bannerImages[3],
      title: "Kids Fashion",
      emoji: '👶',
      products: kidsFashionProducts,
      loading: loadingKids,
      viewAllLink: '/fashion?gender=kids'
    },
    {
      id: 'sweets-section',
      banner: bannerImages[4],
      title: 'Sweets & Chocolates',
      emoji: '🍬',
      products: sweetsProducts,
      loading: loadingSweets,
      viewAllLink: '/sweets'
    }
  ];

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] min-h-screen">
      
      {/* ============================================================
      HERO SECTION
      ============================================================ */}
      <section 
        id="hero-section"
        className="relative w-full overflow-hidden bg-[#FFFDF7] dark:bg-[#111827] pt-16 sm:pt-20 md:pt-24 lg:pt-28 scroll-mt-[120px] sm:scroll-mt-[140px] md:scroll-mt-[160px]"
      >
        
        <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-6">
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-[#F5F3FF] dark:bg-[#1F2937] border-2 sm:border-4 border-purple-500 shadow-purple-500/20">
            
            <div className="relative w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] xl:h-[500px] 2xl:h-[550px] flex items-center justify-center bg-[#F5F3FF] dark:bg-[#1F2937] overflow-hidden">
              <Link to={slides[currentSlide].link} className="block w-full h-full">
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].alt}
                  className="w-full h-full object-cover transition-all duration-700"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/1600x600/D4AF37/FFFFFF?text=Maha+One';
                  }}
                />
              </Link>
            </div>

            <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-1.5 md:gap-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 sm:h-1.5 md:h-2 rounded-full transition-all duration-500 ${
                    index === currentSlide 
                      ? 'w-4 sm:w-6 md:w-8 lg:w-10 bg-[#D4AF37]' 
                      : 'w-1 sm:w-1.5 md:w-2 bg-white/60 hover:bg-[#D4AF37]/80'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 sm:p-1.5 md:p-2.5 transition-all duration-300 backdrop-blur-sm z-10"
              aria-label="Previous slide"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 sm:p-1.5 md:p-2.5 transition-all duration-300 backdrop-blur-sm z-10"
              aria-label="Next slide"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
      SHOP BY CATEGORY SECTION — ✅ UPDATED WITH VECTOR ICONS
      ============================================================ */}
      <ShopByCategory />

      {/* ============================================================
      CATEGORY SECTIONS
      ============================================================ */}
      {sectionConfigs.map((section, index) => (
        <div 
          key={section.banner.id}
          id={section.id}
          className={`${index % 2 === 0 ? 'bg-[#F8FAFC] dark:bg-[#1F2937]' : 'bg-[#FFFDF7] dark:bg-[#111827]'} scroll-mt-[120px] sm:scroll-mt-[140px] md:scroll-mt-[160px]`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
            <CategoryHeroBanner
              image={section.banner.image}
              alt={section.banner.alt}
              link={section.banner.link}
            />
            
            <CategoryProductSection
              title={section.title}
              emoji={section.emoji}
              products={section.products}
              loading={section.loading}
              viewAllLink={section.viewAllLink}
              addToCart={addToCart}
            />
          </div>
        </div>
      ))}

      {/* ============================================================
      REVIEWS SECTION
      ============================================================ */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FFFDF7] dark:bg-[#111827]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-14">
            <span className="text-[#D4AF37] font-medium text-[10px] sm:text-xs tracking-wider uppercase">Testimonials</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827] dark:text-white mt-2">
              What Our <span className="text-[#D4AF37]">Customers Say</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
              Real reviews from real customers who trust Maha One
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Ayesha Khan', text: 'Best dry fruits I have ever tasted! Premium quality. The packaging was excellent and delivery was on time.', rating: 5, location: 'Lahore' },
              { name: 'Dr. Usman Ahmed', text: '100% natural and fresh. Highly recommended for health-conscious people. Will definitely order again.', rating: 5, location: 'Karachi' },
              { name: 'Fatima Ali', text: 'Perfect for gifting. Beautiful packaging and amazing quality. My family loved the sweets collection!', rating: 5, location: 'Islamabad' },
            ].map((review, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-[#1F2937] rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#E5E7EB] dark:border-gray-700 hover:-translate-y-1"
              >
                <div className="flex text-[#D4AF37] text-sm md:text-base mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < review.rating ? 'text-[#D4AF37]' : 'text-gray-300 dark:text-gray-600'} />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base italic leading-relaxed">
                  "{review.text}"
                </p>
                <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-gray-700">
                  <h4 className="font-semibold text-[#111827] dark:text-white text-sm md:text-base">{review.name}</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{review.location}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-[#1F2937] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-sm border border-[#E5E7EB] dark:border-gray-700">
              <span className="text-xl sm:text-2xl">⭐</span>
              <span className="font-bold text-[#111827] dark:text-white">4.9</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500 dark:text-gray-400">5.0</span>
              <span className="w-px h-5 sm:h-6 bg-[#E5E7EB] dark:bg-gray-700 mx-2"></span>
              <span className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400">Based on 10,000+ reviews</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
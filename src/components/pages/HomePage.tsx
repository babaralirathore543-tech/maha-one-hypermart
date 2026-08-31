// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

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
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
      </div>
    </Link>
  );
};

// ✅ Product Card Component - WITH PURPLE BORDER & ROUND CORNERS
const ProductCard = ({ product, addToCart }: { product: any; addToCart: (product: any) => void }) => {
  const isInStock = product.stock > 0;
  
  const getDetailLink = () => {
    if (product.type === 'sweet' || product.category === 'sweets') return `/sweet-product/${product.id}`;
    if (product.type === 'fashion' || product.category === 'fashion') {
      if (product.gender === 'men') return `/fashion/${product.id}`;
      if (product.gender === 'women') return `/fashion/${product.id}`;
      if (product.gender === 'kids') return `/fashion/${product.id}`;
      return `/fashion/${product.id}`;
    }
    return `/dry-product/${product.id}`;
  };

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-purple-500 hover:border-purple-600 group hover:-translate-y-1">
      <Link to={getDetailLink()}>
        <div className="relative overflow-hidden cursor-pointer bg-[#F5F3FF] dark:bg-[#1F2937] aspect-square">
          {/* Purple glow effect on hover */}
          <div className="absolute inset-0 border-2 border-purple-500/0 group-hover:border-purple-500/30 rounded-lg transition-all duration-300 pointer-events-none z-10"></div>
          
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/400x400/D4AF37/FFFFFF?text=${encodeURIComponent(product.name)}`;
            }}
          />
          
          {product.discount && product.discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg z-20">
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="absolute top-2 left-12 sm:left-14 bg-green-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg z-20">
              NEW
            </span>
          )}
          <button
            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 hover:bg-[#D4AF37] transition-all duration-300 shadow-md hover:scale-110 z-20"
            onClick={(e) => {
              e.preventDefault();
              alert('❤️ Added to Wishlist!');
            }}
          >
            <FaHeart className="text-xs sm:text-sm text-gray-600 hover:text-white transition-colors" />
          </button>
        </div>
      </Link>
      <div className="p-2.5 sm:p-3 md:p-4">
        <div className="flex text-[#D4AF37] text-[8px] sm:text-[10px] md:text-xs">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < (product.rating || 4.5) ? 'text-[#D4AF37]' : 'text-gray-300 dark:text-gray-600'} />
          ))}
        </div>
        <Link to={getDetailLink()}>
          <h3 className="font-semibold text-[#111827] dark:text-white text-[10px] sm:text-xs md:text-sm mt-0.5 hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 mt-0.5 flex-wrap">
          <span className="text-[#D4AF37] font-bold text-xs sm:text-sm md:text-base">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-gray-400 dark:text-gray-500 line-through text-[8px] sm:text-[10px] md:text-xs">
              Rs. {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isInStock ? 'bg-green-500 animate-blink' : 'bg-red-500'}`}></span>
          <span className={`text-[7px] sm:text-[9px] md:text-[10px] font-medium ${isInStock ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
            {isInStock ? `${product.stock} in stock` : 'Out of Stock'}
          </span>
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
          className={`w-full mt-1.5 sm:mt-2 px-2 py-1.5 sm:py-2 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium transition flex items-center justify-center gap-1 sm:gap-2 ${isInStock
              ? 'bg-[#0F766E] text-white hover:bg-[#065F46] shadow-md hover:shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          <FaShoppingCart className="text-[8px] sm:text-[10px]" />
          <span>{isInStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
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
}

const CategoryProductSection: React.FC<CategoryProductSectionProps> = ({
  title,
  emoji,
  products,
  viewAllLink,
  addToCart
}) => {
  if (!products || products.length === 0) return null;

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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ✅ Shop by Category Component
const ShopByCategory = () => {
  const categories = [
    { id: 'dryfruits', name: 'Dry Fruits', icon: '🥜', link: '/shop', color: 'from-[#0F766E] to-[#065F46]' },
    { id: 'mens-fashion', name: "Men's Fashion", icon: '👔', link: '/fashion?gender=men', color: 'from-[#1E40AF] to-[#1E3A5F]' },
    { id: 'womens-fashion', name: "Women's Fashion", icon: '👗', link: '/fashion?gender=women', color: 'from-[#8B5CF6] to-[#6D28D9]' },
    { id: 'kids-fashion', name: "Kids Fashion", icon: '👶', link: '/fashion?gender=kids', color: 'from-[#EC4899] to-[#BE185D]' },
    { id: 'sweets', name: 'Sweets & Chocolates', icon: '🍬', link: '/sweets', color: 'from-[#D4AF37] to-[#b8941f]' },
    { id: 'footwear', name: 'Footwear', icon: '👟', link: '/fashion?category=footwear', color: 'from-[#0F766E] to-[#065F46]' },
    { id: 'bags', name: 'Bags', icon: '👜', link: '/fashion?category=bags', color: 'from-[#6D28D9] to-[#4C1D95]' },
    { id: 'accessories', name: 'Accessories', icon: '💎', link: '/fashion?category=accessories', color: 'from-[#D4AF37] to-[#b8941f]' },
  ];

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-[#FFFDF7] dark:bg-[#111827]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-[#D4AF37] font-medium text-[10px] sm:text-xs tracking-wider uppercase">Categories</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] dark:text-white mt-2">
            Shop by <span className="text-[#D4AF37]">Category</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Explore our premium collection across all categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className={`group relative overflow-hidden rounded-2xl p-5 sm:p-6 md:p-8 text-center bg-gradient-to-br ${category.color} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">{category.icon}</div>
                <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base">
                  {category.name}
                </h3>
                <span className="inline-block mt-2 text-white/80 text-[8px] sm:text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Shop Now →
                </span>
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

  // ============================================================
  // ✅ HERO SLIDES - ONLY IMAGES (NO TEXT)
  // ============================================================
  const slides = [
    {
      id: 0,
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1788172177/1788130194704_mxxcmk.jpg',
      link: '/shop',
      alt: 'Premium Dry Fruits Collection'
    },
    {
      id: 1,
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1788172177/1788130194704_mxxcmk.jpg',
      link: '/sweets',
      alt: 'Sweet Collection'
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1788172177/1788130194704_mxxcmk.jpg',
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
  // ✅ PRODUCT DATA
  // ============================================================

  // Dry Fruits Products
  const dryFruitsProducts = [
    { id: 1, name: 'American Almonds Premium', price: 1950, oldPrice: 2300, discount: 13, rating: 4.8, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128223/almonds_large_oq4jyx.png', type: 'dry', stock: 50, category: 'dryfruits' },
    { id: 2, name: 'Roasted Brown Cashews', price: 2000, oldPrice: 2400, discount: 17, rating: 4.9, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128406/brown_kaju_cu5gvs.png', type: 'dry', stock: 35, category: 'dryfruits' },
    { id: 3, name: 'Soft Shell Salted Pistachios', price: 2600, oldPrice: 3100, discount: 16, rating: 4.7, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128419/pista_without_shell_ymunmc.png', type: 'dry', stock: 40, category: 'dryfruits' },
    { id: 4, name: 'Soft Shell Walnuts', price: 1250, oldPrice: 1500, discount: 17, rating: 4.8, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128454/soft_shell_almonds_wfd5pr.png', type: 'dry', stock: 60, category: 'dryfruits' },
  ];

  // Men's Fashion Products
  const mensFashionProducts = [
    { 
      id: 301, 
      name: 'Premium Men\'s Kurta - Embroidered', 
      price: 3499, 
      oldPrice: 4200, 
      discount: 17, 
      rating: 4.9, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787461517/Gemini_Generated_Image_lneqw1lneqw1lneq_bkwrs8.jpg',
      type: 'fashion',
      gender: 'men',
      stock: 15,
      category: 'fashion'
    },
    { 
      id: 302, 
      name: 'Men\'s Formal Shalwar Kameez', 
      price: 2899, 
      oldPrice: 3500, 
      discount: 17, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583325/1787569011956_iltiu9.jpg',
      type: 'fashion',
      gender: 'men',
      stock: 20,
      category: 'fashion'
    },
    { 
      id: 303, 
      name: 'Men\'s Casual Wear - Premium Fabric', 
      price: 2599, 
      oldPrice: 3100, 
      discount: 16, 
      rating: 4.7, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583885/1787583699344_ki0lze.jpg',
      type: 'fashion',
      gender: 'men',
      stock: 25,
      category: 'fashion'
    },
    { 
      id: 304, 
      name: 'Men\'s Accessories - Premium Collection', 
      price: 1650, 
      oldPrice: 1900, 
      discount: 13, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_black_hfodez.jpg',
      type: 'fashion',
      gender: 'men',
      stock: 30,
      category: 'fashion'
    },
  ];

  // Women's Fashion Products
  const womensFashionProducts = [
    { 
      id: 201, 
      name: 'Black Queen - Embroidered Shamoz Silk Suit', 
      price: 4450, 
      oldPrice: 4950, 
      discount: 10, 
      rating: 4.9, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787461517/Gemini_Generated_Image_lneqw1lneqw1lneq_bkwrs8.jpg',
      type: 'fashion',
      gender: 'women',
      stock: 10,
      category: 'fashion'
    },
    { 
      id: 202, 
      name: 'TYE & DYE Suit - 3-Piece Embroidered', 
      price: 4190, 
      oldPrice: 5100, 
      discount: 18, 
      rating: 4.9, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583325/1787569011956_iltiu9.jpg',
      type: 'fashion',
      gender: 'women',
      stock: 10,
      category: 'fashion'
    },
    { 
      id: 203, 
      name: 'AGHA NOOR Replica - Embroidered Suit', 
      price: 3299, 
      oldPrice: 4150, 
      discount: 21, 
      rating: 4.9, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583885/1787583699344_ki0lze.jpg',
      type: 'fashion',
      gender: 'women',
      stock: 10,
      category: 'fashion'
    },
    { 
      id: 204, 
      name: 'Women\'s Jewelry - Zircon Locket Set', 
      price: 1650, 
      oldPrice: 1900, 
      discount: 13, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_black_hfodez.jpg',
      type: 'fashion',
      gender: 'women',
      stock: 15,
      category: 'fashion'
    },
  ];

  // Kids Fashion Products
  const kidsFashionProducts = [
    { 
      id: 401, 
      name: 'Kids Formal Suit - Premium Quality', 
      price: 2499, 
      oldPrice: 3000, 
      discount: 17, 
      rating: 4.9, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787461517/Gemini_Generated_Image_lneqw1lneqw1lneq_bkwrs8.jpg',
      type: 'fashion',
      gender: 'kids',
      stock: 20,
      category: 'fashion'
    },
    { 
      id: 402, 
      name: 'Kids Casual Wear - Comfortable Style', 
      price: 1899, 
      oldPrice: 2300, 
      discount: 17, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583325/1787569011956_iltiu9.jpg',
      type: 'fashion',
      gender: 'kids',
      stock: 25,
      category: 'fashion'
    },
    { 
      id: 403, 
      name: 'Kids Party Wear - Premium Fabric', 
      price: 2799, 
      oldPrice: 3400, 
      discount: 18, 
      rating: 4.7, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583885/1787583699344_ki0lze.jpg',
      type: 'fashion',
      gender: 'kids',
      stock: 15,
      category: 'fashion'
    },
    { 
      id: 404, 
      name: 'Kids Accessories - Fun Collection', 
      price: 999, 
      oldPrice: 1200, 
      discount: 17, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_black_hfodez.jpg',
      type: 'fashion',
      gender: 'kids',
      stock: 30,
      category: 'fashion'
    },
  ];

  // Sweets Products
  const sweetsProducts = [
    { id: 101, name: 'Caramel Dream Choco Bar', price: 1290, oldPrice: 1500, discount: 14, rating: 4.9, image: '/images/sweets/caramel dream choco bar.jpg', type: 'sweet', stock: 50, category: 'sweets' },
    { id: 102, name: 'HISS Crispy Wafer', price: 1280, oldPrice: 1550, discount: 20, rating: 4.8, image: '/images/sweets/hiss crispy wafer.jpg', type: 'sweet', stock: 40, category: 'sweets' },
    { id: 103, name: 'Nani Coconut Bar', price: 1290, oldPrice: 1500, discount: 14, rating: 4.9, image: '/images/sweets/nani coconut bar.jpg', type: 'sweet', stock: 30, category: 'sweets' },
    { id: 104, name: 'Roro Caramel Eclair', price: 650, oldPrice: 700, discount: 7, rating: 4.8, image: '/images/sweets/roro caramel eclair.jpg', type: 'sweet', stock: 60, category: 'sweets' },
  ];

  // ============================================================
  // ✅ BANNER IMAGES CONFIGURATION (ONLY IMAGES - NO TEXT)
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

  // Banner + Product Section Mappings
  const sectionConfigs = [
    {
      banner: bannerImages[0],
      title: 'Premium Dry Fruits',
      emoji: '🥜',
      products: dryFruitsProducts,
      viewAllLink: '/shop'
    },
    {
      banner: bannerImages[1],
      title: "Men's Fashion",
      emoji: '👔',
      products: mensFashionProducts,
      viewAllLink: '/fashion?gender=men'
    },
    {
      banner: bannerImages[2],
      title: "Women's Fashion",
      emoji: '👗',
      products: womensFashionProducts,
      viewAllLink: '/fashion?gender=women'
    },
    {
      banner: bannerImages[3],
      title: "Kids Fashion",
      emoji: '👶',
      products: kidsFashionProducts,
      viewAllLink: '/fashion?gender=kids'
    },
    {
      banner: bannerImages[4],
      title: 'Sweets & Chocolates',
      emoji: '🍬',
      products: sweetsProducts,
      viewAllLink: '/sweets'
    }
  ];

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] min-h-screen">
      
      {/* ============================================================
      HERO SECTION - IMAGES FIT FRAME PROPERLY
      ============================================================ */}
      <section className="relative w-full overflow-hidden bg-[#FFFDF7] dark:bg-[#111827]">
        
        <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
          {/* Hero Image Slider - Fixed Frame */}
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-[#F5F3FF] dark:bg-[#1F2937] border-2 border-purple-500/20">
            
            {/* ✅ FIXED: object-contain with flex centering */}
            <div className="relative w-full h-[200px] sm:h-[280px] md:h-[350px] lg:h-[420px] xl:h-[480px] flex items-center justify-center bg-[#F5F3FF] dark:bg-[#1F2937]">
              <Link to={slides[currentSlide].link} className="block w-full h-full">
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].alt}
                  className="w-full h-full object-cover transition-all duration-700"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/1600x500/D4AF37/FFFFFF?text=Hero+Image';
                  }}
                />
              </Link>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                    index === currentSlide 
                      ? 'w-6 sm:w-8 md:w-10 bg-[#D4AF37]' 
                      : 'w-1.5 sm:w-2 bg-white/60 hover:bg-[#D4AF37]/80'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 sm:p-2.5 transition-all duration-300 backdrop-blur-sm z-10"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 sm:p-2.5 transition-all duration-300 backdrop-blur-sm z-10"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
      SHOP BY CATEGORY SECTION
      ============================================================ */}
      <ShopByCategory />

      {/* ============================================================
      CATEGORY SECTIONS - Banner Image + Products
      ============================================================ */}
      {sectionConfigs.map((section, index) => (
        <div 
          key={section.banner.id}
          className={index % 2 === 0 ? 'bg-[#F8FAFC] dark:bg-[#1F2937]' : 'bg-[#FFFDF7] dark:bg-[#111827]'}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
            {/* Banner Image - Clean, No Text Overlay */}
            <CategoryHeroBanner
              image={section.banner.image}
              alt={section.banner.alt}
              link={section.banner.link}
            />
            
            {/* Products Section */}
            <CategoryProductSection
              title={section.title}
              emoji={section.emoji}
              products={section.products}
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

          {/* Trust Badge */}
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
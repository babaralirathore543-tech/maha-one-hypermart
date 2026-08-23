import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const HomePage = () => {
  const { addToCart } = useCart();

  // ============================================================
  // ✅ HERO SLIDES
  // ============================================================
  const slides = [
    {
      id: 0,
      title: 'Premium Dry Fruits',
      subtitle: 'Handpicked from the finest farms, delivered fresh across Pakistan.',
      emoji: '🥜',
      bg: 'from-[#0F766E] to-[#065F46]',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787299384/hero-image_gqluny.jpg',
      link: '/shop',
      btnText: 'Shop Now',
      isComingSoon: false,
      badge: '🌟 Premium Quality Since 2024'
    },
    {
      id: 1,
      title: 'Sweet Collection',
      subtitle: 'Delicious treats made with love, perfect for every occasion.',
      emoji: '🍬',
      bg: 'from-[#D4AF37] to-[#b8941f]',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787299385/hero-sweets_lbplgs.jpg',
      link: '/sweets',
      btnText: 'Explore Sweets',
      isComingSoon: false,
      badge: '🍬 Sweet Treats Since 2024'
    },
    {
      id: 2,
      title: 'Fashion Collection',
      subtitle: 'Premium fashion collection for men, women, and kids. Explore the latest trends.',
      emoji: '👗',
      bg: 'from-[#8B5CF6] to-[#6D28D9]',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787299388/hero-fashion_miqdis.jpg',
      link: '/fashion',
      btnText: 'Shop Now',
      isComingSoon: false,
      badge: '👗 New Collection 2026'
    },
  ];

  // ✅ Slider
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = prev + 1;
        if (next >= slides.length) return 0;
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Dry Fruits Products (4)
  const dryFruitsProducts = [
    { id: 1, name: 'American Almonds Premium', price: 1950, oldPrice: 2300, discount: 13, rating: 4.8, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128223/almonds_large_oq4jyx.png', type: 'dry', stock: 50 },
    { id: 2, name: 'Roasted Brown Cashews', price: 2000, oldPrice: 2400, discount: 17, rating: 4.9, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128406/brown_kaju_cu5gvs.png', type: 'dry', stock: 35 },
    { id: 3, name: 'Soft Shell Salted Pistachios', price: 2600, oldPrice: 3100, discount: 16, rating: 4.7, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128419/pista_without_shell_ymunmc.png', type: 'dry', stock: 40 },
    { id: 4, name: 'Soft Shell Walnuts', price: 1250, oldPrice: 1500, discount: 17, rating: 4.8, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128454/soft_shell_almonds_wfd5pr.png', type: 'dry', stock: 60 },
  ];

  // ✅ Fashion Products (4)
  const fashionProducts = [
    { 
      id: 101, 
      name: 'Black Queen - Embroidered Shamoz Silk Suit', 
      price: 4450, 
      oldPrice: 4950, 
      discount: 10, 
      rating: 4.9, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787461517/Gemini_Generated_Image_lneqw1lneqw1lneq_bkwrs8.jpg', 
      type: 'fashion', 
      stock: 10 
    },
    { 
      id: 209, 
      name: '1 Carat Zircon Locket Set', 
      price: 1650, 
      oldPrice: 1900, 
      discount: 19, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_black_hfodez.jpg', 
      type: 'fashion', 
      stock: 15 
    },
  ];

  // ✅ Sweets Products (4)
  const sweetsProducts = [
    { id: 101, name: 'Caramel Dream Choco Bar', price: 1290, oldPrice: 1500, discount: 14, rating: 4.9, image: '/images/sweets/caramel dream choco bar.jpg', type: 'sweet', stock: 50 },
    { id: 102, name: 'HISS Crispy Wafer', price: 1280, oldPrice: 1550, discount: 20, rating: 4.8, image: '/images/sweets/hiss crispy wafer.jpg', type: 'sweet', stock: 40 },
    { id: 104, name: 'Nani Coconut Bar', price: 1290, oldPrice: 1500, discount: 20, rating: 4.9, image: '/images/sweets/nani coconut bar.jpg', type: 'sweet', stock: 30 },
    { id: 106, name: 'Roro Caramel Eclair', price: 650, oldPrice: 700, discount: 22, rating: 4.8, image: '/images/sweets/roro caramel eclair.jpg', type: 'sweet', stock: 60 },
  ];

  // ✅ Customer Favorites (4)
  const favoritesProducts = [
    { id: 1, name: 'American Almonds Premium', price: 1950, oldPrice: 2300, discount: 13, rating: 4.8, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128223/almonds_large_oq4jyx.png', type: 'dry', stock: 50 },
    { id: 2, name: 'Roasted Brown Cashews', price: 2000, oldPrice: 2400, discount: 17, rating: 4.9, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128406/brown_kaju_cu5gvs.png', type: 'dry', stock: 35 },
    { id: 101, name: 'Caramel Dream Choco Bar', price: 1290, oldPrice: 1500, discount: 14, rating: 4.9, image: '/images/sweets/caramel dream choco bar.jpg', type: 'sweet', stock: 50 },
    { id: 209, name: '1 Carat Zircon Locket Set', price: 1650, oldPrice: 1900, discount: 19, rating: 4.8, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_black_hfodez.jpg', type: 'fashion', stock: 15 },
  ];

  // ✅ Reviews
  const reviews = [
    { 
      name: 'Ayesha Khan', 
      text: 'Best dry fruits I have ever tasted! Premium quality. The packaging was excellent and delivery was on time.', 
      rating: 5,
      location: 'Lahore'
    },
    { 
      name: 'Dr. Usman Ahmed', 
      text: '100% natural and fresh. Highly recommended for health-conscious people. Will definitely order again.', 
      rating: 5,
      location: 'Karachi'
    },
    { 
      name: 'Fatima Ali', 
      text: 'Perfect for gifting. Beautiful packaging and amazing quality. My family loved the sweets collection!', 
      rating: 5,
      location: 'Islamabad'
    },
  ];

  const handleAddToCart = (product: any) => {
    addToCart(product);
    alert(`✅ ${product.name} added to cart!`);
  };

  const getDetailLink = (product: any) => {
    if (product.type === 'sweet') return `/sweet-product/${product.id}`;
    if (product.type === 'fashion') return `/fashion/${product.id}`;
    return `/dry-product/${product.id}`;
  };

  // ✅ Product Card Component
  const ProductCard = ({ product }: { product: any }) => {
    const isInStock = product.stock > 0;
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#E5E7EB] group">
        <Link to={getDetailLink(product)}>
          <div className="relative overflow-hidden cursor-pointer">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-40 sm:h-48 md:h-56 object-cover bg-[#F5F3FF] group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x400/D4AF37/FFFFFF?text=' + product.name;
              }}
            />
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">-{product.discount}%</span>
            <button 
              className="absolute top-2 right-2 bg-white/90 rounded-full p-1 sm:p-1.5 hover:bg-[#D4AF37] transition-all"
              onClick={(e) => {
                e.preventDefault();
                alert('❤️ Added to Wishlist!');
              }}
            >
              <FaHeart className="text-xs sm:text-sm text-gray-600 hover:text-white" />
            </button>
          </div>
        </Link>
        <div className="p-3 sm:p-4">
          <div className="flex text-[#D4AF37] text-[10px] sm:text-sm">
            {[...Array(5)].map((_, i) => (<FaStar key={i} />))}
          </div>
          <Link to={getDetailLink(product)}>
            <h3 className="font-semibold text-[#111827] text-xs sm:text-sm md:text-base mt-0.5 hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2 mt-1">
            <span className="text-[#D4AF37] font-bold text-sm sm:text-base">PKR {product.price}</span>
            <span className="text-gray-400 line-through text-[10px] sm:text-sm">PKR {product.oldPrice}</span>
          </div>
          
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isInStock ? 'bg-green-500 animate-blink' : 'bg-red-500'}`}></span>
            <span className={`text-[8px] sm:text-xs font-medium ${isInStock ? 'text-green-600' : 'text-red-500'}`}>
              {isInStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (isInStock) {
                handleAddToCart(product);
              } else {
                alert('❌ This product is out of stock!');
              }
            }}
            disabled={!isInStock}
            className={`w-full mt-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-medium transition flex items-center justify-center gap-1 sm:gap-2 ${
              isInStock
                ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FaShoppingCart className="text-[10px] sm:text-xs" />
            <span>{isInStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#FFFDF7]">
      
      {/* ============================================================
      HERO SECTION
      ============================================================ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-[#FFFDF7] via-[#F8FAFC] to-[#FFFDF7]">
        
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#0F766E]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* LEFT */}
            <div>
              <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-[#D4AF37]/10 rounded-full text-[#D4AF37] text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-[#D4AF37]/20">
                {slides[currentSlide].badge}
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold leading-[1.05]">
                {currentSlide === 0 ? (
                  <><span className="text-[#111827]">Premium</span> <span className="text-[#D4AF37]">Dry Fruits</span></>
                ) : currentSlide === 1 ? (
                  <><span className="text-[#111827]">Sweet</span> <span className="text-[#D4AF37]">Collection</span></>
                ) : (
                  <><span className="text-[#111827]">Fashion</span> <span className="text-[#D4AF37]">Collection</span></>
                )}
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-4 sm:mt-6 max-w-lg leading-relaxed">
                {slides[currentSlide].subtitle}
              </p>
              
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
                {slides[currentSlide].isComingSoon ? (
                  <button 
                    onClick={() => alert('👗 Fashion Collection Coming Soon!')}
                    className="bg-gray-400 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full font-semibold cursor-pointer shadow-lg hover:shadow-xl transition flex items-center gap-2 text-sm sm:text-base"
                  >
                    Coming Soon <FaArrowRight className="text-sm" />
                  </button>
                ) : (
                  <Link 
                    to={slides[currentSlide].link} 
                    className="bg-[#D4AF37] text-white px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full font-semibold hover:bg-[#b8941f] transition shadow-lg hover:shadow-xl flex items-center gap-2 text-sm sm:text-base"
                  >
                    {slides[currentSlide].btnText} <FaArrowRight className="text-sm" />
                  </Link>
                )}
              </div>
              
              {/* Stats - Responsive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-8 sm:mt-10 md:mt-12">
                {[
                  { icon: <FaStar className="text-[#D4AF37]" />, value: '10,000+', label: 'Happy Customers' },
                  { icon: <FaShoppingCart className="text-[#D4AF37]" />, value: '100%', label: 'Nationwide' },
                  { icon: <FaStar className="text-[#D4AF37]" />, value: 'Pure', label: '100% Natural' },
                  { icon: <FaStar className="text-[#D4AF37]" />, value: 'Trusted', label: 'Premium Quality' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/80 p-2 sm:p-3 md:p-4 text-center rounded-xl sm:rounded-2xl border border-[#E5E7EB] shadow-sm">
                    <div className="text-lg sm:text-xl md:text-2xl flex justify-center">{stat.icon}</div>
                    <p className="text-xs sm:text-sm font-bold text-[#111827] mt-0.5 sm:mt-1">{stat.value}</p>
                    <p className="text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT - Image */}
            <div className="relative flex justify-center mt-6 lg:mt-0">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                <img 
                  src={slides[currentSlide].image} 
                  alt={slides[currentSlide].title}
                  className="rounded-2xl sm:rounded-3xl shadow-2xl w-full object-contain bg-white h-[250px] sm:h-[320px] md:h-[400px]"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x600/D4AF37/FFFFFF?text=' + slides[currentSlide].title;
                  }}
                />
                <div className="absolute -inset-2 sm:-inset-4 border-2 border-[#D4AF37]/20 rounded-2xl sm:rounded-3xl pointer-events-none" />
                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-white rounded-xl sm:rounded-2xl shadow-xl p-2 sm:p-3 border border-[#D4AF37]/10">
                  <span className="text-2xl sm:text-3xl md:text-4xl">{slides[currentSlide].emoji}</span>
                </div>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#D4AF37] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">✨ Premium</div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                index === currentSlide 
                  ? 'w-6 sm:w-8 md:w-10 bg-[#D4AF37]' 
                  : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-[#D4AF37]'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ============================================================
      🥜 DRY FRUITS SECTION
      ============================================================ */}
      <section className="py-8 sm:py-12 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">🥜</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827]">Premium Dry Fruits</h2>
            </div>
            <Link to="/shop" className="text-[#D4AF37] hover:text-[#b8941f] transition flex items-center gap-1 text-sm font-medium">
              More <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {dryFruitsProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
      👗 FASHION SECTION
      ============================================================ */}
      <section className="py-8 sm:py-12 bg-[#FFFDF7]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">👗</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827]">Fashion Collection</h2>
            </div>
            <Link to="/fashion" className="text-[#D4AF37] hover:text-[#b8941f] transition flex items-center gap-1 text-sm font-medium">
              More <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {fashionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
      🍬 SWEETS SECTION
      ============================================================ */}
      <section className="py-8 sm:py-12 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">🍬</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827]">Sweet Collection</h2>
            </div>
            <Link to="/sweets" className="text-[#D4AF37] hover:text-[#b8941f] transition flex items-center gap-1 text-sm font-medium">
              More <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {sweetsProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
      ⭐ CUSTOMER FAVORITES SECTION
      ============================================================ */}
      <section className="py-8 sm:py-12 bg-[#FFFDF7]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">⭐</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827]">Customer Favorites</h2>
            </div>
            <Link to="/shop" className="text-[#D4AF37] hover:text-[#b8941f] transition flex items-center gap-1 text-sm font-medium">
              View All <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {favoritesProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
      REVIEWS SECTION
      ============================================================ */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-[#D4AF37] font-medium text-[10px] sm:text-xs tracking-wider uppercase">Testimonials</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827] mt-2">
              What Our <span className="text-[#D4AF37]">Customers Say</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
              Real reviews from real customers who trust Maha One
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
            {reviews.map((review, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#E5E7EB] hover:-translate-y-1"
              >
                {/* Stars */}
                <div className="flex text-[#D4AF37] text-sm md:text-base mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < review.rating ? 'text-[#D4AF37]' : 'text-gray-300'} />
                  ))}
                </div>
                
                {/* Review Text */}
                <p className="text-gray-600 text-sm md:text-base italic leading-relaxed">
                  "{review.text}"
                </p>
                
                {/* Customer Name */}
                <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                  <h4 className="font-semibold text-[#111827] text-sm md:text-base">{review.name}</h4>
                  <p className="text-xs text-gray-400">{review.location}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-[#E5E7EB]">
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-[#111827]">4.9</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">5.0</span>
              <span className="w-px h-6 bg-[#E5E7EB] mx-2"></span>
              <span className="text-sm text-gray-500">Based on 10,000+ reviews</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
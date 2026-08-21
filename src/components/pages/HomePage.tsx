import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart, FaTruck, FaLeaf, FaMedal, FaArrowRight, FaPlay } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

// ✅ Hero Images - Direct Cloudinary URLs used in slides
// import heroImage from '../../assets/images/hero-image.png';

const HomePage = () => {
  const { addToCart } = useCart();

  // ============================================================
  // ✅ HERO SLIDES - FASHION NOW "SHOP NOW"
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

  useEffect(() => {
    console.log('Current Slide:', currentSlide);
  }, [currentSlide]);

  // ✅ Products
  const products = [
    { id: 1, name: 'American Almonds Premium', price: 1950, oldPrice: 2300, discount: 13, rating: 4.8, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128223/almonds_large_oq4jyx.png', type: 'dry', stock: 50 },
    { id: 2, name: 'Roasted Brown Cashews', price: 2000, oldPrice: 2400, discount: 17, rating: 4.9, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128406/brown_kaju_cu5gvs.png', type: 'dry', stock: 35 },
    { id: 3, name: 'Soft Shell Salted Pistachios', price: 2600, oldPrice: 3100, discount: 16, rating: 4.7, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128419/pista_without_shell_ymunmc.png', type: 'dry', stock: 40 },
    { id: 101, name: 'Caramel Dream Choco Bar', price: 1290, oldPrice: 1500, discount: 14, rating: 4.9, image: '/images/sweets/caramel dream choco bar.jpg', type: 'sweet', stock: 45 },
  ];

  const categories = [
    { name: 'Dry Fruits', icon: '🥜', path: '/shop', image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787299384/hero-image_gqluny.jpg' },
    { name: 'Sweets', icon: '🍬', path: '/sweets', image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787299385/hero-sweets_lbplgs.jpg' },
    { name: 'Fashion', icon: '👗', path: '/fashion', image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787299388/hero-fashion_miqdis.jpg' },
  ];

  const reviews = [
    { name: 'Ayesha Khan', text: 'Best dry fruits I have ever tasted! Premium quality.' },
    { name: 'Dr. Usman', text: '100% natural and fresh. Highly recommended!' },
    { name: 'Fatima Ali', text: 'Perfect for gifting. Beautiful packaging!' },
  ];

  const handleAddToCart = (product: any) => {
    addToCart(product);
    alert(`✅ ${product.name} added to cart!`);
  };

  const getDetailLink = (product: any) => {
    return product.type === 'sweet' ? `/sweet-product/${product.id}` : `/dry-product/${product.id}`;
  };

  const slide = slides[currentSlide];

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
                {slide.badge}
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
                {slide.subtitle}
              </p>
              
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
                {slide.isComingSoon ? (
                  <button 
                    onClick={() => alert('👗 Fashion Collection Coming Soon!')}
                    className="bg-gray-400 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full font-semibold cursor-pointer shadow-lg hover:shadow-xl transition flex items-center gap-2 text-sm sm:text-base"
                  >
                    Coming Soon <FaArrowRight className="text-sm" />
                  </button>
                ) : (
                  <Link 
                    to={slide.link} 
                    className="bg-[#D4AF37] text-white px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full font-semibold hover:bg-[#b8941f] transition shadow-lg hover:shadow-xl flex items-center gap-2 text-sm sm:text-base"
                  >
                    {slide.btnText} <FaArrowRight className="text-sm" />
                  </Link>
                )}
                <Link to="/about" className="border-2 border-[#D4AF37] text-[#D4AF37] px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full font-semibold hover:bg-[#D4AF37] hover:text-white transition flex items-center gap-2 text-sm sm:text-base">
                  <FaPlay className="text-sm" /> Our Story
                </Link>
              </div>
              
              {/* Stats - Responsive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-8 sm:mt-10 md:mt-12">
                {[
                  { icon: <FaStar className="text-[#D4AF37]" />, value: '10,000+', label: 'Happy Customers' },
                  { icon: <FaTruck className="text-[#D4AF37]" />, value: '100%', label: 'Nationwide' },
                  { icon: <FaLeaf className="text-[#D4AF37]" />, value: 'Pure', label: '100% Natural' },
                  { icon: <FaMedal className="text-[#D4AF37]" />, value: 'Trusted', label: 'Premium Quality' },
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
                  src={slide.image} 
                  alt={slide.title}
                  className="rounded-2xl sm:rounded-3xl shadow-2xl w-full object-contain bg-white h-[250px] sm:h-[320px] md:h-[400px]"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x600/D4AF37/FFFFFF?text=' + slide.title;
                  }}
                />
                <div className="absolute -inset-2 sm:-inset-4 border-2 border-[#D4AF37]/20 rounded-2xl sm:rounded-3xl pointer-events-none" />
                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-white rounded-xl sm:rounded-2xl shadow-xl p-2 sm:p-3 border border-[#D4AF37]/10">
                  <span className="text-2xl sm:text-3xl md:text-4xl">{slide.emoji}</span>
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
      CATEGORIES - Responsive
      ============================================================ */}
      <section className="py-8 sm:py-12 md:py-16 bg-[#FFFDF7]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <span className="text-[#D4AF37] font-medium text-[10px] sm:text-xs tracking-wider uppercase">Categories</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#111827] mt-1 sm:mt-2">Explore Our <span className="text-[#D4AF37]">Collections</span></h2>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-3xl mx-auto">
            {categories.map((cat) => (
              <Link to={cat.path} key={cat.name}>
                <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 overflow-hidden">
                    <img 
                      src={cat.image} 
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x400/0F766E/FFFFFF?text=' + cat.name;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 lg:p-5 text-white">
                      <span className="text-2xl sm:text-3xl md:text-4xl block mb-0.5 sm:mb-1">{cat.icon}</span>
                      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">{cat.name}</h3>
                      <p className="text-[10px] sm:text-xs text-white/70 group-hover:text-[#D4AF37] transition-colors">View Collection →</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
      BEST SELLING PRODUCTS - Responsive
      ============================================================ */}
      <section className="py-8 sm:py-12 md:py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <span className="text-[#D4AF37] font-medium text-[10px] sm:text-xs tracking-wider uppercase">Best Sellers</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#111827] mt-1 sm:mt-2">Customer <span className="text-[#D4AF37]">Favorites</span></h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {products.map((p) => {
              const isInStock = p.stock > 0;
              
              return (
                <div key={p.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#E5E7EB] group">
                  <Link to={getDetailLink(p)}>
                    <div className="relative overflow-hidden cursor-pointer">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-contain bg-white group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x400/D4AF37/FFFFFF?text=' + p.name;
                        }}
                      />
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">-{p.discount}%</span>
                      <button 
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 rounded-full p-1 sm:p-1.5 hover:bg-[#D4AF37] transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('❤️ Added to Wishlist!');
                        }}
                      >
                        <FaHeart className="text-xs sm:text-sm text-gray-600 hover:text-white" />
                      </button>
                    </div>
                  </Link>
                  <div className="p-2 sm:p-3 md:p-4">
                    <div className="flex text-[#D4AF37] text-[10px] sm:text-sm">
                      {[...Array(5)].map((_, i) => (<FaStar key={i} />))}
                    </div>
                    <Link to={getDetailLink(p)}>
                      <h3 className="font-semibold text-[#111827] text-xs sm:text-sm md:text-base lg:text-lg mt-0.5 sm:mt-1 hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-2">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                      <span className="text-[#D4AF37] font-bold text-sm sm:text-base md:text-lg lg:text-xl">PKR {p.price}</span>
                      <span className="text-gray-400 line-through text-[10px] sm:text-sm">PKR {p.oldPrice}</span>
                    </div>
                    
                    {/* Stock Status */}
                    <div className="mt-1 sm:mt-2 flex items-center gap-1 sm:gap-1.5">
                      <span 
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isInStock ? 'bg-green-500 animate-blink' : 'bg-red-500'}`}
                      ></span>
                      <span className={`text-[8px] sm:text-xs font-medium ${isInStock ? 'text-green-600' : 'text-red-500'}`}>
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isInStock) {
                          handleAddToCart(p);
                        } else {
                          alert('❌ This product is out of stock!');
                        }
                      }}
                      disabled={!isInStock}
                      className={`w-full mt-2 sm:mt-3 md:mt-4 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition flex items-center justify-center gap-1 sm:gap-2 ${
                        isInStock
                          ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <FaShoppingCart className="text-[10px] sm:text-xs" />
                      <span className="whitespace-nowrap">{isInStock ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
      REVIEWS
      ============================================================ */}
      <section className="py-8 sm:py-12 md:py-16 bg-[#FFFDF7]">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <span className="text-[#D4AF37] font-medium text-[10px] sm:text-xs tracking-wider uppercase">Testimonials</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#111827] mt-1 sm:mt-2">What Our <span className="text-[#D4AF37]">Customers Say</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white/80 backdrop-blur p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-[#E5E7EB] text-center shadow-sm">
                <div className="flex justify-center text-[#D4AF37] text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
                  {[...Array(5)].map((_, j) => (<FaStar key={j} />))}
                </div>
                <p className="text-sm sm:text-base text-gray-600 italic">"{r.text}"</p>
                <h4 className="font-semibold text-[#111827] mt-2 sm:mt-3 text-sm sm:text-base">{r.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
      NEWSLETTER
      ============================================================ */}
      <section className="py-8 sm:py-12 md:py-16 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="bg-white/80 backdrop-blur p-6 sm:p-8 md:p-12 text-center rounded-xl sm:rounded-2xl border border-[#E5E7EB] shadow-sm">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">📬</div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827]">Get Healthy Offers <span className="text-[#D4AF37]">Every Week</span></h3>
            <p className="text-sm sm:text-base text-gray-500 mt-2 mb-4 sm:mb-6 max-w-lg mx-auto">Subscribe for premium offers, health tips, and exclusive discounts.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#D4AF37] text-sm sm:text-base" />
              <button className="bg-[#D4AF37] text-white px-6 sm:px-8 py-2 sm:py-2.5 rounded-full font-semibold hover:bg-[#b8941f] transition shadow-lg text-sm sm:text-base">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart, FaTruck, FaLeaf, FaMedal, FaArrowRight, FaPlay } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

// ✅ Hero Images
import heroImage from '../../assets/images/hero-image.png';

const HomePage = () => {
  const { addToCart } = useCart();

  // ============================================================
  // ✅ HERO SLIDES - FIXED
  // ============================================================
  const slides = [
    {
      id: 0,
      title: 'Premium Dry Fruits',
      subtitle: 'Handpicked from the finest farms, delivered fresh across Pakistan.',
      emoji: '🥜',
      bg: 'from-[#0F766E] to-[#065F46]',
      image: heroImage,
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
      image: '/images/sweets/hero-sweets.jpg',
      link: '/sweets',
      btnText: 'Explore Sweets',
      isComingSoon: false,
      badge: '🍬 Sweet Treats Since 2024'
    },
    {
      id: 2,
      title: 'Fashion Collection',
      subtitle: 'Premium fashion collection coming soon. Stay tuned for the latest trends.',
      emoji: '👗',
      bg: 'from-[#8B5CF6] to-[#6D28D9]',
      image: '/images/fashion/hero-fashion.jpg',
      link: '/fashion',
      btnText: 'Coming Soon',
      isComingSoon: true,
      badge: '👗 Coming Soon - 2026'
    },
  ];

  // ✅ SIMPLE SLIDER - BINA DEPENDENCY KE
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ SLIDE CHANGING - CLEAN
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = prev + 1;
        if (next >= slides.length) return 0;
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []); // ✅ EMPTY ARRAY - SIRF EK BAAR RUN HOGA

  // ✅ CHECK SLIDE CHANGE (Console mein dekhein)
  useEffect(() => {
    console.log('Current Slide:', currentSlide);
  }, [currentSlide]);

  // ✅ PRODUCTS
  const products = [
    { id: 1, name: 'American Almonds Premium', price: 2000, oldPrice: 2300, discount: 13, rating: 4.8, image: '/images/dry-fruits/almonds large.jpg', type: 'dry' },
    { id: 2, name: 'Roasted Brown Cashews', price: 2000, oldPrice: 2400, discount: 17, rating: 4.9, image: '/images/dry-fruits/brown kaju.jpg', type: 'dry' },
    { id: 3, name: 'Soft Shell Salted Pistachios', price: 2600, oldPrice: 3100, discount: 16, rating: 4.7, image: '/images/dry-fruits/pista shell.jpg', type: 'dry' },
    { id: 101, name: 'Caramel Dream Choco Bar', price: 1290, oldPrice: 1500, discount: 14, rating: 4.9, image: '/images/sweets/caramel dream choco bar.jpg', type: 'sweet' },
  ];

  const categories = [
    { name: 'Dry Fruits', icon: '🥜', path: '/shop', image: '/images/dry-fruits/almonds large.jpg' },
    { name: 'Sweets', icon: '🍬', path: '/sweets', image: '/images/sweets/caramel dream choco bar.jpg' },
    { name: 'Fashion', icon: '👗', path: '/fashion', image: '/images//fashion/hero-fashion.jpg' },
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

  // ✅ CURRENT SLIDE
  const slide = slides[currentSlide];

  return (
    <div className="bg-[#FFFDF7]">
      
      {/* ============================================================
      HERO SECTION - FIXED SLIDER
      ============================================================ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-[#FFFDF7] via-[#F8FAFC] to-[#FFFDF7]">
        
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#0F766E]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* LEFT */}
            <div>
              <div className="inline-block px-4 py-1.5 bg-[#D4AF37]/10 rounded-full text-[#D4AF37] text-sm font-medium mb-6 border border-[#D4AF37]/20">
                {slide.badge}
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05]">
                {currentSlide === 0 ? (
                  <><span className="text-[#111827]">Premium</span> <span className="text-[#D4AF37]">Dry Fruits</span></>
                ) : currentSlide === 1 ? (
                  <><span className="text-[#111827]">Sweet</span> <span className="text-[#D4AF37]">Collection</span></>
                ) : (
                  <><span className="text-[#111827]">Fashion</span> <span className="text-[#D4AF37]">Collection</span></>
                )}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-lg leading-relaxed">
                {slide.subtitle}
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8">
                {slide.isComingSoon ? (
                  <button 
                    onClick={() => alert('👗 Fashion Collection Coming Soon!')}
                    className="bg-gray-400 text-white px-10 py-4 rounded-full font-semibold cursor-pointer shadow-lg hover:shadow-xl transition flex items-center gap-2"
                  >
                    Coming Soon <FaArrowRight className="text-sm" />
                  </button>
                ) : (
                  <Link 
                    to={slide.link} 
                    className="bg-[#D4AF37] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#b8941f] transition shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    {slide.btnText} <FaArrowRight className="text-sm" />
                  </Link>
                )}
                <Link to="/about" className="border-2 border-[#D4AF37] text-[#D4AF37] px-10 py-4 rounded-full font-semibold hover:bg-[#D4AF37] hover:text-white transition flex items-center gap-2">
                  <FaPlay className="text-sm" /> Our Story
                </Link>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
                {[
                  { icon: <FaStar className="text-[#D4AF37]" />, value: '10,000+', label: 'Happy Customers' },
                  { icon: <FaTruck className="text-[#D4AF37]" />, value: '100%', label: 'Nationwide' },
                  { icon: <FaLeaf className="text-[#D4AF37]" />, value: 'Pure', label: '100% Natural' },
                  { icon: <FaMedal className="text-[#D4AF37]" />, value: 'Trusted', label: 'Premium Quality' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/80 p-4 text-center rounded-2xl border border-[#E5E7EB] shadow-sm">
                    <div className="text-2xl flex justify-center">{stat.icon}</div>
                    <p className="text-sm font-bold text-[#111827] mt-1">{stat.value}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT - Image */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-lg">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="rounded-3xl shadow-2xl w-full object-cover h-[400px]"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x600/D4AF37/FFFFFF?text=' + slide.title;
                  }}
                />
                <div className="absolute -inset-4 border-2 border-[#D4AF37]/20 rounded-3xl pointer-events-none" />
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-[#D4AF37]/10">
                  <span className="text-4xl">{slide.emoji}</span>
                </div>
                <div className="absolute top-6 right-6 bg-[#D4AF37] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">✨ Premium</div>
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur rounded-xl p-3 shadow-lg border border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <FaTruck className="text-[#0F766E] text-lg" />
                    <div>
                      <p className="text-xs font-bold text-[#111827]">Free Delivery</p>
                      <p className="text-[8px] text-gray-500">Across Pakistan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentSlide 
                  ? 'w-10 bg-[#D4AF37]' 
                  : 'w-2 bg-gray-300 hover:bg-[#D4AF37]'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-gray-400" style={{ animation: 'bounce 1.5s infinite' }}>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#D4AF37] rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ============================================================
      CATEGORIES
      ============================================================ */}
      <section className="py-16 bg-[#FFFDF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#D4AF37] font-medium text-sm tracking-wider uppercase">Categories</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mt-2">Explore Our <span className="text-[#D4AF37]">Collections</span></h2>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {categories.map((cat) => (
              <Link to={cat.path} key={cat.name}>
                <div className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={cat.image} 
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x400/0F766E/FFFFFF?text=' + cat.name;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <span className="text-4xl block mb-1">{cat.icon}</span>
                      <h3 className="text-xl font-bold">{cat.name}</h3>
                      <p className="text-sm text-white/70 group-hover:text-[#D4AF37] transition-colors">View Collection →</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
      BEST SELLING PRODUCTS
      ============================================================ */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#D4AF37] font-medium text-sm tracking-wider uppercase">Best Sellers</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mt-2">Customer <span className="text-[#D4AF37]">Favorites</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#E5E7EB] group">
                <Link to={getDetailLink(p)}>
                  <div className="relative overflow-hidden cursor-pointer">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x400/D4AF37/FFFFFF?text=' + p.name;
                      }}
                    />
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">-{p.discount}%</span>
                    <button 
                      className="absolute top-3 right-3 bg-white/90 rounded-full p-2 hover:bg-[#D4AF37] transition-all"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('❤️ Added to Wishlist!');
                      }}
                    >
                      <FaHeart className="text-gray-600 hover:text-white" />
                    </button>
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex text-[#D4AF37] text-sm">
                    {[...Array(5)].map((_, i) => (<FaStar key={i} />))}
                  </div>
                  <Link to={getDetailLink(p)}>
                    <h3 className="font-semibold text-[#111827] text-lg mt-1 hover:text-[#D4AF37] transition-colors cursor-pointer">
                      {p.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[#D4AF37] font-bold text-xl">PKR {p.price}</span>
                    <span className="text-gray-400 line-through text-sm">PKR {p.oldPrice}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p);
                    }}
                    className="w-full mt-4 bg-[#0F766E] text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#065F46] transition flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart className="text-xs" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
      REVIEWS
      ============================================================ */}
      <section className="py-16 bg-[#FFFDF7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#D4AF37] font-medium text-sm tracking-wider uppercase">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mt-2">What Our <span className="text-[#D4AF37]">Customers Say</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-[#E5E7EB] text-center shadow-sm">
                <div className="flex justify-center text-[#D4AF37] text-xl mb-3">
                  {[...Array(5)].map((_, j) => (<FaStar key={j} />))}
                </div>
                <p className="text-gray-600 italic">"{r.text}"</p>
                <h4 className="font-semibold text-[#111827] mt-3">{r.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
      NEWSLETTER
      ============================================================ */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur p-8 md:p-12 text-center rounded-2xl border border-[#E5E7EB] shadow-sm">
            <div className="text-5xl mb-4">📬</div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#111827]">Get Healthy Offers <span className="text-[#D4AF37]">Every Week</span></h3>
            <p className="text-gray-500 mt-2 mb-6 max-w-lg mx-auto">Subscribe for premium offers, health tips, and exclusive discounts.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#D4AF37]" />
              <button className="bg-[#D4AF37] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#b8941f] transition shadow-lg">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
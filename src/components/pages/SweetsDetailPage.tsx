import { useParams, Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { 
  FaStar, FaHeart, FaShoppingCart, FaArrowLeft, 
  FaTruck, FaShieldAlt, FaLeaf, FaChevronLeft, FaChevronRight,
  FaCircle
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  category: string;
  image: string;
  description: string;
  benefits: string[];
  stock?: number;
}

// ✅ Helper function to convert description to bullet points
const formatDescription = (text: string) => {
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
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // ✅ All Sweets Products
  const sweetProducts: Product[] = [
    { 
      id: 101, 
      name: 'Caramel Dream Choco Bar', 
      price: 1290, 
      oldPrice: 1500, 
      discount: 14, 
      rating: 4.9, 
      category: 'Sweets',
      image: '/images/sweets/caramel dream choco bar.jpg',
      description: `🍫 Caramel Dream Choco Bar

⭐ Premium Quality

🌟 FEATURES:
• Premium Chocolate Coating
• Rich Caramel Center
• Crunchy Texture
• Luxury Taste Experience

✨ A heavenly combination of rich caramel and smooth chocolate.`,
      benefits: ['Premium Chocolate', 'Rich Caramel', 'Crunchy Texture', 'Luxury Taste'],
      stock: 50
    },
    { 
      id: 102, 
      name: 'HISS Crispy Wafer Choco Bar', 
      price: 1280, 
      oldPrice: 1550, 
      discount: 20, 
      rating: 4.8, 
      category: 'Sweets',
      image: '/images/sweets/hiss crispy wafer.jpg',
      description: `🍫 HISS Crispy Wafer Choco Bar

⭐ Premium Quality

🌟 FEATURES:
• Crispy Wafer Layers
• Smooth Chocolate Coating
• Perfect Crunch in Every Bite
• Premium Quality Ingredients

✨ Crispy wafer layers coated with smooth chocolate.`,
      benefits: ['Crispy Wafer', 'Smooth Chocolate', 'Perfect Crunch', 'Premium Quality'],
      stock: 40
    },
    { 
      id: 103, 
      name: 'Nani Caramel Choco Bar', 
      price: 1300, 
      oldPrice: 1500, 
      discount: 18, 
      rating: 4.7, 
      category: 'Sweets',
      image: '/images/sweets/nani caramel choco bar.jpg',
      description: `🍫 Nani Caramel Choco Bar

⭐ Premium Quality

🌟 FEATURES:
• Soft & Chewy Caramel
• Premium Chocolate Blend
• Rich Buttery Taste
• Melts in Your Mouth

✨ Soft and chewy caramel blended with premium chocolate.`,
      benefits: ['Soft Caramel', 'Premium Chocolate', 'Buttery Taste', 'Melt in Mouth'],
      stock: 35
    },
    { 
      id: 104, 
      name: 'Nani Coconut Bar', 
      price: 1290, 
      oldPrice: 1500, 
      discount: 20, 
      rating: 4.9, 
      category: 'Sweets',
      image: '/images/sweets/nani coconut bar.jpg',
      description: `🥥 Nani Coconut Bar

⭐ Premium Quality

🌟 FEATURES:
• Creamy Coconut
• Tropical Flavor
• Premium Quality
• Rich Taste Experience

✨ Creamy coconut infused with a touch of sweetness.`,
      benefits: ['Creamy Coconut', 'Tropical Flavor', 'Premium Quality', 'Rich Taste'],
      stock: 30
    },
    { 
      id: 105, 
      name: 'Rili Eclairs', 
      price: 1100, 
      oldPrice: 1450, 
      discount: 20, 
      rating: 4.6, 
      category: 'Sweets',
      image: '/images/sweets/rili eclairs.jpg',
      description: `🍫 Rili Eclairs

⭐ Premium Quality

🌟 FEATURES:
• French Recipe
• Creamy Filling
• Elegant Design
• Classic Taste

✨ Classic French-inspired eclairs filled with creamy goodness.`,
      benefits: ['French Recipe', 'Creamy Filling', 'Elegant Design', 'Classic Taste'],
      stock: 45
    },
    { 
      id: 106, 
      name: 'Roro Caramel Eclair', 
      price: 650, 
      oldPrice: 700, 
      discount: 22, 
      rating: 4.8, 
      category: 'Sweets',
      image: '/images/sweets/roro caramel eclair.jpg',
      description: `🍫 Roro Caramel Eclair

⭐ Premium Quality

🌟 FEATURES:
• Caramel Filled
• Soft Texture
• Golden Pastry
• Sweet Delight

✨ Golden and caramel-filled eclairs with a soft texture.`,
      benefits: ['Caramel Filled', 'Soft Texture', 'Golden Pastry', 'Sweet Delight'],
      stock: 60
    },
    { 
      id: 107, 
      name: 'Spark Coconut Bar', 
      price: 1290, 
      oldPrice: 1500, 
      discount: 18, 
      rating: 4.7, 
      category: 'Sweets',
      image: '/images/sweets/spark coconut bar.jpg',
      description: `🥥 Spark Coconut Bar

⭐ Premium Quality

🌟 FEATURES:
• Coconut Fusion
• Chocolate Blend
• Unique Flavor
• Premium Quality

✨ A unique fusion of coconut and chocolate.`,
      benefits: ['Coconut Fusion', 'Chocolate Blend', 'Unique Flavor', 'Premium Quality'],
      stock: 25
    },
  ];

  const product = sweetProducts.find(p => p.id === parseInt(id || '0'));

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFDF7] dark:bg-[#111827]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Product Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">The sweet you are looking for does not exist.</p>
          <Link to="/sweets" className="inline-block mt-4 bg-[#D4AF37] text-white px-6 py-2 rounded-full hover:bg-[#b8941f] transition">
            Back to Sweets
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * quantity;
  const allImages = [product.image];
  const mainImageUrl = mainImage || allImages[0] || product.image;

  // ✅ Format description as bullet points
  const descriptionLines = formatDescription(product.description);

  // ✅ Get suggested products (all other products except current)
  const suggestedProducts = sweetProducts.filter(p => p.id !== product.id);

  // ✅ Scroll functions for slider
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-16 sm:pt-6 md:pt-8 lg:pt-12 pb-4 sm:pb-6 md:pb-8 lg:pb-12">
        
        <Link to="/sweets" className="inline-flex items-center gap-2 text-[#0F766E] dark:text-[#14b8a6] hover:text-[#D4AF37] transition mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base">
          <FaArrowLeft className="text-xs sm:text-sm md:text-base" /> Back to Sweets
        </Link>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          
          {/* ============================================================
          ✅ PRODUCT IMAGES GALLERY - IMAGE FIT FIX
          ============================================================ */}
          <div className="relative">
            {/* Main Image */}
            <div className="bg-[#F5F3FF] dark:bg-[#1F2937] rounded-xl sm:rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-gray-700 relative">
              {/* ✅ Fixed aspect ratio with object-cover */}
              <div className="w-full aspect-square sm:aspect-[4/5] md:aspect-[3/4] relative">
                <img
                  src={mainImageUrl}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/600x600/D4AF37/FFFFFF?text=${product.name}`;
                    setImageLoaded(true);
                  }}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ Thumbnails - Single image with badge */}
            <div className="mt-2 sm:mt-3 md:mt-4 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-1.5 sm:gap-2 min-w-max">
                {allImages.map((img, i) => (
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
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-lg z-10">
              -{product.discount}%
            </span>
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-[#D4AF37] text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-lg z-10">
              ✨ Premium
            </div>
            <button className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 rounded-full p-1.5 sm:p-2 hover:bg-[#D4AF37] transition shadow-md z-10">
              <FaHeart className="text-gray-600 hover:text-white text-sm sm:text-base" />
            </button>
          </div>

          {/* ============================================================
          ✅ PRODUCT INFO
          ============================================================ */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
            
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium capitalize">
                {product.category}
              </span>
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
                PKR {product.price.toLocaleString()}
              </span>
              <span className="text-gray-400 dark:text-gray-500 line-through text-sm sm:text-base">
                PKR {product.oldPrice.toLocaleString()}
              </span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                Save {product.discount}%
              </span>
            </div>

            <div className="bg-[#F8FAFC] dark:bg-[#1F2937] rounded-xl border border-[#E5E7EB] dark:border-gray-700 p-3 sm:p-4">
              <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed space-y-1">
                {descriptionLines.map((line, idx) => {
                  if (line.includes('🍫') || line.includes('🥥') || 
                      (line.length < 30 && line === line.toUpperCase() && line.trim().length > 0)) {
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
                })}
              </div>
            </div>

            {/* Benefits */}
            <div className="p-2.5 sm:p-3 md:p-4 bg-[#F8FAFC] dark:bg-[#1F2937] rounded-xl border border-[#E5E7EB] dark:border-gray-700">
              <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-[#111827] dark:text-white mb-1">✨ Key Benefits:</p>
              <div className="flex flex-wrap gap-1.5">
                {product.benefits.map((benefit, i) => (
                  <span key={i} className="bg-[#F8FAFC] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-gray-700 px-2 py-0.5 rounded-full text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div>
              {product.stock && product.stock > 0 ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] sm:text-xs md:text-sm text-green-600 dark:text-green-400 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
                  <span className="text-[10px] sm:text-xs md:text-sm text-red-600 dark:text-red-400 font-medium">Out of Stock</span>
                </div>
              )}
            </div>

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
                  addToCart({ 
                    ...product, 
                    price: product.price,
                    quantity: quantity,
                    totalPrice: totalPrice
                  });
                  alert(`✅ ${product.name} added to cart!`);
                }}
                disabled={product.stock === 0}
                className={`flex-1 px-3 py-2 sm:px-5 sm:py-2.5 md:px-7 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 ${
                  product.stock && product.stock > 0
                    ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart className="text-xs sm:text-sm" />
                <span>{product.stock && product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
              <button
                onClick={() => {
                  if (product.stock === 0) {
                    alert('❌ This product is out of stock!');
                    return;
                  }
                  addToCart({ 
                    ...product, 
                    price: product.price,
                    quantity: quantity,
                    totalPrice: totalPrice
                  });
                  window.location.href = '/checkout';
                }}
                disabled={product.stock === 0}
                className={`px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 ${
                  product.stock && product.stock > 0
                    ? 'bg-[#D4AF37] text-white hover:bg-[#b8941f] cursor-pointer'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-1">
              <div className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur p-1.5 sm:p-2 md:p-2.5 rounded-xl border border-[#E5E7EB] dark:border-gray-700 text-center">
                <FaTruck className="text-[#D4AF37] text-sm sm:text-base md:text-lg mx-auto" />
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">Free Delivery</p>
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
        ✅ SUGGESTED PRODUCTS SLIDER
        ============================================================ */}
        {suggestedProducts.length > 0 && (
          <div className="mt-8 sm:mt-10 md:mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827] dark:text-white flex items-center gap-2">
                <span className="text-[#D4AF37]">✨</span> You May Also Like
              </h2>
              <Link to="/sweets" className="text-[#D4AF37] hover:text-[#b8941f] transition text-xs sm:text-sm font-medium flex items-center gap-1">
                View All <FaChevronRight className="text-xs" />
              </Link>
            </div>

            <div className="relative">
              {/* Slider Controls - Left */}
              <button
                onClick={scrollLeft}
                className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-[#1F2937] rounded-full p-1.5 sm:p-2 shadow-lg border border-[#E5E7EB] dark:border-gray-700 hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition"
              >
                <FaChevronLeft className="text-gray-600 dark:text-gray-400 text-sm sm:text-base" />
              </button>

              {/* Slider Container */}
              <div
                ref={sliderRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {suggestedProducts.map((suggested) => (
                  <Link
                    key={suggested.id}
                    to={`/sweet-product/${suggested.id}`}
                    className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] bg-white dark:bg-[#1F2937] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[#E5E7EB] dark:border-gray-700 hover:-translate-y-1 group"
                  >
                    {/* ✅ Suggested Product Image - Full fit */}
                    <div className="relative aspect-square bg-[#F5F3FF] dark:bg-[#1F2937] overflow-hidden">
                      <img
                        src={suggested.image}
                        alt={suggested.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=${suggested.name}`;
                        }}
                      />
                      <span className="absolute top-1 left-1 bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        -{suggested.discount}%
                      </span>
                    </div>
                    <div className="p-2 sm:p-3">
                      <h4 className="font-semibold text-[#111827] dark:text-white text-[10px] sm:text-xs line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                        {suggested.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                        <span className="text-[#D4AF37] font-bold text-xs sm:text-sm">
                          PKR {suggested.price.toLocaleString()}
                        </span>
                        <span className="text-gray-400 line-through text-[8px] sm:text-[10px]">
                          PKR {suggested.oldPrice.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (suggested.stock && suggested.stock > 0) {
                            addToCart({ ...suggested, quantity: 1 });
                            alert(`✅ ${suggested.name} added to cart!`);
                          }
                        }}
                        disabled={suggested.stock === 0}
                        className={`w-full mt-1 px-2 py-1 rounded-full text-[8px] sm:text-[10px] font-medium transition flex items-center justify-center gap-1 ${
                          suggested.stock && suggested.stock > 0
                            ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <FaShoppingCart className="text-[8px] sm:text-[10px]" />
                        {suggested.stock && suggested.stock > 0 ? 'Add' : 'Sold'}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Slider Controls - Right */}
              <button
                onClick={scrollRight}
                className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-[#1F2937] rounded-full p-1.5 sm:p-2 shadow-lg border border-[#E5E7EB] dark:border-gray-700 hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition"
              >
                <FaChevronRight className="text-gray-600 dark:text-gray-400 text-sm sm:text-base" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SweetsDetailPage;
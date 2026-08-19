import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

// ✅ Sweet Product Type Interface
interface SweetProduct {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  category: string;
  image: string;
  description: string;
  stock: number;
}

const SweetsPage = () => {
  const { addToCart } = useCart();
  const [filter, setFilter] = useState('All');

  // ✅ Type defined
  const sweetsProducts: SweetProduct[] = [
    {
      id: 101,
      name: 'Caramel Dream Choco Bar',
      price: 1290,
      oldPrice: 1500,
      discount: 14,
      rating: 4.9,
      category: 'Premium',
      image: '/images/sweets/caramel dream choco bar.jpg',
      description: 'A heavenly combination of rich caramel and smooth chocolate.',
      stock: 45
    },
    {
      id: 102,
      name: 'HISS Crispy Wafer Choco Bar',
      price: 1280,
      oldPrice: 1550,
      discount: 20,
      rating: 4.8,
      category: 'Premium',
      image: '/images/sweets/hiss crispy wafer.jpg',
      description: 'Crispy wafer layers coated with smooth chocolate.',
      stock: 30
    },
    {
      id: 103,
      name: 'Nani Caramel Choco Bar',
      price: 1300,
      oldPrice: 1500,
      discount: 18,
      rating: 4.7,
      category: 'Premium',
      image: '/images/sweets/nani caramel choco bar.jpg',
      description: 'Soft and chewy caramel blended with premium chocolate.',
      stock: 10
    },
    {
      id: 104,
      name: 'Nani Coconut Bar',
      price: 1290,
      oldPrice: 1500,
      discount: 20,
      rating: 4.9,
      category: 'Premium',
      image: '/images/sweets/nani coconut bar.jpg',
      description: 'Creamy coconut infused with a touch of sweetness.',
      stock: 55
    },
    {
      id: 105,
      name: 'Rili Eclairs',
      price: 1100,
      oldPrice: 1450,
      discount: 20,
      rating: 4.6,
      category: 'Traditional',
      image: '/images/sweets/rili eclairs.jpg',
      description: 'Classic French-inspired eclairs filled with creamy goodness.',
      stock: 40
    },
    {
      id: 106,
      name: 'Roro Caramel Eclair',
      price: 650,
      oldPrice: 700,
      discount: 22,
      rating: 4.8,
      category: 'Traditional',
      image: '/images/sweets/roro caramel eclair.jpg',
      description: 'Golden and caramel filled eclairs with a soft texture.',
      stock: 25
    },
    {
      id: 107,
      name: 'Spark Coconut Bar',
      price: 1290,
      oldPrice: 1500,
      discount: 18,
      rating: 4.7,
      category: 'Premium',
      image: '/images/sweets/spark coconut bar.jpg',
      description: 'A unique fusion of coconut and chocolate.',
      stock: 10
    },
  ];

  const categories = ['All', 'Traditional', 'Premium'];

  const filteredProducts = filter === 'All' 
    ? sweetsProducts 
    : sweetsProducts.filter(p => p.category === filter);

  return (
    <div className="bg-[#FFFDF7] py-6 sm:py-8 md:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link to="/" className="flex items-center gap-1 sm:gap-2 text-[#0F766E] hover:text-[#D4AF37] transition text-sm sm:text-base">
              <FaArrowLeft /> Back
            </Link>
            <span className="text-gray-300">|</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827]">
              🍬 <span className="text-[#D4AF37]">Sweet</span> Collection
            </h1>
          </div>
          <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
            {sweetsProducts.length} Products
          </span>
        </div>

        <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">Premium sweets made with love and the finest ingredients.</p>

        {/* Filter Buttons - Responsive */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30'
                  : 'bg-white text-gray-600 hover:bg-[#F8FAFC] border border-[#E5E7EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ✅ Products Grid - Mobile Safe */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {filteredProducts.map((product) => {
            const isInStock = product.stock > 0;
            
            return (
              <Link to={`/sweet-product/${product.id}`} key={product.id} className="block min-w-0">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#E5E7EB] hover:-translate-y-1 cursor-pointer group h-full">
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x400/D4AF37/FFFFFF?text=' + product.name;
                      }}
                    />
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full">
                      -{product.discount}%
                    </span>
                    <button 
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 rounded-full p-1.5 sm:p-2 hover:bg-[#D4AF37] transition"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('❤️ Added to Wishlist!');
                      }}
                    >
                      <FaHeart className="text-sm sm:text-base text-gray-600 hover:text-white" />
                    </button>
                  </div>
                  
                  <div className="p-2 sm:p-3 md:p-4">
                    <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-sm">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                      ))}
                      <span className="text-gray-400 text-[8px] sm:text-xs ml-0.5 sm:ml-1">({product.rating})</span>
                    </div>
                    <h3 className="font-semibold text-[#111827] text-xs sm:text-sm md:text-base lg:text-lg line-clamp-2 mt-0.5 sm:mt-1">
                      {product.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{product.category}</p>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                      <span className="text-[#D4AF37] font-bold text-sm sm:text-base md:text-lg lg:text-xl">PKR {product.price}</span>
                      <span className="text-gray-400 line-through text-[10px] sm:text-sm">PKR {product.oldPrice}</span>
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
                        e.preventDefault();
                        if (isInStock) {
                          addToCart(product);
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
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SweetsPage;
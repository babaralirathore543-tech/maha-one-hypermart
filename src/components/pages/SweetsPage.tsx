import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const SweetsPage = () => {
  const { addToCart } = useCart();
  const [filter, setFilter] = useState('All');

  const sweetsProducts = [
    {
      id: 101,
      name: 'Caramel Dream Choco Bar',
      price: 1290,
      oldPrice: 1500,
      discount: 14,
      rating: 4.9,
      category: 'Premium',
      image: '/images/sweets/caramel dream choco bar.jpg',
      description: 'A heavenly combination of rich caramel and smooth chocolate.'
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
      description: 'Crispy wafer layers coated with smooth chocolate.'
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
      description: 'Soft and chewy caramel blended with premium chocolate.'
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
      description: 'Creamy coconut infused with a touch of sweetness.'
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
      description: 'Classic French-inspired eclairs filled with creamy goodness.'
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
      description: 'Golden and caramel filled eclairs with a soft texture.'
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
      description: 'A unique fusion of coconut and chocolate.'
    },
  ];

  const categories = ['All', 'Traditional', 'Premium'];

  const filteredProducts = filter === 'All' 
    ? sweetsProducts 
    : sweetsProducts.filter(p => p.category === filter);

  return (
    <div className="bg-[#FFFDF7] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="flex items-center gap-2 text-[#0F766E] hover:text-[#D4AF37] transition">
            <FaArrowLeft /> Back to Home
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#111827]">
            🍬 <span className="text-[#D4AF37]">Sweet</span> Collection
          </h1>
          <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-sm">
            {sweetsProducts.length} Products
          </span>
        </div>

        <p className="text-gray-500 mb-6">Premium sweets made with love and the finest ingredients.</p>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30'
                  : 'bg-white text-gray-600 hover:bg-[#F8FAFC] border border-[#E5E7EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ✅ Products Grid - Clickable with Link */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <Link to={`/sweet-product/${product.id}`} key={product.id}>
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#E5E7EB] hover:-translate-y-1 cursor-pointer group">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x400/D4AF37/FFFFFF?text=' + product.name;
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    -{product.discount}%
                  </span>
                  <button 
                    className="absolute top-3 right-3 bg-white/90 rounded-full p-2 hover:bg-[#D4AF37] transition"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('❤️ Added to Wishlist!');
                    }}
                  >
                    <FaHeart className="text-gray-600 hover:text-white" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                    ))}
                    <span className="text-gray-400 text-xs ml-1">({product.rating})</span>
                  </div>
                  <h3 className="font-semibold text-[#111827] text-sm mt-1">{product.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[#D4AF37] font-bold">PKR {product.price}</span>
                    <span className="text-gray-400 line-through text-sm">PKR {product.oldPrice}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    className="w-full mt-3 bg-[#0F766E] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#065F46] transition flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart className="text-xs" /> Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SweetsPage;
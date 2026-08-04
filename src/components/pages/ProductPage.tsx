import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaShoppingCart, FaTruck, FaShieldAlt } from 'react-icons/fa';

const ProductPage = () => {
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [quantity, setQuantity] = useState(1);

  const product = {
    id: 1,
    name: 'Premium Almonds',
    price: 1200,
    rating: 4.8,
    reviews: 124,
    description: 'Premium quality almonds sourced from the finest farms. Rich in vitamin E, magnesium, and healthy fats.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop',
  };

  const weights = ['250g', '500g', '1kg', '2kg'];

  return (
    <div className="bg-[#FFFDF7] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full rounded-2xl shadow-2xl"
            />
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
              20% OFF
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 text-sm mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
              ))}
              <span className="text-gray-400 ml-2">({product.reviews} reviews)</span>
            </div>

            <h1 className="text-3xl font-bold text-[#111827]">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-[#D4AF37]">PKR {product.price}</span>
              <span className="text-gray-400 line-through">PKR 1500</span>
            </div>

            <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

            {/* Weight Options */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <div className="flex gap-2">
                {weights.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedWeight === w
                        ? 'bg-[#D4AF37] text-white'
                        : 'bg-[#F8FAFC] text-gray-600 hover:bg-[#E5E7EB]'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#E5E7EB] transition"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#E5E7EB] transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <button className="flex-1 bg-[#D4AF37] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#b8941f] transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <FaShoppingCart /> Add to Cart
              </button>
              <button className="p-4 rounded-full border border-[#E5E7EB] hover:bg-[#F8FAFC] transition">
                <FaHeart className="text-xl text-gray-600" />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaTruck className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Free Delivery</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaShieldAlt className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Premium Quality</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
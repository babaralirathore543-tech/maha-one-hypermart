import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { FaStar, FaHeart, FaShoppingCart, FaArrowLeft, FaTruck, FaShieldAlt, FaLeaf } from 'react-icons/fa';
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

const SweetsDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // ✅ ONLY SWEETS - No weight options
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
      description: 'A heavenly combination of rich caramel and smooth chocolate. This premium bar offers a perfect balance of sweetness and crunch. Made with the finest ingredients for a luxurious taste experience.',
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
      description: 'Crispy wafer layers coated with smooth chocolate, creating a delightful crunch in every bite. A perfect snack for those who love texture in their sweets.',
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
      description: 'Soft and chewy caramel blended with premium chocolate. This bar offers a rich, buttery taste that melts in your mouth, leaving a lasting sweet impression.',
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
      description: 'Creamy coconut infused with a touch of sweetness, creating a tropical delight. This bar is perfect for coconut lovers seeking a premium sweet experience.',
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
      description: 'Classic French-inspired eclairs filled with creamy goodness. A timeless sweet treat that brings elegance and indulgence to any occasion.',
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
      description: 'Golden and caramel-filled eclairs with a soft, melt-in-your-mouth texture. A delightful treat for those who enjoy the classic combination of caramel and pastry.',
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
      description: 'A unique fusion of coconut and chocolate, this bar offers a spark of flavor that awakens your taste buds. Perfect for those seeking something extraordinary.',
      benefits: ['Coconut Fusion', 'Chocolate Blend', 'Unique Flavor', 'Premium Quality'],
      stock: 25
    },
  ];

  const product = sweetProducts.find(p => p.id === parseInt(id || '0'));
  
  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111827]">Product Not Found</h1>
          <p className="text-gray-500 mt-2">The sweet you are looking for does not exist.</p>
          <Link to="/sweets" className="inline-block mt-4 bg-[#D4AF37] text-white px-6 py-2 rounded-full hover:bg-[#b8941f] transition">
            Back to Sweets
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * quantity;

  return (
    <div className="bg-[#FFFDF7] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/sweets" className="inline-flex items-center gap-2 text-[#0F766E] hover:text-[#D4AF37] transition mb-6">
          <FaArrowLeft /> Back to Sweets
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Product Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5E7EB]">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-contain bg-white"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x600/D4AF37/FFFFFF?text=' + product.name;
                }}
              />
            </div>
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
              {product.discount}% OFF
            </span>
            <button className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-[#D4AF37] transition">
              <FaHeart className="text-gray-600 hover:text-white" />
            </button>
            <div className="absolute bottom-4 left-4 bg-[#D4AF37] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              ✨ Premium
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-medium">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                ))}
                <span className="text-gray-400 text-xs ml-1">({product.rating})</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#111827]">{product.name}</h1>
            
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-[#D4AF37]">PKR {product.price.toLocaleString()}</span>
              <span className="text-gray-400 line-through text-lg">PKR {product.oldPrice.toLocaleString()}</span>
            </div>

            <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

            {/* Benefits */}
            <div className="mt-6">
              <h3 className="font-semibold text-[#111827] mb-3">✨ Key Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {product.benefits.map((benefit, i) => (
                  <span key={i} className="bg-[#F8FAFC] border border-[#E5E7EB] px-3 py-1 rounded-full text-sm text-gray-600">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* ❌ WEIGHT OPTION REMOVED - Sweets don't have weight options */}

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

            {/* ✅ Action Buttons - Buy Now Clickable */}
            <div className="flex gap-4 mt-8">
              {/* Add to Cart */}
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
                className={`flex-1 bg-[#0F766E] text-white px-8 py-3 rounded-full font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                  product.stock && product.stock > 0
                    ? 'hover:bg-[#065F46]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart /> {product.stock && product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {/* ✅ Buy Now - Clickable */}
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
                className={`bg-[#D4AF37] text-white px-8 py-3 rounded-full font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                  product.stock && product.stock > 0
                    ? 'hover:bg-[#b8941f] cursor-pointer'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart /> {product.stock && product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
              </button>
            </div>

            {/* Stock Status */}
            <div className="mt-4">
              {product.stock && product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm text-green-600 font-medium">In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Delivery Info */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaTruck className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Free Delivery</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaShieldAlt className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Premium Quality</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaLeaf className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-xs text-gray-500 mt-1">100% Natural</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SweetsDetailPage;
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { FaStar, FaHeart, FaShoppingCart, FaArrowLeft, FaTruck, FaShieldAlt, FaLeaf } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;        // ✅ 1kg ki price (Base Price)
  oldPrice: number;     // ✅ Original price (without discount)
  discount: number;
  rating: number;
  category: string;
  image: string;
  description: string;
  benefits: string[];
}

const DryFruitsDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('1kg');

  // ✅ CORRECT PRICE CALCULATION LOGIC
  const calculateWeightPrice = (basePrice: number, weight: string): number => {
    switch(weight) {
      case '250g': {
        // 500g price = (1kg / 2) + 50
        const price500g = (basePrice / 2) + 50;
        // 250g price = (500g / 2) + 50
        return (price500g / 2) + 50;
      }
      case '500g': {
        // 500g = (1kg / 2) + 50
        return (basePrice / 2) + 50;
      }
      case '1kg': {
        // 1kg = Base Price
        return basePrice;
      }
      case '2kg': {
        // 2kg = (1kg * 2) - 150
        return (basePrice * 2) - 150;
      }
      default:
        return basePrice;
    }
  };

  // ✅ All Products with 1kg Reference Price
  const dryProducts: Product[] = [
    { 
      id: 1, 
      name: 'American Almonds Premium', 
      price: 4100,        // ✅ 1kg price
      oldPrice: 4500,
      discount: 9,
      rating: 4.8, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128223/almonds_large_oq4jyx.png',
      description: 'Premium quality American almonds, large size. Rich in vitamin E, magnesium, and healthy fats.',
      benefits: ['Heart Healthy', 'Rich in Protein', 'Vitamin E', 'Brain Food'],
    },
    { 
      id: 2, 
      name: 'American Almonds Medium', 
      price: 3500,
      oldPrice: 3900,
      discount: 10,
      rating: 4.9, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128400/almonds_small_dtsgkf.png',
      description: 'Medium-sized American almonds with a rich, buttery flavor.',
      benefits: ['Heart Healthy', 'Rich in Protein', 'Vitamin E', 'Energy Boost'],
    },
    { 
      id: 3, 
      name: 'Soft Shell Salted Pistachios', 
      price: 4800,
      oldPrice: 5300,
      discount: 9,
      rating: 4.7, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128413/pista_shell_bdm59v.png',
      description: 'Premium soft shell pistachios with a light salt coating.',
      benefits: ['Rich Flavor', 'Antioxidants', 'Heart Healthy', 'Premium Quality'],
    },
    { 
      id: 4, 
      name: 'Roasted Pistachios', 
      price: 7500,
      oldPrice: 8200,
      discount: 9,
      rating: 4.6, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128419/pista_without_shell_ymunmc.png',
      description: 'Roasted pistachios without shell. Perfectly roasted to bring out the natural nutty flavor.',
      benefits: ['Roasted Flavor', 'No Shell', 'Premium Quality', 'Ready to Eat'],
    },
    { 
      id: 5, 
      name: 'Roasted Brown Cashews', 
      price: 4000,
      oldPrice: 4400,
      discount: 9,
      rating: 4.8, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128406/brown_kaju_cu5gvs.png',
      description: 'Rich and creamy roasted brown cashews. Perfectly roasted to enhance their natural buttery flavor.',
      benefits: ['Creamy Texture', 'Roasted Flavor', 'Energy Boost', 'Heart Healthy'],
    },
    { 
      id: 6, 
      name: 'Salted White Cashews', 
      price: 3400,
      oldPrice: 3800,
      discount: 11,
      rating: 4.9, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128463/white_kaju_ssdd1b.png',
      description: 'Premium white cashews with a light salt coating. Creamy, rich, and perfectly salted.',
      benefits: ['Creamy Texture', 'Salted Flavor', 'Rich in Minerals', 'Premium Quality'],
    },
    { 
      id: 7, 
      name: 'Soft Shell Almonds', 
      price: 2400,
      oldPrice: 2700,
      discount: 11,
      rating: 4.8, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128454/soft_shell_almonds_wfd5pr.png',
      description: 'Soft shell almonds that are easy to crack open. Packed with nutrients and a delicious, natural flavor.',
      benefits: ['Easy to Open', 'Rich in Vitamin E', 'Heart Healthy', 'Natural Flavor'],
    },
    { 
      id: 8, 
      name: 'Soft Shell Walnuts', 
      price: 1800,
      oldPrice: 2000,
      discount: 10,
      rating: 4.7, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128425/shell_walnut_djggub.png',
      description: 'Soft shell walnuts that are easy to crack. Rich in omega-3 fatty acids and antioxidants.',
      benefits: ['Brain Food', 'Omega-3', 'Antioxidants', 'Heart Healthy'],
    },
    { 
      id: 9, 
      name: 'Kernel Walnuts (without shell)', 
      price: 3000,
      oldPrice: 3300,
      discount: 9,
      rating: 4.8, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128464/without_shell_walnut_dlgsm1.png',
      description: 'Premium walnut kernels without shell. Ready to eat and packed with nutrients.',
      benefits: ['Ready to Eat', 'Omega-3 Rich', 'Brain Food', 'Antioxidants'],
    },
    { 
      id: 10, 
      name: 'Sundar Khani Raisins', 
      price: 1800,
      oldPrice: 2000,
      discount: 10,
      rating: 4.8, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128446/sundar_khani_raisins_e1ykp8.png',
      description: 'Premium Sundar Khani raisins. Sweet, juicy, and naturally sun-dried.',
      benefits: ['Natural Sweetness', 'Iron Rich', 'Energy Boost', 'Healthy Snack'],
    },
    { 
      id: 11, 
      name: 'Kandhari Raisins', 
      price: 1500,
      oldPrice: 1700,
      discount: 12,
      rating: 4.7, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128421/kandhari_raisins_ncjmwl.png',
      description: 'Sweet and juicy Kandhari raisins. Perfect for snacking, baking, and adding to your favorite dishes.',
      benefits: ['Sweet Flavor', 'Iron Rich', 'Energy Boost', 'Healthy Snack'],
    },
    { 
      id: 12, 
      name: 'Black Raisins', 
      price: 1600,
      oldPrice: 1800,
      discount: 11,
      rating: 4.6, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128398/black_raisins_tyw6al.png',
      description: 'Premium black raisins with a rich, sweet flavor. Naturally sun-dried and packed with nutrients.',
      benefits: ['Rich Flavor', 'Iron Rich', 'Antioxidants', 'Healthy Snack'],
    },
    { 
      id: 13, 
      name: 'Munakka Raisins', 
      price: 1700,
      oldPrice: 1900,
      discount: 11,
      rating: 4.8, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128430/munakka_raisins_dohfbj.png',
      description: 'Premium Munakka raisins. Large, sweet, and juicy. Perfect for snacking and traditional recipes.',
      benefits: ['Large Size', 'Sweet Flavor', 'Iron Rich', 'Energy Boost'],
    },
    { 
      id: 14, 
      name: 'Roasted Chickpeas (without Skin)', 
      price: 1100,
      oldPrice: 1300,
      discount: 15,
      rating: 4.5, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128461/yellow_channa_gmufqp.png',
      description: 'Roasted chickpeas without skin. A healthy and crunchy snack packed with protein and fiber.',
      benefits: ['High Protein', 'High Fiber', 'Crunchy Texture', 'Healthy Snack'],
    },
    { 
      id: 15, 
      name: 'Roasted Brown Chickpeas', 
      price: 950,
      oldPrice: 1150,
      discount: 17,
      rating: 4.4, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128403/brown_channa_diqzhp.png',
      description: 'Roasted brown chickpeas. A nutritious and crunchy snack with a rich, earthy flavor.',
      benefits: ['High Protein', 'Crunchy Texture', 'Healthy Snack', 'Rich Flavor'],
    },
    { 
      id: 16, 
      name: 'Chia Seeds', 
      price: 2500,
      oldPrice: 2800,
      discount: 11,
      rating: 4.8, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128408/chia_seeds_qko4xt.png',
      description: 'Premium chia seeds. Packed with omega-3 fatty acids, fiber, and protein.',
      benefits: ['Omega-3 Rich', 'High Fiber', 'High Protein', 'Superfood'],
    },
    { 
      id: 17, 
      name: 'Pumpkin Seeds (Kaddu Beej)', 
      price: 1900,
      oldPrice: 2100,
      discount: 10,
      rating: 4.7, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128437/pumpkin_seeds_cnft3u.png',
      description: 'Premium pumpkin seeds. Rich in zinc, magnesium, and healthy fats.',
      benefits: ['Rich in Zinc', 'Magnesium Rich', 'Heart Healthy', 'Energy Boost'],
    },
    { 
      id: 18, 
      name: 'Sunflower Seeds', 
      price: 1700,
      oldPrice: 1900,
      discount: 11,
      rating: 4.6, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128454/sunflower_seeds_kts2w9.png',
      description: 'Premium sunflower seeds. Packed with vitamin E, selenium, and healthy fats.',
      benefits: ['Vitamin E Rich', 'Selenium Rich', 'Heart Healthy', 'Healthy Snack'],
    },
    { 
      id: 19, 
      name: 'Flax (Alsi) Seeds', 
      price: 1300,
      oldPrice: 1500,
      discount: 13,
      rating: 4.7, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128398/alsi_seeds_yaxvaz.png',
      description: 'Premium flax seeds. Rich in omega-3 fatty acids, fiber, and lignans.',
      benefits: ['Omega-3 Rich', 'High Fiber', 'Superfood', 'Heart Healthy'],
    },
    { 
      id: 20, 
      name: 'Basil Seeds (Tukh Malanga)', 
      price: 1350,
      oldPrice: 1550,
      discount: 13,
      rating: 4.6, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128397/basil_seeds_khs4ym.png',
      description: 'Premium basil seeds. Known for their cooling properties and digestive benefits.',
      benefits: ['Cooling Properties', 'Digestive Health', 'Nutrient Rich', 'Natural Energy'],
    },
    { 
      id: 21, 
      name: 'Four Seeds (Char Maghaz)', 
      price: 2200,
      oldPrice: 2500,
      discount: 12,
      rating: 4.7, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128408/char_magaz_vabk39.png',
      description: 'Premium four seeds mix (Char Maghaz). A blend of healthy seeds for overall wellness.',
      benefits: ['Nutrient Rich', 'Energy Boost', 'Heart Healthy', 'Premium Blend'],
    },
    { 
      id: 22, 
      name: 'Isphagol Husk', 
      price: 4200,
      oldPrice: 4600,
      discount: 9,
      rating: 4.5, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128427/isphagol_djucq5.png',
      description: 'Premium Isphagol husk. Known for its digestive benefits and high fiber content.',
      benefits: ['High Fiber', 'Digestive Health', 'Natural Supplement', 'Gentle Cleanse'],
    },
    { 
      id: 23, 
      name: 'Dry Coconut (Khopra)', 
      price: 1350,
      oldPrice: 1550,
      discount: 13,
      rating: 4.4, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128407/dry_coconut_bweitq.png',
      description: 'Premium dry coconut (Khopra). Perfect for cooking, baking, and traditional recipes.',
      benefits: ['Healthy Fats', 'Cooking Essential', 'Traditional Use', 'Rich Flavor'],
    },
    { 
      id: 24, 
      name: 'Coconut Powder', 
      price: 1300,
      oldPrice: 1500,
      discount: 13,
      rating: 4.5, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128407/coconut_powder_nvs65m.png',
      description: 'Premium coconut powder. Perfect for cooking, baking, and making delicious coconut-based dishes.',
      benefits: ['Versatile Use', 'Rich Flavor', 'Cooking Essential', 'Healthy Alternative'],
    },
  ];

  const product = dryProducts.find(p => p.id === parseInt(id || '0'));

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111827]">Product Not Found</h1>
          <p className="text-gray-500 mt-2">The dry fruit you are looking for does not exist.</p>
          <Link to="/shop" className="inline-block mt-4 bg-[#D4AF37] text-white px-6 py-2 rounded-full hover:bg-[#b8941f] transition">
            Back to Dry Fruits
          </Link>
        </div>
      </div>
    );
  }

  const weights = ['250g', '500g', '1kg', '2kg'];

  // ✅ Get price based on weight
  const getCurrentPrice = (): number => {
    return Math.round(calculateWeightPrice(product.price, selectedWeight));
  };

  const currentPrice = getCurrentPrice();

  // ✅ Get price for a specific weight
  const getWeightPrice = (weight: string): number => {
    return Math.round(calculateWeightPrice(product.price, weight));
  };

  return (
    <div className="bg-[#FFFDF7] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/shop" className="inline-flex items-center gap-2 text-[#0F766E] hover:text-[#D4AF37] transition mb-6">
          <FaArrowLeft /> Back to Dry Fruits
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5E7EB]">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-cover"
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
            
            {/* ✅ Price Display */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-[#D4AF37]">PKR {currentPrice.toLocaleString()}</span>
              {selectedWeight === '1kg' && product.oldPrice > product.price && (
                <span className="text-gray-400 line-through text-lg">
                  PKR {product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

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

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Weight</label>
              <div className="flex flex-wrap gap-2">
                {weights.map((w) => {
                  const price = getWeightPrice(w);
                  const isDiscount = w === '2kg';
                  
                  return (
                    <button
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition relative ${
                        selectedWeight === w
                          ? 'bg-[#D4AF37] text-white shadow-md'
                          : 'bg-[#F8FAFC] text-gray-600 hover:bg-[#E5E7EB] border border-[#E5E7EB]'
                      }`}
                    >
                      {w}
                      <span className="text-[10px] ml-1 opacity-75">
                        PKR {price.toLocaleString()}
                      </span>
                      {isDiscount && (
                        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">
                          SAVE
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

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

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => addToCart({ 
                  ...product, 
                  price: currentPrice, 
                  weight: selectedWeight,
                  totalPrice: currentPrice * quantity 
                })} 
                className="flex-1 bg-[#0F766E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#065F46] transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button className="bg-[#D4AF37] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#b8941f] transition shadow-lg hover:shadow-xl">
                Buy Now
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-[#E5E7EB] text-center">
                <FaTruck className="text-[#D4AF37] text-xl mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Delivery Pakistan</p>
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

export default DryFruitsDetailPage;
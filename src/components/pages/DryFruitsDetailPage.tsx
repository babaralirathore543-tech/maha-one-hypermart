import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  FaStar, FaHeart, FaShoppingCart, FaArrowLeft, 
  FaTruck, FaShieldAlt, FaLeaf, 
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

// ✅ Product Type
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
  stock: number;
  weightPrices?: {
    '250g'?: number;
    '500g'?: number;
    '1kg'?: number;
    '2kg'?: number;
  };
}

const DryFruitsDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('500g');

  // ✅ All Products Data
  const dryProducts: Product[] = [
    { 
      id: 1, 
      name: 'American Almonds Premium 500gm', 
      price: 2200, 
      oldPrice: 2450, 
      discount: 13, 
      rating: 4.8, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128223/almonds_large_oq4jyx.png',
      description: 'Premium quality American almonds, large size. Rich in vitamin E, magnesium, and healthy fats. Perfect for snacking and cooking.',
      benefits: ['Heart Healthy', 'Rich in Protein', 'Vitamin E', 'Brain Food'],
      stock: 50,
      weightPrices: { '250g': 1200, '500g': 2200, '1kg': 4100, '2kg': 8000 }
    },
    { 
      id: 2, 
      name: 'American Almonds Medium 500gm', 
      price: 1750, 
      oldPrice: 2150, 
      discount: 14, 
      rating: 4.9, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128400/almonds_small_dtsgkf.png',
      description: 'Medium-sized American almonds with a rich, buttery flavor. Packed with nutrients and perfect for everyday snacking.',
      benefits: ['Heart Healthy', 'Rich in Protein', 'Vitamin E', 'Energy Boost'],
      stock: 30,
      weightPrices: { '250g': 1000, '500g': 1750, '1kg': 3500, '2kg': 6800 }
    },
    { 
      id: 3, 
      name: 'Soft Shell Salted Pistachios 500gm', 
      price: 1300, 
      oldPrice: 1600, 
      discount: 16, 
      rating: 4.7, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128413/pista_shell_bdm59v.png',
      description: 'Premium soft shell pistachios with a light salt coating. Easy to open and packed with a rich, nutty flavor.',
      benefits: ['Rich Flavor', 'Antioxidants', 'Heart Healthy', 'Premium Quality'],
      stock: 40,
      weightPrices: { '250g': 750, '500g': 1300, '1kg': 4800, '2kg': 4700 }
    },
    { 
      id: 4, 
      name: 'Roasted Pistachios 500gm', 
      price: 3900, 
      oldPrice: 4500, 
      discount: 13, 
      rating: 4.6, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128419/pista_without_shell_ymunmc.png',
      description: 'Roasted pistachios without shell. Perfectly roasted to bring out the natural nutty flavor. Ready to eat and enjoy.',
      benefits: ['Roasted Flavor', 'No Shell', 'Premium Quality', 'Ready to Eat'],
      stock: 25,
      weightPrices: { '250g': 2100, '500g': 3900, '1kg': 7500, '2kg': 14000 }
    },
    { 
      id: 5, 
      name: 'Roasted Brown Cashews 500gm', 
      price: 2000, 
      oldPrice: 2400, 
      discount: 17, 
      rating: 4.8, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128406/brown_kaju_cu5gvs.png',
      description: 'Rich and creamy roasted brown cashews. Perfectly roasted to enhance their natural buttery flavor. A healthy and delicious snack.',
      benefits: ['Creamy Texture', 'Roasted Flavor', 'Energy Boost', 'Heart Healthy'],
      stock: 35,
      weightPrices: { '250g': 1100, '500g': 2000, '1kg': 4000, '2kg': 7200 }
    },
    { 
      id: 6, 
      name: 'Salted White Cashews 500gm', 
      price: 1800, 
      oldPrice: 2100, 
      discount: 14, 
      rating: 4.9, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128463/white_kaju_ssdd1b.png',
      description: 'Premium white cashews with a light salt coating. Creamy, rich, and perfectly salted for the ultimate snacking experience.',
      benefits: ['Creamy Texture', 'Salted Flavor', 'Rich in Minerals', 'Premium Quality'],
      stock: 20,
      weightPrices: { '250g': 1000, '500g': 1800, '1kg': 3400, '2kg': 6500 }
    },
    { 
      id: 7, 
      name: 'Soft Shell Almonds 500gm', 
      price: 1250, 
      oldPrice: 1500, 
      discount: 17, 
      rating: 4.8, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128454/soft_shell_almonds_wfd5pr.png',
      description: 'Soft shell almonds that are easy to crack open. Packed with nutrients and a delicious, natural flavor.',
      benefits: ['Easy to Open', 'Rich in Vitamin E', 'Heart Healthy', 'Natural Flavor'],
      stock: 60,
      weightPrices: { '250g': 700, '500g': 1250, '1kg': 2400, '2kg': 4500 }
    },
    { 
      id: 8, 
      name: 'Soft Shell Walnuts 500gm', 
      price: 950, 
      oldPrice: 1200, 
      discount: 21, 
      rating: 4.7, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128425/shell_walnut_djggub.png',
      description: 'Soft shell walnuts that are easy to crack. Rich in omega-3 fatty acids and antioxidants. A brain-healthy snack.',
      benefits: ['Brain Food', 'Omega-3', 'Antioxidants', 'Heart Healthy'],
      stock: 45,
      weightPrices: { '250g': 550, '500g': 950, '1kg': 1800, '2kg': 3400 }
    },
    { 
      id: 9, 
      name: 'Kernel Walnuts (without shell) 500gm', 
      price: 1550, 
      oldPrice: 1800, 
      discount: 14, 
      rating: 4.8, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128464/without_shell_walnut_dlgsm1.png',
      description: 'Premium walnut kernels without shell. Ready to eat and packed with nutrients. Perfect for baking and snacking.',
      benefits: ['Ready to Eat', 'Omega-3 Rich', 'Brain Food', 'Antioxidants'],
      stock: 30,
      weightPrices: { '250g': 850, '500g': 1550, '1kg': 3000, '2kg': 5500 }
    },
    { 
      id: 10, 
      name: 'Sundar Khani Raisins 500gm', 
      price: 950, 
      oldPrice: 1200, 
      discount: 21, 
      rating: 4.8, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128446/sundar_khani_raisins_e1ykp8.png',
      description: 'Premium Sundar Khani raisins. Sweet, juicy, and naturally sun-dried. Perfect for snacking and baking.',
      benefits: ['Natural Sweetness', 'Iron Rich', 'Energy Boost', 'Healthy Snack'],
      stock: 80,
      weightPrices: { '250g': 550, '500g': 950, '1kg': 1800, '2kg': 3400 }
    },
    { 
      id: 11, 
      name: 'Kandhari Raisins 500gm', 
      price: 800, 
      oldPrice: 1000, 
      discount: 20, 
      rating: 4.7, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128421/kandhari_raisins_ncjmwl.png',
      description: 'Sweet and juicy Kandhari raisins. Perfect for snacking, baking, and adding to your favorite dishes.',
      benefits: ['Sweet Flavor', 'Iron Rich', 'Energy Boost', 'Healthy Snack'],
      stock: 70,
      weightPrices: { '250g': 450, '500g': 800, '1kg': 1500, '2kg': 2800 }
    },
    { 
      id: 12, 
      name: 'Black Raisins 500gm', 
      price: 850, 
      oldPrice: 1100, 
      discount: 23, 
      rating: 4.6, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128398/black_raisins_tyw6al.png',
      description: 'Premium black raisins with a rich, sweet flavor. Naturally sun-dried and packed with nutrients.',
      benefits: ['Rich Flavor', 'Iron Rich', 'Antioxidants', 'Healthy Snack'],
      stock: 55,
      weightPrices: { '250g': 480, '500g': 850, '1kg': 1600, '2kg': 3000 }
    },
    { 
      id: 13, 
      name: 'Munakka Raisins 500gm', 
      price: 1100, 
      oldPrice: 1400, 
      discount: 21, 
      rating: 4.8, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128430/munakka_raisins_dohfbj.png',
      description: 'Premium Munakka raisins. Large, sweet, and juicy. Perfect for snacking and traditional recipes.',
      benefits: ['Large Size', 'Sweet Flavor', 'Iron Rich', 'Energy Boost'],
      stock: 40,
      weightPrices: { '250g': 600, '500g': 1100, '1kg': 1700, '2kg': 4000 }
    },
    { 
      id: 14, 
      name: 'Roasted Chickpeas (without Skin) 500gm', 
      price: 600, 
      oldPrice: 800, 
      discount: 25, 
      rating: 4.5, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128461/yellow_channa_gmufqp.png',
      description: 'Roasted chickpeas without skin. A healthy and crunchy snack packed with protein and fiber.',
      benefits: ['High Protein', 'High Fiber', 'Crunchy Texture', 'Healthy Snack'],
      stock: 100,
      weightPrices: { '250g': 350, '500g': 600, '1kg': 1100, '2kg': 2100 }
    },
    { 
      id: 15, 
      name: 'Roasted Brown Chickpeas 500gm', 
      price: 500, 
      oldPrice: 700, 
      discount: 29, 
      rating: 4.4, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128403/brown_channa_diqzhp.png',
      description: 'Roasted brown chickpeas. A nutritious and crunchy snack with a rich, earthy flavor.',
      benefits: ['High Protein', 'Crunchy Texture', 'Healthy Snack', 'Rich Flavor'],
      stock: 10,
      weightPrices: { '250g': 300, '500g': 500, '1kg': 950, '2kg': 1800 }
    },
    { 
      id: 16, 
      name: 'Chia Seeds 500gm', 
      price: 1300, 
      oldPrice: 1600, 
      discount: 19, 
      rating: 4.8, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128408/chia_seeds_qko4xt.png',
      description: 'Premium chia seeds. Packed with omega-3 fatty acids, fiber, and protein. Perfect for healthy smoothies and puddings.',
      benefits: ['Omega-3 Rich', 'High Fiber', 'High Protein', 'Superfood'],
      stock: 50,
      weightPrices: { '250g': 700, '500g': 1300, '1kg': 2500, '2kg': 4800 }
    },
    { 
      id: 17, 
      name: 'Pumpkin Seeds (Kaddu Beej) 500gm', 
      price: 1000, 
      oldPrice: 1300, 
      discount: 23, 
      rating: 4.7, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128437/pumpkin_seeds_cnft3u.png',
      description: 'Premium pumpkin seeds. Rich in zinc, magnesium, and healthy fats. A nutritious snack for all ages.',
      benefits: ['Rich in Zinc', 'Magnesium Rich', 'Heart Healthy', 'Energy Boost'],
      stock: 65,
      weightPrices: { '250g': 550, '500g': 1000, '1kg': 1900, '2kg': 3600 }
    },
    { 
      id: 18, 
      name: 'Sunflower Seeds 500gm', 
      price: 900, 
      oldPrice: 1100, 
      discount: 18, 
      rating: 4.6, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128454/sunflower_seeds_kts2w9.png',
      description: 'Premium sunflower seeds. Packed with vitamin E, selenium, and healthy fats. Perfect for snacking.',
      benefits: ['Vitamin E Rich', 'Selenium Rich', 'Heart Healthy', 'Healthy Snack'],
      stock: 75,
      weightPrices: { '250g': 500, '500g': 900, '1kg': 1700, '2kg': 3200 }
    },
    { 
      id: 19, 
      name: 'Flax (Alsi) Seeds 500gm', 
      price: 800, 
      oldPrice: 1000, 
      discount: 20, 
      rating: 4.7, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128398/alsi_seeds_yaxvaz.png',
      description: 'Premium flax seeds. Rich in omega-3 fatty acids, fiber, and lignans. A superfood for overall health.',
      benefits: ['Omega-3 Rich', 'High Fiber', 'Superfood', 'Heart Healthy'],
      stock: 40,
      weightPrices: { '250g': 450, '500g': 800, '1kg': 1300, '2kg': 2800 }
    },
    { 
      id: 20, 
      name: 'Basil Seeds (Tukh Malanga) 500gm', 
      price: 1200, 
      oldPrice: 1500, 
      discount: 20, 
      rating: 4.6, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128397/basil_seeds_khs4ym.png',
      description: 'Premium basil seeds. Known for their cooling properties and digestive benefits. Perfect for refreshing drinks.',
      benefits: ['Cooling Properties', 'Digestive Health', 'Nutrient Rich', 'Natural Energy'],
      stock: 30,
      weightPrices: { '250g': 650, '500g': 1200, '1kg': 1350, '2kg': 4400 }
    },
    { 
      id: 21, 
      name: 'Four Seeds (Char Maghaz) 500gm', 
      price: 1500, 
      oldPrice: 1800, 
      discount: 17, 
      rating: 4.7, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128408/char_magaz_vabk39.png',
      description: 'Premium four seeds mix (Char Maghaz). A blend of healthy seeds for overall wellness and nutrition.',
      benefits: ['Nutrient Rich', 'Energy Boost', 'Heart Healthy', 'Premium Blend'],
      stock: 35,
      weightPrices: { '250g': 800, '500g': 1500, '1kg': 2200, '2kg': 5500 }
    },
    { 
      id: 22, 
      name: 'Isphagol Husk 500gm', 
      price: 700, 
      oldPrice: 900, 
      discount: 22, 
      rating: 4.5, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128427/isphagol_djucq5.png',
      description: 'Premium Isphagol husk. Known for its digestive benefits and high fiber content. A natural health supplement.',
      benefits: ['High Fiber', 'Digestive Health', 'Natural Supplement', 'Gentle Cleanse'],
      stock: 60,
      weightPrices: { '250g': 400, '500g': 700, '1kg': 4200, '2kg': 2500 }
    },
    { 
      id: 23, 
      name: 'Dry Coconut (Khopra) 500gm', 
      price: 600, 
      oldPrice: 800, 
      discount: 25, 
      rating: 4.4, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128407/dry_coconut_bweitq.png',
      description: 'Premium dry coconut (Khopra). Perfect for cooking, baking, and traditional recipes. Rich in healthy fats.',
      benefits: ['Healthy Fats', 'Cooking Essential', 'Traditional Use', 'Rich Flavor'],
      stock: 50,
      weightPrices: { '250g': 350, '500g': 600, '1kg': 1350, '2kg': 2100 }
    },
    { 
      id: 24, 
      name: 'Coconut Powder 500gm', 
      price: 700, 
      oldPrice: 900, 
      discount: 22, 
      rating: 4.5, 
      category: 'Dry Fruits',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128407/coconut_powder_nvs65m.png',
      description: 'Premium coconut powder. Perfect for cooking, baking, and making delicious coconut-based dishes.',
      benefits: ['Versatile Use', 'Rich Flavor', 'Cooking Essential', 'Healthy Alternative'],
      stock: 40,
      weightPrices: { '250g': 400, '500g': 700, '1kg': 1300, '2kg': 2500 }
    },
  ];

  const product = dryProducts.find(p => p.id === parseInt(id || '0'));

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111827]">Product Not Found</h1>
          <p className="text-gray-500 mt-2">The product you are looking for does not exist.</p>
          <Link to="/shop" className="inline-block mt-4 bg-[#D4AF37] text-white px-6 py-2 rounded-full hover:bg-[#b8941f] transition">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const weights = ['250g', '500g', '1kg', '2kg'];

  const getCurrentPrice = (): number => {
    if (product.weightPrices && selectedWeight in product.weightPrices) {
      return product.weightPrices[selectedWeight as keyof typeof product.weightPrices] || product.price;
    }
    return product.price;
  };

  const currentPrice = getCurrentPrice();
  const totalPrice = currentPrice * quantity;

  return (
    <div className="bg-[#FFFDF7] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/shop" className="inline-flex items-center gap-2 text-[#0F766E] hover:text-[#D4AF37] transition mb-6">
          <FaArrowLeft /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Product Images */}
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
              <span className="text-3xl font-bold text-[#D4AF37]">PKR {currentPrice.toLocaleString()}</span>
              <span className="text-gray-400 line-through text-lg">PKR {product.oldPrice.toLocaleString()}</span>
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

            {/* Weight Selector */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Weight</label>
              <div className="flex flex-wrap gap-2">
                {weights.map((w) => {
                  const price = product.weightPrices?.[w as keyof typeof product.weightPrices] || product.price;
                  return (
                    <button
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedWeight === w
                          ? 'bg-[#D4AF37] text-white shadow-md'
                          : 'bg-[#F8FAFC] text-gray-600 hover:bg-[#E5E7EB] border border-[#E5E7EB]'
                      }`}
                    >
                      {w}
                      <span className="text-[10px] ml-1 text-gray-400">
                        PKR {price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#E5E7EB] transition">-</button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#E5E7EB] transition">+</button>
              </div>
            </div>

            {/* ✅ Action Buttons */}
            <div className="flex gap-4 mt-8">
              {/* Add to Cart */}
              <button 
                onClick={() => {
                  addToCart({
                    ...product,
                    price: currentPrice,
                    weight: selectedWeight,
                    quantity: quantity,
                    totalPrice: totalPrice
                  });
                  alert(`✅ ${product.name} added to cart!`);
                }}
                disabled={product.stock === 0}
                className={`flex-1 bg-[#0F766E] text-white px-8 py-3 rounded-full font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                  product.stock > 0
                    ? 'hover:bg-[#065F46]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart /> Add to Cart
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
                    price: currentPrice,
                    weight: selectedWeight,
                    quantity: quantity,
                    totalPrice: totalPrice
                  });
                  
                  window.location.href = '/checkout';
                }}
                disabled={product.stock === 0}
                className={`bg-[#D4AF37] text-white px-8 py-3 rounded-full font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                  product.stock > 0
                    ? 'hover:bg-[#b8941f] cursor-pointer'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart /> Buy Now
              </button>
            </div>

            {/* Delivery Info */}
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
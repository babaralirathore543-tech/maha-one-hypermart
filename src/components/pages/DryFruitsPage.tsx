import { Link } from 'react-router-dom';
import { FaHeart, FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

// ✅ Product Type Interface
interface Product {
  id: number;
  name: string;
  price: number;        // ✅ 1kg ki price (Base Price)
  oldPrice: number;     // ✅ 1kg ki original price
  discount: number;
  rating: number;
  image: string;
  stock: number;
}

const DryFruitsPage = () => {
  const { addToCart } = useCart();

  // ✅ Price Calculation Function (Same as Detail Page)
  const calculateWeightPrice = (basePrice: number, weight: string): number => {
    switch(weight) {
      case '250g': {
        const price500g = (basePrice / 2) + 50;
        return (price500g / 2) + 50;
      }
      case '500g': {
        return (basePrice / 2) + 50;
      }
      case '1kg': {
        return basePrice;
      }
      case '2kg': {
        return (basePrice * 2) - 150;
      }
      default:
        return basePrice;
    }
  };

  // ✅ All Products with 1kg Reference Price
  const products: Product[] = [
    { 
      id: 1, 
      name: 'American Almonds Premium', 
      price: 4100,        // ✅ 1kg price
      oldPrice: 4500,     // ✅ 1kg original price
      discount: 9, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128223/almonds_large_oq4jyx.png',
      stock: 50
    },
    { 
      id: 2, 
      name: 'American Almonds Medium', 
      price: 3500,
      oldPrice: 3900,
      discount: 10, 
      rating: 4.9, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128400/almonds_small_dtsgkf.png',
      stock: 30
    },
    { 
      id: 3, 
      name: 'Soft Shell Salted Pistachios', 
      price: 4800,
      oldPrice: 5300,
      discount: 9, 
      rating: 4.7, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128413/pista_shell_bdm59v.png',
      stock: 40
    },
    { 
      id: 4, 
      name: 'Roasted Pistachios', 
      price: 7500,
      oldPrice: 8200,
      discount: 9, 
      rating: 4.6, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128419/pista_without_shell_ymunmc.png',
      stock: 25
    },
    { 
      id: 5, 
      name: 'Roasted Brown Cashews', 
      price: 4000,
      oldPrice: 4400,
      discount: 9, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128406/brown_kaju_cu5gvs.png',
      stock: 35
    },
    { 
      id: 6, 
      name: 'Salted White Cashews', 
      price: 3400,
      oldPrice: 3800,
      discount: 11, 
      rating: 4.9, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128463/white_kaju_ssdd1b.png',
      stock: 20
    },
    { 
      id: 7, 
      name: 'Soft Shell Almonds', 
      price: 2400,
      oldPrice: 2700,
      discount: 11, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128454/soft_shell_almonds_wfd5pr.png',
      stock: 60
    },
    { 
      id: 8, 
      name: 'Soft Shell Walnuts', 
      price: 1800,
      oldPrice: 2000,
      discount: 10, 
      rating: 4.7, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128425/shell_walnut_djggub.png',
      stock: 45
    },
    { 
      id: 9, 
      name: 'Kernel Walnuts (without shell)', 
      price: 3000,
      oldPrice: 3300,
      discount: 9, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128464/without_shell_walnut_dlgsm1.png',
      stock: 30
    },
    { 
      id: 10, 
      name: 'Sundar Khani Raisins', 
      price: 1800,
      oldPrice: 2000,
      discount: 10, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128446/sundar_khani_raisins_e1ykp8.png',
      stock: 80
    },
    { 
      id: 11, 
      name: 'Kandhari Raisins', 
      price: 1500,
      oldPrice: 1700,
      discount: 12, 
      rating: 4.7, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128421/kandhari_raisins_ncjmwl.png',
      stock: 70
    },
    { 
      id: 12, 
      name: 'Black Raisins', 
      price: 1600,
      oldPrice: 1800,
      discount: 11, 
      rating: 4.6, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128398/black_raisins_tyw6al.png',
      stock: 55
    },
    { 
      id: 13, 
      name: 'Munakka Raisins', 
      price: 1700,
      oldPrice: 1900,
      discount: 11, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128430/munakka_raisins_dohfbj.png',
      stock: 40
    },
    { 
      id: 14, 
      name: 'Roasted Chickpeas (without Skin)', 
      price: 1100,
      oldPrice: 1300,
      discount: 15, 
      rating: 4.5, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128461/yellow_channa_gmufqp.png',
      stock: 100
    },
    { 
      id: 15, 
      name: 'Roasted Brown Chickpeas', 
      price: 950,
      oldPrice: 1150,
      discount: 17, 
      rating: 4.4, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128403/brown_channa_diqzhp.png',
      stock: 10
    },
    { 
      id: 16, 
      name: 'Chia Seeds', 
      price: 2500,
      oldPrice: 2800,
      discount: 11, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128408/chia_seeds_qko4xt.png',
      stock: 50
    },
    { 
      id: 17, 
      name: 'Pumpkin Seeds (Kaddu Beej)', 
      price: 1900,
      oldPrice: 2100,
      discount: 10, 
      rating: 4.7, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128437/pumpkin_seeds_cnft3u.png',
      stock: 65
    },
    { 
      id: 18, 
      name: 'Sunflower Seeds', 
      price: 1700,
      oldPrice: 1900,
      discount: 11, 
      rating: 4.6, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128454/sunflower_seeds_kts2w9.png',
      stock: 75
    },
    { 
      id: 19, 
      name: 'Flax (Alsi) Seeds', 
      price: 1300,
      oldPrice: 1500,
      discount: 13, 
      rating: 4.7, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128398/alsi_seeds_yaxvaz.png',
      stock: 40
    },
    { 
      id: 20, 
      name: 'Basil Seeds (Tukh Malanga)', 
      price: 1350,
      oldPrice: 1550,
      discount: 13, 
      rating: 4.6, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128397/basil_seeds_khs4ym.png',
      stock: 30
    },
    { 
      id: 21, 
      name: 'Four Seeds (Char Maghaz)', 
      price: 2200,
      oldPrice: 2500,
      discount: 12, 
      rating: 4.7, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128408/char_magaz_vabk39.png',
      stock: 35
    },
    { 
      id: 22, 
      name: 'Isphagol Husk', 
      price: 4200,
      oldPrice: 4600,
      discount: 9, 
      rating: 4.5, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128427/isphagol_djucq5.png',
      stock: 60
    },
    { 
      id: 23, 
      name: 'Dry Coconut (Khopra)', 
      price: 1350,
      oldPrice: 1550,
      discount: 13, 
      rating: 4.4, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128407/dry_coconut_bweitq.png',
      stock: 50
    },
    { 
      id: 24, 
      name: 'Coconut Powder', 
      price: 1300,
      oldPrice: 1500,
      discount: 13, 
      rating: 4.5, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128407/coconut_powder_nvs65m.png',
      stock: 40
    }
  ];

  return (
    <div className="bg-[#FFFDF7] py-6 sm:py-8 md:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] text-center mb-4 sm:mb-6 md:mb-8">
          🥜 Premium <span className="text-[#D4AF37]">Dry Fruits</span>
        </h1>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {products.map((p) => {
            const isInStock = p.stock > 0;
            
            // ✅ Calculate 500gm price (display on product card)
            const displayPrice = Math.round(calculateWeightPrice(p.price, '500g'));
            const displayOldPrice = Math.round(calculateWeightPrice(p.oldPrice, '500g'));
            const displayDiscount = Math.round(((displayOldPrice - displayPrice) / displayOldPrice) * 100);
            
            return (
              <Link to={`/dry-product/${p.id}`} key={p.id} className="block min-w-0">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#E5E7EB] hover:-translate-y-1 cursor-pointer group h-full">
                  <div className="relative">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/400x300/D4AF37/FFFFFF?text=${p.name}`;
                      }}
                    />
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full">
                      -{displayDiscount}%
                    </span>
                    <button 
                      className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white/90 rounded-full p-1.5 sm:p-2 hover:bg-[#D4AF37] transition"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('❤️ Added to Wishlist!');
                      }}
                    >
                      <FaHeart className="text-sm sm:text-base text-gray-600 hover:text-white" />
                    </button>
                  </div>
                  
                  <div className="p-2 sm:p-3 md:p-4">
                    <div className="flex text-[#D4AF37] text-[10px] sm:text-sm">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(p.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                      ))}
                      <span className="text-gray-400 text-[8px] sm:text-xs ml-1">({p.rating})</span>
                    </div>
                    <h3 className="font-semibold text-[#111827] text-xs sm:text-sm md:text-base lg:text-lg line-clamp-2 mt-0.5 sm:mt-1">
                      {p.name}
                    </h3>
                    
                    {/* ✅ Display 500gm Price with "500g" label */}
                    <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                      <span className="text-[#D4AF37] font-bold text-sm sm:text-base md:text-lg lg:text-xl">
                        PKR {displayPrice.toLocaleString()}
                      </span>
                      <span className="text-gray-400 line-through text-[10px] sm:text-sm">
                        PKR {displayOldPrice.toLocaleString()}
                      </span>
                      <span className="text-[8px] sm:text-[10px] text-gray-500 bg-gray-100 px-1 sm:px-1.5 py-0.5 rounded">
                        500g
                      </span>
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
                          // ✅ Add 500gm product to cart
                          addToCart({
                            ...p,
                            price: displayPrice,
                            weight: '500g'
                          });
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

export default DryFruitsPage;
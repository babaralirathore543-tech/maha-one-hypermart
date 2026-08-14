import { Link } from 'react-router-dom';
import { FaHeart, FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const DryFruitsPage = () => {
  const { addToCart } = useCart();

  const products = [
    { 
      id: 1, 
      name: 'American Almonds Premium 500gm', 
      price: 2000, 
      oldPrice: 2300, 
      discount: 20, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128223/almonds_large_oq4jyx.png',
      stock: 50
    },
    { 
      id: 2, 
      name: 'American Almonds Medium 500gm', 
      price: 1850, 
      oldPrice: 2150, 
      discount: 22, 
      rating: 4.9, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128400/almonds_small_dtsgkf.png',
      stock: 30
    },
    { 
      id: 3, 
      name: 'Soft Shell Salted Pistachios 500gm', 
      price: 2600, 
      oldPrice: 3100, 
      discount: 16, 
      rating: 4.7, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128413/pista_shell_bdm59v.png',
      stock: 40
    },
    { 
      id: 4, 
      name: 'Roasted Pistachios 500gm', 
      price: 3900, 
      oldPrice: 4500, 
      discount: 13, 
      rating: 4.6, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128419/pista_without_shell_ymunmc.png',
      stock: 25
    },
    { 
      id: 5, 
      name: 'Roasted Brown Cashews 500gm', 
      price: 2000, 
      oldPrice: 2400, 
      discount: 17, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128406/brown_kaju_cu5gvs.png',
      stock: 35
    },
    { 
      id: 6, 
      name: 'Salted White Cashews 500gm', 
      price: 1800, 
      oldPrice: 2100, 
      discount: 14, 
      rating: 4.9, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128463/white_kaju_ssdd1b.png',
      stock: 20
    },
    { 
      id: 7, 
      name: 'Soft Shell Almonds 500gm', 
      price: 1250, 
      oldPrice: 1500, 
      discount: 17, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128454/soft_shell_almonds_wfd5pr.png',
      stock: 60
    },
    { 
      id: 8, 
      name: 'Soft Shell Walnuts 500gm', 
      price: 950, 
      oldPrice: 1200, 
      discount: 21, 
      rating: 4.7, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128425/shell_walnut_djggub.png',
      stock: 45
    },
    { 
      id: 9, 
      name: 'Kerne Walnuts (without shell) 500gm', 
      price: 1550, 
      oldPrice: 1800, 
      discount: 14, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128464/without_shell_walnut_dlgsm1.png',
      stock: 30
    },
    { 
      id: 10, 
      name: 'Sundar Khani Raisins 500gm', 
      price: 950, 
      oldPrice: 1200, 
      discount: 21, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128446/sundar_khani_raisins_e1ykp8.png',
      stock: 80
    },
    { 
      id: 11, 
      name: 'Kandhari Raisins 500gm', 
      price: 800, 
      oldPrice: 1000, 
      discount: 20, 
      rating: 4.7, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128421/kandhari_raisins_ncjmwl.png',
      stock: 70
    },
    { 
      id: 12, 
      name: 'Black Raisins 500gm', 
      price: 850, 
      oldPrice: 1100, 
      discount: 23, 
      rating: 4.6, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128398/black_raisins_tyw6al.png',
      stock: 55
    },
    { 
      id: 13, 
      name: 'Munakka Raisins 500gm', 
      price: 1100, 
      oldPrice: 1400, 
      discount: 21, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128430/munakka_raisins_dohfbj.png',
      stock: 40
    },
    { 
      id: 14, 
      name: 'Roasted Chickpeas (without Skin) 500gm', 
      price: 600, 
      oldPrice: 800, 
      discount: 25, 
      rating: 4.5, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128461/yellow_channa_gmufqp.png',
      stock: 100
    },
    { 
      id: 15, 
      name: 'Roasted Brown Chickpeas 500gm', 
      price: 500, 
      oldPrice: 700, 
      discount: 29, 
      rating: 4.4, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128403/brown_channa_diqzhp.png',
      stock: 10
    },
    { 
      id: 16, 
      name: 'Chia Seeds 500gm', 
      price: 1300, 
      oldPrice: 1600, 
      discount: 19, 
      rating: 4.8, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128408/chia_seeds_qko4xt.png',
      stock: 50
    },
    { 
      id: 17, 
      name: 'Pumpkin Seeds (Kaddu Beej) 500gm', 
      price: 1000, 
      oldPrice: 1300, 
      discount: 23, 
      rating: 4.7, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128437/pumpkin_seeds_cnft3u.png',
      stock: 65
    },
    { 
      id: 18, 
      name: 'Sunflower Seeds 500gm', 
      price: 900, 
      oldPrice: 1100, 
      discount: 18, 
      rating: 4.6, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128454/sunflower_seeds_kts2w9.png',
      stock: 75
    },
    { 
      id: 19, 
      name: 'Flax (Alsi) Seeds 500gm', 
      price: 800, 
      oldPrice: 1000, 
      discount: 20, 
      rating: 4.7, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128398/alsi_seeds_yaxvaz.png',
      stock: 40
    },
    { 
      id: 20, 
      name: 'Basil Seeds (Tukh Malanga) 500gm', 
      price: 1200, 
      oldPrice: 1500, 
      discount: 20, 
      rating: 4.6, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128397/basil_seeds_khs4ym.png',
      stock: 30
    },
    { 
      id: 21, 
      name: 'Four Seeds (Char Maghaz) 500gm', 
      price: 1500, 
      oldPrice: 1800, 
      discount: 17, 
      rating: 4.7, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128408/char_magaz_vabk39.png',
      stock: 35
    },
    { 
      id: 22, 
      name: 'Isphagol Husk 500gm', 
      price: 700, 
      oldPrice: 900, 
      discount: 22, 
      rating: 4.5, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128427/isphagol_djucq5.png',
      stock: 60
    },
    { 
      id: 23, 
      name: 'Dry Coconut (Khopra) 500gm', 
      price: 600, 
      oldPrice: 800, 
      discount: 25, 
      rating: 4.4, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128407/dry_coconut_bweitq.png',
      stock: 50
    },
    { 
      id: 24, 
      name: 'Coconut Powder 500gm', 
      price: 700, 
      oldPrice: 900, 
      discount: 22, 
      rating: 4.5, 
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1786128407/coconut_powder_nvs65m.png',
      stock: 40
    }
  ];

  return (
    <div className="bg-[#FFFDF7] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-4xl font-bold text-[#111827] text-center mb-8">
          🥜 Premium <span className="text-[#D4AF37]">Dry Fruits</span>
        </h1>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => {
            const isInStock = p.stock > 0;
            
            return (
              <Link to={`/dry-product/${p.id}`} key={p.id}>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#E5E7EB] hover:-translate-y-1 cursor-pointer group">
                  <div className="relative">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/400x300/D4AF37/FFFFFF?text=${p.name}`;
                      }}
                    />
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      -{p.discount}%
                    </span>
                    <button 
                      className="absolute bottom-3 right-3 bg-white/90 rounded-full p-2 hover:bg-[#D4AF37] transition"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('❤️ Added to Wishlist!');
                      }}
                    >
                      <FaHeart className="text-gray-600 hover:text-white" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex text-[#D4AF37] text-sm">
                      {[...Array(5)].map((_, i) => (<FaStar key={i} />))}
                      <span className="text-gray-400 text-xs ml-1">({p.rating})</span>
                    </div>
                    <h3 className="font-semibold text-[#111827] text-lg line-clamp-2">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[#D4AF37] font-bold text-xl">PKR {p.price}</span>
                      <span className="text-gray-400 line-through text-sm">PKR {p.oldPrice}</span>
                    </div>
                    
                    {/* ✅ Blinking Green Dot - In Stock */}
                    <div className="mt-2 flex items-center gap-1.5">
                      <span 
                        className={`w-2 h-2 rounded-full ${isInStock ? 'bg-green-500 animate-blink' : 'bg-red-500'}`}
                      ></span>
                      <span className={`text-xs font-medium ${isInStock ? 'text-green-600' : 'text-red-500'}`}>
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if (isInStock) {
                          addToCart(p);
                        } else {
                          alert('❌ This product is out of stock!');
                        }
                      }}
                      disabled={!isInStock}
                      className={`w-full mt-4 px-4 py-2.5 rounded-full text-sm font-medium transition flex items-center justify-center gap-2 ${
                        isInStock
                          ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <FaShoppingCart />
                      {isInStock ? 'Add to Cart' : 'Out of Stock'}
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
// src/components/pages/SweetsPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { db, collection, getDocs, query, where } from '../../config/firebase';

interface SweetProduct {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  category: string;
  subCategory: string;
  image: string;
  description: string;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
}

const SweetsPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<SweetProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching sweets...');
        
        const productsRef = collection(db, 'products');
        const q = query(
          productsRef,
          where('category', '==', 'sweets')
        );
        
        const snapshot = await getDocs(q);
        console.log('📦 Total sweets found:', snapshot.size);
        
        // 🔥 HAR EK PRODUCT KA DATA CONSOLE MEIN DEKHEIN
        snapshot.forEach(doc => {
          console.log('📄 Product ID:', doc.id);
          console.log('📄 Product Data:', doc.data());
        });
        
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SweetProduct[];
        
        setProducts(productsData);
        
      } catch (error) {
        console.error('❌ Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSweets();
  }, []);

  const getCategories = () => {
    const categories = products.map(p => p.subCategory || 'Sweets');
    return ['All', ...new Set(categories)];
  };

  const categories = getCategories();
  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => (p.subCategory || 'Sweets') === filter);

  const getDiscountedPrice = (product: SweetProduct) => {
    if (product.discount && product.discount > 0) {
      return product.price - (product.price * product.discount / 100);
    }
    return product.price;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#D4AF37] mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading sweets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] py-6 sm:py-8 md:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link to="/" className="flex items-center gap-1 sm:gap-2 text-[#0F766E] dark:text-[#14b8a6] hover:text-[#D4AF37] transition text-sm sm:text-base">
              <FaArrowLeft /> Back
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] dark:text-white">
              🍬 <span className="text-[#D4AF37]">Sweet</span> Collection
            </h1>
          </div>
          <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
            {products.length} Products
          </span>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
          Premium sweets made with love and the finest ingredients.
        </p>

        {categories.length > 1 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  filter === cat
                    ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30'
                    : 'bg-white dark:bg-[#1F2937] text-gray-600 dark:text-gray-300 hover:bg-[#F8FAFC] dark:hover:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍬</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">No sweets found</h3>
            <p className="text-gray-400 mt-2">Check console for details</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {filteredProducts.map((product) => {
              const isInStock = product.stock > 0;
              const discountedPrice = getDiscountedPrice(product);
              
              return (
                <Link to={`/sweet-product/${product.id}`} key={product.id} className="block min-w-0">
                  <div className="bg-white dark:bg-[#1F2937] rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-purple-500 hover:border-purple-600 hover:-translate-y-1 cursor-pointer group h-full">
                    <div className="relative overflow-hidden bg-[#F5F3FF] dark:bg-[#1F2937] aspect-square">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x400/D4AF37/FFFFFF?text=' + encodeURIComponent(product.name);
                        }}
                      />
                      {product.discount > 0 && (
                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg z-10">
                          -{product.discount}%
                        </span>
                      )}
                      {product.isNew && (
                        <span className="absolute top-2 left-12 sm:top-3 sm:left-14 bg-green-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg z-10">
                          NEW
                        </span>
                      )}
                      {product.isBestSeller && (
                        <span className="absolute top-2 left-20 sm:top-3 sm:left-24 bg-[#D4AF37] text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg z-10">
                          ★ BEST
                        </span>
                      )}
                      <button 
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 rounded-full p-1.5 sm:p-2 hover:bg-[#D4AF37] transition shadow-md z-10"
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
                          <FaStar key={i} className={i < Math.floor(product.rating || 4.5) ? 'text-[#D4AF37]' : 'text-gray-300 dark:text-gray-600'} />
                        ))}
                        <span className="text-gray-400 dark:text-gray-500 text-[8px] sm:text-xs ml-0.5 sm:ml-1">({product.rating || 4.5})</span>
                      </div>
                      <h3 className="font-semibold text-[#111827] dark:text-white text-xs sm:text-sm md:text-base line-clamp-2 mt-0.5 sm:mt-1 min-h-[2rem] sm:min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {product.subCategory || 'Sweets'}
                      </p>
                      <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
                        <span className="text-[#D4AF37] font-bold text-sm sm:text-base md:text-lg">
                          Rs. {discountedPrice.toLocaleString()}
                        </span>
                        {product.oldPrice > product.price && (
                          <span className="text-gray-400 dark:text-gray-500 line-through text-[10px] sm:text-sm">
                            Rs. {product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-1 sm:mt-2 flex items-center gap-1 sm:gap-1.5">
                        <span 
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isInStock ? 'bg-green-500 animate-blink' : 'bg-red-500'}`}
                        ></span>
                        <span className={`text-[8px] sm:text-xs font-medium ${isInStock ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                          {isInStock ? `${product.stock} in stock` : 'Out of Stock'}
                        </span>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          if (isInStock) {
                            addToCart({ ...product, price: discountedPrice });
                            alert(`✅ ${product.name} added to cart!`);
                          } else {
                            alert('❌ This product is out of stock!');
                          }
                        }}
                        disabled={!isInStock}
                        className={`w-full mt-2 sm:mt-3 md:mt-4 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition flex items-center justify-center gap-1 sm:gap-2 ${
                          isInStock
                            ? 'bg-[#0F766E] text-white hover:bg-[#065F46] shadow-md hover:shadow-lg'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
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
        )}
      </div>
    </div>
  );
};

export default SweetsPage;
// src/components/pages/DryFruitsPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { db, collection, getDocs } from '../../config/firebase';

interface DryFruitsProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  category: string;
  subCategory: string;
  image: string;
  stock: number;
  description?: string;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  isOrganic?: boolean;
  isPremium?: boolean;
}

const DryFruitsPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<DryFruitsProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ SIMPLE FETCH — NO WHERE FILTER (Fetch all, filter in JS)
  useEffect(() => {
    const fetchDryFruits = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching all products...');
        
        // ✅ Get ALL products
        const querySnapshot = await getDocs(collection(db, 'products'));
        console.log('📦 Total products:', querySnapshot.size);
        
        // ✅ Filter in JavaScript
        const allProducts: DryFruitsProduct[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // ✅ Check if category is dryfruits or dry-fruits
          if (data.category === 'dryfruits' || data.category === 'dry-fruits') {
            allProducts.push({
              id: doc.id,
              name: data.name || 'Unnamed',
              price: data.price || 0,
              oldPrice: data.oldPrice || 0,
              discount: data.discount || 0,
              rating: data.rating || 4.5,
              category: data.category || 'dryfruits',
              subCategory: data.subCategory || 'Dry Fruits',
              image: data.image || data.images?.[0] || 'https://via.placeholder.com/400x400/D4AF37/FFFFFF?text=Dry+Fruit',
              stock: data.stock || (data.inStock ? 10 : 0),
              description: data.description || '',
              isNew: data.isNew || false,
              isFeatured: data.isFeatured || false,
              isBestSeller: data.isBestSeller || false,
              isOnSale: data.isOnSale || false,
              isOrganic: data.isOrganic || false,
              isPremium: data.isPremium || false,
            });
          }
        });
        
        console.log('🥜 Dry fruits found:', allProducts.length);
        setProducts(allProducts);
        
      } catch (error) {
        console.error('❌ Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDryFruits();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-[#FFFDF7] dark:bg-[#111827]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#D4AF37] mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading dry fruits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] pt-16 sm:pt-6 md:pt-8 lg:pt-12 pb-6 sm:pb-8 md:pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link to="/" className="flex items-center gap-1 sm:gap-2 text-[#0F766E] dark:text-[#14b8a6] hover:text-[#D4AF37] transition text-sm sm:text-base">
              <FaArrowLeft /> Back
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] dark:text-white">
              🥜 <span className="text-[#D4AF37]">Dry Fruits</span> Collection
            </h1>
          </div>
          <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
            {products.length} Products
          </span>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
          Premium quality dry fruits sourced from the finest farms. Fresh, natural, and packed with nutrition.
        </p>

        {/* ✅ Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-5xl sm:text-6xl mb-4">🥜</div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-600 dark:text-gray-300">No dry fruits found</h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {products.map((product) => {
              const isInStock = product.stock > 0;
              const discountedPrice = product.discount && product.discount > 0 
                ? product.price - (product.price * product.discount / 100) 
                : product.price;
              
              return (
                <Link to={`/dry-product/${product.id}`} key={product.id} className="block min-w-0 group">
                  <div className="bg-white dark:bg-[#1F2937] rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:-translate-y-1 h-full flex flex-col">
                    
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-square bg-[#F8FAFC] dark:bg-[#1F2937] rounded-2xl m-2 sm:m-3 border-4 border-amber-500 shadow-md shadow-amber-500/20">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x400/D4AF37/FFFFFF?text=' + encodeURIComponent(product.name);
                        }}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {product.discount && product.discount > 0 && (
                          <span className="bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg border-2 border-white/50">
                            -{product.discount}%
                          </span>
                        )}
                        {product.isNew && (
                          <span className="bg-green-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg border-2 border-white/50">
                            NEW
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="bg-[#D4AF37] text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg border-2 border-white/50">
                            ★ BEST
                          </span>
                        )}
                      </div>
                      
                      {/* Wishlist */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          alert('❤️ Added to Wishlist!');
                        }}
                        className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full p-1.5 sm:p-2 hover:bg-[#D4AF37] transition shadow-md border-2 border-amber-300"
                      >
                        <FaHeart className="text-xs sm:text-sm text-gray-600 group-hover:text-white transition" />
                      </button>
                      
                      {/* Category */}
                      {product.subCategory && (
                        <div className="absolute bottom-2 right-2">
                          <span className="text-[8px] sm:text-[10px] bg-black/60 backdrop-blur text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full capitalize border border-amber-300/30">
                            {product.subCategory}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-2.5 sm:p-3 md:p-4 flex-1 flex flex-col">
                      
                      {/* Rating */}
                      <div className="flex items-center gap-0.5 text-[#D4AF37] text-[8px] sm:text-[10px]">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.floor(product.rating || 4.5) ? 'text-[#D4AF37]' : 'text-gray-300 dark:text-gray-600'} />
                        ))}
                        <span className="text-gray-400 dark:text-gray-500 ml-0.5 text-[8px] sm:text-[10px]">({product.rating || 4.5})</span>
                      </div>

                      {/* Name */}
                      <h3 className="font-semibold text-[#111827] dark:text-white text-xs sm:text-sm md:text-base mt-0.5 line-clamp-2 group-hover:text-[#D4AF37] transition min-h-[2rem] sm:min-h-[2.5rem]">
                        {product.name}
                      </h3>

                      {/* Stock */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2 h-2 rounded-full ${isInStock ? 'bg-green-500 animate-blink' : 'bg-red-500'}`}></span>
                        <span className={`text-[10px] sm:text-xs font-medium ${isInStock ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                          {isInStock ? `In Stock (${product.stock})` : 'Out of Stock'}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                        <span className="text-[#D4AF37] font-bold text-sm sm:text-base md:text-lg">
                          Rs. {discountedPrice.toLocaleString()}
                        </span>
                        {product.oldPrice && product.oldPrice > discountedPrice && (
                          <span className="text-gray-400 dark:text-gray-500 line-through text-[10px] sm:text-xs">
                            Rs. {product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (isInStock) {
                            addToCart({ ...product, price: discountedPrice, quantity: 1 });
                            alert(`✅ ${product.name} added to cart!`);
                          } else {
                            alert('❌ This product is out of stock!');
                          }
                        }}
                        disabled={!isInStock}
                        className={`w-full mt-2 sm:mt-3 px-2 py-1.5 sm:py-2 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium transition flex items-center justify-center gap-1 sm:gap-2 ${
                          isInStock
                            ? 'bg-[#0F766E] text-white hover:bg-[#065F46] active:scale-95'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <FaShoppingCart className="text-[8px] sm:text-[10px] md:text-xs" />
                        <span>{isInStock ? 'Add to Cart' : 'Out of Stock'}</span>
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Results Count */}
        {products.length > 0 && (
          <div className="text-center text-xs text-gray-400 mt-4 sm:mt-6">
            Showing {products.length} products
          </div>
        )}
      </div>
    </div>
  );
};

export default DryFruitsPage;
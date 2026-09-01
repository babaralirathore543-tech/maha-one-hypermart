// src/components/pages/DryFruitsPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaStar, FaShoppingCart, FaSpinner } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { db, collection, getDocs, query, where } from '../../config/firebase';

// ✅ Product Type Interface - Matching AdminDryFruitsForm
interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  image: string;
  stock: number;
  subCategory: string;
  weightVariants: WeightVariant[];
  weight: string;
  weightUnit: string;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  status: string;
  category: string;
}

// ✅ Weight Variant Interface
interface WeightVariant {
  id: string;
  weight: string;
  weightUnit: string;
  price: number;
  oldPrice: number;
  discount: number;
  stock: number;
  sku: string;
}

const DryFruitsPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  // ✅ Fetch dry fruits from Firebase
  useEffect(() => {
    const fetchDryFruits = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔵 Fetching dry fruits from Firebase...');
        
        const q = query(
          collection(db, 'products'),
          where('category', 'in', ['dryfruits', 'dry-fruits']),
          where('status', '==', 'active')
        );
        
        const snapshot = await getDocs(q);
        console.log('🔵 Documents found:', snapshot.size);
        
        if (snapshot.empty) {
          console.log('⚠️ No dry fruits found in database');
          setProducts([]);
        } else {
          const productsData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || '',
              price: data.price || 0,
              oldPrice: data.oldPrice || 0,
              discount: data.discount || 0,
              rating: data.rating || 4.5,
              image: data.image || '',
              stock: data.stock || 0,
              subCategory: data.subCategory || '',
              weightVariants: data.weightVariants || [],
              weight: data.weight || '',
              weightUnit: data.weightUnit || 'g',
              isNew: data.isNew || false,
              isFeatured: data.isFeatured || false,
              isBestSeller: data.isBestSeller || false,
              isOnSale: data.isOnSale || false,
              status: data.status || 'active',
              category: data.category || 'dryfruits'
            };
          });
          
          console.log('✅ Products loaded:', productsData.length);
          setProducts(productsData);
        }
      } catch (error: any) {
        console.error('❌ Error fetching dry fruits:', error);
        setError(error.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDryFruits();
  }, []);

  // ✅ Handle image error
  const handleImageError = (productId: string) => {
    setImageError(prev => ({ ...prev, [productId]: true }));
  };

  // ✅ Get best display variant (usually 500g or first variant)
  const getDisplayVariant = (product: Product): WeightVariant | null => {
    if (!product.weightVariants || product.weightVariants.length === 0) {
      return null;
    }
    
    const fiveHundred = product.weightVariants.find(v => v.weight === '500');
    if (fiveHundred) return fiveHundred;
    
    const any500 = product.weightVariants.find(v => v.weight.includes('500'));
    if (any500) return any500;
    
    return product.weightVariants[0];
  };

  // ✅ Get display discount percentage
  const getDisplayDiscount = (product: Product) => {
    const variant = getDisplayVariant(product);
    if (variant && variant.discount > 0) return variant.discount;
    if (product.discount > 0) return product.discount;
    
    const displayPrice = variant?.price || product.price;
    const displayOldPrice = variant?.oldPrice || product.oldPrice;
    if (displayOldPrice > displayPrice) {
      return Math.round(((displayOldPrice - displayPrice) / displayOldPrice) * 100);
    }
    return 0;
  };

  // ✅ Get display price
  const getDisplayPrice = (product: Product) => {
    const variant = getDisplayVariant(product);
    return variant?.price || product.price;
  };

  // ✅ Get display old price
  const getDisplayOldPrice = (product: Product) => {
    const variant = getDisplayVariant(product);
    return variant?.oldPrice || product.oldPrice;
  };

  // ✅ Get display weight label
  const getDisplayWeightLabel = (product: Product) => {
    const variant = getDisplayVariant(product);
    if (variant) {
      return `${variant.weight}${variant.weightUnit}`;
    }
    if (product.weight) {
      return `${product.weight}${product.weightUnit || 'g'}`;
    }
    return '';
  };

  // ✅ Get variant stock
  const getVariantStock = (product: Product) => {
    const variant = getDisplayVariant(product);
    return variant?.stock || product.stock || 0;
  };

  // Show error if any
  if (error) {
    return (
      <div className="bg-[#FFFDF7] dark:bg-[#111827] py-6 sm:py-8 md:py-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">Error loading products</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-[#0F766E] text-white px-6 py-2 rounded-full hover:bg-[#065F46] transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] py-6 sm:py-8 md:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] dark:text-white text-center mb-4 sm:mb-6 md:mb-8">
          🥜 Premium <span className="text-[#D4AF37]">Dry Fruits</span>
        </h1>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FaSpinner className="animate-spin text-4xl text-[#D4AF37] mx-auto" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading dry fruits...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🥜</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">No dry fruits found</h3>
            <p className="text-gray-400 mt-2">Check back later for premium dry fruits</p>
            <Link to="/admin/dryfruits/add" className="inline-block mt-4 bg-[#D4AF37] text-white px-6 py-2 rounded-full hover:bg-[#b8941f] transition">
              Add Products
            </Link>
          </div>
        ) : (
          /* ✅ Products Grid - Fashion Page Style */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {products.map((p) => {
              const isInStock = getVariantStock(p) > 0;
              const displayPrice = getDisplayPrice(p);
              const displayOldPrice = getDisplayOldPrice(p);
              const displayDiscount = getDisplayDiscount(p);
              const displayWeight = getDisplayWeightLabel(p);
              const hasError = imageError[p.id];
              
              return (
                <Link to={`/dry-product/${p.id}`} key={p.id} className="group">
                  <div className="bg-white dark:bg-[#1F2937] rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:-translate-y-1 h-full flex flex-col">
                    
                    {/* ✅ Image Container - Like Fashion Page (Purple Border + Rounded Corners) */}
                    <div className="relative overflow-hidden aspect-square bg-[#F8FAFC] dark:bg-[#1F2937] rounded-2xl m-2 sm:m-3 border-4 border-purple-500 shadow-md shadow-purple-500/20">
                      <img
                        src={hasError ? `https://via.placeholder.com/400x400/D4AF37/FFFFFF?text=${p.name}` : p.image}
                        alt={p.name}
                        className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 rounded-xl p-2`}
                        onError={() => handleImageError(p.id)}
                        loading="lazy"
                      />
                      
                      {/* Badges Row - Image par */}
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {displayDiscount > 0 && (
                          <span className="bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg border-2 border-white/50">
                            -{displayDiscount}%
                          </span>
                        )}
                        {p.isNew && (
                          <span className="bg-green-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg border-2 border-white/50">
                            NEW
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="bg-[#D4AF37] text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg border-2 border-white/50">
                            ★ BEST
                          </span>
                        )}
                      </div>
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          alert('❤️ Added to Wishlist!');
                        }}
                        className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full p-1.5 sm:p-2 hover:bg-[#D4AF37] transition shadow-md border-2 border-purple-300"
                      >
                        <FaHeart className="text-xs sm:text-sm text-gray-600 group-hover:text-white transition" />
                      </button>
                      
                      {/* Category Badge on Image */}
                      {p.subCategory && (
                        <div className="absolute bottom-2 right-2">
                          <span className="text-[8px] sm:text-[10px] bg-black/60 backdrop-blur text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full capitalize border border-purple-300/30">
                            🥜 {p.subCategory}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ✅ Product Info - Card Style */}
                    <div className="p-2.5 sm:p-3 md:p-4 flex-1 flex flex-col">
                      
                      {/* Rating */}
                      <div className="flex items-center gap-0.5 text-[#D4AF37] text-[8px] sm:text-[10px]">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.floor(p.rating || 0) ? 'text-[#D4AF37]' : 'text-gray-300 dark:text-gray-600'} />
                        ))}
                        <span className="text-gray-400 dark:text-gray-500 ml-0.5 text-[8px] sm:text-[10px]">({p.rating || 0})</span>
                      </div>

                      {/* Name */}
                      <h3 className="font-semibold text-[#111827] dark:text-white text-xs sm:text-sm md:text-base mt-0.5 line-clamp-2 group-hover:text-[#D4AF37] transition">
                        {p.name}
                      </h3>

                      {/* SubCategory */}
                      <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {p.subCategory || 'Dry Fruits'}
                      </p>

                      {/* ✅ STOCK INDICATOR - Blinking Green Dot */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2 h-2 rounded-full ${isInStock ? 'bg-green-500 animate-blink' : 'bg-red-500'}`}></span>
                        <span className={`text-[10px] sm:text-xs font-medium ${isInStock ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                          {isInStock ? `In Stock (${getVariantStock(p)})` : 'Out of Stock'}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                        <span className="text-[#D4AF37] font-bold text-sm sm:text-base md:text-lg">
                          Rs. {displayPrice.toLocaleString()}
                        </span>
                        {displayOldPrice > displayPrice && (
                          <span className="text-gray-400 dark:text-gray-500 line-through text-[10px] sm:text-xs">
                            Rs. {displayOldPrice.toLocaleString()}
                          </span>
                        )}
                        {displayWeight && (
                          <span className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                            {displayWeight}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (isInStock) {
                            const variant = getDisplayVariant(p);
                            addToCart({
                              ...p,
                              price: displayPrice,
                              weight: displayWeight,
                              variantId: variant?.id,
                              quantity: 1
                            });
                            alert(`✅ ${p.name} added to cart!`);
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

                      {/* On Sale Badge */}
                      {p.isOnSale && (
                        <div className="mt-1 text-[8px] sm:text-[10px] text-red-500 font-medium text-center animate-pulse">
                          🔥 On Sale!
                        </div>
                      )}
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

export default DryFruitsPage;
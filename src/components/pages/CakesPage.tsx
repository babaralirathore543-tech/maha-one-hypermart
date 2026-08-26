// src/components/pages/CakesPage.tsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaStar, FaHeart, FaShoppingCart, 
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { db, collection, getDocs } from '../../config/firebase';

// ✅ Product Interface - Matching Admin Product Form
interface CakesProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discountPrice?: number;
  discount?: number;
  rating: number;
  category: string;
  subCategory?: string;
  subSubCategory?: string;
  productId: string;
  image: string;
  images: string[];
  colorImages?: { [key: string]: string[] };
  sizes: string[];
  colors: string[];
  stock: number;
  description: string;
  material?: string;
  careInstructions?: string;
  isNew: boolean;
  isFeatured: boolean;
  // Cake specific fields
  flavor?: string;
  weight?: string;
  calories?: number;
  preparationTime?: string;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

const CakesPage = () => {
  const { addToCart } = useCart();
  
  // ✅ State
  const [products, setProducts] = useState<CakesProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFlavor, setSelectedFlavor] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // ✅ Categories based on Admin Product Form
  const categories = [
    { id: 'all', label: 'All Cakes' },
    { id: 'celebration', label: '🎉 Celebration' },
    { id: 'birthday', label: '🎂 Birthday' },
    { id: 'wedding', label: '💍 Wedding' },
    { id: 'custom', label: '🎨 Custom' },
  ];

  // ✅ Fetch Products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData: CakesProduct[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // ✅ Filter only cakes category
          if (data.category === 'cakes') {
            productsData.push({
              id: doc.id,
              name: data.name || '',
              price: data.price || 0,
              oldPrice: data.oldPrice || 0,
              discountPrice: data.discountPrice || 0,
              discount: data.discount || data.discountPrice || 0,
              rating: data.rating || 0,
              category: data.category || 'cakes',
              subCategory: data.subCategory || '',
              subSubCategory: data.subSubCategory || '',
              productId: data.productId || '',
              image: data.image || '',
              images: data.images || [],
              colorImages: data.colorImages || {},
              sizes: data.sizes || [],
              colors: data.colors || [],
              stock: data.stock || 0,
              description: data.description || '',
              material: data.material || '',
              careInstructions: data.careInstructions || '',
              isNew: data.isNew || false,
              isFeatured: data.isFeatured || false,
              flavor: data.flavor || '',
              weight: data.weight || '',
              calories: data.calories || 0,
              preparationTime: data.preparationTime || '',
              isVegetarian: data.isVegetarian || false,
              isGlutenFree: data.isGlutenFree || false,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            });
          }
        });
        
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching cakes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Get all flavors from products
  const allFlavors = [...new Set(products.flatMap(p => p.colors || []))];

  // ✅ Filter Logic
  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.subCategory === selectedCategory)
    .filter(p => selectedFlavor === 'all' || (p.colors && p.colors.includes(selectedFlavor)))
    .sort((a, b) => {
      if (sortBy === 'popular') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
      return 0;
    });

  // ✅ Get price with discount
  const getDiscountedPrice = (product: CakesProduct) => {
    if (product.discountPrice && product.discountPrice < product.price) {
      return product.discountPrice;
    }
    if (product.discount && product.discount > 0) {
      return product.price - (product.price * product.discount / 100);
    }
    return product.price;
  };

  // ✅ Get discount percentage
  const getDiscountPercent = (product: CakesProduct) => {
    if (product.discount) return product.discount;
    if (product.discountPrice && product.discountPrice < product.price) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#D4AF37] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cakes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF7] py-6 sm:py-8 md:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827]">
            🎂 Premium <span className="text-[#D4AF37]">Cakes</span>
          </h1>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Delicious homemade cakes baked fresh daily. Available in various sizes and flavors.
          </p>
          {/* Karachi Only Badge */}
          <div className="inline-flex items-center gap-2 mt-3 bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 rounded-full border border-[#D4AF37]/20">
            <FaMapMarkerAlt className="text-sm" />
            <span className="text-sm font-medium">📍 Currently Available in Karachi Only</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
          {categories.map(cat => {
            const count = products.filter(p => cat.id === 'all' || p.subCategory === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-[#D4AF37] text-white shadow-md'
                    : 'bg-[#F8FAFC] text-gray-600 hover:bg-[#E5E7EB] border border-[#E5E7EB]'
                }`}
              >
                {cat.label}
                <span className="ml-1 text-xs opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm border border-[#E5E7EB]">
          <div className="flex flex-wrap items-center gap-3">
            {/* Flavor Filter */}
            <select
              value={selectedFlavor}
              onChange={(e) => setSelectedFlavor(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-[#E5E7EB] text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Flavors</option>
              {allFlavors.map(flavor => (
                <option key={flavor} value={flavor}>{flavor}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-[#E5E7EB] text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Discount</option>
            </select>
          </div>

          <span className="text-sm text-gray-500">
            {filteredProducts.length} cakes
          </span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎂</div>
            <h3 className="text-xl font-semibold text-gray-600">No cakes found</h3>
            <p className="text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const finalPrice = getDiscountedPrice(product);
              const discountPercent = getDiscountPercent(product);
              const isInStock = product.stock > 0;
              
              return (
                <Link to={`/cakes/${product.id}`} key={product.id}>
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#E5E7EB] hover:-translate-y-1 group">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/400x400/D4AF37/FFFFFF?text=${product.name}`;
                        }}
                      />
                      {/* Discount Badge */}
                      {discountPercent > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{discountPercent}%
                        </span>
                      )}
                      {/* New Badge */}
                      {product.isNew && (
                        <span className="absolute top-2 left-14 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          alert('❤️ Added to Wishlist!');
                        }}
                        className="absolute top-2 right-2 bg-white/90 rounded-full p-2 hover:bg-[#D4AF37] transition"
                      >
                        <FaHeart className="text-gray-600 hover:text-white" />
                      </button>
                      {/* Featured Badge */}
                      {product.isFeatured && (
                        <span className="absolute bottom-2 right-2 bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded-full">
                          ★ Featured
                        </span>
                      )}
                      {/* Stock Badge */}
                      <div className="absolute bottom-2 left-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm ${
                          isInStock ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'
                        }`}>
                          {isInStock ? `In Stock (${product.stock})` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4">
                      {/* Rating */}
                      <div className="flex items-center gap-1 text-[#D4AF37] text-xs">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                        ))}
                        <span className="text-gray-400 text-[10px] ml-1">({product.rating})</span>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-semibold text-[#111827] text-sm md:text-base line-clamp-2 mt-1">
                        {product.name}
                      </h3>

                      {/* Product ID */}
                      {product.productId && (
                        <p className="text-[10px] text-gray-400 font-mono">{product.productId}</p>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[#D4AF37] font-bold text-sm md:text-lg">
                          PKR {finalPrice.toLocaleString()}
                        </span>
                        {product.oldPrice && product.oldPrice > finalPrice && (
                          <span className="text-gray-400 line-through text-xs">
                            PKR {product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Flavor/Color */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.colors.slice(0, 3).map(color => (
                            <span key={color} className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E5E7EB] text-gray-500">
                              {color}
                            </span>
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-[10px] text-gray-400">+{product.colors.length - 3}</span>
                          )}
                        </div>
                      )}

                      {/* Sizes */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.sizes.slice(0, 3).map(size => (
                            <span key={size} className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E5E7EB] text-gray-500">
                              {size}
                            </span>
                          ))}
                          {product.sizes.length > 3 && (
                            <span className="text-[10px] text-gray-400">+{product.sizes.length - 3}</span>
                          )}
                        </div>
                      )}

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (isInStock) {
                            addToCart({ 
                              ...product, 
                              price: finalPrice,
                              quantity: 1 
                            });
                            alert(`✅ ${product.name} added to cart!`);
                          } else {
                            alert('❌ This product is out of stock!');
                          }
                        }}
                        disabled={!isInStock}
                        className={`w-full mt-2 px-3 py-2 rounded-full text-xs font-medium transition flex items-center justify-center gap-2 ${
                          isInStock
                            ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <FaShoppingCart /> {isInStock ? 'Order Now' : 'Out of Stock'}
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

export default CakesPage;
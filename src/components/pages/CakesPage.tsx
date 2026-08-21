import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  FaStar, FaHeart, FaShoppingCart, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

// ✅ Product Interface
interface CakesProduct {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  category: 'celebration' | 'birthday' | 'wedding' | 'custom';
  image: string;
  images: string[];
  sizes: number[];
  flavors: string[];
  stock: number;
  description: string;
  ingredients: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

const CakesPage = () => {
  const { addToCart } = useCart();
  
  // ✅ State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFlavor, setSelectedFlavor] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // ✅ All Cakes Products
  const products: CakesProduct[] = [
    
    
  ];

  // ✅ Filter Logic
  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => selectedFlavor === 'all' || p.flavors.includes(selectedFlavor))
    .sort((a, b) => {
      if (sortBy === 'popular') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'discount') return b.discount - a.discount;
      return 0;
    });

  // ✅ Categories
  const categories = [
    { id: 'all', label: 'All Cakes' },
    { id: 'celebration', label: '🎉 Celebration' },
    { id: 'birthday', label: '🎂 Birthday' },
    { id: 'wedding', label: '💍 Wedding' },
    { id: 'custom', label: '🎨 Custom' },
  ];

  const allFlavors = [...new Set(products.flatMap(p => p.flavors))];

  return (
    <div className="bg-[#FFFDF7] py-6 sm:py-8 md:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827]">
            🎂 Premium <span className="text-[#D4AF37]">Cakes</span>
          </h1>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Delicious homemade cakes baked fresh daily. Available in 1lb to 5lb sizes.
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
            const count = products.filter(p => cat.id === 'all' || p.category === cat.id).length;
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
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
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                  {product.isNew && (
                    <span className="absolute top-2 left-14 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      NEW
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      alert('❤️ Added to Wishlist!');
                    }}
                    className="absolute top-2 right-2 bg-white/90 rounded-full p-2 hover:bg-[#D4AF37] transition"
                  >
                    <FaHeart className="text-gray-600 hover:text-white" />
                  </button>
                  {product.isFeatured && (
                    <span className="absolute bottom-2 right-2 bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded-full">
                      ★ Featured
                    </span>
                  )}
                </div>

                <div className="p-3 sm:p-4">
                  <div className="flex items-center gap-1 text-[#D4AF37] text-xs">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                    ))}
                    <span className="text-gray-400 text-[10px] ml-1">({product.rating})</span>
                  </div>

                  <h3 className="font-semibold text-[#111827] text-sm md:text-base line-clamp-2 mt-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#D4AF37] font-bold text-sm md:text-lg">
                      PKR {product.price.toLocaleString()}
                    </span>
                    <span className="text-gray-400 line-through text-xs">
                      PKR {product.oldPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Sizes */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.sizes.map(size => (
                      <span key={size} className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E5E7EB] text-gray-500">
                        {size}lb
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({ ...product, quantity: 1 });
                    }}
                    className="w-full mt-2 bg-[#0F766E] text-white px-3 py-2 rounded-full text-xs font-medium hover:bg-[#065F46] transition flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart /> Order Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600">No cakes found</h3>
            <p className="text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CakesPage;
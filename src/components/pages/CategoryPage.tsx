import { useParams, Link } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { addToCart } = useCart();

  // ============================================================
  // ALL PRODUCTS WITH CATEGORIES
  // ============================================================
  const allProducts = [
    // Almonds
    { id: 1, name: 'Premium Almonds', price: 1200, oldPrice: 1500, discount: 20, rating: 4.8, category: 'Almonds', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop' },
    { id: 2, name: 'Organic Almonds', price: 1400, oldPrice: 1700, discount: 18, rating: 4.9, category: 'Almonds', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop' },
    { id: 3, name: 'Roasted Almonds', price: 1300, oldPrice: 1600, discount: 19, rating: 4.7, category: 'Almonds', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop' },
    // Cashews
    { id: 4, name: 'Premium Cashews', price: 1400, oldPrice: 1800, discount: 22, rating: 4.9, category: 'Cashews', image: 'https://images.unsplash.com/photo-1598114004903-2d4e1d5d8fa2?w=400&h=400&fit=crop' },
    { id: 5, name: 'Roasted Cashews', price: 1600, oldPrice: 2000, discount: 20, rating: 4.8, category: 'Cashews', image: 'https://images.unsplash.com/photo-1598114004903-2d4e1d5d8fa2?w=400&h=400&fit=crop' },
    // Pistachios
    { id: 6, name: 'Iranian Pistachios', price: 1800, oldPrice: 2300, discount: 21, rating: 4.7, category: 'Pistachios', image: 'https://images.unsplash.com/photo-1587923623986-c6d34e9a286b?w=400&h=400&fit=crop' },
    { id: 7, name: 'Premium Pistachios', price: 2000, oldPrice: 2500, discount: 20, rating: 4.8, category: 'Pistachios', image: 'https://images.unsplash.com/photo-1587923623986-c6d34e9a286b?w=400&h=400&fit=crop' },
    // Walnuts
    { id: 8, name: 'California Walnuts', price: 1600, oldPrice: 2000, discount: 20, rating: 4.6, category: 'Walnuts', image: 'https://images.unsplash.com/photo-1582320130174-bce5cf11b865?w=400&h=400&fit=crop' },
    { id: 9, name: 'Organic Walnuts', price: 1800, oldPrice: 2200, discount: 18, rating: 4.8, category: 'Walnuts', image: 'https://images.unsplash.com/photo-1582320130174-bce5cf11b865?w=400&h=400&fit=crop' },
    // Raisins
    { id: 10, name: 'Afghani Raisins', price: 800, oldPrice: 1000, discount: 20, rating: 4.8, category: 'Raisins', image: 'https://images.unsplash.com/photo-1596003906949-67221c37965c?w=400&h=400&fit=crop' },
    { id: 11, name: 'Organic Raisins', price: 900, oldPrice: 1100, discount: 18, rating: 4.9, category: 'Raisins', image: 'https://images.unsplash.com/photo-1596003906949-67221c37965c?w=400&h=400&fit=crop' },
    // Dates
    { id: 12, name: 'Ajwa Dates', price: 900, oldPrice: 1200, discount: 25, rating: 4.9, category: 'Dates', image: 'https://images.unsplash.com/photo-1587311669205-5b87dbb3b9b3?w=400&h=400&fit=crop' },
    { id: 13, name: 'Medjool Dates', price: 1100, oldPrice: 1400, discount: 21, rating: 4.8, category: 'Dates', image: 'https://images.unsplash.com/photo-1587311669205-5b87dbb3b9b3?w=400&h=400&fit=crop' },
    // Figs
    { id: 14, name: 'Dried Figs', price: 1100, oldPrice: 1400, discount: 21, rating: 4.7, category: 'Figs', image: 'https://images.unsplash.com/photo-1587311669205-5b87dbb3b9b3?w=400&h=400&fit=crop' },
    { id: 15, name: 'Organic Figs', price: 1300, oldPrice: 1600, discount: 19, rating: 4.8, category: 'Figs', image: 'https://images.unsplash.com/photo-1587311669205-5b87dbb3b9b3?w=400&h=400&fit=crop' },
    // Mixed Nuts
    { id: 16, name: 'Mixed Dry Fruits', price: 2500, oldPrice: 3000, discount: 16, rating: 4.8, category: 'Mixed Nuts', image: 'https://images.unsplash.com/photo-1596383787855-1f7a7e121e10?w=400&h=400&fit=crop' },
    { id: 17, name: 'Premium Mixed Nuts', price: 2800, oldPrice: 3400, discount: 18, rating: 4.9, category: 'Mixed Nuts', image: 'https://images.unsplash.com/photo-1596383787855-1f7a7e121e10?w=400&h=400&fit=crop' },
  ];

  // ============================================================
  // FILTER PRODUCTS - Case Insensitive
  // ============================================================
  const categoryProducts = allProducts.filter(
    product => product.category.toLowerCase() === categoryName?.toLowerCase()
  );

  const displayNames: { [key: string]: string } = {
    'almonds': 'Almonds',
    'cashews': 'Cashews',
    'pistachios': 'Pistachios',
    'walnuts': 'Walnuts',
    'raisins': 'Raisins',
    'dates': 'Dates',
    'figs': 'Dried Figs',
    'mixed-nuts': 'Mixed Nuts'
  };

  const displayName = displayNames[categoryName?.toLowerCase() || ''] || categoryName;

  return (
    <div className="bg-[#FFFDF7] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button & Title */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="flex items-center gap-2 text-[#0F766E] hover:text-[#D4AF37] transition">
            <FaArrowLeft /> Back to Home
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#111827]">
            {displayName || 'Category'}
          </h1>
          <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-sm">
            {categoryProducts.length} Products
          </span>
        </div>

        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categoryProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#E5E7EB] hover:-translate-y-1">
                <div className="relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    -{product.discount}%
                  </span>
                  <button className="absolute top-3 right-3 bg-white/90 rounded-full p-2 hover:bg-[#D4AF37] transition">
                    <FaHeart className="text-gray-600 hover:text-white" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                    ))}
                    <span className="text-gray-400 text-xs ml-1">({product.rating})</span>
                  </div>
                  <h3 className="font-semibold text-[#111827] text-sm">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[#D4AF37] font-bold">PKR {product.price}</span>
                    <span className="text-gray-400 line-through text-sm">PKR {product.oldPrice}</span>
                  </div>
                  {/* ✅ Add to Cart Button with working functionality */}
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full mt-3 bg-[#0F766E] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#065F46] transition flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart className="text-xs" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found in "{displayName}" category.</p>
            <Link to="/" className="inline-block mt-4 text-[#D4AF37] hover:underline">Back to Home</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
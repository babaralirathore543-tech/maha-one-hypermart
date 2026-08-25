import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaStar, FaHeart, FaShoppingCart, FaMale, FaFemale, FaChild } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

// ✅ Product Interface
interface FashionProduct {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  category: 'men' | 'women' | 'kids' | 'accessories' | 'watches';
  subCategory: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  description: string;
  material: string;
  careInstructions: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

const FashionPage = () => {
  const { addToCart } = useCart();
  
  // ✅ State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // ✅ All Fashion Products (with Cloudinary URLs)
  const fashionProducts: FashionProduct[] = [
    // ==================== 👩 WOMEN ====================
    {
      id: 101,
      name: 'Black Queen - Embroidered Shamoz Silk Suit',
      price: 4250,
      oldPrice: 4950,
      discount: 10,
      rating: 4.8,
      category: 'women',
      subCategory: 'Unstiched',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787461517/Gemini_Generated_Image_lneqw1lneqw1lneq_bkwrs8.jpg',
      images: [],
      sizes: ['One Size'],
      colors: ['Black'],
      stock: 10,
      description: '',
      material: '',
      careInstructions: '.'
    },
    {
      id: 102,
      name: 'TYE & DYE Suit - 3-Piece Embroidered Shamoze Silk Suit',
      price: 4190,
      oldPrice: 5100,
      discount: 18,
      rating: 4.9,
      category: 'women',
      subCategory: 'Unstiched',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583325/1787569011956_iltiu9.jpg',
      images: [],
      sizes: ['One Size'],
      colors: ['Green'],
      stock: 10,
      description: '',
      material: '',
      careInstructions: '.'
    },
    {
      id: 103,
      name: 'AGHA NOOR Unstitched Replica - Embroidered Suit',
      price: 3299,
      oldPrice: 4150,
      discount: 21,
      rating: 4.8,
      category: 'women',
      subCategory: 'Unstiched',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787583885/1787583699344_ki0lze.jpg',
      images: [],
      sizes: ['One Size'],
      colors: ['Green'],
      stock: 10,
      description: '',
      material: '',
      careInstructions: '.'
    },
    {
      id: 104,
      name: 'MARIA B Exclusive Heavy Embroidered Saree',
      price: 6250,
      oldPrice: 7500,
      discount: 17,
      rating: 4.8,
      category: 'women',
      subCategory: 'Sarees',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787650742/1787649270496_m30x38.jpg',
      images: [],
      sizes: ['One Size'],
      colors: ['Pink'],
      stock: 15,
      description: '',
      material: '',
      careInstructions: '.'
    },
    
    // -- Women Accessories
    {
      id: 209,
      name: '0ne Carat Zircon Locket Set',
      price: 1650,
      oldPrice: 1900,
      discount: 19,
      rating: 4.8,
      category: 'women',
      subCategory: 'accessories',
      image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787209274/zircon_locket_black_hfodez.jpg',
      images: [],
      sizes: ['One Size'],
      colors: ['Green', 'Black', 'Red', 'Blue'],
      stock: 15,
      description: 'Beautiful 1 Carat Zircon Locket Set with elegant design.',
      material: 'Zircon with Alloy Setting',
      careInstructions: 'Wipe with soft cloth. Keep in jewelry box..'
    },
  ];

  // ✅ Get unique subcategories for each category
  const getSubcategories = (category: string) => {
    const products = category === 'all' 
      ? fashionProducts 
      : fashionProducts.filter(p => p.category === category);
    
    const subs = [...new Set(products.map(p => p.subCategory))];
    return subs;
  };

  // ✅ Filter Logic
  const filteredProducts = fashionProducts
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => selectedSubCategory === 'all' || p.subCategory === selectedSubCategory)
    .filter(p => selectedSize === 'all' || p.sizes.includes(selectedSize))
    .filter(p => selectedColor === 'all' || p.colors.includes(selectedColor))
    .sort((a, b) => {
      if (sortBy === 'popular') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'discount') return b.discount - a.discount;
      return 0;
    });

  // ✅ Get all sizes & colors for filters
  const allSizes = [...new Set(fashionProducts.flatMap(p => p.sizes))];
  const allColors = [...new Set(fashionProducts.flatMap(p => p.colors))];

  // ✅ Category tabs with counts
  const categories = [
    { id: 'all', label: 'All', icon: null },
    { id: 'men', label: 'Men', icon: <FaMale /> },
    { id: 'women', label: 'Women', icon: <FaFemale /> },
    { id: 'kids', label: 'Kids', icon: <FaChild /> },
    { id: 'accessories', label: 'Accessories', icon: null },
  ];

  // ✅ Subcategory icons mapping
  const subCategoryIcons: Record<string, string> = {
    shirts: '👔',
    kurta: '👕',
    jeans: '👖',
    tshirts: '👕',
    lawn: '👗',
    dupatta: '🧣',
    dresses: '👗',
    accessories: '👜',
    sunglasses: '🕶️',
    luxury: '⌚',
    smart: '⌚',
    casual: '⌚'
  };

  return (
    // ✅ FIXED: Added pt-16 for mobile search bar
    <div className="bg-[#FFFDF7] pt-16 sm:pt-6 md:pt-8 lg:pt-12 pb-6 sm:pb-8 md:pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        
        {/* ✅ Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827]">
            👗 Fashion <span className="text-[#D4AF37]">Collection</span>
          </h1>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Discover the latest trends in ethnic wear, casual wear, and accessories.
          </p>
        </div>

        {/* ✅ Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
          {categories.map(cat => {
            const count = fashionProducts.filter(p => cat.id === 'all' || p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedSubCategory('all');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-1.5 ${(
                  selectedCategory === cat.id
                    ? 'bg-[#D4AF37] text-white shadow-md'
                    : 'bg-[#F8FAFC] text-gray-600 hover:bg-[#E5E7EB] border border-[#E5E7EB]'
                )}`}
              >
                {cat.icon}
                {cat.label}
                <span className="ml-1 text-xs opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* ✅ Subcategory Tabs */}
        {selectedCategory !== 'all' && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${(
                selectedSubCategory === 'all'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]'
                  : 'bg-[#F8FAFC] text-gray-500 hover:bg-[#E5E7EB] border border-[#E5E7EB]'
              )}`}
            >
              All
            </button>
            {getSubcategories(selectedCategory).map(sub => {
              const count = fashionProducts.filter(p => p.subCategory === sub).length;
              const icon = subCategoryIcons[sub] || '📦';
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition capitalize flex items-center gap-1 ${(
                    selectedSubCategory === sub
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]'
                      : 'bg-[#F8FAFC] text-gray-500 hover:bg-[#E5E7EB] border border-[#E5E7EB]'
                  )}`}
                >
                  {icon} {sub}
                  <span className="ml-1 text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ✅ Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm border border-[#E5E7EB]">
          <div className="flex flex-wrap items-center gap-3">
            {/* Size Filter */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-[#E5E7EB] text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Sizes</option>
              {allSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>

            {/* Color Filter */}
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-[#E5E7EB] text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Colors</option>
              {allColors.map(color => (
                <option key={color} value={color}>{color}</option>
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
            {filteredProducts.length} products
          </span>
        </div>

        {/* ✅ Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <Link to={`/fashion/${product.id}`} key={product.id}>
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
                  
                  {/* Badges */}
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
                  
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Only {product.stock} left
                    </span>
                  )}
                  
                  {product.isFeatured && (
                    <span className="absolute bottom-2 right-2 bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded-full">
                      ★ Featured
                    </span>
                  )}
                </div>

                <div className="p-3 sm:p-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[#D4AF37] text-xs">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                    ))}
                    <span className="text-gray-400 text-[10px] ml-1">({product.rating})</span>
                  </div>

                  {/* Name */}
                  <h3 className="font-semibold text-[#111827] text-sm md:text-base line-clamp-2 mt-1">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#D4AF37] font-bold text-sm md:text-lg">
                      PKR {product.price.toLocaleString()}
                    </span>
                    <span className="text-gray-400 line-through text-xs">
                      PKR {product.oldPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* ✅ STOCK INDICATOR */}
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {product.stock > 0 ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-green-600 font-medium">
                          In Stock ({product.stock} available)
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        <span className="text-[10px] text-red-500 font-medium">Out of Stock</span>
                      </>
                    )}
                  </div>

                  {/* Subcategory Badge */}
                  <span className="inline-block mt-1 text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E5E7EB] text-gray-500 capitalize">
                    {product.subCategory}
                  </span>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (product.stock > 0) {
                        addToCart({ ...product, quantity: 1 });
                      } else {
                        alert('❌ This product is out of stock!');
                      }
                    }}
                    disabled={product.stock === 0}
                    className={`w-full mt-2 bg-[#0F766E] text-white px-3 py-2 rounded-full text-xs font-medium transition flex items-center justify-center gap-2 ${(
                      product.stock > 0
                        ? 'hover:bg-[#065F46]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    )}`}
                  >
                    <FaShoppingCart /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ✅ No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600">No products found</h3>
            <p className="text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FashionPage;
// src/components/pages/FashionPage.tsx
import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaStar, FaHeart, FaShoppingCart, FaMale, FaFemale, FaChild, 
  FaFilter, FaTimes, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { db, collection, getDocs, query, where } from '../../config/firebase';

// ✅ Product Interface - Matching Admin Product Form
interface FashionProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discountPrice?: number;
  discount?: number;
  rating: number;
  category: string;
  gender?: string;
  productType?: string;
  subCategory: string;
  subSubCategory: string;
  style?: string;
  productId: string;
  image: string;
  images: string[];
  colorImages?: { [key: string]: string[] };
  sizes: string[];
  colors: string[];
  stock: number;
  description: string;
  shortDescription?: string;
  material?: string;
  careInstructions?: string;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  status?: string;
  createdAt?: any;
  updatedAt?: any;
}

// ✅ Category Icons Mapping
const categoryIcons: Record<string, string> = {
  'clothing': '👗',
  'footwear': '👠',
  'bags': '👜',
  'accessories': '💎',
  'unstitched': '🧵',
  'ready-to-wear': '👔',
  'sarees': '🥻',
  'abayas': '🧕',
  'nightwear': '🌙',
  'heels': '👠',
  'flats': '👟',
  'slippers': '🩴',
  'sandals': '👡',
  'khussa': '👞',
  'sneakers': '👟',
  'hand-bags': '👜',
  'shoulder-bags': '👜',
  'tote-bags': '👜',
  'crossbody-bags': '👜',
  'clutches': '👛',
  'wallets': '👛',
  'jewellery': '💍',
  'watches': '⌚',
  'sunglasses': '🕶️',
  'scarves-hijabs': '🧣',
  'hair-accessories': '🎀',
  'shirts': '👔',
  't-shirts': '👕',
  'jeans': '👖',
  'kurta': '👕',
  'trousers': '👖',
  'suits': '🤵',
  'formal-shoes': '👞',
  'casual-shoes': '👟',
  'backpacks': '🎒',
  'messenger-bags': '💼',
  'briefcases': '💼',
  'belts': '🔗',
  'ties': '👔',
  'boys': '👦',
  'girls': '👧',
  'baby': '👶',
  'dresses': '👗',
  'frocks': '👗',
  'kurti': '👕',
  'lawn': '🌿',
  'onesies': '👶',
  'sleepwear': '🌙',
  'hats': '🧢'
};

// ✅ Gender Icons
const genderIcons: Record<string, string> = {
  'women': '👩',
  'men': '👨',
  'kids': '🧒',
  'unisex': '👤'
};

const FashionPage = () => {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  
  // ✅ Get filters from URL
  const urlGender = searchParams.get('gender');
  const urlCategory = searchParams.get('category');
  
  // ✅ State
  const [products, setProducts] = useState<FashionProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<FashionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState<string>(urlGender || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || 'all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  // ✅ Fetch Products from Firebase with filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // ✅ Build query based on URL filters
        let q;
        const productsRef = collection(db, 'products');
        
        if (urlGender) {
          q = query(
            productsRef,
            where('category', '==', 'fashion'),
            where('gender', '==', urlGender)
          );
        } else if (urlCategory) {
          q = query(
            productsRef,
            where('category', '==', 'fashion'),
            where('productType', '==', urlCategory)
          );
        } else {
          q = query(
            productsRef,
            where('category', '==', 'fashion')
          );
        }
        
        const querySnapshot = await getDocs(q);
        const productsData: FashionProduct[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          productsData.push({
            id: doc.id,
            name: data.name || '',
            price: data.price || 0,
            oldPrice: data.oldPrice || 0,
            discountPrice: data.discountPrice || 0,
            discount: data.discount || data.discountPrice || 0,
            rating: data.rating || 0,
            category: data.category || 'fashion',
            gender: data.gender || '',
            productType: data.productType || '',
            subCategory: data.subCategory || '',
            subSubCategory: data.subSubCategory || '',
            style: data.style || '',
            productId: data.productId || '',
            image: data.image || '',
            images: data.images || [],
            colorImages: data.colorImages || {},
            sizes: data.sizes || [],
            colors: data.colors || [],
            stock: data.stock || 0,
            description: data.description || '',
            shortDescription: data.shortDescription || '',
            material: data.material || '',
            careInstructions: data.careInstructions || '',
            isNew: data.isNew || false,
            isFeatured: data.isFeatured || false,
            isBestSeller: data.isBestSeller || false,
            isOnSale: data.isOnSale || false,
            status: data.status || 'active',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        });
        
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error fetching fashion products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [urlGender, urlCategory]);

  // ✅ Get unique categories, sizes & colors from filtered products
  const allCategories = [...new Set(products.map(p => p.productType).filter(Boolean))];
  const allSizes = [...new Set(products.flatMap(p => p.sizes || []))];
  const allColors = [...new Set(products.flatMap(p => p.colors || []))];

  // ✅ Filter Logic
  useEffect(() => {
    let filtered = products;

    // Filter by gender (if not already filtered by URL)
    if (selectedGender !== 'all' && !urlGender) {
      filtered = filtered.filter(p => p.gender === selectedGender);
    }

    // Filter by category (productType) (if not already filtered by URL)
    if (selectedCategory !== 'all' && !urlCategory) {
      filtered = filtered.filter(p => p.productType === selectedCategory);
    }

    // Filter by size
    if (selectedSize !== 'all') {
      filtered = filtered.filter(p => p.sizes && p.sizes.includes(selectedSize));
    }

    // Filter by color
    if (selectedColor !== 'all') {
      filtered = filtered.filter(p => p.colors && p.colors.includes(selectedColor));
    }

    // Sort
    filtered = filtered.sort((a, b) => {
      if (sortBy === 'popular') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
      return 0;
    });

    setFilteredProducts(filtered);
  }, [products, selectedGender, selectedCategory, selectedSize, selectedColor, sortBy, urlGender, urlCategory]);

  // ✅ Get price with discount
  const getDiscountedPrice = (product: FashionProduct) => {
    if (product.discountPrice && product.discountPrice < product.price) {
      return product.discountPrice;
    }
    if (product.discount && product.discount > 0) {
      return product.price - (product.price * product.discount / 100);
    }
    return product.price;
  };

  // ✅ Get discount percentage
  const getDiscountPercent = (product: FashionProduct) => {
    if (product.discount) return product.discount;
    if (product.discountPrice && product.discountPrice < product.price) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  // ✅ Gender tabs with counts
  const genders = [
    { id: 'all', label: 'All', icon: null },
    { id: 'women', label: 'Women', icon: <FaFemale className="text-sm sm:text-base" /> },
    { id: 'men', label: 'Men', icon: <FaMale className="text-sm sm:text-base" /> },
    { id: 'kids', label: 'Kids', icon: <FaChild className="text-sm sm:text-base" /> },
    { id: 'unisex', label: 'Unisex', icon: <FaChild className="text-sm sm:text-base" /> },
  ];

  // ✅ Category tabs with counts
  const categoryTabs = [
    { id: 'all', label: 'All' },
    ...allCategories.filter((cat): cat is string => typeof cat === 'string').map((cat) => ({ 
      id: cat, 
      label: categoryIcons[cat] || '📦',
      fullLabel: cat?.replace(/-/g, ' ') || cat
    }))
  ];

  // ✅ Handle image error
  const handleImageError = (productId: string) => {
    setImageError(prev => ({ ...prev, [productId]: true }));
  };

  // ✅ Get title based on URL filter
  const getTitle = () => {
    if (urlGender === 'men') return "👔 Men's Fashion";
    if (urlGender === 'women') return "👗 Women's Fashion";
    if (urlGender === 'kids') return "🧒 Kids Fashion";
    if (urlCategory === 'footwear') return "👟 Footwear";
    if (urlCategory === 'bags') return "👜 Bags";
    if (urlCategory === 'accessories') return "💎 Accessories";
    return "👗 Fashion Collection";
  };

  const getSubtitle = () => {
    if (urlGender === 'men') return "Premium men's clothing and accessories";
    if (urlGender === 'women') return "Elegant women's fashion collection";
    if (urlGender === 'kids') return "Stylish kids' clothing and accessories";
    if (urlCategory === 'footwear') return "Comfortable and stylish footwear";
    if (urlCategory === 'bags') return "Premium bags and handbags";
    if (urlCategory === 'accessories') return "Complete your look with accessories";
    return "Discover the latest fashion trends";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FFFDF7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-[#D4AF37] mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading fashion collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF7] pt-16 sm:pt-6 md:pt-8 lg:pt-12 pb-6 sm:pb-8 md:pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        
        {/* ✅ Page Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827]">
            {getTitle()}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-1 sm:mt-2 max-w-2xl mx-auto">
            {getSubtitle()}
          </p>
          <div className="text-xs text-gray-400 mt-2">
            {products.length} products available
          </div>
        </div>

        {/* ✅ Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm"
          >
            <FaFilter className="text-[#D4AF37]" />
            Filters
            {showFilters ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
            {(selectedGender !== 'all' || selectedCategory !== 'all' || selectedSize !== 'all' || selectedColor !== 'all') && (
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          <span className="text-sm text-gray-500">
            {filteredProducts.length} products
          </span>
        </div>

        {/* ✅ Filters Section */}
        <div className={`${showFilters ? 'block' : 'hidden lg:block'} mb-6`}>
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100">
            
            {/* Gender Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4">
              <span className="text-xs sm:text-sm font-medium text-gray-700 mr-1">Gender:</span>
              {genders.map((g) => {
                const count = products.filter((p) => g.id === 'all' || p.gender === g.id).length;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGender(g.id)}
                    className={`px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition flex items-center gap-1 ${
                      selectedGender === g.id
                        ? 'bg-[#D4AF37] text-white shadow-md'
                        : 'bg-[#F8FAFC] text-gray-600 hover:bg-[#E5E7EB] border border-gray-200'
                    }`}
                  >
                    {g.icon}
                    {g.label}
                    <span className="text-[8px] sm:text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Category Tabs */}
            {selectedGender !== 'all' && (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 border-t pt-4 border-gray-100">
                <span className="text-xs sm:text-sm font-medium text-gray-700 mr-1">Category:</span>
                {categoryTabs.map((cat) => {
                  const count = products.filter((p) => 
                    (selectedGender === 'all' || p.gender === selectedGender) &&
                    (cat.id === 'all' || p.productType === cat.id)
                  ).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition flex items-center gap-1 ${
                        selectedCategory === cat.id
                          ? 'bg-[#D4AF37] text-white shadow-md'
                          : 'bg-[#F8FAFC] text-gray-600 hover:bg-[#E5E7EB] border border-gray-200'
                      }`}
                    >
                      {cat.label}
                      <span className="hidden sm:inline text-[8px] sm:text-[10px] opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Size & Color Filters */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-t pt-4 border-gray-100">
              {/* Size Filter */}
              {allSizes.length > 0 && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-[10px] sm:text-xs text-gray-500">Size:</span>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-gray-200 text-[10px] sm:text-xs bg-[#F8FAFC] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="all">All</option>
                    {allSizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Color Filter */}
              {allColors.length > 0 && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-[10px] sm:text-xs text-gray-500">Color:</span>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-gray-200 text-[10px] sm:text-xs bg-[#F8FAFC] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="all">All</option>
                    {allColors.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort */}
              <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                <span className="text-[10px] sm:text-xs text-gray-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-gray-200 text-[10px] sm:text-xs bg-[#F8FAFC] focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="popular">Popular</option>
                  <option value="price-low">Price: Low</option>
                  <option value="price-high">Price: High</option>
                  <option value="discount">Discount</option>
                </select>
              </div>

              {/* Reset Filters */}
              {(selectedGender !== 'all' || selectedCategory !== 'all' || selectedSize !== 'all' || selectedColor !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedGender('all');
                    setSelectedCategory('all');
                    setSelectedSize('all');
                    setSelectedColor('all');
                    setSortBy('popular');
                  }}
                  className="text-[10px] sm:text-xs text-red-500 hover:text-red-700 transition"
                >
                  <FaTimes className="inline mr-1" /> Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 sm:py-12 md:py-16">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-4">👗</div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-600">No products found</h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Try adjusting your filters</p>
            <button
              onClick={() => {
                setSelectedGender('all');
                setSelectedCategory('all');
                setSelectedSize('all');
                setSelectedColor('all');
                setSortBy('popular');
              }}
              className="mt-4 text-[#D4AF37] hover:underline text-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {filteredProducts.map((product) => {
              const finalPrice = getDiscountedPrice(product);
              const discountPercent = getDiscountPercent(product);
              const isInStock = product.stock > 0;
              const hasError = imageError[product.id];
              
              return (
                <Link to={`/fashion/${product.id}`} key={product.id} className="group">
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1 h-full flex flex-col">
                    
                    {/* ✅ Image Container - Purple Border + Rounded Corners */}
                    <div className="relative overflow-hidden aspect-[3/4] sm:aspect-[4/5] bg-[#F8FAFC] rounded-2xl m-2 sm:m-3 border-4 border-purple-500 shadow-md shadow-purple-500/20">
                      <img
                        src={hasError ? `https://via.placeholder.com/400x500/D4AF37/FFFFFF?text=${product.name}` : product.image}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-xl`}
                        onError={() => handleImageError(product.id)}
                        loading="lazy"
                      />
                      
                      {/* Badges Row - Image par */}
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {discountPercent > 0 && (
                          <span className="bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg border-2 border-white/50">
                            -{discountPercent}%
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
                      {product.productType && (
                        <div className="absolute bottom-2 right-2">
                          <span className="text-[8px] sm:text-[10px] bg-black/60 backdrop-blur text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full capitalize border border-purple-300/30">
                            {categoryIcons[product.productType] || '📦'} {product.productType?.replace(/-/g, ' ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ✅ Product Info - Card Style */}
                    <div className="p-2.5 sm:p-3 md:p-4 flex-1 flex flex-col">
                      
                      {/* Rating */}
                      <div className="flex items-center gap-0.5 text-[#D4AF37] text-[8px] sm:text-[10px]">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.floor(product.rating || 0) ? 'text-[#D4AF37]' : 'text-gray-300'} />
                        ))}
                        <span className="text-gray-400 ml-0.5 text-[8px] sm:text-[10px]">({product.rating || 0})</span>
                      </div>

                      {/* Name */}
                      <h3 className="font-semibold text-[#111827] text-xs sm:text-sm md:text-base mt-0.5 line-clamp-2 group-hover:text-[#D4AF37] transition">
                        {product.name}
                      </h3>

                      {/* Product ID */}
                      {product.productId && (
                        <p className="text-[8px] sm:text-[10px] text-gray-400 font-mono mt-0.5">{product.productId}</p>
                      )}

                      {/* Gender Badge */}
                      {product.gender && (
                        <span className="text-[8px] sm:text-[10px] text-gray-400 mt-0.5">
                          {genderIcons[product.gender] || '👤'} {product.gender}
                        </span>
                      )}

                      {/* ✅ STOCK INDICATOR - Blinking Green Dot */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2 h-2 rounded-full ${isInStock ? 'bg-green-500 animate-blink' : 'bg-red-500'}`}></span>
                        <span className={`text-[10px] sm:text-xs font-medium ${isInStock ? 'text-green-600' : 'text-red-500'}`}>
                          {isInStock ? `In Stock (${product.stock})` : 'Out of Stock'}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-1 sm:gap-2 mt-1">
                        <span className="text-[#D4AF37] font-bold text-sm sm:text-base md:text-lg">
                          Rs. {finalPrice.toLocaleString()}
                        </span>
                        {product.oldPrice && product.oldPrice > finalPrice && (
                          <span className="text-gray-400 line-through text-[10px] sm:text-xs">
                            Rs. {product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Colors & Sizes Tags */}
                      <div className="flex flex-wrap gap-0.5 sm:gap-1 mt-1">
                        {product.colors && product.colors.slice(0, 3).map((color) => (
                          <span key={color} className="text-[8px] sm:text-[10px] bg-gray-100 px-1 py-0.5 rounded text-gray-600">
                            {color}
                          </span>
                        ))}
                        {product.colors && product.colors.length > 3 && (
                          <span className="text-[8px] sm:text-[10px] text-gray-400">+{product.colors.length - 3}</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-0.5 sm:gap-1 mt-0.5">
                        {product.sizes && product.sizes.slice(0, 3).map((size) => (
                          <span key={size} className="text-[8px] sm:text-[10px] bg-gray-100 px-1 py-0.5 rounded text-gray-600">
                            {size}
                          </span>
                        ))}
                        {product.sizes && product.sizes.length > 3 && (
                          <span className="text-[8px] sm:text-[10px] text-gray-400">+{product.sizes.length - 3}</span>
                        )}
                      </div>

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
                        className={`w-full mt-2 sm:mt-3 px-2 py-1.5 sm:py-2 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium transition flex items-center justify-center gap-1 sm:gap-2 ${
                          isInStock
                            ? 'bg-[#0F766E] text-white hover:bg-[#065F46] active:scale-95'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <FaShoppingCart className="text-[8px] sm:text-[10px] md:text-xs" />
                        <span>{isInStock ? 'Add to Cart' : 'Out of Stock'}</span>
                      </button>

                      {/* On Sale Badge */}
                      {product.isOnSale && (
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

        {/* ✅ Results Count */}
        <div className="text-center text-xs text-gray-400 mt-4 sm:mt-6">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </div>
  );
};

export default FashionPage;
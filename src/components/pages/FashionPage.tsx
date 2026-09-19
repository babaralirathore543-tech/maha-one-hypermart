// src/components/pages/FashionPage.tsx
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { db, collection, getDocs, query, where } from '../../config/firebase';
import ProductCard from '../common/ProductCard';

interface FashionProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discountPrice?: number;
  discount?: number;
  rating?: number;
  category: string;
  gender?: string;
  productType?: string;
  subCategory: string;
  subSubCategory: string;
  style?: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  description: string;
  material?: string;
  careInstructions?: string;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
}

// ============================================================
// BANNER CONFIG — per category
// ============================================================
interface BannerConfig {
  title: string;
  subtitle: string;
  bg: string;   // solid background color
}

const getBannerConfig = (
  urlGender: string | null,
  urlCategory: string | null
): BannerConfig => {
  if (urlGender === 'women') {
    return {
      title: "WOMEN'S FASHION",
      subtitle: 'Elegance & Style for Every Occasion',
      bg: '#3B1E54',
    };
  }
  if (urlGender === 'men') {
    return {
      title: "MEN'S FASHION",
      subtitle: 'Sharp Looks, Timeless Class',
      bg: '#1E3A5F',
    };
  }
  if (urlGender === 'kids') {
    return {
      title: 'KIDS FASHION',
      subtitle: 'Playful Styles for Little Stars',
      bg: '#B45309',
    };
  }
  if (urlCategory === 'footwear') {
    return {
      title: 'FOOTWEAR',
      subtitle: 'Step Into Style',
      bg: '#065F46',
    };
  }
  if (urlCategory === 'bags') {
    return {
      title: 'BAGS & ACCESSORIES',
      subtitle: 'Carry Confidence Everywhere',
      bg: '#4C1D95',
    };
  }
  if (urlCategory === 'accessories') {
    return {
      title: 'ACCESSORIES',
      subtitle: 'Details That Define You',
      bg: '#78350F',
    };
  }
  return {
    title: 'FASHION COLLECTION',
    subtitle: 'Discover Premium Styles',
    bg: '#3B1E54',
  };
};

const FashionPage = () => {
  const [searchParams] = useSearchParams();

  const urlGender = searchParams.get('gender');
  const urlCategory = searchParams.get('category');

  const [products, setProducts] = useState<FashionProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<FashionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState<string>(urlGender || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || 'all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
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
          q = query(productsRef, where('category', '==', 'fashion'));
        }

        const querySnapshot = await getDocs(q);
        const productsData: FashionProduct[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as any;
          productsData.push({
            id: doc.id,
            name: data?.name || '',
            price: data?.price || 0,
            oldPrice: data?.oldPrice || 0,
            discountPrice: data?.discountPrice || 0,
            discount: data?.discount || 0,
            rating: data?.rating || 4.5,
            category: data?.category || 'fashion',
            gender: data?.gender || '',
            productType: data?.productType || '',
            subCategory: data?.subCategory || '',
            subSubCategory: data?.subSubCategory || '',
            style: data?.style || '',
            image: data?.image || '',
            images: data?.images || [],
            sizes: data?.sizes || [],
            colors: data?.colors || [],
            stock: data?.stock || 0,
            description: data?.description || '',
            material: data?.material || '',
            careInstructions: data?.careInstructions || '',
            isNew: data?.isNew || false,
            isFeatured: data?.isFeatured || false,
            isBestSeller: data?.isBestSeller || false,
            isOnSale: data?.isOnSale || false,
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

  const allSizes = [...new Set(products.flatMap((p) => p.sizes || []))];
  const allColors = [...new Set(products.flatMap((p) => p.colors || []))];

  useEffect(() => {
    let filtered = products;

    if (selectedGender !== 'all' && !urlGender) {
      filtered = filtered.filter((p) => p.gender === selectedGender);
    }
    if (selectedCategory !== 'all' && !urlCategory) {
      filtered = filtered.filter((p) => p.productType === selectedCategory);
    }
    if (selectedSize !== 'all') {
      filtered = filtered.filter((p) => p.sizes && p.sizes.includes(selectedSize));
    }
    if (selectedColor !== 'all') {
      filtered = filtered.filter((p) => p.colors && p.colors.includes(selectedColor));
    }

    filtered = filtered.sort((a, b) => {
      if (sortBy === 'popular') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
      return 0;
    });

    setFilteredProducts(filtered);
  }, [products, selectedGender, selectedCategory, selectedSize, selectedColor, sortBy, urlGender, urlCategory]);

  const banner = getBannerConfig(urlGender, urlCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FFFDF7] dark:bg-[#111827]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#D4AF37] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
            Loading fashion collection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] pt-16 sm:pt-6 md:pt-8 pb-6 sm:pb-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================================================== */}
        {/* ✅ BOLD TEXT BANNER (NO ICON, NO GRADIENT)          */}
        {/* ================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            relative overflow-hidden
            rounded-2xl sm:rounded-3xl
            shadow-2xl
            mb-6 sm:mb-8
          "
          style={{ backgroundColor: banner.bg }}
        >
          {/* Decorative subtle circles (very light) */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-white/5" />

          {/* Content */}
          <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-14 text-center text-white">

            {/* Title — Bold, Uppercase, Wide tracking */}
            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="
                text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                font-black
                tracking-[0.15em] sm:tracking-[0.2em]
                uppercase
                leading-tight
                mb-3 sm:mb-4
              "
            >
              {banner.title}
            </motion.h1>

            {/* Gold accent line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-24 h-1 mx-auto mb-4 sm:mb-5 rounded-full"
              style={{ background: '#D4AF37' }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="
                text-sm sm:text-base md:text-lg
                text-white/75
                font-light
                tracking-wide
                max-w-xl mx-auto
              "
            >
              {banner.subtitle}
            </motion.p>
          </div>

          {/* Decorative bottom gold line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[3px]"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
            }}
          />
        </motion.div>

        {/* ================================================== */}
        {/* FILTERS TOGGLE (Mobile)                            */}
        {/* ================================================== */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white dark:bg-[#1F2937] px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300"
          >
            <FaFilter className="text-[#D4AF37]" />
            Filters
            {showFilters ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
          </button>
        </div>

        {/* ================================================== */}
        {/* FILTERS BAR                                        */}
        {/* ================================================== */}
        <div className={`${showFilters ? 'block' : 'hidden lg:block'} mb-6`}>
          <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Gender:</span>
              {['all', 'women', 'men', 'kids', 'unisex'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    selectedGender === g
                      ? 'bg-[#D4AF37] text-white shadow-md'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              {allSizes.length > 0 && (
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs bg-gray-50 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">All Sizes</option>
                  {allSizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              )}

              {allColors.length > 0 && (
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs bg-gray-50 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">All Colors</option>
                  {allColors.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs bg-gray-50 dark:bg-gray-800 dark:text-white ml-auto"
              >
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low</option>
                <option value="price-high">Price: High</option>
                <option value="discount">Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* PRODUCTS GRID                                      */}
        {/* ================================================== */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              No products found
            </h3>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    oldPrice: product.oldPrice,
                    discountPrice: product.discountPrice,
                    discount: product.discount,
                    image: product.image,
                    images: product.images,
                    stock: product.stock,
                    isNew: product.isNew,
                    isFeatured: product.isFeatured,
                    isBestSeller: product.isBestSeller,
                    rating: product.rating || 4.5,
                    reviewCount: 0,
                    category: 'fashion',
                    colors: product.colors || [],
                  }}
                  variant="horizontal"
                  primaryColor="#3B1E54"
                  secondaryColor="#D4AF37"
                  detailPath={`/fashion/${product.id}`}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FashionPage;
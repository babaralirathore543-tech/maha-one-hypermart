// src/components/pages/CakesPage.tsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaSpinner,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { db, collection, getDocs } from '../../config/firebase';
import ProductCard from '../common/ProductCard';

interface CakesProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discountPrice?: number;
  discount?: number;
  rating?: number;
  category: string;
  subCategory?: string;
  subSubCategory?: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  description: string;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  flavor?: string;
  weight?: string;
}

const CakesPage = () => {
  const [products, setProducts] = useState<CakesProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', label: 'All Cakes' },
    { id: 'celebration', label: '🎉 Celebration' },
    { id: 'birthday', label: '🎂 Birthday' },
    { id: 'wedding', label: '💍 Wedding' },
    { id: 'custom', label: '🎨 Custom' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData: CakesProduct[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.category === 'cakes') {
            productsData.push({
              id: doc.id,
              name: data.name || '',
              price: data.price || 0,
              oldPrice: data.oldPrice || 0,
              discountPrice: data.discountPrice || 0,
              discount: data.discount || data.discountPrice || 0,
              rating: data.rating || 4.5,
              category: data.category || 'cakes',
              subCategory: data.subCategory || '',
              subSubCategory: data.subSubCategory || '',
              image: data.image || '',
              images: data.images || [],
              sizes: data.sizes || [],
              colors: data.colors || [],
              stock: data.stock || 0,
              description: data.description || '',
              isNew: data.isNew || false,
              isFeatured: data.isFeatured || false,
              isBestSeller: data.isBestSeller || false,
              isOnSale: data.isOnSale || false,
              flavor: data.flavor || '',
              weight: data.weight || '',
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

  const filteredProducts = products
    .filter((p) => selectedCategory === 'all' || p.subCategory === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FFFDF7] dark:bg-[#111827]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#D4AF37] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading cakes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] py-6 sm:py-8 md:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            🎂 Premium <span className="text-[#D4AF37]">Cakes</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            Delicious homemade cakes baked fresh daily. Available in various sizes and flavors.
          </p>
          <div className="inline-flex items-center gap-2 mt-3 bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 rounded-full border border-[#D4AF37]/20">
            <FaMapMarkerAlt className="text-sm" />
            <span className="text-sm font-medium">📍 Currently Available in Karachi Only</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
          {categories.map((cat) => {
            const count = products.filter((p) => cat.id === 'all' || p.subCategory === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-[#D4AF37] text-white shadow-md'
                    : 'bg-[#F8FAFC] dark:bg-[#1F2937] text-gray-600 dark:text-gray-300 hover:bg-[#E5E7EB] dark:hover:bg-gray-700 border border-[#E5E7EB] dark:border-gray-700'
                }`}
              >
                {cat.label}
                <span className="ml-1 text-xs opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white dark:bg-[#1F2937] p-4 rounded-xl shadow-sm border border-[#E5E7EB] dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredProducts.length} cakes
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-full border border-[#E5E7EB] dark:border-gray-700 text-sm bg-[#F8FAFC] dark:bg-[#1F2937] dark:text-white focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Discount</option>
          </select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎂</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">No cakes found</h3>
            <p className="text-gray-400 mt-1">Try adjusting your filters</p>
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
                    category: 'cakes',
                    colors: [],
                  }}
                  variant="horizontal"
                  primaryColor="#3B1E54"
                  secondaryColor="#D4AF37"
                  detailPath={`/cakes/${product.id}`}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CakesPage;
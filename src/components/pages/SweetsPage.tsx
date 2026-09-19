// src/components/pages/SweetsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { db, collection, getDocs, query, where } from '../../config/firebase';
import ProductCard from '../common/ProductCard';

interface SweetProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  category: string;
  subCategory: string;
  image: string;
  images: string[];
  description?: string;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  colors?: string[];
}

const SweetsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<SweetProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('category', '==', 'sweets'));
        const snapshot = await getDocs(q);

        const productsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unnamed',
            price: data.price || 0,
            oldPrice: data.oldPrice || 0,
            discount: data.discount || 0,
            rating: data.rating || 4.5,
            category: data.category || 'sweets',
            subCategory: data.subCategory || 'Sweets',
            image: data.image || data.images?.[0] || '',
            images: data.images || [],
            description: data.description || '',
            stock: data.stock || 0,
            isNew: data.isNew || false,
            isFeatured: data.isFeatured || false,
            isBestSeller: data.isBestSeller || false,
            isOnSale: data.isOnSale || false,
            colors: data.colors || [],
          } as SweetProduct;
        });

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
    const categories = products.map((p) => p.subCategory || 'Sweets');
    return ['All', ...new Set(categories)];
  };

  const categories = getCategories();
  const filteredProducts = filter === 'All'
    ? products
    : products.filter((p) => (p.subCategory || 'Sweets') === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FFFDF7] dark:bg-[#111827]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#D4AF37] mx-auto" />
          <p className="mt-4 text-gray-500">Loading sweets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] pt-16 sm:pt-6 md:pt-8 pb-6 sm:pb-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-[#0F766E] hover:text-[#D4AF37] transition text-sm"
            >
              <FaArrowLeft /> Back
            </button>
            <span className="text-gray-300">|</span>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                🍬 <span className="text-[#D4AF37]">Sweet</span> Collection
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {filteredProducts.length} products available
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Premium sweets made with love and the finest ingredients.
        </p>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === cat
                    ? 'bg-[#D4AF37] text-white shadow-lg'
                    : 'bg-white dark:bg-[#1F2937] text-gray-600 dark:text-gray-300 hover:bg-gray-100 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🍬</div>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">No sweets found</h3>
            <p className="text-gray-400 text-sm mt-1">Try a different category</p>
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
                    discount: product.discount,
                    image: product.image,
                    images: product.images,
                    stock: product.stock,
                    isNew: product.isNew,
                    isFeatured: product.isFeatured,
                    isBestSeller: product.isBestSeller,
                    rating: product.rating || 4.5,
                    reviewCount: 0,
                    category: 'sweets',
                    colors: product.colors || [],
                  }}
                  variant="horizontal"
                  primaryColor="#3B1E54"
                  secondaryColor="#D4AF37"
                  detailPath={`/sweet-product/${product.id}`}
                />
              </motion.div>
            ))}
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="text-center text-xs text-gray-400 mt-6">
            Showing {filteredProducts.length} products
          </div>
        )}
      </div>
    </div>
  );
};

export default SweetsPage;
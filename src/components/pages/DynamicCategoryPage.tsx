// src/components/pages/DynamicCategoryPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSpinner, FaFilter } from 'react-icons/fa';
import { db, collection, getDocs, query, where } from '../../config/firebase';
import ProductCard from '../common/ProductCard';
import {
  getCategoryBySlug,
  getCategoryChildren,
  Category,
} from '../../services/categoryService';

const DynamicCategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [children, setChildren] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    if (!categorySlug) return;

    const load = async () => {
      setLoading(true);
      try {
        // 1. Category load
        const cat = await getCategoryBySlug(categorySlug);
        if (!cat) {
          setLoading(false);
          return;
        }
        setCategory(cat);

        // 2. Children load
        const kids = await getCategoryChildren(cat.id);
        setChildren(kids);

        // 3. Products load (aur uska bhi jo categoryPath mein ho)
        const q = query(
          collection(db, 'products'),
          where('categorySlug', '==', categorySlug)
        );
        const snap = await getDocs(q);
        const items = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter((p: any) => p.status === 'active' || p.approvalStatus === 'approved');
        setProducts(items);
      } catch (err) {
        console.error('❌', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FFFDF7] dark:bg-[#0F172A]">
        <FaSpinner className="animate-spin text-4xl text-[#D4AF37]" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold dark:text-white">Category not found</h1>
          <Link to="/" className="text-[#0F766E] hover:underline mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Sub-filter
  const filtered = filter === 'All'
    ? products
    : products.filter((p: any) => p.attributes?.subCategory === filter);

  const subCategories = [...new Set(products.map((p: any) => p.attributes?.subCategory).filter(Boolean))];

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#0F172A] pt-16 sm:pt-6 md:pt-8 pb-6 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#0F766E] hover:text-[#D4AF37] transition text-sm"
          >
            <FaArrowLeft /> Back
          </button>
          <span className="text-gray-300">|</span>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {category.icon} <span className="text-[#D4AF37]">{category.name}</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {filtered.length} products available
            </p>
          </div>
        </div>

        {/* Subcategories (children) */}
        {children.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {children.map(child => (
              <Link
                key={child.id}
                to={`/category/${child.slug}`}
                className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#D4AF37] hover:text-white transition border border-gray-200 dark:border-gray-700 text-sm"
              >
                {child.icon} {child.name}
              </Link>
            ))}
          </div>
        )}

        {/* Filters */}
        {subCategories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === 'All' ? 'bg-[#D4AF37] text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border'
              }`}
            >
              All
            </button>
            {subCategories.map((sub: any) => (
              <button
                key={sub}
                onClick={() => setFilter(sub)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize ${
                  filter === sub ? 'bg-[#D4AF37] text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border'
                }`}
              >
                {String(sub).replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        )}

        {/* Products */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{category.icon}</div>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              No products found
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {filtered.map((product: any, index: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
                    rating: product.rating || 0,
                    category: product.categorySlug,
                    colors: product.attributes?.colors || [],
                  }}
                  variant="horizontal"
                  primaryColor="#3B1E54"
                  secondaryColor="#D4AF37"
                  detailPath={`/product/${product.id}`}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicCategoryPage;
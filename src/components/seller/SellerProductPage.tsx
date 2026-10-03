// src/components/seller/SellerProductPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../products/UniversalProductForm';
import { categoryConfigs } from '../../config/productConfig';
import { getAllCategories, Category } from '../../services/categoryService';

const SellerProductPage = () => {
  const { category, id } = useParams<{ category?: string; id?: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(category || '');

  // ✅ Load categories from Firestore (with fallback to static)
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const cats = await getAllCategories();
        // Only show root categories (parentId === null) for seller
        const rootCats = cats.filter((c) => !c.parentId);

        if (rootCats.length > 0) {
          setCategories(rootCats);
        } else {
          // Fallback to static config if Firestore empty
          setCategories(
            categoryConfigs.map((c) => ({
              id: c.id,
              slug: c.id,
              name: c.name,
              icon: c.icon,
              parentId: null,
              order: 0,
              isActive: true,
              attributeTemplateId: `${c.id}_default`,
            }))
          );
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        // Fallback to static config
        setCategories(
          categoryConfigs.map((c) => ({
            id: c.id,
            slug: c.id,
            name: c.name,
            icon: c.icon,
            parentId: null,
            order: 0,
            isActive: true,
            attributeTemplateId: `${c.id}_default`,
          }))
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ============================================================
  // EDIT MODE — Edit existing product
  // ============================================================
  if (id && category) {
    return (
      <div className="p-0 sm:p-6">
        <ProductForm
          mode="seller"
          categoryId={category}
          productId={id}
          onSuccess={() => navigate('/seller/products')}
        />
      </div>
    );
  }

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0F766E] mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // STEP 1 — Category Selection
  // ============================================================
  if (!selectedCategory) {
    return (
      <div className="max-w-4xl mx-auto p-0 sm:p-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Add New Product
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
            Select a category to continue
          </p>
        </div>

        {/* Category Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-5xl mb-3">📦</div>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
              No categories available
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Contact admin to set up categories
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="
                  bg-white dark:bg-gray-800
                  p-4 sm:p-6
                  rounded-2xl shadow-sm
                  border-2 border-gray-100 dark:border-gray-700
                  hover:border-[#0F766E] hover:shadow-lg
                  dark:hover:border-[#0F766E]
                  transition-all duration-200
                  group
                  active:scale-95
                "
              >
                <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <p className="font-semibold text-gray-800 dark:text-white text-xs sm:text-base">
                  {cat.name}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 text-center">
            💡 <strong>Tip:</strong> Your product will be reviewed by admin before going live
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // STEP 2 — Product Form
  // ============================================================
  const selectedCat = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="p-0 sm:p-6">
      {/* Back Button */}
      <button
        onClick={() => setSelectedCategory('')}
        className="
          mb-3 sm:mb-4
          text-xs sm:text-sm
          text-[#0F766E] dark:text-[#5EEAD4]
          hover:underline
          font-medium
          flex items-center gap-1
        "
      >
        ← Change Category
        {selectedCat && (
          <span className="text-gray-400 dark:text-gray-500 ml-1">
            (currently: {selectedCat.icon} {selectedCat.name})
          </span>
        )}
      </button>

      {/* Universal Product Form */}
      <ProductForm
        mode="seller"
        categoryId={selectedCategory}
        onSuccess={() => navigate('/seller/products')}
      />
    </div>
  );
};

export default SellerProductPage;
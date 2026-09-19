// src/components/seller/SellerProductPage.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../products/ProductForm';
import { categoryConfigs } from '../../config/productConfig';

const SellerProductPage = () => {
  const { category, id } = useParams<{ category?: string; id?: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(category || '');

  // 🔍 DEBUG
  console.log('🔍 SellerProductPage rendered');
  console.log('🔍 categoryConfigs:', categoryConfigs);
  console.log('🔍 categoryConfigs length:', categoryConfigs?.length);

  // ✅ Edit mode
  if (id && category) {
    return (
      <div className="p-6">
        <ProductForm
          mode="seller"
          categoryId={category}
          productId={id}
          onSuccess={() => navigate('/seller/products')}
        />
      </div>
    );
  }

  // ✅ Step 1: Select Category
  if (!selectedCategory) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-gray-500 mt-2">Select a category to continue</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categoryConfigs.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="bg-white p-8 rounded-2xl shadow-sm border-2 border-gray-100 hover:border-[#0F766E] hover:shadow-lg transition-all group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <p className="font-semibold text-gray-800 text-lg">{cat.name}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ✅ Step 2: Show Form
  return (
    <div className="p-6">
      <button
        onClick={() => setSelectedCategory('')}
        className="mb-4 text-sm text-[#0F766E] hover:underline"
      >
        ← Change Category
      </button>

      <ProductForm
        mode="seller"
        categoryId={selectedCategory}
        onSuccess={() => navigate('/seller/products')}
      />
    </div>
  );
};

export default SellerProductPage;
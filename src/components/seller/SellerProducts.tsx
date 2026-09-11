// src/components/seller/SellerProducts.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  image: string;
  createdAt: string;
}

const SellerProducts = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Premium Ladies Suit',
      category: 'Fashion',
      price: 2500,
      stock: 15,
      status: 'approved',
      image: 'https://via.placeholder.com/80',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Dry Fruit Gift Box',
      category: 'Dry Fruits',
      price: 1200,
      stock: 8,
      status: 'pending',
      image: 'https://via.placeholder.com/80',
      createdAt: '2024-01-14',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your products</p>
        </div>
        <button className="bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2">
          <Plus size={20} />
          Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Draft</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">{product.category}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-sm font-medium text-gray-800">Rs. {product.price}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
                <div className="flex items-center gap-1">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                    <Edit size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SellerProducts;
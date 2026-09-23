// src/components/seller/SellerProducts.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db, collection, query, where, getDocs, deleteDoc, doc } from '../../config/firebase';

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, 'products'),
          where('sellerId', '==', user.uid)
        );
        const snap = await getDocs(q);
        const items: Product[] = [];
        snap.forEach((d) => {
          items.push({ id: d.id, ...d.data() } as Product);
        });
        setProducts(items);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter((p) => p.id !== id));
      alert('🗑️ Product deleted');
    } catch (error: any) {
      alert('❌ Delete failed: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-4xl text-[#0F766E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your products</p>
        </div>

        <button
          onClick={() => navigate('/seller/products/add')}
          className="bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E] outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E] outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600">No Products Yet</h3>
          <p className="text-gray-400 mt-2 mb-6">
            {products.length === 0
              ? "You haven't added any products yet. Click 'Add New Product' to start."
              : 'Try adjusting your search or filter.'}
          </p>
          {products.length === 0 && (
            <button
              onClick={() => navigate('/seller/products/add')}
              className="bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add Your First Product
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={product.image || 'https://via.placeholder.com/80'}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                  }}
                />

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

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                    {product.status?.charAt(0).toUpperCase() + product.status?.slice(1)}
                  </span>
                  <div className="flex items-center gap-1">
                    {/* ✅ FIX: View button removed (route missing) — Edit hi View hai */}
                    <button
                      onClick={() => navigate(`/seller/products/edit/${product.category}/${product.id}`)}
                      className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      title="View / Edit"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => navigate(`/seller/products/edit/${product.category}/${product.id}`)}
                      className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
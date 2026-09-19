// src/components/admin/AdminProductsApproval.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, XCircle, Clock, Search, Eye,
  Package, Loader2, Store, DollarSign, RefreshCw
} from 'lucide-react';
import {
  collection, query, where, getDocs, doc,
  updateDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

interface SellerProduct {
  id: string;
  name: string;
  brand?: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  sellerId: string;
  sellerName?: string;
  status: string;
  approvalStatus: string;
  shortDescription?: string;
  createdAt?: any;
}

const AdminProductsApproval = () => {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SellerProduct | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [stats, setStats] = useState({
    total: 0, pending: 0, approved: 0, rejected: 0,
  });

  // ✅ Fetch all seller products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching seller products...');

      const q = query(collection(db, 'products'));
      const querySnapshot = await getDocs(q);

      console.log('📦 Total products:', querySnapshot.size);

      const items: SellerProduct[] = [];
      let pending = 0, approved = 0, rejected = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // ✅ Sirf seller products (jinke sellerId hai)
        if (!data.sellerId || data.sellerId === 'admin') return;

        const product = {
          id: doc.id,
          ...data,
        } as SellerProduct;

        items.push(product);

        if (data.approvalStatus === 'pending') pending++;
        else if (data.approvalStatus === 'approved') approved++;
        else if (data.approvalStatus === 'rejected') rejected++;
      });

      // Sort by createdAt (newest first)
      items.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setProducts(items);
      setStats({
        total: items.length,
        pending,
        approved,
        rejected,
      });

      console.log('✅ Loaded:', items.length, 'seller products');
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      alert('Failed to load products. Check console.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve Product
  const handleApprove = async (product: SellerProduct) => {
    if (actionLoading) return;
    if (!confirm(`Approve "${product.name}"?`)) return;

    setActionLoading(true);
    try {
      console.log('🔄 Approving product:', product.name);

      const productRef = doc(db, 'products', product.id);
      await updateDoc(productRef, {
        status: 'active',
        approvalStatus: 'approved',
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert(`✅ ${product.name} approved!`);
      setShowModal(false);
      fetchProducts();
    } catch (error: any) {
      console.error('❌ Error:', error);
      alert(`❌ Failed: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Reject Product
  const handleReject = async (product: SellerProduct) => {
    if (actionLoading) return;
    if (!confirm(`Reject "${product.name}"?`)) return;

    setActionLoading(true);
    try {
      const productRef = doc(db, 'products', product.id);
      await updateDoc(productRef, {
        status: 'rejected',
        approvalStatus: 'rejected',
        rejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert(`❌ ${product.name} rejected.`);
      setShowModal(false);
      fetchProducts();
    } catch (error: any) {
      alert(`❌ Failed: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ View Details
  const viewDetails = (product: SellerProduct) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // ✅ Filter
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || p.approvalStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={12} />;
      case 'pending': return <Clock size={12} />;
      case 'rejected': return <XCircle size={12} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="animate-spin text-4xl text-[#0F766E] mx-auto" />
          <p className="text-gray-500 mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products Approval</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve seller products
          </p>
        </div>
        <button
          onClick={fetchProducts}
          disabled={loading}
          className="px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#065F46] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: Package, color: 'bg-blue-500', status: 'all' as const },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-500', status: 'pending' as const },
          { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'bg-green-500', status: 'approved' as const },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-500', status: 'rejected' as const },
        ].map((stat, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setFilterStatus(stat.status)}
            className={`bg-white rounded-xl shadow-sm p-6 border-2 text-left transition ${
              filterStatus === stat.status
                ? 'border-[#0F766E] ring-2 ring-[#0F766E]/20'
                : 'border-gray-100 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={20} className="text-white" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by product name, seller, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E] outline-none"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Products ({filteredProducts.length})
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No Products Found</h3>
            <p className="text-gray-400 mt-2">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter'
                : 'No seller products yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || 'https://via.placeholder.com/60'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Store size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {product.sellerName || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800">
                        Rs. {product.price?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(product.approvalStatus)}`}>
                        {getStatusIcon(product.approvalStatus)}
                        {product.approvalStatus?.charAt(0).toUpperCase() + product.approvalStatus?.slice(1) || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewDetails(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {product.approvalStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(product)}
                              disabled={actionLoading}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(product)}
                              disabled={actionLoading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Product Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="text-[#0F766E]" />
                    <h3 className="font-semibold text-gray-800">Product Information</h3>
                  </div>

                  {selectedProduct.image && (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-semibold text-gray-800">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-semibold text-gray-800 capitalize">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-semibold text-gray-800">
                        Rs. {selectedProduct.price?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stock</p>
                      <p className="font-semibold text-gray-800">{selectedProduct.stock}</p>
                    </div>
                  </div>

                  {selectedProduct.shortDescription && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-gray-700">{selectedProduct.shortDescription}</p>
                    </div>
                  )}
                </div>

                {/* Seller Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Store className="text-[#0F766E]" />
                    <h3 className="font-semibold text-gray-800">Seller Information</h3>
                  </div>
                  <p className="text-sm">
                    <span className="text-gray-500">Store:</span>{' '}
                    <span className="font-medium">{selectedProduct.sellerName || 'N/A'}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Seller ID:</span>{' '}
                    <span className="font-mono text-xs">{selectedProduct.sellerId}</span>
                  </p>
                </div>

                {/* Action Buttons */}
                {selectedProduct.approvalStatus === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleApprove(selectedProduct)}
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedProduct)}
                      disabled={actionLoading}
                      className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsApproval;
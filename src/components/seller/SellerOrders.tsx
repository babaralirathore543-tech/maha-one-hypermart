// src/components/seller/SellerOrders.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import {
  ShoppingBag,
  Search,
  Eye,
  Loader2,
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

interface SellerOrder {
  id: string;
  orderId: string;
  customerName: string;
  items: any[];
  subtotal: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any;
}

const SellerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'sellerOrders'),
        where('sellerId', '==', user?.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const data: SellerOrder[] = [];
      snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as SellerOrder));
      setOrders(data);
    } catch (error) {
      console.error('Error fetching seller orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-3xl text-[#0F766E]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Orders</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Manage and track your orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-800' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
          { label: 'Processing', value: stats.processing, color: 'text-blue-600' },
          { label: 'Delivered', value: stats.delivered, color: 'text-green-600' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100"
          >
            <p className="text-[10px] sm:text-xs text-gray-500">{s.label}</p>
            <p className={`text-lg sm:text-2xl font-bold mt-1 ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center border border-gray-100">
          <ShoppingBag className="text-5xl text-gray-300 mx-auto mb-3" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-600">
            No Orders Found
          </h3>
          <p className="text-gray-400 text-sm mt-2">
            {orders.length === 0
              ? "You haven't received any orders yet."
              : 'Try adjusting your search or filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white rounded-xl shadow-sm p-3 sm:p-5 border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    #{order.orderId || order.id.slice(0, 8)}
                  </p>
                </div>
                <span className={`px-2 py-1 text-[10px] font-medium rounded-full flex-shrink-0 ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Info */}
              <div className="grid grid-cols-3 gap-2 text-xs border-t border-gray-100 pt-3">
                <div className="min-w-0">
                  <p className="text-gray-500 text-[10px]">Customer</p>
                  <p className="font-medium text-gray-800 truncate">
                    {order.customerName || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px]">Items</p>
                  <p className="font-medium text-gray-800">
                    {order.items?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px]">Total</p>
                  <p className="font-medium text-[#0F766E] truncate">
                    Rs. {order.subtotal?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
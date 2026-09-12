import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaShoppingBag, 
  FaSearch, 
  FaEye, 
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

interface SellerOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
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
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // ✅ Fetch orders from sellerOrders collection
      // Har order jismein current seller ke products hain
      const q = query(
        collection(db, 'sellerOrders'),
        where('sellerId', '==', user?.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const ordersData: SellerOrder[] = [];
      
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as SellerOrder);
      });
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching seller orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'processing': return <FaSpinner className="text-blue-500 animate-spin" />;
      case 'shipped': return <FaTruck className="text-purple-500" />;
      case 'delivered': return <FaCheckCircle className="text-green-500" />;
      case 'cancelled': return <FaTimesCircle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#0F766E] mx-auto" />
          <p className="text-gray-500 mt-4">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your orders and track their status</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Processing</p>
          <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No Orders Found</h3>
          <p className="text-gray-400 mt-2">
            {orders.length === 0 
              ? "You haven't received any orders yet." 
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800">#{order.orderId || order.id.slice(0, 8)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-[#0F766E] hover:bg-[#0F766E]/10 rounded-lg transition-colors">
                    <FaEye size={16} />
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm border-t border-gray-100 pt-3">
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium text-gray-800">{order.customerName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Items</p>
                  <p className="font-medium text-gray-800">{order.items?.length || 0} items</p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-medium text-[#0F766E]">Rs. {order.subtotal?.toLocaleString() || 0}</p>
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
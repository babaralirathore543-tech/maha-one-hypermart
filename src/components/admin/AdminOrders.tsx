// src/components/admin/AdminOrders.tsx
import React, { useState, useEffect } from 'react';
import { 
  FaEye, 
  FaTrash, 
  FaTimes, 
  FaSpinner,
  FaCheck,
  FaTruck,
  FaBox,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPalette,
  FaRuler,
  FaWhatsapp} from 'react-icons/fa';
import { db, collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from '../../config/firebase';
import { sendCustomWhatsAppMessage } from '../../services/whatsappNotificationService';
import toast from 'react-hot-toast';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
  weight?: string;
  colour?: string;
  size?: string;
  variantId?: string;
  sku?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  notes?: string;
  createdAt: any;
  updatedAt?: any;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // ✅ Status Options
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <FaClock className="text-yellow-500" /> },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: <FaBox className="text-blue-500" /> },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: <FaTruck className="text-purple-500" /> },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: <FaCheck className="text-green-500" /> },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: <FaTimes className="text-red-500" /> }
  ];

  // ✅ Payment Status Options
  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
    { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' }
  ];

  // ✅ Fetch Orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersData: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      console.log('✅ Orders fetched:', ordersData.length);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter Orders
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber?.toLowerCase().includes(term) ||
        order.userName?.toLowerCase().includes(term) ||
        order.userPhone?.toLowerCase().includes(term) ||
        order.userEmail?.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  // ✅ Update Order Status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: newStatus,
        updatedAt: new Date()
      });
      
      // ✅ Send WhatsApp notification on status change
      const order = orders.find(o => o.id === orderId);
      if (order && order.userPhone) {
        let message = '';

        switch (newStatus) {
          case 'processing':
            message = `📦 *MAHA ONE HYPERMART - Order Processing*

👋 Hello ${order.userName},

Your order #${order.orderNumber || order.id.slice(-8)} is now being processed.

🛍️ We're preparing your items for shipment.

📱 Track your order: ${window.location.origin}/orders/${order.id}

Thank you for shopping with *MAHA ONE HYPERMART*! 🛍️`;
            break;
          case 'shipped':
            message = `🚚 *MAHA ONE HYPERMART - Order Shipped!*

👋 Hello ${order.userName},

Great news! Your order #${order.orderNumber || order.id.slice(-8)} has been shipped! 🎉

📦 Your items are on the way to you.

📱 Track your order: ${window.location.origin}/orders/${order.id}

Thank you for shopping with *MAHA ONE HYPERMART*! 🛍️`;
            break;
          case 'delivered':
            message = `✅ *MAHA ONE HYPERMART - Order Delivered!*

👋 Hello ${order.userName},

Your order #${order.orderNumber || order.id.slice(-8)} has been delivered successfully! 🎉

🌟 We hope you love your purchase!

📱 Rate your order: ${window.location.origin}/orders/${order.id}/review

Thank you for choosing *MAHA ONE HYPERMART*! 🛍️`;
            break;
          case 'cancelled':
            message = `❌ *MAHA ONE HYPERMART - Order Cancelled*

👋 Hello ${order.userName},

Your order #${order.orderNumber || order.id.slice(-8)} has been cancelled.

💰 Refund will be processed within 3-5 business days.

📞 For any questions, contact us on WhatsApp: +92-XXX-XXXXXXX

Thank you for choosing *MAHA ONE HYPERMART*! 🛍️`;
            break;
          default:
            message = `📦 *MAHA ONE HYPERMART - Order Update*

👋 Hello ${order.userName},

Your order #${order.orderNumber || order.id.slice(-8)} status has been updated to: ${newStatus}

📱 Track your order: ${window.location.origin}/orders/${order.id}

Thank you for shopping with *MAHA ONE HYPERMART*! 🛍️`;
        }

        sendCustomWhatsAppMessage(order.userPhone, message);
      }

      await fetchOrders();
      toast.success(`✅ Order status updated to: ${newStatus}`);
    } catch (error) {
      console.error('❌ Error updating order:', error);
      toast.error('❌ Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  // ✅ Delete Order
  const deleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
        await fetchOrders();
        toast.success('✅ Order deleted successfully!');
      } catch (error) {
        console.error('❌ Error deleting order:', error);
        toast.error('❌ Failed to delete order');
      }
    }
  };

  // ✅ View Order Details
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // ✅ Send WhatsApp to Customer
  const sendWhatsAppToCustomer = (order: Order) => {
    const phone = order.userPhone || order.shippingAddress?.phone;
    
    if (!phone) {
      toast.error('❌ No phone number found for this customer');
      return;
    }

    const itemsList = order.items?.map((item, index) => 
      `${index + 1}. ${item.name} x${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n') || 'No items';

    const message = `📦 *MAHA ONE HYPERMART - Order Update*

👋 Hello ${order.userName || 'Customer'},

Your order #${order.orderNumber || order.id.slice(-8)} is being processed.

📋 *Order Details:*
${itemsList}

💰 Total: Rs. ${order.total?.toLocaleString() || 0}
📦 Status: ${order.orderStatus || 'Pending'}

📱 Track your order: ${window.location.origin}/orders/${order.id}

📞 Need help? Contact us on WhatsApp: +92-XXX-XXXXXXX

Thank you for shopping with *MAHA ONE HYPERMART*! 🛍️`;

    const result = sendCustomWhatsAppMessage(phone, message);
    if (result.success) {
      toast.success('📱 WhatsApp message sent to customer!');
    }
  };

  // ✅ Get Status Badge
  const getStatusBadge = (status: string) => {
    const found = statusOptions.find(s => s.value === status);
    return found || statusOptions[0];
  };

  // ✅ Get Payment Badge
  const getPaymentBadge = (status: string) => {
    const found = paymentStatusOptions.find(s => s.value === status);
    return found || paymentStatusOptions[0];
  };

  // ✅ Format Date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // ✅ Get Stats
  const getStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.orderStatus === 'pending').length;
    const processing = orders.filter(o => o.orderStatus === 'processing').length;
    const shipped = orders.filter(o => o.orderStatus === 'shipped').length;
    const delivered = orders.filter(o => o.orderStatus === 'delivered').length;
    const cancelled = orders.filter(o => o.orderStatus === 'cancelled').length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    return { total, pending, processing, shipped, delivered, cancelled, totalRevenue };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E]"></div>
        <span className="ml-3 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h2 className="text-2xl font-bold text-gray-800">📦 Orders Management</h2>
        <button 
          onClick={fetchOrders}
          className="text-[#0F766E] hover:text-[#065F46] transition text-sm flex items-center gap-1"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-3 text-center border border-gray-200">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-sm p-3 text-center border border-yellow-200">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-yellow-600">Pending</p>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-sm p-3 text-center border border-blue-200">
          <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
          <p className="text-xs text-blue-600">Processing</p>
        </div>
        <div className="bg-purple-50 rounded-xl shadow-sm p-3 text-center border border-purple-200">
          <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
          <p className="text-xs text-purple-600">Shipped</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm p-3 text-center border border-green-200">
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          <p className="text-xs text-green-600">Delivered</p>
        </div>
        <div className="bg-red-50 rounded-xl shadow-sm p-3 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          <p className="text-xs text-red-600">Cancelled</p>
        </div>
        <div className="bg-[#D4AF37]/10 rounded-xl shadow-sm p-3 text-center border border-[#D4AF37]/20">
          <p className="text-2xl font-bold text-[#D4AF37]">PKR {stats.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-[#D4AF37]">Revenue</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="🔍 Search by order #, customer, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
          >
            <option value="all">All Status</option>
            {statusOptions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
          >
            <option value="all">All Payment</option>
            {paymentStatusOptions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-sm text-gray-400 mt-1">
            {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Orders will appear here when customers place them'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order #</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.orderStatus);
                  const paymentBadge = getPaymentBadge(order.paymentStatus);
                  
                  return (
                    <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-800">{order.orderNumber || order.id.slice(-8)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-800">{order.userName || 'Unknown'}</p>
                        <p className="text-xs text-gray-400">{order.userPhone || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {order.items?.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="text-xs">
                              <span className="text-gray-800">{item.name}</span>
                              {item.colour && <span className="text-gray-400 ml-1">🎨 {item.colour}</span>}
                              {item.size && <span className="text-gray-400 ml-1">📏 {item.size}</span>}
                              <span className="text-gray-400 ml-1">x{item.quantity}</span>
                            </div>
                          ))}
                          {order.items?.length > 2 && (
                            <p className="text-xs text-gray-400">+{order.items.length - 2} more</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-bold text-[#0F766E]">PKR {order.total?.toLocaleString() || 0}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <select
                            value={order.orderStatus || 'pending'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-[#0F766E] outline-none cursor-pointer ${statusBadge.color}`}
                            disabled={updatingId === order.id}
                          >
                            {statusOptions.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                          {updatingId === order.id && <FaSpinner className="animate-spin ml-1 text-sm" />}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${paymentBadge.color}`}>
                          {order.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => viewOrderDetails(order)}
                            className="text-blue-600 hover:text-blue-800 transition p-1.5 rounded hover:bg-blue-50"
                            title="View Details"
                          >
                            <FaEye size={15} />
                          </button>
                          <button 
                            onClick={() => sendWhatsAppToCustomer(order)}
                            className="text-[#25D366] hover:text-[#1DA851] transition p-1.5 rounded hover:bg-green-50"
                            title="Send WhatsApp"
                          >
                            <FaWhatsapp size={15} />
                          </button>
                          <button 
                            onClick={() => deleteOrder(order.id)}
                            className="text-red-600 hover:text-red-800 transition p-1.5 rounded hover:bg-red-50"
                            title="Delete Order"
                          >
                            <FaTrash size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-500 flex justify-between items-center">
            <span>Showing {filteredOrders.length} of {orders.length} orders</span>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      )}

      {/* ✅ Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaBox className="text-[#D4AF37]" /> Order Details
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Order Number</p>
                  <p className="font-medium text-gray-800">{selectedOrder.orderNumber || selectedOrder.id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium text-gray-800">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(selectedOrder.orderStatus).color}`}>
                    {selectedOrder.orderStatus || 'pending'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPaymentBadge(selectedOrder.paymentStatus).color}`}>
                    {selectedOrder.paymentStatus || 'pending'}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUser className="text-[#0F766E]" /> Customer Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-gray-500">Name:</span> {selectedOrder.userName || 'N/A'}</p>
                  <p><span className="text-gray-500 flex items-center gap-1"><FaPhone size={12} /> Phone:</span> {selectedOrder.userPhone || 'N/A'}</p>
                  <p className="col-span-2"><span className="text-gray-500 flex items-center gap-1"><FaEnvelope size={12} /> Email:</span> {selectedOrder.userEmail || 'N/A'}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#0F766E]" /> Shipping Address
                </h4>
                <div className="text-sm space-y-0.5">
                  <p className="font-medium">{selectedOrder.shippingAddress?.name || 'N/A'}</p>
                  <p>{selectedOrder.shippingAddress?.street || 'N/A'}</p>
                  <p>{selectedOrder.shippingAddress?.city || 'N/A'}, {selectedOrder.shippingAddress?.province || 'N/A'}</p>
                  <p>{selectedOrder.shippingAddress?.country || 'Pakistan'}</p>
                  <p className="text-gray-500">Phone: {selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaBox className="text-[#0F766E]" /> Order Items
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white p-2 rounded-lg border">
                      <img 
                        src={item.image || '/images/placeholder.jpg'} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span>Qty: {item.quantity} × PKR {item.price}</span>
                          {item.colour && (
                            <span className="flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded">
                              <FaPalette className="text-purple-500" size={10} /> {item.colour}
                            </span>
                          )}
                          {item.size && (
                            <span className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded">
                              <FaRuler className="text-blue-500" size={10} /> {item.size}
                            </span>
                          )}
                          {item.sku && <span className="text-gray-400 text-[10px]">SKU: {item.sku}</span>}
                        </div>
                      </div>
                      <p className="text-sm font-bold text-[#0F766E] whitespace-nowrap">PKR {item.total}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Order Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>PKR {selectedOrder.subtotal?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>PKR {selectedOrder.shipping || 0}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>- PKR {selectedOrder.discount}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-[#0F766E]">PKR {selectedOrder.total?.toLocaleString() || 0}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Payment Method: <span className="capitalize">{selectedOrder.paymentMethod || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-1">📝 Notes</h4>
                  <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Action Buttons in Modal */}
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => {
                    sendWhatsAppToCustomer(selectedOrder);
                    setShowModal(false);
                  }}
                  className="flex-1 bg-[#25D366] text-white py-2 rounded-lg hover:bg-[#1DA851] transition flex items-center justify-center gap-2"
                >
                  <FaWhatsapp /> Send WhatsApp
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
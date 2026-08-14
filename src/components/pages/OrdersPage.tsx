import React, { useState, useEffect } from 'react';
import { getUserOrders, type Order } from '../../services/orderService';
import { Link } from 'react-router-dom';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId') || 'guest';

  useEffect(() => {
    const loadOrders = async () => {
      if (userId !== 'guest') {
        const userOrders = await getUserOrders(userId);
        setOrders(userOrders);
      }
      setLoading(false);
    };
    loadOrders();
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'shipped': return 'bg-blue-100 text-blue-600';
      case 'processing': return 'bg-yellow-100 text-yellow-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📦 My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg">No orders yet</p>
          <Link to="/shop" className="mt-4 inline-block bg-[#0F766E] text-white px-6 py-2 rounded-lg hover:bg-[#065F46] transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="font-bold text-gray-800">#{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{order.items.length} items</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#0F766E]">PKR {order.total.toLocaleString()}</p>
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{order.paymentMethod}</p>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex gap-4 overflow-x-auto">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.productId} className="flex items-center gap-2 min-w-[150px]">
                      <img src={item.image || '/images/placeholder.jpg'} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-sm text-gray-400 self-center">+{order.items.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
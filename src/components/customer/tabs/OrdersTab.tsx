// src/components/customer/tabs/OrdersTab.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaSpinner } from 'react-icons/fa';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../context/AuthContext';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

const OrdersTab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userData: any = user;
  const userId = userData?.uid || userData?.id;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), where('userId', '==', userId));
        const snap = await getDocs(q);
        const data: Order[] = [];
        snap.forEach((d) => {
          const item = d.data();
          data.push({
            id: d.id,
            date: item.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A',
            total: item.total || 0,
            status: item.status || 'pending',
            items: item.items?.length || 0,
          });
        });
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-[#0F766E]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">📦 My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <FaShoppingBag className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No orders yet</p>
          <button
            onClick={() => navigate('/')}
            className="mt-3 text-[#0F766E] hover:underline text-sm"
          >
            Start Shopping →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-2xl">
                  📦
                </div>
                <div className="flex-1">
                  <p className="font-medium font-mono text-sm">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{order.date}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{order.items} items</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#0F766E]">Rs. {order.total}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
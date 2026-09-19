// src/components/customer/CustomerDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingBag, FaGift, FaSpinner } from 'react-icons/fa';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { getWishlistCount } from '../../services/wishlistService';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // ✅ Fetch dashboard data
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch orders
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', userId)
        );
        const ordersSnap = await getDocs(ordersQuery);
        const ordersData: any[] = [];
        ordersSnap.forEach((d) => {
          const data = d.data();
          ordersData.push({
            id: d.id,
            date:
              data.createdAt?.toDate?.()?.toLocaleDateString() ||
              data.createdAt ||
              'N/A',
            total: data.total || data.totalAmount || 0,
            status: data.orderStatus || data.status || 'pending',
            items: data.items?.length || 0,
          });
        });
        setOrders(ordersData);

        // ✅ Fetch wishlist count via service (correct path)
        const count = await getWishlistCount(userId);
        setWishlistCount(count);
      } catch (error) {
        console.error('❌ Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // ✅ Refresh wishlist count when it changes
    const handleWishlistUpdate = async () => {
      if (!userId) return;
      const count = await getWishlistCount(userId);
      setWishlistCount(count);
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('storage', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('storage', handleWishlistUpdate);
    };
  }, [userId]);

  const stats = [
    {
      label: 'Orders',
      value: orders.length,
      icon: <FaShoppingBag className="text-[#0F766E] text-xl" />,
    },
    {
      label: 'Wishlist',
      value: wishlistCount,
      icon: <FaHeart className="text-red-500 text-xl" />,
    },
    {
      label: 'Rewards',
      value: 0,
      icon: <FaGift className="text-purple-500 text-xl" />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-[#0F766E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl">{stat.icon}</div>
            <p className="text-xl sm:text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">📊 Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Recent Orders */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <FaShoppingBag /> Recent Orders
            </h3>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-500 mt-2">No orders yet</p>
            ) : (
              orders.slice(0, 2).map((order) => (
                <div key={order.id} className="mt-2 p-2 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="font-mono">#{order.id.slice(0, 8)}</span>
                    <span className="text-[#0F766E] font-medium">
                      Rs. {order.total}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{order.date}</span>
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
            <button
              onClick={() => navigate('/dashboard/orders')}
              className="mt-3 text-sm text-[#0F766E] hover:underline"
            >
              View All Orders →
            </button>
          </div>

          {/* Wishlist Summary */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <FaHeart className="text-red-500" /> Wishlist
            </h3>
            <p className="text-2xl font-bold text-[#0F766E] mt-2">
              {wishlistCount} items
            </p>
            <button
              onClick={() => navigate('/dashboard/wishlist')}
              className="text-xs bg-[#0F766E] text-white px-3 py-1 rounded hover:bg-[#065F46] mt-2"
            >
              View Wishlist →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
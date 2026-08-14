import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaBox, 
  FaShoppingCart, 
  FaChartLine,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { db, collection, getDocs } from '../../config/firebase';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ Fetch products
        const productsSnap = await getDocs(collection(db, 'products'));
        const productsCount = productsSnap.size;

        // ✅ Fetch orders
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const ordersCount = ordersSnap.size;

        // ✅ Fetch users
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersCount = usersSnap.size;

        setStats({
          totalUsers: usersCount,
          totalProducts: productsCount,
          totalOrders: ordersCount,
          totalRevenue: ordersCount * 2500 // ✅ Dummy calculation
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats.totalUsers, 
      icon: <FaUsers className="text-3xl" />, 
      color: 'bg-blue-500',
      change: '+12%',
      up: true
    },
    { 
      title: 'Total Products', 
      value: stats.totalProducts, 
      icon: <FaBox className="text-3xl" />, 
      color: 'bg-green-500',
      change: '+5%',
      up: true
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders, 
      icon: <FaShoppingCart className="text-3xl" />, 
      color: 'bg-purple-500',
      change: '-3%',
      up: false
    },
    { 
      title: 'Total Revenue', 
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`, 
      icon: <FaChartLine className="text-3xl" />, 
      color: 'bg-yellow-500',
      change: '+8%',
      up: true
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E]"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className={`text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  {stat.up ? (
                    <FaArrowUp className="text-green-600 text-xs" />
                  ) : (
                    <FaArrowDown className="text-red-600 text-xs" />
                  )}
                  <span className="text-xs text-gray-400">vs last month</span>
                </div>
              </div>
              <div className={`${stat.color} text-white p-4 rounded-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">Order #ORD-2024-{String(i+1).padStart(3, '0')}</p>
                  <p className="text-xs text-gray-500">2 items • Rs. 5,000</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  i % 2 === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {i % 2 === 0 ? 'Processing' : 'Delivered'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-[#0F766E] text-white p-4 rounded-xl hover:bg-[#065F46] transition text-sm font-medium">
              ➕ Add Product
            </button>
            <button className="bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition text-sm font-medium">
              📦 View Orders
            </button>
            <button className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition text-sm font-medium">
              👥 Manage Users
            </button>
            <button className="bg-yellow-600 text-white p-4 rounded-xl hover:bg-yellow-700 transition text-sm font-medium">
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
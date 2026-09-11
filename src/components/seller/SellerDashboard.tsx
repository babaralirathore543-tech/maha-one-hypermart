// src/components/seller/SellerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Clock, 
  DollarSign,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  pendingEarnings: number;
  availableBalance: number;
}

const SellerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 125000,
    totalOrders: 42,
    totalProducts: 18,
    pendingOrders: 6,
    pendingEarnings: 35000,
    availableBalance: 25000,
  });

  const statCards = [
    {
      title: 'Total Sales',
      value: `Rs. ${stats.totalSales.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-purple-500',
      change: '+3',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-orange-500',
      change: 'Need attention',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                <span className={`text-xs ${
                  stat.change.includes('+') ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Cards */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Earnings Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Pending Earnings</p>
              <p className="text-2xl font-bold text-emerald-700">Rs. {stats.pendingEarnings.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting settlement</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-blue-700">Rs. {stats.availableBalance.toLocaleString()}</p>
              <button className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                Request Payout
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between px-4 py-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
              <span className="text-teal-700 font-medium">Add New Product</span>
              <ChevronRight size={18} className="text-teal-700" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <span className="text-orange-700 font-medium">View Pending Orders</span>
              <ChevronRight size={18} className="text-orange-700" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="text-blue-700 font-medium">Update Store</span>
              <ChevronRight size={18} className="text-blue-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <button className="text-sm text-[#0F766E] hover:text-[#065F46] font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Order #100{i}</p>
                <p className="text-sm text-gray-500">2 items • Rs. 2,500</p>
              </div>
              <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Processing</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
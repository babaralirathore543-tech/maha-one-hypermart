// src/components/seller/SellerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Clock,
  ChevronRight,
  Store,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db, collection, query, where, getDocs, limit } from '../../config/firebase';
import StoreBuilderCard from './store-builder/StoreBuilderCard';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  pendingEarnings: number;
  availableBalance: number;
}

interface StoreInfo {
  id: string;
  slug: string;
  storeName: string;
  status: string;
}

const SellerDashboard = () => {
  const { user } = useAuth();
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    pendingEarnings: 0,
    availableBalance: 0,
  });

  // ✅ Fetch store info
  useEffect(() => {
    const fetchStore = async () => {
      if (!user?.uid) return;
      try {
        const q = query(
          collection(db, 'stores'),
          where('sellerId', '==', user.uid),
          limit(1)
        );
        const snap = await getDocs(q);

        if (snap.empty) {
          setHasStore(false);
          return;
        }

        const doc = snap.docs[0];
        const data = doc.data();
        setStoreInfo({
          id: doc.id,
          slug: data.slug || '',
          storeName: data.storeName || 'My Store',
          status: data.status || 'published',
        });
        setHasStore(true);
      } catch (error) {
        console.error('Error checking store:', error);
        setHasStore(false);
      }
    };
    fetchStore();
  }, [user?.uid]);

  const handleCopyUrl = async () => {
    if (!storeInfo?.slug) return;
    const url = `${window.location.origin}/store/${storeInfo.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy. URL: ' + url);
    }
  };

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
      {/* ✅ YOUR STORE CARD — only if store exists */}
      {hasStore && storeInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            relative overflow-hidden
            bg-gradient-to-br from-[#0F766E] to-[#065F46]
            rounded-2xl p-5 sm:p-6
            shadow-lg
            text-white
          "
        >
          {/* Decorative blurs */}
          <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -left-10 -bottom-16 w-44 h-44 rounded-full bg-[#D4AF37]/10" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {/* Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center flex-shrink-0">
                <Store size={28} className="text-[#D4AF37]" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-[#D4AF37]">
                    Your Store
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-400/30">
                    {storeInfo.status === 'published' ? '● Live' : storeInfo.status}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold mb-2 truncate">
                  {storeInfo.storeName}
                </h2>
                <code className="text-xs sm:text-sm text-white/70 font-mono truncate block">
                  mahaone.pk/store/{storeInfo.slug}
                </code>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:flex-col sm:items-stretch">
                <button
                  onClick={handleCopyUrl}
                  className="
                    flex-1 sm:flex-none
                    inline-flex items-center justify-center gap-2
                    bg-white/10 hover:bg-white/20
                    backdrop-blur
                    px-3 py-2 sm:px-4 rounded-lg
                    text-xs sm:text-sm font-medium
                    transition-colors
                    border border-white/10
                  "
                >
                  {copied ? (
                    <>
                      <Check size={14} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy
                    </>
                  )}
                </button>

                <Link
                  to={`/store/${storeInfo.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex-1 sm:flex-none
                    inline-flex items-center justify-center gap-2
                    bg-[#D4AF37] hover:bg-[#c9a52d]
                    text-gray-900
                    px-3 py-2 sm:px-4 rounded-lg
                    text-xs sm:text-sm font-bold
                    transition-colors
                    shadow-md
                  "
                >
                  <ExternalLink size={14} /> Preview
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ✅ AI Store Builder Card — only if no store */}
      {hasStore === false && <StoreBuilderCard />}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
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
                  <span
                    className={`text-xs ${
                      stat.change.includes('+') ? 'text-green-600' : 'text-orange-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Earnings + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Earnings Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Pending Earnings</p>
              <p className="text-2xl font-bold text-emerald-700">
                Rs. {stats.pendingEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Awaiting settlement</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-blue-700">
                Rs. {stats.availableBalance.toLocaleString()}
              </p>
              <button className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                Request Payout
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              to="/seller/products/add"
              className="w-full flex items-center justify-between px-4 py-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
            >
              <span className="text-teal-700 font-medium">Add New Product</span>
              <ChevronRight size={18} className="text-teal-700" />
            </Link>
            <Link
              to="/seller/orders"
              className="w-full flex items-center justify-between px-4 py-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <span className="text-orange-700 font-medium">View Pending Orders</span>
              <ChevronRight size={18} className="text-orange-700" />
            </Link>
            <Link
              to="/seller/store"
              className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-blue-700 font-medium">Update Store</span>
              <ChevronRight size={18} className="text-blue-700" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <Link
            to="/seller/orders"
            className="text-sm text-[#0F766E] hover:text-[#065F46] font-medium"
          >
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Order #100{i}</p>
                <p className="text-sm text-gray-500">2 items • Rs. 2,500</p>
              </div>
              <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                Processing
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
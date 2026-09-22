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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  db,
  collection,
  query,
  where,
  getDocs,
  limit,
} from '../../config/firebase';
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

interface RecentOrder {
  id: string;
  orderId: string;
  customerName: string;
  subtotal: number;
  items: number;
  status: string;
}

const SellerDashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [storeLoading, setStoreLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [copied, setCopied] = useState(false);

  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    pendingEarnings: 0,
    availableBalance: 0,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid) {
      setStoreLoading(false);
      setStatsLoading(false);
      setRecentLoading(false);
      return;
    }

    let cancelled = false;

    const fetchStore = async () => {
      try {
        const snap = await getDocs(
          query(
            collection(db, 'stores'),
            where('sellerId', '==', user.uid),
            limit(1)
          )
        );

        if (cancelled) return;

        if (!snap.empty) {
          const docSnap = snap.docs[0];
          const data = docSnap.data();
          setStoreInfo({
            id: docSnap.id,
            slug: data.slug || '',
            storeName: data.storeName || 'My Store',
            status: data.status || 'published',
          });
        } else {
          setStoreInfo(null);
        }
      } catch (error) {
        console.error('Error fetching store:', error);
        if (!cancelled) setStoreInfo(null);
      } finally {
        if (!cancelled) setStoreLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const [productsSnap, ordersSnap] = await Promise.all([
          getDocs(
            query(collection(db, 'products'), where('sellerId', '==', user.uid))
          ),
          getDocs(
            query(collection(db, 'sellerOrders'), where('sellerId', '==', user.uid))
          ),
        ]);

        if (cancelled) return;

        const orders: any[] = [];
        ordersSnap.forEach((d: any) =>
          orders.push({ id: d.id, ...d.data() })
        );

        const totalOrders = orders.length;
        const pendingOrders = orders.filter((o) => o.status === 'pending').length;

        const totalSales = orders.reduce(
          (sum, o) => sum + (o.subtotal || 0),
          0
        );

        const pendingEarnings = orders
          .filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
          .reduce((sum, o) => sum + (o.subtotal || 0), 0);

        const availableBalance = orders
          .filter((o) => o.status === 'delivered')
          .reduce((sum, o) => sum + (o.subtotal || 0), 0);

        setStats({
          totalSales,
          totalOrders,
          totalProducts: productsSnap.size,
          pendingOrders,
          pendingEarnings,
          availableBalance,
        });

        const sorted = [...orders].sort((a, b) => {
          const aTime =
            a.createdAt?.toDate?.()?.getTime?.() ||
            new Date(a.createdAt || 0).getTime();
          const bTime =
            b.createdAt?.toDate?.()?.getTime?.() ||
            new Date(b.createdAt || 0).getTime();
          return bTime - aTime;
        });

        const recent: RecentOrder[] = sorted.slice(0, 3).map((o) => ({
          id: o.id,
          orderId: o.orderId || o.id?.slice(0, 8) || '—',
          customerName: o.customerName || 'Customer',
          subtotal: o.subtotal || 0,
          items: Array.isArray(o.items) ? o.items.length : 0,
          status: o.status || 'pending',
        }));

        setRecentOrders(recent);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
          setRecentLoading(false);
        }
      }
    };

    fetchStore();
    fetchStats();

    return () => {
      cancelled = true;
    };
  }, [user?.uid, authLoading]);

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
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-green-500',
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Pending',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      {/* YOUR STORE */}
      {!storeLoading && storeInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#0F766E] to-[#065F46] rounded-2xl p-4 sm:p-6 shadow-lg text-white"
        >
          <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -left-10 -bottom-16 w-44 h-44 rounded-full bg-[#D4AF37]/10" />

          <div className="relative z-10">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
                  <Store size={22} className="text-[#D4AF37]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#D4AF37]">
                      Your Store
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-400/30">
                      {storeInfo.status === 'published'
                        ? '● Live'
                        : storeInfo.status}
                    </span>
                  </div>
                  <h2 className="text-base font-bold mb-0.5 truncate">
                    {storeInfo.storeName}
                  </h2>
                  <code className="text-[10px] text-white/70 font-mono block truncate">
                    /store/{storeInfo.slug}
                  </code>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyUrl}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur px-3 py-2 rounded-lg text-xs font-medium transition-colors border border-white/10 active:scale-95"
                >
                  {copied ? (
                    <><Check size={14} /> Copied</>
                  ) : (
                    <><Copy size={14} /> Copy URL</>
                  )}
                </button>

                <Link
                  to={`/store/${storeInfo.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#D4AF37] hover:bg-[#c9a52d] text-gray-900 px-3 py-2 rounded-lg text-xs font-bold transition-colors active:scale-95"
                >
                  <ExternalLink size={14} /> Preview
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Store Builder */}
      {!storeLoading && !storeInfo && <StoreBuilderCard />}

      {/* STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm p-3 sm:p-5 border border-gray-100"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                    {stat.title}
                  </p>
                  {statsLoading ? (
                    <div className="h-6 w-16 bg-gray-100 rounded animate-pulse mt-1" />
                  ) : (
                    <p className="text-base sm:text-xl font-bold text-gray-800 mt-1 truncate">
                      {stat.value}
                    </p>
                  )}
                </div>
                <div className={`${stat.color} p-2 rounded-lg shrink-0`}>
                  <Icon size={16} className="text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* EARNINGS */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Earnings Overview
          </h2>
          <Link
            to="/seller/earnings"
            className="text-xs sm:text-sm text-[#0F766E] hover:text-[#065F46] font-medium"
          >
            View Details
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3 sm:p-4">
            <p className="text-xs text-gray-600">Pending Earnings</p>
            <p className="text-lg sm:text-2xl font-bold text-emerald-700 mt-1 truncate">
              Rs. {stats.pendingEarnings.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              Awaiting settlement
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4">
            <p className="text-xs text-gray-600">Available Balance</p>
            <p className="text-lg sm:text-2xl font-bold text-blue-700 mt-1 truncate">
              Rs. {stats.availableBalance.toLocaleString()}
            </p>
            <Link
              to="/seller/earnings"
              className="inline-block mt-2 text-[10px] bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
            >
              Request Payout
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
          Quick Actions
        </h2>

        <div className="space-y-2">
          <Link
            to="/seller/products/add"
            className="w-full flex items-center justify-between px-3 py-2.5 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors active:scale-[0.98]"
          >
            <span className="text-xs sm:text-sm text-teal-700 font-medium">
              Add New Product
            </span>
            <ChevronRight size={16} className="text-teal-700" />
          </Link>

          <Link
            to="/seller/orders"
            className="w-full flex items-center justify-between px-3 py-2.5 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors active:scale-[0.98]"
          >
            <span className="text-xs sm:text-sm text-orange-700 font-medium">
              View Pending Orders
            </span>
            <ChevronRight size={16} className="text-orange-700" />
          </Link>

          <Link
            to="/seller/store"
            className="w-full flex items-center justify-between px-3 py-2.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors active:scale-[0.98]"
          >
            <span className="text-xs sm:text-sm text-blue-700 font-medium">
              Update Store
            </span>
            <ChevronRight size={16} className="text-blue-700" />
          </Link>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Recent Orders
          </h2>
          <Link
            to="/seller/orders"
            className="text-xs sm:text-sm text-[#0F766E] hover:text-[#065F46] font-medium"
          >
            View All
          </Link>
        </div>

        {recentLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag size={40} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No orders yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Orders will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800 text-sm truncate">
                    #{order.orderId}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {order.customerName} • {order.items}{' '}
                    {order.items === 1 ? 'item' : 'items'} • Rs.{' '}
                    {order.subtotal.toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-2 py-1 text-[10px] rounded-full shrink-0 capitalize ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : order.status === 'processing'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === 'shipped'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
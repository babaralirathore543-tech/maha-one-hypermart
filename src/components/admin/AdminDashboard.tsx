// src/components/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  FaUsers, FaBox, FaShoppingCart, FaChartLine,
  FaExclamationTriangle, FaPalette, FaRuler, FaClock,
  FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaMoneyBillWave,
} from 'react-icons/fa';
import { db } from '../../config/firebase';
import {
  collection, collectionGroup, getDocs, onSnapshot,
} from 'firebase/firestore';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { getCommissionSummary } from '../../services/orderService';
import { getCommissionRate } from '../../config/commission';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalVariants: number;
  totalColours: number;
  totalSizes: number;
  todaySales: number;
  averageOrderValue: number;

  // ✅ Commission stats
  totalCommission: number;
  pendingCommission: number;
  releasedCommission: number;
  reversedCommission: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  commission: number;
  status: string;
  items: number;
  date: Date;
  colour?: string;
  size?: string;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalVariants: 0,
    totalColours: 0,
    totalSizes: 0,
    todaySales: 0,
    averageOrderValue: 0,
    totalCommission: 0,
    pendingCommission: 0,
    releasedCommission: 0,
    reversedCommission: 0,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any>(null);
  const [commissionChartData, setCommissionChartData] = useState<any>(null);
  const [colourData, setColourData] = useState<any>(null);
  const [sizeData, setSizeData] = useState<any>(null);

  const commissionRate = getCommissionRate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const productsSnap = await getDocs(collection(db, 'products'));
        const products = productsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        let allVariants: any[] = [];
        let lowStock = 0;
        let outOfStock = 0;
        const uniqueColours = new Set<string>();
        const uniqueSizes = new Set<string>();

        try {
          const variantsSnap = await getDocs(collectionGroup(db, 'variants'));
          allVariants = variantsSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));

          allVariants.forEach((v: any) => {
            if (v.stock === 0) outOfStock++;
            else if (v.stock <= 5) lowStock++;
            if (v.colour) uniqueColours.add(v.colour);
            if (v.size) uniqueSizes.add(v.size);
          });
        } catch (err) {
          console.warn('⚠️ collectionGroup("variants") failed:', err);
        }

        const ordersSnap = await getDocs(collection(db, 'orders'));
        const orders = ordersSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // ✅ Status counters
        const pending = orders.filter((o: any) => o.orderStatus === 'pending').length;
        const processing = orders.filter((o: any) => o.orderStatus === 'processing').length;
        const completed = orders.filter((o: any) => o.orderStatus === 'delivered').length;
        const cancelled = orders.filter((o: any) => o.orderStatus === 'cancelled').length;

        const totalRevenue = orders.reduce(
          (sum: number, o: any) => sum + (o.total || 0),
          0
        );

        // ✅ COMMISSION — actual fields use karo, fallback calculation
        let totalCommission = 0;
        let pendingCommission = 0;
        let releasedCommission = 0;
        let reversedCommission = 0;

        const monthlyCommission = new Array(12).fill(0);

        orders.forEach((o: any) => {
          const subtotal = o.subtotal || 0;
          const commission =
            o.commission ||
            Math.round(((subtotal * commissionRate) / 100) * 100) / 100;

          totalCommission += commission;

          const status = o.commissionStatus || 'pending';
          if (status === 'released') releasedCommission += commission;
          else if (status === 'reversed') reversedCommission += commission;
          else pendingCommission += commission;

          // Monthly commission for chart
          const date = o.createdAt?.toDate?.() || new Date(o.createdAt);
          const month = date.getMonth();
          if (!isNaN(month)) {
            monthlyCommission[month] += commission;
          }
        });

        // Today's sales
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = orders.filter((o: any) => {
          const orderDate = o.createdAt?.toDate?.() || new Date(o.createdAt);
          return orderDate >= today && o.orderStatus === 'delivered';
        });
        const todaySales = todayOrders.reduce(
          (sum: number, o: any) => sum + (o.total || 0),
          0
        );

        const avgOrderValue =
          orders.length > 0 ? totalRevenue / orders.length : 0;

        const usersSnap = await getDocs(collection(db, 'users'));
        const usersCount = usersSnap.size;

        // ✅ Recent orders — commission bhi include karo
        const recentOrdersData: RecentOrder[] = orders
          .sort((a: any, b: any) => {
            const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
            const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 5)
          .map((o: any) => {
            const subtotal = o.subtotal || 0;
            const commission =
              o.commission ||
              Math.round(((subtotal * commissionRate) / 100) * 100) / 100;

            return {
              id: o.id || '',
              orderNumber: o.orderNumber || `ORD-${(o.id || '').slice(0, 8)}`,
              customerName:
                o.userName ||
                o.customer?.name ||
                o.shippingAddress?.name ||
                'Guest',
              total: o.total || 0,
              commission,
              status: o.orderStatus || 'pending',
              items: o.items?.length || 0,
              date: o.createdAt?.toDate?.() || new Date(o.createdAt),
              colour: o.items?.[0]?.colour,
              size: o.items?.[0]?.size,
            };
          });

        // Top products
        const productSales: {
          [key: string]: { name: string; sales: number; revenue: number; image: string };
        } = {};
        orders.forEach((order: any) => {
          order.items?.forEach((item: any) => {
            const key = item.productId || item.id;
            if (!key) return;
            if (!productSales[key]) {
              productSales[key] = {
                name: item.name || item.productName || 'Unknown',
                sales: 0,
                revenue: 0,
                image: item.image || '',
              };
            }
            productSales[key].sales += item.quantity || 1;
            productSales[key].revenue += (item.price || 0) * (item.quantity || 1);
          });
        });

        const topProductsData = Object.entries(productSales)
          .map(([id, data]) => ({ id, ...data }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5);

        // Monthly sales
        const monthlySales = new Array(12).fill(0);
        orders.forEach((order: any) => {
          const date = order.createdAt?.toDate?.() || new Date(order.createdAt);
          const month = date.getMonth();
          if (!isNaN(month)) {
            monthlySales[month] += order.total || 0;
          }
        });

        setSalesData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Monthly Sales (Rs.)',
              data: monthlySales,
              borderColor: '#0F766E',
              backgroundColor: 'rgba(15, 118, 110, 0.1)',
              fill: true,
              tension: 0.4,
            },
          ],
        });

        // ✅ Commission chart
        setCommissionChartData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Monthly Commission (Rs.)',
              data: monthlyCommission,
              borderColor: '#D4AF37',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              fill: true,
              tension: 0.4,
            },
          ],
        });

        // Colour distribution
        const colourCount: { [key: string]: number } = {};
        allVariants.forEach((v: any) => {
          if (v.colour) colourCount[v.colour] = (colourCount[v.colour] || 0) + 1;
        });

        setColourData({
          labels: Object.keys(colourCount),
          datasets: [
            {
              label: 'Products by Colour',
              data: Object.values(colourCount),
              backgroundColor: [
                '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
                '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
              ],
            },
          ],
        });

        const sizeCount: { [key: string]: number } = {};
        allVariants.forEach((v: any) => {
          if (v.size) sizeCount[v.size] = (sizeCount[v.size] || 0) + 1;
        });

        setSizeData({
          labels: Object.keys(sizeCount),
          datasets: [
            {
              label: 'Products by Size',
              data: Object.values(sizeCount),
              backgroundColor: '#0F766E',
            },
          ],
        });

        setStats({
          totalUsers: usersCount,
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders: pending,
          processingOrders: processing,
          completedOrders: completed,
          cancelledOrders: cancelled,
          lowStockProducts: lowStock,
          outOfStockProducts: outOfStock,
          totalVariants: allVariants.length,
          totalColours: uniqueColours.size,
          totalSizes: uniqueSizes.size,
          todaySales,
          averageOrderValue: avgOrderValue,
          totalCommission,
          pendingCommission,
          releasedCommission,
          reversedCommission,
        });

        setRecentOrders(recentOrdersData);
        setTopProducts(topProductsData);

        // ✅ Also fetch live commission summary (in case of server-side updates)
        try {
          const commissionData = await getCommissionSummary();
          setStats((prev) => ({
            ...prev,
            totalCommission: commissionData.totalCommission,
            pendingCommission: commissionData.pendingCommission,
            releasedCommission: commissionData.releasedCommission,
            reversedCommission: commissionData.reversedCommission,
          }));
        } catch (err) {
          console.warn('Commission summary fetch failed:', err);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    // Real-time orders
    const ordersUnsubscribe = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const orders = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        const pending = orders.filter((o: any) => o.orderStatus === 'pending').length;
        const processing = orders.filter((o: any) => o.orderStatus === 'processing').length;
        const completed = orders.filter((o: any) => o.orderStatus === 'delivered').length;
        const cancelled = orders.filter((o: any) => o.orderStatus === 'cancelled').length;

        // Recalculate commission on the fly
        let totalCommission = 0;
        let pendingCommission = 0;
        let releasedCommission = 0;
        let reversedCommission = 0;

        orders.forEach((o: any) => {
          const subtotal = o.subtotal || 0;
          const commission =
            o.commission ||
            Math.round(((subtotal * commissionRate) / 100) * 100) / 100;

          totalCommission += commission;

          const status = o.commissionStatus || 'pending';
          if (status === 'released') releasedCommission += commission;
          else if (status === 'reversed') reversedCommission += commission;
          else pendingCommission += commission;
        });

        setStats((prev) => ({
          ...prev,
          totalOrders: orders.length,
          pendingOrders: pending,
          processingOrders: processing,
          completedOrders: completed,
          cancelledOrders: cancelled,
          totalCommission,
          pendingCommission,
          releasedCommission,
          reversedCommission,
        }));
      },
      (error) => {
        console.error('Error listening to orders:', error);
      }
    );

    return () => {
      ordersUnsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // ============================================================
  // STAT CARDS — with Commission
  // ============================================================
  const statCards = [
    {
      title: 'Total Revenue',
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
      icon: <FaChartLine />,
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    },
    {
      title: 'Total Commission',
      value: `Rs. ${stats.totalCommission.toLocaleString()}`,
      icon: <FaMoneyBillWave />,
      color: 'bg-gradient-to-br from-orange-400 to-orange-600',
      subtitle: `${commissionRate}% per order`,
    },
    {
      title: "Today's Sales",
      value: `Rs. ${stats.todaySales.toLocaleString()}`,
      icon: <FaShoppingCart />,
      color: 'bg-gradient-to-br from-green-400 to-green-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <FaBox />,
      color: 'bg-gradient-to-br from-blue-400 to-blue-600',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FaUsers />,
      color: 'bg-gradient-to-br from-purple-400 to-purple-600',
    },
  ];

  const statusCards = [
    { title: 'Pending', value: stats.pendingOrders, icon: <FaHourglassHalf />, color: 'bg-yellow-100 text-yellow-800' },
    { title: 'Processing', value: stats.processingOrders, icon: <FaClock />, color: 'bg-blue-100 text-blue-800' },
    { title: 'Delivered', value: stats.completedOrders, icon: <FaCheckCircle />, color: 'bg-green-100 text-green-800' },
    { title: 'Cancelled', value: stats.cancelledOrders, icon: <FaTimesCircle />, color: 'bg-red-100 text-red-800' },
  ];

  const stockCards = [
    { title: 'Low Stock', value: stats.lowStockProducts, icon: <FaExclamationTriangle />, color: 'bg-orange-100 text-orange-800' },
    { title: 'Out of Stock', value: stats.outOfStockProducts, icon: <FaTimesCircle />, color: 'bg-red-100 text-red-800' },
    { title: 'Total Variants', value: stats.totalVariants, icon: <FaPalette />, color: 'bg-purple-100 text-purple-800' },
    { title: 'Avg Order Value', value: `Rs. ${stats.averageOrderValue.toFixed(0)}`, icon: <FaChartLine />, color: 'bg-teal-100 text-teal-800' },
  ];

  const variantStats = [
    { title: 'Total Colours', value: stats.totalColours, icon: <FaPalette />, color: 'bg-pink-100 text-pink-800' },
    { title: 'Total Sizes', value: stats.totalSizes, icon: <FaRuler />, color: 'bg-indigo-100 text-indigo-800' },
  ];

  // ✅ Commission cards
  const commissionCards = [
    {
      title: 'Pending Commission',
      value: `Rs. ${stats.pendingCommission.toLocaleString()}`,
      description: 'Awaiting delivery',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    },
    {
      title: 'Released Commission',
      value: `Rs. ${stats.releasedCommission.toLocaleString()}`,
      description: 'Delivered orders',
      color: 'bg-green-50 border-green-200 text-green-800',
    },
    {
      title: 'Reversed Commission',
      value: `Rs. ${stats.reversedCommission.toLocaleString()}`,
      description: 'Cancelled orders',
      color: 'bg-red-50 border-red-200 text-red-800',
    },
    {
      title: 'Net Payout to Sellers',
      value: `Rs. ${(stats.totalRevenue - stats.totalCommission).toLocaleString()}`,
      description: `${commissionRate}% deducted`,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0F766E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <button className="bg-[#0F766E] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#065F46] transition text-xs sm:text-sm">
          <FaClock className="inline mr-1 sm:mr-2" />
          Last 30 Days
        </button>
      </div>

      {/* Main Stats — 5 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-3 sm:p-5 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] sm:text-sm text-gray-500 font-medium truncate">
                  {stat.title}
                </p>
                <p className="text-sm sm:text-xl font-bold text-gray-800 mt-1 truncate">
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">
                    {stat.subtitle}
                  </p>
                )}
              </div>
              <div className={`${stat.color} text-white p-2 sm:p-3 rounded-xl shadow-lg text-sm sm:text-xl shrink-0`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Commission Overview */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 border border-[#D4AF37]/20">
        <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
          <FaMoneyBillWave className="text-[#D4AF37]" />
          Commission Overview ({commissionRate}% per sale)
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {commissionCards.map((card, i) => (
            <div
              key={i}
              className={`${card.color} rounded-lg p-3 sm:p-4 border`}
            >
              <p className="text-[10px] sm:text-xs font-medium opacity-80">
                {card.title}
              </p>
              <p className="text-sm sm:text-lg font-bold mt-1 truncate">
                {card.value}
              </p>
              <p className="text-[9px] sm:text-[10px] opacity-70 mt-0.5">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Status & Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
            <FaBox className="text-[#0F766E]" />
            Order Status Overview
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {statusCards.map((card, i) => (
              <div key={i} className={`${card.color} rounded-lg p-3 sm:p-4`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium truncate">{card.title}</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1">{card.value}</p>
                  </div>
                  <div className="opacity-75 text-sm sm:text-base shrink-0">{card.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
            <FaExclamationTriangle className="text-orange-500" />
            Inventory Overview
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {stockCards.map((card, i) => (
              <div key={i} className={`${card.color} rounded-lg p-3 sm:p-4`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium truncate">{card.title}</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1 truncate">{card.value}</p>
                  </div>
                  <div className="opacity-75 text-sm sm:text-base shrink-0">{card.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Colour & Size Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        {variantStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-3 sm:p-6 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] sm:text-sm text-gray-500 font-medium truncate">
                  {stat.title}
                </p>
                <p className="text-lg sm:text-3xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-2 sm:p-4 rounded-xl text-sm sm:text-2xl shrink-0`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
            Revenue Overview
          </h3>
          {salesData && (
            <div className="h-56 sm:h-64">
              <Line
                data={salesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function (value: any) {
                          return `Rs. ${value.toLocaleString()}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
            <FaMoneyBillWave className="text-[#D4AF37]" />
            Commission Trend
          </h3>
          {commissionChartData && (
            <div className="h-56 sm:h-64">
              <Line
                data={commissionChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function (value: any) {
                          return `Rs. ${value.toLocaleString()}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Colour & Size Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
            Products by Colour
          </h3>
          {colourData && Object.keys(colourData.labels || {}).length > 0 && (
            <div className="h-56 sm:h-64 flex justify-center">
              <Doughnut
                data={colourData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { boxWidth: 12, font: { size: 10 }, padding: 8 },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
            Products by Size
          </h3>
          {sizeData && (
            <div className="h-56 sm:h-64">
              <Bar
                data={sizeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
              Recent Orders
            </h3>
            <button className="text-xs sm:text-sm text-[#0F766E] hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3 max-h-80 overflow-y-auto">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-1 sm:px-2 rounded-lg transition gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                      {order.orderNumber}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                      {order.customerName}
                    </p>
                    {order.commission > 0 && (
                      <p className="text-[10px] text-orange-600 font-medium mt-0.5">
                        💰 Commission: Rs. {order.commission.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 whitespace-nowrap">
                      Rs. {order.total.toLocaleString()}
                    </p>
                    <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8 text-sm">No recent orders</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
              Top Selling Products
            </h3>
            <button className="text-xs sm:text-sm text-[#0F766E] hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3 max-h-80 overflow-y-auto">
            {topProducts.length > 0 ? (
              topProducts.map((product, i) => (
                <div
                  key={product.id}
                  className="flex items-center gap-2 sm:gap-3 py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-gray-600 shrink-0">
                    #{i + 1}
                  </div>
                  <img
                    src={product.image || '/images/placeholder.jpg'}
                    alt={product.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-semibold text-[#0F766E] whitespace-nowrap">
                      Rs. {product.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8 text-sm">
                No products sold yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
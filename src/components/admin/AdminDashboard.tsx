// src/components/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaBox, 
  FaShoppingCart, 
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaPalette,
  FaRuler,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf
} from 'react-icons/fa';
import { db } from '../../config/firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalVariants: number;
  totalColours: number;
  totalSizes: number;
  todaySales: number;
  averageOrderValue: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
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
    completedOrders: 0,
    cancelledOrders: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalVariants: 0,
    totalColours: 0,
    totalSizes: 0,
    todaySales: 0,
    averageOrderValue: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any>(null);
  const [colourData, setColourData] = useState<any>(null);
  const [sizeData, setSizeData] = useState<any>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Products
        const productsSnap = await getDocs(collection(db, 'products'));
        const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // 2. Fetch all variants
        let allVariants: any[] = [];
        let lowStock = 0;
        let outOfStock = 0;
        const uniqueColours = new Set<string>();
        const uniqueSizes = new Set<string>();

        for (const product of products) {
          const variantsRef = collection(db, 'products', product.id, 'variants');
          const variantsSnap = await getDocs(variantsRef);
          const variants = variantsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          allVariants = [...allVariants, ...variants];
          
          variants.forEach((v: any) => {
            if (v.stock === 0) outOfStock++;
            else if (v.stock <= 5) lowStock++;
            
            if (v.colour) uniqueColours.add(v.colour);
            if (v.size) uniqueSizes.add(v.size);
          });
        }

        // 3. Fetch Orders
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const pending = orders.filter((o: any) => o.orderStatus === 'pending' || o.orderStatus === 'processing').length;
        const completed = orders.filter((o: any) => o.orderStatus === 'delivered').length;
        const cancelled = orders.filter((o: any) => o.orderStatus === 'cancelled').length;
        
        const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = orders.filter((o: any) => {
          const orderDate = o.createdAt?.toDate?.() || new Date(o.createdAt);
          return orderDate >= today && o.orderStatus === 'delivered';
        });
        const todaySales = todayOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
        
        const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

        // 4. Users
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersCount = usersSnap.size;

        // 5. Recent Orders
        const recentOrdersData: RecentOrder[] = orders
          .sort((a: any, b: any) => {
            const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
            const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 5)
          .map((o: any) => ({
            id: o.id || '',
            orderNumber: o.orderNumber || `ORD-${(o.id || '').slice(0, 8)}`,
            customerName: o.customer?.name || 'Guest',
            total: o.total || 0,
            status: o.orderStatus || 'pending',
            items: o.items?.length || 0,
            date: o.createdAt?.toDate?.() || new Date(o.createdAt),
            colour: o.items?.[0]?.colour,
            size: o.items?.[0]?.size
          }));

        // 6. Top Products
        const productSales: { [key: string]: { name: string, sales: number, revenue: number, image: string } } = {};
        orders.forEach((order: any) => {
          order.items?.forEach((item: any) => {
            const key = item.productId;
            if (!productSales[key]) {
              productSales[key] = {
                name: item.productName || 'Unknown',
                sales: 0,
                revenue: 0,
                image: item.image || ''
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

        // 7. Chart Data
        const monthlySales = new Array(12).fill(0);
        orders.forEach((order: any) => {
          const date = order.createdAt?.toDate?.() || new Date(order.createdAt);
          const month = date.getMonth();
          monthlySales[month] += order.total || 0;
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
              tension: 0.4
            }
          ]
        });

        // 8. Colour Distribution
        const colourCount: { [key: string]: number } = {};
        allVariants.forEach((v: any) => {
          if (v.colour) {
            colourCount[v.colour] = (colourCount[v.colour] || 0) + 1;
          }
        });
        
        setColourData({
          labels: Object.keys(colourCount),
          datasets: [
            {
              label: 'Products by Colour',
              data: Object.values(colourCount),
              backgroundColor: [
                '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
                '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
              ]
            }
          ]
        });

        // 9. Size Distribution
        const sizeCount: { [key: string]: number } = {};
        allVariants.forEach((v: any) => {
          if (v.size) {
            sizeCount[v.size] = (sizeCount[v.size] || 0) + 1;
          }
        });
        
        setSizeData({
          labels: Object.keys(sizeCount),
          datasets: [
            {
              label: 'Products by Size',
              data: Object.values(sizeCount),
              backgroundColor: '#0F766E'
            }
          ]
        });

        setStats({
          totalUsers: usersCount,
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: totalRevenue,
          pendingOrders: pending,
          completedOrders: completed,
          cancelledOrders: cancelled,
          lowStockProducts: lowStock,
          outOfStockProducts: outOfStock,
          totalVariants: allVariants.length,
          totalColours: uniqueColours.size,
          totalSizes: uniqueSizes.size,
          todaySales: todaySales,
          averageOrderValue: avgOrderValue
        });

        setRecentOrders(recentOrdersData);
        setTopProducts(topProductsData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    // Real-time orders listener
    const ordersUnsubscribe = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const pending = orders.filter((o: any) => o.orderStatus === 'pending' || o.orderStatus === 'processing').length;
        const completed = orders.filter((o: any) => o.orderStatus === 'delivered').length;
        const cancelled = orders.filter((o: any) => o.orderStatus === 'cancelled').length;
        
        setStats(prev => ({
          ...prev,
          totalOrders: orders.length,
          pendingOrders: pending,
          completedOrders: completed,
          cancelledOrders: cancelled
        }));
      },
      (error) => {
        console.error('Error listening to orders:', error);
      }
    );

    return () => {
      ordersUnsubscribe();
    };
  }, []);

  // Helper function for status colors
  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'returned': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statCards = [
    { 
      title: 'Total Revenue', 
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`, 
      icon: <FaChartLine className="text-3xl" />, 
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      change: '+8%',
      up: true
    },
    { 
      title: 'Today\'s Sales', 
      value: `Rs. ${stats.todaySales.toLocaleString()}`, 
      icon: <FaShoppingCart className="text-3xl" />, 
      color: 'bg-gradient-to-br from-green-400 to-green-600',
      change: '+12%',
      up: true
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders, 
      icon: <FaBox className="text-3xl" />, 
      color: 'bg-gradient-to-br from-blue-400 to-blue-600',
      change: '+5%',
      up: true
    },
    { 
      title: 'Total Users', 
      value: stats.totalUsers, 
      icon: <FaUsers className="text-3xl" />, 
      color: 'bg-gradient-to-br from-purple-400 to-purple-600',
      change: '+15%',
      up: true
    },
  ];

  const statusCards = [
    { 
      title: 'Pending', 
      value: stats.pendingOrders, 
      icon: <FaHourglassHalf className="text-xl" />, 
      color: 'bg-yellow-100 text-yellow-800' 
    },
    { 
      title: 'Processing', 
      value: stats.pendingOrders, 
      icon: <FaClock className="text-xl" />, 
      color: 'bg-blue-100 text-blue-800' 
    },
    { 
      title: 'Delivered', 
      value: stats.completedOrders, 
      icon: <FaCheckCircle className="text-xl" />, 
      color: 'bg-green-100 text-green-800' 
    },
    { 
      title: 'Cancelled', 
      value: stats.cancelledOrders, 
      icon: <FaTimesCircle className="text-xl" />, 
      color: 'bg-red-100 text-red-800' 
    },
  ];

  const stockCards = [
    { 
      title: 'Low Stock', 
      value: stats.lowStockProducts, 
      icon: <FaExclamationTriangle className="text-xl" />, 
      color: 'bg-orange-100 text-orange-800' 
    },
    { 
      title: 'Out of Stock', 
      value: stats.outOfStockProducts, 
      icon: <FaTimesCircle className="text-xl" />, 
      color: 'bg-red-100 text-red-800' 
    },
    { 
      title: 'Total Variants', 
      value: stats.totalVariants, 
      icon: <FaPalette className="text-xl" />, 
      color: 'bg-purple-100 text-purple-800' 
    },
    { 
      title: 'Avg Order Value', 
      value: `Rs. ${stats.averageOrderValue.toFixed(0)}`, 
      icon: <FaChartLine className="text-xl" />, 
      color: 'bg-teal-100 text-teal-800' 
    },
  ];

  const variantStats = [
    { 
      title: 'Total Colours', 
      value: stats.totalColours, 
      icon: <FaPalette className="text-2xl" />, 
      color: 'bg-pink-100 text-pink-800' 
    },
    { 
      title: 'Total Sizes', 
      value: stats.totalSizes, 
      icon: <FaRuler className="text-2xl" />, 
      color: 'bg-indigo-100 text-indigo-800' 
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition text-sm">
            <FaClock className="inline mr-2" />
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300">
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
              <div className={`${stat.color} text-white p-4 rounded-xl shadow-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status & Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaBox className="text-[#0F766E]" />
            Order Status Overview
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {statusCards.map((card, i) => (
              <div key={i} className={`${card.color} rounded-lg p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium">{card.title}</p>
                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                  </div>
                  <div className="opacity-75">{card.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-orange-500" />
            Inventory Overview
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {stockCards.map((card, i) => (
              <div key={i} className={`${card.color} rounded-lg p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium">{card.title}</p>
                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                  </div>
                  <div className="opacity-75">{card.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Colour & Size Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {variantStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue Overview</h3>
          {salesData && (
            <div className="h-64">
              <Line 
                data={salesData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value: any) {
                          return `Rs. ${value.toLocaleString()}`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Products by Colour</h3>
          {colourData && (
            <div className="h-64 flex justify-center">
              <Doughnut 
                data={colourData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Size Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Products by Size</h3>
        {sizeData && (
          <div className="h-64">
            <Bar 
              data={sizeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Orders</h3>
            <button className="text-sm text-[#0F766E] hover:underline">View All</button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.customerName}</p>
                    {order.colour && order.size && (
                      <p className="text-xs text-gray-400 mt-1">
                        <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: order.colour.toLowerCase() }}></span>
                        {order.colour} • {order.size}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">Rs. {order.total.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No recent orders</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Top Selling Products</h3>
            <button className="text-sm text-[#0F766E] hover:underline">View All</button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {topProducts.length > 0 ? (
              topProducts.map((product, i) => (
                <div key={product.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    #{i + 1}
                  </div>
                  <img 
                    src={product.image || '/images/placeholder.jpg'} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#0F766E]">Rs. {product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No products sold yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button className="bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white p-4 rounded-xl hover:shadow-lg transition text-sm font-medium">
            ➕ Add Product
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-xl hover:shadow-lg transition text-sm font-medium">
            📦 View Orders
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl hover:shadow-lg transition text-sm font-medium">
            👥 Manage Users
          </button>
          <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl hover:shadow-lg transition text-sm font-medium">
            📊 Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
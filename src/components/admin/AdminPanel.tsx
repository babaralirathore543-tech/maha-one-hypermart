// src/components/admin/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaCog,
  FaSignOutAlt,
  FaStore,
  FaSeedling,
  FaTshirt,
  FaPlus,
  FaCookie  // ✅ Correct - exists in react-icons/fa
} from 'react-icons/fa';
import { db, collection, getDocs } from '../../config/firebase';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminCategories from './AdminCategories';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<any[]>([]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
    fetchProducts();
  }, [isAdmin, navigate]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('userUpdated'));
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  // ✅ Category Statistics
  const getCategoryStats = () => {
    const fashion = products.filter(p => p.category === 'fashion').length;
    const dryFruits = products.filter(p => p.category === 'dryfruits' || p.category === 'dry-fruits').length;
    const sweets = products.filter(p => p.category === 'sweets').length;
    const other = products.filter(p => p.category !== 'fashion' && p.category !== 'dryfruits' && p.category !== 'dry-fruits' && p.category !== 'sweets').length;
    return { fashion, dryFruits, sweets, other };
  };

  const categoryStats = getCategoryStats();

  const stats = [
    { title: 'Total Products', value: products.length, icon: <FaBox />, color: 'bg-blue-500' },
    { title: 'Fashion', value: categoryStats.fashion, icon: <FaTshirt />, color: 'bg-purple-500' },
    { title: 'Dry Fruits', value: categoryStats.dryFruits, icon: <FaSeedling />, color: 'bg-green-500' },
    { title: 'Sweets', value: categoryStats.sweets, icon: <FaCookie />, color: 'bg-pink-500' },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
    { id: 'products', label: 'Products', icon: <FaBox /> },
    { id: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'categories', label: 'Categories', icon: <FaCog /> },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'products': return <AdminProducts />;
      case 'orders': return <AdminOrders />;
      case 'users': return <AdminUsers />;
      case 'categories': return <AdminCategories />;
      default: return <AdminDashboard />;
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0F0A1A]">
      {/* Header */}
      <header className="bg-[#0F766E] dark:bg-[#181028] text-white p-4 shadow-lg border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FaStore className="text-2xl" />
            <h1 className="text-xl font-bold">Maha One Admin</h1>
            <span className="text-xs bg-[#D4AF37]/20 px-2 py-0.5 rounded-full text-[#D4AF37] ml-2">
              v2.0
            </span>
          </div>
          
          {/* ✅ Quick Add Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/products/add"
              className="bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
            >
              <FaPlus /> Fashion
            </Link>
            <Link
              to="/admin/dryfruits/add"
              className="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
            >
              <FaPlus /> Dry Fruits
            </Link>
            <Link
              to="/admin/sweets/add"
              className="bg-pink-600 hover:bg-pink-700 px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
            >
              <FaPlus /> Sweets
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 bg-white dark:bg-[#1F2937] rounded-xl shadow-sm p-4 h-fit border border-gray-200 dark:border-gray-700">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition ${
                    activeTab === item.id
                      ? 'bg-[#0F766E] dark:bg-[#7C3AED] text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
            
            {/* ✅ Category Quick Links */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Quick Add</p>
              <div className="grid grid-cols-3 gap-1.5">
                <Link
                  to="/admin/products/add"
                  className="text-center p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/40 transition text-xs"
                >
                  👕 Fashion
                </Link>
                <Link
                  to="/admin/dryfruits/add"
                  className="text-center p-2 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 transition text-xs"
                >
                  🌱 Dry
                </Link>
                <Link
                  to="/admin/sweets/add"
                  className="text-center p-2 rounded-lg bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-900/40 transition text-xs"
                >
                  🍬 Sweets
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-[#1F2937] rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
                  <div className={`${stat.color} text-white w-8 h-8 rounded-lg flex items-center justify-center mt-2 text-sm`}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
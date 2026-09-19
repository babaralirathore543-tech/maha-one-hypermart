// src/components/admin/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaStore,
  FaSeedling,
  FaTshirt,
  FaPlus,
  FaCookie,
  FaUserPlus,
  FaBars,
  FaTimes,
  FaLeaf,
  FaCheckCircle,
} from 'react-icons/fa';
import { db, collection, getDocs } from '../../config/firebase';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminSellerManagement from './AdminSellerManagement';
import AdminProductsApproval from './AdminProductsApproval';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
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

  // ✅ Category Stats
  const getCategoryStats = () => {
    const fashion = products.filter((p) => p.category === 'fashion').length;
    const dryFruits = products.filter(
      (p) => p.category === 'dryfruits' || p.category === 'dry-fruits'
    ).length;
    const sweets = products.filter((p) => p.category === 'sweets').length;
    const herbal = products.filter((p) => p.category === 'herbal').length;
    return { fashion, dryFruits, sweets, herbal };
  };

  const categoryStats = getCategoryStats();

  // ✅ Stats Cards
  const stats = [
    { title: 'Total Products', value: products.length, icon: <FaBox />, color: 'bg-blue-500' },
    { title: 'Fashion', value: categoryStats.fashion, icon: <FaTshirt />, color: 'bg-purple-500' },
    { title: 'Dry Fruits', value: categoryStats.dryFruits, icon: <FaSeedling />, color: 'bg-green-500' },
    { title: 'Sweets', value: categoryStats.sweets, icon: <FaCookie />, color: 'bg-pink-500' },
    { title: 'Herbal', value: categoryStats.herbal, icon: <FaLeaf />, color: 'bg-emerald-500' },
  ];

  // ✅ Menu Items — Categories Removed
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
    { id: 'add-product', label: 'Add Product', icon: <FaPlus />, isLink: true, link: '/admin/products/add' },
    { id: 'products', label: 'Products', icon: <FaBox /> },
    { id: 'products-approval', label: 'Products Approval', icon: <FaCheckCircle /> },
    { id: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'sellers', label: 'Sellers', icon: <FaUserPlus /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'products': return <AdminProducts />;
      case 'products-approval': return <AdminProductsApproval />;
      case 'orders': return <AdminOrders />;
      case 'users': return <AdminUsers />;
      case 'sellers': return <AdminSellerManagement />;
      default: return <AdminDashboard />;
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0F0A1A]">
      {/* HEADER */}
      <header className="bg-[#0F766E] dark:bg-[#181028] text-white p-4 shadow-lg border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              {isSidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>

            <FaStore className="text-2xl" />
            <h1 className="text-xl font-bold">Maha One Admin</h1>
            <span className="text-xs bg-[#D4AF37]/20 px-2 py-0.5 rounded-full text-[#D4AF37] ml-2">
              v2.0
            </span>
          </div>

          {/* Right */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/products/add"
              className="bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
            >
              <FaPlus /> Add Product
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

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR */}
          <div
            className={`
              lg:w-64
              bg-white dark:bg-[#1F2937]
              rounded-xl shadow-sm p-4
              h-fit
              border border-gray-200 dark:border-gray-700
              lg:block
              ${isSidebarOpen ? 'block' : 'hidden'}
            `}
          >
            <nav className="space-y-1">
              {menuItems.map((item) => {
                // If it's a link, use Link component
                if ((item as any).isLink && (item as any).link) {
                  return (
                    <Link
                      key={item.id}
                      to={(item as any).link}
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {item.icon}
                      {item.label}
                      <span className="ml-auto text-xs bg-[#D4AF37] text-white px-2 py-0.5 rounded-full">
                        New
                      </span>
                    </Link>
                  );
                }

                // Otherwise, tab button
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition ${
                      activeTab === item.id
                        ? 'bg-[#0F766E] dark:bg-[#7C3AED] text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.icon}
                    {item.label}

                    {item.id === 'sellers' && (
                      <span className="ml-auto text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}

                    {item.id === 'products-approval' && (
                      <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 min-w-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-[#1F2937] rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700"
                >
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  <div
                    className={`${stat.color} text-white w-8 h-8 rounded-lg flex items-center justify-center mt-2 text-sm`}
                  >
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
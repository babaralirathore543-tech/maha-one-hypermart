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

  // ✅ Body class for CSS isolation
  useEffect(() => {
    document.body.classList.add('admin-active');
    return () => document.body.classList.remove('admin-active');
  }, []);

  useEffect(() => {
    if (!isAdmin) navigate('/');
    fetchProducts();
  }, [isAdmin, navigate]);

  // ✅ Body scroll lock when mobile sidebar open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  // ✅ ESC key closes sidebar
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // ✅ Auto-close on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      setProducts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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

  const stats = [
    { title: 'Products', value: products.length, icon: <FaBox />, color: 'bg-blue-500' },
    { title: 'Fashion', value: categoryStats.fashion, icon: <FaTshirt />, color: 'bg-purple-500' },
    { title: 'Dry Fruits', value: categoryStats.dryFruits, icon: <FaSeedling />, color: 'bg-green-500' },
    { title: 'Sweets', value: categoryStats.sweets, icon: <FaCookie />, color: 'bg-pink-500' },
    { title: 'Herbal', value: categoryStats.herbal, icon: <FaLeaf />, color: 'bg-emerald-500' },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
    { id: 'products', label: 'Products', icon: <FaBox /> },
    { id: 'products-approval', label: 'Products Approval', icon: <FaCheckCircle />, badge: 'Pending' },
    { id: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'sellers', label: 'Sellers', icon: <FaUserPlus />, badge: 'New' },
  ];

  const handleMenuClick = (id: string) => {
    setActiveTab(id);
    setIsSidebarOpen(false);
  };

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
    <div className="admin-layout min-h-screen bg-gray-100">

      {/* ================================================================
          LAYOUT STRUCTURE:
          
          ┌──────────────────────────────────────────┐
          │  HEADER (sticky top)                     │
          ├──────────────────────────────────────────┤
          │  MOBILE SIDEBAR (fixed, overlay+drawer)  │  ← Overlay + drawer
          ├─────────────┬────────────────────────────┤
          │  DESKTOP    │  MAIN CONTENT              │
          │  SIDEBAR    │                            │
          │  (sticky)   │                            │
          └─────────────┴────────────────────────────┘
          
          ✅ Desktop sidebar is INSIDE flex, takes space
          ✅ Mobile sidebar is FIXED, OUTSIDE flex, overlays
          ================================================================ */}

      {/* ==================== 1. HEADER ==================== */}
      <header className="bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white shadow-lg sticky top-0 z-30">
        <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
          {/* Left */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition shrink-0 active:scale-95"
              aria-label="Open menu"
            >
              <FaBars size={18} />
            </button>

            <div className="w-9 h-9 bg-[#D4AF37] rounded-xl flex items-center justify-center shrink-0">
              <FaStore className="text-lg text-[#0F766E]" />
            </div>
            <h1 className="text-base sm:text-lg font-bold truncate">
              Maha One <span className="hidden sm:inline">Admin</span>
            </h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/admin/products/add"
              className="bg-[#D4AF37] hover:bg-[#c19f2e] text-[#0F766E] px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
            >
              <FaPlus size={12} />
              <span className="hidden sm:inline">Add Product</span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 active:scale-95"
            >
              <FaSignOutAlt size={12} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. MOBILE SIDEBAR (fixed, overlays) ==================== */}
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-[100dvh] w-[280px] max-w-[85vw]
          bg-gradient-to-b from-[#0F766E] to-[#065F46] text-white
          transform transition-transform duration-300 ease-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:hidden
          flex flex-col
          shadow-2xl
        `}
      >
        {/* Mobile Close Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center">
              <FaStore className="text-xl text-[#0F766E]" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Maha One</h1>
              <p className="text-[11px] text-[#a8d5d0] leading-tight">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition active:scale-95"
            aria-label="Close menu"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-[#a8d5d0] font-semibold px-3 py-2">
            Main Menu
          </p>

          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`flex items-center gap-3 w-full px-3.5 py-3 rounded-xl text-sm font-medium transition active:scale-[0.98] ${
                activeTab === item.id
                  ? 'bg-white text-[#0F766E] shadow-lg'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] bg-[#D4AF37] text-[#0F766E] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-white/80 hover:bg-red-500 hover:text-white transition w-full text-sm font-medium active:scale-[0.98]"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ==================== 3. FLEX WRAPPER: DESKTOP SIDEBAR + MAIN ==================== */}
      <div className="flex w-full">
        {/* ---------- 3A. DESKTOP SIDEBAR (hidden on mobile) ---------- */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:sticky lg:top-[60px] lg:h-[calc(100vh-60px)] bg-gradient-to-b from-[#0F766E] to-[#065F46] text-white">
          {/* Desktop Header */}
          <div className="p-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center">
                <FaStore className="text-xl text-[#0F766E]" />
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight">Maha One</h1>
                <p className="text-[11px] text-[#a8d5d0] leading-tight">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <p className="text-[10px] uppercase tracking-wider text-[#a8d5d0] font-semibold px-3 py-2">
              Main Menu
            </p>

            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`flex items-center gap-3 w-full px-3.5 py-3 rounded-xl text-sm font-medium transition ${
                  activeTab === item.id
                    ? 'bg-white text-[#0F766E] shadow-lg'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-lg shrink-0">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] bg-[#D4AF37] text-[#0F766E] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-white/10 shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-white/80 hover:bg-red-500 hover:text-white transition w-full text-sm font-medium"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ---------- 3B. MAIN CONTENT ---------- */}
        <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 hover:shadow-md transition"
              >
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {stat.title}
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mt-1">
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

          {/* Dynamic Content */}
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-100">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
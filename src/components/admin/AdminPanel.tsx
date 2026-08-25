// src/components/admin/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaChartLine, 
  FaCog,
  FaSignOutAlt,
  FaStore
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

  const stats = [
    { title: 'Total Users', value: '0', icon: <FaUsers />, color: 'bg-blue-500' },
    { title: 'Total Products', value: products.length, icon: <FaBox />, color: 'bg-green-500' },
    { title: 'Total Orders', value: '0', icon: <FaShoppingCart />, color: 'bg-purple-500' },
    { title: 'Revenue', value: 'Rs. 0', icon: <FaChartLine />, color: 'bg-yellow-500' },
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#0F766E] text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaStore className="text-2xl" />
            <h1 className="text-xl font-bold">Maha One Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64 bg-white rounded-xl shadow-sm p-4 h-fit">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition ${
                    activeTab === item.id
                      ? 'bg-[#0F766E] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <div className={`${stat.color} text-white w-8 h-8 rounded-lg flex items-center justify-center mt-2`}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
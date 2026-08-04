import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaChartLine,
  FaBox,
  FaTags,
  FaUsers,
  FaShoppingBag,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome
} from 'react-icons/fa';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <FaChartLine /> },
    { name: 'Products', path: '/admin/products', icon: <FaBox /> },
    { name: 'Categories', path: '/admin/categories', icon: <FaTags /> },
    { name: 'Orders', path: '/admin/orders', icon: <FaShoppingBag /> },
    { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#0F766E] text-white transition-all duration-300 fixed h-full z-50`}>
        <div className="p-4 flex items-center justify-between border-b border-white/20">
          <Link to="/admin" className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>
            MAHA<span className="text-[#D4AF37]"> ONE</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`${!isSidebarOpen && 'hidden'}`}>{item.name}</span>
            </Link>
          ))}

          <hr className="border-white/20 my-4" />

          <Link to="/" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
            <FaHome className="text-xl" />
            <span className={`${!isSidebarOpen && 'hidden'}`}>Back to Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full hover:bg-white/10 transition-colors text-left"
          >
            <FaSignOutAlt className="text-xl" />
            <span className={`${!isSidebarOpen && 'hidden'}`}>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
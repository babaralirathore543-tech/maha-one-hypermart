import React from 'react';
import { NavLink } from 'react-router-dom';
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

interface AdminSidebarProps {
  onLogout?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout }) => {
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaHome /> },
    { path: '/admin/products', label: 'Products', icon: <FaBox /> },
    { path: '/admin/orders', label: 'Orders', icon: <FaShoppingCart /> },
    { path: '/admin/users', label: 'Users', icon: <FaUsers /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <FaChartLine /> },
    { path: '/admin/settings', label: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div className="h-full w-64 bg-[#0F766E] text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#1a8a7f]">
        <div className="flex items-center gap-2">
          <FaStore className="text-2xl text-[#D4AF37]" />
          <div>
            <h1 className="text-xl font-bold">Maha One</h1>
            <p className="text-xs text-[#a8d5d0]">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-[#1a8a7f] text-white shadow-lg'
                  : 'text-[#a8d5d0] hover:bg-[#1a8a7f] hover:text-white'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#1a8a7f]">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#a8d5d0] hover:bg-red-600 hover:text-white transition w-full"
        >
          <FaSignOutAlt />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
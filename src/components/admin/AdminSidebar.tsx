// src/components/admin/AdminSidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaStore,
  FaUserPlus,
  FaLeaf,
  FaTimes,
} from 'react-icons/fa';

interface AdminSidebarProps {
  onLogout?: () => void;
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaHome /> },
    { path: '/admin/products', label: 'Products', icon: <FaBox /> },
    { path: '/admin/orders', label: 'Orders', icon: <FaShoppingCart /> },
    { path: '/admin/users', label: 'Users', icon: <FaUsers /> },
    { path: '/admin/sellers', label: 'Sellers', icon: <FaUserPlus />, badge: 'New' },
    { path: '/admin/herbal/add', label: 'Herbal', icon: <FaLeaf /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <FaChartLine /> },
    { path: '/admin/settings', label: 'Settings', icon: <FaCog /> },
  ];

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    if (onClose) onClose();
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#0F766E] to-[#065F46] text-white flex flex-col">
      {/* ============ HEADER ============ */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg">
            <FaStore className="text-xl text-[#0F766E]" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">Maha One</h1>
            <p className="text-[11px] text-[#a8d5d0] leading-tight">Admin Panel</p>
          </div>
        </div>

        {/* ✅ Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition active:scale-95"
            aria-label="Close menu"
          >
            <FaTimes size={16} />
          </button>
        )}
      </div>

      {/* ============ MENU ============ */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-wider text-[#a8d5d0] font-semibold px-3 py-2">
          Main Menu
        </p>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all text-sm font-medium group ${
                isActive
                  ? 'bg-white text-[#0F766E] shadow-lg'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="text-[10px] bg-[#D4AF37] text-[#0F766E] font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ============ FOOTER ============ */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-white/80 hover:bg-red-500 hover:text-white transition w-full text-sm font-medium active:scale-95"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
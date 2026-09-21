// src/components/seller/SellerSidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  Store,
  Settings,
  Sparkles,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SellerSidebarProps {
  sellerDocId?: string | null;
  isOpen?: boolean;
  onClose?: () => void;
}

const SellerSidebar = ({
  sellerDocId,
  isOpen = false,
  onClose,
}: SellerSidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { path: '/seller', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/seller/store-builder', icon: Sparkles, label: 'AI Store Builder' },
    { path: '/seller/products', icon: Package, label: 'Products' },
    { path: '/seller/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/seller/earnings', icon: DollarSign, label: 'Earnings' },
    { path: '/seller/store', icon: Store, label: 'Store Profile' },
    { path: '/seller/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      navigate('/login');
    }
  };

  const handleNavClick = () => {
    if (onClose && window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          bg-gradient-to-b from-[#0F766E] to-[#065F46]
          shadow-xl flex flex-col
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="p-5 border-b border-teal-700 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-xl font-bold text-white">
              <span className="text-[#D4AF37]">MAHA</span>
              <span className="text-white"> ONE</span>
            </div>
            <p className="text-teal-200 text-xs mt-1">Seller Dashboard</p>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-teal-700/50 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-lg'
                    : 'text-teal-100 hover:bg-teal-700/50 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-teal-700 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-teal-100 hover:bg-red-500/20 hover:text-white transition-all duration-200"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SellerSidebar;
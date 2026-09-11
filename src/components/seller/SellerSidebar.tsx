// src/components/seller/SellerSidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Store, 
  Settings,
  LogOut
} from 'lucide-react';

const SellerSidebar = () => {
  const navItems = [
    { path: '/seller', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/seller/products', icon: Package, label: 'Products' },
    { path: '/seller/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/seller/earnings', icon: DollarSign, label: 'Earnings' },
    { path: '/seller/store', icon: Store, label: 'Store Profile' },
    { path: '/seller/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#0F766E] to-[#065F46] shadow-xl">
      {/* Brand */}
      <div className="p-6 border-b border-teal-700">
        <div className="text-2xl font-bold text-white">
          <span className="text-[#D4AF37]">MAHA</span>
          <span className="text-white"> ONE</span>
        </div>
        <p className="text-teal-200 text-xs mt-1">Seller Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-teal-700">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-teal-100 hover:bg-teal-700/50 hover:text-white transition-all duration-200">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SellerSidebar;
// src/components/admin/AdminHeader.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaSearch,
  FaBars,
  FaTimes,
  FaBox,
  FaShoppingBag,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useOrderNotifications from '../../hooks/useOrderNotifications';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onMenuToggle,
  isSidebarOpen = false,
}) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // ✅ REAL-TIME ORDER NOTIFICATIONS
  // ============================================================
  const { count, unreadCount, latestOrder, markAllRead } =
    useOrderNotifications({
      role: 'admin',
      playSound: true,
      showBrowserNotification: true,
    });

  // ============================================================
  // CLOSE DROPDOWNS ON OUTSIDE CLICK
  // ============================================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================================
  // HANDLE NOTIFICATION OPEN
  // ============================================================
  const handleNotificationToggle = () => {
    setShowNotifications((s) => !s);
    setShowProfile(false);
    if (!showNotifications) {
      // Mark read when opening
      setTimeout(() => markAllRead(), 500);
    }
  };

  // ============================================================
  // HANDLE LOGOUT
  // ============================================================
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('userUpdated'));
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-100">
      <div className="px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between gap-2">
        {/* ============ LEFT ============ */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* HAMBURGER MENU (Mobile only) */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-[#0F766E] text-gray-700 hover:text-white transition-all shrink-0 active:scale-95"
            aria-label="Open menu"
          >
            <FaBars size={18} />
          </button>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 flex-1 max-w-xs">
            <FaSearch className="text-gray-400 shrink-0" size={14} />
            <input
              type="text"
              placeholder="Search products, orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none ml-2 text-sm text-gray-700 w-full"
            />
          </div>

          {/* Mobile Search Icon */}
          <button
            onClick={() => setShowMobileSearch((s) => !s)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition shrink-0 active:scale-95"
            aria-label="Search"
          >
            <FaSearch size={16} />
          </button>

          {/* Mobile Page Title */}
          <h1 className="md:hidden text-sm font-semibold text-gray-800 truncate">
            Admin Panel
          </h1>
        </div>

        {/* ============ RIGHT ============ */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* ✅ REAL-TIME NOTIFICATIONS */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={handleNotificationToggle}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition shrink-0 active:scale-95"
              aria-label="Notifications"
            >
              <FaBell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-sm sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Order Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="max-h-72 overflow-y-auto">
                    {latestOrder ? (
                      <div
                        onClick={() => {
                          navigate('/admin/orders');
                          setShowNotifications(false);
                        }}
                        className="p-4 hover:bg-gray-50 transition cursor-pointer border-b border-gray-50 bg-blue-50/50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                            <FaShoppingBag size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-800">
                              New Order #
                              {latestOrder.orderNumber ||
                                latestOrder.id?.slice(-8)}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {latestOrder.userName ||
                                latestOrder.customerName ||
                                'Customer'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-bold text-[#0F766E]">
                                Rs.{' '}
                                {(
                                  latestOrder.total ||
                                  latestOrder.subtotal ||
                                  0
                                ).toLocaleString()}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                • {latestOrder.items?.length || 1} item(s)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <FaBox
                          className="text-gray-300 mx-auto mb-2"
                          size={32}
                        />
                        <p className="text-sm text-gray-500">
                          No new orders
                        </p>
                      </div>
                    )}

                    {count > 0 && (
                      <div className="p-3 text-center border-t border-gray-100 bg-gray-50">
                        <button
                          onClick={() => {
                            navigate('/admin/orders');
                            setShowNotifications(false);
                          }}
                          className="text-sm text-[#0F766E] hover:underline font-medium"
                        >
                          View All Orders →
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfile((s) => !s);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-xl p-1 sm:p-1.5 transition active:scale-95"
              aria-label="Profile"
            >
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=0F766E&color=fff&size=40"
                alt="Admin"
                className="w-9 h-9 rounded-full ring-2 ring-[#0F766E]/20"
              />
              <div className="hidden md:block text-left pr-1">
                <p className="text-sm font-medium text-gray-800">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://ui-avatars.com/api/?name=Admin&background=0F766E&color=fff&size=40"
                        alt="Admin"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          Admin
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          admin@mahaone.com
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                      👤 My Profile
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                      ⚙️ Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2 border-t border-gray-100 mt-1 pt-2.5"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="md:hidden px-3 pb-3 pt-2 border-t border-gray-100">
          <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2.5">
            <FaSearch className="text-gray-400 shrink-0" size={14} />
            <input
              type="text"
              placeholder="Search products, orders, users..."
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none ml-2 text-sm text-gray-700 w-full"
            />
            <button
              onClick={() => setShowMobileSearch(false)}
              className="text-gray-400 hover:text-gray-600 p-1 shrink-0"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
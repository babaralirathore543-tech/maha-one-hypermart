// src/components/admin/AdminHeader.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onMenuToggle,
  isSidebarOpen = false,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, message: 'New order #ORD-2024-001', time: '2 mins ago', read: false },
    { id: 2, message: 'Product "Almonds" out of stock', time: '1 hour ago', read: false },
    { id: 3, message: 'New user registered', time: '3 hours ago', read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-100">
      <div className="px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between gap-2">
        {/* ============ LEFT ============ */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* ✅ HAMBURGER MENU (Mobile only) */}
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
              placeholder="Search..."
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
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications((s) => !s);
                setShowProfile(false);
              }}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition shrink-0 active:scale-95"
              aria-label="Notifications"
            >
              <FaBell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-sm sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 hover:bg-gray-50 transition cursor-pointer border-b border-gray-50 last:border-0 ${
                        !notif.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100 text-center bg-gray-50">
                  <button className="text-sm text-[#0F766E] hover:underline font-medium">
                    View All
                  </button>
                </div>
              </div>
            )}
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

            {showProfile && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://ui-avatars.com/api/?name=Admin&background=0F766E&color=fff&size=40"
                      alt="Admin"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800">Admin</p>
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
                  <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2 border-t border-gray-100 mt-1 pt-2.5">
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
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
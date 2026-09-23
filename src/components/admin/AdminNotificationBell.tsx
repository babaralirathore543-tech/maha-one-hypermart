// src/components/admin/AdminNotificationBell.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaTimes, FaBox } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useOrderNotifications from '../../hooks/useOrderNotifications';
import useBrowserNotificationPermission from '../../hooks/useBrowserNotificationPermission';

const AdminNotificationBell = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { permission, requestPermission } =
    useBrowserNotificationPermission();

  const { count, unreadCount, latestOrder, markAllRead } =
    useOrderNotifications({
      role: 'admin',
      playSound: true,
      showBrowserNotification: permission === 'granted',
    });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = async () => {
    if (!showDropdown && permission === 'default') {
      await requestPermission();
    }
    setShowDropdown((prev) => !prev);
    if (!showDropdown) {
      markAllRead();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition shrink-0 active:scale-95"
        aria-label="Order notifications"
      >
        <FaBell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 text-sm">
                New Orders
              </h3>
              <button
                onClick={() => setShowDropdown(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <FaTimes size={12} />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {latestOrder ? (
                <div
                  onClick={() => {
                    navigate('/admin/orders');
                    setShowDropdown(false);
                  }}
                  className="p-4 hover:bg-gray-50 transition cursor-pointer bg-blue-50/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <FaBox />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        New Order #{latestOrder.orderNumber || latestOrder.id?.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {latestOrder.userName || latestOrder.customerName || 'Customer'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-[#0F766E]">
                          Rs. {(latestOrder.total || 0).toLocaleString()}
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
                  <p className="text-sm text-gray-500">No new orders</p>
                </div>
              )}

              {count > 1 && (
                <div className="p-3 text-center border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => {
                      navigate('/admin/orders');
                      setShowDropdown(false);
                    }}
                    className="text-sm text-[#0F766E] hover:underline font-medium"
                  >
                    View All {count} Orders →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminNotificationBell;
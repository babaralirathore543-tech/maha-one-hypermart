// src/components/seller/OrderNotificationBell.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import useOrderNotifications from '../../hooks/useOrderNotifications';
import useBrowserNotificationPermission from '../../hooks/useBrowserNotificationPermission';

const OrderNotificationBell = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { permission, requestPermission } =
    useBrowserNotificationPermission();

  const { count, unreadCount, latestOrder, markAllRead } =
    useOrderNotifications({
      role: 'seller',
      sellerId: user?.uid,
      playSound: true,
      showBrowserNotification: permission === 'granted',
    });

  // Close on outside click
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

  // Request permission when user opens dropdown first time
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
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition shrink-0 active:scale-95"
        aria-label="Order notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 text-sm">
                Order Notifications
              </h3>
              <button
                onClick={() => setShowDropdown(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-72 overflow-y-auto">
              {latestOrder ? (
                <div
                  onClick={() => {
                    navigate('/seller/orders');
                    setShowDropdown(false);
                  }}
                  className="p-4 hover:bg-gray-50 transition cursor-pointer border-b border-gray-50 bg-blue-50/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      🛍️
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        New Order #{latestOrder.orderNumber || latestOrder.id?.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {latestOrder.customerName || latestOrder.userName || 'Customer'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-[#0F766E]">
                          Rs. {(latestOrder.total || latestOrder.subtotal || 0).toLocaleString()}
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
                      navigate('/seller/orders');
                      setShowDropdown(false);
                    }}
                    className="text-sm text-[#0F766E] hover:underline font-medium"
                  >
                    View All {count} Orders →
                  </button>
                </div>
              )}
            </div>

            {/* Permission hint */}
            {permission === 'denied' && (
              <div className="p-3 bg-yellow-50 border-t border-yellow-200">
                <p className="text-[10px] text-yellow-800">
                  ⚠️ Browser notifications blocked. Enable in browser settings.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderNotificationBell;
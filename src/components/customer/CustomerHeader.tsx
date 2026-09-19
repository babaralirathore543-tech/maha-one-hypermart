// src/components/customer/CustomerHeader.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Heart, Bell, Search, ChevronDown, Gift, Sparkles,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  userName?: string;
  cartCount?: number;
  wishlistCount?: number;
  notificationCount?: number;
}

const CustomerHeader: React.FC<HeaderProps> = ({
  userName: propUserName,
  cartCount = 0,
  wishlistCount = 0,
  notificationCount = 0,
}) => {
  const { user } = useAuth();
  const userData: any = user;
  const userId = userData?.uid || userData?.id;

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState(propUserName || userData?.name || userData?.displayName || 'Friend');
  const [userPhoto, setUserPhoto] = useState(userData?.photoURL || '');

  // ✅ Fetch latest profile
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', userId));
        if (snap.exists()) {
          const data = snap.data();
          setUserName(data.name || userData?.name || userData?.displayName || 'Friend');
          setUserPhoto(data.photoURL || userData?.photoURL || '');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProfile();

    const handleUpdate = () => fetchProfile();
    window.addEventListener('userUpdated', handleUpdate);
    return () => window.removeEventListener('userUpdated', handleUpdate);
  }, [userId]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          
          {/* LEFT — Welcome */}
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#065F46] flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" fill="#D4AF37" strokeWidth={1.5} />
            </motion.div>
            
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-gray-800 truncate">
                Welcome back, <span className="text-[#0F766E]">{userName}</span>!
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                Here's what's happening with your account
              </p>
            </div>
          </div>

          {/* RIGHT — Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-[#0F766E] transition-colors">
              <Search size={18} strokeWidth={2} />
              <span className="text-sm">Search...</span>
            </button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-[#0F766E]/10 text-gray-500 hover:text-[#0F766E] transition-colors"
            >
              <Bell size={18} strokeWidth={2} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full shadow-md">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </motion.button>

            {/* Wishlist */}
            <Link to="/dashboard/wishlist">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart size={18} strokeWidth={2} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full shadow-md">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </motion.button>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#0F766E] to-[#065F46] text-white shadow-md hover:shadow-lg transition-all"
              >
                <ShoppingBag size={18} strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-[#D4AF37] text-gray-900 text-[10px] font-bold rounded-full shadow-md">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </motion.button>
            </Link>

            {/* Rewards */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/30">
              <Gift size={14} className="text-[#D4AF37]" strokeWidth={2} />
              <span className="text-xs font-semibold text-[#0F766E]">0 pts</span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-1 pr-2 sm:pr-3 py-1 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {/* ✅ Avatar with photo */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F766E] to-[#065F46] flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden">
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={userName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    userName?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${
                    showUserMenu ? 'rotate-180' : ''
                  }`}
                />
              </motion.button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                >
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Dashboard
                  </Link>
                  <Link
                    to="/dashboard/orders"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Settings
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
    </header>
  );
};

export default CustomerHeader;
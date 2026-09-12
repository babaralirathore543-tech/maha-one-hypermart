// src/components/seller/SellerLayout.tsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSpinner, FaSignOutAlt, FaStore } from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import SellerSidebar from './SellerSidebar';
import { useAuth } from '../../context/AuthContext';

const SellerLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [storeName, setStoreName] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const sellerDoc = await getDoc(doc(db, 'sellers', user.uid));

        if (sellerDoc.exists()) {
          const data = sellerDoc.data();
          setStoreName(data.storeName || user.displayName || 'My Store');
        } else {
          setStoreName(user.displayName || 'My Store');
        }
      } catch (error) {
        console.error('Error fetching store:', error);
        setStoreName(user?.displayName || 'My Store');
      } finally {
        setChecking(false);
      }
    };

    fetchStore();
  }, [user]);

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      navigate('/login');
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#0F766E] mx-auto" />
          <p className="text-gray-500 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SellerSidebar />

      <div className="flex-1 ml-64">
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FaStore className="text-[#0F766E] text-xl" />
              <div>
                <h1 className="text-lg font-semibold text-gray-800">
                  {storeName || 'Seller Dashboard'}
                </h1>
                <p className="text-xs text-gray-500">Seller Panel</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">
                  {user?.displayName || user?.email?.split('@')[0] || 'Seller'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-colors border border-red-200"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default SellerLayout;
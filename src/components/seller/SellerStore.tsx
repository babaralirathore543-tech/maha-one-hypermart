// src/components/seller/SellerStore.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Store, MapPin, Phone, Mail, Edit2 } from 'lucide-react';

const SellerStore = () => {
  const [storeData, setStoreData] = useState({
    name: 'ABC Fashion Store',
    description: 'Premium quality fashion products for men and women. We offer the latest trends at affordable prices.',
    logo: 'https://via.placeholder.com/150',
    banner: 'https://via.placeholder.com/1200x300',
    address: 'Shop #12, Main Boulevard, Lahore',
    city: 'Lahore',
    phone: '0300-1234567',
    email: 'store@abcfashion.com',
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Store Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your store information</p>
      </div>

      {/* Banner */}
      <div className="relative bg-gradient-to-r from-[#0F766E] to-[#065F46] rounded-xl overflow-hidden h-48">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/30 transition-colors">
            <Camera size={18} />
            Change Banner
          </button>
        </div>
      </div>

      {/* Store Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={storeData.logo}
                    alt="Store Logo"
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                  />
                  <button className="absolute -bottom-1 -right-1 bg-[#0F766E] text-white p-1 rounded-full shadow-lg hover:bg-[#065F46]">
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{storeData.name}</h2>
                  <p className="text-sm text-gray-500">Store ID: MAHA-STORE-001</p>
                </div>
              </div>
              <button className="text-[#0F766E] hover:text-[#065F46]">
                <Edit2 size={18} />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-gray-600">{storeData.description}</p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span className="text-sm">{storeData.address}, {storeData.city}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <span className="text-sm">{storeData.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span className="text-sm">{storeData.email}</span>
              </div>
            </div>
          </motion.div>

          {/* Store Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="font-semibold text-gray-800 mb-4">Store Performance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-xl font-bold text-gray-800">18</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-xl font-bold text-gray-800">42</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-xl font-bold text-gray-800">Rs. 125K</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="text-xl font-bold text-[#D4AF37]">4.8 ★</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Store Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Store Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Verification</span>
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  Approved
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Store Active</span>
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Products</span>
                <span className="text-sm font-medium text-gray-800">18 (12 approved)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Store Link</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value="mahaone.pk/store/abc-fashion"
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              />
              <button className="px-3 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#065F46] text-sm">
                Copy
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerStore;
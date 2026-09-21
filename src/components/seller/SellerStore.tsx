// src/components/seller/SellerStore.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Phone, Mail, Edit2 } from 'lucide-react';

const SellerStore = () => {
  const [storeData] = useState({
    name: 'ABC Fashion Store',
    description: 'Premium quality fashion products for men and women. We offer the latest trends at affordable prices.',
    logo: 'https://via.placeholder.com/150',
    address: 'Shop #12, Main Boulevard, Lahore',
    city: 'Lahore',
    phone: '0300-1234567',
    email: 'store@abcfashion.com',
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Store Profile</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Manage your store information
        </p>
      </div>

      {/* Banner */}
      <div className="relative bg-gradient-to-r from-[#0F766E] to-[#065F46] rounded-xl overflow-hidden h-32 sm:h-48">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/30 transition-colors text-xs sm:text-sm">
            <Camera size={16} />
            Change Banner
          </button>
        </div>
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={storeData.logo}
                alt="Store Logo"
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg object-cover border border-gray-200"
              />
              <button className="absolute -bottom-1 -right-1 bg-[#0F766E] text-white p-1 rounded-full shadow-lg">
                <Camera size={12} />
              </button>
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold text-gray-800 truncate">
                {storeData.name}
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Store ID: MAHA-STORE-001
              </p>
            </div>
          </div>
          <button className="text-[#0F766E] hover:text-[#065F46] p-1.5 flex-shrink-0">
            <Edit2 size={16} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 mt-3">{storeData.description}</p>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin size={14} className="mt-0.5 flex-shrink-0" />
            <span>{storeData.address}, {storeData.city}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={14} className="flex-shrink-0" />
            <span>{storeData.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail size={14} className="flex-shrink-0" />
            <span className="truncate">{storeData.email}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100"
      >
        <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
          Store Performance
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Products', value: '18' },
            { label: 'Orders', value: '42' },
            { label: 'Sales', value: 'Rs. 125K' },
            { label: 'Rating', value: '4.8 ★', highlight: true },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[10px] sm:text-xs text-gray-500">{s.label}</p>
              <p
                className={`text-sm sm:text-lg font-bold ${
                  s.highlight ? 'text-[#D4AF37]' : 'text-gray-800'
                }`}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Store Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100"
      >
        <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
          Store Link
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value="mahaone.pk/store/abc-fashion"
            readOnly
            className="flex-1 min-w-0 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm"
          />
          <button className="px-3 sm:px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#065F46] text-xs sm:text-sm font-medium flex-shrink-0">
            Copy
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SellerStore;
// src/components/seller/SellerStore.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Phone, Mail, Edit2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  collection, query, where, getDocs, limit,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

interface StoreData {
  name: string;
  description: string;
  logo: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  slug: string;
  storeId: string;
  productsCount: number;
  ordersCount: number;
  totalSales: number;
  rating: number;
}

const SellerStore = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [storeData, setStoreData] = useState<StoreData>({
    name: '',
    description: '',
    logo: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    slug: '',
    storeId: '',
    productsCount: 0,
    ordersCount: 0,
    totalSales: 0,
    rating: 0,
  });

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchStoreData = async () => {
      setLoading(true);
      try {
        // 1. Try stores collection first
        let store: any = null;
        let storeDocId = '';

        const storesSnap = await getDocs(
          query(
            collection(db, 'stores'),
            where('sellerId', '==', user.uid),
            limit(1)
          )
        );

        if (!storesSnap.empty) {
          const docSnap = storesSnap.docs[0];
          store = docSnap.data();
          storeDocId = docSnap.id;
        } else {
          // 2. Fallback to sellers collection
          const sellersSnap = await getDocs(
            query(
              collection(db, 'sellers'),
              where('userId', '==', user.uid),
              limit(1)
            )
          );
          if (!sellersSnap.empty) {
            const docSnap = sellersSnap.docs[0];
            store = docSnap.data();
            storeDocId = docSnap.id;
          }
        }

        if (cancelled) return;

        if (!store) {
          setLoading(false);
          return;
        }

        // 3. Fetch products count
        const productsSnap = await getDocs(
          query(collection(db, 'products'), where('sellerId', '==', user.uid))
        );

        // 4. Fetch orders (for orders count + sales)
        let ordersCount = 0;
        let totalSales = 0;

        try {
          const ordersSnap = await getDocs(
            query(collection(db, 'sellerOrders'), where('sellerId', '==', user.uid))
          );
          ordersCount = ordersSnap.size;
          ordersSnap.forEach((d) => {
            const data = d.data();
            if (data.status !== 'cancelled') {
              totalSales += data.subtotal || 0;
            }
          });
        } catch (err) {
          console.warn('Orders fetch failed:', err);
        }

        setStoreData({
          name: store.storeName || store.name || user.displayName || 'My Store',
          description: store.storeDescription || store.description || 'No description available',
          logo: store.logo || store.logoUrl || '',
          address: store.address || '',
          city: store.city || '',
          phone: store.phone || '',
          email: store.email || user.email || '',
          slug: store.slug || '',
          storeId: storeDocId,
          productsCount: productsSnap.size,
          ordersCount,
          totalSales,
          rating: store.rating || 0,
        });
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStoreData();
    return () => {
      cancelled = true;
    };
  }, [user?.uid, user?.displayName, user?.email]);

  const handleCopyUrl = async () => {
    if (!storeData.slug) return;
    const url = `${window.location.origin}/store/${storeData.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy. URL: ' + url);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-4xl text-[#0F766E]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Store Profile</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage your store information
          </p>
        </div>
        <button
          onClick={() => navigate('/seller/settings')}
          className="text-xs sm:text-sm bg-[#0F766E] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#065F46] transition flex items-center gap-1.5"
        >
          <Edit2 size={14} />
          Edit
        </button>
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
              {storeData.logo ? (
                <img
                  src={storeData.logo}
                  alt="Store Logo"
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg object-cover border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-[#0F766E] to-[#065F46] flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                  {storeData.name.charAt(0).toUpperCase() || 'S'}
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 bg-[#0F766E] text-white p-1 rounded-full shadow-lg">
                <Camera size={12} />
              </button>
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold text-gray-800 truncate">
                {storeData.name}
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Store ID: {storeData.storeId.slice(0, 12) || 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/seller/settings')}
            className="text-[#0F766E] hover:text-[#065F46] p-1.5 flex-shrink-0"
          >
            <Edit2 size={16} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 mt-3">
          {storeData.description}
        </p>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
          {storeData.address && (
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin size={14} className="mt-0.5 flex-shrink-0" />
              <span>
                {storeData.address}
                {storeData.city && `, ${storeData.city}`}
              </span>
            </div>
          )}
          {storeData.phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} className="flex-shrink-0" />
              <span>{storeData.phone}</span>
            </div>
          )}
          {storeData.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={14} className="flex-shrink-0" />
              <span className="truncate">{storeData.email}</span>
            </div>
          )}
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
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500">Products</p>
            <p className="text-sm sm:text-lg font-bold text-gray-800">
              {storeData.productsCount}
            </p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500">Orders</p>
            <p className="text-sm sm:text-lg font-bold text-gray-800">
              {storeData.ordersCount}
            </p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500">Sales</p>
            <p className="text-sm sm:text-lg font-bold text-gray-800">
              Rs. {(storeData.totalSales / 1000).toFixed(1)}K
            </p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500">Rating</p>
            <p className="text-sm sm:text-lg font-bold text-[#D4AF37]">
              {storeData.rating > 0 ? `${storeData.rating.toFixed(1)} ★` : 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Store Link */}
      {storeData.slug && (
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
              value={`${window.location.origin}/store/${storeData.slug}`}
              readOnly
              className="flex-1 min-w-0 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm"
            />
            <button
              onClick={handleCopyUrl}
              className="px-3 sm:px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#065F46] text-xs sm:text-sm font-medium flex-shrink-0"
            >
              {copied ? '✅ Copied' : 'Copy'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SellerStore;
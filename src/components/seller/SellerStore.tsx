// src/components/seller/SellerStore.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Loader2,
  Store,
  Save,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// ============================================================
// CLOUDINARY CONFIG
// ============================================================
const CLOUDINARY_CLOUD_NAME = 'kw3pdwrb';
const CLOUDINARY_UPLOAD_PRESET = 'maha-one-unsigned'; // apna preset

// ============================================================
// TYPES
// ============================================================
interface StoreData {
  name: string;
  description: string;
  logo: string;
  banner: string;
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
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sellerDocId, setSellerDocId] = useState<string | null>(null);

  const [storeData, setStoreData] = useState<StoreData>({
    name: '',
    description: '',
    logo: '',
    banner: '',
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

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // ============================================================
  // FETCH STORE DATA
  // ============================================================
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchStoreData = async () => {
      setLoading(true);
      try {
        let store: any = null;
        let storeDocId = '';

        // Try stores collection first
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
          // Fallback to sellers collection
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

        setSellerDocId(storeDocId);

        // Products count
        const productsSnap = await getDocs(
          query(collection(db, 'products'), where('sellerId', '==', user.uid))
        );

        // Orders (for count + sales)
        let ordersCount = 0;
        let totalSales = 0;

        try {
          const ordersSnap = await getDocs(
            query(
              collection(db, 'sellerOrders'),
              where('sellerId', '==', user.uid)
            )
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
          name:
            store.storeName || store.name || user.displayName || 'My Store',
          description:
            store.storeDescription ||
            store.description ||
            'No description available',
          logo: store.logo || store.logoUrl || '',
          banner: store.banner || store.bannerUrl || '',
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
        toast.error('Failed to load store data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStoreData();
    return () => {
      cancelled = true;
    };
  }, [user?.uid, user?.displayName, user?.email]);

  // ============================================================
  // ✅ UPLOAD TO CLOUDINARY
  // ============================================================
  const uploadToCloudinary = async (
    file: File,
    folder: string
  ): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return null;
    }

    // Size check: 5MB max
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const result = await res.json();
      return result.secure_url;
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      return null;
    }
  };

  // ============================================================
  // ✅ BANNER UPLOAD HANDLER
  // ============================================================
  const handleBannerUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!sellerDocId) {
      toast.error('Store profile not found');
      return;
    }

    setUploadingBanner(true);
    const toastId = toast.loading('Uploading banner...');

    try {
      // ✅ Upload to Cloudinary
      const url = await uploadToCloudinary(
        file,
        `maha-one/store-banners/${user?.uid}`
      );

      if (!url) {
        throw new Error('Upload failed');
      }

      // ✅ Save to Firestore
      await updateDoc(doc(db, 'stores', sellerDocId), {
        banner: url,
        updatedAt: serverTimestamp(),
      });

      // ✅ Update local state
      setStoreData((prev) => ({ ...prev, banner: url }));

      toast.success('Banner updated!', { id: toastId });
    } catch (error: any) {
      console.error('Banner upload error:', error);
      toast.error('Failed to upload banner', { id: toastId });
    } finally {
      setUploadingBanner(false);
      // Reset input
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  // ============================================================
  // ✅ LOGO UPLOAD HANDLER
  // ============================================================
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!sellerDocId) {
      toast.error('Store profile not found');
      return;
    }

    setUploadingLogo(true);
    const toastId = toast.loading('Uploading logo...');

    try {
      // ✅ Upload to Cloudinary
      const url = await uploadToCloudinary(
        file,
        `maha-one/store-logos/${user?.uid}`
      );

      if (!url) {
        throw new Error('Upload failed');
      }

      // ✅ Save to Firestore
      await updateDoc(doc(db, 'stores', sellerDocId), {
        logo: url,
        updatedAt: serverTimestamp(),
      });

      // ✅ Update local state
      setStoreData((prev) => ({ ...prev, logo: url }));

      toast.success('Logo updated!', { id: toastId });
    } catch (error: any) {
      console.error('Logo upload error:', error);
      toast.error('Failed to upload logo', { id: toastId });
    } finally {
      setUploadingLogo(false);
      // Reset input
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  // ============================================================
  // COPY STORE URL
  // ============================================================
  const handleCopyUrl = async () => {
    if (!storeData.slug) return;
    const url = `${window.location.origin}/store/${storeData.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('URL copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy. URL: ' + url);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Store Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage your store information
          </p>
        </div>
        <button
          onClick={() => navigate('/seller/settings')}
          className="text-xs sm:text-sm bg-[#0F766E] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#065F46] transition flex items-center gap-1.5 active:scale-95"
        >
          <Edit2 size={14} />
          Edit
        </button>
      </div>

      {/* ============================================================
          BANNER — Clickable Upload
      ============================================================ */}
      <div className="relative bg-gradient-to-r from-[#0F766E] to-[#065F46] rounded-xl overflow-hidden h-32 sm:h-48 group">
        {/* Banner Image */}
        {storeData.banner ? (
          <img
            src={storeData.banner}
            alt="Store Banner"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F766E] to-[#065F46]" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

        {/* Upload Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            disabled={uploadingBanner}
            className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 sm:px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-white transition-colors text-xs sm:text-sm font-medium shadow-lg disabled:opacity-50 active:scale-95"
          >
            {uploadingBanner ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera size={16} />
                {storeData.banner ? 'Change Banner' : 'Upload Banner'}
              </>
            )}
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBannerUpload}
        />

        {/* Recommended size hint */}
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] sm:text-xs px-2 py-1 rounded">
          Recommended: 1200×300px
        </div>
      </div>

      {/* ============================================================
          STORE INFO — Logo + Details
      ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo with upload */}
            <div className="relative shrink-0">
              {storeData.logo ? (
                <img
                  src={storeData.logo}
                  alt="Store Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2 border-gray-200 bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-[#0F766E] to-[#065F46] flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                  {storeData.name.charAt(0).toUpperCase() || 'S'}
                </div>
              )}

              {/* Upload Logo Button */}
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
                className="absolute -bottom-1 -right-1 bg-[#0F766E] text-white p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-[#065F46] transition disabled:opacity-50 active:scale-95"
                aria-label="Upload logo"
              >
                {uploadingLogo ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Camera size={12} />
                )}
              </button>

              {/* Hidden file input */}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>

            {/* Store Info */}
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
            className="text-[#0F766E] hover:text-[#065F46] p-1.5 shrink-0"
            title="Edit in settings"
          >
            <Edit2 size={16} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 mt-3">
          {storeData.description}
        </p>

        {/* Contact Info */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
          {storeData.address && (
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <span className="break-words">
                {storeData.address}
                {storeData.city && `, ${storeData.city}`}
              </span>
            </div>
          )}
          {storeData.phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} className="shrink-0" />
              <span>{storeData.phone}</span>
            </div>
          )}
          {storeData.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={14} className="shrink-0" />
              <span className="truncate">{storeData.email}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ============================================================
          STORE PERFORMANCE
      ============================================================ */}
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

      {/* ============================================================
          STORE LINK
      ============================================================ */}
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
              className="px-3 sm:px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#065F46] text-xs sm:text-sm font-medium shrink-0 active:scale-95 transition"
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
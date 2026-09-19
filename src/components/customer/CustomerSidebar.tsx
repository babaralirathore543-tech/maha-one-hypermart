// src/components/customer/CustomerSidebar.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Heart, MapPin,
  CreditCard, Clock, Settings, LogOut, User, ChevronRight,
  Camera, Loader2,
} from 'lucide-react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CustomerSidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ✅ Type-safe
  const userData: any = user;
  const userId = userData?.uid || userData?.id;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(userData?.name || userData?.displayName || 'Customer');
  const [userEmail, setUserEmail] = useState(userData?.email || '');
  const [userPhoto, setUserPhoto] = useState(userData?.photoURL || '');
  const [showHover, setShowHover] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ Fetch latest profile
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', userId));
        if (snap.exists()) {
          const data = snap.data();
          setDisplayName(data.name || userData?.name || userData?.displayName || 'Customer');
          setUserEmail(data.email || userData?.email || '');
          setUserPhoto(data.photoURL || userData?.photoURL || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();

    const handleUpdate = () => fetchProfile();
    window.addEventListener('userUpdated', handleUpdate);
    return () => window.removeEventListener('userUpdated', handleUpdate);
  }, [userId]);

  // ✅ Upload photo to Cloudinary
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('❌ Image 5MB se choti honi chahiye');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', `maha-one/customers/${userId}/profile`);

      const xhr = new XMLHttpRequest();

      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        });

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.secure_url);
          } else {
            const error = JSON.parse(xhr.responseText);
            reject(error.error?.message || 'Upload failed');
          }
        };

        xhr.onerror = () => reject('Network error');
        xhr.send(formData);
      });

      const url = await uploadPromise;

      // ✅ Save to Firestore
      await updateDoc(doc(db, 'users', userId), {
        photoURL: url,
        updatedAt: serverTimestamp(),
      });

      setUserPhoto(url);

      // ✅ Update localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const currentUser = JSON.parse(userStr);
        const updated = { ...currentUser, photoURL: url };
        localStorage.setItem('user', JSON.stringify(updated));
        window.dispatchEvent(new Event('userUpdated'));
      }

      alert('✅ Profile picture updated!');
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      alert('❌ Failed: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    if (logout) await logout();
    else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    }
    window.dispatchEvent(new Event('userUpdated'));
    navigate('/login');
  };

  return (
    <div className="md:w-64 lg:w-72 bg-white rounded-2xl shadow-lg overflow-hidden h-fit sticky top-4">
      
      {/* ✅ BEAUTIFUL HEADER */}
      <div className="relative bg-gradient-to-br from-[#0F766E] via-[#0F766E] to-[#065F46] p-6 text-white overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#D4AF37]/20 rounded-full" />

        <div className="relative flex flex-col items-center text-center">
          
          {/* ✅ Avatar with camera overlay */}
          <div
            className="relative group"
            onMouseEnter={() => setShowHover(true)}
            onMouseLeave={() => setShowHover(false)}
          >
            {/* Avatar */}
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg overflow-hidden">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={displayName}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <User className="w-12 h-12 text-white" fill="white" strokeWidth={2} />
              )}
            </div>

            {/* ✅ Hover overlay — "Change" */}
            {!uploading && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`absolute inset-0 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
                  showHover ? 'opacity-100' : 'opacity-0'
                }`}
                title="Change photo"
              >
                <div className="text-center text-white">
                  <Camera className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-[10px] font-medium">Change</span>
                </div>
              </button>
            )}

            {/* ✅ Upload progress */}
            {uploading && (
              <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center text-white">
                  <Loader2 className="w-6 h-6 mx-auto mb-1 animate-spin" />
                  <span className="text-[10px] font-medium">{uploadProgress}%</span>
                </div>
              </div>
            )}

            {/* ✅ Camera badge — always visible */}
            {!uploading && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#D4AF37] text-gray-900 flex items-center justify-center shadow-lg border-2 border-white hover:bg-yellow-500 transition-colors"
                title="Change photo"
              >
                <Camera className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <h3 className="text-lg font-bold truncate w-full px-2 mt-3">
            {displayName}
          </h3>

          <p className="text-xs text-white/70 truncate w-full px-2 mt-1">
            {userEmail}
          </p>

          <span className="inline-flex items-center gap-1 mt-2 bg-[#D4AF37] text-gray-900 text-[10px] font-semibold px-3 py-1 rounded-full">
            ⭐ Customer
          </span>
        </div>
      </div>

      {/* ✅ MENU ITEMS */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#0F766E]'
              }`}
            >
              <div className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-[#0F766E]/10'
              }`}>
                <Icon
                  size={18}
                  className={isActive ? 'text-[#D4AF37]' : 'text-[#0F766E]'}
                  fill={isActive ? 'currentColor' : 'none'}
                  strokeWidth={isActive ? 1.5 : 2}
                  stroke={isActive ? '#D4AF37' : '#0F766E'}
                />
              </div>
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight size={16} className="text-[#D4AF37]" />}
            </motion.button>
          );
        })}
      </nav>

      {/* ✅ LOGOUT BUTTON */}
      <div className="p-3 border-t border-gray-100">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-all duration-200"
        >
          <LogOut size={16} strokeWidth={2} />
          Logout
        </motion.button>
      </div>
    </div>
  );
};

export default CustomerSidebar;
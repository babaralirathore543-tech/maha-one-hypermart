// src/components/customer/tabs/SettingsTab.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  FaUser, FaEnvelope, FaPhone, FaSave, FaSpinner,
  FaCamera, FaEdit, FaTrash
} from 'react-icons/fa';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../context/AuthContext';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const SettingsTab = () => {
  const { user } = useAuth();

  // ✅ Type-safe
  const userData: any = user;
  const userId = userData?.uid || userData?.id;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showHover, setShowHover] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    photoURL: '',
  });

  // ✅ Fetch profile
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', userId));
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            name: data.name || userData?.name || userData?.displayName || '',
            email: data.email || userData?.email || '',
            phone: data.phone || '',
            photoURL: data.photoURL || userData?.photoURL || '',
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // ✅ Upload to Cloudinary
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
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
      console.log('✅ Uploaded:', url);

      // ✅ Save to Firestore
      await updateDoc(doc(db, 'users', userId), {
        photoURL: url,
        updatedAt: serverTimestamp(),
      });

      setForm({ ...form, photoURL: url });

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

  // ✅ Remove photo
  const handleRemovePhoto = async () => {
    if (!window.confirm('Remove profile picture?')) return;

    try {
      await updateDoc(doc(db, 'users', userId), {
        photoURL: '',
        updatedAt: serverTimestamp(),
      });

      setForm({ ...form, photoURL: '' });

      const userStr = localStorage.getItem('user');
      if (userStr) {
        const currentUser = JSON.parse(userStr);
        const updated = { ...currentUser, photoURL: '' };
        localStorage.setItem('user', JSON.stringify(updated));
        window.dispatchEvent(new Event('userUpdated'));
      }

      alert('✅ Profile picture removed!');
    } catch (error: any) {
      alert('❌ Failed: ' + error.message);
    }
  };

  // ✅ Save profile
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', userId), {
        name: form.name,
        phone: form.phone,
        updatedAt: serverTimestamp(),
      });

      const userStr = localStorage.getItem('user');
      if (userStr) {
        const currentUser = JSON.parse(userStr);
        const updated = { ...currentUser, name: form.name, phone: form.phone };
        localStorage.setItem('user', JSON.stringify(updated));
        window.dispatchEvent(new Event('userUpdated'));
      }

      alert('✅ Profile updated!');
    } catch (error: any) {
      alert('❌ Failed: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-[#0F766E]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">⚙️ Settings</h2>

      {/* ✅ PROFILE PICTURE SECTION */}
      <div className="mb-8 flex flex-col items-center">
        
        {/* Avatar with Camera overlay */}
        <div
          className="relative group"
          onMouseEnter={() => setShowHover(true)}
          onMouseLeave={() => setShowHover(false)}
        >
          {/* Main Avatar */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-[#0F766E] to-[#065F46] flex items-center justify-center">
            {form.photoURL ? (
              <img
                src={form.photoURL}
                alt={form.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-white text-5xl font-bold">
                {form.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
          </div>

          {/* ✅ Camera overlay — click to upload */}
          {!uploading && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`absolute inset-0 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
                showHover ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="text-center text-white">
                <FaCamera className="text-3xl mx-auto mb-1" />
                <span className="text-xs font-medium">Change</span>
              </div>
            </button>
          )}

          {/* ✅ Upload progress */}
          {uploading && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="text-center text-white">
                <FaSpinner className="animate-spin text-3xl mx-auto mb-1" />
                <span className="text-xs font-medium">{uploadProgress}%</span>
              </div>
            </div>
          )}

          {/* ✅ Small camera badge (always visible) */}
          {!uploading && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#0F766E] text-white flex items-center justify-center shadow-lg border-4 border-white hover:bg-[#065F46] transition-colors"
              title="Change photo"
            >
              <FaCamera className="text-sm" />
            </button>
          )}
        </div>

        {/* Name + Email */}
        <h3 className="text-xl font-bold text-gray-800 mt-4">{form.name || 'Customer'}</h3>
        <p className="text-sm text-gray-500">{form.email}</p>

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-sm text-[#0F766E] hover:underline flex items-center gap-1 disabled:opacity-50"
          >
            <FaCamera size={12} />
            {form.photoURL ? 'Change Photo' : 'Upload Photo'}
          </button>

          {form.photoURL && (
            <button
              onClick={handleRemovePhoto}
              disabled={uploading}
              className="text-sm text-red-500 hover:underline flex items-center gap-1 disabled:opacity-50"
            >
              <FaTrash size={12} />
              Remove
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-2">
          JPG, PNG, WebP • Max 5MB
        </p>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* ✅ PROFILE FORM */}
      <div className="space-y-4 border-t border-gray-100 pt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FaEdit className="text-[#0F766E]" /> Edit Profile
        </h3>

        {/* Name */}
        <div className="border rounded-lg p-4">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <FaUser className="text-[#0F766E]" /> Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0F766E] outline-none"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div className="border rounded-lg p-4">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <FaEnvelope className="text-[#0F766E]" /> Email
          </label>
          <input
            type="email"
            value={form.email}
            disabled
            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-100"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>

        {/* Phone */}
        <div className="border rounded-lg p-4">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <FaPhone className="text-[#0F766E]" /> Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0F766E] outline-none"
            placeholder="03XX-XXXXXXX"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0F766E] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#065F46] disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;
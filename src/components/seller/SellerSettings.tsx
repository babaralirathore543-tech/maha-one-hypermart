import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaStore,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCity,
  FaSave,
  FaLock,
  FaBell,
  FaCreditCard,
  FaShieldAlt,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

interface SellerSettingsData {
  storeName: string;
  storeDescription: string;
  phone: string;
  address: string;
  city: string;
  email: string;
  displayName: string;
}

const SellerSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [sellerDocId, setSellerDocId] = useState<string | null>(null);

  const [settings, setSettings] = useState<SellerSettingsData>({
    storeName: '',
    storeDescription: '',
    phone: '',
    address: '',
    city: '',
    email: '',
    displayName: '',
  });

  useEffect(() => {
    if (user?.uid) {
      fetchSellerData();
    } else {
      setLoading(false);
    }
  }, [user?.uid]);

  const fetchSellerData = async () => {
    if (!user?.uid) return;
    setLoading(true);

    try {
      const q = query(
        collection(db, 'sellers'),
        where('userId', '==', user.uid),
        limit(1)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const sellerDoc = snap.docs[0];
        const data = sellerDoc.data();

        setSellerDocId(sellerDoc.id);

        setSettings({
          storeName: data.storeName || '',
          storeDescription: data.storeDescription || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          email: user.email || '',
          displayName: user.displayName || data.fullName || '',
        });
      } else {
        setSettings({
          storeName: user.displayName || '',
          storeDescription: '',
          phone: '',
          address: '',
          city: '',
          email: user.email || '',
          displayName: user.displayName || '',
        });
      }
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!sellerDocId) {
      alert('Seller profile not found. Please complete registration.');
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, 'sellers', sellerDocId), {
        storeName: settings.storeName,
        storeDescription: settings.storeDescription,
        phone: settings.phone,
        address: settings.address,
        city: settings.city,
        updatedAt: new Date().toISOString(),
      });

      if (settings.displayName && settings.displayName !== user?.displayName) {
        try {
          const userRef = doc(db, 'users', user!.uid);
          await updateDoc(userRef, {
            name: settings.displayName,
            updatedAt: new Date().toISOString(),
          });
        } catch (userErr) {
          console.warn('User update failed:', userErr);
        }
      }

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'store', label: 'Store', icon: <FaStore /> },
    { id: 'security', label: 'Security', icon: <FaLock /> },
    { id: 'notifications', label: 'Alerts', icon: <FaBell /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage your account
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !sellerDocId}
          className="bg-[#0F766E] text-white px-3 sm:px-5 py-2 rounded-lg hover:bg-[#065F46] transition-colors flex items-center gap-2 disabled:opacity-50 text-xs sm:text-sm font-medium"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
              <span className="hidden sm:inline">Saving...</span>
            </>
          ) : (
            <>
              <FaSave />
              <span className="hidden sm:inline">Save</span>
            </>
          )}
        </button>
      </div>

      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-1 sm:gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#0F766E] text-[#0F766E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100"
      >
        {activeTab === 'profile' && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              Profile Information
            </h3>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="displayName"
                  value={settings.displayName}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="email"
                  value={settings.email}
                  disabled
                  className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                  placeholder="03XX-XXXXXXX"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'store' && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              Store Information
            </h3>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Store Name
              </label>
              <div className="relative">
                <FaStore className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="storeDescription"
                value={settings.storeDescription}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <div className="relative">
                  <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="city"
                    value={settings.city}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Security
            </h3>
            {[
              { icon: FaShieldAlt, title: 'Two-Factor Auth', desc: 'Extra security', action: 'Enable' },
              { icon: FaLock, title: 'Change Password', desc: 'Update password', action: 'Change' },
              { icon: FaCreditCard, title: 'Payout Settings', desc: 'Payment methods', action: 'Update' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon className="text-[#0F766E] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <button className="bg-[#0F766E] text-white px-3 py-1.5 rounded-lg text-xs hover:bg-[#065F46] flex-shrink-0">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Notifications
            </h3>
            {['New Orders', 'Product Approval', 'Earnings Updates'].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">
                    {label}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                    Get notified about {label.toLowerCase()}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0F766E]" />
                </label>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SellerSettings;
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
  FaMoon,
  FaGlobe,
  FaLanguage,
  FaCreditCard,
  FaShieldAlt
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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
  const { user, appUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<SellerSettingsData>({
    storeName: '',
    storeDescription: '',
    phone: '',
    address: '',
    city: '',
    email: '',
    displayName: '',
  });

  // ✅ Fetch seller data
  useEffect(() => {
    if (user) {
      fetchSellerData();
    }
  }, [user]);

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      const sellerDoc = await getDoc(doc(db, 'sellers', user?.uid || ''));
      if (sellerDoc.exists()) {
        const data = sellerDoc.data();
        setSettings({
          storeName: data.storeName || '',
          storeDescription: data.storeDescription || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          email: user?.email || '',
          displayName: user?.displayName || '',
        });
      }
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save settings
  const handleSave = async () => {
    setSaving(true);
    try {
      const sellerRef = doc(db, 'sellers', user?.uid || '');
      await updateDoc(sellerRef, {
        storeName: settings.storeName,
        storeDescription: settings.storeDescription,
        phone: settings.phone,
        address: settings.address,
        city: settings.city,
        updatedAt: new Date().toISOString(),
      });

      alert('✅ Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'store', label: 'Store', icon: <FaStore /> },
    { id: 'security', label: 'Security', icon: <FaLock /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your store and account settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0F766E] text-white px-6 py-2.5 rounded-lg hover:bg-[#065F46] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <FaSave /> Save Changes
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="displayName"
                    value={settings.displayName}
                    onChange={handleChange}
                    className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={settings.email}
                    disabled
                    className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
                  placeholder="03XX-XXXXXXX"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'store' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Store Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Store Name</label>
              <div className="relative">
                <FaStore className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
                  placeholder="Your Store Name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Store Description</label>
              <textarea
                name="storeDescription"
                value={settings.storeDescription}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
                placeholder="Describe your store..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
                    placeholder="Shop #, Street, Area"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <div className="relative">
                  <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={settings.city}
                    onChange={handleChange}
                    className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
                    placeholder="Lahore"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Security Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-[#0F766E]" />
                  <div>
                    <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add extra security to your account</p>
                  </div>
                </div>
                <button className="bg-[#0F766E] text-white px-4 py-1.5 rounded-lg text-sm hover:bg-[#065F46] transition-colors">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaLock className="text-[#0F766E]" />
                  <div>
                    <p className="font-medium text-gray-800">Change Password</p>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                </div>
                <button className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                  Change
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaCreditCard className="text-[#0F766E]" />
                  <div>
                    <p className="font-medium text-gray-800">Payout Settings</p>
                    <p className="text-sm text-gray-500">Manage your payment methods</p>
                  </div>
                </div>
                <button className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Notification Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">New Orders</p>
                  <p className="text-sm text-gray-500">Get notified when you receive new orders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0F766E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F766E]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Product Approval</p>
                  <p className="text-sm text-gray-500">Get notified when products are approved</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0F766E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F766E]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Earnings Updates</p>
                  <p className="text-sm text-gray-500">Get notified about your earnings</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0F766E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F766E]"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SellerSettings;
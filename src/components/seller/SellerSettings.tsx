// src/components/seller/SellerSettings.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaUniversity,
  FaMobile,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// ============================================================
// TYPES
// ============================================================
interface SellerSettingsData {
  storeName: string;
  storeDescription: string;
  phone: string;
  address: string;
  city: string;
  email: string;
  displayName: string;
}

interface NotificationPrefs {
  newOrders: boolean;
  productApproval: boolean;
  earningsUpdates: boolean;
}

interface PayoutDetails {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  jazzCash: string;
  easyPaisa: string;
  preferredMethod: 'bank' | 'jazzcash' | 'easypaisa';
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorEmail: string;
}

// ============================================================
// VALIDATION HELPERS
// ============================================================
const validatePhone = (phone: string): boolean => {
  if (!phone) return true;
  const cleaned = phone.replace(/[-\s+]/g, '');
  return /^(92)?3\d{9}$/.test(cleaned) || /^0?3\d{9}$/.test(cleaned);
};

const validateStoreName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 60;
};

const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Include at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Include at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Include at least one number' };
  }
  return { valid: true, message: 'Strong password' };
};

const validateIBAN = (iban: string): boolean => {
  if (!iban) return true;
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  return /^PK\d{2}[A-Z]{4}\d{16}$/.test(cleaned);
};

// ============================================================
// COMPONENT
// ============================================================
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

  const [notifications, setNotifications] = useState<NotificationPrefs>({
    newOrders: true,
    productApproval: true,
    earningsUpdates: true,
  });

  // ✅ Security states
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    twoFactorEmail: '',
  });

  // ✅ Payout states
  const [payout, setPayout] = useState<PayoutDetails>({
    bankName: '',
    accountTitle: '',
    accountNumber: '',
    iban: '',
    jazzCash: '',
    easyPaisa: '',
    preferredMethod: 'bank',
  });

  // ✅ Change password states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  // ============================================================
  // FETCH SELLER DATA
  // ============================================================
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

        if (data.notifications) {
          setNotifications({
            newOrders: data.notifications.newOrders ?? true,
            productApproval: data.notifications.productApproval ?? true,
            earningsUpdates: data.notifications.earningsUpdates ?? true,
          });
        }

        if (data.security) {
          setSecurity({
            twoFactorEnabled: data.security.twoFactorEnabled ?? false,
            twoFactorEmail: data.security.twoFactorEmail || user.email || '',
          });
        } else {
          setSecurity({
            twoFactorEnabled: false,
            twoFactorEmail: user.email || '',
          });
        }

        if (data.payout) {
          setPayout({
            bankName: data.payout.bankName || '',
            accountTitle: data.payout.accountTitle || '',
            accountNumber: data.payout.accountNumber || '',
            iban: data.payout.iban || '',
            jazzCash: data.payout.jazzCash || '',
            easyPaisa: data.payout.easyPaisa || '',
            preferredMethod: data.payout.preferredMethod || 'bank',
          });
        }
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
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SAVE — General settings
  // ============================================================
  const handleSave = async () => {
    if (!sellerDocId) {
      toast.error('Seller profile not found. Complete registration first.');
      return;
    }

    if (!validateStoreName(settings.storeName)) {
      toast.error('Store name must be 2-60 characters');
      setActiveTab('store');
      return;
    }

    if (!validatePhone(settings.phone)) {
      toast.error('Invalid phone number. Use format: 03XX-XXXXXXX');
      setActiveTab('profile');
      return;
    }

    setSaving(true);
    const toastId = toast.loading('Saving settings...');

    try {
      await updateDoc(doc(db, 'sellers', sellerDocId), {
        storeName: settings.storeName.trim(),
        storeDescription: settings.storeDescription.trim(),
        phone: settings.phone.trim(),
        address: settings.address.trim(),
        city: settings.city.trim(),
        notifications,
        security,
        payout,
        updatedAt: serverTimestamp(),
      });

      if (
        settings.displayName.trim() &&
        settings.displayName.trim() !== user?.displayName
      ) {
        try {
          const userRef = doc(db, 'users', user!.uid);
          await updateDoc(userRef, {
            name: settings.displayName.trim(),
            updatedAt: serverTimestamp(),
          });
        } catch (userErr) {
          console.warn('User update failed:', userErr);
        }
      }

      toast.success('Settings saved successfully!', { id: toastId });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save: ' + (error.message || 'Unknown'), {
        id: toastId,
      });
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
      {/* Header */}
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
          className="bg-[#0F766E] text-white px-3 sm:px-5 py-2 rounded-lg hover:bg-[#065F46] transition-colors flex items-center gap-2 disabled:opacity-50 text-xs sm:text-sm font-medium active:scale-95"
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

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
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

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100"
      >
        {/* ============ PROFILE ============ */}
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
                  maxLength={60}
                  className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                  placeholder="Your name"
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
                  className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Email cannot be changed. Contact admin if needed.
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
                  maxLength={15}
                  className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                  placeholder="03XX-XXXXXXX"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Format: 03XX-XXXXXXX (used for order notifications)
              </p>
            </div>
          </div>
        )}

        {/* ============ STORE ============ */}
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
                  maxLength={60}
                  className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                  placeholder="Your store name"
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span />
                <span className="text-[10px] text-gray-400">
                  {settings.storeName.length}/60
                </span>
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
                maxLength={500}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none resize-y"
                placeholder="Describe your store"
              />
              <div className="flex justify-between items-center mt-1">
                <span />
                <span className="text-[10px] text-gray-400">
                  {settings.storeDescription.length}/500
                </span>
              </div>
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
                    maxLength={200}
                    className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                    placeholder="Shop #, Street"
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
                    maxLength={50}
                    className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                    placeholder="e.g. Karachi"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ SECURITY ============ */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              🔐 Security Settings
            </h3>

            {/* --- 2FA --- */}
            <div className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    security.twoFactorEnabled
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <FaShieldAlt size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800 text-sm">
                      Two-Factor Authentication
                    </p>
                    {security.twoFactorEnabled && (
                      <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                    Add extra security to your account
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShow2FAModal(true)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-medium shrink-0 active:scale-95 transition ${
                  security.twoFactorEnabled
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                }`}
              >
                {security.twoFactorEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>

            {/* --- Change Password --- */}
            <div className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <FaLock size={18} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">
                    Change Password
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                    Update your login password
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-3 sm:px-4 py-2 bg-[#0F766E] text-white rounded-lg text-xs font-medium shrink-0 hover:bg-[#065F46] active:scale-95 transition"
              >
                Change
              </button>
            </div>

            {/* --- Payout Settings --- */}
            <div className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <FaCreditCard size={18} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">
                    Payout Settings
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                    {payout.bankName || payout.jazzCash || payout.easyPaisa
                      ? `Configured via ${payout.preferredMethod}`
                      : 'No payout method added'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPayoutModal(true)}
                className="px-3 sm:px-4 py-2 bg-[#0F766E] text-white rounded-lg text-xs font-medium shrink-0 hover:bg-[#065F46] active:scale-95 transition"
              >
                Update
              </button>
            </div>

            {/* --- Info Note --- */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
              <span className="text-blue-600">💡</span>
              <p className="text-[10px] sm:text-xs text-blue-800">
                Keep your account secure. Never share your password with anyone.
                MAHA ONE will never ask for your password.
              </p>
            </div>
          </div>
        )}

        {/* ============ NOTIFICATIONS ============ */}
        {activeTab === 'notifications' && (
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Notifications
            </h3>

            {[
              {
                key: 'newOrders' as const,
                label: 'New Orders',
                desc: 'Get notified when you receive a new order',
              },
              {
                key: 'productApproval' as const,
                label: 'Product Approval',
                desc: 'Updates when products are approved/rejected',
              },
              {
                key: 'earningsUpdates' as const,
                label: 'Earnings Updates',
                desc: 'Get notified about payments and earnings',
              },
            ].map((item) => {
              const isOn = notifications[item.key];
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {item.label}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                      {item.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        [item.key]: !isOn,
                      })
                    }
                    className={`
                      relative inline-flex items-center
                      w-11 h-6 rounded-full
                      transition-colors duration-200
                      shrink-0
                      ${isOn ? 'bg-[#0F766E]' : 'bg-gray-300'}
                    `}
                    aria-label={`Toggle ${item.label}`}
                  >
                    <span
                      className={`
                        inline-block w-4 h-4 bg-white rounded-full
                        transform transition-transform duration-200
                        shadow-md
                        ${isOn ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              );
            })}

            <p className="text-[10px] sm:text-xs text-gray-400 text-center pt-2">
              Don't forget to click <strong>Save</strong> to apply changes
            </p>
          </div>
        )}
      </motion.div>

      {/* ============================================================
          CHANGE PASSWORD MODAL
      ============================================================ */}
      <AnimatePresence>
        {showPasswordModal && (
          <ChangePasswordModal
            onClose={() => setShowPasswordModal(false)}
          />
        )}
      </AnimatePresence>

      {/* ============================================================
          2FA MODAL
      ============================================================ */}
      <AnimatePresence>
        {show2FAModal && (
          <TwoFactorModal
            enabled={security.twoFactorEnabled}
            email={security.twoFactorEmail}
            onSave={(enabled, email) => {
              setSecurity({ twoFactorEnabled: enabled, twoFactorEmail: email });
              setShow2FAModal(false);
              toast.success(
                enabled ? '2FA enabled! Click Save to apply.' : '2FA disabled'
              );
            }}
            onClose={() => setShow2FAModal(false)}
          />
        )}
      </AnimatePresence>

      {/* ============================================================
          PAYOUT MODAL
      ============================================================ */}
      <AnimatePresence>
        {showPayoutModal && (
          <PayoutModal
            payout={payout}
            onSave={(data) => {
              setPayout(data);
              setShowPayoutModal(false);
              toast.success('Payout details updated! Click Save to apply.');
            }}
            onClose={() => setShowPayoutModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================
// CHANGE PASSWORD MODAL
// ============================================================
const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordCheck = validatePassword(newPassword);

  const handleSubmit = async () => {
    setError('');

    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    if (!passwordCheck.valid) {
      setError(passwordCheck.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Updating password...');

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error('User not found');
      }

      // Re-authenticate
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);

      toast.success('Password changed successfully!', { id: toastId });
      onClose();
    } catch (err: any) {
      console.error('Password change error:', err);
      let message = 'Failed to change password';

      if (err.code === 'auth/wrong-password') {
        message = 'Current password is incorrect';
      } else if (err.code === 'auth/weak-password') {
        message = 'New password is too weak';
      } else if (err.code === 'auth/requires-recent-login') {
        message = 'Please logout and login again to change password';
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[95vh] overflow-y-auto"
      >
        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaLock className="text-[#0F766E]" />
              <h3 className="text-lg font-bold text-gray-800">
                Change Password
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg mb-4 flex items-start gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Fields */}
          <div className="space-y-3">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>

              {/* Password Strength */}
              {newPassword && (
                <div
                  className={`flex items-center gap-1.5 mt-1 text-[10px] ${
                    passwordCheck.valid ? 'text-green-600' : 'text-orange-600'
                  }`}
                >
                  {passwordCheck.valid ? (
                    <FaCheck size={10} />
                  ) : (
                    <FaTimes size={10} />
                  )}
                  <span>{passwordCheck.message}</span>
                </div>
              )}

              <ul className="mt-2 space-y-0.5 text-[10px] text-gray-500">
                <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                  • At least 8 characters
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                  • One uppercase letter
                </li>
                <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
                  • One lowercase letter
                </li>
                <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                  • One number
                </li>
              </ul>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none ${
                  confirmPassword && newPassword !== confirmPassword
                    ? 'border-red-400'
                    : 'border-gray-300'
                }`}
                placeholder="Re-enter new password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[10px] text-red-500 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-5">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 active:scale-95 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-[#0F766E] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#065F46] disabled:opacity-50 active:scale-95 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// 2FA MODAL
// ============================================================
const TwoFactorModal = ({
  enabled,
  email,
  onSave,
  onClose,
}: {
  enabled: boolean;
  email: string;
  onSave: (enabled: boolean, email: string) => void;
  onClose: () => void;
}) => {
  const [twoFactorEmail, setTwoFactorEmail] = useState(email);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-[#0F766E]" />
              <h3 className="text-lg font-bold text-gray-800">
                {enabled ? 'Disable' : 'Enable'} 2FA
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {enabled ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Disabling 2FA will make your account less secure. Are you sure?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onSave(false, email)}
                  className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 active:scale-95 transition"
                >
                  Disable 2FA
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                When enabled, we'll send a verification code to your email every
                time you log in.
              </p>

              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email for 2FA codes
                </label>
                <input
                  type="email"
                  value={twoFactorEmail}
                  onChange={(e) => setTwoFactorEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!twoFactorEmail.trim()) {
                      toast.error('Please enter email');
                      return;
                    }
                    onSave(true, twoFactorEmail.trim());
                  }}
                  className="flex-1 bg-[#0F766E] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#065F46] active:scale-95 transition"
                >
                  Enable 2FA
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// PAYOUT MODAL
// ============================================================
const PayoutModal = ({
  payout,
  onSave,
  onClose,
}: {
  payout: PayoutDetails;
  onSave: (data: PayoutDetails) => void;
  onClose: () => void;
}) => {
  const [data, setData] = useState<PayoutDetails>(payout);

  const handleSubmit = () => {
    if (data.preferredMethod === 'bank') {
      if (!data.bankName || !data.accountTitle || !data.accountNumber) {
        toast.error('Please fill bank details');
        return;
      }
      if (data.iban && !validateIBAN(data.iban)) {
        toast.error('Invalid IBAN format');
        return;
      }
    } else if (data.preferredMethod === 'jazzcash') {
      if (!data.jazzCash) {
        toast.error('Please enter JazzCash number');
        return;
      }
    } else if (data.preferredMethod === 'easypaisa') {
      if (!data.easyPaisa) {
        toast.error('Please enter EasyPaisa number');
        return;
      }
    }

    onSave(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[95vh] overflow-y-auto"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaCreditCard className="text-[#0F766E]" />
              <h3 className="text-lg font-bold text-gray-800">
                Payout Settings
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Preferred Method */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Preferred Payout Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bank', label: 'Bank', icon: FaUniversity },
                { id: 'jazzcash', label: 'JazzCash', icon: FaMobile },
                { id: 'easypaisa', label: 'EasyPaisa', icon: FaMobile },
              ].map((method) => {
                const Icon = method.icon;
                const isActive = data.preferredMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() =>
                      setData({
                        ...data,
                        preferredMethod: method.id as PayoutDetails['preferredMethod'],
                      })
                    }
                    className={`flex flex-col items-center gap-1 py-3 rounded-lg border-2 transition ${
                      isActive
                        ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E]'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-[11px] font-medium">
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bank Fields */}
          {data.preferredMethod === 'bank' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={data.bankName}
                  onChange={(e) =>
                    setData({ ...data, bankName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                  placeholder="e.g. HBL, Meezan, UBL"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Account Title *
                </label>
                <input
                  type="text"
                  value={data.accountTitle}
                  onChange={(e) =>
                    setData({ ...data, accountTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                  placeholder="Account holder name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={data.accountNumber}
                  onChange={(e) =>
                    setData({ ...data, accountNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                  placeholder="Account number"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  IBAN (optional)
                </label>
                <input
                  type="text"
                  value={data.iban}
                  onChange={(e) =>
                    setData({ ...data, iban: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none font-mono"
                  placeholder="PK36SCBL0000001123456702"
                  maxLength={24}
                />
              </div>
            </div>
          )}

          {/* JazzCash */}
          {data.preferredMethod === 'jazzcash' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                JazzCash Number *
              </label>
              <input
                type="tel"
                value={data.jazzCash}
                onChange={(e) =>
                  setData({ ...data, jazzCash: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                placeholder="03XX-XXXXXXX"
                maxLength={15}
              />
            </div>
          )}

          {/* EasyPaisa */}
          {data.preferredMethod === 'easypaisa' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                EasyPaisa Number *
              </label>
              <input
                type="tel"
                value={data.easyPaisa}
                onChange={(e) =>
                  setData({ ...data, easyPaisa: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                placeholder="03XX-XXXXXXX"
                maxLength={15}
              />
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 flex gap-2">
            <span className="text-blue-600">💡</span>
            <p className="text-[10px] sm:text-xs text-blue-800">
              Payouts are processed weekly. Minimum payout: PKR 5,000.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-5">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-[#0F766E] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#065F46] active:scale-95 transition"
            >
              Save Payout
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
    );
};

export default SellerSettings;
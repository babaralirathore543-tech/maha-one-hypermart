// src/components/common/seller/SellerRegistration.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaStore, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaCity, FaCheckCircle, FaFileContract
} from 'react-icons/fa';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../context/AuthContext';

const SellerRegistration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    storeName: '',
    storeDescription: '',
    address: '',
    city: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Terms check
    if (!agreedToTerms) {
      alert('⚠️ Please agree to the Seller Terms & Conditions before submitting.');
      return;
    }

    setLoading(true);

    try {
      console.log('📝 Submitting seller application');
      console.log('📝 Logged in user:', user?.uid);

      // ✅ Generate unique sellerId
      const sellerId = `SELLER-${Date.now().toString().slice(-6)}`;

      // ✅ Document ID priority:
      // 1. Agar user logged in hai → user.uid (best, layout fetch ke liye)
      // 2. Warna email-based fallback
      const docId = user?.uid
        || formData.email.replace(/[^a-zA-Z0-9]/g, '_')
        || sellerId;

      const sellerRef = doc(db, 'sellers', docId);

      await setDoc(sellerRef, {
        userId: user?.uid || docId,
        sellerId: sellerId,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        storeName: formData.storeName,
        storeDescription: formData.storeDescription,
        address: formData.address,
        city: formData.city,
        verificationStatus: 'pending',
        storeConfig: null,
        agreedToTerms: true,                    // ✅ Track acceptance
        agreedToTermsAt: serverTimestamp(),     // ✅ Timestamp of acceptance
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      console.log('✅ Seller saved. Doc ID:', docId);

      setSubmitted(true);
    } catch (error) {
      console.error('❌ Registration error:', error);
      alert('Failed to submit application.\n\nError: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ============================================================
  // SUCCESS STATE
  // ============================================================
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Application Submitted! 🎉
          </h2>
          <p className="text-gray-600 mb-4">
            Your seller application has been submitted successfully.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              ⏳ <span className="font-semibold">Pending Approval</span><br />
              Our admin team will review your application within 24-48 hours.
              You will be notified at <strong>{formData.email}</strong> once approved.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#0F766E] text-white py-3 rounded-lg font-semibold hover:bg-[#065F46] transition-colors"
          >
            Go to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // FORM STATE
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#3B1E54] to-[#5B2C6F] px-6 py-8">
          <div className="flex items-center gap-3">
            <FaStore className="text-3xl text-[#D4AF37]" />
            <div>
              <h1 className="text-2xl font-bold text-white">Become a Seller</h1>
              <p className="text-purple-100 text-sm">
                Start selling your products on MAHA ONE
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* PERSONAL INFO */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3B1E54] focus:border-[#3B1E54]"
                    placeholder="Hassan Ali"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3B1E54] focus:border-[#3B1E54]"
                    placeholder="hassan@example.com"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3B1E54] focus:border-[#3B1E54]"
                  placeholder="03XX-XXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* STORE INFO */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Store Information
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Name *
              </label>
              <div className="relative">
                <FaStore className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="storeName"
                  required
                  value={formData.storeName}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3B1E54] focus:border-[#3B1E54]"
                  placeholder="ABC Fashion Store"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Description *
              </label>
              <textarea
                name="storeDescription"
                required
                rows={4}
                value={formData.storeDescription}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3B1E54] focus:border-[#3B1E54]"
                placeholder="Describe your store and products..."
              />
            </div>
          </div>

          {/* ADDRESS */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Store Address
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Address *
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3B1E54] focus:border-[#3B1E54]"
                  placeholder="Shop #, Street, Area"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <div className="relative">
                <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3B1E54] focus:border-[#3B1E54]"
                  placeholder="Lahore"
                />
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* ✅ TERMS & CONDITIONS CHECKBOX                                */}
          {/* ============================================================ */}
          <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#3B1E54]/5 to-[#D4AF37]/5 rounded-lg border border-[#3B1E54]/20">
            <div className="flex-shrink-0 mt-1">
              <FaFileContract className="text-[#3B1E54] text-lg" />
            </div>
            <div className="flex-1">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-[#3B1E54] focus:ring-[#3B1E54] border-gray-300 rounded cursor-pointer accent-[#3B1E54]"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 cursor-pointer select-none"
                >
                  I have read and agree to the{' '}
                  <Link
                    to="/seller/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3B1E54] font-semibold hover:text-[#D4AF37] underline transition-colors"
                  >
                    Seller Terms & Conditions
                  </Link>
                  . I understand that violation of these terms may result in
                  account suspension or termination.
                </label>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className={`
                flex-1 py-3 rounded-lg font-semibold transition-all
                flex items-center justify-center gap-2
                ${
                  loading || !agreedToTerms
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#3B1E54] to-[#5B2C6F] text-white hover:shadow-lg'
                }
              `}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* HINT */}
          {!agreedToTerms && (
            <p className="text-xs text-center text-gray-500">
              👆 Please check the box to agree to the Terms & Conditions
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default SellerRegistration;
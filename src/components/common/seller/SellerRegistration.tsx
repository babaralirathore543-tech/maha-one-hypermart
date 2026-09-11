// src/components/common/seller/SellerRegistration.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaStore, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaCheckCircle } from 'react-icons/fa';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';

// ✅ Safe Auth import with fallback
import { useAuth } from '../../../context/AuthContext';

const SellerRegistration = () => {
  const navigate = useNavigate();
  let authData;
  
  try {
    authData = useAuth();
  } catch (e) {
    console.warn('AuthContext not available, using fallback');
    authData = { user: null };
  }
  
  const { user } = authData || { user: null };
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    
    if (!user) {
      alert('Please login first to become a seller');
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      console.log('📝 Submitting seller application for user:', user.uid);
      console.log('📝 Form data:', formData);

      const sellerRef = doc(db, 'sellers', user.uid);
      
      await setDoc(sellerRef, {
        userId: user.uid,
        fullName: formData.fullName,
        email: formData.email || user.email,
        phone: formData.phone,
        storeName: formData.storeName,
        storeDescription: formData.storeDescription,
        address: formData.address,
        city: formData.city,
        verificationStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log('✅ Seller application saved to Firestore!');
      setSubmitted(true);

    } catch (error) {
      console.error('❌ Registration error:', error);
      alert('Failed to submit application. Please try again.\n\nError: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Success Screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center p-8"
        >
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-5xl text-green-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted! 🎉</h2>
          <p className="text-gray-600 mb-4">
            Your seller application has been submitted successfully.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              ⏳ <span className="font-semibold">Pending Approval</span><br />
              Our admin team will review your application within 24-48 hours.
              You will receive a notification once your account is approved.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-[#0F766E] text-white py-3 rounded-lg font-semibold hover:bg-[#065F46] transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F766E] to-[#065F46] px-6 py-8">
          <div className="flex items-center gap-3">
            <FaStore className="text-3xl text-[#D4AF37]" />
            <div>
              <h1 className="text-2xl font-bold text-white">Become a Seller</h1>
              <p className="text-teal-100 text-sm">Start selling your products on MAHA ONE</p>
            </div>
          </div>
          {user && (
            <p className="text-teal-200 text-xs mt-2">
              Logged in as: {user.email}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
                  placeholder="03XX-XXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Store Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Store Name *</label>
              <div className="relative">
                <FaStore className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="storeName"
                  required
                  value={formData.storeName}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
                  placeholder="ABC Fashion Store"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Store Description *</label>
              <textarea
                name="storeDescription"
                required
                rows={4}
                value={formData.storeDescription}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
                placeholder="Describe your store and products..."
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Store Address</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Address *</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
                  placeholder="Shop #, Street, Area"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City *</label>
              <div className="relative">
                <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
                  placeholder="Lahore"
                />
              </div>
            </div>
          </div>

          {/* Terms & Submit */}
          <div className="flex items-start">
            <input
              type="checkbox"
              required
              id="terms"
              className="mt-1 h-4 w-4 text-[#0F766E] focus:ring-[#0F766E] border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the <a href="#" className="text-[#0F766E] hover:underline">Seller Terms & Conditions</a>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
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
        </form>
      </motion.div>
    </div>
  );
};

export default SellerRegistration;
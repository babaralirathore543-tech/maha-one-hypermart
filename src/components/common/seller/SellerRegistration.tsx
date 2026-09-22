// src/components/common/seller/SellerRegistration.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaStore, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaCity, FaCheckCircle, FaFileContract, FaSpinner,
  FaSignInAlt, FaHourglassHalf, FaTimesCircle, FaHome,
} from 'react-icons/fa';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';
import { useAuth } from '../../../context/AuthContext';

type CheckState =
  | 'checking'
  | 'redirecting-to-signup'
  | 'can-register'
  | 'already-registered'
  | 'pending'
  | 'rejected';

const SellerRegistration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [checkState, setCheckState] = useState<CheckState>('checking');
  const [existingSeller, setExistingSeller] = useState<any>(null);

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

  // ============================================================
  // ✅ CHECK ON MOUNT
  // ============================================================
  useEffect(() => {
    const check = async () => {
      const currentUser = auth.currentUser;

      // ❌ Not logged in → redirect to signup with return URL
      if (!currentUser) {
        setCheckState('redirecting-to-signup');
        setTimeout(() => {
          navigate('/signup?redirect=/seller/register', { replace: true });
        }, 1500);
        return;
      }

      // Prefill from Firebase
      setFormData((prev) => ({
        ...prev,
        fullName: currentUser.displayName || prev.fullName,
        email: currentUser.email || prev.email,
      }));

      try {
        const sellerSnap = await getDoc(doc(db, 'sellers', currentUser.uid));

        if (sellerSnap.exists()) {
          const data = sellerSnap.data();
          setExistingSeller(data);

          const status = data.verificationStatus || 'pending';
          if (status === 'approved') {
            setCheckState('already-registered');
          } else if (status === 'pending') {
            setCheckState('pending');
          } else if (status === 'rejected') {
            setCheckState('rejected');
          } else {
            setCheckState('can-register');
          }
        } else {
          setCheckState('can-register');
        }
      } catch (err) {
        console.error('Error checking seller:', err);
        setCheckState('can-register');
      }
    };

    check();
  }, [navigate]);

  // ============================================================
  // ✅ AUTO REDIRECT — Approved sellers
  // ============================================================
  useEffect(() => {
    if (checkState === 'already-registered') {
      const timer = setTimeout(() => {
        navigate('/seller', { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [checkState, navigate]);

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('⚠️ Please login first to register as a seller.');
      navigate('/login');
      return;
    }

    if (!agreedToTerms) {
      alert('⚠️ Please agree to the Seller Terms & Conditions before submitting.');
      return;
    }

    setLoading(true);

    try {
      const sellerId = `SELLER-${Date.now().toString().slice(-6)}`;

      await setDoc(
        doc(db, 'sellers', user.uid),
        {
          userId: user.uid,
          sellerId,
          fullName: formData.fullName,
          email: formData.email || user.email,
          phone: formData.phone,
          storeName: formData.storeName,
          storeDescription: formData.storeDescription,
          address: formData.address,
          city: formData.city,
          verificationStatus: 'pending',
          storeConfig: null,
          agreedToTerms: true,
          agreedToTermsAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSubmitted(true);
    } catch (error) {
      console.error('❌ Registration error:', error);
      alert('Failed to submit application.\n\nError: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ============================================================
  // STATE 1: CHECKING
  // ============================================================
  if (checkState === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#3B1E54] mx-auto" />
          <p className="text-gray-500 mt-4 text-sm sm:text-base">
            Checking seller status...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // STATE 1b: REDIRECTING TO SIGNUP
  // ============================================================
  if (checkState === 'redirecting-to-signup') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSignInAlt className="text-4xl sm:text-5xl text-amber-500" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Account Required
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Please create an account first to register as a seller.
          </p>

          <FaSpinner className="animate-spin text-2xl text-[#3B1E54] mx-auto" />

          <p className="text-xs text-gray-500 mt-4">
            Redirecting to signup...
          </p>

          <button
            onClick={() => navigate('/signup?redirect=/seller/register')}
            className="w-full mt-6 bg-[#3B1E54] text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-[#5B2C6F] transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <FaSignInAlt />
            Go to Signup Now
          </button>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // STATE 2: APPROVED
  // ============================================================
  if (checkState === 'already-registered') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-4xl sm:text-5xl text-green-500" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            You're Already a Seller! 🎉
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Redirecting to your dashboard...
          </p>

          <FaSpinner className="animate-spin text-2xl text-[#3B1E54] mx-auto" />

          <button
            onClick={() => navigate('/seller')}
            className="w-full mt-6 bg-[#3B1E54] text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-[#5B2C6F] transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <FaSignInAlt />
            Go to Dashboard Now
          </button>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // STATE 3: PENDING
  // ============================================================
  if (checkState === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHourglassHalf className="text-4xl sm:text-5xl text-yellow-500" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Application Under Review
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Your seller application is pending admin approval. We'll notify you
            at{' '}
            <strong className="break-all">
              {existingSeller?.email || user?.email}
            </strong>{' '}
            once approved.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-left">
            <p className="text-xs sm:text-sm text-yellow-800">
              ⏳ <strong>Typical approval time:</strong> 24-48 hours
            </p>
          </div>

          <button
            onClick={() => navigate('/home')}
            className="w-full bg-[#3B1E54] text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-[#5B2C6F] transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <FaHome />
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // STATE 4: REJECTED
  // ============================================================
  if (checkState === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="text-4xl sm:text-5xl text-red-500" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Application Rejected
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Unfortunately, your seller application was not approved. Please
            contact support for more information.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/contact')}
              className="w-full bg-[#3B1E54] text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-[#5B2C6F] transition-colors text-sm sm:text-base"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate('/home')}
              className="w-full border border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <FaHome />
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // STATE 5: SUCCESS
  // ============================================================
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-4xl sm:text-5xl text-green-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Application Submitted! 🎉
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Your seller application has been submitted successfully.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-6 text-left">
            <p className="text-xs sm:text-sm text-yellow-800">
              ⏳ <span className="font-semibold">Pending Approval</span>
              <br />
              Our admin team will review your application within 24-48 hours.
              You will be notified at{' '}
              <strong className="break-all">{formData.email}</strong> once
              approved.
            </p>
          </div>
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-[#0F766E] text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-[#065F46] transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <FaHome />
            Go to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // STATE 6: FORM
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-10 md:py-12 px-3 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#3B1E54] to-[#5B2C6F] px-4 sm:px-6 py-5 sm:py-8">
          <div className="flex items-center gap-3">
            <FaStore className="text-2xl sm:text-3xl text-[#D4AF37] flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-white">
                Become a Seller
              </h1>
              <p className="text-purple-100 text-xs sm:text-sm">
                Start selling your products on MAHA ONE
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* PERSONAL INFO */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 border-b pb-2">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B1E54] focus:border-transparent outline-none"
                    placeholder="Hassan Ali"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Email *
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B1E54] focus:border-transparent outline-none"
                    placeholder="hassan@example.com"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B1E54] focus:border-transparent outline-none"
                  placeholder="03XX-XXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* STORE INFO */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 border-b pb-2">
              Store Information
            </h2>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Store Name *
              </label>
              <div className="relative">
                <FaStore className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="storeName"
                  required
                  value={formData.storeName}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B1E54] focus:border-transparent outline-none"
                  placeholder="ABC Fashion Store"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Store Description *
              </label>
              <textarea
                name="storeDescription"
                required
                rows={4}
                value={formData.storeDescription}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B1E54] focus:border-transparent outline-none resize-y"
                placeholder="Describe your store and products..."
              />
            </div>
          </div>

          {/* ADDRESS */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 border-b pb-2">
              Store Address
            </h2>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Full Address *
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B1E54] focus:border-transparent outline-none"
                  placeholder="Shop #, Street, Area"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                City *
              </label>
              <div className="relative">
                <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B1E54] focus:border-transparent outline-none"
                  placeholder="Lahore"
                />
              </div>
            </div>
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-[#3B1E54]/5 to-[#D4AF37]/5 rounded-lg border border-[#3B1E54]/20">
            <div className="flex-shrink-0 mt-0.5">
              <FaFileContract className="text-[#3B1E54] text-base sm:text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#3B1E54] focus:ring-[#3B1E54] border-gray-300 rounded cursor-pointer accent-[#3B1E54]"
                />
                <label
                  htmlFor="terms"
                  className="text-xs sm:text-sm text-gray-700 cursor-pointer select-none leading-relaxed"
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
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className={`
                w-full sm:flex-1 py-2.5 sm:py-3 rounded-lg font-semibold transition-all
                flex items-center justify-center gap-2 text-sm sm:text-base
                ${
                  loading || !agreedToTerms
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#3B1E54] to-[#5B2C6F] text-white hover:shadow-lg'
                }
              `}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>

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
// src/components/pages/SignupPage.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaCheckCircle
} from 'react-icons/fa';

import {
  auth,
  db,
  createUserWithEmailAndPassword,
  updateProfile,
  doc,
  setDoc
} from '../../config/firebase';

import { sendSignupWelcomeWhatsApp } from '../../services/whatsappNotificationService';

const logo = '/images/logo.png';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ==========================================
  // SIGNUP
  // ==========================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess(false);

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!name || !email || !phone || !password) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      // ==========================================
      // 1. CREATE FIREBASE AUTH USER
      // ==========================================

      console.log('🔐 Creating Firebase Authentication user...');

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      console.log('✅ Firebase Auth user created');
      console.log('👤 UID:', firebaseUser.uid);

      // ==========================================
      // 2. UPDATE FIREBASE PROFILE
      // ==========================================

      await updateProfile(firebaseUser, {
        displayName: name
      });

      console.log('✅ Firebase profile updated');

      // ==========================================
      // 3. CREATE USER DOCUMENT IN FIRESTORE
      // ==========================================

      const userDocRef = doc(db, 'users', firebaseUser.uid);

      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        name: name,
        email: email,
        phone: phone,
        role: 'customer',
        isActive: true,
        isVerified: false,
        wishlist: [],
        cart: [],
        address: {
          street: '',
          city: '',
          province: '',
          postalCode: '',
          country: 'Pakistan'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('✅ Firestore user document created');

      // ==========================================
      // 4. SAVE USER LOCALLY
      // ==========================================

      const userData = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        name: name,
        email: email,
        phone: phone,
        role: 'customer',
        isActive: true,
        isVerified: false
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userId', firebaseUser.uid);

      window.dispatchEvent(new Event('userUpdated'));

      // ==========================================
      // SUCCESS
      // ==========================================

      setSuccess(true);

      console.log('🎉 Signup completed successfully');

      // ==========================================
      // SEND WHATSAPP MESSAGE
      // ==========================================

      if (phone) {
        try {
          await sendSignupWelcomeWhatsApp(phone, name, email);
          console.log('📱 WhatsApp welcome message triggered');
        } catch (whatsappError) {
          console.warn('⚠️ WhatsApp message failed:', whatsappError);
        }
      }

      // ==========================================
      // RESET FORM
      // ==========================================

      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });

      // ==========================================
      // REDIRECT
      // ==========================================

      setTimeout(() => {
        navigate('/', {
          replace: true
        });
      }, 2000);

    } catch (error: any) {
      console.error('❌ Signup error:', error);

      // ==========================================
      // FIREBASE AUTH ERRORS
      // ==========================================

      let errorMessage = 'Signup failed. Please try again.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.';
          break;

        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;

        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;

        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;

        case 'permission-denied':
          errorMessage = 'Permission denied. Please check Firebase Firestore Rules.';
          break;

        default:
          errorMessage = error.message || 'Signup failed. Please try again.';
      }

      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md my-4 sm:my-6">

        {/* ==========================================
            LOGO
        ========================================== */}

        <div className="text-center mb-6">
          <div className="flex items-center justify-center">
            <img
              src={logo}
              alt="Maha One Logo"
              className="h-14 sm:h-16 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'w-14 h-14 sm:w-16 sm:h-16 bg-[#0F766E] rounded-full flex items-center justify-center text-white text-2xl font-bold';
                  fallback.textContent = 'M';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mt-3">
            <span className="text-[#0F766E]">MAHA</span>
            <span className="text-[#D4AF37]"> ONE</span>
          </h1>

          <p className="text-gray-500 text-sm">
            Create your account
          </p>
        </div>

        {/* ==========================================
            SUCCESS MESSAGE
        ========================================== */}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
            <FaCheckCircle className="text-green-500 flex-shrink-0" />
            <span>
              Account created successfully! Redirecting...
            </span>
          </div>
        )}

        {/* ==========================================
            ERROR MESSAGE
        ========================================== */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* ==========================================
            SIGNUP FORM
        ========================================== */}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

          {/* FULL NAME */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none text-sm sm:text-base"
                placeholder="Your Full Name"
                required
              />
            </div>
          </div>

          {/* EMAIL */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none text-sm sm:text-base"
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* PHONE */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none text-sm sm:text-base"
                placeholder="03XX-XXXXXXX"
                autoComplete="tel"
                required
              />
            </div>

            <p className="text-[10px] text-gray-400 mt-1">
              📱 We'll send order updates via WhatsApp
            </p>
          </div>

          {/* PASSWORD */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />

              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none text-sm sm:text-base"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={6}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />

              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none text-sm sm:text-base"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#0F766E] text-white py-2.5 rounded-lg font-medium hover:bg-[#065F46] transition disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? 'Creating account...' : success ? 'Account Created!' : 'Create Account'}
          </button>

        </form>

        {/* ==========================================
            LOGIN LINK
        ========================================== */}

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0F766E] font-medium hover:underline">
            Sign In
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2026 Maha One HyperMart. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default SignupPage;
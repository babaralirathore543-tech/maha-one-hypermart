import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

import {
  auth,
  db,
  signInWithEmailAndPassword,
  doc,
  getDoc,
} from '../../config/firebase';

const logo = '/images/logo.png';

const ADMIN_EMAIL = 'mahaonehypermarket@gmail.com';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      console.log('🔐 Firebase login:', cleanEmail);

      // ==========================================
      // 1. FIREBASE AUTHENTICATION
      // ==========================================
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const firebaseUser = userCredential.user;

      console.log('✅ Firebase Auth successful');
      console.log('👤 UID:', firebaseUser.uid);
      console.log('📧 Email:', firebaseUser.email);

      // ==========================================
      // 2. ADMIN CHECK
      // ==========================================
      if (firebaseUser.email?.toLowerCase() === ADMIN_EMAIL) {
        const adminUser = {
          id: firebaseUser.uid,
          name: 'Babar Ali',
          email: firebaseUser.email,
          role: 'admin',
          isActive: true,
        };

        // Store user information for UI
        localStorage.setItem('user', JSON.stringify(adminUser));
        localStorage.setItem('userId', firebaseUser.uid);

        // IMPORTANT:
        // Do NOT create a fake Firebase token.
        // Firebase Auth automatically manages the real session.

        window.dispatchEvent(new Event('userUpdated'));
        window.dispatchEvent(new Event('storage'));

        console.log('👑 ADMIN LOGIN SUCCESS');

        navigate('/admin', { replace: true });
        return;
      }

      // ==========================================
      // 3. NORMAL USER
      // ==========================================

      let userData: any = {};

      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          userData = userDocSnap.data();
          console.log('👤 Firestore user:', userData);
        } else {
          console.log('ℹ️ No users document found. Using Firebase profile.');
        }
      } catch (firestoreError) {
        console.warn(
          '⚠️ Could not read users document:',
          firestoreError
        );
      }

      const user = {
        id: firebaseUser.uid,
        name:
          userData.name ||
          firebaseUser.displayName ||
          'User',
        email: firebaseUser.email || cleanEmail,
        role: userData.role || 'customer',
        isActive: userData.isActive !== false,
        phone: userData.phone || '',
        isVerified: userData.isVerified || false,
        photoURL:
          userData.photoURL ||
          firebaseUser.photoURL ||
          '',
      };

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', firebaseUser.uid);

      window.dispatchEvent(new Event('userUpdated'));
      window.dispatchEvent(new Event('storage'));

      // ==========================================
      // 4. REDIRECT
      // ==========================================

      if (user.role === 'admin') {
        console.log('👑 ADMIN ROLE → /admin');
        navigate('/admin', { replace: true });
      } else {
        console.log('👤 CUSTOMER → /');
        navigate('/', { replace: true });
      }

    } catch (error: any) {
      console.error('❌ Firebase Login Error:', error);

      let message = 'Login failed. Please try again.';

      switch (error.code) {
        case 'auth/invalid-credential':
          message = '❌ Incorrect email or password.';
          break;

        case 'auth/invalid-email':
          message = '❌ Please enter a valid email address.';
          break;

        case 'auth/user-not-found':
          message = '❌ No account found with this email.';
          break;

        case 'auth/wrong-password':
          message = '❌ Incorrect password.';
          break;

        case 'auth/too-many-requests':
          message =
            '❌ Too many login attempts. Please try again later.';
          break;

        case 'auth/network-request-failed':
          message =
            '❌ Network error. Please check your internet connection.';
          break;

        case 'permission-denied':
          message =
            '❌ Firestore permission denied. Please check your security rules.';
          break;

        default:
          message = `❌ ${error.message || 'Login failed.'}`;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ Fixed: Proper top padding to prevent search bar overlap
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-4 sm:py-6 md:py-8">
      
      {/* ✅ Added mt-16 sm:mt-20 md:mt-24 lg:mt-28 to push content below search bar */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md mt-16 sm:mt-20 md:mt-24 lg:mt-28 mb-4 sm:mb-6">

        {/* LOGO */}
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
                  fallback.className =
                    'w-14 h-14 sm:w-16 sm:h-16 bg-[#0F766E] rounded-full flex items-center justify-center text-white text-2xl font-bold';
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
            Sign in to your account
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none text-sm sm:text-base"
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none text-sm sm:text-base"
                placeholder="••••••••"
                autoComplete="current-password"
                required
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

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F766E] text-white py-2.5 rounded-lg font-medium hover:bg-[#065F46] transition disabled:opacity-50 flex items-center justify-center text-sm sm:text-base"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* SIGN UP */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#0F766E] font-medium hover:underline">
            Sign Up
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2024 Maha One HyperMart. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
// src/components/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

// ✅ SAHI IMPORTS
import { auth, signInWithEmailAndPassword } from '../../config/firebase';

const LoginPage = () => {
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

    try {
      console.log('🔐 Attempting login for:', email.trim().toLowerCase());
      
      // ✅ Email ko lowercase karein
      const loginEmail = email.trim().toLowerCase();
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        password
      );
      
      console.log('✅ Login successful:', userCredential.user.email);
      
      // ✅ Redirect to home
      navigate('/', { replace: true });
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      let message = 'Incorrect email or password.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          message = '❌ No account found with this email. Please sign up.';
          break;
        case 'auth/wrong-password':
          message = '❌ Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          message = '❌ Invalid email address.';
          break;
        case 'auth/too-many-requests':
          message = '❌ Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          message = '❌ Network error. Please check your internet connection.';
          break;
        default:
          message = error.message || '❌ Incorrect email or password.';
      }
      
      setError(message);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            <span className="text-[#0F766E]">MAHA</span>
            <span className="text-[#D4AF37]"> ONE</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
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
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
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
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                placeholder="••••••••"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F766E] text-white py-2.5 rounded-lg font-medium hover:bg-[#065F46] transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#0F766E] font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
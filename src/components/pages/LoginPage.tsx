import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { db, collection, query, where, getDocs } from '../../config/firebase';

const logo = '/images/logo.png';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // ✅ HARDCODED ADMIN LOGIN (Working - Hidden)
    if (email === 'babarrathore576@gmail.com' && password === 'Youthcolonel1212') {
      const user = {
        id: 'admin_001',
        name: 'Babar Ali',
        email: 'babarrathore576@gmail.com',
        role: 'admin',
        isActive: true
      };
      
      localStorage.setItem('token', 'dummy_token_admin_123');
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', 'admin_001');
      
      window.dispatchEvent(new Event('userUpdated'));
      window.dispatchEvent(new Event('storage'));
      
      navigate('/admin');
      return;
    }

    // ✅ HARDCODED CUSTOMER LOGIN (Hidden)
    if (email === 'user@example.com' && password === 'user123') {
      const user = {
        id: 'customer_001',
        name: 'Customer User',
        email: 'user@example.com',
        role: 'customer',
        isActive: true
      };
      
      localStorage.setItem('token', 'dummy_token_user_123');
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', 'customer_001');
      
      window.dispatchEvent(new Event('userUpdated'));
      window.dispatchEvent(new Event('storage'));
      
      navigate('/');
      return;
    }

    // ✅ FIREBASE LOGIN (Backup)
    try {
      console.log('🔍 Checking Firebase for:', email);

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('❌ User not found. Please check your email.');
        setLoading(false);
        return;
      }

      let userData: any = null;
      let userId = '';

      querySnapshot.forEach((doc) => {
        userData = doc.data();
        userId = doc.id;
        console.log('✅ User found:', userData);
      });

      if (userData && userData.password === password) {
        const user = {
          id: userId,
          name: userData.name || 'User',
          email: userData.email,
          role: userData.role || 'customer',
          isActive: userData.isActive !== false,
          phone: userData.phone || '',
          isVerified: userData.isVerified || false
        };
        
        localStorage.setItem('token', 'firebase_token_' + Date.now());
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', userId);
        
        window.dispatchEvent(new Event('userUpdated'));
        window.dispatchEvent(new Event('storage'));
        
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        return;
      } else {
        setError('❌ Invalid password. Please try again.');
        setLoading(false);
        return;
      }

    } catch (error: any) {
      console.error('❌ Firebase Login error:', error);
      setError('❌ Login failed. Please try again.');
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center">
            <img 
              src={logo} 
              alt="Maha One Logo" 
              className="h-16 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'w-16 h-16 bg-[#0F766E] rounded-full flex items-center justify-center text-white text-2xl font-bold';
                  fallback.textContent = 'M';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-3">
            <span className="text-[#0F766E]">MAHA</span>
            <span className="text-[#D4AF37]"> ONE</span>
          </h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#0F766E] font-medium hover:underline">
            Sign Up
          </Link>
        </p>

        {/* ❌ DEMO CREDENTIALS COMPLETELY REMOVED - Hidden */}

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2024 Maha One HyperMart. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
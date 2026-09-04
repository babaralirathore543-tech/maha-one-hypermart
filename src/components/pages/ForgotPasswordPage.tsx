// src/components/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { auth, sendPasswordResetEmail } from '../../config/firebase';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Sending password reset email to:', cleanEmail);
      
      await sendPasswordResetEmail(auth, cleanEmail, {
        url: window.location.origin + '/login',
        handleCodeInApp: false,
      });

      console.log('✅ Password reset email sent successfully');
      setSuccess(true);
      setEmail('');

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error: any) {
      console.error('❌ Password reset error:', error);

      let message = 'Failed to send reset email. Please try again.';

      switch (error.code) {
        case 'auth/user-not-found':
          message = '❌ No account found with this email address.';
          break;
        case 'auth/invalid-email':
          message = '❌ Invalid email address format.';
          break;
        case 'auth/too-many-requests':
          message = '❌ Too many requests. Please try again later.';
          break;
        case 'auth/network-request-failed':
          message = '❌ Network error. Please check your internet connection.';
          break;
        default:
          message = error.message || 'Failed to send reset email. Please try again.';
      }

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md mt-16">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            <span className="text-[#0F766E]">MAHA</span>
            <span className="text-[#D4AF37]"> ONE</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Reset your password</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
            <FaCheckCircle className="text-green-500 flex-shrink-0" />
            <span>
              ✅ Password reset email sent! Please check your inbox.
              <br />
              <span className="text-xs text-green-500">Redirecting to login...</span>
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
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
                disabled={loading || success}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              We'll send a password reset link to this email.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-2.5 rounded-lg font-medium text-white transition flex items-center justify-center gap-2 ${
              loading || success
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#0F766E] hover:bg-[#065F46]'
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-600 mt-4">
          <Link to="/login" className="text-[#0F766E] font-medium hover:underline flex items-center justify-center gap-1">
            <FaArrowLeft className="text-xs" />
            Back to Sign In
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-4">
          © 2024 Maha One HyperMart. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
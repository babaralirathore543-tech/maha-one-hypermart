// src/components/customer/CustomerLayout.tsx
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getWishlistCount } from '../../services/wishlistService';
import CustomerSidebar from './CustomerSidebar';
import CustomerHeader from './CustomerHeader';
import PageLoader from '../common/PageLoader';

const CustomerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { getCartCount } = useCart();

  const [wishlistCount, setWishlistCount] = useState(0);

  // ✅ Wait for auth loading before redirecting
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // ✅ Wishlist count using service (correct path: users/{uid}.wishlist)
  useEffect(() => {
    if (!user?.uid) return;

    const fetchCount = async () => {
      const count = await getWishlistCount(user.uid);
      setWishlistCount(count);
    };

    fetchCount();

    // ✅ Refresh on wishlist changes from anywhere in the app
    const handleUpdate = () => fetchCount();
    window.addEventListener('wishlistUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [user?.uid]);

  // ✅ Show spinner while auth resolves
  if (loading) {
    return <PageLoader />;
  }

  if (!user) return null;

  // ✅ Current tab from URL
  const getCurrentTab = (): string => {
    const path = location.pathname;
    if (path.includes('/orders')) return 'orders';
    if (path.includes('/wishlist')) return 'wishlist';
    if (path.includes('/addresses')) return 'addresses';
    if (path.includes('/payments')) return 'payments';
    if (path.includes('/history')) return 'history';
    if (path.includes('/settings')) return 'settings';
    return 'overview';
  };

  const handleTabChange = (tab: string) => {
    navigate(`/dashboard/${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader
        userName={user.displayName || 'Friend'}
        cartCount={getCartCount()}      // ✅ real count
        wishlistCount={wishlistCount}
        notificationCount={0}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <CustomerSidebar
            activeTab={getCurrentTab()}
            onTabChange={handleTabChange}
          />

          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
// src/components/common/SellerRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from './PageLoader';

interface SellerRouteProps {
  children: React.ReactNode;
}

const SellerRoute = ({ children }: SellerRouteProps) => {
  const { user, appUser, loading, isSeller } = useAuth();
  const location = useLocation();

  // ✅ Wait for auth
  if (loading) {
    return <PageLoader />;
  }

  // ✅ Not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // ✅ Not a seller — send to seller registration
  if (!isSeller) {
    return <Navigate to="/seller/register" replace />;
  }

  // ✅ Seller suspended
  if (appUser?.status === 'suspended') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default SellerRoute;
// src/components/common/AdminRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from './PageLoader';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, appUser, loading, isAdmin } = useAuth();
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

  // ✅ Logged in but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin but suspended
  if (appUser?.status === 'suspended') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
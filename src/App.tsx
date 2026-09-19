// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { auth, onAuthStateChanged, db } from './config/firebase';

import AnimatedRoutes from './components/common/AnimatedRoutes';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import Popup from './components/common/Popup';
import PageLoader from './components/common/PageLoader';

import AdminPanel from './components/admin/AdminPanel';

import EidMiladPage from './components/pages/EidMiladPage';
import MaintenancePage from './components/pages/MaintenancePage';
import LoginPage from './components/pages/LoginPage';

// ============================================================
// ADMIN ROUTE — uses AuthContext (Firestore role)
// ============================================================
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // ✅ Wait for auth
  if (loading) return <PageLoader />;

  // ✅ Not logged in → login with return URL
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // ✅ Logged in but not admin → home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// ============================================================
// SELLER ROUTE — uses AuthContext + seller doc check
// ============================================================
const SellerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [sellerStatus, setSellerStatus] = useState<
    'approved' | 'pending' | 'rejected' | 'none' | null
  >(null);

  useEffect(() => {
    // ✅ Wait for auth loading before checking seller
    if (loading) return;

    if (!user) {
      setChecking(false);
      setSellerStatus('none');
      return;
    }

    let cancelled = false;

    const checkSeller = async () => {
      try {
        const sellerDoc = await getDoc(doc(db, 'sellers', user.uid));
        if (cancelled) return;

        if (sellerDoc.exists()) {
          const status = sellerDoc.data().verificationStatus;
          setSellerStatus(
            status === 'approved'
              ? 'approved'
              : status === 'rejected'
              ? 'rejected'
              : 'pending'
          );
        } else {
          setSellerStatus('none');
        }
      } catch (error) {
        console.error('❌ Error checking seller status:', error);
        if (!cancelled) setSellerStatus('none');
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    checkSeller();
    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  // ✅ Wait for both auth and seller doc
  if (loading || checking) return <PageLoader />;

  // ✅ Not logged in
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // ✅ No seller application → go to register
  if (sellerStatus === 'none') {
    return <Navigate to="/seller/register" replace />;
  }

  // ✅ Pending → go to home (or dedicated page)
  if (sellerStatus === 'pending') {
    return <Navigate to="/" replace />;
  }

  // ✅ Rejected → go to home
  if (sellerStatus === 'rejected') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const SHOW_EID_MILAD = false;
  const MAINTENANCE_MODE = false;

  // ─────────────────────────────────────────────
  // EID MILAD MODE
  // ─────────────────────────────────────────────
  if (SHOW_EID_MILAD) {
    return (
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="*" element={<EidMiladPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  }

  // ─────────────────────────────────────────────
  // MAINTENANCE MODE
  // ─────────────────────────────────────────────
  if (MAINTENANCE_MODE) {
    return (
      <ThemeProvider>
        <Router>
          <Routes>
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<MaintenancePage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  }

  // ─────────────────────────────────────────────
  // NORMAL WEBSITE
  // ─────────────────────────────────────────────
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-[#FFFDF7] dark:bg-[#111827]">
              <Navbar />

              <main className="flex-grow">
                <AnimatedRoutes
                  AdminRoute={AdminRoute}
                  SellerRoute={SellerRoute}
                />
              </main>

              <Footer />
            </div>

            <WhatsAppButton />

            <Popup
              image="https://res.cloudinary.com/kw3pdwrb/image/upload/v1787129090/ChatGPT_Image_Aug_19_2026_01_43_49_PM_gkjxzb.png"
              delay={2000}
            />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
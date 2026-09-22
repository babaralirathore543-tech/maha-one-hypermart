// src/App.tsx
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
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
// ERROR BOUNDARY
// ============================================================
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error('🚨 CAUGHT ERROR:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="max-w-md w-full text-center bg-white p-6 rounded-2xl shadow-xl">
            <div className="text-5xl mb-3">⚠️</div>
            <h1 className="text-xl font-bold text-red-600 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-600 mb-4 break-words">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================
// ADMIN ROUTE
// ============================================================
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// ============================================================
// SELLER ROUTE
// ============================================================
const SellerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [sellerStatus, setSellerStatus] = useState<
    'approved' | 'pending' | 'rejected' | 'none' | null
  >(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setChecking(false);
      setSellerStatus('none');
      return;
    }

    let cancelled = false;

    const checkSeller = async () => {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );

        const docPromise = getDoc(doc(db, 'sellers', user.uid));

        const sellerDoc = (await Promise.race([
          docPromise,
          timeoutPromise,
        ])) as any;

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

    const safetyTimer = setTimeout(() => {
      if (!cancelled) setChecking(false);
    }, 8000);

    return () => {
      cancelled = true;
      clearTimeout(safetyTimer);
    };
  }, [user, loading]);

  if (loading || checking) return <PageLoader />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (sellerStatus !== 'approved') {
    return <Navigate to="/seller/register" replace />;
  }

  return <>{children}</>;
};

// ============================================================
// APP CONTENT — inside Router, uses useLocation
// ============================================================
function AppContent() {
  const location = useLocation();

  // ✅ Detect special pages
  const isSellerPage = location.pathname.startsWith('/seller');
  const isAdminPage = location.pathname.startsWith('/admin');
  const isDashboard = location.pathname.startsWith('/dashboard');

  // ✅ Hide global chrome on these pages
  const hideChrome = isSellerPage || isAdminPage;

  return (
    <>
      <div className="min-h-[100dvh] flex flex-col bg-[#FFFDF7] dark:bg-[#111827]">
        {/* ✅ Navbar — only on public pages */}
        {!hideChrome && <Navbar />}

        <main className="flex-grow">
          <AnimatedRoutes
            AdminRoute={AdminRoute}
            SellerRoute={SellerRoute}
          />
        </main>

        {/* ✅ Footer — only on public pages */}
        {!hideChrome && <Footer />}
      </div>

      {/* ✅ Overlays — only on public pages */}
      {!hideChrome && !isDashboard && (
        <>
          <WhatsAppButton />
          <Popup
            image="https://res.cloudinary.com/kw3pdwrb/image/upload/v1787129090/ChatGPT_Image_Aug_19_2026_01_43_49_PM_gkjxzb.png"
            delay={2000}
          />
        </>
      )}
    </>
  );
}

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const SHOW_EID_MILAD = false;
  const MAINTENANCE_MODE = false;

  // EID MILAD MODE
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

  // MAINTENANCE MODE
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

  // NORMAL WEBSITE
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
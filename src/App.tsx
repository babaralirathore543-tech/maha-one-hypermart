// src/App.tsx
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

import { CartProvider } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
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
// SITE CONFIG TYPE
// ============================================================
interface SiteConfig {
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  maintenanceExpectedBack?: string;
  maintenanceProgress?: number;
  eidMiladMode?: boolean;
}

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
        <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-slate-900 p-4">
          <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="text-5xl mb-3">⚠️</div>
            <h1 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 break-words">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
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
// MAINTENANCE ROUTES (public — admin can still login)
// ============================================================
interface MaintenanceRoutesProps {
  config: SiteConfig;
}

const MaintenanceRoutes: React.FC<MaintenanceRoutesProps> = ({ config }) => {
  return (
    <Routes>
      {/* Admin can still access */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />
      {/* Login always accessible */}
      <Route path="/login" element={<LoginPage />} />
      {/* Everything else → maintenance page */}
      <Route
        path="*"
        element={
          <MaintenancePage
            message={config.maintenanceMessage}
            expectedBack={config.maintenanceExpectedBack}
            progress={config.maintenanceProgress}
          />
        }
      />
    </Routes>
  );
};

// ============================================================
// APP CONTENT (normal mode)
// ============================================================
function AppContent() {
  const location = useLocation();
  const { theme } = useTheme();

  // Body class for theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const isSellerPage = location.pathname.startsWith('/seller');
  const isAdminPage = location.pathname.startsWith('/admin');
  const isDashboard = location.pathname.startsWith('/dashboard');

  const hideChrome = isSellerPage || isAdminPage;

  return (
    <>
      <div className="min-h-[100dvh] flex flex-col bg-[#FFFDF7] dark:bg-[#0F172A] transition-colors duration-300">
        {!hideChrome && <Navbar />}

        <main className="flex-grow">
          <AnimatedRoutes
            AdminRoute={AdminRoute}
            SellerRoute={SellerRoute}
          />
        </main>

        {!hideChrome && <Footer />}
      </div>

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
// APP SHELL — mode switching based on Firestore config
// ============================================================
function AppShell() {
  const [config, setConfig] = useState<SiteConfig>({
    maintenanceMode: false,
    eidMiladMode: false,
  });
  const [configLoading, setConfigLoading] = useState(true);

  // ✅ Real-time config subscription
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'config', 'site'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as SiteConfig;
          setConfig({
            maintenanceMode: data.maintenanceMode ?? false,
            maintenanceMessage: data.maintenanceMessage,
            maintenanceExpectedBack: data.maintenanceExpectedBack,
            maintenanceProgress: data.maintenanceProgress,
            eidMiladMode: data.eidMiladMode ?? false,
          });
        } else {
          // Config doesn't exist → default (normal mode)
          setConfig({ maintenanceMode: false, eidMiladMode: false });
        }
        setConfigLoading(false);
      },
      (error) => {
        console.warn('⚠️ Config fetch failed, defaulting to normal mode:', error);
        setConfig({ maintenanceMode: false, eidMiladMode: false });
        setConfigLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Loading state
  if (configLoading) {
    return <PageLoader />;
  }

  // ✅ EID MILAD MODE — full takeover
  if (config.eidMiladMode) {
    return (
      <Routes>
        <Route path="*" element={<EidMiladPage />} />
      </Routes>
    );
  }

  // ✅ MAINTENANCE MODE — public locked, admin can access
  if (config.maintenanceMode) {
    return <MaintenanceRoutes config={config} />;
  }

  // ✅ NORMAL MODE
  return <AppContent />;
}

// ============================================================
// MAIN APP
// ============================================================
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <AppShell />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
// src/App.tsx

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

import { auth, onAuthStateChanged } from './config/firebase';

// 🔥 IMPORT ANIMATED ROUTES
import AnimatedRoutes from './components/common/AnimatedRoutes';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import Popup from './components/common/Popup';

// 🔥 SIRF ADMIN PANEL IMPORT
import AdminPanel from './components/admin/AdminPanel';

// Eid Milad aur Maintenance pages
import EidMiladPage from './components/pages/EidMiladPage';
import MaintenancePage from './components/pages/MaintenancePage';
import LoginPage from './components/pages/LoginPage';

// ============================================================
// ADMIN ROUTE
// ============================================================

const ADMIN_EMAIL = 'mahaonehypermarket@gmail.com';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('🔐 AdminRoute checking user:', firebaseUser?.email);

      if (!firebaseUser) {
        console.log('❌ No Firebase user');
        setIsAdmin(false);
        setChecking(false);
        window.location.replace('/login');
        return;
      }

      if (firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        console.log('👑 Admin authenticated');
        setIsAdmin(true);
      } else {
        console.log('❌ User is not admin:', firebaseUser.email);
        setIsAdmin(false);
        window.location.replace('/');
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E] mx-auto"></div>
          <p className="mt-4 text-gray-500 text-sm">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;
  return <>{children}</>;
};

// ❌ PROTECTED ROUTE — AB USE NAHI HO RAHA, ISLIYE HATA DIYA
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   ... code
// };

// ============================================================
// MAIN APP
// ============================================================

function App() {
  const SHOW_EID_MILAD = false;
  const MAINTENANCE_MODE = false;

  // ==========================================================
  // EID MILAD MODE
  // ==========================================================
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

  // ==========================================================
  // MAINTENANCE MODE
  // ==========================================================
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

  // ==========================================================
  // NORMAL WEBSITE — ANIMATED ROUTES WITH LOADER
  // ==========================================================
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] via-[#FFFDF7] to-[#F8FAFC] p-3 sm:p-4 md:p-6">
            <div className="w-full max-w-7xl mx-auto bg-white dark:bg-[#1F2937] rounded-2xl sm:rounded-3xl shadow-2xl dark:shadow-gray-900/50 overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-500 animate-float-box">
              <div className="min-h-screen flex flex-col">
                {/* NAVBAR */}
                <Navbar />

                {/* MAIN CONTENT — 🔥 ANIMATED ROUTES */}
                <main className="flex-grow">
                  <AnimatedRoutes />
                </main>

                {/* FOOTER */}
                <Footer />
              </div>
            </div>

            {/* FLOATING BUTTONS */}
            <WhatsAppButton />

            {/* POPUP */}
            <Popup
              image="https://res.cloudinary.com/kw3pdwrb/image/upload/v1787129090/ChatGPT_Image_Aug_19_2026_01_43_49_PM_gkjxzb.png"
              delay={2000}
            />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
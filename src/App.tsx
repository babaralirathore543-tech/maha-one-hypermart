// src/App.tsx

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

import { auth, onAuthStateChanged } from './config/firebase';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import AIAssistant from './components/common/AIAssistant';
import Popup from './components/common/Popup';

import AdminPanel from './components/admin/AdminPanel';
import AdminProductForm from './components/pages/AdminProductForm';
import AdminCakesProductForm from './components/pages/AdminCakesProductForm';
import AdminDryFruitsForm from './components/pages/AdminDryFruitsForm';
import AdminSweetsForm from './components/pages/AdminSweetsForm'; // ✅ NEW: Sweets Form

import EidMiladPage from './components/pages/EidMiladPage';
import MaintenancePage from './components/pages/MaintenancePage';

import HomePage from './components/pages/HomePage';
import DryFruitsPage from './components/pages/DryFruitsPage';
import SweetsPage from './components/pages/SweetsPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import FashionPage from './components/pages/FashionPage';
import FashionDetailPage from './components/pages/FashionDetailPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import CategoryPage from './components/pages/CategoryPage';
import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage';
import WishlistPage from './components/pages/WishlistPage';
import DashboardPage from './components/pages/DashboardPage';
import DryFruitsDetailPage from './components/pages/DryFruitsDetailPage';
import SweetsDetailPage from './components/pages/SweetsDetailPage';
import CakesPage from './components/pages/CakesPage';
import CakesDetailPage from './components/pages/CakesDetailPage';


// ============================================================
// ADMIN ROUTE
// Firebase Authentication based protection
// ============================================================

const ADMIN_EMAIL = 'mahaonehypermarket@gmail.com';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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

      // Admin email check
      if (
        firebaseUser.email?.toLowerCase() ===
        ADMIN_EMAIL.toLowerCase()
      ) {
        console.log('👑 Admin authenticated');

        setIsAdmin(true);
      } else {
        console.log(
          '❌ User is not admin:',
          firebaseUser.email
        );

        setIsAdmin(false);
        window.location.replace('/');
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Checking Firebase authentication
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E] mx-auto"></div>

          <p className="mt-4 text-gray-500 text-sm">
            Checking admin access...
          </p>

        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return null;
  }

  // Admin allowed
  return <>{children}</>;
};


// ============================================================
// PROTECTED ROUTE
// Firebase Authentication based protection
// ============================================================

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log(
        '🔐 ProtectedRoute user:',
        firebaseUser?.email
      );

      if (firebaseUser) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        window.location.replace('/login');
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Checking Firebase authentication
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E]"></div>

      </div> 
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
};


// ============================================================
// MAIN APP
// ============================================================

function App() {

  // ==========================================================
  // PAGE SETTINGS
  // ==========================================================

  // 12 Rabi ul Awwal page
  // true = Eid Milad page
  // false = normal website

  const SHOW_EID_MILAD = false;


  // Maintenance mode
  // true = maintenance page
  // false = normal website

  const MAINTENANCE_MODE = true;


  // ==========================================================
  // EID MILAD MODE
  // ==========================================================

  if (SHOW_EID_MILAD) {
    return (
      <ThemeProvider>

        <Router>

          <Routes>

            <Route
              path="*"
              element={<EidMiladPage />}
            />

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

            {/* Admin can access during maintenance */}

            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />

            {/* Login */}

            <Route
              path="/login"
              element={<LoginPage />}
            />

            {/* Everything else */}

            <Route
              path="*"
              element={<MaintenancePage />}
            />

          </Routes>

        </Router>

      </ThemeProvider>
    );
  }


  // ==========================================================
  // NORMAL WEBSITE
  // ==========================================================

  return (
    <ThemeProvider>

      <CartProvider>

        <Router>

          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] via-[#FFFDF7] to-[#F8FAFC] p-3 sm:p-4 md:p-6">

            <div className="w-full max-w-7xl mx-auto bg-white dark:bg-[#1F2937] rounded-2xl sm:rounded-3xl shadow-2xl dark:shadow-gray-900/50 overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-500 animate-float-box">

              <div className="min-h-screen flex flex-col">


                {/* ==================================================
                    NAVBAR
                ================================================== */}

                <Navbar />


                {/* ==================================================
                    MAIN CONTENT
                ================================================== */}

                <main className="flex-grow">

                  <Routes>


                    {/* ==================================================
                        PUBLIC ROUTES
                    ================================================== */}

                    <Route
                      path="/"
                      element={<HomePage />}
                    />

                    <Route
                      path="/shop"
                      element={<DryFruitsPage />}
                    />

                    <Route
                      path="/login"
                      element={<LoginPage />}
                    />

                    <Route
                      path="/signup"
                      element={<SignupPage />}
                    />

                    <Route
                      path="/sweets"
                      element={<SweetsPage />}
                    />

                    <Route
                      path="/fashion"
                      element={<FashionPage />}
                    />

                    <Route
                      path="/fashion/:id"
                      element={<FashionDetailPage />}
                    />

                    <Route
                      path="/about"
                      element={<AboutPage />}
                    />

                    <Route
                      path="/contact"
                      element={<ContactPage />}
                    />

                    <Route
                      path="/category/:categoryName"
                      element={<CategoryPage />}
                    />

                    <Route
                      path="/dry-product/:id"
                      element={<DryFruitsDetailPage />}
                    />

                    <Route
                      path="/sweet-product/:id"
                      element={<SweetsDetailPage />}
                    />

                    <Route
                      path="/cakes"
                      element={<CakesPage />}
                    />

                    <Route
                      path="/cakes/:id"
                      element={<CakesDetailPage />}
                    />


                    {/* ==================================================
                        USER PROTECTED ROUTES
                    ================================================== */}

                    <Route
                      path="/cart"
                      element={
                        <ProtectedRoute>
                          <CartPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/wishlist"
                      element={
                        <ProtectedRoute>
                          <WishlistPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />


                    {/* ==================================================
                        ADMIN ROUTES
                    ================================================== */}

                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminPanel />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/products"
                      element={
                        <AdminRoute>
                          <AdminPanel />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/orders"
                      element={
                        <AdminRoute>
                          <AdminPanel />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/users"
                      element={
                        <AdminRoute>
                          <AdminPanel />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/categories"
                      element={
                        <AdminRoute>
                          <AdminPanel />
                        </AdminRoute>
                      }
                    />

                    {/* ✅ FASHION PRODUCT ADD/EDIT */}

                    <Route
                      path="/admin/products/add"
                      element={
                        <AdminRoute>
                          <AdminProductForm />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/products/edit/:id"
                      element={
                        <AdminRoute>
                          <AdminProductForm />
                        </AdminRoute>
                      }
                    />

                    {/* ✅ DRY FRUITS PRODUCT ADD/EDIT */}

                    <Route
                      path="/admin/dryfruits/add"
                      element={
                        <AdminRoute>
                          <AdminDryFruitsForm />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/dryfruits/edit/:id"
                      element={
                        <AdminRoute>
                          <AdminDryFruitsForm />
                        </AdminRoute>
                      }
                    />

                    {/* ✅ SWEETS PRODUCT ADD/EDIT */}

                    <Route
                      path="/admin/sweets/add"
                      element={
                        <AdminRoute>
                          <AdminSweetsForm />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/sweets/edit/:id"
                      element={
                        <AdminRoute>
                          <AdminSweetsForm />
                        </AdminRoute>
                      }
                    />

                    {/* ✅ CAKES & BAKERY PRODUCT ADD/EDIT */}

                    <Route
                      path="/admin/cakes/add"
                      element={
                        <AdminRoute>
                          <AdminCakesProductForm />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/cakes/edit/:id"
                      element={
                        <AdminRoute>
                          <AdminCakesProductForm />
                        </AdminRoute>
                      }
                    />


                    {/* ==================================================
                        404 PAGE
                    ================================================== */}

                    <Route
                      path="*"
                      element={
                        <div className="flex flex-col items-center justify-center h-96">

                          <h1 className="text-6xl font-bold text-gray-300">
                            404
                          </h1>

                          <p className="text-gray-500 mt-2">
                            Page not found
                          </p>

                          <a
                            href="/"
                            className="mt-4 text-[#0F766E] hover:underline"
                          >
                            Go back home
                          </a>

                        </div>
                      }
                    />

                  </Routes>

                </main>


                {/* ==================================================
                    FOOTER
                ================================================== */}

                <Footer />

              </div>

            </div>


            {/* ==================================================
                FLOATING BUTTONS
            ================================================== */}

            <WhatsAppButton />

            <AIAssistant />


            {/* ==================================================
                POPUP
            ================================================== */}

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
// src/components/common/AnimatedRoutes.tsx

import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

import LoadingScreen from './LoadingScreen';

// ============================================================
// PAGE IMPORTS — PUBLIC
// ============================================================
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import WishlistPage from '../pages/WishlistPage';

// ============================================================
// ✅ UNIVERSAL PAGES (dynamic system)
// ============================================================
import DynamicCategoryPage from '../pages/DynamicCategoryPage';
import UniversalProductDetailPage from '../pages/UniversalProductDetailPage';

// ============================================================
// CUSTOMER DASHBOARD
// ============================================================
import CustomerLayout from '../customer/CustomerLayout';
import CustomerDashboard from '../customer/CustomerDashboard';
import OrdersTab from '../customer/tabs/OrdersTab';
import WishlistTab from '../customer/tabs/WishlistTab';
import AddressesTab from '../customer/tabs/AddressesTab';
import PaymentsTab from '../customer/tabs/PaymentsTab';
import HistoryTab from '../customer/tabs/HistoryTab';
import SettingsTab from '../customer/tabs/SettingsTab';

// ============================================================
// SELLER
// ============================================================
import SellerRegistration from './seller/SellerRegistration';
import SellerTermsPage from '../pages/SellerTermsPage';
import SellerLayout from '../seller/SellerLayout';
import SellerDashboard from '../seller/SellerDashboard';
import SellerProducts from '../seller/SellerProducts';
import SellerOrders from '../seller/SellerOrders';
import SellerEarnings from '../seller/SellerEarnings';
import SellerStore from '../seller/SellerStore';
import SellerSettings from '../seller/SellerSettings';
import SellerProductPage from '../seller/SellerProductPage';
import StoreBuilderWizard from '../seller/store-builder/StoreBuilderWizard';

// ============================================================
// AI STORES
// ============================================================
import PublicStorePage from '../pages/PublicStorePage';

// ============================================================
// ADMIN
// ============================================================
import AdminPanel from '../admin/AdminPanel';
import AdminCategorySelector from '../pages/admin/AdminCategorySelector';
import AdminProductFormNew from '../admin/AdminProductForm';
import AdminSellerManagement from '../admin/AdminSellerManagement';
import AdminProductsApproval from '../admin/AdminProductsApproval';
import AdminCategoryManager from '../admin/AdminCategoryManager';

// ============================================================
// ✅ REDIRECT WRAPPERS (backward compatibility)
// ============================================================
import CategoryRedirect from './CategoryRedirect';

// ============================================================
// PROPS
// ============================================================
interface AnimatedRoutesProps {
  AdminRoute: React.FC<{ children: React.ReactNode }>;
  SellerRoute: React.FC<{ children: React.ReactNode }>;
}

// ============================================================
// PAGE TRANSITION VARIANTS
// ============================================================
const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  in: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -20, scale: 0.98 },
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.5,
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="w-full"
  >
    {children}
  </motion.div>
);

// ============================================================
// MAIN ANIMATED ROUTES
// ============================================================
const AnimatedRoutes = ({ AdminRoute, SellerRoute }: AnimatedRoutesProps) => {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const splashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Splash ONLY on very first mount
  useEffect(() => {
    splashTimerRef.current = setTimeout(() => setShowSplash(false), 1200);
    return () => {
      if (splashTimerRef.current) clearTimeout(splashTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Safety net
  useEffect(() => {
    if (!showSplash) return;
    const emergency = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(emergency);
  }, [showSplash]);

  return (
    <>
      <AnimatePresence>
        {showSplash && <LoadingScreen key="splash" />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* ==================================================== */}
          {/* ROOT — redirect to /home                            */}
          {/* ==================================================== */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* ==================================================== */}
          {/* PUBLIC — Core Pages                                 */}
          {/* ==================================================== */}
          <Route path="/home" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route path="/wishlist" element={<PageTransition><WishlistPage /></PageTransition>} />
          <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />

          {/* ==================================================== */}
          {/* ✅ UNIVERSAL ROUTES (dynamic system)                */}
          {/* Ye 2 routes saari categories handle karte hain      */}
          {/* ==================================================== */}
          <Route
            path="/category/:categorySlug"
            element={<PageTransition><DynamicCategoryPage /></PageTransition>}
          />
          <Route
            path="/product/:id"
            element={<PageTransition><UniversalProductDetailPage /></PageTransition>}
          />

          {/* ==================================================== */}
          {/* 🔄 BACKWARD COMPATIBILITY — Redirects               */}
          {/* Purane URLs ko naye routes pe bhejo                 */}
          {/* ==================================================== */}

          {/* Old category listing pages */}
          <Route path="/shop" element={<Navigate to="/category/dryfruits" replace />} />
          <Route path="/sweets" element={<Navigate to="/category/sweets" replace />} />
          <Route path="/cakes" element={<Navigate to="/category/cakes" replace />} />
          <Route path="/herbal" element={<Navigate to="/category/herbal" replace />} />
          <Route path="/crockery" element={<Navigate to="/category/crockery" replace />} />
          <Route path="/calligraphy" element={<Navigate to="/category/calligraphy" replace />} />
          <Route path="/fashion" element={<Navigate to="/category/fashion" replace />} />

          {/* Old product detail pages — redirect to universal */}
          <Route path="/dry-product/:id" element={<CategoryRedirect toCategory="dryfruits" />} />
          <Route path="/sweet-product/:id" element={<CategoryRedirect toCategory="sweets" />} />
          <Route path="/cakes/:id" element={<CategoryRedirect toCategory="cakes" />} />
          <Route path="/herbal/:id" element={<CategoryRedirect toCategory="herbal" />} />
          <Route path="/crockery/:id" element={<CategoryRedirect toCategory="crockery" />} />
          <Route path="/calligraphy/:id" element={<CategoryRedirect toCategory="calligraphy" />} />
          <Route path="/fashion/:id" element={<CategoryRedirect toCategory="fashion" />} />

          {/* ==================================================== */}
          {/* AI STORES                                           */}
          {/* ==================================================== */}
          <Route
            path="/store/:slug"
            element={<PageTransition><PublicStorePage /></PageTransition>}
          />

          {/* ==================================================== */}
          {/* SELLER REGISTRATION & TERMS                         */}
          {/* ==================================================== */}
          <Route
            path="/seller/register"
            element={<PageTransition><SellerRegistration /></PageTransition>}
          />
          <Route
            path="/seller/terms"
            element={<PageTransition><SellerTermsPage /></PageTransition>}
          />

          {/* ==================================================== */}
          {/* SELLER PANEL (nested routes)                        */}
          {/* ==================================================== */}
          <Route
            path="/seller"
            element={
              <SellerRoute>
                <PageTransition>
                  <SellerLayout />
                </PageTransition>
              </SellerRoute>
            }
          >
            <Route index element={<SellerDashboard />} />
            <Route path="store-builder" element={<StoreBuilderWizard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="products/add" element={<SellerProductPage />} />
            <Route path="products/edit/:category/:id" element={<SellerProductPage />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="earnings" element={<SellerEarnings />} />
            <Route path="store" element={<SellerStore />} />
            <Route path="settings" element={<SellerSettings />} />
          </Route>

          {/* ==================================================== */}
          {/* CUSTOMER DASHBOARD                                  */}
          {/* ==================================================== */}
          <Route
            path="/dashboard"
            element={
              <PageTransition>
                <CustomerLayout />
              </PageTransition>
            }
          >
            <Route index element={<CustomerDashboard />} />
            <Route path="overview" element={<CustomerDashboard />} />
            <Route path="orders" element={<OrdersTab />} />
            <Route path="wishlist" element={<WishlistTab />} />
            <Route path="addresses" element={<AddressesTab />} />
            <Route path="payments" element={<PaymentsTab />} />
            <Route path="history" element={<HistoryTab />} />
            <Route path="settings" element={<SettingsTab />} />
          </Route>

          {/* ==================================================== */}
          {/* ADMIN — Add/Edit Product Forms                      */}
          {/* ==================================================== */}

          {/* Category selector (step 1) */}
          <Route
            path="/admin/products/add"
            element={
              <AdminRoute>
                <PageTransition>
                  <AdminCategorySelector />
                </PageTransition>
              </AdminRoute>
            }
          />

          {/* Dynamic product form (step 2) — universal */}
          <Route
            path="/admin/products/add/:category"
            element={
              <AdminRoute>
                <PageTransition>
                  <AdminProductFormNew />
                </PageTransition>
              </AdminRoute>
            }
          />

          {/* Edit product */}
          <Route
            path="/admin/products/edit/:category/:id"
            element={
              <AdminRoute>
                <PageTransition>
                  <AdminProductFormNew />
                </PageTransition>
              </AdminRoute>
            }
          />

          {/* ==================================================== */}
          {/* ✅ ADMIN — Category Manager (standalone page)       */}
          {/* ==================================================== */}
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <PageTransition>
                  <AdminCategoryManager />
                </PageTransition>
              </AdminRoute>
            }
          />

          {/* ==================================================== */}
          {/* ADMIN — Main Panel (tab-based)                      */}
          {/* ==================================================== */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

          {/* ==================================================== */}
          {/* ADMIN — Separate Pages                              */}
          {/* ==================================================== */}

          <Route
            path="/admin/sellers"
            element={
              <AdminRoute>
                <PageTransition>
                  <AdminSellerManagement />
                </PageTransition>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products-approval"
            element={
              <AdminRoute>
                <PageTransition>
                  <AdminProductsApproval />
                </PageTransition>
              </AdminRoute>
            }
          />

          {/* ==================================================== */}
          {/* ADMIN — Catch-all                                   */}
          {/* ==================================================== */}
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

          {/* ==================================================== */}
          {/* 404 — NOT FOUND                                     */}
          {/* ==================================================== */}
          <Route
            path="*"
            element={
              <PageTransition>
                <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                  <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600">
                    404
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Page not found
                  </p>
                  <Link
                    to="/home"
                    className="mt-4 text-[#0F766E] dark:text-[#5EEAD4] hover:underline"
                  >
                    Go back to Home
                  </Link>
                </div>
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default AnimatedRoutes;
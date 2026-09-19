// src/components/common/AnimatedRoutes.tsx

import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

import LoadingScreen from './LoadingScreen';

// ============================================================
// PAGE IMPORTS
// ============================================================
// ❌ LandingPage REMOVED
import HomePage from '../pages/HomePage';
import DryFruitsPage from '../pages/DryFruitsPage';
import SweetsPage from '../pages/SweetsPage';
import FashionPage from '../pages/FashionPage';
import FashionDetailPage from '../pages/FashionDetailPage';
import SweetsDetailPage from '../pages/SweetsDetailPage';
import DryFruitsDetailPage from '../pages/DryFruitsDetailPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import CategoryPage from '../pages/CategoryPage';
import WishlistPage from '../pages/WishlistPage';
import CakesPage from '../pages/CakesPage';
import CakesDetailPage from '../pages/CakesDetailPage';
import CustomerLayout from '../customer/CustomerLayout';
import CustomerDashboard from '../customer/CustomerDashboard';
import OrdersTab from '../customer/tabs/OrdersTab';
import WishlistTab from '../customer/tabs/WishlistTab';
import AddressesTab from '../customer/tabs/AddressesTab';
import PaymentsTab from '../customer/tabs/PaymentsTab';
import HistoryTab from '../customer/tabs/HistoryTab';
import SettingsTab from '../customer/tabs/SettingsTab';
import HerbalPage from '../pages/HerbalPage';
import HerbalDetailPage from '../pages/HerbalDetailPage';
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
import PublicStorePage from '../pages/PublicStorePage';
import ProductDetailPage from '../store/ProductDetailPage';
import AdminPanel from '../admin/AdminPanel';
import AdminCakesProductForm from '../pages/AdminCakesProductForm';
import AdminDryFruitsForm from '../pages/AdminDryFruitsForm';
import AdminSweetsForm from '../pages/AdminSweetsForm';
import AdminHerbalForm from '../pages/AdminHerbalForm';
import AdminSellerManagement from '../admin/AdminSellerManagement';
import AdminProductsApproval from '../admin/AdminProductsApproval';
import AdminCategorySelector from '../pages/admin/AdminCategorySelector';
import AdminProductFormNew from '../admin/AdminProductForm';

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

  // ✅ Splash ONLY on very first mount
  useEffect(() => {
    splashTimerRef.current = setTimeout(() => setShowSplash(false), 1200);
    return () => {
      if (splashTimerRef.current) clearTimeout(splashTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Safety net
  useEffect(() => {
    if (!showSplash) return;
    const emergency = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(emergency);
  }, [showSplash]);

  return (
    <>
      {showSplash && <LoadingScreen />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* ✅ ROOT — redirect to /home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* CUSTOMER HOME */}
          <Route path="/home" element={<PageTransition><HomePage /></PageTransition>} />

          {/* PUBLIC */}
          <Route path="/shop" element={<PageTransition><DryFruitsPage /></PageTransition>} />
          <Route path="/sweets" element={<PageTransition><SweetsPage /></PageTransition>} />
          <Route path="/fashion" element={<PageTransition><FashionPage /></PageTransition>} />
          <Route path="/fashion/:id" element={<PageTransition><FashionDetailPage /></PageTransition>} />
          <Route path="/sweet-product/:id" element={<PageTransition><SweetsDetailPage /></PageTransition>} />
          <Route path="/dry-product/:id" element={<PageTransition><DryFruitsDetailPage /></PageTransition>} />
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route path="/category/:categoryName" element={<PageTransition><CategoryPage /></PageTransition>} />
          <Route path="/cakes" element={<PageTransition><CakesPage /></PageTransition>} />
          <Route path="/cakes/:id" element={<PageTransition><CakesDetailPage /></PageTransition>} />

          {/* AI STORES */}
          <Route path="/store/:slug" element={<PageTransition><PublicStorePage /></PageTransition>} />

          {/* GENERIC PRODUCT */}
          <Route path="/product/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />

          {/* HERBAL */}
          <Route path="/herbal" element={<PageTransition><HerbalPage /></PageTransition>} />
          <Route path="/herbal/:id" element={<PageTransition><HerbalDetailPage /></PageTransition>} />

          {/* SELLER REGISTRATION */}
          <Route path="/seller/register" element={<PageTransition><SellerRegistration /></PageTransition>} />
          <Route path="/seller/terms" element={<PageTransition><SellerTermsPage /></PageTransition>} />

          {/* SELLER PANEL — protected */}
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

          {/* CUSTOMER DASHBOARD */}
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

          {/* CART / CHECKOUT / WISHLIST */}
          <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
          <Route path="/wishlist" element={<PageTransition><WishlistPage /></PageTransition>} />

          {/* ADMIN */}
          <Route path="/admin/products/add" element={<AdminRoute><PageTransition><AdminCategorySelector /></PageTransition></AdminRoute>} />
          <Route path="/admin/products/add/:category" element={<AdminRoute><PageTransition><AdminProductFormNew /></PageTransition></AdminRoute>} />
          <Route path="/admin/products/edit/:category/:id" element={<AdminRoute><PageTransition><AdminProductFormNew /></PageTransition></AdminRoute>} />

          <Route path="/admin" element={<AdminRoute><PageTransition><AdminPanel /></PageTransition></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><PageTransition><AdminPanel /></PageTransition></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><PageTransition><AdminPanel /></PageTransition></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><PageTransition><AdminPanel /></PageTransition></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><PageTransition><AdminPanel /></PageTransition></AdminRoute>} />
          <Route path="/admin/sellers" element={<AdminRoute><PageTransition><AdminSellerManagement /></PageTransition></AdminRoute>} />
          <Route path="/admin/products-approval" element={<AdminRoute><PageTransition><AdminProductsApproval /></PageTransition></AdminRoute>} />

          {/* Legacy admin routes */}
          <Route path="/admin/dryfruits/add" element={<AdminRoute><PageTransition><AdminDryFruitsForm /></PageTransition></AdminRoute>} />
          <Route path="/admin/dryfruits/edit/:id" element={<AdminRoute><PageTransition><AdminDryFruitsForm /></PageTransition></AdminRoute>} />
          <Route path="/admin/sweets/add" element={<AdminRoute><PageTransition><AdminSweetsForm /></PageTransition></AdminRoute>} />
          <Route path="/admin/sweets/edit/:id" element={<AdminRoute><PageTransition><AdminSweetsForm /></PageTransition></AdminRoute>} />
          <Route path="/admin/cakes/add" element={<AdminRoute><PageTransition><AdminCakesProductForm /></PageTransition></AdminRoute>} />
          <Route path="/admin/cakes/edit/:id" element={<AdminRoute><PageTransition><AdminCakesProductForm /></PageTransition></AdminRoute>} />
          <Route path="/admin/herbal/add" element={<AdminRoute><PageTransition><AdminHerbalForm /></PageTransition></AdminRoute>} />
          <Route path="/admin/herbal/edit/:id" element={<AdminRoute><PageTransition><AdminHerbalForm /></PageTransition></AdminRoute>} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <PageTransition>
                <div className="flex flex-col items-center justify-center h-96">
                  <h1 className="text-6xl font-bold text-gray-300">404</h1>
                  <p className="text-gray-500 mt-2">Page not found</p>
                  <Link to="/home" className="mt-4 text-[#0F766E] hover:underline">
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
// src/components/common/AnimatedRoutes.tsx
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// 🔥 IMPORT LOADING SCREEN
import LoadingScreen from './LoadingScreen';

// ============================================================
// PAGE IMPORTS — SAB IMPORTS KAREIN
// ============================================================
import HomePage from '../pages/HomePage';
import DryFruitsPage from '../pages/DryFruitsPage';
import SweetsPage from '../pages/SweetsPage';
import FashionPage from '../pages/FashionPage';
import FashionDetailPage from '../pages/FashionDetailPage';
import SweetsDetailPage from '../pages/SweetsDetailPage';
import DryFruitsDetailPage from '../pages/DryFruitsDetailPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import CategoryPage from '../pages/CategoryPage';
import WishlistPage from '../pages/WishlistPage';
import DashboardPage from '../pages/DashboardPage';
import CakesPage from '../pages/CakesPage';
import CakesDetailPage from '../pages/CakesDetailPage';

// Admin Imports
import AdminPanel from '../admin/AdminPanel';
import AdminProductForm from '../pages/AdminProductForm';
import AdminCakesProductForm from '../pages/AdminCakesProductForm';
import AdminDryFruitsForm from '../pages/AdminDryFruitsForm';
import AdminSweetsForm from '../pages/AdminSweetsForm';

// ============================================================
// PAGE TRANSITION VARIANTS
// ============================================================
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98,
  },
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.5,
};

// ============================================================
// PAGE TRANSITION COMPONENT
// ============================================================
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
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
};

// ============================================================
// MAIN ANIMATED ROUTES WITH LOADER
// ============================================================
const AnimatedRoutes = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const [loadingCount, setLoadingCount] = useState(0);

  // 🔥 INITIAL LOAD
  useEffect(() => {
    console.log('🔄 Initial load started');
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log('✅ Initial load complete');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // 🔥 ROUTE CHANGE PAR LOADER SHOW
  useEffect(() => {
    if (prevPath !== location.pathname) {
      console.log('🔄 Route changed from:', prevPath, 'to:', location.pathname);
      setLoadingCount(prev => prev + 1);
      setIsLoading(true);
      setPrevPath(location.pathname);
      
      const timer = setTimeout(() => {
        setIsLoading(false);
        console.log('✅ Route load complete for:', location.pathname);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, prevPath]);

  // 🔥 EMERGENCY TIMEOUT — If loading stuck for more than 5 seconds
  useEffect(() => {
    if (isLoading) {
      const emergencyTimer = setTimeout(() => {
        console.warn('⚠️ Loading stuck! Force resetting...');
        setIsLoading(false);
      }, 5000);
      
      return () => clearTimeout(emergencyTimer);
    }
  }, [isLoading]);

  // 🔥 Console log for debugging
  useEffect(() => {
    console.log('📊 Current state:', { isLoading, pathname: location.pathname, loadingCount });
  }, [isLoading, location.pathname, loadingCount]);

  return (
    <>
      {/* 🔥 LOADING SCREEN */}
      {isLoading && <LoadingScreen />}
      
      {/* 🔥 PAGE CONTENT — LOADING COMPLETE HONE PAR SHOW HO */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ==================================================
              PUBLIC ROUTES
          ================================================== */}
          <Route 
            path="/" 
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/shop" 
            element={
              <PageTransition>
                <DryFruitsPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/sweets" 
            element={
              <PageTransition>
                <SweetsPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/fashion" 
            element={
              <PageTransition>
                <FashionPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/fashion/:id" 
            element={
              <PageTransition>
                <FashionDetailPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/sweet-product/:id" 
            element={
              <PageTransition>
                <SweetsDetailPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/dry-product/:id" 
            element={
              <PageTransition>
                <DryFruitsDetailPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/login" 
            element={
              <PageTransition>
                <LoginPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/signup" 
            element={
              <PageTransition>
                <SignupPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/about" 
            element={
              <PageTransition>
                <AboutPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/contact" 
            element={
              <PageTransition>
                <ContactPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/category/:categoryName" 
            element={
              <PageTransition>
                <CategoryPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/cakes" 
            element={
              <PageTransition>
                <CakesPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/cakes/:id" 
            element={
              <PageTransition>
                <CakesDetailPage />
              </PageTransition>
            } 
          />

          {/* ==================================================
              PROTECTED ROUTES
          ================================================== */}
          <Route 
            path="/cart" 
            element={
              <PageTransition>
                <CartPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/checkout" 
            element={
              <PageTransition>
                <CheckoutPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/wishlist" 
            element={
              <PageTransition>
                <WishlistPage />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <PageTransition>
                <DashboardPage />
              </PageTransition>
            } 
          />

          {/* ==================================================
              ADMIN ROUTES
          ================================================== */}
          <Route 
            path="/admin" 
            element={
              <PageTransition>
                <AdminPanel />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/admin/products" 
            element={
              <PageTransition>
                <AdminPanel />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/admin/orders" 
            element={
              <PageTransition>
                <AdminPanel />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/admin/users" 
            element={
              <PageTransition>
                <AdminPanel />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/admin/categories" 
            element={
              <PageTransition>
                <AdminPanel />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/admin/products/add" 
            element={
              <PageTransition>
                <AdminProductForm />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/admin/products/edit/:id" 
            element={
              <PageTransition>
                <AdminProductForm />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/admin/dryfruits/add" 
            element={
              <PageTransition>
                <AdminDryFruitsForm />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/admin/dryfruits/edit/:id" 
            element={
              <PageTransition>
                <AdminDryFruitsForm />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/admin/sweets/add" 
            element={
              <PageTransition>
                <AdminSweetsForm />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/admin/sweets/edit/:id" 
            element={
              <PageTransition>
                <AdminSweetsForm />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/admin/cakes/add" 
            element={
              <PageTransition>
                <AdminCakesProductForm />
              </PageTransition>
            } 
          />
          
          <Route 
            path="/admin/cakes/edit/:id" 
            element={
              <PageTransition>
                <AdminCakesProductForm />
              </PageTransition>
            } 
          />

          {/* ==================================================
              404 PAGE
          ================================================== */}
          <Route 
            path="*" 
            element={
              <PageTransition>
                <div className="flex flex-col items-center justify-center h-96">
                  <h1 className="text-6xl font-bold text-gray-300">404</h1>
                  <p className="text-gray-500 mt-2">Page not found</p>
                  <Link to="/" className="mt-4 text-[#0F766E] hover:underline">
                    Go back home
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
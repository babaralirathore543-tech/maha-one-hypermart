// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import AIAssistant from './components/common/AIAssistant';
// ✅ AdminPanel import (yeh exist karta hai)
import AdminPanel from './components/admin/AdminPanel';
import AdminProductForm from './components/pages/AdminProductForm';
import Popup from './components/common/Popup';

// ✅ Import Eid Milad Page
import EidMiladPage from './components/pages/EidMiladPage';

// ✅ Import Maintenance Page
import MaintenancePage from './components/pages/MaintenancePage';

// Pages Import
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

// ✅ Admin Route Protection
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // ❌ No token → redirect to login
  if (!token) {
    window.location.href = '/login';
    return null;
  }

  // ❌ Not admin → redirect to home
  if (user?.role !== 'admin') {
    window.location.href = '/';
    return null;
  }

  // ✅ All good → show admin panel
  return <>{children}</>;
};

// ✅ Protected Route (for logged-in users)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login';
    return null;
  }

  return <>{children}</>;
};

function App() {
  // ============================================
  // ✨ TOGGLE PAGES
  // ============================================
  
  // ✅ For 12 Rabi ul Awwal - Show Eid Milad Page
  // True = Show Eid Milad Page, False = Normal
  const SHOW_EID_MILAD = true; // ⚠️ True kar do for 12 Rabi ul Awwal

  // ✅ Maintenance Mode
  // True = Show Maintenance Page, False = Normal
  const MAINTENANCE_MODE = false; // ⚠️ True kar do when maintenance needed

  // ============================================
  // ROUTING
  // ============================================

  // ✅ If Eid Milad page is ON
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

  // ✅ If maintenance mode is ON
  if (MAINTENANCE_MODE) {
    return (
      <ThemeProvider>
        <Router>
          <Routes>
            {/* ✅ Admin can still access admin panel during maintenance */}
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<MaintenancePage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  }

  // ✅ Normal App (Maintenance OFF + Eid Milad OFF)
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] via-[#FFFDF7] to-[#F8FAFC] p-3 sm:p-4 md:p-6">
            <div className="w-full max-w-7xl mx-auto bg-white dark:bg-[#1F2937] rounded-2xl sm:rounded-3xl shadow-2xl dark:shadow-gray-900/50 overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-500 animate-float-box">
              
              <div className="min-h-screen flex flex-col">
                {/* Navbar */}
                <Navbar />
                
                {/* Main Content */}
                <main className="flex-grow">
                  <Routes>
                    {/* ========== PUBLIC ROUTES ========== */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<DryFruitsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/sweets" element={<SweetsPage />} />
                    <Route path="/fashion" element={<FashionPage />} />
                    <Route path="/fashion/:id" element={<FashionDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/category/:categoryName" element={<CategoryPage />} />
                    <Route path="/dry-product/:id" element={<DryFruitsDetailPage />} />
                    <Route path="/sweet-product/:id" element={<SweetsDetailPage />} />
                    <Route path="/cakes" element={<CakesPage />} />
                    <Route path="/cakes/:id" element={<CakesDetailPage />} />

                    {/* ========== PROTECTED ROUTES (Login Required) ========== */}
                    <Route path="/cart" element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/wishlist" element={
                      <ProtectedRoute>
                        <WishlistPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    } />

                    {/* ========== ADMIN ROUTES (Admin Only) ========== */}
                    <Route path="/admin" element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    } />
                    <Route path="/admin/products" element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    } />
                    <Route path="/admin/orders" element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    } />
                    <Route path="/admin/users" element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    } />
                    <Route path="/admin/categories" element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    } />
                    <Route path="/admin/products/add" element={
                      <AdminRoute>
                        <AdminProductForm />
                      </AdminRoute>
                    } />
                    <Route path="/admin/products/edit/:id" element={
                      <AdminRoute>
                        <AdminProductForm />
                      </AdminRoute>
                    } />

                    {/* ========== 404 - NOT FOUND ========== */}
                    <Route path="*" element={
                      <div className="flex flex-col items-center justify-center h-96">
                        <h1 className="text-6xl font-bold text-gray-300">404</h1>
                        <p className="text-gray-500 mt-2">Page not found</p>
                        <a href="/" className="mt-4 text-[#0F766E] hover:underline">Go back home</a>
                      </div>
                    } />
                  </Routes>
                </main>
                
                {/* Footer */}
                <Footer />
              </div>
            </div>
          </div>
          
          {/* Floating Buttons */}
          <WhatsAppButton />
          <AIAssistant />
          <Popup 
            image="https://res.cloudinary.com/kw3pdwrb/image/upload/v1787129090/ChatGPT_Image_Aug_19_2026_01_43_49_PM_gkjxzb.png"
            delay={2000}
          />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import AIAssistant from './components/common/AIAssistant';
import AdminPanel from './components/admin/AdminPanel';
import Popup from './components/common/Popup';

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

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          {/* ✅ Floating Box with Animation */}
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] via-[#FFFDF7] to-[#F8FAFC] p-3 sm:p-4 md:p-6">
            <div className="w-full max-w-7xl mx-auto bg-white dark:bg-[#1F2937] rounded-2xl sm:rounded-3xl shadow-2xl dark:shadow-gray-900/50 overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-500 animate-float-box">
              
              <div className="min-h-screen flex flex-col">
                {/* Navbar */}
                <Navbar />
                
                {/* Main Content */}
                <main className="flex-grow">
                  <Routes>
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
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/dry-product/:id" element={<DryFruitsDetailPage />} />
                    <Route path="/sweet-product/:id" element={<SweetsDetailPage />} />
                    <Route path="/cakes" element={<CakesPage />} />
                    <Route path="/cakes/:id" element={<CakesDetailPage />} />
                    <Route path="/admin" element={<AdminPanel />} />
                  </Routes>
                </main>
                
                {/* Footer */}
                <Footer />
              </div>
            </div>
          </div>
          
          {/* ✅ WhatsApp Button - Box ke bahar */}
          <WhatsAppButton />
          
          {/* ✅ AI Assistant - Box ke bahar */}
          <AIAssistant />
          
          {/* ✅ Popup */}
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
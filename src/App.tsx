import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext'; // ✅ Add
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import AIAssistant from './components/common/AIAssistant';
import AdminPanel from './components/admin/AdminPanel';

// ✅ Popup Import
import Popup from './components/common/Popup';

// Pages Import
import HomePage from './components/pages/HomePage';
import DryFruitsPage from './components/pages/DryFruitsPage';
import SweetsPage from './components/pages/SweetsPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import FashionPage from './components/pages/FashionPage';
import FashionDetailPage from './components/pages/FashionDetailPage'
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import CategoryPage from './components/pages/CategoryPage';
import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage';
import WishlistPage from './components/pages/WishlistPage';
import DashboardPage from './components/pages/DashboardPage';
import DryFruitsDetailPage from './components/pages/DryFruitsDetailPage';
import SweetsDetailPage from './components/pages/SweetsDetailPage';

// ✅ Cakes Pages
import CakesPage from './components/pages/CakesPage';
import CakesDetailPage from './components/pages/CakesDetailPage';

function App() {
  return (
    <ThemeProvider>  {/* ✅ Wrap */}
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#FFFDF7] dark:bg-[#111827] transition-colors duration-300">
            
            {/* Navbar */}
            <Navbar />
            
            {/* Main Content */}
            <main className="flex-grow">
              <Routes>
                {/* Home */}
                <Route path="/" element={<HomePage />} />
                
                {/* Dry Fruits */}
                <Route path="/shop" element={<DryFruitsPage />} />
                <Route path="/dry-product/:id" element={<DryFruitsDetailPage />} />
                
                {/* Sweets */}
                <Route path="/sweets" element={<SweetsPage />} />
                <Route path="/sweet-product/:id" element={<SweetsDetailPage />} />
                
                {/* Fashion */}
                <Route path="/fashion" element={<FashionPage />} />
                <Route path="/fashion/:id" element={<FashionDetailPage />} />
                
                {/* ✅ Cakes */}
                <Route path="/cakes" element={<CakesPage />} />
                <Route path="/cakes/:id" element={<CakesDetailPage />} />
                
                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                {/* Pages */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                
                {/* Cart & Checkout */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* Admin */}
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </main>
            
            {/* Footer */}
            <Footer />
            
            {/* ✅ WhatsApp Button */}
            <WhatsAppButton />
            
            {/* ✅ AI Assistant */}
            <AIAssistant />
            
            {/* ✅ Popup */}
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
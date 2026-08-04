import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';

// Pages Import
import HomePage from './components/pages/HomePage';
import DryFruitsPage from './components/pages/DryFruitsPage';
import SweetsPage from './components/pages/SweetsPage';
import FashionPage from './components/pages/FashionPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import CategoryPage from './components/pages/CategoryPage';
import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage';
import WishlistPage from './components/pages/WishlistPage';
import DashboardPage from './components/pages/DashboardPage';
import DryFruitsDetailPage from './components/pages/DryFruitsDetailPage';
import SweetsDetailPage from './components/pages/SweetsDetailPage';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#FFFDF7]">
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<DryFruitsPage />} />
              <Route path="/sweets" element={<SweetsPage />} />
              <Route path="/fashion" element={<FashionPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dry-product/:id" element={<DryFruitsDetailPage />} />
              <Route path="/sweet-product/:id" element={<SweetsDetailPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* ✅ WhatsApp Button - Sab pages par */}
          <WhatsAppButton />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
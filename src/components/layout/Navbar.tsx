import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaSearch, FaHeart, FaUser, FaShoppingBag, FaBars, FaTimes, 
  FaCrown, FaTshirt, FaCog, FaWallet 
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { getWishlistCount } from '../../services/wishlistService';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  // ✅ Check if user is logged in and admin
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin';
  const userId = localStorage.getItem('userId') || 'guest';

  // ✅ Check login status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuth();

    window.addEventListener('storage', checkAuth);
    window.addEventListener('userUpdated', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('userUpdated', checkAuth);
    };
  }, []);

  // ✅ Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Fetch wishlist count
  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (userId !== 'guest') {
        const count = await getWishlistCount(userId);
        setWishlistCount(count);
      } else {
        setWishlistCount(0);
      }
    };

    fetchWishlistCount();

    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('storage', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('storage', handleWishlistUpdate);
    };
  }, [userId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Dry Fruits', path: '/shop' },
    { name: 'Fashion', path: '/fashion' },
    { name: 'Sweets', path: '/sweets' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <div className="h-20" />
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-2xl shadow-2xl border-b border-[#D4AF37]/20' : 'bg-white/80 backdrop-blur-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img src={logo} alt="MAHA ONE" className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                <FaCrown className="absolute -top-1 -right-3 text-[#D4AF37] text-xs animate-pulse" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-extrabold tracking-tight">
                  <span className="text-[#0F766E]">MAHA</span>
                  <span className="text-[#D4AF37]"> ONE</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.35em] text-gray-400 font-medium">HYPERMART</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 relative group ${
                    link.name === 'Fashion' 
                      ? 'text-[#D4AF37] hover:text-[#0F766E]' 
                      : 'text-gray-600 hover:text-[#D4AF37]'
                  } hover:bg-gradient-to-r hover:from-[#D4AF37]/10 hover:to-transparent`}
                >
                  {link.name === 'Fashion' && <FaTshirt className="inline mr-1 text-xs" />}
                  {link.name}
                  
                  {link.name === 'Fashion' && (
                    <span className="absolute -top-2 -right-4 bg-[#D4AF37] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                      Soon
                    </span>
                  )}
                  
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#0F766E] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 md:gap-3">
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-40 lg:w-56 pl-9 pr-4 py-2 bg-[#F8FAFC] border-2 border-transparent rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white focus:shadow-lg transition-all duration-300"
                />
                <button type="submit" className="absolute left-3 top-2.5 text-gray-400 hover:text-[#D4AF37] transition-colors">
                  <FaSearch />
                </button>
              </form>
              
              <button 
                onClick={() => navigate('/shop')}
                className="md:hidden p-2 rounded-full hover:bg-[#F8FAFC] transition-colors"
              >
                <FaSearch className="text-lg text-gray-600" />
              </button>
              
              {/* Wishlist */}
              <Link to="/wishlist" className="p-2 rounded-full hover:bg-[#F8FAFC] transition-all duration-300 relative group">
                <FaHeart className="text-lg text-gray-600 group-hover:text-[#D4AF37] transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* ✅ MAHA WALLET LINK - Sirf Logged-in Users */}
              {isLoggedIn && (
                <Link 
                  to="/dashboard?tab=wallet" 
                  className="p-2 rounded-full hover:bg-[#F8FAFC] transition-all duration-300 relative group"
                  title="Maha Wallet"
                >
                  <FaWallet className="text-lg text-[#D4AF37] group-hover:text-[#0F766E] transition-colors" />
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md">
                    $
                  </span>
                </Link>
              )}
              
              {/* User Dashboard */}
              <Link to="/dashboard" className="p-2 rounded-full hover:bg-[#F8FAFC] transition-all duration-300">
                <FaUser className="text-lg text-gray-600 hover:text-[#D4AF37] transition-colors" />
              </Link>
              
              {/* Cart */}
              <Link to="/cart" className="p-2 rounded-full hover:bg-[#F8FAFC] transition-all duration-300 relative group">
                <FaShoppingBag className="text-lg text-gray-600 group-hover:text-[#D4AF37] transition-colors" />
                <span className="absolute -top-0.5 -right-0.5 bg-[#0F766E] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {getCartCount()}
                </span>
              </Link>

              {/* Admin Link */}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="p-2 rounded-full hover:bg-[#F8FAFC] transition-all duration-300 relative group"
                  title="Admin Panel"
                >
                  <FaCog className="text-lg text-[#D4AF37] group-hover:text-[#0F766E] transition-colors" />
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md">
                    ⚙
                  </span>
                </Link>
              )}

              <button className="lg:hidden p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <FaTimes className="text-xl text-[#0F766E]" /> : <FaBars className="text-xl text-gray-600" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-[#E5E7EB] bg-white/95 backdrop-blur">
              <form onSubmit={handleSearch} className="relative mb-4 px-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border-2 border-transparent rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all duration-300"
                />
                <button type="submit" className="absolute left-5 top-3 text-gray-400 hover:text-[#D4AF37] transition-colors">
                  <FaSearch />
                </button>
              </form>
              
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${
                    link.name === 'Fashion' 
                      ? 'text-[#D4AF37] hover:bg-[#D4AF37]/10' 
                      : 'text-gray-600 hover:text-[#D4AF37] hover:bg-[#F8FAFC]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name === 'Fashion' && <FaTshirt className="inline mr-2" />}
                  {link.name}
                  {link.name === 'Fashion' && (
                    <span className="ml-2 text-[8px] bg-[#D4AF37] text-white px-1.5 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                </Link>
              ))}

              {/* ✅ Mobile - Maha Wallet Link */}
              {isLoggedIn && (
                <Link
                  to="/dashboard?tab=wallet"
                  className="block py-3 px-4 text-sm font-medium rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  💰 Maha Wallet
                </Link>
              )}

              {/* Mobile - Admin Link */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block py-3 px-4 text-sm font-medium rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ⚙️ Admin Panel
                </Link>
              )}

              {/* Mobile - Logout */}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('userId');
                    setIsLoggedIn(false);
                    window.dispatchEvent(new Event('userUpdated'));
                    window.dispatchEvent(new Event('storage'));
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-3 px-4 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                  🚪 Logout
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
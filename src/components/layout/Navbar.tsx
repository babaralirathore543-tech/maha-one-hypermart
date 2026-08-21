import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaSearch, FaHeart, FaUser, FaShoppingBag, FaBars, FaTimes, 
  FaCrown, FaCog
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

  // ✅ Links without Icons
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Dry Fruits', path: '/shop' },
    { name: 'Fashion', path: '/fashion' },
    { name: 'Sweets', path: '/sweets' },
    { name: 'Cakes', path: '/cakes' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <div className="h-14 sm:h-16 md:h-20" />
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-2xl shadow-2xl border-b border-[#D4AF37]/20' : 'bg-white/80 backdrop-blur-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            
            {/* ✅ Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="MAHA ONE" 
                  className="h-7 sm:h-9 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <FaCrown className="absolute -top-1 -right-2 text-[#D4AF37] text-[8px] sm:text-xs animate-pulse" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm sm:text-lg md:text-2xl font-extrabold tracking-tight">
                  <span className="text-[#0F766E]">MAHA</span>
                  <span className="text-[#D4AF37]"> ONE</span>
                </span>
                <span className="text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.35em] text-gray-400 font-medium hidden xs:block">
                  HYPERMART
                </span>
              </div>
            </Link>

            {/* ✅ Desktop Menu */}
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
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#0F766E] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-32 lg:w-56 pl-8 pr-3 py-1.5 bg-[#F8FAFC] border-2 border-transparent rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white focus:shadow-lg transition-all duration-300"
                />
                <button type="submit" className="absolute left-2.5 top-1.5 text-gray-400 hover:text-[#D4AF37] transition-colors">
                  <FaSearch size={14} />
                </button>
              </form>
              
              <button 
                onClick={() => navigate('/shop')}
                className="md:hidden p-1.5 rounded-full hover:bg-[#F8FAFC] transition-colors"
              >
                <FaSearch className="text-base sm:text-lg text-gray-600" />
              </button>
              
              {/* Wishlist */}
              <Link to="/wishlist" className="p-1.5 sm:p-2 rounded-full hover:bg-[#F8FAFC] transition-all duration-300 relative group">
                <FaHeart className="text-base sm:text-lg text-gray-600 group-hover:text-[#D4AF37] transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[8px] sm:text-[10px] font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Dashboard */}
              <Link to="/dashboard" className="p-1.5 sm:p-2 rounded-full hover:bg-[#F8FAFC] transition-all duration-300">
                <FaUser className="text-base sm:text-lg text-gray-600 hover:text-[#D4AF37] transition-colors" />
              </Link>
              
              {/* Cart */}
              <Link to="/cart" className="p-1.5 sm:p-2 rounded-full hover:bg-[#F8FAFC] transition-all duration-300 relative group">
                <FaShoppingBag className="text-base sm:text-lg text-gray-600 group-hover:text-[#D4AF37] transition-colors" />
                <span className="absolute -top-0.5 -right-0.5 bg-[#0F766E] text-white text-[8px] sm:text-[10px] font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center shadow-md">
                  {getCartCount()}
                </span>
              </Link>

              {/* Admin Link */}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="p-1.5 sm:p-2 rounded-full hover:bg-[#F8FAFC] transition-all duration-300 relative group"
                  title="Admin Panel"
                >
                  <FaCog className="text-base sm:text-lg text-[#D4AF37] group-hover:text-[#0F766E] transition-colors" />
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-white text-[8px] sm:text-[10px] font-bold rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 flex items-center justify-center shadow-md">
                    ⚙
                  </span>
                </Link>
              )}

              <button className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <FaTimes className="text-lg sm:text-xl text-[#0F766E]" /> : <FaBars className="text-lg sm:text-xl text-gray-600" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-3 sm:py-4 border-t border-[#E5E7EB] bg-white/95 backdrop-blur max-h-[calc(100vh-4rem)] overflow-y-auto">
              <form onSubmit={handleSearch} className="relative mb-3 sm:mb-4 px-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border-2 border-transparent rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all duration-300"
                />
                <button type="submit" className="absolute left-4 top-2.5 text-gray-400 hover:text-[#D4AF37] transition-colors">
                  <FaSearch />
                </button>
              </form>
              
              <div className="grid grid-cols-2 gap-1 px-2">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-300 text-center ${
                      link.name === 'Fashion' 
                        ? 'text-[#D4AF37] hover:bg-[#D4AF37]/10' 
                        : 'text-gray-600 hover:text-[#D4AF37] hover:bg-[#F8FAFC]'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Extra Links */}
              <div className="mt-3 pt-3 border-t border-gray-100 px-2">
                {isLoggedIn && (
                  <>
                    <Link
                      to="/dashboard"
                      className="block py-2.5 px-3 text-sm font-medium rounded-lg text-gray-600 hover:text-[#D4AF37] hover:bg-[#F8FAFC] transition-all duration-300 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      👤 My Account
                    </Link>
                  </>
                )}
                
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block py-2.5 px-3 text-sm font-medium rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ⚙️ Admin Panel
                  </Link>
                )}

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
                    className="block w-full py-2.5 px-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300 text-center mt-1"
                  >
                    🚪 Logout
                  </button>
                )}

                {!isLoggedIn && (
                  <Link
                    to="/login"
                    className="block py-2.5 px-3 text-sm font-medium rounded-lg bg-[#0F766E] text-white hover:bg-[#065F46] transition-all duration-300 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🔐 Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  FaSearch, FaHeart, FaUser, FaShoppingBag, FaBars, FaTimes, 
  FaCrown, FaCog
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { getWishlistCount } from '../../services/wishlistService';
import logo from '../../assets/images/logo.png';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin';
  const userId = localStorage.getItem('userId') || 'guest';

  const allProducts = [
    'American Almonds Premium', 'American Almonds Medium', 'Soft Shell Salted Pistachios',
    'Roasted Pistachios', 'Roasted Brown Cashews', 'Salted White Cashews',
    'Soft Shell Almonds', 'Soft Shell Walnuts', 'Kernel Walnuts',
    'Sundar Khani Raisins', 'Kandhari Raisins', 'Black Raisins',
    'Munakka Raisins', 'Roasted Chickpeas', 'Roasted Brown Chickpeas',
    'Chia Seeds', 'Pumpkin Seeds', 'Sunflower Seeds',
    'Flax Seeds', 'Basil Seeds', 'Four Seeds',
    'Isphagol Husk', 'Dry Coconut', 'Coconut Powder',
    'Caramel Dream Choco Bar', 'HISS Crispy Wafer', 'Nani Caramel Choco Bar',
    'Nani Coconut Bar', 'Rili Eclairs', 'Roro Caramel Eclair', 'Spark Coconut Bar'
  ];

  const placeholderTexts = [
    'Search for almonds...',
    'Find pistachios...',
    'Looking for cashews?',
    'Search sweets...',
    'Find dry fruits...',
    'Search for walnuts...'
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ Animated Placeholder Effect
  useEffect(() => {
    const currentText = placeholderTexts[placeholderIndex % placeholderTexts.length];
    
    if (!isSearchFocused) {
      let timeout: ReturnType<typeof setTimeout>;
      
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          }, 100);
        } else {
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, 2000);
        }
      } else {
        if (displayText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayText(currentText.slice(0, displayText.length - 1));
          }, 50);
        } else {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => prev + 1);
        }
      }
      
      return () => clearTimeout(timeout);
    }
  }, [displayText, isDeleting, placeholderIndex, isSearchFocused]);

  // ✅ Search Suggestions
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchSuggestions([]);
      return;
    }

    const filtered = allProducts.filter(product =>
      product.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchSuggestions(filtered.slice(0, 5));
  }, [searchTerm]);

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
      setSearchSuggestions([]);
      if (window.innerWidth < 1024) {
        setIsMenuOpen(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    navigate(`/shop?search=${encodeURIComponent(suggestion)}`);
    setSearchTerm('');
    setSearchSuggestions([]);
    if (window.innerWidth < 1024) {
      setIsMenuOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchSuggestions([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

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
      {/* ✅ FIXED SPACER */}
      <div className="h-[56px] sm:h-[64px] md:h-[80px]"></div>

      {/* ✅ NAVBAR - FIXED */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-2xl border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          
          {/* ✅ TOP ROW - FIXED HEIGHT */}
          <div className="flex items-center justify-between h-[56px] sm:h-[64px] md:h-[80px]">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="MAHA ONE" 
                  className="h-7 sm:h-9 md:h-11 w-auto object-contain"
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

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 relative group ${
                    location.pathname === link.path
                      ? 'text-[#D4AF37]'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#D4AF37]'
                  } hover:bg-gradient-to-r hover:from-[#D4AF37]/10 hover:to-transparent`}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#0F766E] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={isSearchFocused ? 'Search products...' : displayText}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsSearchFocused(false);
                    }, 200);
                  }}
                  className={`w-32 lg:w-56 pl-8 pr-3 py-1.5 rounded-full text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:shadow-lg transition-all duration-300 bg-[#F8FAFC] dark:bg-gray-800 ${
                    isSearchFocused || searchTerm.length > 0
                      ? 'border-2 border-[#D4AF37] focus:border-[#D4AF37]'
                      : 'border-2 border-[#0F766E]'
                  }`}
                />
                <button type="submit" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors">
                  <FaSearch size={14} />
                </button>
              </form>

              {/* Wishlist */}
              <Link to="/wishlist" className="p-1.5 sm:p-2 rounded-full hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition-all duration-300 relative group">
                <FaHeart className="text-base sm:text-lg text-gray-600 dark:text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[8px] sm:text-[10px] font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <ThemeToggle />

              <Link to="/dashboard" className="p-1.5 sm:p-2 rounded-full hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition-all duration-300">
                <FaUser className="text-base sm:text-lg text-gray-600 dark:text-gray-400 hover:text-[#D4AF37] transition-colors" />
              </Link>
              
              <Link to="/cart" className="p-1.5 sm:p-2 rounded-full hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition-all duration-300 relative group">
                <FaShoppingBag className="text-base sm:text-lg text-gray-600 dark:text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
                <span className="absolute -top-0.5 -right-0.5 bg-[#0F766E] text-white text-[8px] sm:text-[10px] font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center shadow-md">
                  {getCartCount()}
                </span>
              </Link>

              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="p-1.5 sm:p-2 rounded-full hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition-all duration-300 relative group"
                  title="Admin Panel"
                >
                  <FaCog className="text-base sm:text-lg text-[#D4AF37] group-hover:text-[#0F766E] transition-colors" />
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-white text-[8px] sm:text-[10px] font-bold rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 flex items-center justify-center shadow-md">
                    ⚙
                  </span>
                </Link>
              )}

              <button className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <FaTimes className="text-lg sm:text-xl text-[#0F766E]" /> : <FaBars className="text-lg sm:text-xl text-gray-600 dark:text-gray-400" />}
              </button>
            </div>
          </div>

          {/* ✅ MOBILE SEARCH BAR */}
          <div className="pb-3 lg:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={isSearchFocused ? 'Search products...' : displayText}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setIsSearchFocused(false);
                  }, 200);
                }}
                className={`w-full pl-10 pr-10 py-2.5 rounded-full text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:shadow-lg transition-all duration-300 bg-[#F8FAFC] dark:bg-gray-800 ${
                  isSearchFocused || searchTerm.length > 0
                    ? 'border-2 border-[#D4AF37] focus:border-[#D4AF37]'
                    : 'border-2 border-[#0F766E]'
                }`}
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors">
                <FaSearch className="text-sm" />
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors text-sm"
                >
                  ✕
                </button>
              )}
            </form>

            {searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 mx-3">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#D4AF37]/10 dark:hover:bg-[#D4AF37]/20 transition flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <FaSearch className="text-[#D4AF37] text-xs" />
                    <span dangerouslySetInnerHTML={{
                      __html: suggestion.replace(
                        new RegExp(searchTerm, 'gi'),
                        (match) => `<strong class="text-[#D4AF37]">${match}</strong>`
                      )
                    }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ✅ Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-3 sm:py-4 border-t border-[#E5E7EB] dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="grid grid-cols-2 gap-1 px-2">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-300 text-center ${
                      location.pathname === link.path
                        ? 'bg-[#D4AF37] text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-[#D4AF37] hover:bg-[#F8FAFC] dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 px-2">
                {isLoggedIn && (
                  <>
                    <Link
                      to="/dashboard"
                      className="block py-2.5 px-3 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#D4AF37] hover:bg-[#F8FAFC] dark:hover:bg-gray-800 transition-all duration-300 text-center"
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
                    className="block w-full py-2.5 px-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-center mt-1"
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
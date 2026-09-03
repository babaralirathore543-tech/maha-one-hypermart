// src/components/layout/Navbar.tsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  FaSearch, FaHeart, FaUser, FaShoppingBag, FaBars, FaTimes, 
  FaCrown, FaCog, FaHome, 
  FaThLarge
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { getWishlistCount } from '../../services/wishlistService';
import logo from '../../assets/images/logo.png';
import ThemeToggle from '../common/ThemeToggle';
import CategoriesSlider from '../common/CategoriesSlider';
import VoiceSearch from '../common/VoiceSearch';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [showFullSearch, setShowFullSearch] = useState(true);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin';
  const userId = localStorage.getItem('userId') || 'guest';

  // Navigation Links for Mobile Menu
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Dry Fruits', path: '/shop' },
    { name: 'Fashion', path: '/fashion' },
    { name: 'Sweets', path: '/sweets' },
    { name: 'Cakes', path: '/cakes' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

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

  // Animated Placeholder Effect
  useEffect(() => {
    const currentText = placeholderTexts[placeholderIndex % placeholderTexts.length];
    
    if (!isSearchFocused && !isVoiceListening && !isSearchOverlayOpen) {
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
  }, [displayText, isDeleting, placeholderIndex, isSearchFocused, isVoiceListening, isSearchOverlayOpen]);

  // Search Suggestions
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

  // Check login status
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

  // Fetch wishlist count
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

  // ✅ Scroll listener for compact header
  useEffect(() => {
    let ticking = false;
    const scrollThreshold = 40;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const isMobile = window.innerWidth < 768;
          
          if (isMobile) {
            setIsCompact(scrollY > scrollThreshold);
            setShowFullSearch(scrollY < scrollThreshold);
          } else {
            setIsCompact(false);
            setShowFullSearch(true);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // ✅ Close search overlay on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOverlayOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // ✅ Prevent body scroll when search overlay is open
  useEffect(() => {
    if (isSearchOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOverlayOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setSearchSuggestions([]);
      setIsSearchOverlayOpen(false);
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
    setIsSearchOverlayOpen(false);
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

  // Voice Search Handler
  const handleVoiceTranscript = (text: string) => {
    setSearchTerm(text);
    setIsVoiceListening(false);
    
    if (text && text.trim()) {
      navigate(`/shop?search=${encodeURIComponent(text.trim())}`);
      setSearchTerm('');
      setSearchSuggestions([]);
      setIsSearchOverlayOpen(false);
    }
  };

  const handleVoiceListening = (isListening: boolean) => {
    setIsVoiceListening(isListening);
    if (isListening) {
      setDisplayText('🎤 Listening...');
    }
  };

  // Open search overlay
  const openSearchOverlay = () => {
    setIsSearchOverlayOpen(true);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  // ✅ Scroll to categories section on Home page
  const scrollToCategories = () => {
    console.log('🔄 Scrolling to categories...');
    
    // 🔥 TRY 1: Direct ID from HomePage
    let targetElement = document.getElementById('shop-by-category');
    
    // 🔥 TRY 2: If not found, try section with grid-cols-4
    if (!targetElement) {
      targetElement = document.querySelector('section:has(.grid-cols-4)');
    }
    
    // 🔥 TRY 3: If still not found, try by class
    if (!targetElement) {
      targetElement = document.querySelector('[class*="ShopByCategory"]');
    }
    
    // 🔥 TRY 4: Last resort — find by text
    if (!targetElement) {
      const allSections = document.querySelectorAll('section');
      for (const section of allSections) {
        if (section.textContent?.includes('Shop by Category')) {
          targetElement = section;
          break;
        }
      }
    }
    
    if (targetElement) {
      console.log('✅ Categories section found:', targetElement);
      
      // Get header height for offset
      const navElement = document.querySelector('nav') as HTMLElement | null;
      const headerHeight = navElement?.offsetHeight || 80;
      
      // Calculate scroll position
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 20;
      
      // Smooth scroll
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      console.warn('⚠️ Categories section not found, navigating to home...');
      
      // If not on home page, go to home first
      if (window.location.pathname !== '/') {
        navigate('/');
        // Wait for page to load then scroll
        setTimeout(() => {
          const retryElement = document.getElementById('shop-by-category') || 
                             document.querySelector('section:has(.grid-cols-4)');
          if (retryElement) {
            const headerHeight = document.querySelector('nav')?.offsetHeight || 80;
            const elementPosition = retryElement.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
              top: elementPosition - headerHeight - 20,
              behavior: 'smooth'
            });
          }
        }, 500);
      } else {
        // If on home page but still not found, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Hide bottom nav on these pages
  const hideBottomNav = ['/login', '/checkout', '/admin'];
  const shouldShowBottomNav = !hideBottomNav.includes(location.pathname);

  return (
    <>
      {/* ============================================================
          🔥 NAVBAR — COMPACT MODE: HAMBURGER + LOGO + SEARCH + CART
          ============================================================ */}
      <nav className={`fixed top-0 left-0 w-full z-40 bg-white dark:bg-gray-900 border-b border-[#D4AF37]/20 shadow-md transition-all duration-300 ${
        isCompact ? 'h-[52px] sm:h-[56px]' : 'h-auto'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          
          {/* ==========================================================
              TOP ROW — Hamburger + Logo + Icons
              ========================================================== */}
          <div className={`flex items-center justify-between gap-2 sm:gap-3 transition-all duration-300 ${
            isCompact ? 'h-[52px] sm:h-[56px]' : 'h-[56px] sm:h-[64px] md:h-[72px]'
          }`}>
            
            {/* LEFT: Hamburger Menu — 🔥 ALWAYS VISIBLE */}
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? 
                <FaTimes className="text-xl text-[#0F766E]" /> : 
                <FaBars className={`text-xl text-gray-600 dark:text-gray-300 transition-all duration-300 ${
                  isCompact ? 'text-[#0F766E]' : ''
                }`} />
              }
            </button>

            {/* CENTER: Logo + Name — 🔥 SHRINK ON COMPACT */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 transition-all duration-300">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="MAHA ONE" 
                  className={`transition-all duration-300 ${
                    isCompact ? 'h-5 sm:h-6' : 'h-7 sm:h-9 md:h-11'
                  } w-auto object-contain`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <FaCrown className={`absolute -top-1 -right-2 text-[#D4AF37] ${
                  isCompact ? 'text-[6px] sm:text-[8px]' : 'text-[8px] sm:text-xs'
                } animate-pulse`} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className={`font-extrabold tracking-tight transition-all duration-300 ${
                  isCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-lg md:text-2xl'
                }`}>
                  <span className="text-[#0F766E]">MAHA</span>
                  <span className="text-[#D4AF37]"> ONE</span>
                </span>
                <span className={`hidden sm:block text-gray-400 font-medium uppercase tracking-[0.35em] transition-all duration-300 ${
                  isCompact ? 'text-[5px]' : 'text-[7px] sm:text-[8px] md:text-[9px]'
                }`}>
                  HYPERMART
                </span>
              </div>
            </Link>

            {/* RIGHT: Icons — 🔥 SEARCH + CART ALWAYS VISIBLE, OTHERS HIDE ON COMPACT */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
              
              {/* 🔥 SEARCH ICON — ALWAYS VISIBLE */}
              <button 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={openSearchOverlay}
                aria-label="Search"
              >
                <FaSearch className={`text-lg text-gray-600 dark:text-gray-300 transition-colors ${
                  isCompact ? 'text-[#D4AF37]' : ''
                }`} />
              </button>

              {/* 🔥 ALL OTHER ICONS — HIDE ON COMPACT */}
              <div className={`flex items-center gap-1 sm:gap-2 md:gap-3 transition-all duration-300 ${
                isCompact ? 'opacity-0 scale-95 pointer-events-none w-0 overflow-hidden' : 'opacity-100 scale-100 pointer-events-auto'
              }`}>
                {/* Wishlist */}
                <Link to="/wishlist" className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 relative group">
                  <FaHeart className="text-lg text-gray-600 dark:text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[8px] sm:text-[10px] font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center shadow-md">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <ThemeToggle />

                <Link to="/dashboard" className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
                  <FaUser className="text-lg text-gray-600 dark:text-gray-300 hover:text-[#D4AF37] transition-colors" />
                </Link>

                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 relative group"
                    title="Admin Panel"
                  >
                    <FaCog className="text-lg text-[#D4AF37] group-hover:text-[#0F766E] transition-colors" />
                    <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-white text-[8px] sm:text-[10px] font-bold rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 flex items-center justify-center shadow-md">
                      ⚙
                    </span>
                  </Link>
                )}
              </div>

              {/* 🔥 CART ICON — ALWAYS VISIBLE */}
              <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 relative group">
                <FaShoppingBag className={`text-lg text-gray-600 dark:text-gray-300 group-hover:text-[#D4AF37] transition-colors ${
                  isCompact ? 'text-[#D4AF37]' : ''
                }`} />
                <span className="absolute -top-0.5 -right-0.5 bg-[#0F766E] text-white text-[8px] sm:text-[10px] font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center shadow-md">
                  {getCartCount()}
                </span>
              </Link>
            </div>
          </div>

          {/* ==========================================================
              SEARCH BAR — 🔥 SHOW/HIDE ON SCROLL
              ========================================================== */}
          <div className={`transition-all duration-300 overflow-hidden ${
            showFullSearch ? 'max-h-20 opacity-100 pb-2 sm:pb-3' : 'max-h-0 opacity-0 py-0'
          }`}>
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={isVoiceListening ? '🎤 Listening...' : (isSearchFocused ? 'Search products...' : displayText)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setIsSearchFocused(false);
                  }, 200);
                }}
                className="w-full pl-12 pr-24 py-2.5 sm:py-3 rounded-full text-sm sm:text-base text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:shadow-lg transition-all duration-300 bg-gray-100 dark:bg-gray-800 border-2 border-[#0F766E] focus:border-[#D4AF37]"
              />
              <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors">
                <FaSearch className="text-base sm:text-lg" />
              </button>

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <VoiceSearch
                  onTranscript={handleVoiceTranscript}
                  onListening={handleVoiceListening}
                  className="p-1.5 text-sm"
                />
                
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>

            {/* Search Suggestions */}
            {searchSuggestions.length > 0 && !isVoiceListening && (
              <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
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

          {/* ==========================================================
              CATEGORIES SLIDER — Search Bar ke Neeche
              ========================================================== */}
          <div className="pb-1">
            <CategoriesSlider 
              isCompact={isCompact}
              isSticky={isCompact}
            />
          </div>

          {/* ==========================================================
              MOBILE MENU
              ========================================================== */}
          {isMenuOpen && (
            <div className="lg:hidden py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="grid grid-cols-2 gap-1 px-2">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-300 text-center ${
                      location.pathname === link.path
                        ? 'bg-[#D4AF37] text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-[#D4AF37] hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 px-2">
                {isLoggedIn && (
                  <>
                    <Link
                      to="/dashboard"
                      className="block py-2.5 px-3 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#D4AF37] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 text-center"
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

      {/* ==========================================================
          SEARCH OVERLAY — Mobile
          ========================================================== */}
      {isSearchOverlayOpen && (
        <div 
          ref={searchOverlayRef}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSearchOverlayOpen(false);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-900 p-4 pt-12 shadow-2xl animate-slideDown">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Search Products</h3>
              <button
                onClick={() => setIsSearchOverlayOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FaTimes className="text-xl text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={isVoiceListening ? '🎤 Listening...' : 'Search for products...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-24 py-3 rounded-full text-base text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:shadow-lg transition-all duration-300 bg-gray-100 dark:bg-gray-800 border-2 border-[#D4AF37] focus:border-[#D4AF37]"
                autoFocus
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors">
                <FaSearch className="text-base" />
              </button>

              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <VoiceSearch
                  onTranscript={handleVoiceTranscript}
                  onListening={handleVoiceListening}
                  className="p-2 text-base"
                />
                
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-gray-400 hover:text-red-500 transition-colors text-base p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>

            {searchSuggestions.length > 0 && !isVoiceListening && (
              <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#D4AF37]/10 dark:hover:bg-[#D4AF37]/20 transition flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
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
        </div>
      )}

      {/* ==========================================================
          MOBILE BOTTOM NAVIGATION
          ========================================================== */}
      {shouldShowBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white dark:bg-gray-900 border-t border-[#D4AF37]/20 shadow-2xl safe-area-bottom">
          <div className="grid grid-cols-5 max-w-md mx-auto px-1">
            
            {/* 1. HOME */}
            <Link
              to="/"
              className={`flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-300 relative ${
                location.pathname === '/' 
                  ? 'text-[#D4AF37]' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-[#D4AF37]'
              }`}
              onClick={() => {
                if (isMenuOpen) setIsMenuOpen(false);
              }}
            >
              <span className={location.pathname === '/' ? 'scale-110' : ''}>
                <FaHome className={`text-xl sm:text-2xl ${location.pathname === '/' ? 'text-[#D4AF37]' : ''}`} />
              </span>
              <span className={`text-[9px] sm:text-[10px] font-medium ${location.pathname === '/' ? 'text-[#D4AF37]' : ''}`}>
                Home
              </span>
              {location.pathname === '/' && (
                <span className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#0F766E] rounded-full"></span>
              )}
            </Link>

            {/* 2. DARK MODE */}
            <div className="flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-300 text-gray-500 dark:text-gray-400">
              <ThemeToggle />
              <span className="text-[9px] sm:text-[10px] font-medium">Theme</span>
            </div>

            {/* 3. CATEGORIES - Center — 🔥 FIXED */}
            <button
              onClick={scrollToCategories}
              className="flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-300 relative text-[#D4AF37]"
            >
              <span className="scale-110">
                <FaThLarge className="text-xl sm:text-2xl text-[#D4AF37]" />
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium text-[#D4AF37]">
                Categories
              </span>
              <span className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#0F766E] rounded-full"></span>
            </button>

            {/* 4. CART */}
            <Link
              to="/cart"
              className={`flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-300 relative ${
                location.pathname === '/cart' 
                  ? 'text-[#D4AF37]' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-[#D4AF37]'
              }`}
              onClick={() => {
                if (isMenuOpen) setIsMenuOpen(false);
              }}
            >
              <span className={location.pathname === '/cart' ? 'scale-110' : ''}>
                <div className="relative">
                  <FaShoppingBag className={`text-xl sm:text-2xl ${location.pathname === '/cart' ? 'text-[#D4AF37]' : ''}`} />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#0F766E] text-white text-[8px] sm:text-[10px] font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center shadow-md">
                      {getCartCount()}
                    </span>
                  )}
                </div>
              </span>
              <span className={`text-[9px] sm:text-[10px] font-medium ${location.pathname === '/cart' ? 'text-[#D4AF37]' : ''}`}>
                Cart
              </span>
              {location.pathname === '/cart' && (
                <span className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#0F766E] rounded-full"></span>
              )}
            </Link>

            {/* 5. ACCOUNT */}
            <Link
              to={isLoggedIn ? "/dashboard" : "/login"}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-300 relative ${
                location.pathname === '/dashboard' || location.pathname === '/login'
                  ? 'text-[#D4AF37]' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-[#D4AF37]'
              }`}
              onClick={() => {
                if (isMenuOpen) setIsMenuOpen(false);
              }}
            >
              <span className={location.pathname === '/dashboard' || location.pathname === '/login' ? 'scale-110' : ''}>
                <FaUser className={`text-xl sm:text-2xl ${location.pathname === '/dashboard' || location.pathname === '/login' ? 'text-[#D4AF37]' : ''}`} />
              </span>
              <span className={`text-[9px] sm:text-[10px] font-medium ${location.pathname === '/dashboard' || location.pathname === '/login' ? 'text-[#D4AF37]' : ''}`}>
                Account
              </span>
              {(location.pathname === '/dashboard' || location.pathname === '/login') && (
                <span className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#0F766E] rounded-full"></span>
              )}
            </Link>
          </div>
        </div>
      )}

      {/* SPACER FOR MOBILE BOTTOM NAV */}
      {shouldShowBottomNav && (
        <div className="lg:hidden h-[60px] sm:h-[68px]"></div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
};

export default Navbar;
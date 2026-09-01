// src/components/common/CategoriesSlider.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate instead of Link
import { 
  FaChevronLeft, 
  FaChevronRight,
  FaAppleAlt,
  FaTshirt,
  FaCandyCane,
  FaBirthdayCake,
  FaUtensils,
  FaShoePrints,
  FaShoppingBag,
  FaGem,
  FaLeaf,
  FaSeedling
} from 'react-icons/fa';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  link: string;
  sectionId: string;
  color: string;
  bgColor: string;
  activeBgColor: string;
}

interface CategoriesSliderProps {
  isCompact?: boolean;
  isSticky?: boolean;
}

const CategoriesSlider: React.FC<CategoriesSliderProps> = ({ 
  isCompact = false,
  isSticky = false
}) => {
  const navigate = useNavigate(); // ✅ useNavigate hook
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('dry-fruits');

  // Categories Data with section IDs
  const categories: Category[] = [
    {
      id: 'dry-fruits',
      name: 'Dry Fruits',
      icon: <FaAppleAlt className="text-lg sm:text-xl" />,
      link: '/shop',
      sectionId: 'dryfruits-section',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40',
      activeBgColor: 'bg-amber-500 dark:bg-amber-600 text-white shadow-lg shadow-amber-500/30'
    },
    {
      id: 'mens-fashion',
      name: "Men's Fashion",
      icon: <FaTshirt className="text-lg sm:text-xl" />,
      link: '/fashion?gender=men',
      sectionId: 'mens-fashion-section',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40',
      activeBgColor: 'bg-blue-500 dark:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
    },
    {
      id: 'womens-fashion',
      name: "Women's Fashion",
      icon: <FaTshirt className="text-lg sm:text-xl" />,
      link: '/fashion?gender=women',
      sectionId: 'womens-fashion-section',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40',
      activeBgColor: 'bg-purple-500 dark:bg-purple-600 text-white shadow-lg shadow-purple-500/30'
    },
    {
      id: 'kids-fashion',
      name: "Kids Fashion",
      icon: <FaTshirt className="text-lg sm:text-xl" />,
      link: '/fashion?gender=kids',
      sectionId: 'kids-fashion-section',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/40',
      activeBgColor: 'bg-pink-500 dark:bg-pink-600 text-white shadow-lg shadow-pink-500/30'
    },
    {
      id: 'sweets',
      name: 'Sweets',
      icon: <FaCandyCane className="text-lg sm:text-xl" />,
      link: '/sweets',
      sectionId: 'sweets-section',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40',
      activeBgColor: 'bg-rose-500 dark:bg-rose-600 text-white shadow-lg shadow-rose-500/30'
    },
    {
      id: 'cakes',
      name: 'Cakes & Bakery',
      icon: <FaBirthdayCake className="text-lg sm:text-xl" />,
      link: '/cakes',
      sectionId: 'cakes-section',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40',
      activeBgColor: 'bg-orange-500 dark:bg-orange-600 text-white shadow-lg shadow-orange-500/30'
    },
    {
      id: 'food',
      name: 'Food Items',
      icon: <FaUtensils className="text-lg sm:text-xl" />,
      link: '/shop?category=food',
      sectionId: 'food-section',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40',
      activeBgColor: 'bg-green-500 dark:bg-green-600 text-white shadow-lg shadow-green-500/30'
    },
    {
      id: 'footwear',
      name: 'Footwear',
      icon: <FaShoePrints className="text-lg sm:text-xl" />,
      link: '/fashion?category=footwear',
      sectionId: 'footwear-section',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
      activeBgColor: 'bg-emerald-500 dark:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
    },
    {
      id: 'bags',
      name: 'Bags',
      icon: <FaShoppingBag className="text-lg sm:text-xl" />,
      link: '/fashion?category=bags',
      sectionId: 'bags-section',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40',
      activeBgColor: 'bg-indigo-500 dark:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      icon: <FaGem className="text-lg sm:text-xl" />,
      link: '/fashion?category=accessories',
      sectionId: 'accessories-section',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40',
      activeBgColor: 'bg-amber-500 dark:bg-amber-600 text-white shadow-lg shadow-amber-500/30'
    },
    {
      id: 'organic',
      name: 'Organic',
      icon: <FaLeaf className="text-lg sm:text-xl" />,
      link: '/shop?category=organic',
      sectionId: 'organic-section',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40',
      activeBgColor: 'bg-teal-500 dark:bg-teal-600 text-white shadow-lg shadow-teal-500/30'
    },
    {
      id: 'seeds',
      name: 'Seeds & Nuts',
      icon: <FaSeedling className="text-lg sm:text-xl" />,
      link: '/shop?category=seeds',
      sectionId: 'seeds-section',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40',
      activeBgColor: 'bg-yellow-500 dark:bg-yellow-600 text-white shadow-lg shadow-yellow-500/30'
    },
  ];

  // ✅ IntersectionObserver for active category detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const category = categories.find(cat => cat.sectionId === sectionId);
            if (category) {
              setActiveCategory(category.id);
              // Auto-scroll active category into view
              const activeElement = categoryRefs.current[category.id];
              if (activeElement && scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                const elementRect = activeElement.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                
                // Check if element is outside visible area
                if (elementRect.left < containerRect.left || elementRect.right > containerRect.right) {
                  activeElement.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest'
                  });
                }
              }
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.3
      }
    );

    // Observe all section elements
    categories.forEach((category) => {
      const element = document.getElementById(category.sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [categories]);

  // Check if scroll buttons should be shown
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Scroll functions
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  // Handle category click - smooth scroll to section
  const handleCategoryClick = (e: React.MouseEvent, sectionId: string, link: string) => {
    e.preventDefault();
    
    // Check if on homepage
    if (window.location.pathname === '/') {
      const targetElement = document.getElementById(sectionId);
      if (targetElement) {
        // ✅ Fixed: Cast to HTMLElement for offsetHeight
        const navElement = document.querySelector('nav') as HTMLElement | null;
        const sliderElement = document.querySelector('.categories-slider') as HTMLElement | null;
        
        const headerHeight = navElement?.offsetHeight || 120;
        const categoryHeight = sliderElement?.offsetHeight || 60;
        const totalOffset = headerHeight + categoryHeight + 20;
        
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - totalOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        setActiveCategory(sectionId.replace('-section', ''));
      }
    } else {
      // Navigate to homepage with section anchor
      navigate(link);
      setTimeout(() => {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
          // ✅ Fixed: Cast to HTMLElement for offsetHeight
          const navElement = document.querySelector('nav') as HTMLElement | null;
          const sliderElement = document.querySelector('.categories-slider') as HTMLElement | null;
          
          const headerHeight = navElement?.offsetHeight || 120;
          const categoryHeight = sliderElement?.offsetHeight || 60;
          const totalOffset = headerHeight + categoryHeight + 20;
          
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - totalOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  };

  // Mouse drag scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag scrolling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  };

  // Update arrow visibility on scroll and resize
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setTimeout(checkScroll, 100);

    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  return (
    <div className={`relative w-full bg-white dark:bg-[#1F2937] border-b border-gray-100 dark:border-gray-700 categories-slider transition-all duration-300 ${
      isCompact ? 'py-0.5 sm:py-1' : 'py-1 sm:py-1.5'
    } ${isSticky ? 'sticky top-0 z-30 shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full p-1 sm:p-1.5 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 -translate-x-1"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300" />
            </button>
          )}

          {/* Categories */}
          <div
            ref={scrollContainerRef}
            className={`flex gap-1.5 sm:gap-2 overflow-x-auto scroll-smooth hide-scrollbar ${
              isCompact ? 'py-0.5' : 'py-1'
            } px-0.5 ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <a
                  key={category.id}
                  ref={(el) => {
                    if (el) categoryRefs.current[category.id] = el;
                  }}
                  href={category.link}
                  onClick={(e) => handleCategoryClick(e, category.sectionId, category.link)}
                  className={`flex-shrink-0 flex flex-col items-center gap-0.5 sm:gap-1 transition-all duration-300 rounded-xl sm:rounded-2xl group border-2 ${
                    isActive
                      ? `${category.activeBgColor} border-[#D4AF37] scale-105`
                      : `${category.bgColor} border-transparent hover:border-[#D4AF37]/30`
                  } ${isCompact ? 'p-1 sm:p-1.5 min-w-[50px] sm:min-w-[60px]' : 'p-1.5 sm:p-2 md:p-2.5 min-w-[55px] sm:min-w-[65px] md:min-w-[75px]'}`}
                >
                  <div className={`transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-white scale-110' : category.color
                  } ${isCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base md:text-lg'}`}>
                    {category.icon}
                  </div>
                  <span className={`font-medium text-center leading-tight transition-colors ${
                    isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300 group-hover:text-[#D4AF37]'
                  } ${isCompact ? 'text-[5px] sm:text-[7px]' : 'text-[6px] sm:text-[8px] md:text-[9px]'} line-clamp-1`}>
                    {category.name}
                  </span>
                  {isActive && (
                    <div className="w-3 h-0.5 bg-white rounded-full"></div>
                  )}
                  {!isActive && (
                    <div className="w-3 h-0.5 bg-[#D4AF37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </a>
              );
            })}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full p-1 sm:p-1.5 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 translate-x-1"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoriesSlider;
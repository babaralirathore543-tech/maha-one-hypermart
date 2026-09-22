// src/pages/HomePage.tsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowRight, FaSpinner, FaStar, FaQuoteLeft,
  FaChevronLeft, FaChevronRight,
  FaAppleAlt, FaMale, FaFemale, FaChild, FaCookie,
  FaShoePrints, FaShoppingBag, FaGem, FaLeaf
} from 'react-icons/fa';
import { User, Store, ArrowRight as ArrowRightIcon } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  db,
  collection,
  getDocs,
  query,
  where,
  limit,
  doc,
  getDoc,
} from '../../config/firebase';
import ProductCard from '../common/ProductCard';

// ============================================================
// TYPE
// ============================================================
type SellerStatus = 'none' | 'pending' | 'approved' | 'rejected' | 'checking';

// ============================================================
// CATEGORY HERO BANNER
// ============================================================
interface CategoryHeroBannerProps {
  image: string;
  alt: string;
  link: string;
}

const CategoryHeroBanner: React.FC<CategoryHeroBannerProps> = ({ image, alt, link }) => {
  return (
    <Link to={link} className="block w-full">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl group">
        <div className="w-full aspect-[16/6] sm:aspect-[16/5] md:aspect-[16/4] lg:aspect-[16/3.5]">
          <img
            src={image}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/1200x300/D4AF37/FFFFFF?text=${alt}`;
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
      </div>
    </Link>
  );
};

// ============================================================
// SECTION HEADER
// ============================================================
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, viewAllLink }) => {
  return (
    <div className="flex items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="flex-1 min-w-0">
        <h2 className="
          text-xl sm:text-3xl md:text-4xl
          font-black uppercase
          tracking-[0.08em] sm:tracking-[0.12em]
          text-gray-900 dark:text-white
          leading-tight
        ">
          {title}
        </h2>
        <div className="h-1 w-16 sm:w-20 rounded-full bg-[#D4AF37] mt-2 sm:mt-3" />
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 font-light tracking-wide">
            {subtitle}
          </p>
        )}
      </div>

      <Link
        to={viewAllLink}
        className="group flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 rounded-full bg-[#3B1E54] hover:bg-[#D4AF37] text-white transition-all duration-300 flex-shrink-0 shadow-md hover:shadow-lg"
      >
        <span className="text-[11px] sm:text-sm font-semibold whitespace-nowrap">
          View All
        </span>
        <FaArrowRight className="text-[9px] sm:text-xs group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

// ============================================================
// CATEGORY PRODUCT SECTION
// ============================================================
interface CategoryProductSectionProps {
  title: string;
  subtitle?: string;
  products: any[];
  viewAllLink: string;
  loading?: boolean;
  detailPathPrefix: string;
}

const CategoryProductSection: React.FC<CategoryProductSectionProps> = ({
  title,
  subtitle,
  products,
  viewAllLink,
  loading = false,
  detailPathPrefix,
}) => {
  return (
    <section className="py-8 sm:py-10 md:py-12">
      <div className="max-w-[1500px] mx-auto px-2.5 sm:px-4 lg:px-6">
        <SectionHeader title={title} subtitle={subtitle} viewAllLink={viewAllLink} />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-3xl text-[#D4AF37]" />
            <span className="ml-3 text-gray-500">Loading products...</span>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 items-stretch">
            {products.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="h-full"
              >
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    oldPrice: product.oldPrice,
                    discount: product.discount,
                    discountPrice: product.discountPrice,
                    image: product.image,
                    images: product.images,
                    stock: product.stock,
                    isNew: product.isNew,
                    isFeatured: product.isFeatured,
                    isBestSeller: product.isBestSeller,
                    rating: product.rating || 4.5,
                    reviewCount: 0,
                    category: product.category,
                    colors: product.colors || [],
                  }}
                  variant="vertical-compact"
                  primaryColor="#3B1E54"
                  secondaryColor="#D4AF37"
                  detailPath={`${detailPathPrefix}/${product.id}`}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            No products available in this category
          </div>
        )}
      </div>
    </section>
  );
};

// ============================================================
// CUSTOMER / SELLER CARDS — Smart (Seller status aware)
// ============================================================
const CustomerSellerCards = ({
  isLoggedIn,
  sellerStatus,
}: {
  isLoggedIn: boolean;
  sellerStatus: SellerStatus;
}) => {
  // ✅ Seller card configuration based on status
  const getSellerCard = () => {
    if (!isLoggedIn) {
      return {
        to: '/seller/register',
        title: 'Seller',
        subtitle: 'Login / Register',
        iconColor: 'text-[#3B1E54]',
        badge: null,
      };
    }

    if (sellerStatus === 'approved') {
      return {
        to: '/seller',
        title: 'Seller Dashboard',
        subtitle: 'Manage your store',
        iconColor: 'text-[#3B1E54]',
        badge: { text: '● Live', color: 'bg-green-600 text-white' },
      };
    }

    if (sellerStatus === 'pending') {
      return {
        to: '/seller/register',
        title: 'Pending',
        subtitle: 'Under review',
        iconColor: 'text-yellow-800',
        badge: { text: '⏳', color: 'bg-yellow-600 text-white' },
      };
    }

    if (sellerStatus === 'rejected') {
      return {
        to: '/seller/register',
        title: 'Rejected',
        subtitle: 'Contact support',
        iconColor: 'text-red-800',
        badge: { text: '✕', color: 'bg-red-600 text-white' },
      };
    }

    // Logged in, no seller doc → Register
    return {
      to: '/seller/register',
      title: 'Seller',
      subtitle: 'Register as seller',
      iconColor: 'text-[#3B1E54]',
      badge: null,
    };
  };

  const sellerCard = getSellerCard();

  return (
    <section className="max-w-[1500px] mx-auto px-3 sm:px-4 lg:px-6 pt-10 sm:pt-24 md:pt-28 lg:pt-32 pb-2 sm:pb-3">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">

        {/* CUSTOMER — Purple Gradient */}
        <Link
          to={isLoggedIn ? '/dashboard' : '/login'}
          className="
            group relative overflow-hidden
            bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#5B21B6]
            rounded-xl sm:rounded-2xl
            px-3 py-2.5 sm:px-4 sm:py-3
            shadow-lg shadow-purple-500/25
            hover:shadow-xl hover:shadow-purple-500/40
            border border-purple-400/30
            transition-all duration-300
            hover:-translate-y-0.5
          "
        >
          <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-white/10 blur-lg" />
          <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-[#D4AF37]/20 blur-md" />

          <div className="relative flex items-center gap-2 sm:gap-2.5">
            <div className="
              w-8 h-8 sm:w-9 sm:h-9
              rounded-full
              bg-white/20 backdrop-blur-sm
              border-2 border-white/40
              flex items-center justify-center
              flex-shrink-0
              group-hover:scale-110
              transition-transform duration-300
            ">
              <User className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-black text-white truncate tracking-tight leading-tight">
                Customer
              </p>
              <p className="text-[9px] sm:text-[10px] text-white/75 truncate font-medium leading-tight">
                {isLoggedIn ? 'My Account' : 'Shop & Enjoy'}
              </p>
            </div>
          </div>
        </Link>

        {/* SELLER — Smart Gold Gradient */}
        <Link
          to={sellerCard.to}
          className="
            group relative overflow-hidden
            bg-gradient-to-br from-[#FCD34D] via-[#D4AF37] to-[#B8941F]
            rounded-xl sm:rounded-2xl
            px-3 py-2.5 sm:px-4 sm:py-3
            shadow-lg shadow-amber-500/30
            hover:shadow-xl hover:shadow-amber-500/50
            border border-yellow-300/40
            transition-all duration-300
            hover:-translate-y-0.5
          "
        >
          <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-white/20 blur-lg" />
          <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-white/10 blur-md" />

          <div className="relative flex items-center gap-2 sm:gap-2.5">
            <div className="
              w-8 h-8 sm:w-9 sm:h-9
              rounded-full
              bg-white/30 backdrop-blur-sm
              border-2 border-white/50
              flex items-center justify-center
              flex-shrink-0
              group-hover:scale-110
              transition-transform duration-300
              relative
            ">
              <Store className={`w-4 h-4 ${sellerCard.iconColor}`} strokeWidth={2.5} />

              {/* Badge on icon */}
              {sellerCard.badge && (
                <span
                  className={`absolute -top-1 -right-1 text-[8px] font-bold px-1 rounded-full ${sellerCard.badge.color}`}
                >
                  {sellerCard.badge.text}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-black text-[#3B1E54] truncate tracking-tight leading-tight">
                {sellerCard.title}
              </p>
              <p className="text-[9px] sm:text-[10px] text-[#3B1E54]/80 truncate font-semibold leading-tight">
                {sellerCard.subtitle}
              </p>
            </div>

            <ArrowRightIcon className="
              w-3.5 h-3.5
              text-[#3B1E54]
              flex-shrink-0
              hidden sm:block
              group-hover:translate-x-1
              transition-transform duration-300
            " />
          </div>
        </Link>
      </div>
    </section>
  );
};

// ============================================================
// SHOP BY CATEGORY
// ============================================================
const ShopByCategory = () => {
  const categories = [
    { id: 'dryfruits', name: 'Dry Fruits', icon: <FaAppleAlt className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B1E54] group-hover:text-white transition-colors" />, link: '/shop', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: 'herbal', name: 'Herbal', icon: <FaLeaf className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B1E54] group-hover:text-white transition-colors" />, link: '/herbal', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 'mens-fashion', name: "Men's", icon: <FaMale className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B1E54] group-hover:text-white transition-colors" />, link: '/fashion?gender=men', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'womens-fashion', name: "Women's", icon: <FaFemale className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B1E54] group-hover:text-white transition-colors" />, link: '/fashion?gender=women', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'kids-fashion', name: "Kids", icon: <FaChild className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B1E54] group-hover:text-white transition-colors" />, link: '/fashion?gender=kids', bg: 'bg-pink-50 dark:bg-pink-900/20' },
    { id: 'sweets', name: 'Sweets', icon: <FaCookie className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B1E54] group-hover:text-white transition-colors" />, link: '/sweets', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { id: 'footwear', name: 'Footwear', icon: <FaShoePrints className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B1E54] group-hover:text-white transition-colors" />, link: '/fashion?category=footwear', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 'bags', name: 'Bags', icon: <FaShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B1E54] group-hover:text-white transition-colors" />, link: '/fashion?category=bags', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 'accessories', name: 'More', icon: <FaGem className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B1E54] group-hover:text-white transition-colors" />, link: '/fashion?category=accessories', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  return (
    <section className="py-4 sm:py-6 bg-gradient-to-b from-[#FFFDF7] to-[#F8FAFC] dark:from-[#111827] dark:to-[#1F2937]">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 lg:px-6">

        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-[0.08em] sm:tracking-[0.12em] text-gray-900 dark:text-white">
              Shop by Category
            </h2>
            <div className="h-0.5 w-12 sm:w-16 rounded-full bg-[#D4AF37] mt-1.5" />
          </div>
          <Link
            to="/shop"
            className="group flex items-center gap-1 px-2.5 sm:px-4 py-1.5 rounded-full bg-[#3B1E54] hover:bg-[#D4AF37] text-white transition-all duration-300 flex-shrink-0 shadow-sm"
          >
            <span className="text-[10px] sm:text-xs font-semibold whitespace-nowrap">
              View All
            </span>
            <FaArrowRight className="text-[8px] sm:text-[10px] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-9 gap-2 sm:gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="group flex flex-col items-center gap-1.5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className={`
                w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14
                rounded-full
                ${category.bg}
                border-2 border-[#3B1E54]
                flex items-center justify-center
                shadow-sm
                group-hover:shadow-md
                group-hover:bg-[#3B1E54]
                group-hover:border-[#D4AF37]
                transition-all duration-300
              `}>
                {category.icon}
              </div>

              <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-[#3B1E54] dark:group-hover:text-[#D4AF37] text-center leading-tight transition-colors line-clamp-1">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// TESTIMONIAL SLIDER
// ============================================================
interface Testimonial {
  name: string;
  text: string;
  rating: number;
  location: string;
  initials: string;
  color: string;
  verified?: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  { name: 'Ayesha Khan', text: 'Best dry fruits I have ever tasted! Premium quality. The packaging was excellent and delivery was on time.', rating: 5, location: 'Lahore', initials: 'AK', color: 'from-purple-500 to-pink-500', verified: true },
  { name: 'Dr. Usman Ahmed', text: '100% natural and fresh. Highly recommended for health-conscious people. Will definitely order again.', rating: 5, location: 'Karachi', initials: 'UA', color: 'from-blue-500 to-cyan-500', verified: true },
  { name: 'Fatima Ali', text: 'Perfect for gifting. Beautiful packaging and amazing quality. My family loved the sweets collection!', rating: 5, location: 'Islamabad', initials: 'FA', color: 'from-rose-500 to-orange-500', verified: true },
  { name: 'Hassan Raza', text: 'Amazing variety and prices. The fashion collection is trendy and fits perfectly. Highly satisfied!', rating: 5, location: 'Rawalpindi', initials: 'HR', color: 'from-emerald-500 to-teal-500', verified: true },
  { name: 'Maryam Sheikh', text: 'Fast delivery and excellent customer service. The herbal products are authentic and effective.', rating: 5, location: 'Faisalabad', initials: 'MS', color: 'from-amber-500 to-yellow-500', verified: true },
  { name: 'Bilal Ahmed', text: 'Ordered multiple times, always satisfied. Fresh products, secure packaging, and timely delivery.', rating: 5, location: 'Multan', initials: 'BA', color: 'from-indigo-500 to-purple-500', verified: true },
];

const TestimonialsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth >= 768 ? 2 : 1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(TESTIMONIALS.length / itemsPerView);
  const maxIndex = Math.max(0, totalSlides - 1);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [itemsPerView, maxIndex, currentIndex]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  const goToPrev = () => setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  const goToNext = () => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const goToSlide = (index: number) => setCurrentIndex(index);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold) goToNext();
    else if (diff < -threshold) goToPrev();
    setTimeout(() => setIsPaused(false), 3000);
  };

  const visibleTestimonials = TESTIMONIALS.slice(
    currentIndex * itemsPerView,
    currentIndex * itemsPerView + itemsPerView
  );

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FFFDF7] dark:bg-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[#D4AF37] font-medium text-xs tracking-wider uppercase">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">
            What Our <span className="text-[#D4AF37]">Customers Say</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
            Real reviews from real customers who trust Maha One
          </p>
        </div>

        <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <div
            className="overflow-hidden px-2 sm:px-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className={`grid gap-5 md:gap-6 ${itemsPerView === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}
              >
                {visibleTestimonials.map((review, idx) => (
                  <div
                    key={`${currentIndex}-${idx}`}
                    className="
                      relative bg-white dark:bg-[#1F2937]
                      rounded-2xl sm:rounded-3xl
                      p-6 sm:p-8 md:p-10
                      shadow-lg hover:shadow-2xl transition-all duration-300
                      border border-gray-100 dark:border-gray-700
                      flex flex-col min-h-[240px] sm:min-h-[260px]
                    "
                  >
                    <FaQuoteLeft className="absolute top-6 right-6 text-4xl sm:text-5xl text-[#D4AF37]/15" />
                    <div className="flex text-[#D4AF37] mb-4 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={`text-sm sm:text-base ${i < review.rating ? 'text-[#D4AF37]' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed italic flex-1">
                      "{review.text}"
                    </p>
                    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700 flex items-center gap-3">
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md flex-shrink-0`}>
                        {review.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{review.name}</h4>
                          {review.verified && (
                            <span className="text-[9px] sm:text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full font-semibold">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{review.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {maxIndex > 0 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-0 sm:-left-2 md:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-[#1F2937] text-[#3B1E54] dark:text-white flex items-center justify-center shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:bg-[#3B1E54] hover:text-white transition-all duration-300 z-10"
                aria-label="Previous testimonial"
              >
                <FaChevronLeft className="text-sm sm:text-base" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 sm:-right-2 md:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-[#1F2937] text-[#3B1E54] dark:text-white flex items-center justify-center shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:bg-[#3B1E54] hover:text-white transition-all duration-300 z-10"
                aria-label="Next testimonial"
              >
                <FaChevronRight className="text-sm sm:text-base" />
              </button>
            </>
          )}

          {totalSlides > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 sm:w-10 h-2 bg-[#3B1E54] dark:bg-[#D4AF37]' : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-[#D4AF37]/60'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-[#1F2937] px-6 py-3 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-2xl">⭐</span>
            <span className="font-bold text-gray-900 dark:text-white">4.9</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">5.0</span>
            <span className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-2" />
            <span className="text-sm text-gray-500">Based on 10,000+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// HOME PAGE
// ============================================================
const HomePage = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // ✅ Seller status state
  const [sellerStatus, setSellerStatus] = useState<SellerStatus>('checking');

  const [dryFruitsProducts, setDryFruitsProducts] = useState<any[]>([]);
  const [mensFashionProducts, setMensFashionProducts] = useState<any[]>([]);
  const [womensFashionProducts, setWomensFashionProducts] = useState<any[]>([]);
  const [kidsFashionProducts, setKidsFashionProducts] = useState<any[]>([]);
  const [sweetsProducts, setSweetsProducts] = useState<any[]>([]);
  const [herbalProducts, setHerbalProducts] = useState<any[]>([]);

  const [loadingDryFruits, setLoadingDryFruits] = useState(true);
  const [loadingMens, setLoadingMens] = useState(true);
  const [loadingWomens, setLoadingWomens] = useState(true);
  const [loadingKids, setLoadingKids] = useState(true);
  const [loadingSweets, setLoadingSweets] = useState(true);
  const [loadingHerbal, setLoadingHerbal] = useState(true);

  const slides = [
    { id: 0, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1788241099/1788240235024_uw5fhn.jpg', link: '/shop', alt: 'Premium Dry Fruits Collection' },
    { id: 1, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1788241098/1788240235094_w5m6ak.jpg', link: '/sweets', alt: 'Sweet Collection' },
    { id: 2, image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1788240934/1788240234961_tqja27.jpg', link: '/fashion', alt: 'Fashion Collection' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ Seller status check
  useEffect(() => {
    const checkSeller = async () => {
      if (!user?.uid) {
        setSellerStatus('none');
        return;
      }

      try {
        const snap = await getDoc(doc(db, 'sellers', user.uid));

        if (!snap.exists()) {
          setSellerStatus('none');
          return;
        }

        const data = snap.data();
        const status = data.verificationStatus || 'pending';

        if (status === 'approved') setSellerStatus('approved');
        else if (status === 'rejected') setSellerStatus('rejected');
        else setSellerStatus('pending');
      } catch (err) {
        console.error('Error checking seller:', err);
        setSellerStatus('none');
      }
    };

    checkSeller();
  }, [user?.uid]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDryFruits = async () => {
      try {
        setLoadingDryFruits(true);
        const q = query(collection(db, 'products'), where('category', 'in', ['dryfruits', 'dry-fruits']), where('status', '==', 'active'), limit(8));
        const snapshot = await getDocs(q);
        setDryFruitsProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error('Error:', error); } finally { setLoadingDryFruits(false); }
    };
    fetchDryFruits();
  }, []);

  useEffect(() => {
    const fetchHerbal = async () => {
      try {
        setLoadingHerbal(true);
        const q = query(collection(db, 'products'), where('category', '==', 'herbal'), where('status', '==', 'active'), limit(8));
        const snapshot = await getDocs(q);
        setHerbalProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error('Error:', error); } finally { setLoadingHerbal(false); }
      };
    fetchHerbal();
  }, []);

  useEffect(() => {
    const fetchMensFashion = async () => {
      try {
        setLoadingMens(true);
        const q = query(collection(db, 'products'), where('category', '==', 'fashion'), where('gender', '==', 'men'), where('status', '==', 'active'), limit(8));
        const snapshot = await getDocs(q);
        setMensFashionProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error('Error:', error); } finally { setLoadingMens(false); }
    };
    fetchMensFashion();
  }, []);

  useEffect(() => {
    const fetchWomensFashion = async () => {
      try {
        setLoadingWomens(true);
        const q = query(collection(db, 'products'), where('category', '==', 'fashion'), where('gender', '==', 'women'), where('status', '==', 'active'), limit(8));
        const snapshot = await getDocs(q);
        setWomensFashionProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error('Error:', error); } finally { setLoadingWomens(false); }
    };
    fetchWomensFashion();
  }, []);

  useEffect(() => {
    const fetchKidsFashion = async () => {
      try {
        setLoadingKids(true);
        const q = query(collection(db, 'products'), where('category', '==', 'fashion'), where('gender', '==', 'kids'), where('status', '==', 'active'), limit(8));
        const snapshot = await getDocs(q);
        setKidsFashionProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error('Error:', error); } finally { setLoadingKids(false); }
    };
    fetchKidsFashion();
  }, []);

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        setLoadingSweets(true);
        const q = query(collection(db, 'products'), where('category', '==', 'sweets'), where('status', '==', 'active'), limit(8));
        const snapshot = await getDocs(q);
        setSweetsProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error('Error:', error); } finally { setLoadingSweets(false); }
    };
    fetchSweets();
  }, []);

  const bannerImages = [
    { id: 'dryfruits', image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787928030/1787927127977_tfpbae.jpg', alt: 'Premium Dry Fruits Collection', link: '/shop' },
    { id: 'herbal', image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787928030/1787927127977_tfpbae.jpg', alt: 'Herbal & Natural Collection', link: '/herbal' },
    { id: 'mens-fashion', image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787928029/1787927127796_r6gpwk.jpg', alt: "Men's Fashion Collection", link: '/fashion?gender=men' },
    { id: 'womens-fashion', image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787928035/1787927127894_tf8wge.jpg', alt: "Women's Fashion Collection", link: '/fashion?gender=women' },
    { id: 'kids-fashion', image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787928033/1787927127833_unljm2.jpg', alt: "Kids Fashion Collection", link: '/fashion?gender=kids' },
    { id: 'sweets', image: 'https://res.cloudinary.com/kw3pdwrb/image/upload/v1787928037/1787927127742_eifbns.jpg', alt: 'Sweets & Chocolates Collection', link: '/sweets' },
  ];

  const sectionConfigs = [
    { id: 'dryfruits-section', banner: bannerImages[0], title: 'PREMIUM DRY FRUITS', subtitle: 'Handpicked quality from the finest farms', products: dryFruitsProducts, loading: loadingDryFruits, viewAllLink: '/shop', detailPathPrefix: '/dry-product' },
    { id: 'herbal-section', banner: bannerImages[1], title: 'HERBAL & NATURAL', subtitle: 'Pure wellness from nature', products: herbalProducts, loading: loadingHerbal, viewAllLink: '/herbal', detailPathPrefix: '/herbal' },
    { id: 'mens-fashion-section', banner: bannerImages[2], title: "MEN'S FASHION", subtitle: 'Sharp looks, timeless class', products: mensFashionProducts, loading: loadingMens, viewAllLink: '/fashion?gender=men', detailPathPrefix: '/fashion' },
    { id: 'womens-fashion-section', banner: bannerImages[3], title: "WOMEN'S FASHION", subtitle: 'Elegance & style for every occasion', products: womensFashionProducts, loading: loadingWomens, viewAllLink: '/fashion?gender=women', detailPathPrefix: '/fashion' },
    { id: 'kids-fashion-section', banner: bannerImages[4], title: "KIDS FASHION", subtitle: 'Playful styles for little stars', products: kidsFashionProducts, loading: loadingKids, viewAllLink: '/fashion?gender=kids', detailPathPrefix: '/fashion' },
    { id: 'sweets-section', banner: bannerImages[5], title: 'SWEETS & CHOCOLATES', subtitle: 'Delicious treats for every celebration', products: sweetsProducts, loading: loadingSweets, viewAllLink: '/sweets', detailPathPrefix: '/sweet-product' },
  ];

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] min-h-screen">

      {/* ============================================================
          CUSTOMER / SELLER CARDS — Smart
      ============================================================ */}
      <CustomerSellerCards
        isLoggedIn={isLoggedIn}
        sellerStatus={sellerStatus}
      />

      {/* HERO SECTION */}
      <section
        id="hero-section"
        className="relative w-full overflow-hidden bg-[#FFFDF7] dark:bg-[#111827] scroll-mt-[120px] sm:scroll-mt-[140px] md:scroll-mt-[160px]"
      >
        <div className="relative w-full max-w-[1500px] mx-auto px-3 sm:px-4 lg:px-6 py-2 md:py-4">
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-[#1F2937]">
            <div className="relative w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] xl:h-[500px] flex items-center justify-center overflow-hidden">
              <Link to={slides[currentSlide].link} className="block w-full h-full">
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].alt}
                  className="w-full h-full object-cover transition-all duration-700"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/1600x600/D4AF37/FFFFFF?text=Maha+One';
                  }}
                />
              </Link>
            </div>

            <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${index === currentSlide ? 'w-6 sm:w-8 lg:w-10 bg-[#D4AF37]' : 'w-1.5 sm:w-2 bg-white/60 hover:bg-[#D4AF37]/80'}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 sm:p-2.5 transition-all duration-300 backdrop-blur-sm z-10"
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 sm:p-2.5 transition-all duration-300 backdrop-blur-sm z-10"
              aria-label="Next slide"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <ShopByCategory />

      {/* CATEGORY SECTIONS */}
      {sectionConfigs.map((section, index) => (
        <div
          key={section.banner.id}
          id={section.id}
          className={`${index % 2 === 0 ? 'bg-[#F8FAFC] dark:bg-[#1F2937]' : 'bg-[#FFFDF7] dark:bg-[#111827]'} scroll-mt-[120px] sm:scroll-mt-[140px] py-4 sm:py-6`}
        >
          <div className="max-w-[1500px] mx-auto px-2.5 sm:px-4 lg:px-6 py-4 md:py-6">
            <CategoryHeroBanner image={section.banner.image} alt={section.banner.alt} link={section.banner.link} />
            <CategoryProductSection
              title={section.title}
              subtitle={section.subtitle}
              products={section.products}
              loading={section.loading}
              viewAllLink={section.viewAllLink}
              detailPathPrefix={section.detailPathPrefix}
            />
          </div>
        </div>
      ))}

      {/* TESTIMONIALS SLIDER */}
      <TestimonialsSlider />
    </div>
  );
};

export default HomePage;
// src/components/common/ProductCard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaShoppingCart,
} from 'react-icons/fa';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../../services/wishlistService';
import { useCart } from '../../context/CartContext';
import CloudinaryImage from './CloudinaryImage';

// ============================================================
// TYPES
// ============================================================
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    discountPrice?: number;
    discount?: number;
    image?: string | string[];
    images?: string[];
    stock: number;
    isNew?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    rating?: number;
    reviewCount?: number;
    category?: string;
    colors?: string[];
  };
  variant?: 'horizontal' | 'vertical' | 'vertical-compact';   // ✅ updated
  primaryColor?: string;
  secondaryColor?: string;
  detailPath?: string;
  badge?: 'NEW' | 'BEST SELLER' | 'FEATURED' | 'SALE' | null;
}

const COLOR_HEX_MAP: Record<string, string> = {
  'Red': '#EF4444', 'Blue': '#3B82F6', 'Green': '#22C55E',
  'Yellow': '#EAB308', 'Black': '#000000', 'White': '#FFFFFF',
  'Pink': '#EC4899', 'Gold': '#D4AF37', 'Silver': '#C0C0C0',
  'Brown': '#A16207', 'Grey': '#6B7280', 'Beige': '#F5F5DC',
  'Rose Gold': '#B76E79', 'Tan': '#D2B48C', 'Orange': '#F97316',
  'Purple': '#A855F7', 'Navy': '#000080', 'Teal': '#14B8A6',
  'Maroon': '#800000', 'Olive': '#808000', 'Peach': '#FFCBA4',
  'Lavender': '#E6E6FA', 'Mint': '#A7F3D0', 'Coral': '#FF7F50',
  'Cream': '#FFFDD0', 'Turquoise': '#40E0D0',
  'Lime': '#84CC16', 'Magenta': '#FF00FF', 'Ivory': '#FFFFF0',
  'Charcoal': '#36454F', 'Burgundy': '#800020', 'Mustard': '#FFDB58',
  'Champagne': '#F7E7CE', 'Sand': '#C2B280', 'Taupe': '#8B8589',
  'Copper': '#B87333', 'Bronze': '#CD7F32', 'Platinum': '#E5E4E2',
  'Sky Blue': '#87CEEB', 'Baby Pink': '#F4C2C2', 'Mint Green': '#98FB98',
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'horizontal',
  primaryColor = '#3B1E54',
  secondaryColor = '#D4AF37',
  detailPath,
  badge,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const userId = localStorage.getItem('userId') || 'guest';

  useEffect(() => {
    const check = async () => {
      if (userId !== 'guest') {
        try {
          const result = await isInWishlist(userId, product.id);
          setInWishlist(result);
        } catch (err) {
          console.error('Wishlist check error:', err);
        }
      }
    };
    check();
  }, [product.id, userId]);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (userId === 'guest') {
      alert('Please login to add items to wishlist');
      return;
    }

    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(userId, product.id);
        setInWishlist(false);
      } else {
        await addToWishlist(userId, product.id);
        setInWishlist(true);
      }
      window.dispatchEvent(new Event('wishlistUpdated'));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Wishlist error:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const getImage = (): string | string[] => {
    if (product.image) return product.image;
    if (product.images && product.images.length > 0) return product.images;
    return '/images/placeholder.jpg';
  };

  const getDiscountPercent = (): number | null => {
    if (product.discount && product.discount > 0) return product.discount;
    const oldP = product.oldPrice || product.price;
    const newP = product.discountPrice || product.price;
    if (oldP > newP) return Math.round(((oldP - newP) / oldP) * 100);
    return null;
  };

  const discountPercent = getDiscountPercent();
  const displayPrice = product.discountPrice || product.price;
  const oldPriceValue =
    product.oldPrice && product.oldPrice > displayPrice ? product.oldPrice : null;
  const isInStock = product.stock > 0;

  const autoBadge = (() => {
    if (badge !== undefined) return badge;
    if (product.isBestSeller) return 'BEST SELLER';
    if (product.isFeatured) return 'FEATURED';
    if (product.isNew) return 'NEW';
    return null;
  })();

  const productColors = product.colors || [];
  const colorsToShow = productColors.slice(0, 3);
  const extraColorsCount = Math.max(0, productColors.length - 3);

  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || 0;

  const goToDetail = () => {
    if (detailPath) navigate(detailPath);
    else navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInStock) {
      alert('❌ Out of stock');
      return;
    }

    addToCart({ ...product, price: displayPrice, quantity: 1 });
  };

  const getBadgeStyle = (badgeType: string) => {
    switch (badgeType) {
      case 'NEW': return { bg: '#22C55E' };
      case 'BEST SELLER': return { bg: '#7C3AED' };
      case 'FEATURED': return { bg: '#D4AF37' };
      case 'SALE': return { bg: '#EF4444' };
      default: return { bg: '#6B7280' };
    }
  };

  // ============================================================
  // HORIZONTAL
  // ============================================================
  if (variant === 'horizontal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        onClick={goToDetail}
        className="
          group cursor-pointer
          bg-white dark:bg-[#1F2937]
          rounded-2xl overflow-hidden
          border border-gray-100 dark:border-gray-700
          shadow-sm hover:shadow-xl
          transition-all duration-300
          flex
          h-[180px] sm:h-[200px]
        "
      >
        <div className="relative w-[40%] flex-shrink-0 overflow-hidden bg-gray-50 dark:bg-gray-800">
          <CloudinaryImage
            src={getImage()}
            alt={product.name}
            size="small"
            className="w-full h-full"
            lazy={true}
          />

          {autoBadge && (
            <div
              className="absolute top-2 left-2 sm:top-3 sm:left-3 text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full shadow-md uppercase tracking-wide"
              style={{ background: getBadgeStyle(autoBadge).bg }}
            >
              {autoBadge}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="
              font-semibold text-gray-900 dark:text-white
              text-sm sm:text-base leading-tight
              line-clamp-2
              group-hover:text-[#3B1E54] dark:group-hover:text-[#D4AF37]
              transition-colors pr-1
            ">
              {product.name}
            </h3>

            <button
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className="
                flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8
                rounded-full flex items-center justify-center
                hover:bg-gray-100 dark:hover:bg-gray-700
                transition-colors disabled:opacity-50
              "
              aria-label="Wishlist"
            >
              {inWishlist ? (
                <FaHeart className="text-red-500 text-sm sm:text-base" />
              ) : (
                <FaRegHeart className="text-gray-400 hover:text-red-500 text-sm sm:text-base transition-colors" />
              )}
            </button>
          </div>

          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center gap-1">
              <FaStar className="text-[#D4AF37] text-[10px] sm:text-xs" />
              <span className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                {rating.toFixed(1)}
              </span>
              {reviewCount > 0 && (
                <span className="text-[10px] sm:text-xs text-gray-400">
                  ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isInStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-[10px] sm:text-xs font-medium ${isInStock ? 'text-green-600' : 'text-red-500'}`}>
                {isInStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="mt-2">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Rs. {displayPrice.toLocaleString()}
              </span>
              {oldPriceValue && (
                <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                  Rs. {oldPriceValue.toLocaleString()}
                </span>
              )}
              {discountPercent && discountPercent > 0 && (
                <span className="
                  text-[9px] sm:text-[10px] font-bold
                  px-1.5 py-0.5 rounded-full
                  bg-pink-100 text-pink-600
                  dark:bg-pink-900/30 dark:text-pink-400
                ">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 mt-2">
              {colorsToShow.length > 0 ? (
                <div className="flex items-center gap-1">
                  {colorsToShow.map((color, idx) => {
                    const hex = COLOR_HEX_MAP[color] || '#D1D5DB';
                    return (
                      <span
                        key={idx}
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-gray-300 shadow-sm"
                        style={{ background: hex }}
                        title={color}
                      />
                    );
                  })}
                  {extraColorsCount > 0 && (
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium ml-0.5">
                      +{extraColorsCount}
                    </span>
                  )}
                </div>
              ) : (
                <span />
              )}

              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`
                  flex items-center gap-1.5
                  px-3 sm:px-4 py-1.5 sm:py-2 rounded-full
                  text-[11px] sm:text-xs font-semibold
                  transition-all duration-200 flex-shrink-0
                  ${isInStock ? 'text-white hover:shadow-lg hover:scale-105' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}
                `}
                style={isInStock ? { background: primaryColor } : undefined}
              >
                <FaShoppingCart className="text-[10px] sm:text-xs" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ============================================================
  // VERTICAL-COMPACT (Home page)
  // ============================================================
  if (variant === 'vertical-compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        onClick={goToDetail}
        className="
          group cursor-pointer flex flex-col
          bg-white dark:bg-[#1F2937]
          rounded-xl overflow-hidden
          border border-gray-100 dark:border-gray-700
          shadow-sm hover:shadow-lg
          transition-all duration-300
          h-full
        "
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <CloudinaryImage
            src={getImage()}
            alt={product.name}
            size="small"
            className="w-full h-full"
          />

          {/* Badge — TOP LEFT */}
          {discountPercent && discountPercent > 0 ? (
            <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-md z-10">
              -{discountPercent}%
            </div>
          ) : autoBadge ? (
            <div
              className="absolute top-1.5 left-1.5 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-md uppercase tracking-wide z-10"
              style={{ background: getBadgeStyle(autoBadge).bg }}
            >
              {autoBadge}
            </div>
          ) : null}

          {/* Wishlist — TOP RIGHT */}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className="
              absolute top-1.5 right-1.5
              w-6 h-6 rounded-full
              bg-white/95 backdrop-blur-sm
              flex items-center justify-center
              shadow-md
              hover:bg-red-500 hover:text-white
              transition-colors
              disabled:opacity-50
              z-10
            "
            aria-label="Wishlist"
          >
            {inWishlist ? (
              <FaHeart className="text-red-500 text-[10px]" />
            ) : (
              <FaRegHeart className="text-gray-600 text-[10px]" />
            )}
          </button>

          {!isInStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
              <span className="bg-white text-gray-800 text-[9px] font-bold px-2 py-1 rounded-full">
                Out
              </span>
            </div>
          )}
        </div>

        <div className="p-2 flex flex-col gap-1 flex-1">
          <h3 className="
            font-medium text-gray-900 dark:text-white
            text-[11px] sm:text-xs
            leading-tight
            line-clamp-2
            min-h-[2rem]
            group-hover:text-[#3B1E54] dark:group-hover:text-[#D4AF37]
            transition-colors
          ">
            {product.name}
          </h3>

          <div className="flex items-center gap-1">
            <FaStar className="text-[#D4AF37] text-[9px]" />
            <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
              {rating.toFixed(1)}
            </span>
            {reviewCount > 0 && (
              <span className="text-[9px] text-gray-400">({reviewCount})</span>
            )}
          </div>

          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-[#3B1E54] dark:text-white">
              Rs. {displayPrice.toLocaleString()}
            </span>
            {oldPriceValue && (
              <span className="text-[9px] text-gray-400 line-through">
                Rs. {oldPriceValue.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`
              w-full mt-auto pt-0.5
              flex items-center justify-center gap-1
              px-2 py-1.5 rounded-full
              text-[10px] font-semibold
              transition-all duration-200
              ${
                isInStock
                  ? 'text-white hover:shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
            style={isInStock ? { background: primaryColor } : undefined}
          >
            <FaShoppingCart className="text-[9px]" />
            <span>{isInStock ? 'Add' : 'Sold'}</span>
          </button>
        </div>
      </motion.div>
    );
  }

  // ============================================================
  // VERTICAL (legacy)
  // ============================================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={goToDetail}
      className="
        group cursor-pointer flex flex-col
        bg-white dark:bg-[#1F2937]
        rounded-2xl overflow-hidden
        border border-gray-100 dark:border-gray-700
        shadow-sm hover:shadow-xl transition-all duration-300
        h-full
      "
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <CloudinaryImage src={getImage()} alt={product.name} size="small" className="w-full h-full" />

        {discountPercent && discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
            -{discountPercent}%
          </div>
        )}

        {autoBadge && !discountPercent && (
          <div
            className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md"
            style={{ background: getBadgeStyle(autoBadge).bg }}
          >
            {autoBadge}
          </div>
        )}

        <button
          onClick={handleWishlist}
          disabled={wishlistLoading}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all duration-200 text-gray-700 disabled:opacity-50"
        >
          {inWishlist ? <FaHeart className="text-red-500 text-sm" /> : <FaRegHeart className="text-sm" />}
        </button>

        {!isInStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
            <span className="bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 sm:mt-4 flex flex-col gap-1 p-3 sm:p-4 flex-1">
        <h3 className="text-sm sm:text-base font-medium text-gray-800 dark:text-white line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1">
          <FaStar className="text-[#D4AF37] text-xs" />
          <span className="text-xs text-gray-700 dark:text-gray-300">{rating.toFixed(1)}</span>
          {reviewCount > 0 && <span className="text-xs text-gray-400">({reviewCount})</span>}
        </div>

        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[#E8604C] font-bold text-base sm:text-lg">
            Rs. {displayPrice.toLocaleString()}
          </span>
          {oldPriceValue && (
            <span className="text-gray-400 line-through text-xs sm:text-sm">
              Rs. {oldPriceValue.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
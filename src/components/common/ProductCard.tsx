import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../../services/wishlistService';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: string[];
    stock: number;
    rating?: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId') || 'guest';

  // ✅ Check if in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (userId !== 'guest') {
        const result = await isInWishlist(userId, product.id);
        setInWishlist(result);
      }
    };
    checkWishlist();
  }, [product.id, userId]);

  // ✅ Toggle Wishlist
  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (userId === 'guest') {
      alert('Please login to add items to wishlist');
      return;
    }

    setLoading(true);

    try {
      if (inWishlist) {
        await removeFromWishlist(userId, product.id);
        setInWishlist(false);
        // ✅ Trigger event for navbar update
        window.dispatchEvent(new Event('wishlistUpdated'));
        window.dispatchEvent(new Event('storage'));
      } else {
        await addToWishlist(userId, product.id);
        setInWishlist(true);
        // ✅ Trigger event for navbar update
        window.dispatchEvent(new Event('wishlistUpdated'));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition group overflow-hidden">
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block relative">
        <img
          src={product.images?.[0] || '/images/placeholder.jpg'}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
        />
        
        {/* ✅ Wishlist Button */}
        <button
          onClick={handleWishlist}
          disabled={loading}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:shadow-xl transition disabled:opacity-50"
        >
          {inWishlist ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-600 text-lg hover:text-red-500 transition" />
          )}
        </button>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-[#D4AF37] transition line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-2">
          {product.discountPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#D4AF37]">
                Rs. {product.discountPrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-[#D4AF37]">
              Rs. {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {product.rating && (
          <div className="flex items-center gap-1 mt-1">
            <FaStar className="text-[#D4AF37] text-sm" />
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
        )}

        <button 
          className="w-full mt-3 bg-[#0F766E] text-white py-2 rounded-lg hover:bg-[#065F46] transition font-medium"
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
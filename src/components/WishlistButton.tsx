import React, { useState, useEffect } from 'react';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../services/wishlistService';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface WishlistButtonProps {
  productId: string;
  userId: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, userId }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ✅ Check if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (userId && userId !== 'guest') {
        const result = await isInWishlist(userId, productId);
        setInWishlist(result);
      }
    };
    checkWishlist();
  }, [userId, productId]);

  // ✅ Toggle Wishlist
  const handleToggle = async () => {
    if (!userId || userId === 'guest') {
      alert('Please login to add items to wishlist');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (inWishlist) {
        const result = await removeFromWishlist(userId, productId);
        if (result.success) {
          setInWishlist(false);
          setMessage('❌ Removed from wishlist');
        } else {
          setMessage(result.message);
        }
      } else {
        const result = await addToWishlist(userId, productId);
        if (result.success) {
          setInWishlist(true);
          setMessage('❤️ Added to wishlist');
        } else {
          setMessage(result.message);
        }
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`wishlist-btn transition-all duration-300 ${
          inWishlist 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-400 hover:text-red-500'
        }`}
      >
        {inWishlist ? (
          <FaHeart className="text-2xl animate-pulse" />
        ) : (
          <FaRegHeart className="text-2xl hover:scale-110 transition-transform" />
        )}
      </button>
      
      {message && (
        <div className={`absolute top-full mt-2 text-sm whitespace-nowrap ${
          inWishlist ? 'text-green-500' : 'text-red-500'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default WishlistButton;
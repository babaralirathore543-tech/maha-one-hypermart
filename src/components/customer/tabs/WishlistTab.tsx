// src/components/customer/tabs/WishlistTab.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaSpinner, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import {
  getWishlistWithDetails,
  removeFromWishlist,
} from '../../../services/wishlistService';
import CloudinaryImage from '../../common/CloudinaryImage';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string | string[];
  images?: string[];
  category?: string;
  stock?: number;
}

const WishlistTab = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch from the real service
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const products = await getWishlistWithDetails(userId);
        setItems(products as WishlistItem[]);
      } catch (error) {
        console.error('❌ Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();

    // ✅ Refresh when wishlist changes elsewhere
    const handleUpdate = () => {
      if (!userId) return;
      getWishlistWithDetails(userId).then((products) => {
        setItems(products as WishlistItem[]);
      });
    };

    window.addEventListener('wishlistUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [userId]);

  // ✅ Remove via service (correct path)
  const handleRemove = async (id: string) => {
    if (!userId) return;
    if (!window.confirm('Remove from wishlist?')) return;

    // Optimistic update
    setItems((prev) => prev.filter((item) => item.id !== id));

    try {
      const result = await removeFromWishlist(userId, id);
      if (!result.success) {
        // Rollback on failure
        const products = await getWishlistWithDetails(userId);
        setItems(products as WishlistItem[]);
        alert('❌ Failed to remove: ' + result.message);
      } else {
        // ✅ Notify Navbar/other tabs
        window.dispatchEvent(new Event('wishlistUpdated'));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error: any) {
      alert('❌ Failed: ' + error.message);
    }
  };

  // ✅ Build correct detail route based on category
  const getDetailPath = (item: WishlistItem): string => {
    switch (item.category) {
      case 'fashion':
        return `/fashion/${item.id}`;
      case 'sweets':
        return `/sweet-product/${item.id}`;
      case 'dryfruits':
      case 'dry-fruits':
        return `/dry-product/${item.id}`;
      case 'cakes':
        return `/cakes/${item.id}`;
      case 'herbal':
        return `/herbal/${item.id}`;
      default:
        return `/product/${item.id}`;
    }
  };

  // ✅ Get image URL from either `image` or `images[0]`
  const getImageUrl = (item: WishlistItem): string => {
    if (typeof item.image === 'string') return item.image;
    if (Array.isArray(item.image) && item.image.length > 0) return item.image[0];
    if (item.images && item.images.length > 0) return item.images[0];
    return '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-[#0F766E]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          ❤️ Wishlist
        </h2>
        <span className="text-xs sm:text-sm text-gray-500">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <FaHeart className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Your wishlist is empty</p>
          <button
            onClick={() => navigate('/')}
            className="mt-3 text-[#0F766E] hover:underline text-sm font-medium"
          >
            Browse Products →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => {
            const imgUrl = getImageUrl(item);
            return (
              <div
                key={item.id}
                className="border rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition"
              >
                {imgUrl ? (
                  <CloudinaryImage
                    src={imgUrl}
                    alt={item.name}
                    size="thumbnail"
                    className="w-20 h-20 rounded flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <FaHeart className="text-gray-300" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-[#0F766E] font-bold">
                    Rs. {(item.price || 0).toLocaleString()}
                  </p>

                  {typeof item.stock === 'number' && (
                    <p
                      className={`text-xs mt-1 ${
                        item.stock > 0 ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {item.stock > 0 ? '✅ In Stock' : '❌ Out of Stock'}
                    </p>
                  )}

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => navigate(getDetailPath(item))}
                      className="text-xs bg-[#0F766E] text-white px-3 py-1 rounded hover:bg-[#065F46] transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-xs text-red-500 hover:underline flex items-center gap-1"
                    >
                      <FaTrash size={10} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
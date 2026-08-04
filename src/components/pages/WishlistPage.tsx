import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlistWithDetails, removeFromWishlist } from '../../services/wishlistService';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  description: string;
}

const WishlistPage: React.FC = () => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId') || 'guest';

  // ✅ Load Wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const products = await getWishlistWithDetails(userId);
        setWishlistProducts(products as Product[]);
        console.log('✅ Wishlist Products:', products);
      } catch (error) {
        console.error('❌ Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId !== 'guest') {
      loadWishlist();
    } else {
      setLoading(false);
    }
  }, [userId]);

  // ✅ Remove from Wishlist
  const handleRemove = async (productId: string) => {
    try {
      const result = await removeFromWishlist(userId, productId);
      if (result.success) {
        setWishlistProducts(wishlistProducts.filter(p => p.id !== productId));
        
        // ✅ Trigger wishlist update event
        window.dispatchEvent(new Event('wishlistUpdated'));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // ✅ Add to Cart
  const handleAddToCart = (product: Product) => {
    // TODO: Implement add to cart
    alert(`🛒 Added ${product.name} to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FFFDF7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#D4AF37] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-[#FFFDF7] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">
            ❤️ My Wishlist
          </h1>
          <p className="text-gray-600 mt-1">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        {wishlistProducts.length > 0 && (
          <button
            onClick={async () => {
              if (window.confirm('Clear all items from wishlist?')) {
                // Implement clear wishlist
                window.dispatchEvent(new Event('wishlistUpdated'));
              }
            }}
            className="text-red-500 hover:text-red-600 text-sm font-medium transition"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Empty State */}
      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-semibold text-gray-700">Your wishlist is empty</h2>
          <p className="text-gray-500 mt-2">Start adding your favorite products!</p>
          <Link 
            to="/shop" 
            className="inline-block mt-6 bg-[#D4AF37] text-white px-8 py-3 rounded-full hover:bg-[#b8941f] transition shadow-lg"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition group overflow-hidden">
              {/* Product Image */}
              <Link to={`/product/${product.id}`} className="block relative">
                <img
                  src={product.images?.[0] || '/images/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                />
                {/* Heart icon overlay */}
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur p-2 rounded-full shadow-lg">
                  <FaHeart className="text-red-500" />
                </div>
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

                {/* Stock Status */}
                <div className="mt-1">
                  <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? '✅ In Stock' : '❌ Out of Stock'}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1 ${
                      product.stock > 0
                        ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <FaShoppingCart size={14} />
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="px-3 py-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                    title="Remove from wishlist"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
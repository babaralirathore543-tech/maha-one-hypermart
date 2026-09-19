// src/components/pages/WishlistPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import {
  getWishlistWithDetails,
  removeFromWishlist,
} from '../../services/wishlistService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import CloudinaryImage from '../common/CloudinaryImage';

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image?: string | string[];
  images?: string[];
  stock?: number;
  description?: string;
  category?: string;
}

const WishlistPage = () => {
  const { userId, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load Wishlist from service
  useEffect(() => {
    if (authLoading) return;

    if (!userId) {
      setLoading(false);
      return;
    }

    const loadWishlist = async () => {
      try {
        const products = await getWishlistWithDetails(userId);
        setWishlistProducts(products as Product[]);
      } catch (error) {
        console.error('❌ Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();

    const handleUpdate = () => {
      if (!userId) return;
      getWishlistWithDetails(userId).then((products) => {
        setWishlistProducts(products as Product[]);
      });
    };

    window.addEventListener('wishlistUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [userId, authLoading]);

  // ✅ Remove via service
  const handleRemove = async (productId: string) => {
    if (!userId) return;
    if (!window.confirm('Remove from wishlist?')) return;

    // Optimistic
    setWishlistProducts((prev) => prev.filter((p) => p.id !== productId));

    try {
      const result = await removeFromWishlist(userId, productId);
      if (result.success) {
        window.dispatchEvent(new Event('wishlistUpdated'));
        window.dispatchEvent(new Event('storage'));
      } else {
        // Rollback
        const products = await getWishlistWithDetails(userId);
        setWishlistProducts(products as Product[]);
        alert('❌ Failed to remove: ' + result.message);
      }
    } catch (error: any) {
      alert('❌ Error: ' + error.message);
    }
  };

  // ✅ Add to Cart via context
  const handleAddToCart = (product: Product) => {
    if (!product.stock || product.stock === 0) {
      alert('❌ Out of stock');
      return;
    }

    addToCart({
      ...product,
      price: product.discountPrice || product.price,
      quantity: 1,
    });
    alert(`🛒 ${product.name} added to cart!`);
  };

  // ✅ Category-aware detail path
  const getDetailPath = (product: Product): string => {
    switch (product.category) {
      case 'fashion':
        return `/fashion/${product.id}`;
      case 'sweets':
        return `/sweet-product/${product.id}`;
      case 'dryfruits':
      case 'dry-fruits':
        return `/dry-product/${product.id}`;
      case 'cakes':
        return `/cakes/${product.id}`;
      case 'herbal':
        return `/herbal/${product.id}`;
      default:
        return `/product/${product.id}`;
    }
  };

  // ✅ Resolve image URL
  const getImageUrl = (product: Product): string => {
    if (typeof product.image === 'string') return product.image;
    if (Array.isArray(product.image) && product.image.length > 0)
      return product.image[0];
    if (product.images && product.images.length > 0) return product.images[0];
    return '';
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FFFDF7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#D4AF37] mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!userId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 bg-[#FFFDF7] min-h-screen text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-semibold text-gray-700">
          Please login to view your wishlist
        </h2>
        <Link
          to="/login"
          className="inline-block mt-6 bg-[#D4AF37] text-white px-8 py-3 rounded-full hover:bg-[#b8941f] transition shadow-lg"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-[#FFFDF7] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">❤️ My Wishlist</h1>
          <p className="text-gray-600 mt-1">
            {wishlistProducts.length}{' '}
            {wishlistProducts.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      {/* Empty State */}
      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-semibold text-gray-700">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 mt-2">
            Start adding your favorite products!
          </p>
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
          {wishlistProducts.map((product) => {
            const imgUrl = getImageUrl(product);
            const finalPrice = product.discountPrice || product.price;
            const hasDiscount =
              product.discountPrice && product.discountPrice < product.price;

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition group overflow-hidden"
              >
                {/* Image */}
                <Link to={getDetailPath(product)} className="block relative">
                  {imgUrl ? (
                    <CloudinaryImage
                      src={imgUrl}
                      alt={product.name}
                      size="small"
                      className="w-full h-56"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
                      <FaHeart className="text-gray-300 text-3xl" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-white/80 backdrop-blur p-2 rounded-full shadow-lg">
                    <FaHeart className="text-red-500" />
                  </div>
                </Link>

                {/* Info */}
                <div className="p-4">
                  <Link to={getDetailPath(product)}>
                    <h3 className="font-semibold text-gray-800 hover:text-[#D4AF37] transition line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-2">
                    {hasDiscount ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-[#D4AF37]">
                          Rs. {finalPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          Rs. {product.price.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-[#D4AF37]">
                        Rs. {finalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Stock */}
                  {typeof product.stock === 'number' && (
                    <div className="mt-1">
                      <span
                        className={`text-xs font-medium ${
                          product.stock > 0
                            ? 'text-green-600'
                            : 'text-red-500'
                        }`}
                      >
                        {product.stock > 0
                          ? '✅ In Stock'
                          : '❌ Out of Stock'}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1 ${
                        product.stock && product.stock > 0
                          ? 'bg-[#0F766E] text-white hover:bg-[#065F46]'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <FaShoppingCart size={14} />
                      {product.stock && product.stock > 0
                        ? 'Add to Cart'
                        : 'Out of Stock'}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
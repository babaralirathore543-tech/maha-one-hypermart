import React from 'react';
import { Link } from 'react-router-dom';
import WishlistButton from './WishlistButton';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: string[];
    stock: number;
  };
  userId: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, userId }) => {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
      {/* Product Image */}
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images?.[0] || '/images/placeholder.jpg'}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </Link>
        
        {/* ✅ Wishlist Button */}
        <div className="absolute top-2 right-2">
          <WishlistButton 
            productId={product.id} 
            userId={userId}
          />
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold hover:text-blue-600 transition">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-2">
          {product.discountPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">
                Rs. {product.discountPrice.toLocaleString()}
              </span>
              <span className="text-gray-400 line-through text-sm">
                Rs. {product.price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-blue-600">
              Rs. {product.price.toLocaleString()}
            </span>
          )}
        </div>
        
        <button 
          className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
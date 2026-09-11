// src/pages/public/StorePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Star, ShoppingBag } from 'lucide-react';

const StorePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);

  // Mock store data
  const store = {
    name: 'ABC Fashion Store',
    description: 'Premium quality fashion products for men and women.',
    logo: 'https://via.placeholder.com/120',
    banner: 'https://via.placeholder.com/1200x300',
    address: 'Shop #12, Main Boulevard, Lahore',
    city: 'Lahore',
    phone: '0300-1234567',
    email: 'store@abcfashion.com',
    rating: 4.8,
    totalReviews: 156,
    products: [
      { id: 1, name: 'Premium Ladies Suit', price: 2500, image: 'https://via.placeholder.com/200' },
      { id: 2, name: 'Men\'s Formal Shirt', price: 1800, image: 'https://via.placeholder.com/200' },
      { id: 3, name: 'Kids Party Wear', price: 1200, image: 'https://via.placeholder.com/200' },
    ],
  };

  useEffect(() => {
    // Fetch store data
    setTimeout(() => setLoading(false), 1000);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative bg-gradient-to-r from-[#0F766E] to-[#065F46] h-64 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative text-center text-white">
          <img
            src={store.logo}
            alt={store.name}
            className="w-24 h-24 rounded-full border-4 border-white mx-auto mb-4 object-cover"
          />
          <h1 className="text-3xl font-bold">{store.name}</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex items-center">
              <Star className="fill-yellow-400 text-yellow-400" size={18} />
              <span className="ml-1 font-semibold">{store.rating}</span>
              <span className="text-sm text-white/70 ml-1">({store.totalReviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <p className="text-gray-600">{store.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <span className="text-sm">{store.address}, {store.city}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={16} />
              <span className="text-sm">{store.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={16} />
              <span className="text-sm">{store.email}</span>
            </div>
          </div>
        </div>

        {/* Products */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {store.products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                <p className="text-lg font-bold text-[#0F766E] mt-1">Rs. {product.price}</p>
                <button className="w-full mt-3 bg-[#0F766E] text-white py-2 rounded-lg hover:bg-[#065F46] transition-colors flex items-center justify-center gap-2">
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
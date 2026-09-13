// src/components/pages/HerbalPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // ✅ Added for navigation
import { collection, query, where, getDocs } from 'firebase/firestore';

// ✅ CORRECT PATH
import { db } from '../../config/firebase';

import { FaLeaf, FaSpinner } from 'react-icons/fa';

const HerbalPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('category', '==', 'herbal'),
          where('status', '==', 'active')
        );
        const snapshot = await getDocs(q);
        setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <FaLeaf className="text-5xl text-emerald-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800">Herbal & Natural</h1>
          <p className="text-gray-500 mt-2">100% Natural Products for Healthy Living</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <FaLeaf className="text-6xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">No herbal products yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <img src={product.image} alt={product.name}
                  className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{product.shortDescription}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-emerald-600">Rs. {product.price}</span>
                    {product.oldPrice > 0 && (
                      <span className="text-sm text-gray-400 line-through">Rs. {product.oldPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HerbalPage;
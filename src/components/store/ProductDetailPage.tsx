// src/components/store/ProductDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ArrowLeft, ShoppingCart, Store } from 'lucide-react';
import CloudinaryImage from '../common/CloudinaryImage';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const productSnap = await getDoc(doc(db, 'products', id));
        if (!productSnap.exists()) {
          setLoading(false);
          return;
        }

        const productData: any = { id: productSnap.id, ...productSnap.data() };
        setProduct(productData);

        if (productData.sellerId) {
          const storeSnap = await getDoc(doc(db, 'stores', productData.sellerId));
          if (storeSnap.exists()) {
            setStore(storeSnap.data());
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-300 mb-2">404</h1>
          <p className="text-gray-500">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Image */}
            <div>
              {/* ✅ CloudinaryImage use karo */}
              <CloudinaryImage
                src={product.image || product.images}
                alt={product.name}
                size="large"
                className="w-full h-96 object-cover rounded-xl"
                lazy={false}
              />
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {store && (
                <button
                  onClick={() => navigate(`/store/${store.slug}`)}
                  className="inline-flex items-center gap-2 text-sm text-[#0F766E] hover:text-[#065F46] mb-3 w-fit"
                >
                  <Store size={16} />
                  <span className="font-medium">Visit {store.storeName}</span>
                </button>
              )}

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>

              {product.brand && (
                <p className="text-sm text-gray-500 mb-2">Brand: {product.brand}</p>
              )}

              <p className="text-2xl font-bold text-[#0F766E] mb-4">
                Rs. {product.price?.toLocaleString()}
              </p>

              {product.shortDescription && (
                <p className="text-gray-600 mb-4">{product.shortDescription}</p>
              )}

              <p className="text-sm text-gray-500 mb-4">
                {product.stock > 0 ? `✅ In Stock (${product.stock})` : '❌ Out of Stock'}
              </p>

              <button
                disabled={!product.stock}
                className="bg-[#0F766E] text-white py-3 rounded-lg font-semibold hover:bg-[#065F46] transition disabled:opacity-50 flex items-center justify-center gap-2 mt-auto"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Category-specific fields */}
          {product.category === 'fashion' && (
            <div className="border-t border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Fashion Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.gender && <p><span className="text-gray-500">For:</span> {product.gender}</p>}
                {product.material && <p><span className="text-gray-500">Material:</span> {product.material}</p>}
                {product.style && <p><span className="text-gray-500">Style:</span> {product.style}</p>}
              </div>
            </div>
          )}

          {product.category === 'dryfruits' && (
            <div className="border-t border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Product Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.origin && <p><span className="text-gray-500">Origin:</span> {product.origin}</p>}
                {product.shelfLife && <p><span className="text-gray-500">Shelf Life:</span> {product.shelfLife}</p>}
              </div>
            </div>
          )}

          {product.category === 'sweets' && (
            <div className="border-t border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Sweet Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.flavor && <p><span className="text-gray-500">Flavor:</span> {product.flavor}</p>}
                {product.weight && <p><span className="text-gray-500">Weight:</span> {product.weight}</p>}
                {product.shelfLife && <p><span className="text-gray-500">Shelf Life:</span> {product.shelfLife}</p>}
              </div>
            </div>
          )}

          {product.category === 'cakes' && (
            <div className="border-t border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Cake Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.cakeDetails?.flavor && <p><span className="text-gray-500">Flavor:</span> {product.cakeDetails.flavor}</p>}
                {product.cakeDetails?.weight && <p><span className="text-gray-500">Weight:</span> {product.cakeDetails.weight}</p>}
                {product.cakeDetails?.shape && <p><span className="text-gray-500">Shape:</span> {product.cakeDetails.shape}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
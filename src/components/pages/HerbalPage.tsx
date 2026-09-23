// src/components/pages/HerbalPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSpinner, FaLeaf } from 'react-icons/fa';
import { db, collection, getDocs } from '../../config/firebase';
import ProductCard from '../common/ProductCard';

interface HerbalProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  category: string;
  subCategory: string;
  productType?: string;
  image: string;
  images: string[];
  stock: number;
  shortDescription?: string;
  description?: string;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  isOrganic?: boolean;
  isNatural?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isHalal?: boolean;
  weight?: string;
  weightUnit?: string;
  origin?: string;
  colors?: string[];
}

const HerbalPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<HerbalProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHerbal = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'products'));

        const allProducts: HerbalProduct[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          // ✅ STATUS FILTER — sirf active/approved
          const isActive =
            data.status === 'active' || data.approvalStatus === 'approved';
          if (!isActive) return;

          if (data.category === 'herbal') {
            allProducts.push({
              id: doc.id,
              name: data.name || 'Unnamed',
              price: data.price || 0,
              oldPrice: data.oldPrice || 0,
              discount: data.discount || 0,
              rating: data.rating || 4.5,
              category: data.category || 'herbal',
              subCategory: data.subCategory || 'Herbal',
              productType: data.productType || '',
              image: data.image || data.images?.[0] || '',
              images: data.images || [],
              stock: data.stock || 0,
              shortDescription: data.shortDescription || '',
              description: data.description || '',
              isNew: data.isNew || false,
              isFeatured: data.isFeatured || false,
              isBestSeller: data.isBestSeller || false,
              isOnSale: data.isOnSale || false,
              isOrganic: data.isOrganic || false,
              isNatural: data.isNatural !== false,
              isVegan: data.isVegan || false,
              isGlutenFree: data.isGlutenFree || false,
              isHalal: data.isHalal !== false,
              weight: data.weight || '',
              weightUnit: data.weightUnit || 'g',
              origin: data.origin || '',
              colors: data.colors || [],
            });
          }
        });

        setProducts(allProducts);
      } catch (error) {
        console.error('❌ Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHerbal();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FFFDF7] dark:bg-[#111827]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#D4AF37] mx-auto" />
          <p className="mt-4 text-gray-500">Loading herbal products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF7] dark:bg-[#111827] pt-16 sm:pt-6 md:pt-8 pb-6 sm:pb-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-[#0F766E] hover:text-[#D4AF37] transition text-sm"
            >
              <FaArrowLeft /> Back
            </button>
            <span className="text-gray-300">|</span>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaLeaf className="text-[#0F766E]" />
                <span className="text-[#0F766E]">Herbal</span> & Natural
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {products.length} products available
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          100% Natural herbal products for healthy living. Sourced from organic farms, packed with nature's goodness.
        </p>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm">
            <FaLeaf className="text-5xl text-gray-200 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">No Herbal Products Yet</h3>
            <p className="text-gray-400 text-sm mt-1">Check back later for new products</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    oldPrice: product.oldPrice,
                    discount: product.discount,
                    image: product.image,
                    images: product.images,
                    stock: product.stock,
                    isNew: product.isNew,
                    isFeatured: product.isFeatured,
                    isBestSeller: product.isBestSeller,
                    rating: product.rating || 4.5,
                    reviewCount: 0,
                    category: 'herbal',
                    colors: product.colors || [],
                  }}
                  variant="horizontal"
                  primaryColor="#3B1E54"
                  secondaryColor="#D4AF37"
                  detailPath={`/herbal/${product.id}`}
                />
              </motion.div>
            ))}
          </div>
        )}

        {products.length > 0 && (
          <div className="text-center text-xs text-gray-400 mt-6">
            Showing {products.length} herbal products
          </div>
        )}
      </div>
    </div>
  );
};

export default HerbalPage;
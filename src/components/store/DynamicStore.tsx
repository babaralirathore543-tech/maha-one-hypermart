// src/components/store/DynamicStore.tsx
import React, { useEffect, useState } from 'react';
import { StoreData } from '../../hooks/useStoreConfig';
import { db, collection, query, where, getDocs } from '../../config/firebase';

import StoreHeader from './StoreHeader';
import HeroSection from './HeroSection';
import CategorySection from './CategorySection';
import ProductGrid from './ProductGrid';
import AboutSection from './AboutSection';
import StoreFooter from './StoreFooter';

interface Props {
  store: StoreData;
}

const DynamicStore = ({ store }: Props) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔍 Fetching products for sellerId:', store.sellerId);

        const q = query(
          collection(db, 'products'),
          where('sellerId', '==', store.sellerId),
          where('status', '==', 'active')       // ✅ SIRF ACTIVE PRODUCTS
        );
        const snap = await getDocs(q);

        console.log('📦 Products found:', snap.size);

        const items: any[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          console.log('📄 Product:', doc.id, data.name, data.status);
          items.push({ id: doc.id, ...data });
        });

        setProducts(items);
      } catch (error) {
        console.error('❌ Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [store.sellerId]);

  const sectionMap: Record<string, React.ReactNode> = {
    categories: <CategorySection key="categories" store={store} products={products} />,
    newArrivals: <ProductGrid key="newArrivals" title="New Arrivals" store={store} products={products.slice(0, 8)} />,
    featuredProducts: <ProductGrid key="featured" title="Featured Products" store={store} products={products.slice(0, 4)} />,
    bestSellers: <ProductGrid key="best" title="Best Sellers" store={store} products={products.slice(0, 6)} />,
    about: <AboutSection key="about" store={store} />,
    reviews: null,
  };

  return (
    <div style={{ background: store.colors.background }}>
      <StoreHeader store={store} />
      <HeroSection store={store} />

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading products...</p>
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available yet.</p>
        </div>
      )}

      {store.sections.map((sectionKey) => sectionMap[sectionKey] || null)}

      <StoreFooter store={store} />
    </div>
  );
};

export default DynamicStore;
// src/components/store/CategorySection.tsx
import React from 'react';
import { StoreData } from '../../hooks/useStoreConfig';

interface Props {
  store: StoreData;
  products: any[];
}

const CategorySection = ({ store, products }: Props) => {
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  if (categories.length === 0) return null;

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6" style={{ color: store.colors.primary }}>
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={String(cat)}
            className="p-6 rounded-xl text-center cursor-pointer hover:shadow-lg transition"
            style={{ background: store.colors.primary + '10' }}
          >
            <p className="font-medium" style={{ color: store.colors.primary }}>
              {String(cat)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
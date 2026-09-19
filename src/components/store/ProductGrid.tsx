// src/components/store/ProductGrid.tsx
import React from 'react';
import { StoreData } from '../../hooks/useStoreConfig';
import ProductCard from '../common/ProductCard';

interface Props {
  store: StoreData;
  products: any[];
  title: string;
}

const ProductGrid = ({ store, products, title }: Props) => {
  if (products.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-8 sm:mb-10">
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: store.colors.primary }}
        >
          {title}
        </h2>
        <div
          className="h-1 w-16 mt-2 rounded-full"
          style={{ background: store.colors.secondary }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-7">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            primaryColor={store.colors.primary}
            secondaryColor={store.colors.secondary}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
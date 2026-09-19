// src/components/store/StoreHeader.tsx
import React from 'react';
import { StoreData } from '../../hooks/useStoreConfig';
import { ShoppingCart, Search } from 'lucide-react';

interface Props {
  store: StoreData;
}

const StoreHeader = ({ store }: Props) => {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {store.logo && (
            <img src={store.logo} alt={store.storeName} className="w-10 h-10 rounded" />
          )}
          <h1 className="text-xl font-bold" style={{ color: store.colors.primary }}>
            {store.storeName}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Search size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default StoreHeader;
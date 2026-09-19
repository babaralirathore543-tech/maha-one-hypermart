// src/components/pages/PublicStorePage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useStoreBySlug } from '../../hooks/useStoreConfig';           // ✅ 2 levels up
import DynamicStore from '../store/DynamicStore';                       // ✅ 1 level up

const PublicStorePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { store, loading, error } = useStoreBySlug(slug || '');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E]" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
          <p className="text-gray-500">Store not found</p>
        </div>
      </div>
    );
  }

  return <DynamicStore store={store} />;
};

export default PublicStorePage;
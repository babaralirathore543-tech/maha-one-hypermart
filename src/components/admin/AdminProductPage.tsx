// src/components/admin/AdminProductPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../products/ProductForm';

const AdminProductPage = () => {
  const { category, id } = useParams<{ category?: string; id?: string }>();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <ProductForm
        mode="admin"
        categoryId={category || 'fashion'}
        productId={id}
        onSuccess={() => navigate('/admin/products')}
      />
    </div>
  );
};

export default AdminProductPage;
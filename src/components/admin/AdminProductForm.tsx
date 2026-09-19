// src/components/admin/AdminProductForm.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../products/ProductForm';

const AdminProductForm: React.FC = () => {
  const { category, id } = useParams<{ category?: string; id?: string }>();
  const navigate = useNavigate();

  if (!category) {
    navigate('/admin/products/add');
    return null;
  }

  return (
    <div className="p-4 sm:p-6">
      <ProductForm
        mode="admin"
        categoryId={category}
        productId={id}
        onSuccess={() => navigate('/admin')}
      />
    </div>
  );
};

export default AdminProductForm;
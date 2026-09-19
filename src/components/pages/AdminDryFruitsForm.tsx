// src/components/pages/AdminDryFruitsForm.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../products/ProductForm';

const AdminDryFruitsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <ProductForm
        mode="admin"
        categoryId="dryfruits"
        productId={id}
        onSuccess={() => navigate('/admin/products')}
      />
    </div>
  );
};

export default AdminDryFruitsForm;
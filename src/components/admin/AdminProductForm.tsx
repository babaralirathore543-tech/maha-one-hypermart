// src/components/admin/AdminProductForm.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../products/UniversalProductForm';

const AdminProductForm: React.FC = () => {
  const { category, id } = useParams<{ category?: string; id?: string }>();
  const navigate = useNavigate();

  // ✅ Redirect if no category
  useEffect(() => {
    if (!category) {
      navigate('/admin/products/add', { replace: true });
    }
  }, [category, navigate]);

  // ✅ Don't render until category is confirmed
  if (!category) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6">
      <ProductForm
        mode="admin"
        categoryId={category}
        productId={id}
        onSuccess={() => navigate('/admin/products')}
      />
    </div>
  );
};

export default AdminProductForm;
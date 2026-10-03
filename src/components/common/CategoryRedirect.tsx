// src/components/common/CategoryRedirect.tsx
import { useParams, Navigate } from 'react-router-dom';

interface Props {
  /** The category slug to redirect to (used for listing pages) */
  toCategory?: string;
}

/**
 * Helper for redirecting old product URLs to the new universal product page.
 *
 * Usage:
 *   <Route path="/crockery/:id" element={<CategoryRedirect toCategory="crockery" />} />
 *
 * Behavior:
 *   - If URL has :id → redirect to /product/:id
 *   - Otherwise → redirect to /category/:toCategory
 */
const CategoryRedirect = ({ toCategory }: Props) => {
  const { id, categoryName } = useParams<{ id?: string; categoryName?: string }>();

  // ✅ Has product ID → go to universal product page
  if (id) {
    return <Navigate to={`/product/${id}`} replace />;
  }

  // ✅ Has categoryName param → go to category page
  if (categoryName) {
    return <Navigate to={`/category/${categoryName}`} replace />;
  }

  // ✅ Fallback: go to the target category, or home
  if (toCategory) {
    return <Navigate to={`/category/${toCategory}`} replace />;
  }

  return <Navigate to="/home" replace />;
};

export default CategoryRedirect;
// src/components/admin/AdminProducts.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from 'firebase/firestore';
import {
  FaEdit, FaTrash, FaPlus, FaPalette, FaRuler, FaBoxes,
  FaSpinner, FaSearch,
  FaChevronDown, FaChevronUp,
} from 'react-icons/fa';

interface Variant {
  id: string;
  productId: string;
  colour: string;
  colourHex: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  images?: string[];
  image?: string;
  status: string;
  isFeatured: boolean;
}

const AdminProducts: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [variantCache, setVariantCache] = useState<{ [key: string]: Variant[] }>({});
  const [variantLoading, setVariantLoading] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const [showAddVariant, setShowAddVariant] = useState<string | null>(null);
  const [variantForm, setVariantForm] = useState({
    colour: '',
    colourHex: '#800080',
    size: '',
    price: '',
    stock: '',
    images: [] as string[],
  });
  const [uploading, setUploading] = useState(false);

  const colourOptions = [
    { name: 'Purple', hex: '#800080' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Green', hex: '#008000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Pink', hex: '#FF69B4' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Orange', hex: '#FF8C00' },
    { name: 'Brown', hex: '#8B4513' },
    { name: 'Grey', hex: '#808080' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Teal', hex: '#008080' },
    { name: 'Maroon', hex: '#800000' },
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const productsSnap = await getDocs(collection(db, 'products'));
      const productsData: Product[] = productsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      } as Product));
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredProducts(
        products.filter(
          (p) =>
            p.name?.toLowerCase().includes(term) ||
            p.category?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, products]);

  const loadVariantsForProduct = useCallback(
    async (productId: string, force = false) => {
      if (!force && variantCache[productId]) return;
      try {
        setVariantLoading(productId);
        const variantsSnap = await getDocs(
          collection(db, 'products', productId, 'variants')
        );
        const variants: Variant[] = variantsSnap.docs.map((d) => ({
          id: d.id,
          productId,
          ...d.data(),
        } as Variant));
        setVariantCache((prev) => ({ ...prev, [productId]: variants }));
      } catch (error) {
        console.error('Error loading variants:', error);
      } finally {
        setVariantLoading(null);
      }
    },
    [variantCache]
  );

  const toggleVariants = (productId: string) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
      loadVariantsForProduct(productId);
    }
  };

  const invalidateCache = (productId: string) => {
    setVariantCache((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const handleAddVariant = async (productId: string) => {
    if (
      !variantForm.colour ||
      !variantForm.size ||
      !variantForm.price ||
      !variantForm.stock
    ) {
      alert('Please fill all fields');
      return;
    }

    try {
      setUploading(true);
      await addDoc(collection(db, 'products', productId, 'variants'), {
        colour: variantForm.colour,
        colourHex: variantForm.colourHex,
        size: variantForm.size,
        sku: `${productId}-${variantForm.colour.substring(0, 3)}-${variantForm.size}`,
        price: parseFloat(variantForm.price),
        stock: parseInt(variantForm.stock),
        images: variantForm.images,
        createdAt: new Date(),
      });

      invalidateCache(productId);
      await loadVariantsForProduct(productId, true);

      setVariantForm({
        colour: '',
        colourHex: '#800080',
        size: '',
        price: '',
        stock: '',
        images: [],
      });
      setShowAddVariant(null);
      alert('✅ Variant added!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add variant');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVariant = async (productId: string, variantId: string) => {
    if (!confirm('Delete this variant?')) return;
    try {
      await deleteDoc(doc(db, 'products', productId, 'variants', variantId));
      invalidateCache(productId);
      await loadVariantsForProduct(productId, true);
      alert('✅ Variant deleted!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete variant');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Delete this product and all variants?')) return;
    try {
      const variantsSnap = await getDocs(
        collection(db, 'products', productId, 'variants')
      );
      for (const variantDoc of variantsSnap.docs) {
        await deleteDoc(
          doc(db, 'products', productId, 'variants', variantDoc.id)
        );
      }
      await deleteDoc(doc(db, 'products', productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      invalidateCache(productId);
      alert('✅ Product deleted!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete product');
    }
  };

  const getTotalStock = (productId: string): number | null => {
    const variants = variantCache[productId];
    if (!variants) return null;
    return variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  };

  const getColourCount = (productId: string): number | null => {
    const variants = variantCache[productId];
    if (!variants) return null;
    return new Set(variants.map((v) => v.colour)).size;
  };

  const getSizeCount = (productId: string): number | null => {
    const variants = variantCache[productId];
    if (!variants) return null;
    return new Set(variants.map((v) => v.size)).size;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#0F766E] mx-auto" />
          <p className="text-sm text-gray-500 mt-3">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">🛍️ Products</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your products and their variants
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none w-full sm:w-56 text-sm"
            />
          </div>
          <button
            onClick={() => navigate('/admin/products/add')}
            className="bg-[#0F766E] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#065F46] transition flex items-center gap-1.5 text-sm whitespace-nowrap shrink-0"
          >
            <FaPlus size={12} />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
          <p className="text-lg sm:text-2xl font-bold text-gray-800">{products.length}</p>
          <p className="text-xs sm:text-sm text-gray-500">Total Products</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
          <p className="text-lg sm:text-2xl font-bold text-purple-600">
            {Object.values(variantCache).reduce((sum, v) => sum + v.length, 0)}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">Loaded Variants</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
          <p className="text-lg sm:text-2xl font-bold text-green-600">
            {new Set(Object.values(variantCache).flat().map((v) => v.colour)).size}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">Unique Colours</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
          <p className="text-lg sm:text-2xl font-bold text-blue-600">
            {new Set(Object.values(variantCache).flat().map((v) => v.size)).size}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">Unique Sizes</p>
        </div>
      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center border border-gray-100">
          <div className="text-5xl sm:text-6xl mb-4">📦</div>
          <p className="text-gray-500 text-base sm:text-lg">
            {searchTerm ? 'No products found' : 'No products added yet'}
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {searchTerm
              ? 'Try adjusting your search'
              : 'Click "Add Product" to add your first product!'}
          </p>
        </div>
      ) : (
        <>
          {/* ============ MOBILE CARD VIEW ============ */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map((product) => {
              const variants = variantCache[product.id] || [];
              const isExpanded = expandedProduct === product.id;
              const isLoadingVariants = variantLoading === product.id;
              const hasVariants = variantCache[product.id] !== undefined;
              const totalStock = getTotalStock(product.id);
              const colourCount = getColourCount(product.id);
              const sizeCount = getSizeCount(product.id);

              const imageUrl =
                product.image ||
                product.images?.[0] ||
                '/images/placeholder.jpg';

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-3 flex items-start gap-3">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg border shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize mt-0.5">
                        {product.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-[#0F766E]">
                          Rs. {product.price}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.status || 'active'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 pb-2 flex flex-wrap items-center gap-1.5">
                    {isLoadingVariants ? (
                      <FaSpinner className="animate-spin text-gray-400" size={14} />
                    ) : (
                      <>
                        <button
                          onClick={() => toggleVariants(product.id)}
                          className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                        >
                          <FaPalette size={11} /> {colourCount ?? '?'}
                        </button>
                        <button
                          onClick={() => toggleVariants(product.id)}
                          className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                        >
                          <FaRuler size={11} /> {sizeCount ?? '?'}
                        </button>
                        <button
                          onClick={() => toggleVariants(product.id)}
                          className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                        >
                          <FaBoxes size={11} /> {hasVariants ? variants.length : '?'}
                        </button>
                        {totalStock !== null && (
                          <span
                            className={`text-xs font-medium ${
                              totalStock > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            Stock: {totalStock}
                          </span>
                        )}
                        <button
                          onClick={() => toggleVariants(product.id)}
                          className="ml-auto text-gray-400 p-1"
                        >
                          {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                        </button>
                      </>
                    )}
                  </div>

                  <div className="border-t flex">
                    <button
                      onClick={() =>
                        navigate(`/admin/products/edit/${product.category}/${product.id}`)
                      }
                      className="flex-1 py-2.5 text-blue-600 text-sm font-medium hover:bg-blue-50 transition flex items-center justify-center gap-1.5"
                    >
                      <FaEdit size={14} /> Edit
                    </button>
                    <div className="w-px bg-gray-200" />
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 py-2.5 text-red-600 text-sm font-medium hover:bg-red-50 transition flex items-center justify-center gap-1.5"
                    >
                      <FaTrash size={14} /> Delete
                    </button>
                  </div>

                  {/* Expanded Variants Mobile */}
                  {isExpanded && (
                    <div className="bg-gray-50 border-t p-3 space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">
                          Variants
                        </span>
                        <button
                          onClick={() =>
                            setShowAddVariant(
                              showAddVariant === product.id ? null : product.id
                            )
                          }
                          className="bg-[#0F766E] text-white px-2.5 py-1 rounded-lg text-xs flex items-center gap-1"
                        >
                          <FaPlus size={9} /> Add
                        </button>
                      </div>

                      {showAddVariant === product.id && (
                        <div className="bg-white p-3 rounded-lg border space-y-2">
                          <select
                            value={variantForm.colour}
                            onChange={(e) =>
                              setVariantForm({
                                ...variantForm,
                                colour: e.target.value,
                                colourHex:
                                  colourOptions.find((c) => c.name === e.target.value)
                                    ?.hex || '#800080',
                              })
                            }
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          >
                            <option value="">Colour</option>
                            {colourOptions.map((c) => (
                              <option key={c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={variantForm.size}
                              onChange={(e) =>
                                setVariantForm({ ...variantForm, size: e.target.value })
                              }
                              className="px-3 py-2 border rounded-lg text-sm"
                            >
                              <option value="">Size</option>
                              {sizeOptions.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              placeholder="Price"
                              value={variantForm.price}
                              onChange={(e) =>
                                setVariantForm({ ...variantForm, price: e.target.value })
                              }
                              className="px-3 py-2 border rounded-lg text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              placeholder="Stock"
                              value={variantForm.stock}
                              onChange={(e) =>
                                setVariantForm({ ...variantForm, stock: e.target.value })
                              }
                              className="px-3 py-2 border rounded-lg text-sm"
                            />
                            <button
                              onClick={() => handleAddVariant(product.id)}
                              disabled={uploading}
                              className="bg-[#0F766E] text-white rounded-lg text-sm disabled:opacity-50 flex items-center justify-center gap-1"
                            >
                              {uploading ? <FaSpinner className="animate-spin" /> : 'Add'}
                            </button>
                          </div>
                        </div>
                      )}

                      {variants.length === 0 ? (
                        <p className="text-xs text-gray-500 text-center py-3">
                          No variants
                        </p>
                      ) : (
                        variants.map((variant) => (
                          <div
                            key={variant.id}
                            className="bg-white rounded-lg border p-2.5 flex items-center gap-2"
                          >
                            <span
                              className="w-5 h-5 rounded-full border shrink-0"
                              style={{ backgroundColor: variant.colourHex || '#ccc' }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">
                                {variant.colour} • {variant.size}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                Rs. {variant.price} • Stock: {variant.stock}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteVariant(product.id, variant.id)}
                              className="text-red-600 p-1.5 shrink-0"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ============ DESKTOP TABLE ============ */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Image</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Stock</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Variants</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const variants = variantCache[product.id] || [];
                    const isExpanded = expandedProduct === product.id;
                    const isLoadingVariants = variantLoading === product.id;
                    const hasVariants = variantCache[product.id] !== undefined;
                    const totalStock = getTotalStock(product.id);
                    const colourCount = getColourCount(product.id);
                    const sizeCount = getSizeCount(product.id);

                    const imageUrl =
                      product.image ||
                      product.images?.[0] ||
                      '/images/placeholder.jpg';

                    return (
                      <React.Fragment key={product.id}>
                        <tr className="border-b hover:bg-gray-50 transition">
                          <td className="py-3 px-4">
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                              }}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm font-medium text-gray-800">{product.name}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm font-semibold text-gray-800">Rs. {product.price}</p>
                          </td>
                          <td className="py-3 px-4">
                            {isLoadingVariants ? (
                              <FaSpinner className="animate-spin text-purple-500" size={14} />
                            ) : totalStock !== null ? (
                              <span className={`text-sm font-medium ${totalStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {totalStock}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap items-center gap-2">
                              {isLoadingVariants ? (
                                <FaSpinner className="animate-spin text-gray-400" size={12} />
                              ) : (
                                <>
                                  <button
                                    onClick={() => toggleVariants(product.id)}
                                    className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full hover:bg-purple-200 transition"
                                  >
                                    <FaPalette size={11} /> {colourCount ?? '?'}
                                  </button>
                                  <button
                                    onClick={() => toggleVariants(product.id)}
                                    className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition"
                                  >
                                    <FaRuler size={11} /> {sizeCount ?? '?'}
                                  </button>
                                  <button
                                    onClick={() => toggleVariants(product.id)}
                                    className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full hover:bg-green-200 transition"
                                  >
                                    <FaBoxes size={11} /> {hasVariants ? variants.length : '?'}
                                  </button>
                                  <button
                                    onClick={() => toggleVariants(product.id)}
                                    className="text-gray-400 hover:text-gray-600 transition"
                                  >
                                    {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                product.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {product.status || 'active'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  navigate(`/admin/products/edit/${product.category}/${product.id}`)
                                }
                                className="text-blue-600 hover:text-blue-800 transition p-1.5 rounded hover:bg-blue-50"
                                title="Edit Product"
                              >
                                <FaEdit size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-800 transition p-1.5 rounded hover:bg-red-50"
                              >
                                <FaTrash size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr>
                            <td colSpan={8} className="bg-gray-50 p-4">
                              <div className="border rounded-lg overflow-hidden">
                                <div className="bg-gray-100 px-4 py-2 font-semibold text-sm text-gray-700 flex justify-between items-center">
                                  <span>Variants for "{product.name}"</span>
                                  <button
                                    onClick={() =>
                                      setShowAddVariant(
                                        showAddVariant === product.id ? null : product.id
                                      )
                                    }
                                    className="bg-[#0F766E] text-white px-3 py-1 rounded-lg text-xs hover:bg-[#065F46] transition flex items-center gap-1"
                                  >
                                    <FaPlus size={10} /> Add Variant
                                  </button>
                                </div>

                                {showAddVariant === product.id && (
                                  <div className="bg-white p-4 border-b">
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                                      <select
                                        value={variantForm.colour}
                                        onChange={(e) =>
                                          setVariantForm({
                                            ...variantForm,
                                            colour: e.target.value,
                                            colourHex:
                                              colourOptions.find(
                                                (c) => c.name === e.target.value
                                              )?.hex || '#800080',
                                          })
                                        }
                                        className="px-3 py-2 border rounded-lg text-sm"
                                      >
                                        <option value="">Colour</option>
                                        {colourOptions.map((c) => (
                                          <option key={c.name} value={c.name}>
                                            {c.name}
                                          </option>
                                        ))}
                                      </select>
                                      <input
                                        type="color"
                                        value={variantForm.colourHex}
                                        onChange={(e) =>
                                          setVariantForm({
                                            ...variantForm,
                                            colourHex: e.target.value,
                                          })
                                        }
                                        className="w-full h-10 rounded-lg border cursor-pointer"
                                      />
                                      <select
                                        value={variantForm.size}
                                        onChange={(e) =>
                                          setVariantForm({
                                            ...variantForm,
                                            size: e.target.value,
                                          })
                                        }
                                        className="px-3 py-2 border rounded-lg text-sm"
                                      >
                                        <option value="">Size</option>
                                        {sizeOptions.map((s) => (
                                          <option key={s} value={s}>
                                            {s}
                                          </option>
                                        ))}
                                      </select>
                                      <input
                                        type="number"
                                        placeholder="Price"
                                        value={variantForm.price}
                                        onChange={(e) =>
                                          setVariantForm({
                                            ...variantForm,
                                            price: e.target.value,
                                          })
                                        }
                                        className="px-3 py-2 border rounded-lg text-sm"
                                      />
                                      <input
                                        type="number"
                                        placeholder="Stock"
                                        value={variantForm.stock}
                                        onChange={(e) =>
                                          setVariantForm({
                                            ...variantForm,
                                            stock: e.target.value,
                                          })
                                        }
                                        className="px-3 py-2 border rounded-lg text-sm"
                                      />
                                      <button
                                        onClick={() => handleAddVariant(product.id)}
                                        disabled={uploading}
                                        className="bg-[#0F766E] text-white px-3 py-2 rounded-lg hover:bg-[#065F46] transition flex items-center justify-center gap-1 text-sm disabled:opacity-50"
                                      >
                                        {uploading ? <FaSpinner className="animate-spin" /> : 'Add'}
                                      </button>
                                    </div>
                                  </div>
                                )}

                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead className="bg-white">
                                      <tr>
                                        <th className="text-left py-2 px-3 text-xs text-gray-500">#</th>
                                        <th className="text-left py-2 px-3 text-xs text-gray-500">Colour</th>
                                        <th className="text-left py-2 px-3 text-xs text-gray-500">Size</th>
                                        <th className="text-left py-2 px-3 text-xs text-gray-500">SKU</th>
                                        <th className="text-left py-2 px-3 text-xs text-gray-500">Price</th>
                                        <th className="text-left py-2 px-3 text-xs text-gray-500">Stock</th>
                                        <th className="text-left py-2 px-3 text-xs text-gray-500">Images</th>
                                        <th className="text-left py-2 px-3 text-xs text-gray-500">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {variants.map((variant, idx) => (
                                        <tr key={variant.id} className="border-t">
                                          <td className="py-2 px-3 text-xs text-gray-400">{idx + 1}</td>
                                          <td className="py-2 px-3 flex items-center gap-2">
                                            <span
                                              className="w-4 h-4 rounded-full border"
                                              style={{
                                                backgroundColor: variant.colourHex || '#ccc',
                                              }}
                                            />
                                            {variant.colour}
                                          </td>
                                          <td className="py-2 px-3">{variant.size}</td>
                                          <td className="py-2 px-3 text-xs text-gray-500">
                                            {variant.sku}
                                          </td>
                                          <td className="py-2 px-3">Rs. {variant.price}</td>
                                          <td className="py-2 px-3">
                                            <span
                                              className={
                                                variant.stock > 0
                                                  ? 'text-green-600'
                                                  : 'text-red-600'
                                              }
                                            >
                                              {variant.stock}
                                            </span>
                                          </td>
                                          <td className="py-2 px-3">
                                            <div className="flex gap-1">
                                              {variant.images?.slice(0, 2).map((img, i) => (
                                                <img
                                                  key={i}
                                                  src={img}
                                                  className="w-8 h-8 object-cover rounded border"
                                                  onError={(e) => {
                                                    (e.target as HTMLImageElement).src =
                                                      '/images/placeholder.jpg';
                                                  }}
                                                />
                                              ))}
                                              {variant.images?.length > 2 && (
                                                <span className="text-xs text-gray-400 flex items-center">
                                                  +{variant.images.length - 2}
                                                </span>
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-2 px-3">
                                            <button
                                              onClick={() =>
                                                handleDeleteVariant(product.id, variant.id)
                                              }
                                              className="text-red-600 hover:text-red-800 transition p-1"
                                            >
                                              <FaTrash size={12} />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                      {variants.length === 0 && (
                                        <tr>
                                          <td
                                            colSpan={8}
                                            className="py-4 text-center text-gray-500"
                                          >
                                            No variants added
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProducts;
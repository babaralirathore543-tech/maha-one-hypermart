import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaChartLine, 
  FaCog,
  FaSignOutAlt,
  FaStore,
  FaPlus,
  FaTrash
} from 'react-icons/fa';
import { db, collection, addDoc, getDocs, deleteDoc, doc } from '../../config/firebase';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  
  // ✅ activeTab declared here
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // ✅ New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    category: '',
    stock: '',
    image: ''
  });

  // ✅ Check if user is admin
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
    fetchProducts();
  }, [isAdmin, navigate]);

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        price: parseFloat(newProduct.price),
        discountPrice: parseFloat(newProduct.discountPrice) || 0,
        stock: parseInt(newProduct.stock) || 0,
        images: [newProduct.image],
        isActive: true,
        createdAt: new Date()
      });
      
      setNewProduct({
        name: '',
        price: '',
        discountPrice: '',
        description: '',
        category: '',
        stock: '',
        image: ''
      });
      setShowAddForm(false);
      fetchProducts();
      alert('✅ Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('❌ Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Product
  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        fetchProducts();
        alert('✅ Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('❌ Failed to delete product');
      }
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('userUpdated'));
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  // ✅ Stats
  const stats = [
    { title: 'Total Users', value: '0', icon: <FaUsers />, color: 'bg-blue-500' },
    { title: 'Total Products', value: products.length, icon: <FaBox />, color: 'bg-green-500' },
    { title: 'Total Orders', value: '0', icon: <FaShoppingCart />, color: 'bg-purple-500' },
    { title: 'Revenue', value: 'Rs. 0', icon: <FaChartLine />, color: 'bg-yellow-500' },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
    { id: 'products', label: 'Products', icon: <FaBox /> },
    { id: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#0F766E] text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaStore className="text-2xl" />
            <h1 className="text-xl font-bold">Maha One Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar */}
          <div className="md:w-64 bg-white rounded-xl shadow-sm p-4 h-fit">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    console.log('🔵 Tab clicked:', item.id);
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition ${
                    activeTab === item.id
                      ? 'bg-[#0F766E] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <div className={`${stat.color} text-white w-8 h-8 rounded-lg flex items-center justify-center mt-2`}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {activeTab === 'dashboard' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                  <p className="text-gray-500 mt-1">Welcome to admin panel!</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-700">Recent Orders</h3>
                      <p className="text-gray-500 text-sm mt-2">No orders yet</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-700">Quick Actions</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <button 
                          onClick={() => setActiveTab('products')}
                          className="bg-[#0F766E] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#065F46] transition"
                        >
                          Add Product
                        </button>
                        <button 
                          onClick={() => setActiveTab('orders')}
                          className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-purple-700 transition"
                        >
                          View Orders
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                    <button 
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition flex items-center gap-2 text-sm"
                    >
                      <FaPlus /> {showAddForm ? 'Cancel' : 'Add Product'}
                    </button>
                  </div>

                  {showAddForm && (
                    <form onSubmit={handleAddProduct} className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Category"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Discount Price"
                          value={newProduct.discountPrice}
                          onChange={(e) => setNewProduct({...newProduct, discountPrice: e.target.value})}
                          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                        />
                        <textarea
                          placeholder="Description"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none md:col-span-2"
                          rows={3}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 bg-[#0F766E] text-white px-6 py-2 rounded-lg hover:bg-[#065F46] transition disabled:opacity-50"
                      >
                        {loading ? 'Adding...' : 'Add Product'}
                      </button>
                    </form>
                  )}

                  {loading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No products added yet. Click "Add Product" to add your first product!
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Image</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Price</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Stock</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id} className="border-b hover:bg-gray-50 transition">
                              <td className="py-3 px-4">
                                <img 
                                  src={product.images?.[0] || '/images/placeholder.jpg'} 
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              </td>
                              <td className="py-3 px-4 text-sm">{product.name}</td>
                              <td className="py-3 px-4 text-sm">Rs. {product.price}</td>
                              <td className="py-3 px-4 text-sm">{product.stock || 0}</td>
                              <td className="py-3 px-4">
                                <button 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-500 hover:text-red-700 transition"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ✅ Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <AdminOrders />
                </div>
              )}

              {activeTab === 'users' && (
                <AdminUsers />
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                  <p className="text-gray-500 mt-1">Admin settings</p>
                  <div className="mt-4 border rounded-lg p-4 text-center text-gray-500">
                    Settings panel coming soon
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
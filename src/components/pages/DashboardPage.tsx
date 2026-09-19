// src/components/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHeart, FaShoppingBag, FaSignOutAlt, FaMapMarkerAlt,
  FaCreditCard, FaCog, FaHistory, FaHome, FaGift,
  FaPlus, FaEdit, FaTrash, FaTimes, FaSpinner
} from 'react-icons/fa';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
  image: string;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, logout } = useAuth();

  const params = new URLSearchParams(location.search);
  const tabFromUrl = params.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // ✅ Data states
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  // ✅ Form states
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '', street: '', city: '', province: '', postalCode: '', country: 'Pakistan'
  });
  const [newPayment, setNewPayment] = useState({
    cardNumber: '', cardName: '', expiryDate: '', cvv: '', isDefault: false
  });
  const [profileForm, setProfileForm] = useState({
    name: '', email: '', phone: ''
  });

  // ✅ Get user from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id || user?.uid;

  // ✅ Fetch all data on mount
  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchAllData = async () => {
      setLoading(true);
      try {
        // ✅ 1. Fetch user profile
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setProfileForm({
            name: data.name || user?.name || '',
            email: data.email || user?.email || '',
            phone: data.phone || '',
          });
          setAddresses(data.addresses || []);
          setPayments(data.payments || []);
        }

        // ✅ 2. Fetch user orders
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', userId)
        );
        const ordersSnap = await getDocs(ordersQuery);
        const ordersData: Order[] = [];
        ordersSnap.forEach((d) => {
          const data = d.data();
          ordersData.push({
            id: d.id,
            date: data.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A',
            total: data.total || 0,
            status: data.status || 'pending',
            items: data.items?.length || 0,
            image: data.items?.[0]?.image || '/images/placeholder.jpg',
          });
        });
        setOrders(ordersData);

        // ✅ 3. Fetch wishlist
        const wishlistQuery = query(
          collection(db, 'wishlist', userId, 'items')
        );
        const wishlistSnap = await getDocs(wishlistQuery);
        const wishlistData: WishlistItem[] = [];
        wishlistSnap.forEach((d) => {
          const data = d.data();
          wishlistData.push({
            id: d.id,
            name: data.name || '',
            price: data.price || 0,
            image: data.image || '/images/placeholder.jpg',
          });
        });
        setWishlistItems(wishlistData);

      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userId, navigate]);

  // ✅ Stats
  const stats = [
    { label: 'Orders', value: orders.length, icon: <FaShoppingBag className="text-[#0F766E] text-xl sm:text-2xl" /> },
    { label: 'Wishlist', value: wishlistItems.length, icon: <FaHeart className="text-red-500 text-xl sm:text-2xl" /> },
    { label: 'Rewards', value: 0, icon: <FaGift className="text-purple-500 text-xl sm:text-2xl" /> },
  ];

  // ✅ Save address to Firestore
  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newAddr: Address = {
        id: Date.now().toString(),
        ...newAddress,
      };
      const updatedAddresses = [...addresses, newAddr];
      await updateDoc(doc(db, 'users', userId), {
        addresses: updatedAddresses,
        updatedAt: serverTimestamp(),
      });
      setAddresses(updatedAddresses);
      setNewAddress({ name: '', street: '', city: '', province: '', postalCode: '', country: 'Pakistan' });
      setShowAddAddress(false);
      alert('✅ Address added successfully!');
    } catch (error: any) {
      alert('❌ Failed to save address: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const updatedAddresses = addresses.filter((addr) => addr.id !== id);
      await updateDoc(doc(db, 'users', userId), {
        addresses: updatedAddresses,
        updatedAt: serverTimestamp(),
      });
      setAddresses(updatedAddresses);
      alert('✅ Address deleted!');
    } catch (error: any) {
      alert('❌ Failed to delete: ' + error.message);
    }
  };

  // ✅ Save profile to Firestore
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', userId), {
        name: profileForm.name,
        phone: profileForm.phone,
        updatedAt: serverTimestamp(),
      });

      // ✅ Update localStorage
      const updatedUser = { ...user, name: profileForm.name, phone: profileForm.phone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('userUpdated'));

      alert('✅ Profile updated!');
    } catch (error: any) {
      alert('❌ Failed to update profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Add to Cart
  const handleAddToCart = (item: WishlistItem) => {
    // TODO: Cart context add karo
    alert(`🛒 ${item.name} added to cart!`);
  };

  // ✅ Remove from wishlist
  const handleRemoveFromWishlist = async (id: string) => {
    if (!window.confirm('Remove from wishlist?')) return;
    try {
      await deleteDoc(doc(db, 'wishlist', userId, 'items', id));
      setWishlistItems(wishlistItems.filter((item) => item.id !== id));
      alert('✅ Removed from wishlist!');
    } catch (error: any) {
      alert('❌ Failed: ' + error.message);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    if (logout) await logout();
    else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    }
    window.dispatchEvent(new Event('userUpdated'));
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  // ✅ Menu Items
  const menuItems = [
    { id: 'overview', label: '📊 Overview', icon: <FaHome /> },
    { id: 'orders', label: '📦 My Orders', icon: <FaShoppingBag /> },
    { id: 'wishlist', label: '❤️ Wishlist', icon: <FaHeart /> },
    { id: 'address', label: '📍 Addresses', icon: <FaMapMarkerAlt /> },
    { id: 'payments', label: '💳 Payments', icon: <FaCreditCard /> },
    { id: 'history', label: '📜 History', icon: <FaHistory /> },
    { id: 'settings', label: '⚙️ Settings', icon: <FaCog /> },
  ];

  if (!user) {
    navigate('/login');
    return null;
  }

  // ✅ Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#0F766E] mx-auto" />
          <p className="text-gray-500 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
        
        {/* ✅ Welcome Section */}
        <div className="bg-gradient-to-r from-[#0F766E] to-[#065F46] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold">
                {(userData?.name || user.name)?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                  Welcome, {userData?.name || user.name || 'User'}! 👋
                </h1>
                <p className="text-white/80 text-xs sm:text-sm">{user.email}</p>
                <span className="inline-block mt-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
                  Customer
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* ✅ Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
              <div className="text-xl sm:text-2xl">{stat.icon}</div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ✅ Dashboard Content */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          
          {/* ✅ Sidebar */}
          <div className="md:w-56 lg:w-64 bg-white rounded-xl shadow-sm p-3 sm:p-4 h-fit">
            <nav className="space-y-0.5 sm:space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm transition ${
                    activeTab === item.id
                      ? 'bg-[#0F766E] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-base sm:text-lg">{item.icon}</span>
                  <span className="inline text-xs sm:text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* ✅ Content */}
          <div className="flex-1">
            
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">📊 Overview</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Recent Orders */}
                  <div className="border rounded-lg p-3 sm:p-4">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
                      <FaShoppingBag /> Recent Orders
                    </h3>
                    {orders.length === 0 ? (
                      <p className="text-sm text-gray-500 mt-2">No orders yet</p>
                    ) : (
                      orders.slice(0, 2).map((order) => (
                        <div key={order.id} className="mt-2 p-2 bg-gray-50 rounded-lg">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="font-mono">#{order.id.slice(0, 8)}</span>
                            <span className="text-[#0F766E] font-medium">Rs. {order.total}</span>
                          </div>
                          <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-1">
                            <span>{order.date}</span>
                            <span className={`px-2 py-0.5 rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    <button onClick={() => setActiveTab('orders')} className="mt-3 text-xs sm:text-sm text-[#0F766E] hover:underline">
                      View All Orders →
                    </button>
                  </div>

                  {/* Wishlist Summary */}
                  <div className="border rounded-lg p-3 sm:p-4">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
                      <FaHeart className="text-red-500" /> Wishlist
                    </h3>
                    <p className="text-xl sm:text-2xl font-bold text-[#0F766E] mt-2">{wishlistItems.length} items</p>
                    <button 
                      onClick={() => setActiveTab('wishlist')}
                      className="text-xs bg-[#0F766E] text-white px-3 py-1 rounded hover:bg-[#065F46] transition mt-2"
                    >
                      View Wishlist →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">📦 My Orders</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FaShoppingBag className="text-5xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No orders yet</p>
                    <button
                      onClick={() => navigate('/')}
                      className="mt-3 text-[#0F766E] hover:underline text-sm"
                    >
                      Start Shopping →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded flex items-center justify-center text-2xl">
                            📦
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm sm:text-base font-mono">
                              Order #{order.id.slice(0, 8)}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">{order.date}</p>
                            <p className="text-xs sm:text-sm text-gray-500">{order.items} items</p>
                          </div>
                          <div className="text-right w-full sm:w-auto">
                            <p className="font-bold text-[#0F766E] text-sm sm:text-base">Rs. {order.total}</p>
                            <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">❤️ Wishlist</h2>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <FaHeart className="text-5xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Your wishlist is empty</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">{item.name}</p>
                          <p className="text-[#0F766E] font-bold text-sm sm:text-base">Rs. {item.price}</p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="text-xs bg-[#0F766E] text-white px-2 py-1 rounded hover:bg-[#065F46]"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => handleRemoveFromWishlist(item.id)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'address' && (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">📍 Addresses</h2>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="bg-[#0F766E] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-[#065F46] flex items-center gap-2"
                  >
                    <FaPlus /> {showAddAddress ? 'Cancel' : 'Add Address'}
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleAddAddressSubmit} className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" placeholder="Address Name (e.g. Home)" value={newAddress.name} onChange={(e) => setNewAddress({...newAddress, name: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
                      <input type="text" placeholder="Street" value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
                      <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
                      <input type="text" placeholder="Province" value={newAddress.province} onChange={(e) => setNewAddress({...newAddress, province: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
                      <input type="text" placeholder="Postal Code" value={newAddress.postalCode} onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" />
                      <input type="text" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({...newAddress, country: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
                    </div>
                    <button type="submit" disabled={saving} className="mt-3 bg-[#0F766E] text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save Address'}
                    </button>
                  </form>
                )}

                {addresses.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No addresses saved</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-3 sm:p-4">
                        <p className="font-medium text-sm">{address.name}</p>
                        <p className="text-xs text-gray-600">{address.street}</p>
                        <p className="text-xs text-gray-600">{address.city}, {address.country}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleDeleteAddress(address.id)} className="text-xs text-red-600 hover:underline flex items-center gap-1">
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payments */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">💳 Payment Methods</h2>
                <p className="text-center text-gray-500 py-8">
                  Payment methods will be available after first order
                </p>
              </div>
            )}

            {/* History */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">📜 History</h2>
                <div className="border rounded-lg p-4 text-center text-gray-500 text-sm">
                  No history available
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">⚙️ Settings</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="border rounded-lg p-3 sm:p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">👤 Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div className="border rounded-lg p-3 sm:p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">✉️ Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-100"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div className="border rounded-lg p-3 sm:p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">📞 Phone</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-[#0F766E] text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
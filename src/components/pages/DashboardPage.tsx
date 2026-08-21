import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHeart, 
  FaShoppingBag, 
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCog,
  FaHistory,
  FaHome,
  FaGift,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes
} from 'react-icons/fa';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ Get tab from URL
  const params = new URLSearchParams(location.search);
  const tabFromUrl = params.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  
  // ✅ Form States
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  
  // ✅ Address Form State
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Pakistan'
  });

  // ✅ Payment Form State
  const [newPayment, setNewPayment] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    isDefault: false
  });

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // ✅ Addresses State
  const [addresses, setAddresses] = useState([
    { id: 1, name: 'Home', street: '123 Main Street', city: 'Lahore', province: 'Punjab', postalCode: '54000', country: 'Pakistan' },
    { id: 2, name: 'Office', street: '456 Office Road', city: 'Lahore', province: 'Punjab', postalCode: '54000', country: 'Pakistan' },
  ]);

  // ✅ Payments State
  const [payments, setPayments] = useState([
    { id: 1, cardName: 'John Doe', cardNumber: '**** **** **** 1234', expiryDate: '12/26', isDefault: true },
  ]);

  // ✅ Orders State
  const [orders] = useState([
    { id: 1, date: '2026-01-15', total: 2500, status: 'Delivered', items: 2, image: '/images/products/almonds-1.jpg' },
    { id: 2, date: '2026-01-10', total: 3200, status: 'Processing', items: 3, image: '/images/products/pistachios-1.jpg' },
    { id: 3, date: '2026-01-05', total: 1800, status: 'Shipped', items: 1, image: '/images/products/walnuts-1.jpg' },
  ]);

  // ✅ Wishlist State
  const [wishlistItems] = useState([
    { id: 1, name: 'American Almonds', price: 2500, image: '/images/products/almonds-1.jpg' },
    { id: 2, name: 'Pistachios', price: 3500, image: '/images/products/pistachios-1.jpg' },
    { id: 3, name: 'Walnuts', price: 2200, image: '/images/products/walnuts-1.jpg' },
  ]);

  // ✅ Stats (Wallet removed)
  const stats = [
    { label: 'Orders', value: orders.length, icon: <FaShoppingBag className="text-[#0F766E] text-xl sm:text-2xl" /> },
    { label: 'Wishlist', value: wishlistItems.length, icon: <FaHeart className="text-red-500 text-xl sm:text-2xl" /> },
    { label: 'Rewards', value: 0, icon: <FaGift className="text-purple-500 text-xl sm:text-2xl" /> },
  ];

  // ✅ Address Functions
  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const address = {
      id: addresses.length + 1,
      ...newAddress
    };
    setAddresses([...addresses, address]);
    setNewAddress({ name: '', street: '', city: '', province: '', postalCode: '', country: 'Pakistan' });
    setShowAddAddress(false);
    alert('✅ Address added successfully!');
  };

  const handleDeleteAddress = (id: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
      alert('✅ Address deleted!');
    }
  };

  // ✅ Payment Functions
  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payment = {
      id: payments.length + 1,
      cardName: newPayment.cardName,
      cardNumber: `**** **** **** ${newPayment.cardNumber.slice(-4)}`,
      expiryDate: newPayment.expiryDate,
      isDefault: newPayment.isDefault
    };
    setPayments([...payments, payment]);
    setNewPayment({ cardNumber: '', cardName: '', expiryDate: '', cvv: '', isDefault: false });
    setShowAddPayment(false);
    alert('✅ Payment method added successfully!');
  };

  // ✅ Add to Cart
  const handleAddToCart = (productName: string) => {
    alert(`🛒 ${productName} added to cart!`);
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

  // ✅ Menu Items (Wallet removed)
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

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
        
        {/* ✅ Welcome Section */}
        <div className="bg-gradient-to-r from-[#0F766E] to-[#065F46] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Welcome, {user.name || 'User'}! 👋</h1>
                <p className="text-white/80 text-xs sm:text-sm">{user.email}</p>
                <span className="inline-block mt-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
                  {user.role === 'admin' ? 'Admin' : 'Customer'}
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

        {/* ✅ Stats Cards (Wallet removed) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
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
                    {orders.slice(0, 2).map((order) => (
                      <div key={order.id} className="mt-2 p-2 bg-gray-50 rounded-lg">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>Order #{order.id}</span>
                          <span className="text-[#0F766E] font-medium">Rs. {order.total}</span>
                        </div>
                        <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-1">
                          <span>{order.date}</span>
                          <span className={`px-2 py-0.5 rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setActiveTab('orders')} className="mt-3 text-xs sm:text-sm text-[#0F766E] hover:underline">
                      View All Orders →
                    </button>
                  </div>

                  {/* My Wishlist Summary */}
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
                  <p className="text-gray-500 text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                          <img src={order.image} alt="Order" className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded" />
                          <div className="flex-1">
                            <p className="font-medium text-sm sm:text-base">Order #{order.id}</p>
                            <p className="text-xs sm:text-sm text-gray-500">{order.date}</p>
                            <p className="text-xs sm:text-sm text-gray-500">{order.items} items</p>
                          </div>
                          <div className="text-right w-full sm:w-auto">
                            <p className="font-bold text-[#0F766E] text-sm sm:text-base">Rs. {order.total}</p>
                            <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-600' :
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
                  <p className="text-gray-500 text-center py-8">Your wishlist is empty</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">{item.name}</p>
                          <p className="text-[#0F766E] font-bold text-sm sm:text-base">Rs. {item.price}</p>
                          <button onClick={() => handleAddToCart(item.name)} className="mt-1 text-xs sm:text-sm bg-[#0F766E] text-white px-2 sm:px-3 py-1 rounded hover:bg-[#065F46] transition">
                            Add to Cart
                          </button>
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
                  <button onClick={() => setShowAddAddress(!showAddAddress)} className="bg-[#0F766E] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-[#065F46] transition flex items-center gap-2">
                    <FaPlus /> {showAddAddress ? 'Cancel' : 'Add Address'}
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleAddAddressSubmit} className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Add New Address</h3>
                      <button type="button" onClick={() => setShowAddAddress(false)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" placeholder="Address Name" value={newAddress.name} onChange={(e) => setNewAddress({...newAddress, name: e.target.value})} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm" required />
                      <input type="text" placeholder="Street" value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm" required />
                      <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm" required />
                      <input type="text" placeholder="Province" value={newAddress.province} onChange={(e) => setNewAddress({...newAddress, province: e.target.value})} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm" required />
                      <input type="text" placeholder="Postal Code" value={newAddress.postalCode} onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm" />
                      <input type="text" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({...newAddress, country: e.target.value})} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm" required />
                    </div>
                    <button type="submit" className="mt-3 bg-[#0F766E] text-white px-6 py-2 rounded-lg hover:bg-[#065F46] transition text-sm">Save Address</button>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-3 sm:p-4">
                      <p className="font-medium text-sm sm:text-base">{address.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{address.street}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{address.city}, {address.country}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => alert('✏️ Edit Address')} className="text-xs sm:text-sm text-blue-600 hover:underline flex items-center gap-1"><FaEdit /> Edit</button>
                        <button onClick={() => handleDeleteAddress(address.id)} className="text-xs sm:text-sm text-red-600 hover:underline flex items-center gap-1"><FaTrash /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payments */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">💳 Payment Methods</h2>
                  <button onClick={() => setShowAddPayment(!showAddPayment)} className="bg-[#0F766E] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-[#065F46] transition flex items-center gap-2">
                    <FaPlus /> {showAddPayment ? 'Cancel' : 'Add Payment'}
                  </button>
                </div>

                {showAddPayment && (
                  <form onSubmit={handleAddPaymentSubmit} className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Add Payment Method</h3>
                      <button type="button" onClick={() => setShowAddPayment(false)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" placeholder="Card Number" value={newPayment.cardNumber} onChange={(e) => setNewPayment({...newPayment, cardNumber: e.target.value})} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm" required />
                      <input type="text" placeholder="Name on Card" value={newPayment.cardName} onChange={(e) => setNewPayment({...newPayment, cardName: e.target.value})} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm" required />
                      <input type="text" placeholder="Expiry Date (MM/YY)" value={newPayment.expiryDate} onChange={(e) => setNewPayment({...newPayment, expiryDate: e.target.value})} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm" required />
                      <input type="password" placeholder="CVV" value={newPayment.cvv} onChange={(e) => setNewPayment({...newPayment, cvv: e.target.value})} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm" required />
                    </div>
                    <button type="submit" className="mt-3 bg-[#0F766E] text-white px-6 py-2 rounded-lg hover:bg-[#065F46] transition text-sm">Save Payment</button>
                  </form>
                )}

                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <p className="font-medium text-sm sm:text-base">{payment.cardName}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{payment.cardNumber}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {payment.isDefault && <span className="bg-green-100 text-green-600 text-[10px] sm:text-xs px-2 py-1 rounded-full">Default</span>}
                        <button onClick={() => alert('✏️ Edit Payment')} className="text-xs sm:text-sm text-blue-600 hover:underline">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">📜 History</h2>
                <div className="border rounded-lg p-4 text-center text-gray-500 text-sm">No history available</div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">⚙️ Settings</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="border rounded-lg p-3 sm:p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">👤 Name</label>
                    <input type="text" defaultValue={user.name || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm" />
                  </div>
                  <div className="border rounded-lg p-3 sm:p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">✉️ Email</label>
                    <input type="email" defaultValue={user.email || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm" />
                  </div>
                  <div className="border rounded-lg p-3 sm:p-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">📞 Phone</label>
                    <input type="tel" defaultValue={user.phone || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm" />
                  </div>
                  <button onClick={() => alert('✅ Settings saved successfully!')} className="bg-[#0F766E] text-white px-6 py-2 rounded-lg hover:bg-[#065F46] transition text-sm">Save Changes</button>
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
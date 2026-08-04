import { useState } from 'react';
import { FaUser, FaHeart, FaMapMarkerAlt, FaCog, FaSignOutAlt, FaBox } from 'react-icons/fa';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { id: 'orders', label: 'Orders', icon: <FaBox /> },
    { id: 'wishlist', label: 'Wishlist', icon: <FaHeart /> },
    { id: 'addresses', label: 'Addresses', icon: <FaMapMarkerAlt /> },
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div className="bg-[#FFFDF7] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <FaUser className="text-3xl text-[#D4AF37]" />
          <h1 className="text-3xl font-bold text-[#111827]">My Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-[#E5E7EB] shadow-sm">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[#0F766E] rounded-full flex items-center justify-center text-white text-3xl mx-auto">👤</div>
                <h3 className="font-bold text-[#111827] mt-2">Ahmed Khan</h3>
                <p className="text-sm text-gray-500">ahmed@email.com</p>
              </div>
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === tab.id ? 'bg-[#D4AF37] text-white' : 'hover:bg-[#F8FAFC] text-gray-700'}`}>
                    {tab.icon}<span>{tab.label}</span>
                  </button>
                ))}
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition"><FaSignOutAlt /><span>Logout</span></button>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-bold text-[#111827] mb-4">Recent Orders</h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between">
                        <div><p className="font-semibold">Order #{i}000{i}</p><p className="text-sm text-gray-500">PKR {(i+1) * 1200}</p></div>
                        <span className={`text-sm px-3 py-1 rounded-full ${i === 1 ? 'bg-green-100 text-green-600' : i === 2 ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                          {i === 1 ? 'Delivered' : i === 2 ? 'Processing' : 'Shipped'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-xl font-bold text-[#111827] mb-4">Wishlist</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="border border-[#E5E7EB] rounded-xl p-4 text-center">
                        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop" alt="Product" className="w-full h-32 object-cover rounded-lg mb-2" />
                        <p className="font-semibold text-sm">Product {i}</p>
                        <p className="text-[#D4AF37] font-bold">PKR {(i+1) * 1000}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-xl font-bold text-[#111827] mb-4">Saved Addresses</h2>
                  <div className="border border-[#E5E7EB] rounded-xl p-4"><p className="font-semibold">🏠 Home</p><p className="text-sm text-gray-600">123 Main Street, Karachi, Pakistan</p></div>
                </div>
              )}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-[#111827] mb-4">Profile Settings</h2>
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" value="Ahmed Khan" className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" value="ahmed@email.com" className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg" /></div>
                    <button className="bg-[#0F766E] text-white px-6 py-2 rounded-lg hover:bg-[#065F46] transition">Update Profile</button>
                  </div>
                </div>
              )}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-bold text-[#111827] mb-4">Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4"><div><p className="font-semibold">Email Notifications</p><p className="text-sm text-gray-500">Receive order updates</p></div><input type="checkbox" className="w-5 h-5 text-[#D4AF37]" defaultChecked /></div>
                    <div className="flex items-center justify-between border-b pb-4"><div><p className="font-semibold">SMS Notifications</p><p className="text-sm text-gray-500">Receive delivery updates</p></div><input type="checkbox" className="w-5 h-5 text-[#D4AF37]" /></div>
                    <div className="flex items-center justify-between"><div><p className="font-semibold">Language</p><p className="text-sm text-gray-500">Select your language</p></div><select className="px-4 py-2 border rounded-lg"><option>English</option><option>Urdu</option></select></div>
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

export default DashboardPage;
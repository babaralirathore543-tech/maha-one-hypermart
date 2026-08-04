import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const AdminPage = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const usersSnap = await getDocs(collection(db, 'users'));
        const productsSnap = await getDocs(collection(db, 'products'));
        
        let totalRevenue = 0;
        ordersSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.status === 'delivered') {
            totalRevenue += data.totalAmount || 0;
          }
        });

        setStats({
          totalOrders: ordersSnap.size,
          totalUsers: usersSnap.size,
          totalProducts: productsSnap.size,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 bg-[#FFFDF7] min-h-screen">
      <h1 className="text-3xl font-bold text-[#111827] mb-8">⚙️ Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#E5E7EB]">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold text-[#0F766E]">{stats.totalOrders}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#E5E7EB]">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-3xl font-bold text-[#0F766E]">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#E5E7EB]">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-3xl font-bold text-[#0F766E]">{stats.totalProducts}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#E5E7EB]">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-3xl font-bold text-[#D4AF37]">PKR {stats.revenue}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
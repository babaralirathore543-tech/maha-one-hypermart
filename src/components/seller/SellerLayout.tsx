// src/components/seller/SellerLayout.tsx
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { FaSignOutAlt, FaStore } from 'react-icons/fa';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  Settings,
} from 'lucide-react';
import {
  db,
  collection,
  query,
  where,
  getDocs,
  limit,
} from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

const SellerLayout = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [storeName, setStoreName] = useState('');
  const [checking, setChecking] = useState(true);

  // ✅ Body class for CSS isolation
  useEffect(() => {
    document.body.classList.add('seller-active');
    return () => document.body.classList.remove('seller-active');
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    let cancelled = false;

    const fetchStore = async () => {
      try {
        const snap = await getDocs(
          query(
            collection(db, 'sellers'),
            where('userId', '==', user.uid),
            limit(1)
          )
        );

        if (cancelled) return;

        if (!snap.empty) {
          const data = snap.docs[0].data();
          setStoreName(data.storeName || user.displayName || 'My Store');
        } else {
          setStoreName(user.displayName || 'My Store');
        }
      } catch (error) {
        console.error('Error fetching store:', error);
        setStoreName(user.displayName || 'My Store');
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    fetchStore();

    const safetyTimer = setTimeout(() => {
      if (!cancelled) setChecking(false);
    }, 8000);

    return () => {
      cancelled = true;
      clearTimeout(safetyTimer);
    };
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      navigate('/login');
    }
  };

  if (loading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#0F766E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/seller', end: true },
    { icon: Package, label: 'Products', path: '/seller/products' },
    { icon: ShoppingBag, label: 'Orders', path: '/seller/orders' },
    { icon: DollarSign, label: 'Earnings', path: '/seller/earnings' },
    { icon: Settings, label: 'Settings', path: '/seller/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full max-w-full overflow-x-hidden">
      {/* ============ HEADER ============ */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 w-full">
        <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-3 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FaStore className="text-[#0F766E] shrink-0 text-lg" />
            <h1 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
              {storeName}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition shrink-0 active:scale-95"
          >
            <FaSignOutAlt size={12} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ============ CONTENT ============ */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 lg:pb-6 overflow-x-hidden">
        <Outlet />
      </main>

      {/* ============ BOTTOM NAV (Mobile only) ============ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] w-full max-w-full">
        <div className="grid grid-cols-5 max-w-lg mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2.5 px-1 transition-colors active:scale-95 ${
                  isActive ? 'text-[#0F766E]' : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium mt-0.5">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default SellerLayout;
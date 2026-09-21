// src/components/seller/SellerLayout.tsx
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { FaSignOutAlt, FaStore } from 'react-icons/fa';
import {
  Menu,
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
import SellerSidebar from './SellerSidebar';

const SellerLayout = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [storeName, setStoreName] = useState('');
  const [sellerDocId, setSellerDocId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Fetch store with timeout + safety net
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    let cancelled = false;

    const fetchStore = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );

        const queryPromise = getDocs(
          query(
            collection(db, 'sellers'),
            where('userId', '==', user.uid),
            limit(1)
          )
        );

        const snap = (await Promise.race([
          queryPromise,
          timeoutPromise,
        ])) as any;

        if (cancelled) return;

        if (!snap.empty) {
          const docSnap = snap.docs[0];
          setSellerDocId(docSnap.id);
          const data = docSnap.data();
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
      if (!cancelled) {
        console.warn('⚠️ Force checking = false after 8s');
        setChecking(false);
      }
    }, 8000);

    return () => {
      cancelled = true;
      clearTimeout(safetyTimer);
    };
  }, [user, loading, navigate]);

  // Body scroll lock when sidebar open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E] mx-auto" />
          <p className="text-gray-500 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const bottomNavItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/seller', end: true },
    { icon: Package, label: 'Products', path: '/seller/products' },
    { icon: ShoppingBag, label: 'Orders', path: '/seller/orders' },
    { icon: DollarSign, label: 'Earnings', path: '/seller/earnings' },
    { icon: Settings, label: 'Settings', path: '/seller/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SellerSidebar
        sellerDocId={sellerDocId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Open menu"
              >
                <Menu size={20} className="text-gray-700" />
              </button>

              <FaStore className="text-[#0F766E] text-lg flex-shrink-0 hidden sm:block" />

              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                  {storeName || 'Seller Dashboard'}
                </h1>
                <p className="text-[10px] text-gray-500">Seller Panel</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                  {user.displayName || user.email?.split('@')[0] || 'Seller'}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">
                  {user.email}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-colors border border-red-200"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-3 sm:p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-5 max-w-md mx-auto">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 transition-colors ${
                  isActive ? 'text-[#0F766E]' : 'text-gray-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
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
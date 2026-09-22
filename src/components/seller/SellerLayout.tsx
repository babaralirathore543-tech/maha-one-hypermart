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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#f9fafb',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: '4px solid #0F766E',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
    <div
      style={{
        background: '#f9fafb',
        minHeight: '100vh',
        position: 'relative',
        paddingBottom: 80, // space for bottom nav
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minWidth: 0,
              flex: 1,
            }}
          >
            <FaStore style={{ color: '#0F766E', flexShrink: 0 }} />
            <h1
              style={{
                fontWeight: 600,
                color: '#1f2937',
                fontSize: 16,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {storeName}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              fontSize: 13,
              color: '#dc2626',
              background: 'white',
              border: '1px solid #fecaca',
              borderRadius: 8,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main
        style={{
          padding: 16,
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <Outlet />
      </main>

      {/* BOTTOM NAV */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderTop: '1px solid #e5e7eb',
          zIndex: 30,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            maxWidth: 500,
            margin: '0 auto',
          }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px 4px',
                color: isActive ? '#0F766E' : '#6b7280',
                textDecoration: 'none',
                fontSize: 10,
                fontWeight: 500,
              })}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span style={{ marginTop: 2 }}>{item.label}</span>
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
// src/components/admin/AdminLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Auto-close on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSidebarOpen]);

  // ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Auto-close on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!token) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('userUpdated'));
    window.dispatchEvent(new Event('storage'));
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ==================== MOBILE SIDEBAR (Fixed, outside flex) ==================== */}
      <>
        {/* Overlay */}
        <div
          className={`
            fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden
            transition-opacity duration-300
            ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
          `}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />

        {/* Sidebar Drawer */}
        <aside
          className={`
            fixed top-0 left-0 z-50
            h-screen w-[280px] max-w-[85vw]
            transform transition-transform duration-300 ease-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:hidden
            overflow-y-auto
            shadow-2xl
          `}
        >
          <AdminSidebar
            onLogout={handleLogout}
            onClose={() => setIsSidebarOpen(false)}
          />
        </aside>
      </>

      {/* ==================== MAIN WRAPPER (flex only on desktop) ==================== */}
      <div className="flex">
        {/* ✅ DESKTOP SIDEBAR ONLY (part of flex, hidden on mobile) */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen overflow-y-auto">
          <AdminSidebar onLogout={handleLogout} />
        </aside>

        {/* ==================== MAIN CONTENT ==================== */}
        <div className="flex-1 flex flex-col min-h-screen min-w-0 w-full">
          <AdminHeader
            onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
            isSidebarOpen={isSidebarOpen}
          />

          <main className="flex-1 p-3 sm:p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
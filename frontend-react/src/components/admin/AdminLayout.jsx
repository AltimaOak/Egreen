import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Toast from './Toast';

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Auto-collapse when shrinking to mobile
      if (mobile) setSidebarCollapsed(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showBackdrop = isMobile && !sidebarCollapsed;

  return (
    <div className="admin-container-root">
      <div className="admin-layout">
        {showBackdrop && (
          <div
            className="admin-sidebar-backdrop"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        <div className="admin-main-area">
          <TopNav
            toggleSidebar={() => setSidebarCollapsed(c => !c)}
            collapsed={sidebarCollapsed}
          />
          <main className="admin-content-outlet">
            <div className="admin-content-container">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Toast />
    </div>
  );
};

export default AdminLayout;

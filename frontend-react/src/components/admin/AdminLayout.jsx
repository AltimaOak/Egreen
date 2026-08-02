import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Toast from './Toast';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setSidebarCollapsed(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="admin-container-root">
      <div className="admin-layout">
        {!sidebarCollapsed && window.innerWidth <= 768 && (
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

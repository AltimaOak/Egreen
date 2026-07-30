// Admin Layout Wrapper Component
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Toast from './Toast';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="admin-container-root">
      <div className="admin-layout">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        
        <div className="admin-main-area">
          <TopNav toggleSidebar={toggleSidebar} />
          
          <main className="admin-content-outlet">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Toast Notification Mount */}
      <Toast />
    </div>
  );
};

export default AdminLayout;

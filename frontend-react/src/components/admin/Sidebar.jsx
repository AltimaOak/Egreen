import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  FolderTree,
  Users,
  Layers,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout, currentUser } = useAdmin();
  const { themeSettings } = useTheme();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      navigate('/admin');
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Pages', path: '/admin/pages', icon: Layers },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const displayName = currentUser?.username || themeSettings.adminName || 'admin';
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo-container">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58 1 9.3a7.012 7.012 0 0 1-6 8.7z"></path>
            <path d="M9.5 9.4c0 3.2 2.6 5.8 5.8 5.8"></path>
          </svg>
        </div>
        <div className="admin-sidebar-brand-name">
          <span className="admin-sidebar-title">{themeSettings.websiteName || 'Egreen'}</span>
          <span className="admin-sidebar-subtitle">Admin Panel</span>
        </div>
      </div>

      <nav className="admin-sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              <span className="admin-sidebar-link-text">{item.name}</span>
            </NavLink>
          );
        })}

        <button
          onClick={handleLogoutClick}
          className="admin-sidebar-link"
          style={{ marginTop: 'auto', color: 'var(--color-danger)' }}
        >
          <LogOut size={18} />
          <span className="admin-sidebar-link-text">Logout</span>
        </button>
      </nav>

      <div className="admin-sidebar-profile">
        <div className="admin-sidebar-profile-avatar">
          {displayInitial}
        </div>
        <div className="admin-sidebar-profile-info">
          <span className="admin-sidebar-profile-name">{displayName}</span>
          <span className="admin-sidebar-profile-role">Administrator</span>
        </div>
      </div>

      <button
        className="admin-sidebar-collpase-btn"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
};

export default Sidebar;

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LayoutDashboard, ShoppingBag, ShoppingCart, FolderTree,
  Users, BarChart3, Settings, LogOut,
  ChevronLeft, ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard',  path: '/admin',            icon: LayoutDashboard, end: true },
  { name: 'Products',   path: '/admin/products',    icon: ShoppingBag },
  { name: 'Orders',     path: '/admin/orders',      icon: ShoppingCart },
  { name: 'Categories', path: '/admin/categories',  icon: FolderTree },
  { name: 'Customers',  path: '/admin/customers',   icon: Users },
  { name: 'Analytics',  path: '/admin/analytics',   icon: BarChart3 },
  { name: 'Settings',   path: '/admin/settings',    icon: Settings },
];


const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout, currentUser } = useAdmin();
  const { themeSettings } = useTheme();
  const navigate = useNavigate();

  const displayName = currentUser?.username || themeSettings.adminName || 'Admin';
  const displayInitial = displayName.charAt(0).toUpperCase();
  const siteName = themeSettings.websiteName || 'Egreen';

  const handleLogout = async () => {
    if (window.confirm('Sign out of the admin panel?')) {
      await logout();
      navigate('/admin/login');
    }
  };

  return (
    <aside className={`admin-sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Brand */}
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-icon">E</div>
          {!collapsed && (
            <div className="admin-sidebar-brand-text">
              <span className="admin-sidebar-brand-name">{siteName}</span>
              <span className="admin-sidebar-brand-sub">Admin Panel</span>
            </div>
          )}
        </div>
        <button
          className="admin-sidebar-collapse-btn"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) =>
                `admin-nav-item${isActive ? ' active' : ''}`
              }
            >
              <Icon size={18} className="nav-icon" />
              {!collapsed && <span className="nav-label">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Profile */}
      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-profile">
          <div className="admin-sidebar-avatar">{displayInitial}</div>
          {!collapsed && (
            <div className="admin-sidebar-profile-info">
              <span className="admin-sidebar-profile-name">{displayName}</span>
              <span className="admin-sidebar-profile-role">Administrator</span>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          className="admin-nav-item"
          style={{ color: 'var(--color-danger)', width: '100%', border: 'none', background: 'none' }}
        >
          <LogOut size={17} className="nav-icon" />
          {!collapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

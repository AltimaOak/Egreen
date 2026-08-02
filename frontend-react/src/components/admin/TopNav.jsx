import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, Search, Bell, Plus, ChevronRight } from 'lucide-react';

const PAGE_TITLES = {
  '/admin':            'Dashboard',
  '/admin/products':   'Products',
  '/admin/orders':     'Orders',
  '/admin/categories': 'Categories',
  '/admin/customers':  'Customers',
  '/admin/analytics':  'Analytics',
  '/admin/settings':   'Settings',
};

const TopNav = ({ toggleSidebar, collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { themeSettings } = useTheme();
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    }));
  }, []);

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Admin';

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/admin/products?q=${encodeURIComponent(search)}`);
    }
  };

  const initial = (themeSettings.adminName || 'A').charAt(0).toUpperCase();

  return (
    <header className="admin-topnav">
      {/* Left */}
      <div className="admin-topnav-left">
        <button
          className="admin-topnav-icon-btn"
          onClick={toggleSidebar}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu size={17} />
        </button>

        <div>
          <div className="admin-topnav-title">{pageTitle}</div>
          <nav className="admin-topnav-breadcrumb">
            <Link to="/admin">Admin</Link>
            <ChevronRight size={11} />
            <span>{pageTitle}</span>
          </nav>
        </div>
      </div>

      {/* Right */}
      <div className="admin-topnav-right">
        {/* Search */}
        <div className="admin-topnav-search">
          <Search size={15} className="admin-topnav-search-icon" />
          <input
            className="admin-topnav-search-input"
            placeholder="Search products, orders…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* Date pill */}
        <span className="admin-topnav-date-badge">{date}</span>

        {/* Add Product shortcut */}
        <Link
          to="/admin/products?action=add"
          className="admin-btn admin-btn-primary admin-btn-sm"
          style={{ textDecoration: 'none' }}
        >
          <Plus size={14} /> Add Product
        </Link>

        {/* Notifications */}
        <button className="admin-topnav-icon-btn" title="Notifications">
          <Bell size={16} />
          <span className="admin-topnav-notification-dot" />
        </button>

        {/* Avatar */}
        <div className="admin-topnav-avatar" title="Profile">{initial}</div>
      </div>
    </header>
  );
};

export default TopNav;

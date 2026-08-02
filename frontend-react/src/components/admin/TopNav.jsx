import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, Plus, Bell, Sun, Moon, ChevronRight } from 'lucide-react';

const TopNav = ({ toggleSidebar, collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { themeSettings, updateTheme } = useTheme();
  const [currentDate, setCurrentDate] = useState('');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  const toggleThemeMode = () => {
    const nextTheme = themeSettings.theme === 'dark' ? 'light' : 'dark';
    updateTheme({ theme: nextTheme });
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchValue.trim() !== '') {
      navigate(`/admin/products?q=${encodeURIComponent(searchValue)}`);
    }
  };

  // Derive page title from current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path === '/admin/products') return 'Products';
    if (path === '/admin/orders') return 'Orders';
    if (path === '/admin/categories') return 'Categories';
    if (path === '/admin/customers') return 'Customers';
    if (path === '/admin/pages') return 'Pages';
    if (path === '/admin/analytics') return 'Analytics';
    if (path === '/admin/settings') return 'Settings';
    return 'Admin';
  };

  return (
    <header className="admin-topnav">
      <div className="admin-topnav-left">
        <button
          className="admin-topnav-toggle"
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>

        <div>
          <h1 className="text-lg font-semibold text-text">{getPageTitle()}</h1>
          <nav className="flex items-center gap-1 text-xs text-muted">
            <Link to="/admin" className="hover:text-text transition-colors">Admin</Link>
            <ChevronRight size={12} />
            <span className="text-text">{getPageTitle()}</span>
          </nav>
        </div>
      </div>

      <div className="admin-topnav-right">
        <div className="admin-topnav-search-box">
          <Search size={16} className="absolute left-3 text-muted" />
          <input
            type="text"
            className="admin-topnav-search-input"
            placeholder="Search anything..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
          <span className="admin-topnav-search-kbd">⌘K</span>
        </div>

        <span className="admin-topnav-date">{currentDate}</span>

        <Link
          to="/admin/products?action=add"
          className="admin-btn admin-btn-primary admin-btn-sm"
          style={{ textDecoration: 'none' }}
        >
          <Plus size={14} /> Add Product
        </Link>

        <button
          className="admin-topnav-icon-btn has-badge"
          title="Notifications"
        >
          <Bell size={16} />
        </button>

        <button
          className="admin-topnav-icon-btn"
          onClick={toggleThemeMode}
          title={`Switch to ${themeSettings.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {themeSettings.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="admin-topnav-avatar">
          {themeSettings.adminName?.charAt(0).toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
};

export default TopNav;

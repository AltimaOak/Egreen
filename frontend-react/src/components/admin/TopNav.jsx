// Admin Header Toolbar Component
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, Plus, Bell, Sun, Moon } from 'lucide-react';

const TopNav = ({ toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { themeSettings, updateTheme } = useTheme();
  const [currentDate, setCurrentDate] = useState('');
  const [searchValue, setSearchValue] = useState('');

  // Set date string
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
      // Redirect search value to product filter
      navigate(`/admin/products?q=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <header className="admin-topnav">
      <div className="admin-topnav-left" style={{ gap: '20px' }}>
        {/* Toggle Hamburger */}
        <button className="admin-topnav-toggle" onClick={toggleSidebar}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>

        {/* Search anything input */}
        <div className="admin-topnav-search-box">
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--admin-text-body)' }} />
          <input 
            type="text" 
            className="admin-topnav-search-input" 
            placeholder="Search anything..." 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
          <span className="admin-topnav-search-kbd">Ctrl+K</span>
        </div>

        {/* Add Product Shortcut Button */}
        <Link 
          to="/admin/products?action=add" 
          className="admin-btn admin-btn-primary admin-btn-sm" 
          style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '0.85rem' }}
        >
          <Plus size={14} /> Add Product
        </Link>
      </div>

      <div className="admin-topnav-right" style={{ gap: '20px' }}>
        <div className="admin-topnav-date" style={{ fontWeight: 600 }}>{currentDate}</div>
        
        {/* Action icons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Theme switcher */}
          <button 
            onClick={toggleThemeMode}
            className="admin-topnav-toggle"
            style={{ padding: '8px', border: '1px solid var(--admin-border)', borderRadius: '50%' }}
            title={`Switch to ${themeSettings.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {themeSettings.theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Notifications bell */}
          <button 
            className="admin-topnav-toggle"
            style={{ padding: '8px', border: '1px solid var(--admin-border)', borderRadius: '50%', position: 'relative' }}
          >
            <Bell size={15} />
            <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }}></span>
          </button>
        </div>

        {/* Avatar badge */}
        <div style={{ borderLeft: '1px solid var(--admin-border)', paddingLeft: '20px', height: '36px', display: 'flex', alignItems: 'center' }}>
          <div 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100')",
              backgroundSize: 'cover',
              border: '1px solid var(--admin-border)'
            }}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;

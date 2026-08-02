import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <div className="logo-icon"></div>
          Egreen Technology
        </Link>
        <div className={`nav-links ${isMenuOpen ? 'active-menu' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}>Home</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={closeMenu}>About Us</Link>
          <Link to="/products" className={location.pathname === '/products' ? 'active' : ''} onClick={closeMenu}>Products</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={closeMenu}>Contact</Link>
          {!isAuthenticated && !loading && (
            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''} onClick={closeMenu}>Sign In</Link>
          )}
          {isAuthenticated && (
            <button onClick={handleLogout} className="mobile-logout" style={{ background: 'none', border: 'none', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--text-body)', cursor: 'pointer', textAlign: 'left', padding: '8px 0' }}>Logout</button>
          )}
        </div>
        <div className="nav-actions">
          <a href="https://wa.me/917942625065" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Get Quote</a>
          {loading ? null : isAuthenticated ? (
            <>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-body)', marginRight: '8px' }}>
                Hi, {user.name?.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Sign In</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Register</Link>
            </>
          )}
        </div>
        <button className="mobile-menu-btn" aria-label="Toggle Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

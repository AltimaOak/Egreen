import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
<<<<<<< HEAD
import { settingsService } from '../services/settingsService';
import { pageService } from '../services/pageService';
=======
>>>>>>> 1c861ec904e502df740e5e9a7f7caa3bd43edb8f

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
<<<<<<< HEAD
  const [settings, setSettings] = useState({ websiteName: 'Egreen Technology', logoText: 'Egreen Technology' });
  const [whatsapp, setWhatsapp] = useState('917942625065');
  const location = useLocation();

  const fetchBranding = async () => {
    try {
      const s = await settingsService.getSettings();
      setSettings(s);
      const c = await pageService.getContact();
      const cleanPhone = c.whatsapp ? c.whatsapp.replace(/[+\-\s]/g, '') : '917942625065';
      setWhatsapp(cleanPhone);
    } catch (e) {
      console.error('Error fetching navbar settings', e);
    }
  };

=======
  const location = useLocation();

>>>>>>> 1c861ec904e502df740e5e9a7f7caa3bd43edb8f
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
<<<<<<< HEAD
    fetchBranding();

    window.addEventListener('egreen_settings_updated', fetchBranding);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('egreen_settings_updated', fetchBranding);
    };
=======
    return () => window.removeEventListener('scroll', handleScroll);
>>>>>>> 1c861ec904e502df740e5e9a7f7caa3bd43edb8f
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

<<<<<<< HEAD
  // If we are on an admin route, do NOT render the customer navbar
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

=======
>>>>>>> 1c861ec904e502df740e5e9a7f7caa3bd43edb8f
  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <div className="logo-icon"></div>
<<<<<<< HEAD
          {settings.logoText || settings.websiteName || 'Egreen Technology'}
=======
          Egreen Technology
>>>>>>> 1c861ec904e502df740e5e9a7f7caa3bd43edb8f
        </Link>
        <div className={`nav-links ${isMenuOpen ? 'active-menu' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}>Home</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={closeMenu}>About Us</Link>
          <Link to="/products" className={location.pathname === '/products' ? 'active' : ''} onClick={closeMenu}>Products</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={closeMenu}>Contact</Link>
        </div>
        <div className="nav-actions">
<<<<<<< HEAD
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-primary">Get Quote</a>
=======
          <a href="https://wa.me/917942625065" target="_blank" rel="noreferrer" className="btn btn-primary">Get Quote</a>
>>>>>>> 1c861ec904e502df740e5e9a7f7caa3bd43edb8f
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

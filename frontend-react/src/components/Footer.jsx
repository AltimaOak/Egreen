<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { settingsService } from '../services/settingsService';
import { pageService } from '../services/pageService';

const Footer = () => {
  const location = useLocation();
  const [settings, setSettings] = useState({ websiteName: 'Egreen Technology', logoText: 'Egreen' });
  const [contact, setContact] = useState({
    footerContact: 'Goregaon East, Mumbai, Maharashtra - 400063',
    email: 'egreentechnology24@gmail.com',
    phone: '+91-7942625065',
    facebook: '#',
    instagram: '#',
    linkedin: '#',
    twitter: '#'
  });

  const fetchFooterData = async () => {
    try {
      const s = await settingsService.getSettings();
      setSettings(s);
      const c = await pageService.getContact();
      setContact(c);
    } catch (e) {
      console.error('Error fetching footer settings', e);
    }
  };

  useEffect(() => {
    fetchFooterData();
    window.addEventListener('egreen_settings_updated', fetchFooterData);
    return () => {
      window.removeEventListener('egreen_settings_updated', fetchFooterData);
    };
  }, []);

  // If we are on an admin route, do NOT render the customer footer
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

=======
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
>>>>>>> 1c861ec904e502df740e5e9a7f7caa3bd43edb8f
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="logo" style={{ color: 'white', marginBottom: '1.5rem' }}>
              <div className="logo-icon"></div>
<<<<<<< HEAD
              {settings.logoText || settings.websiteName || 'Egreen'}
            </Link>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>Mumbai-based wholesaler and distributor of brand-new and refurbished IT hardware.</p>
            <div className="social-icons">
              {contact.facebook && (
                <a href={contact.facebook} target="_blank" rel="noreferrer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              )}
              {contact.twitter && (
                <a href={contact.twitter} target="_blank" rel="noreferrer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noreferrer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              )}
=======
              Egreen
            </Link>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>Mumbai-based wholesaler and distributor of brand-new and refurbished IT hardware.</p>
            <div className="social-icons">
              <a href="#"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              <a href="#"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
              <a href="#"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
>>>>>>> 1c861ec904e502df740e5e9a7f7caa3bd43edb8f
            </div>
          </div>
          <div>
            <h4 className="footer-heading">Company</h4>
            <div className="footer-links">
              <Link to="/about">About Us</Link>
              <Link to="/contact">Careers</Link>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div>
            <h4 className="footer-heading">Products</h4>
            <div className="footer-links">
              <Link to="/products">Dell Systems</Link>
              <Link to="/products">HP Systems</Link>
              <Link to="/products">Lenovo Systems</Link>
              <Link to="/products">Processors</Link>
            </div>
          </div>
          <div>
            <h4 className="footer-heading">Contact</h4>
<<<<<<< HEAD
            <div className="footer-links font-small">
              <span style={{ color: '#9ca3af', lineHeight: 1.4 }}>{contact.footerContact}</span>
              <a href={`mailto:${contact.email}`} style={{ color: '#9ca3af', textDecoration: 'none' }}>{contact.email}</a>
              <a href={`tel:${contact.phone}`} style={{ color: '#9ca3af', textDecoration: 'none' }}>{contact.phone}</a>
=======
            <div className="footer-links">
              <a href="https://maps.google.com/maps?q=19%C2%B010'22.5%22N+72%C2%B051'27.1%22E" target="_blank" rel="noreferrer" style={{ color: '#9ca3af', textDecoration: 'none' }}>Goregaon East, Mumbai<br />Maharashtra - 400063, India</a>
              <a href="mailto:egreentechnology24@gmail.com" style={{ color: '#9ca3af', textDecoration: 'none' }}>egreentechnology24@gmail.com</a>
              <a href="tel:+917942625065" style={{ color: '#9ca3af', textDecoration: 'none' }}>+91-7942625065</a>
>>>>>>> 1c861ec904e502df740e5e9a7f7caa3bd43edb8f
            </div>
          </div>
        </div>
        <div className="footer-bottom">
<<<<<<< HEAD
          <p>{settings.footerText || `© ${new Date().getFullYear()} Egreen Technology. All rights reserved.`}</p>
=======
          <p>&copy; 2026 Egreen Technology. All rights reserved.</p>
>>>>>>> 1c861ec904e502df740e5e9a7f7caa3bd43edb8f
          <p>Designed for Egreen</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

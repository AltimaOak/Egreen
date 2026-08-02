import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="logo" style={{ color: 'white', marginBottom: '1.5rem' }}>
              <div className="logo-icon"></div>
              Egreen Technology
            </Link>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>Premium Wholesaler & Distributor of Brand New & Refurbished IT Hardware.</p>
            <div className="social-icons">
              <a href="#"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              <a href="#"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
              <a href="#"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
            </div>
          </div>
          <div>
            <h4 className="footer-heading">Company</h4>
            <div className="footer-links">
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact & Quotes</Link>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div>
            <h4 className="footer-heading">Products</h4>
            <div className="footer-links">
              <Link to="/products">Dell Wyse Thin Clients</Link>
              <Link to="/products">Mini PCs & Desktops</Link>
              <Link to="/products">Computer Processors</Link>
              <Link to="/products">Components & SSDs</Link>
            </div>
          </div>
          <div>
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-links">
              <a href="https://maps.google.com/maps?q=19%C2%B010'22.5%22N+72%C2%B051'27.1%22E" target="_blank" rel="noreferrer" style={{ color: '#9ca3af', textDecoration: 'none' }}>Goregaon East, Mumbai<br />Maharashtra - 400063, India</a>
              <a href="mailto:egreentechnology24@gmail.com" style={{ color: '#9ca3af', textDecoration: 'none' }}>egreentechnology24@gmail.com</a>
              <a href="tel:+917942625065" style={{ color: '#9ca3af', textDecoration: 'none' }}>+91-7942625065</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Egreen Technology. All rights reserved.</p>
          <p>Designed for Egreen</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

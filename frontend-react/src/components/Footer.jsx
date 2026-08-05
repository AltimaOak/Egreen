import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Top Wholesale Quote Callout Banner */}
        <div className="footer-cta-banner">
          <div className="footer-cta-text">
            <h3>Need Bulk IT Hardware Solutions?</h3>
            <p>Get instant wholesale pricing on new &amp; certified refurbished desktops, mini PCs, and thin clients.</p>
          </div>
          <a href="https://wa.me/917942625065" target="_blank" rel="noreferrer" className="btn btn-primary footer-cta-btn">
            Get Wholesale Quote 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>

        <div className="footer-grid">
          {/* Column 1: Brand Info & Socials */}
          <div className="footer-brand-col">
            <Link to="/" className="logo footer-logo-link">
              <div className="footer-logo-wrapper">
                <img src="/assets/egreen_logo.png" alt="Egreen Technology Logo" className="footer-logo-img" />
              </div>
              <span className="logo-text" style={{ color: 'var(--text-heading)' }}>Egreen <span className="logo-accent">Technology</span></span>
            </Link>
            <p className="footer-brand-desc">
              India's trusted wholesaler &amp; distributor of enterprise IT hardware, thin clients, workstations, and high-performance components.
            </p>
            <div className="social-icons">
              <a href="https://www.facebook.com/profile.php?id=61592575032790#" target="_blank" rel="noreferrer" className="social-badge" title="Official Facebook Page">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span>Facebook</span>
              </a>
              <a href="https://wa.me/917942625065" target="_blank" rel="noreferrer" className="social-badge whatsapp-badge" title="Direct WhatsApp Support">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="footer-heading">Company</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/about">About Egreen</Link>
              <Link to="/products">Product Catalog</Link>
              <Link to="/contact">Contact &amp; Quotes</Link>
            </div>
          </div>

          {/* Column 3: Hardware Categories */}
          <div>
            <h4 className="footer-heading">Categories</h4>
            <div className="footer-links">
              <Link to="/products?category=thin-client">Dell &amp; HP Thin Clients</Link>
              <Link to="/products?category=mini-pc">Mini PCs &amp; Micro Towers</Link>
              <Link to="/products?category=desktop">Enterprise Desktop PCs</Link>
              <Link to="/products?category=processors">Intel Processors &amp; SSDs</Link>
            </div>
          </div>

          {/* Column 4: Contact Information */}
          <div>
            <h4 className="footer-heading">Get in Touch</h4>
            <div className="footer-contact-list">
              <a href="https://maps.google.com/maps?q=19%C2%B010'22.5%22N+72%C2%B051'27.1%22E" target="_blank" rel="noreferrer" className="footer-contact-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>Goregaon East, Mumbai,<br />Maharashtra 400063</span>
              </a>
              <a href="mailto:egreentechnology24@gmail.com" className="footer-contact-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>egreentechnology24@gmail.com</span>
              </a>
              <a href="tel:+917942625065" className="footer-contact-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>+91-7942625065</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Egreen Technology. All rights reserved.</p>
          <div className="footer-bottom-links">
            <span>Wholesale IT Hardware Supplier</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

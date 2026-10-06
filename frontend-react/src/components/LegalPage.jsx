import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/legal.css';

const LegalPage = ({ title, lastUpdated, children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="legal-page-wrapper">
      <div className="legal-page-header">
        <div className="container">
          <h1 className="legal-title">{title}</h1>
          {lastUpdated && (
            <p className="legal-last-updated">Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>
      <div className="legal-page-content container">
        <div className="legal-body">{children}</div>
        <aside className="legal-sidebar">
          <h3 className="legal-sidebar-heading">Legal</h3>
          <ul className="legal-sidebar-links">
            <li><Link to="/terms">Terms &amp; Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/refund">Refund &amp; Cancellation</Link></li>
            <li><Link to="/shipping">Shipping Policy</Link></li>
            <li><Link to="/warranty">Warranty &amp; Returns</Link></li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default LegalPage;
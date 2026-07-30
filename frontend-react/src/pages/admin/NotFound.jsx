// Admin 404 Route Handler Page
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh', 
        textAlign: 'center' 
      }}
    >
      <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '16px' }} />
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '8px' }}>
        404 - Page Not Found
      </h2>
      <p style={{ color: 'var(--admin-text-body)', maxWidth: '400px', marginBottom: '24px', fontSize: '0.95rem' }}>
        The administrative panel page you are trying to access does not exist or has been moved to another sub-route.
      </p>
      <Link to="/admin" className="admin-btn admin-btn-primary" style={{ textDecoration: 'none' }}>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;

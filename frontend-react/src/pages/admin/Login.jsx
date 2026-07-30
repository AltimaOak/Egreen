// Admin Login Page
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect immediately
  const from = location.state?.from?.pathname || location.pathname || '/admin';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      const result = await login(username, password);
      if (!result.success) {
        setFormError(result.error || 'Invalid credentials.');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-layout">
      <div className="admin-login-card">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              backgroundColor: 'var(--admin-primary)', 
              color: 'white', 
              fontWeight: 'bold',
              fontSize: '1.5rem',
              marginBottom: '12px'
            }}
          >
            E
          </div>
          <h2 className="admin-modal-title" style={{ fontSize: '1.4rem' }}>Egreen Tech Admin</h2>
          <p style={{ color: 'var(--admin-text-body)', fontSize: '0.85rem', marginTop: '4px' }}>
            Please authenticate to access the admin panel
          </p>
        </div>

        {formError && (
          <div 
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: '#EF4444', 
              padding: '10px 14px', 
              borderRadius: '8px', 
              fontSize: '0.85rem', 
              marginBottom: '20px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="username">Username</label>
            <div style={{ position: 'relative' }}>
              <span 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--admin-text-body)', 
                  display: 'flex' 
                }}
              >
                <User size={16} />
              </span>
              <input 
                type="text" 
                id="username" 
                className="admin-input" 
                style={{ paddingLeft: '38px' }}
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="admin-form-group" style={{ marginBottom: '24px' }}>
            <label className="admin-form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <span 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--admin-text-body)', 
                  display: 'flex' 
                }}
              >
                <Lock size={16} />
              </span>
              <input 
                type="password" 
                id="password" 
                className="admin-input" 
                style={{ paddingLeft: '38px' }}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="admin-btn admin-btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--admin-text-body)' }}>
          <p>Demo Username: <code>admin</code></p>
          <p>Demo Password: <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

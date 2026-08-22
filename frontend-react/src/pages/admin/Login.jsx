import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/admin/UI';

const Login = () => {
  const { login, isAuthenticated } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/admin', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (!result.success) setFormError(result.error || 'Invalid credentials.');
      else navigate('/admin', { replace: true });
    } catch { 
      setFormError('An unexpected error occurred. Please try again.'); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="admin-login-layout">
      <div className="admin-login-card">
        {/* Back Link */}
        <div style={{ marginBottom: 20 }}>
          <Link 
            to="/" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 6, 
              fontSize: '0.85rem', 
              color: 'var(--color-muted)', 
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'color 0.2s ease'
            }}
            className="hover:text-primary"
          >
            <ArrowLeft size={16} /> Back to Website
          </Link>
        </div>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <img src="/assets/egreen_logo.png" alt="Egreen Technology Logo" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.025em' }}>
            Egreen Tech Admin
          </h1>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-muted)' }}>
            Authenticate to access the admin panel
          </p>
        </div>

        {/* Error */}
        {formError && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem', color: 'var(--color-danger)', fontWeight: 600, marginBottom: 20 }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            id="email"
            label="Email"
            type="email"
            icon={<User />}
            placeholder="admin@egreen.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="email"
          />
          <Input
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={<Lock />}
            rightIcon={showPassword ? <EyeOff /> : <Eye />}
            onRightIconClick={() => setShowPassword(prev => !prev)}
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="current-password"
          />
          <div style={{ marginTop: 24 }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="admin-btn admin-btn-primary"
              style={{ width: '100%', padding: '11px', fontSize: '0.9rem', borderRadius: 12 }}
            >
              {isSubmitting ? 'Authenticating…' : 'Sign In'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
          Demo credentials: <code style={{ fontWeight: 700, color: 'var(--color-text)' }}>admin@egreen.com</code>
        </div>
      </div>
    </div>
  );
};

export default Login;

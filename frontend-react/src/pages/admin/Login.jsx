import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Lock, User } from 'lucide-react';
import { Input, Button } from '../../components/admin/UI';

const Login = () => {
  const { login, isAuthenticated } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      const result = await login(username, password);
      if (!result.success) setFormError(result.error || 'Invalid credentials.');
      else navigate('/admin', { replace: true });
    } catch { setFormError('An unexpected error occurred. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="admin-login-layout">
      <div className="admin-login-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', color: '#fff', fontWeight: 800, fontSize: '1.4rem', marginBottom: 14, boxShadow: '0 6px 20px rgba(37,99,235,0.35)' }}>
            E
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
            id="username"
            label="Username"
            type="text"
            icon={<User />}
            placeholder="Enter admin username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="username"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            icon={<Lock />}
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
          Demo credentials: <code style={{ fontWeight: 700, color: 'var(--color-text)' }}>admin</code>
        </div>
      </div>
    </div>
  );
};

export default Login;

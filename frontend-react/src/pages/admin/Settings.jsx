import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { authService } from '../../services/authService';
import { useAdmin } from '../../contexts/AdminContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FormSkeleton } from '../../components/admin/Skeleton';
import {
  Card, Button, Collapsible, Input, Select, Textarea, AdminPageHeader, Tabs, Badge,
} from '../../components/admin/UI';
import { Save, Upload, Shield, Bell, Layout, Settings as SettingsIcon, Eye, EyeOff } from 'lucide-react';

const TABS = ['General', 'Appearance', 'Site Info', 'Credentials', 'Notifications'];

const COLORS = [
  { value: '#2563EB', label: 'Blue' },
  { value: '#3B82F6', label: 'Sky' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#EF4444', label: 'Red' },
  { value: '#1E293B', label: 'Slate' },
];

const Settings = () => {
  const { showToast } = useAdmin();
  const { refreshTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('General');
  const [showPassword, setShowPassword] = useState(false);

  const [websiteName, setWebsiteName]       = useState('');
  const [logoText, setLogoText]             = useState('');
  const [primaryColor, setPrimaryColor]     = useState('#2563EB');
  const [secondaryColor, setSecondaryColor] = useState('#0F172A');
  const [footerText, setFooterText]         = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [theme, setTheme]                   = useState('light');
  const [storeEmail, setStoreEmail]         = useState('');
  const [storePhone, setStorePhone]         = useState('');
  const [storeAddress, setStoreAddress]     = useState('');
  const [adminUsername, setAdminUsername]   = useState('admin');
  const [newPassword, setNewPassword]       = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const d = await settingsService.getSettings();
      setWebsiteName(d.websiteName || '');
      setLogoText(d.logoText || '');
      setPrimaryColor(d.primaryColor || '#2563EB');
      setSecondaryColor(d.secondaryColor || '#0F172A');
      setFooterText(d.footerText || '');
      setMaintenanceMode(d.maintenanceMode || false);
      setStoreEmail(d.storeEmail || '');
      setStorePhone(d.storePhone || '');
      setStoreAddress(d.storeAddress || '');
      setTheme(d.theme || 'light');
      setAdminUsername(d.adminUsername || 'admin');
    } catch { showToast('Failed to load settings.', 'error'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    showToast('Saving…', 'loading');
    try {
      await settingsService.updateSettings({ websiteName, logoText, primaryColor, secondaryColor, footerText, maintenanceMode, storeEmail, storePhone, storeAddress, theme, adminUsername });
      showToast('Settings saved successfully', 'success');
      refreshTheme();
    } catch { showToast('Failed to save settings.', 'error'); }
  };

  const handleCredentials = async (e) => {
    e.preventDefault();
    showToast('Saving credentials…', 'loading');
    try {
      await settingsService.updateSettings({ adminUsername });
      if (newPassword) await authService.updateCredentials(adminUsername, newPassword);
      showToast('Credentials updated', 'success');
      setNewPassword('');
    } catch { showToast('Failed to update credentials.', 'error'); }
  };

  if (loading) return <FormSkeleton />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AdminPageHeader
        title="Settings"
        subtitle="Configure store details, theme, and admin credentials."
        action={
          <Button variant="primary" icon={<Save size={15} />} onClick={handleSave}>
            Save Changes
          </Button>
        }
      />

      {/* Tabs */}
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* General */}
      {activeTab === 'General' && (
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Store Info */}
            <Collapsible title="Store Information" icon={<SettingsIcon />} defaultOpen>
              <Input label="Store Name" value={websiteName} onChange={e => { setWebsiteName(e.target.value); setLogoText(e.target.value); }} required />
              <Input label="Store Email" type="email" value={storeEmail} onChange={e => setStoreEmail(e.target.value)} required />
              <Input label="Store Phone" value={storePhone} onChange={e => setStorePhone(e.target.value)} />
              <Textarea label="Store Address" value={storeAddress} onChange={e => setStoreAddress(e.target.value)} rows={3} />
            </Collapsible>


            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Logo preview */}
              <Collapsible title="Store Logo Preview" icon={<Layout />} defaultOpen>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', padding: 24, textAlign: 'center', marginBottom: 12, background: 'var(--color-background)' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text)' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>E</div>
                    {websiteName || 'Egreen'}
                  </div>
                </div>
                <Button variant="secondary" size="sm" icon={<Upload size={14} />} className="w-full" type="button">Upload Logo</Button>
              </Collapsible>

              {/* Theme Colors */}
              <Collapsible title="Brand Colors" icon={<SettingsIcon />} defaultOpen>
                <div className="admin-color-selectors" style={{ marginBottom: 12 }}>
                  {COLORS.map(c => (
                    <div
                      key={c.value}
                      title={c.label}
                      onClick={() => setPrimaryColor(c.value)}
                      className={`admin-color-circle${primaryColor === c.value ? ' active' : ''}`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
                <Input label="Hex Value" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} placeholder="#2563EB" />
              </Collapsible>

              {/* Maintenance */}
              <Collapsible title="Maintenance Mode" icon={<Layout />} defaultOpen>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', background: maintenanceMode ? 'rgba(245,158,11,0.06)' : 'var(--color-background)' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>Disable public frontend</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: 2 }}>Visitors will see a maintenance page</div>
                  </div>
                  <label className="admin-toggle-switch">
                    <input type="checkbox" checked={maintenanceMode} onChange={e => setMaintenanceMode(e.target.checked)} />
                    <span className="admin-toggle-slider" />
                  </label>
                </div>
              </Collapsible>
            </div>
          </div>
        </form>
      )}

      {/* Appearance */}
      {activeTab === 'Appearance' && (
        <Card title="Appearance Overrides" subtitle="Banner and media configuration">
          <Input label="Header Banner Image URL" defaultValue="/assets/hero_mini_pcs.png" />
          <div style={{ marginTop: 8 }}>
            <Button variant="primary" size="sm" icon={<Save size={14} />} onClick={handleSave}>Save Changes</Button>
          </div>
        </Card>
      )}

      {/* Site Info */}
      {activeTab === 'Site Info' && (
        <Card title="Site Information" subtitle="SEO and compliance details">
          <Textarea label="Footer / SEO Description" value={footerText} onChange={e => setFooterText(e.target.value)} rows={5} />
          <div style={{ marginTop: 8 }}>
            <Button variant="primary" size="sm" icon={<Save size={14} />} onClick={handleSave}>Save Changes</Button>
          </div>
        </Card>
      )}

      {/* Credentials */}
      {activeTab === 'Credentials' && (
        <form onSubmit={handleCredentials} style={{ maxWidth: 500 }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--color-border)' }}>
              <Shield size={18} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)' }}>Security Settings</h3>
            </div>
            <Input label="Admin Username" value={adminUsername} onChange={e => setAdminUsername(e.target.value)} required />
            <div className="admin-form-group">
              <label className="admin-form-label">New Password <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>(optional)</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="admin-input"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button variant="primary" type="submit" icon={<Save size={15} />}>Update Credentials</Button>
          </Card>
        </form>
      )}

      {/* Notifications */}
      {activeTab === 'Notifications' && (
        <Card title="Email Notifications" subtitle="Configure alert preferences">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { id: 'notif-orders',   label: 'Notify when new orders are placed', def: true },
              { id: 'notif-stock',    label: 'Alert when product stock is low',   def: true },
              { id: 'notif-reviews',  label: 'Send review notifications',         def: false },
            ].map(n => (
              <label key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text)' }}>
                <input type="checkbox" id={n.id} defaultChecked={n.def} style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }} />
                {n.label}
              </label>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Settings;

// Redesigned Admin Settings Management Component
import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { useAdmin } from '../../contexts/AdminContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FormSkeleton } from '../../components/admin/Skeleton';
import { Save, Upload, Shield, Bell, Layout, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { showToast } = useAdmin();
  const { refreshTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('General'); // General, Appearance, Site Info, Admin, Notifications
  
  // Settings Form States
  const [websiteName, setWebsiteName] = useState('');
  const [logoText, setLogoText] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#10B981');
  const [secondaryColor, setSecondaryColor] = useState('#111827');
  const [footerText, setFooterText] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [theme, setTheme] = useState('light');
  const [storeEmail, setStoreEmail] = useState('info@egreentech.com');
  const [storePhone, setStorePhone] = useState('+91 98765-43210');
  const [storeAddress, setStoreAddress] = useState('Mumbai, Maharashtra, India');

  // Password Update States
  const [adminUsername, setAdminUsername] = useState('admin');
  const [newPassword, setNewPassword] = useState('');

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setWebsiteName(data.websiteName || '');
      setLogoText(data.logoText || '');
      setPrimaryColor(data.primaryColor || '#10B981');
      setSecondaryColor(data.secondaryColor || '#111827');
      setFooterText(data.footerText || '');
      setMaintenanceMode(data.maintenanceMode || false);
      setTheme(data.theme || 'light');
      setAdminUsername(data.adminUsername || 'admin');
    } catch (e) {
      showToast('Failed to load settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    showToast('Saving Changes...', 'loading');

    try {
      await settingsService.updateSettings({
        websiteName,
        logoText,
        primaryColor,
        secondaryColor,
        footerText,
        maintenanceMode,
        theme,
        adminUsername
      });
      showToast('Changes Published Successfully', 'success');
      refreshTheme(); // refresh local theme variables
      loadSettings();
    } catch (err) {
      showToast('Failed to save settings configurations.', 'error');
    }
  };

  if (loading) return <FormSkeleton />;

  const themeColorsList = [
    { value: '#10B981', label: 'Emerald Green' },
    { value: '#3B82F6', label: 'Royal Blue' },
    { value: '#8B5CF6', label: 'Vibrant Purple' },
    { value: '#1E293B', label: 'Slate Dark' }
  ];

  return (
    <div style={{ textAlign: 'left' }}>
      
      {/* Settings Sub-Tabs */}
      <div className="admin-editor-tabs" style={{ marginBottom: '24px' }}>
        {['General', 'Appearance', 'Site Info', 'Admin Credentials', 'Notifications'].map(tab => (
          <button 
            key={tab}
            className={`admin-editor-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Settings form container split into Store Info and Branding Logo preview */}
      {activeTab === 'General' && (
        <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }} className="grid-cols-2">
          
          {/* Left Column: Store Information */}
          <div className="admin-card" style={{ marginBottom: 0 }}>
            <h3 className="admin-modal-title" style={{ marginBottom: '20px' }}>Store Information</h3>
            
            <div className="admin-form-group">
              <label className="admin-form-label">Store Name</label>
              <input 
                type="text" 
                className="admin-input" 
                value={websiteName}
                onChange={(e) => {
                  setWebsiteName(e.target.value);
                  setLogoText(e.target.value);
                }}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Store Email</label>
              <input 
                type="email" 
                className="admin-input" 
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid-cols-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Store Phone</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Admin Theme Base</label>
                <select 
                  className="admin-select"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="light">Light Mode Interface</option>
                  <option value="dark">Dark Mode Interface</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Store Address</label>
              <textarea 
                className="admin-textarea"
                style={{ minHeight: '60px' }}
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="admin-toggle-switch-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--admin-border)', paddingTop: '16px', marginTop: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <strong style={{ fontSize: '0.88rem', color: 'var(--admin-text-heading)' }}>Maintenance Mode</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-body)' }}>Temporarily disable the public website frontend</span>
              </div>
              <label className="admin-toggle-switch">
                <input 
                  type="checkbox" 
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                />
                <span className="admin-toggle-slider"></span>
              </label>
            </div>
          </div>

          {/* Right Column: Store Logo and theme colors */}
          <div className="flex flex-col gap-4">
            
            {/* Store logo preview card */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 className="admin-modal-title" style={{ marginBottom: '16px' }}>Store Logo</h3>
              
              <div style={{ padding: '24px', border: '1px solid var(--admin-border)', borderRadius: '10px', textAlign: 'center', marginBottom: '16px', backgroundColor: '#FAFAFA' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58 1 9.3a7.012 7.012 0 0 1-6 8.7z"></path>
                    </svg>
                  </div>
                  <span>{websiteName || 'Egreen'}</span>
                </div>
              </div>

              <button type="button" className="admin-btn admin-btn-secondary w-full" style={{ fontSize: '0.85rem' }}>
                <Upload size={14} /> Change Logo
              </button>
            </div>

            {/* Brand Color selectors */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 className="admin-modal-title" style={{ marginBottom: '16px' }}>Theme Colors</h3>
              
              <div className="admin-color-selectors" style={{ marginBottom: '16px' }}>
                {themeColorsList.map(color => (
                  <div 
                    key={color.value}
                    className={`admin-color-circle ${primaryColor === color.value ? 'active' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setPrimaryColor(color.value)}
                    title={color.label}
                  ></div>
                ))}
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-form-label">Theme Color Hex Value</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#10B981"
                />
              </div>
            </div>

            <button type="submit" className="admin-btn admin-btn-primary w-full" style={{ padding: '12px' }}>
              Save Changes
            </button>
          </div>

        </form>
      )}

      {/* RENDER OTHER SIMPLE SETTINGS TAB FOR STABILITY */}
      {activeTab === 'Appearance' && (
        <form onSubmit={handleSaveSettings} className="admin-card">
          <h3 className="admin-modal-title" style={{ marginBottom: '16px' }}>Appearance Overrides</h3>
          <div className="admin-form-group">
            <label className="admin-form-label">Website Header Banner Image Link</label>
            <input type="text" className="admin-input" defaultValue="/assets/hero_mini_pcs.png" />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary">Save Changes</button>
        </form>
      )}

      {activeTab === 'Site Info' && (
        <form onSubmit={handleSaveSettings} className="admin-card">
          <h3 className="admin-modal-title" style={{ marginBottom: '16px' }}>Site Compliance Details</h3>
          <div className="admin-form-group">
            <label className="admin-form-label">Default SEO Site Description</label>
            <textarea className="admin-textarea" value={footerText} onChange={(e) => setFooterText(e.target.value)}></textarea>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary">Save Changes</button>
        </form>
      )}

      {activeTab === 'Admin Credentials' && (
        <form onSubmit={async (e) => {
          e.preventDefault();
          showToast('Saving Credentials...', 'loading');
          await settingsService.updateSettings({ adminUsername });
          if (newPassword) {
            await authService.updateCredentials(adminUsername, newPassword);
          }
          showToast('Changes Published Successfully', 'success');
          setNewPassword('');
        }} className="admin-card" style={{ maxWidth: '460px' }}>
          <h3 className="admin-modal-title" style={{ marginBottom: '16px' }}>Update Security Details</h3>
          <div className="admin-form-group">
            <label className="admin-form-label">Admin Username</label>
            <input type="text" className="admin-input" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} required />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">New Password (Optional)</label>
            <input type="password" className="admin-input" placeholder="Type new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary">Update Credentials</button>
        </form>
      )}

      {activeTab === 'Notifications' && (
        <div className="admin-card">
          <h3 className="admin-modal-title" style={{ marginBottom: '16px' }}>Email Alerts</h3>
          <div className="admin-checkbox-group">
            <input type="checkbox" id="email-orders" className="admin-checkbox" defaultChecked />
            <label htmlFor="email-orders" className="admin-form-label" style={{ marginBottom: 0 }}>Notify me when new orders are placed</label>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;

// Redesigned Admin Settings Management Component
import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { authService } from '../../services/authService';
import { useAdmin } from '../../contexts/AdminContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FormSkeleton } from '../../components/admin/Skeleton';
import {
  Card,
  Button,
  Tabs,
  Collapsible,
  Input,
  Textarea,
} from '../../components/admin/UI';
import {
  Save,
  Upload,
  Shield,
  Bell,
  Layout,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
} from 'lucide-react';

const Settings = () => {
  const { showToast } = useAdmin();
  const { refreshTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('General');
  const [showPassword, setShowPassword] = useState(false);

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
        adminUsername,
      });
      showToast('Changes Published Successfully', 'success');
      refreshTheme();
      loadSettings();
    } catch (err) {
      showToast('Failed to save settings configurations.', 'error');
    }
  };

  const handleCredentialUpdate = async (e) => {
    e.preventDefault();
    showToast('Saving Credentials...', 'loading');
    try {
      await settingsService.updateSettings({ adminUsername });
      if (newPassword) {
        await authService.updateCredentials(adminUsername, newPassword);
      }
      showToast('Changes Published Successfully', 'success');
      setNewPassword('');
    } catch (err) {
      showToast('Failed to update credentials.', 'error');
    }
  };

  if (loading) return <FormSkeleton />;

  const themeColorsList = [
    { value: '#10B981', label: 'Emerald Green' },
    { value: '#3B82F6', label: 'Royal Blue' },
    { value: '#8B5CF6', label: 'Vibrant Purple' },
    { value: '#1E293B', label: 'Slate Dark' },
  ];

  const tabsList = ['General', 'Appearance', 'Site Info', 'Admin Credentials', 'Notifications'];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Configure store details, theme colors, and admin credentials.</p>
        </div>
        {activeTab === 'General' && (
          <Button variant="primary" size="md" icon={<Save size={16} />} onClick={handleSaveSettings}>
            Save Changes
          </Button>
        )}
      </div>

      <Tabs tabs={tabsList} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'General' && (
        <form onSubmit={handleSaveSettings}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Collapsible title="Store Information" icon={<SettingsIcon size={16} />} defaultOpen>
                <Input
                  label="Store Name"
                  value={websiteName}
                  onChange={(e) => {
                    setWebsiteName(e.target.value);
                    setLogoText(e.target.value);
                  }}
                  required
                />
                <Input
                  type="email"
                  label="Store Email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Store Phone"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    required
                  />
                  <Input
                    label="Admin Theme Base"
                    as="select"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  >
                    <option value="light">Light Mode Interface</option>
                    <option value="dark">Dark Mode Interface</option>
                  </Input>
                </div>
                <Textarea
                  label="Store Address"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  required
                  minHeight="60px"
                />
              </Collapsible>

              <Collapsible title="Maintenance Mode" icon={<Layout size={16} />} defaultOpen={false}>
                <div className="flex items-center justify-between p-3 border border-border rounded-[var(--radius-card)]">
                  <div>
                    <strong className="text-sm text-text">Temporarily disable the public website frontend</strong>
                    <p className="text-xs text-muted mt-0.5">Visitors will see a maintenance page</p>
                  </div>
                  <label className="relative inline-flex h-5 w-9 items-center rounded-full">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                    />
                    <span
                      className={`inline-block h-5 w-9 rounded-full transition ${maintenanceMode ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${maintenanceMode ? 'translate-x-5' : 'translate-x-1'}`}
                      />
                    </span>
                  </label>
                </div>
              </Collapsible>
            </div>

            <div className="space-y-4">
              <Collapsible title="Store Logo Preview" icon={<Layout size={16} />} defaultOpen>
                <div className="border border-border rounded-[var(--radius-card)] p-6 text-center mb-3 bg-muted/3">
                  <div className="flex items-center justify-center gap-2 color-text font-bold text-lg">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58 1 9.3a7.012 7.012 0 0 1-6 8.7z" />
                      </svg>
                    </div>
                    <span>{websiteName || 'Egreen'}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" icon={<Upload size={14} />} fullWidth>
                  Change Logo
                </Button>
              </Collapsible>

              <Collapsible title="Theme Colors" icon={<SettingsIcon size={16} />} defaultOpen={false}>
                <div className="flex gap-2 mb-3">
                  {themeColorsList.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition ${primaryColor === color.value ? 'border-primary' : 'border-border'}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setPrimaryColor(color.value)}
                      title={color.label}
                    />
                  ))}
                </div>
                <Input
                  label="Theme Color Hex Value"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#10B981"
                />
              </Collapsible>
            </div>
          </div>
        </form>
      )}

      {activeTab === 'Appearance' && (
        <form onSubmit={handleSaveSettings}>
          <Card>
            <h3 className="text-lg font-semibold text-text mb-4">Appearance Overrides</h3>
            <Input label="Website Header Banner Image Link" defaultValue="/assets/hero_mini_pcs.png" />
            <Button variant="primary" size="sm" icon={<Save size={14} />} type="submit">
              Save Changes
            </Button>
          </Card>
        </form>
      )}

      {activeTab === 'Site Info' && (
        <form onSubmit={handleSaveSettings}>
          <Card>
            <h3 className="text-lg font-semibold text-text mb-4">Site Compliance Details</h3>
            <Textarea label="Default SEO Site Description" value={footerText} onChange={(e) => setFooterText(e.target.value)} />
            <Button variant="primary" size="sm" icon={<Save size={14} />} type="submit">
              Save Changes
            </Button>
          </Card>
        </form>
      )}

      {activeTab === 'Admin Credentials' && (
        <form onSubmit={handleCredentialUpdate}>
          <Card className="max-w-md">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <Shield size={18} className="text-primary" />
              <h3 className="text-lg font-semibold text-text">Update Security Details</h3>
            </div>
            <Input
              label="Admin Username"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              required
            />
            <div className="relative">
              <Input
                label="New Password (Optional)"
                type={showPassword ? 'text' : 'password'}
                placeholder="Type new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</>}
                onIconClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <Button variant="primary" icon={<Save size={16} />} type="submit">
              Update Credentials
            </Button>
          </Card>
        </form>
      )}

      {activeTab === 'Notifications' && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-primary" />
            <h3 className="text-lg font-semibold text-text">Email Alerts</h3>
          </div>
          <div className="flex items-center gap-2 p-3 border border-border rounded-[var(--radius-card)]">
            <input type="checkbox" id="email-orders" className="rounded border-border text-primary focus:ring-primary" defaultChecked />
            <label htmlFor="email-orders" className="text-sm text-text">
              Notify me when new orders are placed
            </label>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Settings;


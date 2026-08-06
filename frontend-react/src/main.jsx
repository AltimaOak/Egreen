import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import './styles/variables.css';
import './styles/main.css';
import './styles/pages.css';
import './styles/admin.css';

// ── Storage migration: clear mock-seeded data on version bump ──────────────
const DATA_VERSION = '2'; // Increment this to wipe old mock data on next load
const versionKey = 'egreen_data_version';
const storedVersion = localStorage.getItem(versionKey);
if (storedVersion !== DATA_VERSION) {
  // Preserve auth so admin doesn't get logged out
  const authToken = localStorage.getItem('egreen_auth_token');
  const authUser  = localStorage.getItem('egreen_auth_user');
  const settings  = localStorage.getItem('egreen_settings');
  // Wipe all egreen_ keys
  Object.keys(localStorage).filter(k => k.startsWith('egreen_')).forEach(k => localStorage.removeItem(k));
  // Restore auth and settings
  if (authToken) localStorage.setItem('egreen_auth_token', authToken);
  if (authUser)  localStorage.setItem('egreen_auth_user', authUser);
  if (settings)  localStorage.setItem('egreen_settings', settings);
  localStorage.setItem(versionKey, DATA_VERSION);
}
// ──────────────────────────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

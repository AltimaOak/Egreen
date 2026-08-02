// Theme Config and Dynamic CSS Var Injector Context (Light Mode Only)
import React, { createContext, useState, useEffect, useContext } from 'react';
import { settingsService } from '../services/settingsService';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [themeSettings, setThemeSettings] = useState({
    theme: 'light',
    primaryColor: '#10B981',
    secondaryColor: '#111827',
    websiteName: 'Egreen Technology',
    adminName: 'Administrator',
  });

  const loadTheme = async () => {
    try {
      const settings = await settingsService.getSettings();
      setThemeSettings({
        theme: 'light',
        primaryColor: settings.primaryColor || '#10B981',
        secondaryColor: settings.secondaryColor || '#111827',
        websiteName: settings.websiteName || 'Egreen Technology',
        adminName: settings.adminName || 'Administrator',
      });
    } catch (e) {
      console.error('Failed to load theme settings', e);
    }
  };

  const adjustColorBrightness = (hex, percent) => {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);

    R = parseInt((R * (100 + percent)) / 100);
    G = parseInt((G * (100 + percent)) / 100);
    B = parseInt((B * (100 + percent)) / 100);

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    const rHex = R.toString(16).padStart(2, '0');
    const gHex = G.toString(16).padStart(2, '0');
    const bHex = B.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  };

  useEffect(() => {
    loadTheme();

    const handleSettingsUpdate = () => {
      loadTheme();
    };

    window.addEventListener('egreen_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('egreen_settings_updated', handleSettingsUpdate);
    };
  }, []);

  // Apply Light Theme only
  useEffect(() => {
    const root = document.documentElement;

    if (themeSettings.primaryColor) {
      root.style.setProperty('--color-primary', themeSettings.primaryColor);
      root.style.setProperty('--color-primary-hover', adjustColorBrightness(themeSettings.primaryColor, -15));
      root.style.setProperty('--primary', themeSettings.primaryColor);
      root.style.setProperty('--primary-hover', adjustColorBrightness(themeSettings.primaryColor, -15));
      root.style.setProperty('--accent', themeSettings.primaryColor);
      root.style.setProperty('--accent-bg', `${themeSettings.primaryColor}1a`);
      root.style.setProperty('--accent-border', `${themeSettings.primaryColor}80`);
    }

    if (themeSettings.secondaryColor) {
      root.style.setProperty('--color-text', themeSettings.secondaryColor);
      root.style.setProperty('--secondary', themeSettings.secondaryColor);
    }

    // Force Light Mode
    root.setAttribute('data-theme', 'light');
    root.classList.add('light');
    root.classList.remove('dark');
  }, [themeSettings]);

  const updateTheme = async (updates) => {
    await settingsService.updateSettings({ ...updates, theme: 'light' });
    loadTheme();
  };

  return (
    <ThemeContext.Provider
      value={{
        themeSettings,
        updateTheme,
        refreshTheme: loadTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

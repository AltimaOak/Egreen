// Theme Config and Dynamic CSS Var Injector Context
import React, { createContext, useState, useEffect, useContext } from 'react';
import { settingsService } from '../services/settingsService';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [themeSettings, setThemeSettings] = useState({
    theme: 'light', // light or dark
    primaryColor: '#10B981',
    secondaryColor: '#111827',
    websiteName: 'Egreen Technology'
  });

  const loadTheme = async () => {
    try {
      const settings = await settingsService.getSettings();
      setThemeSettings({
        theme: settings.theme || 'light',
        primaryColor: settings.primaryColor || '#10B981',
        secondaryColor: settings.secondaryColor || '#111827',
        websiteName: settings.websiteName || 'Egreen Technology'
      });
    } catch (e) {
      console.error('Failed to load theme settings', e);
    }
  };

  // Helper to adjust color hex brightness for hover states
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

    // Listen to settings update events
    const handleSettingsUpdate = () => {
      loadTheme();
    };

    window.addEventListener('egreen_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('egreen_settings_updated', handleSettingsUpdate);
    };
  }, []);

  // Apply CSS overrides to the document root element
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply primary/secondary colors
    if (themeSettings.primaryColor) {
      root.style.setProperty('--primary', themeSettings.primaryColor);
      root.style.setProperty('--primary-hover', adjustColorBrightness(themeSettings.primaryColor, -15));
      root.style.setProperty('--accent', themeSettings.primaryColor);
      root.style.setProperty('--accent-bg', `${themeSettings.primaryColor}1a`); // 10% opacity
      root.style.setProperty('--accent-border', `${themeSettings.primaryColor}80`); // 50% opacity
    }
    
    if (themeSettings.secondaryColor) {
      root.style.setProperty('--secondary', themeSettings.secondaryColor);
    }

    // Apply Light/Dark class
    if (themeSettings.theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [themeSettings]);

  const updateTheme = async (updates) => {
    await settingsService.updateSettings(updates);
    loadTheme();
  };

  return (
    <ThemeContext.Provider value={{
      themeSettings,
      updateTheme,
      refreshTheme: loadTheme
    }}>
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

// Admin Authentication and Action Context
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Update authentication state periodically or on change
  const refreshAuth = () => {
    const authed = authService.isAuthenticated();
    setIsAuthenticated(authed);
    setCurrentUser(authService.getCurrentUser());
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  /**
   * Helper to display temporary toast notifications
   * @param {string} message 
   * @param {'success'|'error'|'warning'|'info'|'loading'} type 
   * @param {number} duration 
   */
  const showToast = (message, type = 'info', duration = 3000) => {
    setToast({ show: true, message, type });
    
    // If it's a loading toast, don't auto-dismiss (it will be dismissed manually or overwritten)
    if (type !== 'loading') {
      setTimeout(() => {
        setToast(prev => (prev.message === message ? { ...prev, show: false } : prev));
      }, duration);
    }
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const loginAdmin = async (username, password) => {
    setLoading(true);
    showToast('Logging in...', 'loading');
    
    const res = await authService.login(username, password);
    setLoading(false);
    
    if (res.success) {
      refreshAuth();
      showToast('Logged in successfully', 'success');
      return { success: true };
    } else {
      showToast(res.error || 'Login failed', 'error');
      return { success: false, error: res.error };
    }
  };

  const logoutAdmin = async () => {
    showToast('Logging out...', 'loading');
    await authService.logout();
    refreshAuth();
    showToast('Logged out successfully', 'success');
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      currentUser,
      loading,
      setLoading,
      toast,
      showToast,
      hideToast,
      login: loginAdmin,
      logout: logoutAdmin,
      refreshAuth
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

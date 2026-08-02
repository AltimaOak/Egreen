// Protected Route Guard Component
import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import Login from '../../pages/admin/Login';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Login />;
  }

  return children;
};

export default ProtectedRoute;

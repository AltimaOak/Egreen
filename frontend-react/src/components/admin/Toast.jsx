// Toast Alerts Display Component — wraps UI.Toast
import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Toast as UIToast } from './UI';

const Toast = () => {
  const { toast, hideToast } = useAdmin();
  return <UIToast toast={toast} hideToast={hideToast} />;
};

export default Toast;

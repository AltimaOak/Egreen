// Toast Alerts Display Component
import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info as InfoIcon 
} from 'lucide-react';

const Toast = () => {
  const { toast, hideToast } = useAdmin();

  if (!toast.show) return null;

  const renderIcon = () => {
    switch (toast.type) {
      case 'loading':
        return <div className="admin-toast-spinner"></div>;
      case 'success':
        return <CheckCircle size={18} color="#10B981" />;
      case 'error':
        return <XCircle size={18} color="#EF4444" />;
      case 'warning':
        return <AlertTriangle size={18} color="#F59E0B" />;
      case 'info':
      default:
        return <InfoIcon size={18} color="#3B82F6" />;
    }
  };

  return (
    <div className="admin-toast-container" onClick={hideToast}>
      <div className="admin-toast" style={{ cursor: 'pointer' }}>
        {renderIcon()}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;

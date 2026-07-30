// Reusable Action Confirmation Dialog
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'primary'
}) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ maxWidth: '400px' }}>
        <div className="admin-modal-header">
          <div className="flex items-center gap-2">
            {type === 'danger' && <AlertTriangle size={20} color="#EF4444" />}
            <span className="admin-modal-title">{title}</span>
          </div>
          <button className="admin-modal-close" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>
        <div className="admin-modal-body">
          <p>{message}</p>
        </div>
        <div className="admin-modal-footer">
          <button className="admin-btn admin-btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button 
            className={`admin-btn ${type === 'danger' ? 'admin-btn-danger' : 'admin-btn-primary'}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

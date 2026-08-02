/**
 * Egreen Admin — Reusable UI Component Library
 * Premium, clean, enterprise-grade components.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, AlertTriangle, TrendingUp, TrendingDown, Check } from 'lucide-react';

/* ── Animation helpers ──────────────────────────────────── */
const spring = { type: 'spring', damping: 28, stiffness: 240 };
const fade   = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } };

/* ══════════════════════════════════════════════════════════
   BUTTON
══════════════════════════════════════════════════════════ */
export const Button = ({
  children, variant = 'primary', size = 'md',
  icon, iconPosition = 'left',
  disabled, className = '', onClick, type = 'button', title, ...rest
}) => {
  const varMap = {
    primary:   'admin-btn-primary',
    secondary: 'admin-btn-secondary',
    ghost:     'admin-btn-ghost',
    danger:    'admin-btn-danger',
  };
  const sizeMap = { sm: 'admin-btn-sm', md: '', lg: 'admin-btn-lg' };
  const iconSz  = size === 'sm' ? 13 : size === 'lg' ? 18 : 15;
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`admin-btn ${varMap[variant]} ${sizeMap[size]} ${className}`.trim()}
      {...rest}
    >
      {icon && iconPosition === 'left'  && React.cloneElement(icon, { size: iconSz })}
      {children}
      {icon && iconPosition === 'right' && React.cloneElement(icon, { size: iconSz })}
    </button>
  );
};

/* ══════════════════════════════════════════════════════════
   PAGE HEADER
══════════════════════════════════════════════════════════ */
export const AdminPageHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`admin-page-header ${className}`}>
    <div>
      <h1 className="admin-page-title">{title}</h1>
      {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
    </div>
    {action && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{action}</div>}
  </div>
);

/* ══════════════════════════════════════════════════════════
   CARD
══════════════════════════════════════════════════════════ */
export const Card = ({
  children, title, subtitle, action,
  padding = 'md', className = '', noShadow = false,
  border = true, hovered = false, onClick,
}) => {
  const padMap = { sm: '16px', md: '22px', lg: '32px', none: '0' };
  return (
    <div
      onClick={onClick}
      className={`admin-card${hovered ? ' admin-card-hover' : ''}${noShadow ? ' no-shadow' : ''} ${className}`}
      style={{
        padding: padMap[padding],
        border: border ? undefined : 'none',
        cursor: onClick ? 'pointer' : undefined,
      }}
    >
      {(title || subtitle || action) && (
        <div className="admin-card-header">
          <div>
            {title    && <h3 className="admin-card-title">{title}</h3>}
            {subtitle && <p className="admin-card-subtitle">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
};

export const AdminCard = Card;

/* ══════════════════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════════════════ */
export const StatCard = ({
  title, value, icon,
  iconBg = 'rgba(16,185,129,0.12)', iconColor = 'var(--color-primary)',
  trend, trendUp, subtitle,
}) => (
  <div className="admin-stat-card">
    <div className="admin-stat-header">
      <div>
        <div className="admin-stat-label">{title}</div>
        <div className="admin-stat-value">{value}</div>
      </div>
      <div className="admin-stat-icon" style={{ backgroundColor: iconBg, color: iconColor }}>
        {icon}
      </div>
    </div>
    {(trend !== undefined || subtitle) && (
      <div className="admin-stat-footer">
        {trend !== undefined && (
          <span className={`admin-stat-trend ${trendUp ? 'up' : 'down'}`}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
        {subtitle && <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{subtitle}</span>}
      </div>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════
   BADGE
══════════════════════════════════════════════════════════ */
export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const varMap = {
    success: 'admin-badge-success',
    warning: 'admin-badge-warning',
    danger:  'admin-badge-danger',
    info:    'admin-badge-info',
    neutral: 'admin-badge-neutral',
    indigo:  'admin-badge-indigo',
  };
  return (
    <span className={`admin-badge ${varMap[variant] ?? 'admin-badge-neutral'} ${className}`}>
      {children}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════
   INPUT
══════════════════════════════════════════════════════════ */
export const Input = React.forwardRef(({
  label, placeholder, value, onChange, onKeyPress, onBlur,
  icon, type = 'text', error, required, disabled,
  className = '', id, min, step, autoComplete,
}, ref) => (
  <div style={{ marginBottom: error ? 0 : 16 }} className={className}>
    {label && (
      <label htmlFor={id} className={`admin-form-label${required ? ' required' : ''}`}>
        {label}
      </label>
    )}
    <div className="admin-input-group">
      {icon && (
        <span className="admin-input-icon">
          {React.cloneElement(icon, { size: 15 })}
        </span>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={min}
        step={step}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={`admin-input${error ? ' error' : ''}${icon ? '' : ''}`}
        style={icon ? {} : { paddingLeft: 13 }}
      />
    </div>
    {error && <p className="admin-form-error">{error}</p>}
  </div>
));

/* ══════════════════════════════════════════════════════════
   SELECT
══════════════════════════════════════════════════════════ */
export const Select = ({
  label, value, onChange, options = [],
  placeholder, error, required, disabled, className = '', id,
}) => (
  <div style={{ marginBottom: 16 }} className={className}>
    {label && (
      <label htmlFor={id} className={`admin-form-label${required ? ' required' : ''}`}>
        {label}
      </label>
    )}
    <div style={{ position: 'relative' }}>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        className={`admin-select${error ? ' error' : ''}`}
        style={{ paddingRight: 32 }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown
        size={14}
        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', pointerEvents: 'none' }}
      />
    </div>
    {error && <p className="admin-form-error">{error}</p>}
  </div>
);

/* ══════════════════════════════════════════════════════════
   TEXTAREA
══════════════════════════════════════════════════════════ */
export const Textarea = ({
  label, placeholder, value, onChange,
  error, required, disabled, className = '',
  id, rows = 4, minHeight = '100px', style = {},
}) => (
  <div style={{ marginBottom: 16 }} className={className}>
    {label && (
      <label htmlFor={id} className={`admin-form-label${required ? ' required' : ''}`}>
        {label}
      </label>
    )}
    <textarea
      id={id}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      aria-invalid={!!error}
      className={`admin-textarea${error ? ' error' : ''}`}
      style={{ minHeight, resize: 'vertical', ...style }}
    />
    {error && <p className="admin-form-error">{error}</p>}
  </div>
);

/* ══════════════════════════════════════════════════════════
   TABLE
══════════════════════════════════════════════════════════ */
export const Table = ({
  columns = [], data = [],
  sortKey, sortOrder, onSort,
  actions, className = '',
}) => (
  <div style={{ overflowX: 'auto' }} className={className}>
    <table className="admin-table">
      <thead>
        <tr>
          {columns.map(col => (
            <th
              key={col.key}
              onClick={() => col.sortable && onSort?.(col.key, sortKey === col.key && sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{ cursor: col.sortable ? 'pointer' : undefined, userSelect: col.sortable ? 'none' : undefined }}
              className={col.className}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {col.label}
                {col.sortable && sortKey === col.key && (
                  sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                )}
              </div>
            </th>
          ))}
          {actions && <th style={{ textAlign: 'right' }}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.id ?? i}>
            {columns.map(col => (
              <td key={col.key} className={col.className}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
            {actions && <td style={{ textAlign: 'right' }}>{actions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ══════════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════════ */
export const Modal = ({ open, onClose, title, children, footer, size = 'md' }) => {
  const widthMap = { sm: 440, md: 560, lg: 760, xl: 960 };
  if (!open) return null;
  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <motion.div {...fade}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={spring}
          style={{
            position: 'relative', zIndex: 51,
            width: '100%', maxWidth: widthMap[size],
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-overlay)',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-text)' }}>{title}</h3>
            <button onClick={onClose} className="admin-topnav-icon-btn" style={{ width: 28, height: 28 }}>
              <X size={16} />
            </button>
          </div>
          <div style={{ padding: '20px 22px', maxHeight: '72vh', overflowY: 'auto' }}>{children}</div>
          {footer && (
            <div style={{ padding: '14px 22px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 8, background: 'var(--color-background)' }}>
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   DRAWER
══════════════════════════════════════════════════════════ */
export const Drawer = ({ open, onClose, title, children, footer, size = 'md' }) => {
  const widthMap = { sm: 380, md: 480, lg: 640, xl: 780 };
  if (!open) return null;
  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, overflow: 'hidden' }}>
        <motion.div {...fade}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={spring}
          style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 51,
            width: '100%', maxWidth: widthMap[size],
            background: 'var(--color-surface)',
            borderLeft: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-overlay)',
            display: 'flex', flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-text)' }}>{title}</h3>
            <button onClick={onClose} className="admin-topnav-icon-btn" style={{ width: 28, height: 28 }}>
              <X size={16} />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>{children}</div>
          {footer && (
            <div style={{ padding: '14px 22px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 8, background: 'var(--color-background)', flexShrink: 0 }}>
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   TABS
══════════════════════════════════════════════════════════ */
export const Tabs = ({ tabs = [], activeTab, onChange, className = '' }) => (
  <div className={`admin-tabs ${className}`}>
    {tabs.map(tab => {
      const key   = typeof tab === 'string' ? tab : tab.key;
      const label = typeof tab === 'string' ? tab : tab.label;
      return (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`admin-tab-btn${activeTab === key ? ' active' : ''}`}
        >
          {label}
        </button>
      );
    })}
  </div>
);

/* ══════════════════════════════════════════════════════════
   COLLAPSIBLE
══════════════════════════════════════════════════════════ */
export const Collapsible = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="admin-collapsible">
      <div className="admin-collapsible-header" onClick={() => setOpen(o => !o)}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && React.cloneElement(icon, { size: 16, color: 'var(--color-primary)' })}
          {title}
        </span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </div>
      {open && <div className="admin-collapsible-body">{children}</div>}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   CONFIRM DIALOG
══════════════════════════════════════════════════════════ */
export const ConfirmDialog = ({
  isOpen, title, message,
  confirmText = 'Delete', cancelText = 'Cancel',
  type = 'danger', onConfirm, onCancel,
}) => (
  <Modal
    open={isOpen}
    onClose={onCancel}
    title={title}
    size="sm"
    footer={
      <>
        <Button variant="secondary" size="sm" onClick={onCancel}>{cancelText}</Button>
        <Button variant={type}      size="sm" onClick={onConfirm}>{confirmText}</Button>
      </>
    }
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <AlertTriangle size={20} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: 2 }} />
      <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--color-text)' }}>{message}</p>
    </div>
  </Modal>
);

/* ══════════════════════════════════════════════════════════
   EMPTY STATE
══════════════════════════════════════════════════════════ */
export const EmptyState = ({ icon, title, description, action, className = '' }) => (
  <div className={`admin-empty-state ${className}`}>
    {icon && <div className="admin-empty-state-icon">{icon}</div>}
    <div className="admin-empty-state-title">{title}</div>
    {description && <p className="admin-empty-state-desc">{description}</p>}
    {action}
  </div>
);

/* ══════════════════════════════════════════════════════════
   TOAST (used by Toast.jsx wrapper)
══════════════════════════════════════════════════════════ */
export const Toast = ({ toast, hideToast }) => {
  if (!toast?.show) return null;
  const colors = {
    success: { bg: 'var(--color-success)',  text: '#fff' },
    error:   { bg: 'var(--color-danger)',   text: '#fff' },
    warning: { bg: 'var(--color-warning)',  text: '#fff' },
    info:    { bg: 'var(--color-blue)',     text: '#fff' },
    loading: { bg: 'var(--color-text)',     text: 'var(--color-surface)' },
  };
  const c = colors[toast.type] ?? colors.info;
  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 99 }}>
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 18px',
            borderRadius: 'var(--radius-button)',
            background: c.bg, color: c.text,
            boxShadow: 'var(--shadow-overlay)',
            fontSize: '0.85rem', fontWeight: 600,
            maxWidth: 380, minWidth: 220,
          }}
        >
          {toast.type === 'success' && <Check size={16} />}
          {toast.type === 'error' && <X size={16} />}
          <span style={{ flex: 1 }}>{toast.message}</span>
          {hideToast && (
            <button
              onClick={hideToast}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex', opacity: 0.75 }}
            >
              <X size={14} />
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   SKELETON LOADERS
══════════════════════════════════════════════════════════ */
const Shimmer = ({ h = '14px', w = '100%', r = '8px', mb = '0' }) => (
  <div style={{ height: h, width: w, borderRadius: r, background: 'linear-gradient(90deg, var(--color-border) 25%, rgba(229,231,235,0.5) 50%, var(--color-border) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', marginBottom: mb }} />
);

export const SkeletonCard = () => (
  <div className="admin-stat-card">
    <Shimmer h="12px" w="55%" mb="10px" />
    <Shimmer h="28px" w="65%" mb="14px" />
    <Shimmer h="10px" w="80%" />
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} style={{ display: 'flex', gap: 16, alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--color-border)' }}>
        {Array.from({ length: cols }).map((_, c) => (
          <Shimmer key={c} h="14px" r="6px" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonForm = () => (
  <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Shimmer h="14px" w="35%" mb="4px" />
    <Shimmer h="38px" />
    <Shimmer h="14px" w="35%" mb="4px" />
    <Shimmer h="38px" />
    <Shimmer h="14px" w="35%" mb="4px" />
    <Shimmer h="90px" />
  </div>
);

// Keyframe for shimmer (injected once via style tag)
if (typeof document !== 'undefined' && !document.getElementById('admin-ui-shimmer')) {
  const s = document.createElement('style');
  s.id = 'admin-ui-shimmer';
  s.textContent = '@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }';
  document.head.appendChild(s);
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronDown, ChevronUp, AlertTriangle, Info, TrendingUp, TrendingDown } from 'lucide-react';

const easing = [0.4, 0, 0.2, 1];

/* ==================== BUTTON ==================== */

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled,
  className = '',
  onClick,
  type = 'button',
  title,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/30',
    secondary: 'bg-surface text-text border border-border hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary/30',
    ghost: 'text-muted hover:text-text hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary/30',
    danger: 'bg-danger text-white hover:bg-danger/90 focus-visible:ring-2 focus-visible:ring-danger/30',
  };

  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`
        inline-flex items-center justify-center gap-1.5
        rounded-[var(--radius-button)] font-medium
        transition-all duration-200 ease-[${easing}]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]} ${variantClasses[variant]} ${className}
      `}
      {...props}
    >
      {icon && iconPosition === 'left' && React.cloneElement(icon, { size: iconSize })}
      {children}
      {icon && iconPosition === 'right' && React.cloneElement(icon, { size: iconSize })}
    </button>
  );
};

/* ==================== CARD ==================== */

export const Card = ({
  children,
  title,
  subtitle,
  action,
  padding = 'md',
  className = '',
  noShadow = false,
  border = true,
  hovered = false,
  onClick,
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: 'p-0',
  };

  const headerEl = title || subtitle || action;

  return (
    <div
      onClick={onClick}
      className={`
        bg-surface text-text
        ${border ? 'border border-border' : 'border-transparent'}
        rounded-[var(--radius-card)]
        ${!noShadow ? 'shadow-soft' : ''}
        ${hovered ? 'transition-shadow duration-200 hover:shadow-elevated' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {headerEl && (
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            {title && <h3 className="text-sm font-semibold text-text">{title}</h3>}
            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
};

/* ==================== INPUT ==================== */

export const Input = React.forwardRef(({
  label,
  placeholder,
  value,
  onChange,
  onKeyPress,
  icon,
  type = 'text',
  error,
  required,
  disabled,
  className = '',
  id,
  min,
  step,
  autoComplete,
  onBlur,
}, ref) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-xs font-medium text-text mb-1.5 ${required ? 'after:content-["*"] after:text-danger' : ''}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            {React.cloneElement(icon, { size: 16 })}
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
          className={`
            w-full px-3 py-2 text-sm text-text bg-surface
            border rounded-[var(--radius-input)]
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-danger' : 'border-border'}
          `}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
});

/* ==================== SELECT ==================== */

export const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  required,
  disabled,
  className = '',
  id,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-xs font-medium text-text mb-1.5 ${required ? 'after:content-["*"] after:text-danger' : ''}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          className={`
            w-full px-3 py-2 text-sm text-text bg-surface
            border rounded-[var(--radius-input)]
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none pr-9
            ${error ? 'border-danger' : 'border-border'}
          `}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
};

/* ==================== TEXTAREA ==================== */

export const Textarea = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  className = '',
  id,
  minHeight = '80px',
  rows,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-xs font-medium text-text mb-1.5 ${required ? 'after:content-["*"] after:text-danger' : ''}`}
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        aria-invalid={!!error}
        style={{ minHeight }}
        className={`
          w-full px-3 py-2 text-sm text-text bg-surface
          border rounded-[var(--radius-input)]
          focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
          disabled:opacity-50 disabled:cursor-not-allowed resize-y
          ${error ? 'border-danger' : 'border-border'}
        `}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
};

/* ==================== BADGE ==================== */

export const Badge = ({
  children,
  variant = 'neutral',
  soft = false,
  dot = false,
  className = '',
}) => {
  const baseClass = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium';

  const solidClasses = {
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    danger: 'bg-danger/15 text-danger',
    info: 'bg-blue/15 text-blue',
    primary: 'bg-primary/15 text-primary',
    neutral: 'bg-muted/10 text-muted',
  };

  const softClasses = {
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-blue/10 text-blue',
    primary: 'bg-primary/10 text-primary',
    neutral: 'bg-muted/5 text-muted',
  };

  return (
    <span className={`${baseClass} ${soft ? softClasses[variant] : solidClasses[variant]} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
};

/* ==================== TABS ==================== */

export const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div
      className={`
        inline-flex items-center gap-1 p-1 rounded-[var(--radius-button)]
        bg-muted/10 text-muted
        ${className}
      `}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`
            px-4 py-1.5 text-sm font-medium rounded-[var(--radius-button)]
            transition-all duration-200
            ${activeTab === tab
              ? 'bg-surface text-text shadow-soft'
              : 'hover:text-text'
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

/* ==================== SEPARATOR ==================== */

export const Separator = ({ className = '' }) => (
  <div className={`h-px w-full bg-border ${className}`} />
);

/* ==================== TABLE ==================== */

export const Table = ({
  columns = [],
  data = [],
  onSort,
  sortKey,
  sortOrder,
  actions,
  emptyMessage = 'No results found.',
  loading = false,
  children,
}) => {
  const handleSortClick = (col) => {
    if (!col.sortable || !onSort) return;
    if (sortKey === col.key) {
      onSort(col.key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(col.key, 'asc');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left text-xs font-medium text-muted uppercase tracking-wider py-3 ${col.sortable ? 'cursor-pointer hover:text-text' : ''} ${col.align === 'right' ? 'text-right' : ''} ${col.className || ''}`}
                onClick={() => handleSortClick(col)}
              >
                {col.sortable ? (
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      sortOrder === 'asc'
                        ? <ChevronUp size={12} />
                        : <ChevronDown size={12} />
                    )}
                  </div>
                ) : col.label}
              </th>
            ))}
            {actions && <th className="w-14 text-right text-xs font-medium text-muted uppercase">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="py-8 text-center text-muted">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="py-8 text-center text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id || row.key || Math.random()} className="border-b border-border">
                {columns.map((col) => (
                  <td key={col.key} className={`py-3 text-text align-top ${col.align === 'right' ? 'text-right' : ''} ${col.className || ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="py-3 text-right">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

/* ==================== EMPTY STATE ==================== */

export const EmptyState = ({
  icon,
  title = 'No results found',
  description = '',
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      {icon && <div className="mb-4 text-muted">{icon}</div>}
      <h4 className="text-sm font-medium text-text mb-1">{title}</h4>
      {description && <p className="text-xs text-muted max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

/* ==================== SKELETON ==================== */

export const Skeleton = ({ className = '', children }) => (
  <div className={`animate-pulse bg-muted/20 rounded-[var(--radius-input)] ${className}`}>
    {children}
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-surface border border-border rounded-[var(--radius-card)] p-6 shadow-soft animate-pulse">
    <div className="h-4 bg-muted/20 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-muted/20 rounded w-1/2 mb-3"></div>
    <div className="h-4 bg-muted/20 rounded w-full"></div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 6 }) => (
  <div className="space-y-2">
    <div className="flex gap-4 pb-3 border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-3 bg-muted/20 rounded w-16 flex-1"></div>
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 py-2">
        {Array.from({ length: cols }).map((_, j) => (
          <div key={j} className="h-3 bg-muted/20 rounded flex-1"></div>
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonForm = () => (
  <div className="space-y-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-3 bg-muted/20 rounded w-1/4"></div>
        <div className="h-10 bg-muted/20 rounded-[var(--radius-input)] w-full"></div>
      </div>
    ))}
  </div>
);

/* ==================== MODAL ==================== */

export const Modal = ({
  open,
  onClose,
  title,
  size = 'md',
  type = 'default',
  footer,
  children,
}) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`bg-surface border border-border rounded-[var(--radius-card)] shadow-elevated w-full mx-4 ${sizes[size]}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18, ease: easing }}
            >
              <div className="p-6">
                {title && (
                  <div className="flex items-center gap-3 mb-4">
                    {type === 'danger' && <AlertTriangle size={20} className="text-danger" />}
                    <h3 className="text-base font-semibold text-text">{title}</h3>
                  </div>
                )}
                <div className="text-sm text-muted">{children}</div>
              </div>
              {footer && <div className="border-t border-border px-6 py-4 flex gap-2 justify-end">{footer}</div>}
              {!footer && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={onClose}
                    className="text-muted hover:text-text rounded transition-colors"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ==================== DRAWER ==================== */

export const Drawer = ({
  open,
  onClose,
  title,
  side = 'right',
  size = 'md',
  footer,
  children,
}) => {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = '';
      }, 220);
      return () => clearTimeout(timer);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '2xl': 'max-w-3xl',
  };

  const sideConfig = {
    right: { translate: '100%', anchor: 'right-0 top-0 h-full' },
    left: { translate: '-100%', anchor: 'left-0 top-0 h-full' },
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={`fixed ${sideConfig[side].anchor} z-50 flex flex-col bg-surface border-border shadow-elevated h-full overflow-hidden ${sizes[size]}`}
            initial={{ x: sideConfig[side].translate }}
            animate={{ x: 0 }}
            exit={{ x: sideConfig[side].translate }}
            transition={{ duration: 0.22, ease: easing }}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-base font-semibold text-text">{title}</h3>
              <button
                onClick={onClose}
                className="text-muted hover:text-text rounded transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
            {footer && <div className="border-t border-border p-4 flex gap-2 justify-end">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ==================== TOAST ==================== */

const toastIcons = {
  loading: null,
  success: <Check size={18} />,
  error: <X size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

const toastColors = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-blue',
  loading: 'text-muted',
};

export const Toast = ({ toast, hideToast }) => {
  if (!toast || !toast.show) return null;

  const icon = toastIcons[toast.type] || toastIcons.info;
  const colorClass = toastColors[toast.type] || toastColors.info;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-[var(--radius-button)] shadow-elevated"
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.18, ease: easing }}
        onClick={hideToast}
      >
        <span className={colorClass}>{icon}</span>
        <span className="text-sm text-text">{toast.message}</span>
      </motion.div>
    </AnimatePresence>
  );
};

/* ==================== CONFIRM DIALOG ==================== */

export const ConfirmDialog = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'primary',
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onCancel}
      title={title}
      type={type === 'danger' ? 'danger' : 'default'}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onCancel}>{cancelText}</Button>
          <Button
            variant={type === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
          >{confirmText}</Button>
        </>
      }
    >
      {message}
    </Modal>
  );
};

/* ==================== STAT CARD ==================== */

export const StatCard = ({
  title,
  value,
  icon,
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
  trend,
  trendUp,
  subtitle,
}) => {
  return (
    <div className="bg-surface border border-border rounded-[var(--radius-card)] p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted uppercase tracking-wider">{title}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <span className="text-2xl font-semibold text-text">{value}</span>
        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
      </div>
      {trend !== undefined && (
        <span className={`inline-flex items-center gap-1 mt-2 text-xs font-medium ${trendUp ? 'text-success' : 'text-danger'}`}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
         </span>
       )}
     </div>
  );
};

/* ==================== COLLAPSIBLE SECTION ==================== */

export const Collapsible = ({ title, icon, defaultOpen = true, children, className = '' }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`border border-border rounded-[var(--radius-card)] mb-4 bg-surface ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 p-4 text-left text-sm font-medium text-text hover:bg-muted/5"
      >
        {icon && React.cloneElement(icon, { size: 16 })}
        <span>{title}</span>
        {open ? <ChevronUp size={16} className="ml-auto text-muted" /> : <ChevronDown size={16} className="ml-auto text-muted" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: easing }}
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FormField = ({ label, children, required, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label className="block text-xs font-medium text-text mb-1.5">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
    )}
    {children}
  </div>
);



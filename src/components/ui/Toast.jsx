import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';

const Toast = () => {
  const { toasts, removeToast } = useExpense();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle : AlertCircle;
        const iconColor = toast.type === 'success' ? 'var(--success)' : 'var(--danger)';
        
        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <Icon size={18} style={{ color: iconColor, flexShrink: 0 }} />
            <span style={{ flexGrow: 1, paddingRight: '0.5rem' }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0
              }}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;

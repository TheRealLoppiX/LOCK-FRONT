import React from 'react';
import { X, WarningCircle, CheckCircle, Info } from '@phosphor-icons/react';
import './Toast.css';

export interface ToastItem {
  id: number;
  type: 'error' | 'success' | 'info';
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

const ICONS = {
  error: WarningCircle,
  success: CheckCircle,
  info: Info,
};

const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" role="region" aria-live="polite">
      {toasts.map((t) => {
        const Icon = ICONS[t.type];
        return (
          <div key={t.id} className={`toast-item toast-${t.type}`}>
            <Icon size={20} weight="bold" className="toast-icon" />
            <span className="toast-message">{t.message}</span>
            {t.actionLabel && t.onAction && (
              <button
                className="toast-action"
                onClick={() => {
                  t.onAction?.();
                  onDismiss(t.id);
                }}
              >
                {t.actionLabel}
              </button>
            )}
            <button className="toast-close" aria-label="Fechar aviso" onClick={() => onDismiss(t.id)}>
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;

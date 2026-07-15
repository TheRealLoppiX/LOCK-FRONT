import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import Toast, { ToastItem } from '../components/Toast';

interface ShowToastOptions {
  type?: ToastItem['type'];
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextValue {
  showToast: (options: ShowToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const AUTO_DISMISS_MS = 6000;
const AUTO_DISMISS_WITH_ACTION_MS = 10000;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'error', message, actionLabel, onAction }: ShowToastOptions) => {
      setToasts((prev) => {
        // Evita empilhar avisos idênticos (ex: duas telas buscando o mesmo
        // recurso falho ao mesmo tempo).
        if (prev.some((t) => t.type === type && t.message === message)) return prev;
        return [...prev, { id: nextId.current, type, message, actionLabel, onAction }];
      });
      // Efeitos colaterais (gerar id, agendar timeout) ficam fora do updater
      // funcional acima — o StrictMode do React invoca updaters duas vezes
      // em dev, o que duplicaria o id e o timer se estivessem lá dentro.
      const id = nextId.current++;
      window.setTimeout(() => dismiss(id), actionLabel ? AUTO_DISMISS_WITH_ACTION_MS : AUTO_DISMISS_MS);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de um ToastProvider');
  return ctx;
}

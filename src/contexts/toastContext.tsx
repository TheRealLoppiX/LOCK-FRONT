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
      // Gera o id ANTES do updater e reusa a mesma constante nos dois
      // lugares — o updater roda de forma assíncrona (inclusive duas vezes
      // em StrictMode), então ler `nextId.current` de novo lá dentro pegaria
      // o valor já incrementado por esta linha, descasando do id agendado
      // para o auto-dismiss abaixo e fazendo o toast nunca sumir sozinho.
      const id = nextId.current++;
      setToasts((prev) => {
        // Evita empilhar avisos idênticos (ex: duas telas buscando o mesmo
        // recurso falho ao mesmo tempo).
        if (prev.some((t) => t.type === type && t.message === message)) return prev;
        return [...prev, { id, type, message, actionLabel, onAction }];
      });
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

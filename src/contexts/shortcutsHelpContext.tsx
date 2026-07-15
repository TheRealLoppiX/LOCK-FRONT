import React, { createContext, useCallback, useContext, useState } from 'react';

interface ShortcutsHelpContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ShortcutsHelpContext = createContext<ShortcutsHelpContextValue | undefined>(undefined);

export const ShortcutsHelpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ShortcutsHelpContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ShortcutsHelpContext.Provider>
  );
};

export function useShortcutsHelp(): ShortcutsHelpContextValue {
  const ctx = useContext(ShortcutsHelpContext);
  if (!ctx) throw new Error('useShortcutsHelp deve ser usado dentro de um ShortcutsHelpProvider');
  return ctx;
}

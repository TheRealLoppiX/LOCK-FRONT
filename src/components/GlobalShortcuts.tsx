import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommandPalette } from '../contexts/commandPaletteContext';
import { useShortcutsHelp } from '../contexts/shortcutsHelpContext';

const NAV_SHORTCUTS: Record<string, string> = {
  d: '/dashboard',
  c: '/chat',
  b: '/biblioteca',
  s: '/simulados',
  r: '/leaderboard',
  p: '/profile',
};

// Atalhos de teclado globais, montados uma vez em AppShell. Segue o padrão
// de apps como Gmail/Linear/GitHub: teclas de letra única navegam direto,
// mas só quando o usuário não está digitando em nenhum campo.
const GlobalShortcuts: React.FC = () => {
  const { isOpen: isPaletteOpen, toggle: togglePalette } = useCommandPalette();
  const { isOpen: isHelpOpen, open: openHelp } = useShortcutsHelp();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePalette();
        return;
      }

      if (isPaletteOpen || isHelpOpen || isMod || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const isTyping =
        !!target &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable);
      if (isTyping) return;

      // Evita abandonar um diálogo aberto (ex: confirmação de exclusão em
      // lote) navegando pra outra rota no meio de uma ação destrutiva.
      if (document.querySelector('[role="dialog"], [role="alertdialog"]')) return;

      if (e.key === '?') {
        e.preventDefault();
        openHelp();
        return;
      }

      const path = NAV_SHORTCUTS[e.key.toLowerCase()];
      if (path) {
        e.preventDefault();
        navigate(path);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaletteOpen, isHelpOpen, togglePalette, openHelp, navigate]);

  return null;
};

export default GlobalShortcuts;

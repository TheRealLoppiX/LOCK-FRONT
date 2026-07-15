import React, { useEffect, useRef } from 'react';
import { Keyboard } from '@phosphor-icons/react';
import './ShortcutsHelp.css';

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts: { keys: string; description: string }[] = [
  { keys: 'Ctrl/Cmd + K', description: 'Abrir busca global' },
  { keys: 'D', description: 'Ir para o Dashboard' },
  { keys: 'C', description: 'Ir para o Chat da Aegis' },
  { keys: 'B', description: 'Ir para a Biblioteca' },
  { keys: 'S', description: 'Ir para os Simulados' },
  { keys: 'R', description: 'Ir para o Ranking' },
  { keys: 'P', description: 'Ir para o Perfil' },
  { keys: '?', description: 'Abrir esta ajuda' },
  { keys: 'Esc', description: 'Fechar diálogos e modais' },
];

const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ isOpen, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="shortcuts-help-overlay" onClick={onClose}>
      <div className="shortcuts-help-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="shortcuts-help-header">
          <Keyboard size={22} weight="bold" />
          <h3>Atalhos de Teclado</h3>
        </div>
        <ul className="shortcuts-help-list">
          {shortcuts.map((s) => (
            <li key={s.keys}>
              <kbd>{s.keys}</kbd>
              <span>{s.description}</span>
            </li>
          ))}
        </ul>
        <p className="shortcuts-help-note">
          Os atalhos de letra única não funcionam enquanto você está digitando em um campo de texto.
        </p>
        <button ref={closeRef} className="shortcuts-help-close" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ShortcutsHelp;

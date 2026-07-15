import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SquaresFour, ChatCircleDots, Trophy, Gear, SignOut, List, X, MagnifyingGlass, Keyboard } from '@phosphor-icons/react';
import { useAuth } from '../contexts/authContext';
import { useCommandPalette } from '../contexts/commandPaletteContext';
import { useShortcutsHelp } from '../contexts/shortcutsHelpContext';
import logoLock from '../assets/Logo lock.png';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { open: openPalette } = useCommandPalette();
  const { open: openShortcutsHelp } = useShortcutsHelp();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setIsMobileOpen((v) => !v)}
        aria-label={isMobileOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isMobileOpen}
      >
        {isMobileOpen ? <X weight="bold" /> : <List weight="bold" />}
      </button>

      {isMobileOpen && <div className="sidebar-backdrop" onClick={closeMobile} />}

      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <img src={logoLock} alt="LOCK" className="sidebar-logo" />
          <div className="sidebar-brand-text">
            <span className="sidebar-title">LOCK</span>
            <span className="sidebar-subtitle">Cybersecurity Training</span>
          </div>
        </div>

        <button type="button" className="sidebar-search-btn" onClick={() => { openPalette(); closeMobile(); }}>
          <MagnifyingGlass weight="bold" />
          <span>Buscar</span>
          <kbd>Ctrl K</kbd>
        </button>

        <nav className="sidebar-links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <SquaresFour weight="bold" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <ChatCircleDots weight="bold" />
            <span>Chat — Aegis</span>
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <Trophy weight="bold" />
            <span>Ranking</span>
          </NavLink>
        </nav>

        <div className="sidebar-actions">
          <NavLink to="/profile" className="sidebar-avatar-link" title="Perfil" onClick={closeMobile}>
            <img
              src={user?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`}
              alt="Avatar do usuário"
              className="sidebar-avatar"
            />
            <span className="sidebar-user-name">{user?.name}</span>
          </NavLink>
          <NavLink to="/settings" className="sidebar-icon-btn" title="Configurações" onClick={closeMobile}>
            <Gear weight="bold" />
            <span>Configurações</span>
          </NavLink>
          <button
            type="button"
            className="sidebar-icon-btn"
            title="Atalhos de teclado"
            onClick={() => { openShortcutsHelp(); closeMobile(); }}
          >
            <Keyboard weight="bold" />
            <span>Atalhos</span>
          </button>
          <button onClick={logout} className="sidebar-logout-btn" title="Sair">
            <SignOut weight="bold" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

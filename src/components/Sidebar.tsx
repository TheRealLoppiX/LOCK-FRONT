import React from 'react';
import { NavLink } from 'react-router-dom';
import { SquaresFour, ChatCircleDots, Trophy, Gear, SignOut } from '@phosphor-icons/react';
import { useAuth } from '../contexts/authContext';
import logoLock from '../assets/Logo lock.png';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logoLock} alt="LOCK" className="sidebar-logo" />
        <div className="sidebar-brand-text">
          <span className="sidebar-title">LOCK</span>
          <span className="sidebar-subtitle">Cybersecurity Training</span>
        </div>
      </div>

      <nav className="sidebar-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <SquaresFour weight="bold" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/chat"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <ChatCircleDots weight="bold" />
          <span>Chat — Aegis</span>
        </NavLink>
        <NavLink
          to="/leaderboard"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Trophy weight="bold" />
          <span>Ranking</span>
        </NavLink>
      </nav>

      <div className="sidebar-actions">
        <NavLink to="/profile" className="sidebar-avatar-link" title="Perfil">
          <img
            src={user?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`}
            alt="Avatar do usuário"
            className="sidebar-avatar"
          />
          <span className="sidebar-user-name">{user?.name}</span>
        </NavLink>
        <NavLink to="/settings" className="sidebar-icon-btn" title="Configurações">
          <Gear weight="bold" />
          <span>Configurações</span>
        </NavLink>
        <button onClick={logout} className="sidebar-logout-btn" title="Sair">
          <SignOut weight="bold" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

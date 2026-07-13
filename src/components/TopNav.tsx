import React from 'react';
import { NavLink } from 'react-router-dom';
import { SquaresFour, ChatCircleDots, Gear, SignOut } from '@phosphor-icons/react';
import { useAuth } from '../contexts/authContext';
import logoLock from '../assets/Logo lock.png';
import './TopNav.css';

const TopNav: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="top-nav">
      <div className="top-nav-brand">
        <img src={logoLock} alt="LOCK" className="top-nav-logo" />
        <div className="top-nav-brand-text">
          <span className="top-nav-title">LOCK</span>
          <span className="top-nav-subtitle">Cybersecurity Training</span>
        </div>
      </div>

      <nav className="top-nav-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}
        >
          <SquaresFour weight="bold" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/chat"
          className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}
        >
          <ChatCircleDots weight="bold" />
          <span>Chat — Aegis</span>
        </NavLink>
      </nav>

      <div className="top-nav-actions">
        <NavLink to="/profile" className="top-nav-avatar-link" title="Perfil">
          <img
            src={user?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`}
            alt="Avatar do usuário"
            className="top-nav-avatar"
          />
        </NavLink>
        <NavLink to="/settings" className="top-nav-icon-btn" title="Configurações">
          <Gear weight="bold" />
        </NavLink>
        <button onClick={logout} className="top-nav-logout-btn" title="Sair">
          <SignOut weight="bold" />
        </button>
      </div>
    </header>
  );
};

export default TopNav;

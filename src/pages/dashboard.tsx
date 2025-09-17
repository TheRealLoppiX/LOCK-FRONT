import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { CaretDown, Gear, SignOut, FilePdf, Article, Image as ImageIcon } from '@phosphor-icons/react';
import HexagonBackground from '../components/hexagonobg';
import './dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLabsOpen, setIsLabsOpen] = useState(false);
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <HexagonBackground />
      <header className="dashboard-header">
        <div className="header-left">
          <Link to="/profile" className="profile-avatar-link">
            <img 
              src={user?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`} 
              alt="Avatar do Usuário" 
              className="profile-avatar"
            />
          </Link>
          <div className="welcome-message">
            <h1>Bem-vindo, {user?.name}!</h1>
            <p>Selecione uma opção abaixo para começar.</p>
          </div>
        </div>
        <div className="header-right">
          <Link to="/settings" className="settings-icon-link" title="Configurações">
            <Gear weight="bold" className="settings-icon" />
          </Link>
          <button onClick={handleLogout} className="logout-btn" title="Sair">
            <SignOut weight="bold" />
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-grid">
          {/* Card de Laboratórios (Esquerda) */}
          <div className="dashboard-card">
            <div className="dropdown-header" onClick={() => setIsLabsOpen(!isLabsOpen)}>
              <div className="card-content">
                <h2>Laboratórios</h2>
                <p>Selecione uma categoria para ver os desafios disponíveis.</p>
              </div>
              <CaretDown weight="bold" className={`caret-icon ${isLabsOpen ? 'open' : ''}`} />
            </div>
            {isLabsOpen && (
              <div className="dropdown-content">
                <Link to="/labs/sql-injection" className="dropdown-item">SQL Injection</Link>
                <Link to="/labs/brute-force" className="dropdown-item">Brute Force</Link>
                <Link to="/labs/xss" className="dropdown-item">Cross-Site Scripting (XSS)</Link>
              </div>
            )}
          </div>

          {/* Card de Materiais de Estudo (Direita) */}
          <div className="dashboard-card">
            <div className="dropdown-header" onClick={() => setIsMaterialsOpen(!isMaterialsOpen)}>
              <div className="card-content">
                <h2>Materiais de Estudo</h2>
                <p>Acesse guias, artigos e recursos para aprofundar seu conhecimento.</p>
              </div>
              <CaretDown weight="bold" className={`caret-icon ${isMaterialsOpen ? 'open' : ''}`} />
            </div>
            {isMaterialsOpen && (
              <div className="dropdown-content">
                <a href="#" className="dropdown-item"><FilePdf size={20} /> Guia de SQL Injection (PDF)</a>
                <a href="#" className="dropdown-item"><Article size={20} /> Entendendo XSS (Artigo)</a>
                <a href="#" className="dropdown-item"><ImageIcon size={20} /> Infográfico de Phishing</a>
              </div>
            )}
          </div>
        </div>

        {/* Botão de Quizzes (Abaixo) */}
        <div className="quizzes-section">
          <Link to="/quizzes" className="quizzes-btn">
            Testar meus Conhecimentos (Quizzes)
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
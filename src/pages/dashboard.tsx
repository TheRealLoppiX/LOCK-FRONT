import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CaretDown, Gear, SignOut, Flask, BookOpen, Exam, 
  FilePdf, Article, Question 
} from '@phosphor-icons/react';
import HexagonBackground from '../components/hexagonobg';
import './dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isLabsOpen, setIsLabsOpen] = useState(false);
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
  const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <HexagonBackground />
      <header className="dashboard-header">
        {/* ... (código do header continua o mesmo) ... */}
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

      <main className="dashboard-grid">
        {/* Coluna da Esquerda */}
        <div className="left-column">
          {/* Card de Laboratórios */}
          <div className="dashboard-card">
            <div className="dropdown-header" onClick={() => setIsLabsOpen(!isLabsOpen)}>
              <div className="card-icon"><Flask weight="bold" /></div>
              <div className="card-content"><h2>Laboratórios</h2><p>Coloque seus conhecimentos em prática.</p></div>
              <CaretDown weight="bold" className={`caret-icon ${isLabsOpen ? 'open' : ''}`} />
            </div>
            {/* ALTERADO: Agora usamos classes condicionais em vez de '&&' */}
            <div className={`dropdown-content ${isLabsOpen ? 'open' : ''}`}>
              <Link to="/labs/sql-injection" className="dropdown-item">SQL Injection</Link>
              <Link to="/labs/brute-force" className="dropdown-item">Brute Force</Link>
              <Link to="/labs/xss" className="dropdown-item">Cross-Site Scripting (XSS)</Link>
            </div>
          </div>

          {/* Card de Quizzes */}
          <div className="dashboard-card">
            <div className="dropdown-header" onClick={() => setIsQuizzesOpen(!isQuizzesOpen)}>
              <div className="card-icon"><Exam weight="bold" /></div>
              <div className="card-content">
                <h2>Quizzes</h2>
                <p>Teste sua compreensão teórica dos temas.</p>
              </div>
              <CaretDown weight="bold" className={`caret-icon ${isQuizzesOpen ? 'open' : ''}`} />
            </div>
            {isQuizzesOpen && (
              <div className="dropdown-content">
                {/* ATUALIZADO: Este link agora aponta para a nova página */}
                <Link to="/quizzes/burp-suite" className="dropdown-item">
                  <Question size={20} /> Burp Suite
                </Link>
                {/* (Mais quizzes podem ser adicionados aqui no futuro) */}
              </div>
            )}
          </div>
        </div>

        {/* Coluna da Direita */}
        <div className="right-column">
          {/* Card de Materiais de Estudo */}
          <div className="dashboard-card">
            <div className="dropdown-header" onClick={() => setIsMaterialsOpen(!isMaterialsOpen)}>
              <div className="card-icon"><BookOpen weight="bold" /></div>
              <div className="card-content"><h2>Materiais de Estudo</h2><p>Acesse guias e artigos para aprofundar.</p></div>
              <CaretDown weight="bold" className={`caret-icon ${isMaterialsOpen ? 'open' : ''}`} />
            </div>
            {/* ALTERADO: Agora usamos classes condicionais em vez de '&&' */}
            <div className={`dropdown-content ${isMaterialsOpen ? 'open' : ''}`}>
              <a href="#" className="dropdown-item"><FilePdf size={20} /> Guia de SQL Injection (PDF)</a>
              <a href="#" className="dropdown-item"><Article size={20} /> Entendendo XSS (Artigo)</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
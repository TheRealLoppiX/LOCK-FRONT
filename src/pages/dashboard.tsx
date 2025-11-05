import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CaretDown, Gear, SignOut, Flask, BookOpen, Exam, 
  Question, Info, Shuffle // Imports limpos
} from '@phosphor-icons/react';
import HexagonBackground from '../components/hexagonobg';
import InfoModal from '../components/InfoModal'; // NOVO: Importa o modal
import './dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isLabsOpen, setIsLabsOpen] = useState(false);
  const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
  
  // NOVO: Estado do modal movido para o lugar certo
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

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
        <div className="header-right header-icons"> {/* Classe adicionada */}
          
          {/* NOVO: Ícone de "Info" que abre o modal */}
          <button 
            className="icon-button" 
            onClick={() => setIsInfoModalOpen(true)} 
            title="Sobre o Projeto"
          >
            <Info weight="bold" />
          </button>

          <Link to="/settings" className="icon-button" title="Configurações">
            <Gear weight="bold" />
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
              <div className="card-content">
                <h2>Laboratórios</h2>
                <p>Coloque seus conhecimentos em prática.</p>
              </div>
              <CaretDown weight="bold" className={`caret-icon ${isLabsOpen ? 'open' : ''}`} />
            </div>
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
              <div className="card-content"><h2>Quizzes</h2><p>Teste sua compreensão teórica dos temas.</p></div>
              <CaretDown weight="bold" className={`caret-icon ${isQuizzesOpen ? 'open' : ''}`} />
            </div>
            <div className={`dropdown-content ${isQuizzesOpen ? 'open' : ''}`}>
              <Link to="/quizzes/variado" className="dropdown-item">
                <Shuffle size={20} /> Tema Variado
              </Link>
              <Link to="/quizzes/burp-suite" className="dropdown-item"><Question size={20} /> Burp Suite</Link>
              <Link to="/quizzes/tcpdump" className="dropdown-item"><Question size={20} /> TCPDump</Link>
              <Link to="/quizzes/nmap" className="dropdown-item"><Question size={20} /> NMap</Link>
            </div>
          </div>
        </div>

        {/* Coluna da Direita */}
        <div className="right-column">
          {/* Card de Materiais de Estudo */}
          <Link to="/biblioteca" className="dashboard-card-link">
            <div className="dashboard-card">
              <div className="dropdown-header">
                <div className="card-icon"><BookOpen weight="bold" /></div>
                <div className="card-content">
                  <h2>Biblioteca</h2>
                  <p>Acesse guias, artigos e livros para aprofundar seu conhecimento.</p>
                </div>
              </div>
            </div>
          </Link>

          {/* O card "Sobre o LOCK" foi removido daqui e 
              colocado no ícone "Info" no cabeçalho */}

        </div>
      </main>

      {/* NOVO: Renderiza o Modal (ele só aparece se isOpen for true) */}
      <InfoModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
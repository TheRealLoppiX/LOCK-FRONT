import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CaretDown, Gear, SignOut, Flask, BookOpen, Exam, 
  FilePdf, Article, Question, Info, Users, Atom // Adicionados ícones para o "Sobre Nós"
} from '@phosphor-icons/react';
import HexagonBackground from '../components/hexagonobg';
import './dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isLabsOpen, setIsLabsOpen] = useState(false);
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
  const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false); // Novo estado para o "Sobre Nós"

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
              <Link to="/quizzes/burp-suite" className="dropdown-item"><Question size={20} /> Burp Suite</Link>
              <Link to="/quizzes/tcpdump" className="dropdown-item"><Question size={20} /> TCPDump</Link>
              <Link to="/quizzes/wireshark" className="dropdown-item"><Question size={20} /> Wireshark</Link>
            </div>
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
            <div className={`dropdown-content ${isMaterialsOpen ? 'open' : ''}`}>
              <a href="#" className="dropdown-item"><FilePdf size={20} /> Guia de SQL Injection (PDF)</a>
              <a href="#" className="dropdown-item"><Article size={20} /> Entendendo XSS (Artigo)</a>
            </div>
          </div>

          {/* ====================================================== */}
          {/* CARD "SOBRE NÓS" AGORA É EXPANSÍVEL E FORMATADO      */}
          {/* ====================================================== */}
          <div className="dashboard-card">
            <div className="dropdown-header" onClick={() => setIsAboutUsOpen(!isAboutUsOpen)}>
              <div className="card-icon"><Info weight="bold" /></div>
              <div className="card-content">
                <h2>Sobre o LOCK</h2>
                <p>Conheça o projeto.</p>
              </div>
              <CaretDown weight="bold" className={`caret-icon ${isAboutUsOpen ? 'open' : ''}`} />
            </div>
            <div className={`dropdown-content ${isAboutUsOpen ? 'open' : ''}`}>
              <div className="about-us-text">
                <p>O Laboratório Online de Cibersegurança com Kali Linux (LOCK) nasce em meio à necessidade de um meio de pesquisa, estudo e aprendizagem prática sobre segurança e pentesting, principalmente na realidade do Instituto Federal do Sertão Pernambucano (IFSertão-PE) - Campus Salgueiro.</p>
                <p>A equipe, composta por membros do Campus Salgueiro do IF Sertão-PE, tem como objetivo investigar, pesquisar, desenvolver, comprovar e aplicar tecnologias relacionadas ao contexto da cibersegurança em estado da atualidade.</p>
                <p>Diante disso, o grupo busca meios de transformar a cibersegurança em uma aprendizagem prática e dinâmica para incentivar a propagação do conhecimento, mitigar vulnerabilidades comuns, promover boas práticas de segurança da informação e preparar discentes e docentes para enfrentar cenários reais de ameaças cibernéticas.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
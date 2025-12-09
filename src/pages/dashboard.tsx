import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CaretDown, Gear, SignOut, Flask, BookOpen, Exam, 
  Question, Info, Shuffle,
  RocketLaunch, FilePdf, Crown // Ícone da Coroa importado
} from '@phosphor-icons/react';
import HexagonBackground from '../components/hexagonobg';
import InfoModal from '../components/InfoModal';
import './dashboard.css';
import logoLock from '../assets/Logo lock.png';

type GuidedStepKey = 'step1' | 'step2' | 'step3' | 'step4' | 'step5';

// Interface auxiliar para garantir que o TS entenda o campo is_admin
interface UserWithRole {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  is_admin?: boolean;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Cast para acessar a propriedade is_admin com segurança
  const currentUser = user as UserWithRole;
  const isAdmin = currentUser?.is_admin === true;

  const [isLabsOpen, setIsLabsOpen] = useState(false);
  const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isGuidedOpen, setIsGuidedOpen] = useState(false);
  const [isExercíciosOpen, setisExercíciosOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false); // Estado para o card de Admin
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  
  const [guidedSteps, setGuidedSteps] = useState(() => {
    const savedSteps = localStorage.getItem('lock-guided-steps');
    if (savedSteps) {
      return JSON.parse(savedSteps);
    }
    return {
      step1: false, step2: false, step3: false, step4: false, step5: false,
    };
  });

  const handleStepToggle = (step: GuidedStepKey) => {
    setGuidedSteps((prev: Record<GuidedStepKey, boolean>) => {
      const newSteps = { ...prev, [step]: !prev[step] };
      localStorage.setItem('lock-guided-steps', JSON.stringify(newSteps));
      return newSteps;
    });
  };

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
        <div className="header-right header-icons">
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
          
          {/* ====================================================== */}
          {/* PAINEL ADMINISTRATIVO (SÓ APARECE SE FOR ADMIN)        */}
          {/* ====================================================== */}
          {isAdmin && (
            <div className="dashboard-card admin-card">
              <div className="dropdown-header" onClick={() => setIsAdminOpen(!isAdminOpen)}>
                <div className="card-icon" style={{ color: '#FFD700' }}>
                  <Crown weight="bold" />
                </div>
                <div className="card-content">
                  <h2 style={{ color: '#FFD700' }}>Painel Admin</h2>
                  <p>Gerenciamento do sistema.</p>
                </div>
                <CaretDown weight="bold" className={`caret-icon ${isAdminOpen ? 'open' : ''}`} style={{ color: '#FFD700' }} />
              </div>
              <div className={`dropdown-content ${isAdminOpen ? 'open' : ''}`}>
                <Link to="/admin/questions" className="dropdown-item" style={{ color: '#FFD700' }}>
                  ➕ Cadastrar Questões
                </Link>
                {/* Aqui você pode adicionar mais funções de admin */}
              </div>
            </div>
          )}

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

          {/* Card de Exercícios*/}
          <div className="dashboard-card">
            <div className="dropdown-header" onClick={() => setisExercíciosOpen(!isExercíciosOpen)}>
              <div className="card-icon"><Exam weight="bold" /></div>
              <div className="card-content"><h2>Exercícios</h2><p>Exercite o conhecimento adquirido nos laboratórios.</p></div>
              <CaretDown weight="bold" className={`caret-icon ${isExercíciosOpen ? 'open' : ''}`} />
            </div>
            <div className={`dropdown-content ${isExercíciosOpen ? 'open' : ''}`}>
              <Link to="/exercises/burp" className="dropdown-item">
                <FilePdf size={20} /> Burp Suite
              </Link>
              <Link to="/exercises/tcp" className="dropdown-item">
                <FilePdf size={20} /> TCPDump
              </Link>
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

          {/* Card Aprendizado Guiado */}
          <div className="guided-learning-wrapper">
            <div className="beginner-tag">Indicado para Iniciantes</div>
            <div className="dashboard-card">
              <div className="dropdown-header" onClick={() => setIsGuidedOpen(!isGuidedOpen)}>
                <div className="card-icon"><RocketLaunch weight="bold" /></div>
                <div className="card-content">
                  <h2>Aprendizado Guiado</h2>
                  <p>Siga estes 5 passos para começar no hacking ético.</p>
                </div>
                <CaretDown weight="bold" className={`caret-icon ${isGuidedOpen ? 'open' : ''}`} />
              </div>
              
              <div className={`dropdown-content ${isGuidedOpen ? 'open' : ''}`}>
                <div className="guided-steps-container">
                  {/* Passos do Guia (Mantidos) */}
                  <li className="guided-step-item">
                    <input type="checkbox" id="step1" checked={guidedSteps.step1} onChange={() => handleStepToggle('step1')} />
                    <label htmlFor="step1"><strong>1. Conheça a Missão</strong><p>Leia o "Sobre o App" no ícone <Info weight="bold" /> acima.</p></label>
                  </li>
                  <li className="guided-step-item">
                    <input type="checkbox" id="step2" checked={guidedSteps.step2} onChange={() => handleStepToggle('step2')} />
                    <label htmlFor="step2"><strong>2. Base Teórica</strong><p>Visite a <Link to="/biblioteca">Biblioteca</Link>.</p></label>
                  </li>
                  {/* ... outros passos ... */}
                </div>
              </div>
            </div>
          </div>

          {/* Card "Sobre o LOCK" */}
          <div className="dashboard-card">
            <div className="dropdown-header" onClick={() => setIsAboutUsOpen(!isAboutUsOpen)}>
              <div className="card-icon">
                <img src={logoLock} alt="Logo LOCK" className="card-logo-icon" />
              </div>
              <div className="card-content">
                <h2>Sobre o LOCK</h2>
                <p>Conheça o projeto.</p>
              </div>
              <CaretDown weight="bold" className={`caret-icon ${isAboutUsOpen ? 'open' : ''}`} />
            </div>
            <div className={`dropdown-content ${isAboutUsOpen ? 'open' : ''}`}>
              <div className="about-us-text">
                <p>O Laboratório Online de Cibersegurança com Kali Linux (LOCK) nasce em meio à necessidade de um meio de pesquisa, estudo e aprendizagem prática sobre segurança e pentesting.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
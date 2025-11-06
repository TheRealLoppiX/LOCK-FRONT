import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CaretDown, Gear, SignOut, Flask, BookOpen, Exam, 
  Question, Info, Shuffle,
  RocketLaunch
} from '@phosphor-icons/react';
import HexagonBackground from '../components/hexagonobg';
import InfoModal from '../components/InfoModal';
import './dashboard.css';

// NOVO: Define o tipo para as chaves dos passos
type GuidedStepKey = 'step1' | 'step2' | 'step3' | 'step4' | 'step5';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isLabsOpen, setIsLabsOpen] = useState(false);
  const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  // NOVO: Estado para o novo card
  const [isGuidedOpen, setIsGuidedOpen] = useState(false);
  
  // NOVO: Estado para os 5 passos (lido do localStorage)
  const [guidedSteps, setGuidedSteps] = useState(() => {
    const savedSteps = localStorage.getItem('lock-guided-steps');
    if (savedSteps) {
      return JSON.parse(savedSteps);
    }
    return {
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: false,
    };
  });

  // NOVO: Handler para os checkboxes (agora salva no localStorage)
  const handleStepToggle = (step: GuidedStepKey) => {
    setGuidedSteps((prev: Record<GuidedStepKey, boolean>) => {
      const newSteps = {
        ...prev,
        [step]: !prev[step]
      };
      // Salva o progresso no navegador do usuário
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

          {/* ==================================
           * NOVO CARD: APRENDIZADO GUIADO
           * ==================================
          */}
          <div className="dashboard-card">
            <div className="dropdown-header" onClick={() => setIsGuidedOpen(!isGuidedOpen)}>
              <div className="card-icon"><RocketLaunch weight="bold" /></div>
              <div className="card-content">
                <h2>Aprendizado Guiado</h2>
                <p>Seus primeiros passos no LOCK.</p>
              </div>
              
              {/* NOVO: A Tag de Iniciante */}
              <span className="beginner-tag">Indicado para Iniciantes</span>
              
              <CaretDown weight="bold" className={`caret-icon ${isGuidedOpen ? 'open' : ''}`} />
            </div>
            
            {/* NOVO: Conteúdo do Dropdown */}
            <div className={`dropdown-content ${isGuidedOpen ? 'open' : ''}`}>
              <ul className="guided-step-list">
                
                {/* Passo 1 */}
                <li className="guided-step-item">
                  <input 
                    type="checkbox" 
                    id="step1" 
                    checked={guidedSteps.step1} 
                    onChange={() => handleStepToggle('step1')} 
                  />
                  <label htmlFor="step1">
                    <strong>Conheça a Missão:</strong> Entenda o projeto clicando no ícone de "Informações" (ℹ️) no topo.
                  </label>
                </li>
                
                {/* Passo 2 */}
                <li className="guided-step-item">
                  <input 
                    type="checkbox" 
                    id="step2" 
                    checked={guidedSteps.step2} 
                    onChange={() => handleStepToggle('step2')} 
                  />
                  <label htmlFor="step2">
                    <strong>Explore a Teoria:</strong> Visite a <Link to="/biblioteca">Biblioteca</Link> e adicione seu primeiro material de estudo.
                  </label>
                </li>
                
                {/* Passo 3 */}
                <li className="guided-step-item">
                  <input 
                    type="checkbox" 
                    id="step3" 
                    checked={guidedSteps.step3} 
                    onChange={() => handleStepToggle('step3')} 
                  />
                  <label htmlFor="step3">
                    <strong>Valide o Conhecimento:</strong> Faça um <Link to="/quizzes/variado">Quiz Variado</Link> para testar sua base teórica.
                  </label>
                </li>
                
                {/* Passo 4 */}
                <li className="guided-step-item">
                  <input 
                    type="checkbox" 
                    id="step4" 
                    checked={guidedSteps.step4} 
                    onChange={() => handleStepToggle('step4')} 
                  />
                  <label htmlFor="step4">
                    <strong>Primeira Invasão:</strong> Resolva o laboratório <Link to="/labs/sql-injection">SQL Injection Nível 1</Link>.
                  </label>
                </li>
                
                {/* Passo 5 */}
                <li className="guided-step-item">
                  <input 
                    type="checkbox" 
                    id="step5" 
                    checked={guidedSteps.step5} 
                    onChange={() => handleStepToggle('step5')} 
                  />
                  <label htmlFor="step5">
                    <strong>Explore os Desafios:</strong> Navegue pelos laboratórios de <Link to="/labs/xss">XSS</Link> e <Link to="/labs/brute-force">Brute Force</Link>.
                  </label>
                </li>
                
              </ul>
            </div>
          </div>

        </div>
      </main>

      {/* Renderiza o Modal (ele só aparece se isOpen for true) */}
      <InfoModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
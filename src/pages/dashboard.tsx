import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CaretDown, Gear, SignOut, Flask, BookOpen, Exam, 
  Question, Info, Shuffle,
  RocketLaunch, FilePdf, Crown, ListPlus, Certificate
} from '@phosphor-icons/react';
import HexagonBackground from '../components/hexagonobg';
import InfoModal from '../components/InfoModal';
import './dashboard.css';
import logoLock from '../assets/Logo lock.png';

// Define o tipo para as chaves dos passos
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
  
  // Estados de controle dos Dropdowns
  const [isLabsOpen, setIsLabsOpen] = useState(false);
  const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isGuidedOpen, setIsGuidedOpen] = useState(false);
  const [isExercíciosOpen, setisExercíciosOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false); 
  
  // Estado para os 5 passos (lido do localStorage)
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

  // Handler para os checkboxes (salva no localStorage)
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
      
      {/* --- HEADER --- */}
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

      {/* --- GRID PRINCIPAL --- */}
      <main className="dashboard-grid">
        
        {/* === COLUNA DA ESQUERDA === */}
        <div className="left-column">
          
          {/* 1. PAINEL ADMINISTRATIVO (SÓ APARECE SE FOR ADMIN) */}
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
                
                {/* Criar Novo Simulado */}
                <Link to="/admin/modules" className="dropdown-item" style={{ color: '#FFD700' }}>
                  <ListPlus size={20} /> Criar Simulado (Módulo)
                </Link>

                {/* Cadastrar Questões */}
                <Link to="/admin/questions" className="dropdown-item" style={{ color: '#FFD700' }}>
                  <Question size={20} /> Cadastrar Questões
                </Link>

                {/* Cadastrar Material na Biblioteca */}
                <Link to="/admin/materials" className="dropdown-item" style={{ color: '#FFD700' }}>
                  <BookOpen size={20} /> Cadastrar Material
                </Link>

              </div>
            </div>
          )}

          {/* 2. Card de Laboratórios */}
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

          {/* 3. Card de Quizzes */}
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

          {/* 4. Card de Exercícios */}
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

        {/* === COLUNA DA DIREITA === */}
        <div className="right-column">
          
          {/* 1. Card de Biblioteca */}
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

          {/* 2. Card: APRENDIZADO GUIADO */}
          <div className="guided-learning-wrapper">
             {/* Tag Visual */}
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
                  <ul className="guided-step-list">
                    <li className="guided-step-item">
                      <input 
                        type="checkbox" 
                        id="step1" 
                        checked={guidedSteps.step1} 
                        onChange={() => handleStepToggle('step1')} 
                      />
                      <label htmlFor="step1">
                        <strong>1. Conheça a Missão:</strong> Entenda o projeto clicando no ícone de "Informações" (ℹ️) no topo.
                      </label>
                    </li>
                    <li className="guided-step-item">
                      <input 
                        type="checkbox" 
                        id="step2" 
                        checked={guidedSteps.step2} 
                        onChange={() => handleStepToggle('step2')} 
                      />
                      <label htmlFor="step2">
                        <strong>2. Base Teórica:</strong> Leia o livro Testes de Invasão da Georgia Weidman, disponível na nossa <Link to="/biblioteca">Biblioteca</Link>.
                      </label>
                    </li>
                    <li className="guided-step-item">
                      <input 
                        type="checkbox" 
                        id="step3" 
                        checked={guidedSteps.step3} 
                        onChange={() => handleStepToggle('step3')} 
                      />
                      <label htmlFor="step3">
                        <strong>3. Teste seu Conhecimento:</strong> Faça um <Link to="/quizzes/variado">Quiz Variado</Link> na dificuldade fácil para testar sua base teórica.
                      </label>
                    </li>
                    <li className="guided-step-item">
                      <input 
                        type="checkbox" 
                        id="step4" 
                        checked={guidedSteps.step4} 
                        onChange={() => handleStepToggle('step4')} 
                      />
                      <label htmlFor="step4">
                        <strong>4. Primeira Interação com Ethical Hacking:</strong> Acesse o Guia para montar seu laboratório de Burp Suite, disponível na nossa <Link to='/biblioteca'>Biblioteca</Link>, para experienciar o Ethical Hacking.
                      </label>
                    </li>
                    <li className="guided-step-item">
                      <input 
                        type="checkbox" 
                        id="step5" 
                        checked={guidedSteps.step5} 
                        onChange={() => handleStepToggle('step5')} 
                      />
                      <label htmlFor="step5">
                        <strong>5. Explore os Desafios:</strong> Use o conhecimento adquirido para solucionar os laboratórios disponíveis na plataforma.
                      </label>
                    </li>
                  </ul>
                </div>
             </div>
          </div>

          <Link to="/simulados" className="dashboard-card-link">
            <div className="dashboard-card" style={{borderColor: '#009dff'}}>
              <div className="dropdown-header">
                <div className="card-icon" style={{color: '#009dff'}}>
                    <Certificate weight="bold" />
                </div>
                <div className="card-content">
                  <h2 style={{color: '#009dff'}}>Simulados & Certificações</h2>
                  <p>Treine para provas reais (CompTIA, CEH, LPI).</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Modal de Informações */}
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
import React, { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";
import {
  CaretDown,
  Gear,
  SignOut,
  Flask,
  BookOpen,
  Exam,
  Question,
  Info,
  Shuffle,
  RocketLaunch,
  FilePdf,
  Crown,
} from "@phosphor-icons/react";
import HexagonBackground from "../components/hexagonobg";
import InfoModal from "../components/InfoModal";
import "./dashboard.css";

type GuidedStepKey = "step1" | "step2" | "step3" | "step4" | "step5";

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

  const currentUser = user as UserWithRole;
  const isAdmin = currentUser?.is_admin === true;

  const [isLabsOpen, setIsLabsOpen] = useState(false);
  const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isGuidedOpen, setIsGuidedOpen] = useState(false);
  const [isExercíciosOpen, setIsExercíciosOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [guidedSteps, setGuidedSteps] = useState(() => {
    const saved = localStorage.getItem("lock-guided-steps");
    if (saved) return JSON.parse(saved);
    return {
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: false,
    };
  });

  const handleStepToggle = (step: GuidedStepKey) => {
   setGuidedSteps((prev: Record<GuidedStepKey, boolean>) => {
     const newSteps = {
       ...prev,
       [step]: !prev[step]
     };
     localStorage.setItem('lock-guided-steps', JSON.stringify(newSteps));
     return newSteps;
   });
 };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <HexagonBackground />

      <header className="dashboard-header">
        <div className="header-left">
          <Link to="/profile" className="profile-avatar-link">
            <img
              src={
                user?.avatar_url ||
                `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`
              }
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
        {/* ESQUERDA */}
        <div className="left-column">
          {isAdmin && (
            <div className="dashboard-card admin-card">
              <div
                className="dropdown-header"
                onClick={() => setIsAdminOpen(!isAdminOpen)}
              >
                <div className="card-icon" style={{ color: "#FFD700" }}>
                  <Crown weight="bold" />
                </div>

                <div className="card-content">
                  <h2 style={{ color: "#FFD700" }}>Painel Admin</h2>
                  <p>Gerenciamento do sistema.</p>
                </div>

                <CaretDown
                  weight="bold"
                  className={`caret-icon ${isAdminOpen ? "open" : ""}`}
                  style={{ color: "#FFD700" }}
                />
              </div>

              <div className={`dropdown-content ${isAdminOpen ? "open" : ""}`}>
                <Link
                  to="/admin/questions"
                  className="dropdown-item"
                  style={{ color: "#FFD700" }}
                >
                  ➕ Cadastrar Questões
                </Link>
              </div>
            </div>
          )}

          {/* LABORATÓRIOS */}
          <div className="dashboard-card">
            <div
              className="dropdown-header"
              onClick={() => setIsLabsOpen(!isLabsOpen)}
            >
              <div className="card-icon">
                <Flask weight="bold" />
              </div>

              <div className="card-content">
                <h2>Laboratórios</h2>
                <p>Coloque seus conhecimentos em prática.</p>
              </div>

              <CaretDown
                weight="bold"
                className={`caret-icon ${isLabsOpen ? "open" : ""}`}
              />
            </div>

            <div className={`dropdown-content ${isLabsOpen ? "open" : ""}`}>
              <Link to="/labs/sql-injection" className="dropdown-item">
                SQL Injection
              </Link>
              <Link to="/labs/brute-force" className="dropdown-item">
                Brute Force
              </Link>
              <Link to="/labs/xss" className="dropdown-item">
                Cross-Site Scripting (XSS)
              </Link>
            </div>
          </div>

          {/* QUIZZES */}
          <div className="dashboard-card">
            <div
              className="dropdown-header"
              onClick={() => setIsQuizzesOpen(!isQuizzesOpen)}
            >
              <div className="card-icon">
                <Exam weight="bold" />
              </div>

              <div className="card-content">
                <h2>Quizzes</h2>
                <p>Teste sua compreensão teórica dos temas.</p>
              </div>

              <CaretDown
                weight="bold"
                className={`caret-icon ${isQuizzesOpen ? "open" : ""}`}
              />
            </div>

            <div className={`dropdown-content ${isQuizzesOpen ? "open" : ""}`}>
              <Link to="/quizzes/variado" className="dropdown-item">
                <Shuffle size={20} /> Tema Variado
              </Link>
              <Link to="/quizzes/burp-suite" className="dropdown-item">
                <Question size={20} /> Burp Suite
              </Link>
              <Link to="/quizzes/tcpdump" className="dropdown-item">
                <Question size={20} /> TCPDump
              </Link>
              <Link to="/quizzes/nmap" className="dropdown-item">
                <Question size={20} /> NMap
              </Link>
            </div>
          </div>

          {/* EXERCÍCIOS */}
          <div className="dashboard-card">
            <div
              className="dropdown-header"
              onClick={() => setIsExercíciosOpen(!isExercíciosOpen)}
            >
              <div className="card-icon">
                <Exam weight="bold" />
              </div>

              <div className="card-content">
                <h2>Exercícios</h2>
                <p>
                  Exercite o conhecimento adquirido nos laboratórios.
                </p>
              </div>

              <CaretDown
                weight="bold"
                className={`caret-icon ${isExercíciosOpen ? "open" : ""}`}
              />
            </div>

            <div className={`dropdown-content ${isExercíciosOpen ? "open" : ""}`}>
              <Link to="/exercises/burp" className="dropdown-item">
                <FilePdf size={20} /> Burp Suite
              </Link>
              <Link to="/exercises/tcp" className="dropdown-item">
                <FilePdf size={20} /> TCPDump
              </Link>
            </div>
          </div>
        </div>

        {/* DIREITA */}
        <div className="right-column">
          <Link to="/biblioteca" className="dashboard-card-link">
            <div className="dashboard-card">
              <div className="dropdown-header">
                <div className="card-icon">
                  <BookOpen weight="bold" />
                </div>

                <div className="card-content">
                  <h2>Biblioteca</h2>
                  <p>
                    Acesse guias, artigos e livros para aprofundar seu
                    conhecimento.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* APRENDIZADO GUIADO */}
          <div className="dashboard-card">
            <div
              className="dropdown-header"
              onClick={() => setIsGuidedOpen(!isGuidedOpen)}
            >
              <div className="card-icon">
                <RocketLaunch weight="bold" />
              </div>

              <div className="card-content">
                <h2>Aprendizado Guiado</h2>
                <p>Seus primeiros passos no LOCK.</p>
              </div>

              <span className="beginner-tag">Indicado para Iniciantes</span>

              <CaretDown
                weight="bold"
                className={`caret-icon ${isGuidedOpen ? "open" : ""}`}
              />
            </div>

            <div className={`dropdown-content ${isGuidedOpen ? "open" : ""}`}>
              <ul className="guided-step-list">
                <li className="guided-step-item">
                  <input
                    type="checkbox"
                    id="step1"
                    checked={guidedSteps.step1}
                    onChange={() => handleStepToggle("step1")}
                  />
                  <label htmlFor="step1">
                    <strong>Conheça a Missão:</strong> Clique no ícone
                    de informações (ℹ️) para entender o projeto.
                  </label>
                </li>

                <li className="guided-step-item">
                  <input
                    type="checkbox"
                    id="step2"
                    checked={guidedSteps.step2}
                    onChange={() => handleStepToggle("step2")}
                  />
                  <label htmlFor="step2">
                    <strong>Explore a Teoria:</strong> Leia o livro da
                    Georgia Weidman na nossa{" "}
                    <Link to="/biblioteca">Biblioteca</Link>.
                  </label>
                </li>

                <li className="guided-step-item">
                  <input
                    type="checkbox"
                    id="step3"
                    checked={guidedSteps.step3}
                    onChange={() => handleStepToggle("step3")}
                  />
                  <label htmlFor="step3">
                    <strong>Teste seu Conhecimento:</strong> Faça um{" "}
                    <Link to="/quizzes/variado">
                      Quiz Variado (fácil)
                    </Link>
                    .
                  </label>
                </li>

                <li className="guided-step-item">
                  <input
                    type="checkbox"
                    id="step4"
                    checked={guidedSteps.step4}
                    onChange={() => handleStepToggle("step4")}
                  />
                  <label htmlFor="step4">
                    <strong>Primeiro Contato com Ethical Hacking:</strong>{" "}
                    Monte o laboratório de Burp Suite com o guia da{" "}
                    <Link to="/biblioteca">Biblioteca</Link>.
                  </label>
                </li>

                <li className="guided-step-item">
                  <input
                    type="checkbox"
                    id="step5"
                    checked={guidedSteps.step5}
                    onChange={() => handleStepToggle("step5")}
                  />
                  <label htmlFor="step5">
                    <strong>Explore os Desafios:</strong> Resolva os
                    laboratórios disponíveis.
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;

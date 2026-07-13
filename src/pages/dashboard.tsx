import React, { useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link } from 'react-router-dom';
import {
  Flask, BookOpen, Exam,
  Question, Info, Shuffle,
  RocketLaunch, FilePdf, Crown, ListPlus, Certificate,
  User, PencilSimple, Check, DotsSixVertical, CaretRight
} from '@phosphor-icons/react';
import HexagonBackground from '../components/hexagonobg';
import InfoModal from '../components/InfoModal';
import { useProfileStats } from '../hooks/useProfileStats';
import './dashboard.css';

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

const DEFAULT_CARD_ORDER = [
  'perfil', 'admin', 'laboratorios', 'quizzes', 'exercicios', 'biblioteca', 'trilha', 'simulados',
];
const ORDER_STORAGE_KEY = 'lock-dashboard-order';

function loadCardOrder(): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || 'null');
    if (Array.isArray(saved)) {
      const known = saved.filter((id) => DEFAULT_CARD_ORDER.includes(id));
      const missing = DEFAULT_CARD_ORDER.filter((id) => !known.includes(id));
      return [...known, ...missing];
    }
  } catch {
    // ignora e usa o padrão
  }
  return DEFAULT_CARD_ORDER;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats } = useProfileStats();

  // Cast para acessar a propriedade is_admin com segurança
  const currentUser = user as UserWithRole;
  const isAdmin = currentUser?.is_admin === true;

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [cardOrder, setCardOrder] = useState<string[]>(loadCardOrder);
  const draggedIdRef = useRef<string | null>(null);

  // Estado para os 5 passos (lido do localStorage)
  const [guidedSteps, setGuidedSteps] = useState(() => {
    const savedSteps = localStorage.getItem('lock-guided-steps');
    if (savedSteps) {
      return JSON.parse(savedSteps);
    }
    return { step1: false, step2: false, step3: false, step4: false, step5: false };
  });

  const handleStepToggle = (step: GuidedStepKey) => {
    setGuidedSteps((prev: Record<GuidedStepKey, boolean>) => {
      const newSteps = { ...prev, [step]: !prev[step] };
      localStorage.setItem('lock-guided-steps', JSON.stringify(newSteps));
      return newSteps;
    });
  };

  const guidedDoneCount = Object.values(guidedSteps).filter(Boolean).length;
  const guidedPercent = Math.round((guidedDoneCount / 5) * 100);

  const xpPercent = stats.nextRankXp
    ? Math.min(Math.round((stats.totalXp / stats.nextRankXp) * 100), 100)
    : 100;

  const handleDragStart = (id: string) => {
    if (!isEditMode) return;
    draggedIdRef.current = id;
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!isEditMode) return;
    const draggedId = draggedIdRef.current;
    draggedIdRef.current = null;
    if (!draggedId || draggedId === targetId) return;

    setCardOrder((prev) => {
      const next = [...prev];
      const from = next.indexOf(draggedId);
      const to = next.indexOf(targetId);
      if (from === -1 || to === -1) return prev;
      next.splice(from, 1);
      next.splice(to, 0, draggedId);
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // --- Definição do conteúdo de cada card do grid ---
  const cardsById: Record<string, React.ReactNode> = useMemo(() => ({
    perfil: (
      <div className="card-body perfil-card-body">
        <div className="perfil-top">
          <img
            src={user?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`}
            alt="Avatar"
            className="perfil-avatar"
          />
          <div>
            <h2>{user?.name}</h2>
            <span className="rank-badge">{stats.rank}</span>
          </div>
        </div>
        <div className="xp-row">
          <span>{stats.totalXp.toLocaleString('pt-BR')} XP</span>
          {stats.nextRankXp && <span>{stats.nextRankXp.toLocaleString('pt-BR')} XP</span>}
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${xpPercent}%` }} /></div>
        {stats.nextRank && <p className="xp-next-label">{xpPercent}% → próximo: {stats.nextRank}</p>}
        <div className="perfil-stats-row">
          <div><strong>{stats.completedBooks}</strong><span>Livros lidos</span></div>
          <div><strong>{stats.passedExams}</strong><span>Simulados aprovados</span></div>
        </div>
      </div>
    ),
    admin: isAdmin ? (
      <div className="card-body">
        <Link to="/admin/modules" className="list-item" style={{ color: '#FFD700' }}>
          <ListPlus size={20} /> Criar Simulado (Módulo) <CaretRight size={14} className="list-item-arrow" />
        </Link>
        <Link to="/admin/questions" className="list-item" style={{ color: '#FFD700' }}>
          <Question size={20} /> Cadastrar Questões <CaretRight size={14} className="list-item-arrow" />
        </Link>
        <Link to="/admin/materials" className="list-item" style={{ color: '#FFD700' }}>
          <BookOpen size={20} /> Cadastrar Material <CaretRight size={14} className="list-item-arrow" />
        </Link>
      </div>
    ) : null,
    laboratorios: (
      <div className="card-body">
        <Link to="/labs/sql-injection" className="list-item">SQL Injection <CaretRight size={14} className="list-item-arrow" /></Link>
        <Link to="/labs/brute-force" className="list-item">Brute Force <CaretRight size={14} className="list-item-arrow" /></Link>
        <Link to="/labs/xss" className="list-item">Cross-Site Scripting (XSS) <CaretRight size={14} className="list-item-arrow" /></Link>
      </div>
    ),
    quizzes: (
      <div className="card-body">
        <Link to="/quizzes/variado" className="list-item"><Shuffle size={18} /> Tema Variado <CaretRight size={14} className="list-item-arrow" /></Link>
        <Link to="/quizzes/burp-suite" className="list-item"><Question size={18} /> Burp Suite <CaretRight size={14} className="list-item-arrow" /></Link>
        <Link to="/quizzes/tcpdump" className="list-item"><Question size={18} /> TCPDump <CaretRight size={14} className="list-item-arrow" /></Link>
        <Link to="/quizzes/nmap" className="list-item"><Question size={18} /> NMap <CaretRight size={14} className="list-item-arrow" /></Link>
      </div>
    ),
    exercicios: (
      <div className="card-body">
        <Link to="/exercises/burp" className="list-item"><FilePdf size={18} /> Burp Suite <CaretRight size={14} className="list-item-arrow" /></Link>
        <Link to="/exercises/tcp" className="list-item"><FilePdf size={18} /> TCPDump <CaretRight size={14} className="list-item-arrow" /></Link>
      </div>
    ),
    trilha: (
      <div className="card-body">
        <ul className="guided-step-list">
          {([1, 2, 3, 4, 5] as const).map((n) => {
            const key = `step${n}` as GuidedStepKey;
            return (
              <li className="guided-step-item" key={key}>
                <input
                  type="checkbox"
                  id={key}
                  checked={guidedSteps[key]}
                  onChange={() => handleStepToggle(key)}
                />
                <label htmlFor={key}>
                  {n === 1 && <><strong>1. Conheça a Missão:</strong> Entenda o projeto clicando no ícone de "Informações" (ℹ️) no topo.</>}
                  {n === 2 && <><strong>2. Base Teórica:</strong> Leia o livro Testes de Invasão da Georgia Weidman, disponível na nossa <Link to="/biblioteca">Biblioteca</Link>.</>}
                  {n === 3 && <><strong>3. Teste seu Conhecimento:</strong> Faça um <Link to="/quizzes/variado">Quiz Variado</Link> na dificuldade fácil para testar sua base teórica.</>}
                  {n === 4 && <><strong>4. Primeira Interação com Ethical Hacking:</strong> Acesse o Guia para montar seu laboratório de Burp Suite, disponível na nossa <Link to="/biblioteca">Biblioteca</Link>.</>}
                  {n === 5 && <><strong>5. Explore os Desafios:</strong> Use o conhecimento adquirido para solucionar os laboratórios disponíveis na plataforma.</>}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    ),
  }), [user, stats, xpPercent, isAdmin, guidedSteps]);

  const cardMeta: Record<string, { icon: React.ReactNode; title: string; subtitle: string; color?: string; linkTo?: string }> = {
    perfil: { icon: <User weight="bold" />, title: 'Perfil', subtitle: '', linkTo: '/profile' },
    admin: { icon: <Crown weight="bold" />, title: 'Painel Admin', subtitle: 'Gerenciamento do sistema.', color: '#FFD700' },
    laboratorios: { icon: <Flask weight="bold" />, title: 'Laboratórios', subtitle: 'Coloque seus conhecimentos em prática.' },
    quizzes: { icon: <Exam weight="bold" />, title: 'Quizzes', subtitle: 'Teste sua compreensão teórica dos temas.' },
    exercicios: { icon: <Exam weight="bold" />, title: 'Exercícios', subtitle: 'Exercite o conhecimento adquirido nos laboratórios.' },
    biblioteca: { icon: <BookOpen weight="bold" />, title: 'Biblioteca', subtitle: 'Acesse guias, artigos e livros para aprofundar seu conhecimento.', linkTo: '/biblioteca' },
    trilha: { icon: <RocketLaunch weight="bold" />, title: 'Aprendizado Guiado', subtitle: `Siga estes 5 passos para começar no hacking ético. (${guidedPercent}%)` },
    simulados: { icon: <Certificate weight="bold" />, title: 'Simulados & Certificações', subtitle: 'Treine para provas reais (CompTIA, CEH, LPI).', color: '#009dff', linkTo: '/simulados' },
  };

  const visibleOrder = cardOrder.filter((id) => id !== 'admin' || isAdmin);

  return (
    <div className="dashboard-container">
      <HexagonBackground />

      {/* --- HEADER --- */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="welcome-message">
            <h1>Dashboard</h1>
            <p>Bem-vindo de volta, {user?.name}</p>
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
          <button
            className={`edit-dashboard-btn ${isEditMode ? 'active' : ''}`}
            onClick={() => setIsEditMode((v) => !v)}
          >
            {isEditMode ? <Check weight="bold" /> : <PencilSimple weight="bold" />}
            {isEditMode ? 'Concluir Edição' : 'Editar Dashboard'}
          </button>
        </div>
      </header>

      {/* --- GRID PRINCIPAL --- */}
      <main className="dashboard-grid">
        {visibleOrder.map((id) => {
          const meta = cardMeta[id];
          if (!meta) return null;
          const body = cardsById[id];

          const header = (
            <div className="card-header-row">
              {isEditMode && (
                <span className="drag-handle" title="Arraste para reordenar">
                  <DotsSixVertical weight="bold" />
                </span>
              )}
              <div className="card-icon" style={meta.color ? { color: meta.color } : undefined}>
                {meta.icon}
              </div>
              <div className="card-content">
                <h2 style={meta.color ? { color: meta.color } : undefined}>{meta.title}</h2>
                {meta.subtitle && <p>{meta.subtitle}</p>}
              </div>
            </div>
          );

          return (
            <div
              key={id}
              className={`dashboard-card ${id === 'admin' ? 'admin-card' : ''} ${isEditMode ? 'edit-mode' : ''}`}
              draggable={isEditMode}
              onDragStart={() => handleDragStart(id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(id)}
            >
              {meta.linkTo && !isEditMode ? (
                <Link to={meta.linkTo} className="card-header-link">{header}</Link>
              ) : (
                header
              )}
              {body}
            </div>
          );
        })}
      </main>

      {/* Modal de Informações */}
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
};

export default Dashboard;

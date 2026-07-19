import React, { useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link } from 'react-router-dom';
import {
  Flask, BookOpen, Exam,
  Question, Info, Shuffle,
  RocketLaunch, FilePdf, Crown, ListPlus, Certificate,
  User, PencilSimple, Check, DotsSixVertical, CaretRight, X, Plus, CircleDashed,
  ChatCircleDots, Trophy
} from '@phosphor-icons/react';
import HexagonBackground from '../components/hexagonobg';
import InfoModal from '../components/InfoModal';
import { useProfileStats } from '../hooks/useProfileStats';
import './dashboard.css';

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
const HIDDEN_STORAGE_KEY = 'lock-dashboard-hidden';
const GUIDED_INFO_KEY = 'lock-guided-info-viewed';
const GUIDED_PROFILE_KEY = 'lock-guided-profile-viewed';
const GUIDED_CHAT_KEY = 'lock-guided-chat-used';
const GUIDED_RANKING_KEY = 'lock-guided-ranking-viewed';

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

function loadHiddenCards(): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(HIDDEN_STORAGE_KEY) || '[]');
    if (Array.isArray(saved)) return saved.filter((id) => DEFAULT_CARD_ORDER.includes(id));
  } catch {
    // ignora e usa a lista vazia
  }
  return [];
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
  const [hiddenCards, setHiddenCards] = useState<string[]>(loadHiddenCards);
  const draggedIdRef = useRef<string | null>(null);

  const handleHideCard = (id: string) => {
    setHiddenCards((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(HIDDEN_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleRestoreCard = (id: string) => {
    setHiddenCards((prev) => {
      const next = prev.filter((cardId) => cardId !== id);
      localStorage.setItem(HIDDEN_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Passos do "Aprendizado Guiado" — auto-detectados a partir de dados que já
  // existem (stats do servidor + flags de "já visitei essa área", gravadas
  // pelas próprias páginas em localStorage), sem checkboxes manuais que o
  // usuário precisava marcar sozinho. Cobre agora todas as áreas principais
  // do site (perfil, biblioteca, quiz, labs, chat, simulados, ranking), não
  // só labs/quiz/biblioteca como na versão anterior.
  const [infoViewed, setInfoViewed] = useState<boolean>(
    () => localStorage.getItem(GUIDED_INFO_KEY) === 'true'
  );
  const [profileViewed] = useState<boolean>(
    () => localStorage.getItem(GUIDED_PROFILE_KEY) === 'true'
  );
  const [chatUsed] = useState<boolean>(
    () => localStorage.getItem(GUIDED_CHAT_KEY) === 'true'
  );
  const [rankingViewed] = useState<boolean>(
    () => localStorage.getItem(GUIDED_RANKING_KEY) === 'true'
  );

  const openInfoModal = () => {
    setIsInfoModalOpen(true);
    setInfoViewed(true);
    localStorage.setItem(GUIDED_INFO_KEY, 'true');
  };

  const guidedSteps = useMemo(() => [
    {
      key: 'mission',
      icon: <Info weight="bold" />,
      title: 'Conheça a Missão',
      description: 'Entenda o projeto e seus objetivos.',
      done: infoViewed,
      cta: { label: 'Ver Missão', linkTo: undefined as string | undefined, onClick: openInfoModal as (() => void) | undefined },
    },
    {
      key: 'profile',
      icon: <User weight="bold" />,
      title: 'Configure seu Perfil',
      description: 'Visite seu perfil, ajuste avatar e acompanhe seu XP e rank.',
      done: profileViewed,
      cta: { label: 'Ir para o Perfil', linkTo: '/profile' as string | undefined, onClick: undefined as (() => void) | undefined },
    },
    {
      key: 'theory',
      icon: <BookOpen weight="bold" />,
      title: 'Base Teórica',
      description: 'Leia um livro na Biblioteca para construir sua base teórica.',
      done: stats.completedBooks > 0,
      cta: { label: 'Ir para a Biblioteca', linkTo: '/biblioteca' as string | undefined, onClick: undefined as (() => void) | undefined },
    },
    {
      key: 'quiz',
      icon: <Exam weight="bold" />,
      title: 'Teste seu Conhecimento',
      description: 'Faça um quiz para testar o que você aprendeu.',
      done: stats.completedQuizzes > 0,
      cta: { label: 'Fazer um Quiz', linkTo: '/quizzes/variado' as string | undefined, onClick: undefined as (() => void) | undefined },
    },
    {
      key: 'practice',
      icon: <Flask weight="bold" />,
      title: 'Primeira Prática',
      description: 'Resolva seu primeiro laboratório prático.',
      done: stats.completedLabs > 0,
      cta: { label: 'Escolher um Laboratório', linkTo: '/labs/sql-injection' as string | undefined, onClick: undefined as (() => void) | undefined },
    },
    {
      key: 'chat',
      icon: <ChatCircleDots weight="bold" />,
      title: 'Converse com a Aegis',
      description: 'Tire uma dúvida de cibersegurança com a IA da plataforma.',
      done: chatUsed,
      cta: { label: 'Abrir o Chat', linkTo: '/chat' as string | undefined, onClick: undefined as (() => void) | undefined },
    },
    {
      key: 'simulados',
      icon: <Certificate weight="bold" />,
      title: 'Seja Aprovado em um Simulado',
      description: 'Treine para certificações reais (CompTIA, CEH, LPI).',
      done: stats.passedExams > 0,
      cta: { label: 'Ir para Simulados', linkTo: '/simulados' as string | undefined, onClick: undefined as (() => void) | undefined },
    },
    {
      key: 'ranking',
      icon: <Trophy weight="bold" />,
      title: 'Suba no Ranking',
      description: 'Veja sua posição frente aos outros usuários da plataforma.',
      done: rankingViewed,
      cta: { label: 'Ver o Ranking', linkTo: '/leaderboard' as string | undefined, onClick: undefined as (() => void) | undefined },
    },
    {
      key: 'mastery',
      icon: <Crown weight="bold" />,
      title: 'Domine o Hacking Ético',
      description: 'Complete pelo menos 3 laboratórios para dominar os fundamentos práticos.',
      done: stats.completedLabs >= 3,
      cta: { label: 'Continuar Praticando', linkTo: '/labs/sql-injection' as string | undefined, onClick: undefined as (() => void) | undefined },
    },
  ], [infoViewed, profileViewed, chatUsed, rankingViewed, stats]);

  const guidedDoneCount = guidedSteps.filter((s) => s.done).length;
  const guidedPercent = Math.round((guidedDoneCount / guidedSteps.length) * 100);
  const nextGuidedStepKey = guidedSteps.find((s) => !s.done)?.key;

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
          <div><strong>{stats.completedLabs}</strong><span>Labs concluídos</span></div>
          <div><strong>{stats.completedQuizzes}</strong><span>Quizzes praticados</span></div>
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
        <Link to="/exercises/tcpdump" className="list-item"><FilePdf size={18} /> TCPDump <CaretRight size={14} className="list-item-arrow" /></Link>
        <Link to="/exercises/nmap" className="list-item"><FilePdf size={18} /> NMap <CaretRight size={14} className="list-item-arrow" /></Link>
      </div>
    ),
    trilha: (
      <div className="card-body">
        <ol className="guided-stepper">
          {guidedSteps.map((step, i) => {
            const isNext = step.key === nextGuidedStepKey;
            return (
              <li
                key={step.key}
                className={`guided-stepper-item ${step.done ? 'done' : ''} ${isNext ? 'next' : ''}`}
              >
                <span className="guided-stepper-icon">
                  {step.done ? <Check weight="bold" /> : <CircleDashed weight="bold" />}
                </span>
                <div className="guided-stepper-content">
                  <strong><span className="guided-stepper-feature-icon">{step.icon}</span>{i + 1}. {step.title}</strong>
                  <p>{step.description}</p>
                  {!step.done && (
                    step.cta.linkTo ? (
                      <Link to={step.cta.linkTo} className="guided-stepper-cta">
                        {step.cta.label} <CaretRight size={12} />
                      </Link>
                    ) : (
                      <button type="button" className="guided-stepper-cta" onClick={step.cta.onClick}>
                        {step.cta.label} <CaretRight size={12} />
                      </button>
                    )
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    ),
  }), [user, stats, xpPercent, isAdmin, guidedSteps, nextGuidedStepKey]);

  const cardMeta: Record<string, { icon: React.ReactNode; title: string; subtitle: string; color?: string; linkTo?: string }> = {
    perfil: { icon: <User weight="bold" />, title: 'Perfil', subtitle: '', linkTo: '/profile' },
    admin: { icon: <Crown weight="bold" />, title: 'Painel Admin', subtitle: 'Gerenciamento do sistema.', color: '#FFD700' },
    laboratorios: { icon: <Flask weight="bold" />, title: 'Laboratórios', subtitle: 'Coloque seus conhecimentos em prática.' },
    quizzes: { icon: <Exam weight="bold" />, title: 'Quizzes', subtitle: 'Teste sua compreensão teórica dos temas.' },
    exercicios: { icon: <Exam weight="bold" />, title: 'Exercícios', subtitle: 'Exercite o conhecimento adquirido nos laboratórios.' },
    biblioteca: { icon: <BookOpen weight="bold" />, title: 'Biblioteca', subtitle: 'Acesse guias, artigos e livros para aprofundar seu conhecimento.', linkTo: '/biblioteca' },
    trilha: { icon: <RocketLaunch weight="bold" />, title: 'Aprendizado Guiado', subtitle: `Um passo a passo por todas as áreas do LOCK. (${guidedPercent}%)` },
    simulados: { icon: <Certificate weight="bold" />, title: 'Simulados', subtitle: 'Treine para certificações reais (CompTIA, CEH, LPI).', color: '#009dff', linkTo: '/simulados' },
  };

  const visibleOrder = cardOrder
    .filter((id) => id !== 'admin' || isAdmin)
    .filter((id) => !hiddenCards.includes(id));

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
            onClick={openInfoModal}
            title="Sobre o Projeto"
            data-tour="dashboard-info"
          >
            <Info weight="bold" />
          </button>
          <button
            className={`edit-dashboard-btn ${isEditMode ? 'active' : ''}`}
            onClick={() => setIsEditMode((v) => !v)}
            data-tour="dashboard-edit"
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
              {isEditMode && (
                <button
                  className="card-hide-btn"
                  title="Ocultar este card (você pode trazê-lo de volta depois)"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleHideCard(id);
                  }}
                >
                  <X weight="bold" />
                </button>
              )}
            </div>
          );

          return (
            <div
              key={id}
              data-tour={`dashboard-card-${id}`}
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

      {/* --- CARDS OCULTOS (modo de edição) --- */}
      {isEditMode && hiddenCards.length > 0 && (
        <section className="hidden-cards-tray">
          <h3>Cards ocultos</h3>
          <p>Clique para trazer de volta ao painel.</p>
          <div className="hidden-cards-list">
            {hiddenCards.map((id) => {
              const meta = cardMeta[id];
              if (!meta) return null;
              return (
                <button key={id} className="hidden-card-chip" onClick={() => handleRestoreCard(id)}>
                  <span className="hidden-card-icon" style={meta.color ? { color: meta.color } : undefined}>{meta.icon}</span>
                  {meta.title}
                  <Plus weight="bold" />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Modal de Informações */}
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
};

export default Dashboard;

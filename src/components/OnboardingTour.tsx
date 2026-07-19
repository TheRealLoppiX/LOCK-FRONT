import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from '@phosphor-icons/react';
import { useAuth } from '../contexts/authContext';
import './OnboardingTour.css';

interface TourStep {
  selector: string;
  title: string;
  description: string;
}

// Ordem pensada como um passeio natural pela tela: primeiro a navegação da
// sidebar (sempre visível), depois os cards do dashboard de cima para baixo.
const TOUR_STEPS: TourStep[] = [
  { selector: '[data-tour="sidebar-dashboard"]', title: 'Dashboard', description: 'Sua página inicial: acesso rápido a todas as áreas do LOCK e seu progresso geral.' },
  { selector: '[data-tour="sidebar-search"]', title: 'Busca Global', description: 'Procure qualquer laboratório, quiz, material da biblioteca ou página do site em um único lugar (atalho Ctrl/Cmd+K).' },
  { selector: '[data-tour="sidebar-chat"]', title: 'Chat — Aegis', description: 'Converse com a Aegis, a inteligência artificial do LOCK, para tirar dúvidas de cibersegurança a qualquer momento.' },
  { selector: '[data-tour="sidebar-ranking"]', title: 'Ranking', description: 'Veja sua posição no ranking geral de XP em relação aos outros usuários da plataforma.' },
  { selector: '[data-tour="sidebar-profile"]', title: 'Perfil', description: 'Seu avatar, nome, rank e XP. Clique aqui para ver estatísticas completas ou editar seus dados.' },
  { selector: '[data-tour="sidebar-settings"]', title: 'Configurações', description: 'Ajuste tema (claro/escuro), preferências de conta e outras opções do sistema.' },
  { selector: '[data-tour="sidebar-shortcuts"]', title: 'Atalhos de Teclado', description: 'Veja todos os atalhos disponíveis para navegar no LOCK sem tirar as mãos do teclado.' },
  { selector: '[data-tour="dashboard-info"]', title: 'Sobre o Projeto', description: 'Relembre a missão do LOCK e os objetivos da plataforma sempre que quiser.' },
  { selector: '[data-tour="dashboard-edit"]', title: 'Editar Dashboard', description: 'Reorganize os cards por arrastar e solte, ou oculte os que não usa — tudo fica salvo para você.' },
  { selector: '[data-tour="dashboard-card-perfil"]', title: 'Card de Perfil', description: 'Acompanhe seu XP, rank atual e estatísticas de progresso direto no dashboard.' },
  { selector: '[data-tour="dashboard-card-admin"]', title: 'Painel Admin', description: 'Como administrador, cadastre questões, materiais e simulados por aqui.' },
  { selector: '[data-tour="dashboard-card-laboratorios"]', title: 'Laboratórios', description: 'Pratique ataques reais (SQL Injection, força bruta, XSS) em ambientes controlados e seguros.' },
  { selector: '[data-tour="dashboard-card-quizzes"]', title: 'Quizzes', description: 'Teste seu conhecimento teórico sobre as ferramentas e temas de cibersegurança do curso.' },
  { selector: '[data-tour="dashboard-card-exercicios"]', title: 'Exercícios', description: 'Fixe o que aprendeu nos laboratórios com exercícios práticos complementares.' },
  { selector: '[data-tour="dashboard-card-biblioteca"]', title: 'Biblioteca', description: 'Livros, guias e artigos para construir sua base teórica em cibersegurança.' },
  { selector: '[data-tour="dashboard-card-trilha"]', title: 'Aprendizado Guiado', description: 'Um passo a passo que cobre todas as áreas do site, para você nunca ficar sem saber o que fazer a seguir.' },
  { selector: '[data-tour="dashboard-card-simulados"]', title: 'Simulados', description: 'Treine com questões no estilo de certificações reais, como CompTIA, CEH e LPI.' },
];

const PAD = 8;
const TOOLTIP_WIDTH = 320;
const TOOLTIP_MARGIN = 16;

function isOnScreen(rect: DOMRect): boolean {
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth
  );
}

function findVisibleStepIndex(fromIndex: number): number {
  for (let i = fromIndex; i < TOUR_STEPS.length; i++) {
    const el = document.querySelector(TOUR_STEPS[i].selector);
    if (el && isOnScreen(el.getBoundingClientRect())) return i;
  }
  return -1;
}

const OnboardingTour: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [stepIndex, setStepIndex] = useState(0);
  const [active, setActive] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const storageKey = useMemo(() => (user ? `lock-onboarding-done-${user.id}` : null), [user]);

  // Ativa só uma vez por conta: quando o usuário autenticado chega no
  // dashboard (sempre a primeira tela após registro/login) e ainda não
  // existe o registro de que já viu o tour neste navegador.
  useEffect(() => {
    if (!isAuthenticated || !storageKey || location.pathname !== '/dashboard') return;
    if (localStorage.getItem(storageKey) === 'true') return;
    setStepIndex(0);
    setActive(true);
  }, [isAuthenticated, storageKey, location.pathname]);

  const finish = useCallback(() => {
    if (storageKey) localStorage.setItem(storageKey, 'true');
    setActive(false);
  }, [storageKey]);

  const recomputeRect = useCallback(() => {
    const el = document.querySelector(TOUR_STEPS[stepIndex]?.selector || '');
    setRect(el ? el.getBoundingClientRect() : null);
  }, [stepIndex]);

  // Recalcula o alvo atual, pulando automaticamente passos cujo elemento não
  // existe ou não está visível na tela (ex: card oculto, sidebar mobile
  // fechada) — se nenhum passo restante for visível, encerra o tour.
  useLayoutEffect(() => {
    if (!active) return;
    const visibleIndex = findVisibleStepIndex(stepIndex);
    if (visibleIndex === -1) {
      finish();
      return;
    }
    if (visibleIndex !== stepIndex) {
      setStepIndex(visibleIndex);
      return;
    }
    recomputeRect();
  }, [active, stepIndex, finish, recomputeRect]);

  useEffect(() => {
    if (!active) return;
    window.addEventListener('resize', recomputeRect);
    window.addEventListener('scroll', recomputeRect, true);
    return () => {
      window.removeEventListener('resize', recomputeRect);
      window.removeEventListener('scroll', recomputeRect, true);
    };
  }, [active, recomputeRect]);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, finish]);

  const handleNext = () => {
    const next = findVisibleStepIndex(stepIndex + 1);
    if (next === -1) {
      finish();
    } else {
      setStepIndex(next);
    }
  };

  if (!active || !rect) return null;

  const step = TOUR_STEPS[stepIndex];
  const isLast = findVisibleStepIndex(stepIndex + 1) === -1;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const highlightTop = Math.max(rect.top - PAD, 0);
  const highlightLeft = Math.max(rect.left - PAD, 0);
  const highlightWidth = rect.width + PAD * 2;
  const highlightHeight = rect.height + PAD * 2;

  const spaceBelow = vh - (rect.bottom + PAD);
  const spaceAbove = rect.top - PAD;
  const placement: 'bottom' | 'top' = spaceBelow >= 180 || spaceBelow >= spaceAbove ? 'bottom' : 'top';

  const tooltipTop = placement === 'bottom'
    ? Math.min(rect.bottom + PAD + 10, vh - 40)
    : undefined;
  const tooltipBottomFromTop = placement === 'top'
    ? vh - (rect.top - PAD - 10)
    : undefined;

  const targetCenterX = rect.left + rect.width / 2;
  const tooltipLeft = Math.min(
    Math.max(targetCenterX - TOOLTIP_WIDTH / 2, TOOLTIP_MARGIN),
    vw - TOOLTIP_WIDTH - TOOLTIP_MARGIN
  );
  const arrowLeft = Math.min(Math.max(targetCenterX - tooltipLeft, 24), TOOLTIP_WIDTH - 24);

  return (
    <div className="tour-root" role="dialog" aria-modal="true" aria-label="Tour de boas-vindas do LOCK">
      <div className="tour-mask" style={{ top: 0, left: 0, width: vw, height: highlightTop }} />
      <div className="tour-mask" style={{ top: highlightTop + highlightHeight, left: 0, width: vw, height: Math.max(vh - (highlightTop + highlightHeight), 0) }} />
      <div className="tour-mask" style={{ top: highlightTop, left: 0, width: highlightLeft, height: highlightHeight }} />
      <div className="tour-mask" style={{ top: highlightTop, left: highlightLeft + highlightWidth, width: Math.max(vw - (highlightLeft + highlightWidth), 0), height: highlightHeight }} />

      <div className="tour-highlight" style={{ top: highlightTop, left: highlightLeft, width: highlightWidth, height: highlightHeight }} />

      <div
        className="tour-tooltip"
        style={{
          width: TOOLTIP_WIDTH,
          left: tooltipLeft,
          top: tooltipTop,
          bottom: tooltipBottomFromTop,
        }}
      >
        <div className={`tour-tooltip-arrow tour-arrow-${placement}`} style={{ left: arrowLeft }} />
        <button className="tour-close-btn" onClick={finish} title="Pular tour" aria-label="Pular tour">
          <X weight="bold" />
        </button>
        <span className="tour-step-counter">{stepIndex + 1} / {TOUR_STEPS.length}</span>
        <h3 className="tour-tooltip-title">{step.title}</h3>
        <p className="tour-tooltip-description">{step.description}</p>
        <div className="tour-tooltip-actions">
          <button type="button" className="tour-skip-link" onClick={finish}>Pular tour</button>
          <button type="button" className="tour-next-btn" onClick={handleNext}>
            {isLast ? 'Entendido' : 'Seguinte'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;

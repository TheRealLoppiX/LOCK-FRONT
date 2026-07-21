import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, CaretRight } from '@phosphor-icons/react';
import './Breadcrumbs.css';

// Rótulos amigáveis para segmentos de rota conhecidos.
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  settings: 'Configurações',
  profile: 'Perfil',
  biblioteca: 'Biblioteca',
  simulados: 'Simulados',
  manual: 'Manual',
  chat: 'Chat — Aegis',
  leaderboard: 'Ranking',
  quizzes: 'Quizzes',
  play: 'Jogar',
  exercises: 'Exercícios',
  labs: 'Laboratórios',
  admin: 'Painel Admin',
  questions: 'Cadastrar Questões',
  materials: 'Cadastrar Material',
  modules: 'Criar Simulado',
  'sql-injection': 'SQL Injection',
  'brute-force': 'Brute Force',
  xss: 'Cross-Site Scripting (XSS)',
  burp: 'Burp Suite',
  tcp: 'TCPDump',
  variado: 'Tema Variado',
  'burp-suite': 'Burp Suite',
  tcpdump: 'TCPDump',
  nmap: 'NMap',
};

// Segmentos-filho de rotas com :id — o rótulo que substitui o UUID cru.
const PARENT_ID_LABELS: Record<string, string> = {
  biblioteca: 'Material',
  simulados: 'Simulado',
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Segmentos puramente estruturais da rota — não agregam valor como item de
// trilha próprio, caso alguma rota futura precise disso.
const HIDDEN_SEGMENTS = new Set<string>([]);

function humanize(segment: string): string {
  return segment
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getLabel(segment: string, index: number, segments: string[]): string {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  if (UUID_RE.test(segment)) {
    const parent = segments[index - 1];
    return PARENT_ID_LABELS[parent] || 'Detalhes';
  }
  if (/^\d+$/.test(segment)) return `Nível ${segment}`;
  return humanize(segment);
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  // Nada a mostrar na home da área logada ou em rotas de nível zero.
  if (segments.length === 0) return null;
  if (segments.length === 1 && segments[0] === 'dashboard') return null;

  let accumulatedPath = '';
  const crumbs: { label: string; href: string; isLast: boolean }[] = [];
  segments.forEach((segment, index) => {
    accumulatedPath += `/${segment}`;
    if (HIDDEN_SEGMENTS.has(segment)) return;
    crumbs.push({
      label: getLabel(segment, index, segments),
      href: accumulatedPath,
      isLast: index === segments.length - 1,
    });
  });
  if (crumbs.length > 0) crumbs[crumbs.length - 1].isLast = true;

  const showDashboardRoot = segments[0] !== 'dashboard';

  return (
    <nav className="breadcrumbs" aria-label="Trilha de navegação">
      <ol>
        {showDashboardRoot && (
          <li>
            <Link to="/dashboard" className="breadcrumb-link">
              <House weight="bold" />
              <span>Dashboard</span>
            </Link>
            <CaretRight size={12} weight="bold" className="breadcrumb-separator" />
          </li>
        )}
        {crumbs.map((crumb) => (
          <li key={crumb.href}>
            {crumb.isLast ? (
              <span className="breadcrumb-current" aria-current="page">{crumb.label}</span>
            ) : (
              <>
                <Link to={crumb.href} className="breadcrumb-link">{crumb.label}</Link>
                <CaretRight size={12} weight="bold" className="breadcrumb-separator" />
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

import { sqlInjectionLabs, bruteForceLabs, xssLabs } from '../pages/labs/LabData';

export interface SearchEntry {
  id: string;
  title: string;
  subtitle?: string;
  path: string;
  category: 'Navegação' | 'Laboratórios' | 'Quizzes' | 'Exercícios' | 'Biblioteca' | 'Simulados';
}

const navigationEntries: SearchEntry[] = [
  { id: 'nav-dashboard', title: 'Dashboard', path: '/dashboard', category: 'Navegação' },
  { id: 'nav-chat', title: 'Chat — Aegis', path: '/chat', category: 'Navegação' },
  { id: 'nav-ranking', title: 'Ranking', path: '/leaderboard', category: 'Navegação' },
  { id: 'nav-perfil', title: 'Perfil', path: '/profile', category: 'Navegação' },
  { id: 'nav-config', title: 'Configurações', path: '/settings', category: 'Navegação' },
  { id: 'nav-biblioteca', title: 'Biblioteca', path: '/biblioteca', category: 'Navegação' },
  { id: 'nav-simulados', title: 'Simulados', path: '/simulados', category: 'Navegação' },
  { id: 'nav-manual', title: 'Manual', path: '/manual', category: 'Navegação' },
];

const labHubEntries: SearchEntry[] = [
  { id: 'lab-hub-sql', title: 'SQL Injection', subtitle: 'Laboratórios', path: '/labs/sql-injection', category: 'Laboratórios' },
  { id: 'lab-hub-brute', title: 'Brute Force', subtitle: 'Laboratórios', path: '/labs/brute-force', category: 'Laboratórios' },
  { id: 'lab-hub-xss', title: 'Cross-Site Scripting (XSS)', subtitle: 'Laboratórios', path: '/labs/xss', category: 'Laboratórios' },
];

const labLevelEntries: SearchEntry[] = [
  ...sqlInjectionLabs.map((lab): SearchEntry => ({
    id: `lab-sql-${lab.id}`,
    title: `SQL Injection — ${lab.title}`,
    subtitle: lab.description,
    path: lab.path,
    category: 'Laboratórios',
  })),
  ...bruteForceLabs.map((lab): SearchEntry => ({
    id: `lab-brute-${lab.id}`,
    title: `Brute Force — ${lab.title}`,
    subtitle: lab.description,
    path: lab.path,
    category: 'Laboratórios',
  })),
  ...xssLabs.map((lab): SearchEntry => ({
    id: `lab-xss-${lab.id}`,
    title: `XSS — ${lab.title}`,
    subtitle: lab.description,
    path: lab.path,
    category: 'Laboratórios',
  })),
];

const quizEntries: SearchEntry[] = [
  { id: 'quiz-variado', title: 'Quiz: Tema Variado', path: '/quizzes/variado', category: 'Quizzes' },
  { id: 'quiz-burp', title: 'Quiz: Burp Suite', path: '/quizzes/burp-suite', category: 'Quizzes' },
  { id: 'quiz-tcpdump', title: 'Quiz: TCPDump', path: '/quizzes/tcpdump', category: 'Quizzes' },
  { id: 'quiz-nmap', title: 'Quiz: NMap', path: '/quizzes/nmap', category: 'Quizzes' },
];

const exerciseEntries: SearchEntry[] = [
  { id: 'exercise-burp', title: 'Exercícios: Burp Suite', path: '/exercises/burp', category: 'Exercícios' },
  { id: 'exercise-tcpdump', title: 'Exercícios: TCPDump', path: '/exercises/tcpdump', category: 'Exercícios' },
  { id: 'exercise-nmap', title: 'Exercícios: NMap', path: '/exercises/nmap', category: 'Exercícios' },
];

export const staticSearchEntries: SearchEntry[] = [
  ...navigationEntries,
  ...labHubEntries,
  ...labLevelEntries,
  ...quizEntries,
  ...exerciseEntries,
];

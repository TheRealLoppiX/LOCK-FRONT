export interface Lab {
  id: string;
  title: string;
  description: string;
  path: string;
  iframeSrc: string;
}

// --- Laboratórios de SQL INJECTION ---
export const sqlInjectionLabs: Lab[] = [
  { id: '1', title: 'SQL Injection - Recuperar Dados Ocultos', description: '...', path: '/labs/sql-injection/1', iframeSrc: '/labs/lab-sqli-1.html' },
  { id: '2', title: 'SQL Injection - Contornar Autenticação', description: '...', path: '/labs/sql-injection/2', iframeSrc: '/labs/lab-sqli-2.html' },
  { id: '3', title: 'SQL Injection - Ataque UNION', description: '...', path: '/labs/sql-injection/3', iframeSrc: '/labs/lab-sqli-3.html' },
];

// --- Laboratórios de BRUTE FORCE ---
export const bruteForceLabs: Lab[] = [
  { id: '1', title: 'Brute Force - Login Simples', description: '...', path: '/labs/brute-force/1', iframeSrc: '/labs/lab-bruteforce-1.html' },
  { id: '2', title: 'Brute Force - Protegido com Token CSRF', description: '...', path: '/labs/brute-force/2', iframeSrc: '/labs/lab-bruteforce-2.html' }
];

// --- NOVOS Laboratórios de XSS ---
export const xssLabs: Lab[] = [
  {
    id: '1',
    title: 'Stored XSS (Armazenado)',
    description: 'Explore uma falha de Stored XSS numa secção de comentários. O payload injetado deve afetar todos os que visitarem a página.',
    path: '/labs/xss/1',
    iframeSrc: '/labs/lab-xss-1-stored.html'
  },
  {
    id: '2',
    title: 'Reflected XSS (Refletido)',
    description: 'Descubra uma vulnerabilidade de Reflected XSS num campo de pesquisa. O payload deve ser parte da URL.',
    path: '/labs/xss/2',
    iframeSrc: '/labs/lab-xss-2-reflected.html'
  },
  {
    id: '3',
    title: 'DOM-based XSS (Baseado em DOM)',
    description: 'Encontre uma falha de XSS que ocorre puramente no lado do cliente, explorando a manipulação do DOM através da URL.',
    path: '/labs/xss/3',
    iframeSrc: '/labs/lab-xss-3-dom.html'
  },
];
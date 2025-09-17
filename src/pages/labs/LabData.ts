export interface Lab {
  id: string; // ID único, ex: "sqli-1", "bf-1"
  title: string;
  description: string;
  path: string; // A rota no React
  iframeSrc: string; // O arquivo .html na pasta /public
}

// Laboratórios de SQL INJECTION
export const sqlInjectionLabs: Lab[] = [
  { id: 'sqli-1', title: 'SQL Injection - Recuperar Dados Ocultos', description: 'Manipule a query para vazar dados.', path: './sqli-1.html', iframeSrc: './lab-sqli-1.html' },
  { id: 'sqli-2', title: 'SQL Injection - Contornar Autenticação', description: 'Explore uma falha de login para acessar como "administrator".', path: './sqli-2.html', iframeSrc: './lab-sqli-2.html' },
  { id: 'sqli-3', title: 'SQL Injection - Ataque UNION', description: 'Use um ataque UNION para extrair dados de outra tabela.', path: './sqli-3.html', iframeSrc: './lab-sqli-3.html' },
];

// Laboratórios de BRUTE FORCE
export const bruteForceLabs: Lab[] = [
  { id: 'bf-1', title: 'Brute Force - Login Simples', description: 'Descubra a senha com um ataque de força bruta.', path: './brute-force/bf-1.html', iframeSrc: './lab-bruteforce-1.html' },
  { id: 'bf-2', title: 'Brute Force - Protegido com Token CSRF', description: 'Adapte sua ferramenta para lidar com tokens anti-CSRF.', path: './brute-force/bf-2.html', iframeSrc: './lab-bruteforce-2.html' }
];

// Laboratórios de XSS
export const xssLabs: Lab[] = [
  { id: 'xss-1', title: 'Stored XSS (Armazenado)', description: 'Injete um script persistente em um campo de comentário.', path: './xss/xss-1.html', iframeSrc: './lab-xss-1-stored.html' },
  { id: 'xss-2', title: 'Reflected XSS (Refletido)', description: 'Crie uma URL com um payload que será executado no navegador.', path: './xss/xss-2.html', iframeSrc: './lab-xss-2-reflected.html' },
  { id: 'xss-3', title: 'DOM-based XSS (Baseado em DOM)', description: 'Manipule o fragmento da URL (#) para injetar um script.', path: './xss/xss-3.html', iframeSrc: './lab-xss-3-dom.html' },
];


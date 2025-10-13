// Define a estrutura de um laboratório
export interface LabInfo {
  id: string;
  title: string;
  description: string;
  path: string;
}

// Lista de laboratórios para cada tópico
export const sqlInjectionLabs: LabInfo[] = [
  { id: '1', title: 'Bypass de Autenticação', description: 'Explore uma falha de SQL Injection para fazer login como administrador sem saber a senha.', path: '/labs/sql-injection/1' },
];

export const bruteForceLabs: LabInfo[] = [
  { id: '1', title: 'Login Simples sem Proteção', description: 'Descubra a senha do usuário "admin" com um ataque de força bruta automatizado.', path: '/labs/brute-force/1' },
];

export const xssLabs: LabInfo[] = [
  { id: '1', title: 'XSS Refletido na Busca', description: 'Injete um script em um campo de busca que é refletido na página de resultados.', path: '/labs/xss/1' },
];
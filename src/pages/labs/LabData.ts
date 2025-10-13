// Define a estrutura de um laboratório
export interface LabInfo {
  id: string;
  title: string;
  description: string;
  path: string;
}

// === LISTA DE LABORATÓRIOS DE SQL INJECTION ===
export const sqlInjectionLabs: LabInfo[] = [
  { 
    id: '1', 
    title: 'Nível 1: Sondagem Inicial', 
    description: 'Confirme se o banco de dados é frágil, provocando um erro de sintaxe SQL.', 
    path: '/labs/sql-injection/1' 
  },
  { 
    id: '2', 
    title: 'Nível 2: Invasão do Painel', 
    description: 'Bypasse a tela de login para acessar a conta do usuário `administrator` sem saber a senha.', 
    path: '/labs/sql-injection/2' 
  },
  { 
    id: '3', 
    title: 'Nível 3: Exfiltração de Informações', 
    description: 'Use um ataque de `UNION SELECT` para vazar a senha de outro usuário do sistema.', 
    path: '/labs/sql-injection/3' 
  },
];

// === LISTA DE LABORATÓRIOS DE BRUTE FORCE ===
export const bruteForceLabs: LabInfo[] = [
  { 
    id: '1', 
    title: 'Nível 1: Reconhecimento', 
    description: 'Descubra quais usuários de uma lista realmente existem no sistema através das mensagens de erro.', 
    path: '/labs/brute-force/1' 
  },
  {
    id: '2',
    title: 'Nível 2: Acesso à Conta',
    description: 'Use um ataque de dicionário para descobrir a senha de uma conta de usuário válida.',
    path: '/labs/brute-force/2'
  },
  {
    id: '3',
    title: 'Nível 3: Ataque Furtivo',
    description: 'Contorne uma proteção de rate limiting para descobrir a senha da conta.',
    path: '/labs/brute-force/3'
  }
];

// === LISTA DE LABORATÓRIOS DE CROSS-SITE SCRIPTING (XSS) ===
export const xssLabs: LabInfo[] = [
  { 
    id: '1', 
    title: 'Nível 1: O Eco Malicioso', 
    description: 'Crie um termo de busca que execute um `alert()` no seu navegador.', 
    path: '/labs/xss/1' 
  },
  {
    id: '2',
    title: 'Nível 2: A Mensagem Persistente',
    description: 'Deixe um comentário malicioso que afete todos os visitantes da página.',
    path: '/labs/xss/2'
  },
  {
    id: '3',
    title: 'Nível 3: A Evasão de Filtros',
    description: 'Encontre uma forma de executar um script bypassando um filtro de segurança básico.',
    path: '/labs/xss/3'
  }
];
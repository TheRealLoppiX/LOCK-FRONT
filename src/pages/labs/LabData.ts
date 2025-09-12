// Este ficheiro serve como a nossa "base de dados" de laboratórios.

export interface Lab {
  id: string;
  title: string;
  description: string;
  path: string;
  iframeSrc: string;
}

export const sqlInjectionLabs: Lab[] = [
  { 
    id: '1', 
    title: 'SQL Injection - Recuperar Dados Ocultos',
    description: 'Use uma vulnerabilidade de SQL Injection para contornar um filtro e exibir todos os produtos da base de dados.',
    path: '/labs/sql-injection/1',
    iframeSrc: '/labs/lab-sqli-1.html'
  },
  { 
    id: '2', 
    title: 'SQL Injection - Contornar Autenticação',
    description: 'Explore uma falha de SQL Injection num formulário de login para aceder como o utilizador administrador.',
    path: '/labs/sql-injection/2',
    iframeSrc: '/labs/lab-sqli-2.html'
  },
  { 
    id: '3', 
    title: 'SQL Injection - Ataque UNION',
    description: 'Utilize um ataque UNION para extrair dados de uma "tabela" diferente e exibi-los na página.',
    path: '/labs/sql-injection/3',
    iframeSrc: '/labs/lab-sqli-3.html'
  },
];
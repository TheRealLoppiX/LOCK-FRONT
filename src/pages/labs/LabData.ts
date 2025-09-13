export interface Lab {
  id: string;
  title: string;
  description: string;
  path: string;
  iframeSrc: string;
}

// ===================================================================
// Laboratórios de SQL INJECTION
// ===================================================================
export const sqlInjectionLabs: Lab[] = [
  { 
    id: '1', 
    title: 'SQL Injection - Recuperar Dados Ocultos', 
    description: 'Um filtro de categoria de produtos está a impedir a visualização de itens confidenciais. O seu objetivo é manipular a consulta SQL subjacente para contornar esta restrição e fazer com que a base de dados devolva todos os produtos, incluindo os que estão marcados como não lançados.', 
    path: '/labs/sql-injection/1', 
    iframeSrc: '/labs/lab-sqli-1.html' 
  },
  { 
    id: '2', 
    title: 'SQL Injection - Contornar Autenticação', 
    description: 'Este laboratório apresenta um formulário de login. A lógica de autenticação é vulnerável a SQL Injection. O seu desafio é construir uma entrada que faça a consulta SQL de verificação de credenciais retornar "verdadeiro", permitindo o acesso à conta do utilizador "administrator" sem saber a sua palavra-passe.', 
    path: '/labs/sql-injection/2', 
    iframeSrc: '/labs/lab-sqli-2.html' 
  },
  { 
    id: '3', 
    title: 'SQL Injection - Ataque UNION', 
    description: 'A página permite visualizar detalhes de produtos com base num ID. Existe outra "tabela" na aplicação que armazena credenciais de utilizador. O seu objetivo é usar um ataque de SQL Injection do tipo UNION para extrair dados desta outra tabela e exibi-los nos resultados da pesquisa de produtos.', 
    path: '/labs/sql-injection/3', 
    iframeSrc: '/labs/lab-sqli-3.html' 
  },
];

// ===================================================================
// Laboratórios de BRUTE FORCE
// ===================================================================
export const bruteForceLabs: Lab[] = [
  {
    id: '1',
    title: 'Brute Force - Login Simples',
    description: 'Um formulário de login básico sem nenhuma proteção contra tentativas repetidas, como bloqueio de conta ou CAPTCHA. Utilizando o nome de utilizador fornecido ("admin"), o seu objetivo é automatizar um ataque de força bruta para descobrir a sua palavra-passe.',
    path: '/labs/brute-force/1',
    iframeSrc: '/labs/lab-bruteforce-1.html'
  },
  {
    id: '2',
    title: 'Brute Force - Protegido com Token CSRF',
    description: 'Este formulário de login implementa um token anti-CSRF que muda a cada tentativa de login. O seu desafio é entender por que um ataque de força bruta simples falha e adaptar a sua ferramenta (como o Burp Intruder) para extrair o novo token a cada pedido, permitindo que o ataque continue.',
    path: '/labs/brute-force/2',
    iframeSrc: '/labs/lab-bruteforce-2.html'
  }
];

// ===================================================================
// Laboratórios de XSS (CROSS-SITE SCRIPTING)
// ===================================================================
export const xssLabs: Lab[] = [
  {
    id: '1',
    title: 'Stored XSS (Armazenado)',
    description: 'Esta página tem uma secção de comentários que armazena as entradas dos utilizadores numa base de dados e as exibe para todos os visitantes. O seu objetivo é injetar um script malicioso (e.g., um `alert()`) no campo de comentário, de forma a que ele seja executado no navegador de qualquer pessoa que visite a página.',
    path: '/labs/xss/1',
    iframeSrc: '/labs/lab-xss-1-stored.html'
  },
  {
    id: '2',
    title: 'Reflected XSS (Refletido)',
    description: 'A funcionalidade de pesquisa desta página reflete o termo pesquisado de volta para o utilizador nos resultados. O seu desafio é criar um URL que contenha um payload de XSS no parâmetro de pesquisa. Quando outra pessoa clicar neste URL, o script será executado no navegador dela.',
    path: '/labs/xss/2',
    iframeSrc: '/labs/lab-xss-2-reflected.html'
  },
  {
    id: '3',
    title: 'DOM-based XSS (Baseado em DOM)',
    description: 'Neste laboratório, a vulnerabilidade existe inteiramente no lado do cliente. Um script na página lê um valor do fragmento da URL (a parte depois do #) e o escreve diretamente no HTML da página. O seu objetivo é manipular o fragmento da URL para injetar um script que seja executado pelo navegador.',
    path: '/labs/xss/3',
    iframeSrc: '/labs/lab-xss-3-dom.html'
  },
];
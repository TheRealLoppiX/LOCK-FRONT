// Define a estrutura de um laboratório
export interface ExerciseInfo {
  id: string;
  title: string;
  path: string;
}

// === LISTA DE EXERCÍCIOS BURP ===
export const BurpExercises: ExerciseInfo[] = [
  { 
    id: '1', 
    title: 'Exercício de Fixação I - Burp Suite', 
    path: '/exercises/burp/1' 
  },
  {
    id: '2',
    title: 'Exercício de Fixação II - Burp Suite',
    path: '/exercises/burp/2'
  },
  {
    id: '3',
    title: 'Exercício de Fixação III - Burp Suite',
    path: '/exercises/burp/3'
  },
  {
    id: '4',
    title: 'Exercício de Fixação IV - Burp Suite',
    path: '/exercises/burp/4'
  },
  {
    id: '5',
    title: 'Exercício de Fixação V - Burp Suite',
    path: '/exercises/burp/5'
  },
  {
    id: '6',
    title: 'Exercício de Fixação VI - Burp Suite',
    path: '/exercises/burp/6'
  },
  {
    id: '7',
    title: 'Exercício de Fixação VII - Burp Suite',
    path: '/exercises/burp/7'
  },
  {
    id: '8',
    title: 'Exercício de Fixação VIII - Burp Suite',
    path: '/exercises/burp/8'
  }
];

// === LISTA DE EXERCÍCIOS TCP ===
export const TCPDumpExercises: ExerciseInfo[] = [
  { 
    id: '1', 
    title: 'Exercício de Fixação I - TCPDump', 
    path: '/exercises/tcp/1' 
  },
  { 
    id: '2', 
    title: 'Exercício de Fixação II - TCPDump', 
    path: '/exercises/tcp/2' 
  },
  { 
    id: '3', 
    title: 'Exercício de Fixação III - TCPDump', 
    path: '/exercises/tcp/3' 
  },
  { 
    id: '4', 
    title: 'Exercício de Fixação IV - TCPDump', 
    path: '/exercises/tcp/4' 
  },
  { 
    id: '5', 
    title: 'Exercício de Fixação V - TCPDump', 
    path: '/exercises/tcp/5' 
  },
  { 
    id: '6', 
    title: 'Exercício de Fixação VI - TCPDump', 
    path: '/exercises/tcp/6' 
  },
  { 
    id: '7', 
    title: 'Exercício de Fixação VII - TCPDump', 
    path: '/exercises/tcp/7' 
  },
  { 
    id: '8', 
    title: 'Exercício de Fixação VIII - TCPDump', 
    path: '/exercises/tcp/8' 
  }
];

// === LISTA DE EXERCÍCIOS NMAP ===
export const NMapExercises: ExerciseInfo[] = [
  { 
    id: '1', 
    title: 'Exercício de Fixação I - NMap', 
    path: '/exercises/nmap/1' 
  }
];
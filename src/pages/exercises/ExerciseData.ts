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
  }
];

// === LISTA DE EXERCÍCIOS TCP ===
export const TCPDumpExercises: ExerciseInfo[] = [
  { 
    id: '1', 
    title: 'Exercício de Fixação I - TCPDump', 
    path: '/exercises/tcp/1' 
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
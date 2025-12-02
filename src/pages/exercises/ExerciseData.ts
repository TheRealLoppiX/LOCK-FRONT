// Define a estrutura de um laboratório
export interface ExerciseInfo {
  id: string;
  title: string;
  path: string;
}

// === LISTA DE LABORATÓRIOS DE SQL INJECTION ===
export const BurpExercises: ExerciseInfo[] = [
  { 
    id: '1', 
    title: 'Exercício de Fixação I - Burp Suite', 
    path: '/exercises/burp/1' 
  }
];

// === LISTA DE LABORATÓRIOS DE BRUTE FORCE ===
export const TCPDumpExercises: ExerciseInfo[] = [
  { 
    id: '1', 
    title: 'Exercício de Fixação I - TCPDump', 
    path: '/exercises/tcp/1' 
  }
];

// === LISTA DE LABORATÓRIOS DE CROSS-SITE SCRIPTING (XSS) ===
export const NMapExercises: ExerciseInfo[] = [
  { 
    id: '1', 
    title: 'Exercício de Fixação I - NMap', 
    path: '/exercises/nmap/1' 
  }
];
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Seu CSS global
import { ThemeProvider } from './contexts/ThemeContext.tsx'; // Importe o Provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider> {/* Envolva o App com o ThemeProvider */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
import React from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../components/hexagonobg';

const Quizzes: React.FC = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <HexagonBackground />
      <h1 style={{ color: 'var(--accent-color)', fontSize: '3rem' }}>Página de Quizzes</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
        Esta área está em desenvolvimento.
      </p>
      <Link 
        to="/dashboard" 
        style={{ 
          display: 'inline-block', 
          marginTop: '30px', 
          color: 'var(--accent-color)', 
          textDecoration: 'none',
          fontSize: '1.1rem'
        }}
      >
        ← Voltar para a Dashboard
      </Link>
    </div>
  );
};

export default Quizzes;
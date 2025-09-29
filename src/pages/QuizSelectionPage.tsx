import React from 'react';
import { Link, useParams } from 'react-router-dom';
import HexagonBackground from '../components/hexagonobg';
import { Timer, Brain, GraduationCap, Trophy, Barbell } from '@phosphor-icons/react';
import './QuizPage.css'; // Estilo compartilhado para as páginas de quiz

const QuizSelectionPage: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  
  const modes = [
    { name: 'Fácil', difficulty: 'fácil', icon: <GraduationCap size={32} />, description: '10 perguntas para iniciantes.' },
    { name: 'Médio', difficulty: 'médio', icon: <Brain size={32} />, description: '10 perguntas de nível intermediário.' },
    { name: 'Difícil', difficulty: 'difícil', icon: <Trophy size={32} />, description: '10 perguntas para desafiar seus conhecimentos.' },
    { name: 'Temporizado', difficulty: 'temporizado', icon: <Timer size={32} />, description: 'Responda o máximo que puder contra o relógio.' },
    { name: 'Treinamento', difficulty: 'treinamento', icon: <Barbell size={32} />, description: 'Pratique sem pressão de tempo ou pontuação.' },
  ];

  return (
    <div className="quiz-page-container">
      <HexagonBackground />
      <div className="quiz-content">
        <header className="quiz-header">
          <h1 style={{ textTransform: 'capitalize' }}>Quiz: {topic?.replace('-', ' ')}</h1>
          <p>Selecione um modo de jogo para começar.</p>
        </header>
        <main className="quiz-mode-grid">
          {modes.map((mode) => (
            <Link 
              key={mode.name} 
              to={`/quiz/player/${topic}/${mode.difficulty}`}
              className="mode-card"
            >
              <div className="mode-icon">{mode.icon}</div>
              <h2>{mode.name}</h2>
              <p>{mode.description}</p>
            </Link>
          ))}
        </main>
        <Link to="/dashboard" className="back-link">← Voltar para a Dashboard</Link>
      </div>
    </div>
  );
};

export default QuizSelectionPage;
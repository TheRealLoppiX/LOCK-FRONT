import React from 'react';
import { Link, useParams } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import { BurpExercises, TCPDumpExercises, NMapExercises, ExerciseInfo } from './ExerciseData.ts';
import './ExercisePage.css';

const topics: Record<string, { title: string; Exercises: ExerciseInfo[] }> = {
  'Burp': { title: 'Burp Suite', Exercises: BurpExercises },
  'TCPDump': { title: 'TCPDump', Exercises: TCPDumpExercises },
  'NMap': { title: 'NMap', Exercises: NMapExercises },
};

const ExercisePage: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const currentTopic = topic ? topics[topic] : null;

  if (!currentTopic) {
    return <div>Tópico de exercício não encontrado</div>;
  }

  return (
    <div className="Exercise-selection-container">
      <HexagonBackground />
      <div className="Exercise-selection-content">
        <header className="Exercise-selection-header">
          <h1>Exercícios: {currentTopic.title}</h1>
          <p>Selecione um dos exercícios abaixo para começar.</p>
        </header>
        <main className="Exercise-selection-grid">
          {currentTopic.Exercises.map((Exercise) => (
            <Link key={Exercise.id} to={Exercise.path} className="Exercise-selection-card">
              <h2>{Exercise.title}</h2>
              <span className="Exercise-action">Iniciar Exercício →</span>
            </Link>
          ))}
        </main>
        <Link to="/dashboard" className="back-link">← Voltar para a Dashboard</Link>
      </div>
    </div>
  );
};

export default ExercisePage;
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle } from '@phosphor-icons/react';
import HexagonBackground from '../../components/hexagonobg';
import { useProfileStats } from '../../hooks/useProfileStats';
import { sqlInjectionLabs, bruteForceLabs, xssLabs, LabInfo } from './LabData';
import './LabPage.css';

const topics: Record<string, { title: string; labs: LabInfo[] }> = {
  'sql-injection': { title: 'SQL Injection', labs: sqlInjectionLabs },
  'brute-force': { title: 'Brute Force', labs: bruteForceLabs },
  'xss': { title: 'Cross-Site Scripting', labs: xssLabs },
};

const LabSelectionPage: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const currentTopic = topic ? topics[topic] : null;
  const { stats } = useProfileStats();
  const completedKeys = new Set(stats.labCompletions.map((l) => l.lab_key));

  if (!currentTopic) {
    return <div>Tópico de laboratório não encontrado</div>;
  }

  return (
    <div className="lab-selection-container">
      <HexagonBackground />
      <div className="lab-selection-content">
        <header className="lab-selection-header">
          <h1>Laboratórios: {currentTopic.title}</h1>
          <p>Selecione um dos desafios abaixo para começar.</p>
        </header>
        <main className="lab-selection-grid">
          {currentTopic.labs.map((lab) => {
            const isCompleted = completedKeys.has(`${topic}-${lab.id}`);
            return (
              <Link key={lab.id} to={lab.path} className={`lab-selection-card ${isCompleted ? 'completed' : ''}`}>
                {isCompleted && (
                  <span className="lab-completed-badge">
                    <CheckCircle weight="fill" size={16} /> Concluído
                  </span>
                )}
                <h2>{lab.title}</h2>
                <p>{lab.description}</p>
                <span className="lab-action">{isCompleted ? 'Refazer Laboratório →' : 'Iniciar Laboratório →'}</span>
              </Link>
            );
          })}
        </main>
        <Link to="/dashboard" className="back-link">← Voltar para a Dashboard</Link>
      </div>
    </div>
  );
};

export default LabSelectionPage;
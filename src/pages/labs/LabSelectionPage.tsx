import React from 'react';
import { Link, useParams } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
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
          {currentTopic.labs.map((lab) => (
            <Link key={lab.id} to={lab.path} className="lab-selection-card">
              <h2>{lab.title}</h2>
              <p>{lab.description}</p>
              <span className="lab-action">Iniciar Laboratório →</span>
            </Link>
          ))}
        </main>
        <Link to="/dashboard" className="back-link">← Voltar para a Dashboard</Link>
      </div>
    </div>
  );
};

export default LabSelectionPage;
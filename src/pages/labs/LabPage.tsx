import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { sqlInjectionLabs, bruteForceLabs, xssLabs, Lab } from './LabData.ts';
import HexagonBackground from '../../components/hexagonobg';
import './LabPage.css';

const allLabs = {
  'sql-injection': sqlInjectionLabs,
  'brute-force': bruteForceLabs,
  'xss': xssLabs,
};

const LabPage: React.FC = () => {
  const { completedLabs, markLabAsCompleted } = useAuth();
  const { topic, labId } = useParams<{ topic: string; labId: string }>();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Adiciona uma verificação de segurança para a origem do evento
      // if (event.origin !== window.location.origin) return; 

      if (event.data?.type === 'labCompleted') {
        markLabAsCompleted(event.data.labId);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [markLabAsCompleted, topic, labId]);
  
  let lab: Lab | undefined;
  if (topic && labId) {
    const labCategory = allLabs[topic as keyof typeof allLabs];
    if (labCategory) {
      lab = labCategory.find(l => l.id === labId);
    }
  }

  if (!lab) { 
    return (
      <div className="lab-container">
        <HexagonBackground />
        <header className="lab-header">
            <h1>Laboratório não encontrado</h1>
            <Link to="/dashboard" className="back-link">← Voltar para a Dashboard</Link>
        </header>
      </div>
    );
  }

  const isCompleted = completedLabs.includes(lab.id);

  return (
    <div className="lab-container">
      <HexagonBackground />
      <header className="lab-header">
        <h1>{lab.title}</h1>
        <div className="objective-container">
          <p><strong>Objetivo:</strong> {lab.description}</p>
          {isCompleted && <span className="status-completed">Concluído ✔</span>}
        </div>
        <Link to={`/labs/${topic}`} className="back-link">← Voltar para a lista</Link>
      </header>
      <div className="lab-environment">
        <iframe src={lab.iframeSrc} title={lab.title} className="lab-iframe" sandbox="allow-scripts allow-forms" />
      </div>
    </div>
  );
};

export default LabPage;
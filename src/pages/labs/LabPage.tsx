import React, { useEffect, useContext } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './LabPage.css';
import { sqlInjectionLabs, bruteForceLabs, xssLabs, Lab } from './LabData'; 
import { useAuth } from '../../contexts/authContext'; // Importa o useAuth

// Junta todos os catálogos de laboratórios
const allLabs = {
  'sql-injection': sqlInjectionLabs,
  'brute-force': bruteForceLabs,
  'xss': xssLabs,
};

const LabPage: React.FC = () => {
  const { completedLabs, markLabAsCompleted } = useAuth(); // Pega o estado e a função do contexto
  const location = useLocation();
  const { topic, labId } = useParams<{ topic: string; labId: string }>();

  // Efeito para "ouvir" o iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'labCompleted' && topic && labId) {
        // Cria um ID único para o laboratório (e.g., "sql-injection-1")
        const labIdentifier = `${topic}-${labId}`;
        markLabAsCompleted(labIdentifier);
      }
    };
    window.addEventListener('message', handleMessage);
    // Limpa o "ouvinte" quando o componente é desmontado
    return () => window.removeEventListener('message', handleMessage);
  }, [topic, labId, markLabAsCompleted]);

  // Lógica para encontrar o laboratório (já estava correta)
  let lab: Lab | undefined = location.state?.lab;
  let backLink: string = location.state?.backLink;

  if (!lab && topic && labId) {
    const labCategory = allLabs[topic as keyof typeof allLabs];
    if (labCategory) {
      lab = labCategory.find(l => l.id === labId);
    }
    backLink = `/labs/${topic}`;
  }

  // Verifica se o laboratório atual está na lista de concluídos
  const isCompleted = topic && labId && completedLabs.includes(`${topic}-${labId}`);

  if (!lab) {
    return (
      <div className="lab-container">
        <div className="lab-header">
          <h1>Laboratório não encontrado</h1>
          <Link to="/dashboard" className="back-link">← Voltar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lab-container">
      <header className="lab-header">
        <h1>{lab.title}</h1>
        <div className="objective-container">
          <p><strong>Objetivo:</strong> {lab.description}</p>
          {/* Mostra o status de concluído se for o caso */}
          {isCompleted && <span className="status-completed">Concluído ✔</span>}
        </div>
        <Link to={backLink || '/dashboard'} className="back-link">← Voltar para a lista</Link>
      </header>
      <div className="lab-environment">
        <iframe src={lab.iframeSrc} title={lab.title} className="lab-iframe" sandbox="allow-scripts allow-forms" />
      </div>
    </div>
  );
};

export default LabPage;
import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './LabPage.css';
import { sqlInjectionLabs, bruteForceLabs, xssLabs, Lab } from './LabData'; 

// Junta todos os catálogos de laboratórios num só sítio para facilitar a busca
const allLabs = {
  'sql-injection': sqlInjectionLabs,
  'brute-force': bruteForceLabs,
  'xss': xssLabs,
  // Adicione outros catálogos aqui no futuro
};

const LabPage: React.FC = () => {
  const location = useLocation();
  const { topic, labId } = useParams<{ topic: string; labId: string }>();

  // Tenta obter os detalhes do laboratório do state da navegação (mais rápido)
  let lab: Lab | undefined = location.state?.lab;
  let backLink: string = location.state?.backLink;

  // Se não encontrar (página atualizada), procura nos nossos catálogos
  if (!lab && topic && labId) {
    const labCategory = allLabs[topic as keyof typeof allLabs];
    if (labCategory) {
      lab = labCategory.find(l => l.id === labId);
    }
    backLink = `/labs/${topic}`;
  }

  // Se ainda assim não encontrar o laboratório, mostra uma mensagem de erro
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
        <p><strong>Objetivo:</strong> {lab.description}</p>
        <Link to={backLink || '/dashboard'} className="back-link">← Voltar para a lista</Link>
      </header>
      <div className="lab-environment">
        <iframe src={lab.iframeSrc} title={lab.title} className="lab-iframe" sandbox="allow-scripts allow-forms" />
      </div>
    </div>
  );
};

export default LabPage;
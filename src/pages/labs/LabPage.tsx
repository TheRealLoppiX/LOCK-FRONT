import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './LabPage.css';
import { sqlInjectionLabs, Lab } from './LabData'; 

const LabPage: React.FC = () => {
  const location = useLocation();
  const { labId } = useParams<{ labId: string }>(); 

  // Tenta obter os detalhes do laboratório do state da navegação
  let lab: Lab | undefined = location.state?.lab;

  // Se não encontrar (página atualizada), procura no nosso catálogo
  if (!lab) {
    lab = sqlInjectionLabs.find(l => l.id === labId);
  }

  // Se ainda assim não encontrar o laboratório, mostra uma mensagem de erro
  if (!lab) {
    return (
      <div className="lab-container">
        <div className="lab-header">
          <h1>Laboratório não encontrado</h1>
          <p>O laboratório que você está a procurar não existe.</p>
          <Link to="/labs/sql-injection" className="back-link">← Voltar para a lista</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lab-container">
      <header className="lab-header">
        <h1>{lab.title}</h1>
        <p><strong>Objetivo:</strong> {lab.description}</p>
        <Link to="/labs/sql-injection" className="back-link">← Voltar para a lista</Link>
      </header>
      <div className="lab-environment">
        <iframe
          src={lab.iframeSrc}
          title={lab.title}
          className="lab-iframe"
          sandbox="allow-scripts allow-forms"
        />
      </div>
    </div>
  );
};

export default LabPage;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LabPage.css';

interface LabDetails {
  title: string;
  objective: string;
  iframeSrc: string;
  backLink: string;
}

const LabPage: React.FC = () => {
  const location = useLocation();
  // Os detalhes do laboratório são passados através do estado da rota
  const { title, objective, iframeSrc, backLink } = location.state as LabDetails;

  return (
    <div className="lab-container">
      <header className="lab-header">
        <h1>{title}</h1>
        <p><strong>Objetivo:</strong> {objective}</p>
        <Link to={backLink} className="back-link">← Voltar para a lista</Link>
      </header>
      <div className="lab-environment">
        <iframe
          src={iframeSrc}
          title={title}
          className="lab-iframe"
          sandbox="allow-scripts allow-forms" // Medida de segurança para iframes
        />
      </div>
    </div>
  );
};

export default LabPage;

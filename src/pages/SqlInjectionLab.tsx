import React from 'react';
import { Link } from 'react-router-dom';
import './LabPage.css'; // Um CSS genérico para as páginas de laboratório

const SqlInjectionLab: React.FC = () => {
  return (
    <div className="lab-container">
      <header className="lab-header">
        <h1>Laboratório: SQL Injection</h1>
        <p><strong>Objetivo:</strong> Explore a caixa de pesquisa para encontrar uma forma de exibir todos os produtos, incluindo os que estão ocultos.</p>
        <Link to="/labs/burp-suite" className="back-link">← Voltar para a lista de laboratórios</Link>
      </header>
      <div className="lab-environment">
        <iframe 
          src="/labs/sql-injection-vulnerable-site.html" 
          title="Laboratório de SQL Injection"
          className="lab-iframe"
        />
      </div>
    </div>
  );
};

export default SqlInjectionLab;
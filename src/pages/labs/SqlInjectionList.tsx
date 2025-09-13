import React from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import './SqlInjectionList.css'; 
import { sqlInjectionLabs } from './LabData';

const SqlInjectionList: React.FC = () => {
  return (
    <div className="labs-page-container">
      <HexagonBackground />
      <div className="labs-content">
        <header className="labs-header">
          <h1>Laboratórios: SQL Injection</h1>
          <p>Selecione um dos desafios abaixo para começar.</p>
          <Link to="/dashboard" className="back-link">← Voltar para a Dashboard</Link>
        </header>

        <main className="labs-grid">
          {sqlInjectionLabs.map((lab) => (
            <Link key={lab.id} to={lab.path} className="lab-card" state={{ lab }}>
              <div className="lab-card-content">
                <h2>{lab.title}</h2>
                <p>{lab.description}</p>
                <span className="lab-action">Iniciar Laboratório →</span>
              </div>
            </Link>
          ))}
        </main>
      </div>
    </div>
  );
};

export default SqlInjectionList;
import React from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import './LabPage.css';

const categories = [
  { id: 'sql-injection', title: 'SQL Injection', description: 'Explore falhas de injeção SQL em ambientes controlados.' },
  { id: 'brute-force', title: 'Brute Force', description: 'Pratique técnicas de força bruta e enumeração de usuários.' },
  { id: 'xss', title: 'Cross-Site Scripting (XSS)', description: 'Injete payloads e entenda como se proteger de XSS.' },
];

const LabCategoryIndexPage: React.FC = () => {
  return (
    <div className="lab-selection-container">
      <HexagonBackground />
      <div className="lab-selection-content">
        <header className="lab-selection-header">
          <h1>Laboratórios</h1>
          <p>Selecione uma categoria para ver os laboratórios práticos disponíveis.</p>
        </header>
        <main className="lab-selection-grid">
          {categories.map((category) => (
            <Link key={category.id} to={`/labs/${category.id}`} className="lab-selection-card">
              <h2>{category.title}</h2>
              <p>{category.description}</p>
              <span className="lab-action">Ver laboratórios →</span>
            </Link>
          ))}
        </main>
        <Link to="/dashboard" className="back-link">← Voltar para a Dashboard</Link>
      </div>
    </div>
  );
};

export default LabCategoryIndexPage;

import React from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import './ExercisePage.css';

const categories = [
  { id: 'burp', title: 'Burp Suite', description: 'Exercícios de interceptação e análise de requisições HTTP.' },
  { id: 'tcpdump', title: 'TCPDump', description: 'Exercícios de captura e análise de tráfego de rede.' },
  { id: 'nmap', title: 'NMap', description: 'Exercícios de varredura e reconhecimento de redes.' },
];

const ExerciseCategoryIndexPage: React.FC = () => {
  return (
    <div className="Exercise-selection-container">
      <HexagonBackground />
      <div className="Exercise-selection-content">
        <header className="Exercise-selection-header">
          <h1>Exercícios</h1>
          <p>Selecione uma tecnologia para ver os exercícios de fixação disponíveis.</p>
        </header>
        <main className="Exercise-selection-grid">
          {categories.map((category) => (
            <Link key={category.id} to={`/exercises/${category.id}`} className="Exercise-selection-card">
              <h2>{category.title}</h2>
              <p>{category.description}</p>
              <span className="Exercise-action">Ver exercícios →</span>
            </Link>
          ))}
        </main>
        <Link to="/dashboard" className="back-link">← Voltar para a Dashboard</Link>
      </div>
    </div>
  );
};

export default ExerciseCategoryIndexPage;

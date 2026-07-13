import React from 'react';
import { Link } from 'react-router-dom';
import { WarningCircle } from '@phosphor-icons/react';
import HexagonBackground from '../components/hexagonobg';
import './NotFound.css';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <HexagonBackground />
      <div className="not-found-content">
        <WarningCircle size={64} weight="duotone" className="not-found-icon" />
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>O endereço que você tentou acessar não existe ou foi movido.</p>
        <Link to="/dashboard" className="not-found-link">← Voltar para a Dashboard</Link>
      </div>
    </div>
  );
};

export default NotFound;

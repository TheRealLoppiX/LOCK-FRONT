import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import './LabPage.css';

const XSSLab1: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(`Resultados da busca por: ${searchTerm}`);
  };

  return (
    <div className="lab-page-container">
      <HexagonBackground />
      <div className="lab-content">
        <h1>Nível 1: O Eco Malicioso</h1>
        <p className="lab-objective">
          A barra de busca reflete o termo pesquisado na página de resultados sem qualquer filtro. Crie um termo de busca que execute um `alert()` no seu navegador.
        </p>
        <form onSubmit={handleSearch} className="lab-form">
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="<script>alert('XSS')</script>" />
          <button type="submit">Buscar</button>
        </form>
        {result && (
          <div className="result-message" dangerouslySetInnerHTML={{ __html: result }} />
        )}
         <Link to="/labs/xss" className="back-link">← Voltar</Link>
      </div>
    </div>
  );
};
export default XSSLab1;
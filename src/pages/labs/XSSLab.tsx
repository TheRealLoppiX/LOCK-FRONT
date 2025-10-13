import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import './LabPage.css';

const XSSLab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(`Resultados da sua busca por: ${searchTerm}`);
  };

  return (
    <div className="lab-page-container">
      <HexagonBackground />
      <div className="lab-content">
        <h1>Laboratório: XSS Refletido</h1>
        <p className="lab-objective">Injete um script no campo de busca que execute um `alert('XSS')`. O conteúdo da sua busca será refletido na página sem sanitização.</p>
        <form onSubmit={handleSearch} className="lab-form">
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="<script>alert('XSS')</script>" />
          <button type="submit">Buscar</button>
        </form>
        {result && (
          <div className="result-message" dangerouslySetInnerHTML={{ __html: result }} />
        )}
         <Link to="/labs/xss" className="back-link">← Voltar para a lista de laboratórios</Link>
      </div>
    </div>
  );
};
export default XSSLab;
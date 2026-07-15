import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import { useAuth } from '../../contexts/authContext';
import { markLabComplete, looksLikeXssPayload } from '../../utils/labProgress';
import HintPanel from '../../components/labs/HintPanel';
import './LabPage.css';

const HINTS = [
  'O termo que você digita na busca volta pra página sem filtro — tente digitar uma tag HTML simples pra ver se ela é interpretada em vez de exibida como texto.',
  'Uma tag `<script>alert(1)</script>` ou um atributo de evento como `<img src=x onerror=alert(1)>` no campo de busca deve disparar o alerta.',
];

const XSSLab1: React.FC = () => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(`Resultados da busca por: ${searchTerm}`);
    if (looksLikeXssPayload(searchTerm)) markLabComplete(token, 'xss-1');
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
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <button type="submit">Buscar</button>
        </form>
        {result && (
          <div className="result-message" dangerouslySetInnerHTML={{ __html: result }} />
        )}
        <HintPanel labTitle="Nível 1: O Eco Malicioso" hints={HINTS} />

         <Link to="/labs/xss" className="back-link">← Voltar</Link>
      </div>
    </div>
  );
};
export default XSSLab1;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import './LabPage.css';

const SqlInjectionLab: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/labs/sql-injection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: "Erro de conexão com a API. Verifique se ela está no ar." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lab-page-container">
      <HexagonBackground />
      <div className="lab-content">
        <h1>Laboratório: Bypass de Autenticação com SQLi</h1>
        <p className="lab-objective">O objetivo é fazer login como administrador sem saber a senha. Tente usar um payload de SQL Injection clássico, como `' OR '1'='1`, nos campos de usuário e senha.</p>
        
        <form onSubmit={handleSubmit} className="lab-form">
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuário" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" />
          <button type="submit" disabled={isLoading}>{isLoading ? 'Verificando...' : 'Entrar'}</button>
        </form>

        {result && (
          <div className={`result-message ${result.success ? 'success' : 'error'}`}>
            {result.message}
          </div>
        )}
        <Link to="/labs/sql-injection" className="back-link">← Voltar para a lista de laboratórios</Link>
      </div>
    </div>
  );
};

export default SqlInjectionLab;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import './LabPage.css';

const SqlInjectionLab2: React.FC = () => {
  const [username, setUsername] = useState("administrator'--");
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/labs/sql-injection/2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: "Erro de conexão com a API." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lab-page-container">
      <HexagonBackground />
      <div className="lab-content">
        <h1>Nível 2: Invasão do Painel</h1>
        <p className="lab-objective">
          Agora que a vulnerabilidade foi confirmada, seu objetivo é explorar a falha para bypassar a tela de login e acessar a conta do usuário `administrator` sem saber a senha.
        </p>
        <form onSubmit={handleSubmit} className="lab-form">
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuário" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha (pode ser qualquer coisa)" />
          <button type="submit" disabled={isLoading}>{isLoading ? 'Invadindo...' : 'Entrar'}</button>
        </form>
        {result && (
          <div className={`result-message ${result.success ? 'success' : 'error'}`}>
            {result.message}
          </div>
        )}
        <Link to="/labs/sql-injection" className="back-link">← Voltar</Link>
      </div>
    </div>
  );
};
export default SqlInjectionLab2;
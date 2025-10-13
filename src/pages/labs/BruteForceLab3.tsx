import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import './LabPage.css';

const BruteForceLab3: React.FC = () => {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/labs/brute-force/3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
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
        <h1>Nível 3: Ataque Furtivo</h1>
        <p className="lab-objective">
          O sistema agora bloqueia seu IP por 60 segundos após 3 tentativas falhas. Descubra a senha (`4815`) do `admin` contornando essa proteção.
        </p>
        <form onSubmit={handleSubmit} className="lab-form">
          <input type="text" value="admin" disabled />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" />
          <button type="submit" disabled={isLoading}>{isLoading ? 'Tentando...' : 'Entrar'}</button>
        </form>
        {result && (
          <div className={`result-message ${result.success ? 'success' : 'error'}`}>
            {result.message}
          </div>
        )}
        <Link to="/labs/brute-force" className="back-link">← Voltar</Link>
      </div>
    </div>
  );
};
export default BruteForceLab3;
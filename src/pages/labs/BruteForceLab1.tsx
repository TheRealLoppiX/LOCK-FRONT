import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import './LabPage.css'; // Reutiliza o mesmo estilo dos outros laboratórios

const BruteForceLab: React.FC = () => {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setIsLoading(true);
    setAttempts(prev => prev + 1); // Incrementa o contador de tentativas

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/labs/brute-force/1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
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
        <h1>Laboratório: Força Bruta em Login</h1>
        <p className="lab-objective">
          O objetivo é descobrir a senha do usuário, um padrão numérico de três dígitos.
        </p>
        
        <form onSubmit={handleSubmit} className="lab-form">
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Tentativa de senha" 
          />
          <button type="submit" disabled={isLoading}>{isLoading ? 'Testando...' : 'Tentar Senha'}</button>
        </form>

        {/* Mostra o resultado da tentativa */}
        {result && (
          <div className={`result-message ${result.success ? 'success' : 'error'}`}>
            {result.message}
          </div>
        )}

        {/* Contador de tentativas */}
        {attempts > 0 && !result?.success && (
            <p className="attempts-counter">Tentativas: {attempts}</p>
        )}

        <Link to="/labs/brute-force" className="back-link">← Voltar para a lista de laboratórios</Link>
      </div>
    </div>
  );
};

export default BruteForceLab;
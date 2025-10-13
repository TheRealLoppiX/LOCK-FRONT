import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import './LabPage.css';

const BruteForceLab2: React.FC = () => {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [labToken, setLabToken] = useState<string | null>(null); // State para guardar o token do lab
  const [setupError, setSetupError] = useState<string | null>(null);

  // useEffect para iniciar o laboratório assim que a página carrega
  useEffect(() => {
    const startLab = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/labs/brute-force/2/start`, {
          method: 'POST',
        });
        if (!response.ok) throw new Error("Falha ao iniciar o laboratório.");
        const data = await response.json();
        setLabToken(data.labToken);
      } catch (error) {
        setSetupError("Não foi possível carregar o laboratório. Verifique a conexão com a API e recarregue a página.");
      }
    };
    startLab();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/labs/brute-force/2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', passwordGuess: password, labToken }), // Envia a tentativa e o token
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: "Erro de conexão com a API." });
    } finally {
      setIsLoading(false);
    }
  };

  if (setupError) {
    return (
      <div className="lab-page-container">
        <div className="lab-content">
          <h1>Erro no Laboratório</h1>
          <div className="result-message error">{setupError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="lab-page-container">
      <HexagonBackground />
      <div className="lab-content">
        <h1>Nível 2: Força Bruta em Senha Aleatória</h1>
        <p className="lab-objective">
          O sistema agora gera uma <strong>senha aleatória de 8 caracteres alfanuméricos</strong> para o usuário `admin` toda vez que você acessa esta página. 
          Seu objetivo é criar um script ou usar uma ferramenta para descobrir a senha antes que ela mude.
        </p>
        <form onSubmit={handleSubmit} className="lab-form">
          <input type="text" value="admin" disabled />
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Senha" 
            disabled={!labToken} // Desativa o campo enquanto o lab não carrega
          />
          <button type="submit" disabled={isLoading || !labToken}>
            {isLoading ? 'Tentando...' : 'Entrar'}
          </button>
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

export default BruteForceLab2;
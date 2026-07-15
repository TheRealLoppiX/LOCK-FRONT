import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import { useAuth } from '../../contexts/authContext';
import { markLabComplete } from '../../utils/labProgress';
import HintPanel from '../../components/labs/HintPanel';
import './LabPage.css';

const HINTS = [
  'Feche a string do campo de usuário e monte um `UNION SELECT` com duas colunas — a query original provavelmente seleciona 2 colunas (usuário e senha), então seu UNION precisa do mesmo número.',
  'Tente algo como `\' UNION SELECT \'algum_texto\', NULL -- ` no campo de usuário — se o número de colunas bater, o texto que você escolheu aparece na tela como se fosse o resultado do login.',
];

const SqlInjectionLab3: React.FC = () => {
  const { token } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/labs/sql-injection/3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      setResult(data);
      if (data.success) markLabComplete(token, 'sql-injection-3');
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
        <h1>Nível 3: Exfiltração de Informações</h1>
        <p className="lab-objective">
          Use um ataque de `UNION SELECT` para, em vez do nome de usuário, vazar a senha do `administrator` do sistema.
        </p>
        <form onSubmit={handleSubmit} className="lab-form">
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Payload UNION SELECT" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" />
          <button type="submit" disabled={isLoading}>{isLoading ? 'Extraindo...' : 'Login'}</button>
        </form>
        {result && (
          <div className={`result-message ${result.success ? 'success' : 'error'}`}>
            {result.message}
          </div>
        )}
        <HintPanel labTitle="Nível 3: Exfiltração de Informações" hints={HINTS} />

        <Link to="/labs/sql-injection" className="back-link">← Voltar</Link>
      </div>
    </div>
  );
};
export default SqlInjectionLab3;
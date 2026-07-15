import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import { useAuth } from '../../contexts/authContext';
import { markLabComplete } from '../../utils/labProgress';
import HintPanel from '../../components/labs/HintPanel';
import './LabPage.css';

const HINTS = [
  'Se a query monta algo como `SELECT * FROM users WHERE user=\'X\' AND pass=\'Y\'`, fechar a string do usuário com aspas e comentar o resto da query pode pular a checagem de senha.',
  'Tente terminar o campo de usuário com o nome da conta que você quer acessar seguido de `\'--` (a senha pode ficar em branco) — o `--` comenta a parte da query que checaria a senha.',
];

const SqlInjectionLab2: React.FC = () => {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/labs/sql-injection/2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      setResult(data);
      if (data.success) markLabComplete(token, 'sql-injection-2');
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
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" />
          <button type="submit" disabled={isLoading}>{isLoading ? 'Invadindo...' : 'Entrar'}</button>
        </form>
        {result && (
          <div className={`result-message ${result.success ? 'success' : 'error'}`}>
            {result.message}
          </div>
        )}
        <HintPanel labTitle="Nível 2: Invasão do Painel" hints={HINTS} />

        <Link to="/labs/sql-injection" className="back-link">← Voltar</Link>
      </div>
    </div>
  );
};
export default SqlInjectionLab2;
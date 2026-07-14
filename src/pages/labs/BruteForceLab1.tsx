import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import { useAuth } from '../../contexts/authContext';
import { markLabComplete } from '../../utils/labProgress';
import './LabPage.css';

interface Attempt {
  username: string;
  message: string;
  exists: boolean;
}

const BruteForceLab1: React.FC = () => {
  const { token } = useAuth();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const testedUsernames = attempts.map((a) => a.username);
  const realUsernames = attempts.filter((a) => a.exists).map((a) => a.username);

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = username.trim();
    if (!candidate || testedUsernames.includes(candidate)) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/labs/brute-force/1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: candidate }),
      });
      const data = await response.json();
      setAttempts((prev) => [...prev, { username: candidate, message: data.message, exists: data.message === 'Senha incorreta.' }]);
      setUsername('');
    } catch (error) {
      setAttempts((prev) => [...prev, { username: candidate, message: 'Erro de conexão com a API.', exists: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelected = (name: string) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  const handleConfirm = () => {
    const guessed = [...selected].sort();
    const real = [...realUsernames].sort();
    const isCorrect = guessed.length === real.length && guessed.every((u, i) => u === real[i]);

    if (isCorrect) {
      setResult({ success: true, message: `Correto! Você identificou os usuários reais (${real.join(', ')}) apenas observando as mensagens de erro diferentes.` });
      markLabComplete(token, 'brute-force-1');
    } else {
      setResult({ success: false, message: 'Ainda não está certo. Teste mais usuários e observe com atenção quais mensagens dizem "Senha incorreta" (usuário existe) e quais dizem "Usuário não encontrado".' });
    }
  };

  return (
    <div className="lab-page-container">
      <HexagonBackground />
      <div className="lab-content">
        <h1>Laboratório: Reconhecimento por Força Bruta</h1>
        <p className="lab-objective">
          Teste nomes de usuário e observe a mensagem de erro retornada. Contas que existem respondem
          "Senha incorreta.", contas que não existem respondem "Usuário não encontrado." — essa diferença
          é uma vulnerabilidade real de enumeração de usuários. Depois de testar, marque abaixo quais
          usuários você acredita que realmente existem.
        </p>

        <form onSubmit={handleTest} className="lab-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nome de usuário para testar (ex: admin)"
          />
          <button type="submit" disabled={isLoading || !username.trim()}>
            {isLoading ? 'Testando...' : 'Testar Usuário'}
          </button>
        </form>

        {attempts.length > 0 && (
          <div style={{ marginTop: 24, textAlign: 'left' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 8 }}>
              Usuários testados — marque os que você acha que existem:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {attempts.map((a) => (
                <li
                  key={a.username}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'var(--background-primary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(a.username)}
                      onChange={() => toggleSelected(a.username)}
                    />
                    <strong>{a.username}</strong>
                  </label>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{a.message}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={selected.length === 0}
              style={{ marginTop: 16, width: '100%' }}
            >
              Confirmar Descoberta
            </button>
          </div>
        )}

        {result && (
          <div className={`result-message ${result.success ? 'success' : 'error'}`}>
            {result.message}
          </div>
        )}

        <Link to="/labs/brute-force" className="back-link">← Voltar para a lista de laboratórios</Link>
      </div>
    </div>
  );
};

export default BruteForceLab1;

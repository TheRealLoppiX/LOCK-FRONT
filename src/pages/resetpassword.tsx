import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import HexagonBackground from '../components/hexagonobg';
import './auth.css';

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>(); // Pega o token da URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/resetpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();
      setMessage(data.message || data.error);

      if(response.ok) {
        setTimeout(() => navigate('/login'), 3000); // Redireciona para o login após 3s
      }

    } catch (error) {
      setMessage('Erro ao conectar à API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <HexagonBackground />
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Crie uma Nova Senha</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <input
                type="password"
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="login-input"
                required
              />
            </div>
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </form>
          {message && <p style={{ textAlign: 'center', marginTop: '20px' }}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
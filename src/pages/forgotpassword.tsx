import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../components/hexagonobg';
import './auth.css'; // Reutilizando o CSS de login

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      setMessage(data.message || data.error);

    } catch (error) {
      setMessage('Erro ao conectar à API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <HexagonBackground />
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Redefinir Senha</h1>
          <p className="auth-subtitle">Digite seu e-mail para receber o link de redefinição.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
              />
            </div>
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar Link'}
            </button>
          </form>
          {message && <p style={{ textAlign: 'center', marginTop: '20px' }}>{message}</p>}
          <div className="auth-links">
            <p>
              <Link to="/login" className="auth-link">← Voltar para o Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
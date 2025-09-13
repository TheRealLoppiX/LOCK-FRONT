import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../components/hexagonobg';
import './auth.css'; // Reutiliza o estilo das páginas de autenticação

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/forgot-password`, { // <-- CORREÇÃO AQUI
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Algo correu mal');
      }
      
      setMessage(data.message);

    } catch (error) {
      setMessage('Erro ao enviar o pedido. Tente novamente.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <HexagonBackground />
      <div className="auth-card">
        <h1>Redefinir Palavra-passe</h1>
        <p className="auth-subtitle">Digite o seu e-mail para receber o link de redefinição.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="O seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'A Enviar...' : 'Enviar Link'}
          </button>
        </form>

        {message && <p className="message-feedback">{message}</p>}

        <div className="auth-links">
          <Link to="/login">← Voltar para o Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
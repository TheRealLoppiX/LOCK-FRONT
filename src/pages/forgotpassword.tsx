import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../components/hexagonobg';
import { EnvelopeSimple } from '@phosphor-icons/react';
import './auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Não foi possível enviar o link.');
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <HexagonBackground />
      <div className="auth-container">
        {sent ? (
          <div className="auth-form">
            <div className="auth-success-icon">
              <EnvelopeSimple size={40} weight="bold" />
            </div>
            <h1>Verifique seu e-mail</h1>
            <p>
              Se existir uma conta com o e-mail <strong>{email}</strong>, enviamos um link
              para redefinir sua senha. O link expira em 1 hora.
            </p>
            <div className="switch-link">
              <Link to="/login">← Voltar para o Login</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <h1>Redefinir Senha</h1>
            <p>Digite seu e-mail para receber o link de redefinição.</p>

            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Link'}
            </button>

            <div className="switch-link">
              <Link to="/login">← Voltar para o Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

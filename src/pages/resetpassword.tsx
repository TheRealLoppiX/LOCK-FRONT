import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import HexagonBackground from '../components/hexagonobg';
import { Eye, EyeSlash, CheckCircle } from '@phosphor-icons/react';
import './auth.css';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Não foi possível redefinir a senha.');
      }

      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar à API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <HexagonBackground />
      <div className="auth-container">
        {success ? (
          <div className="auth-form">
            <div className="auth-success-icon">
              <CheckCircle size={40} weight="bold" />
            </div>
            <h1>Senha redefinida!</h1>
            <p>Você será redirecionado para o login em instantes...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <h1>Crie uma Nova Senha</h1>
            <p>Escolha uma nova senha para acessar sua conta.</p>

            {error && <div className="error-message">{error}</div>}

            <div className="input-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nova senha (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <div className="input-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
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

export default ResetPassword;

import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import HexagonBackground from '../components/hexagonobg';
import { EnvelopeSimple, ShieldCheck } from '@phosphor-icons/react';
import { useAuth } from '../contexts/authContext';
import './auth.css';

// Página pública — quem chega aqui ainda não tem conta (ver comentário em
// LOCK-API sobre POST /admin/admins/activate: a conta só nasce quando o
// código do convite é confirmado). Login automático em caso de sucesso
// (ver activateAdminInvite em authContext.tsx), mesmo padrão do /verify-email.
const ActivateAdmin: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { activateAdminInvite } = useAuth();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await activateAdminInvite(email, code);
    } catch (err: any) {
      setError(err.message || 'Não foi possível ativar a conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <HexagonBackground />
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h1>Ativar Acesso de Administrador</h1>
          <p>Digite o e-mail e o código de ativação recebidos no convite.</p>

          {error && <div className="auth-error-message">{error}</div>}

          <div className="auth-input-group">
            <EnvelopeSimple size={18} className="auth-input-icon" />
            <input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="auth-input-group">
            <ShieldCheck size={18} className="auth-input-icon" />
            <input
              type="text"
              placeholder="Código de ativação"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              style={{ letterSpacing: '3px', textTransform: 'uppercase' }}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Ativando...' : 'Ativar Conta'}
          </button>

          <div className="switch-link">
            <Link to="/login">← Voltar para o Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivateAdmin;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import './auth.css';
import { Eye, EyeSlash } from '@phosphor-icons/react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError("Você deve aceitar os Termos de Uso e a Política de Privacidade.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard'); 
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <HexagonBackground />
      <div className="register-container">
        <form onSubmit={handleSubmit} className="register-form">
          <h1>Criar Conta</h1>
          <p>Junte-se ao LOCK e comece sua jornada na cibersegurança.</p>
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome Completo"
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              required
            />
          </div>
          
          <div className="input-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha (mín. 6 caracteres)"
              required
            />
            <span 
              className="password-toggle-icon" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <div className="terms-container">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              Ao criar a conta, aceito os 
              <a 
                href="/Termos_de_Uso_LOCK.pdf" 
                download="Termos_de_Uso_LOCK.pdf"
              >
                Termos de Uso
              </a> 
              e a 
              <a 
                href="/Politica_de_Privacidade_LOCK.pdf" 
                download="Politica_de_Privacidade_LOCK.pdf"
              >
                Política de Privacidade
              </a>.
            </label>
          </div>
          <button 
            type="submit" 
            className="register-btn" 
            disabled={loading || !agreedToTerms}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
          
          <div className="login-link">
            Já tem uma conta? <Link to="/login">Faça Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
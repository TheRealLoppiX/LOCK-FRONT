import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import { Eye, EyeSlash, EnvelopeSimple } from '@phosphor-icons/react';
import './auth.css';
import './home.css';
import logo from '../assets/Logo lock.png';

type Mode = 'landing' | 'login' | 'register' | 'forgot';

const PATH_TO_MODE: Record<string, Mode> = {
  '/': 'landing',
  '/login': 'login',
  '/register': 'register',
  '/forgot-password': 'forgot',
};

const MODE_TO_PATH: Record<Mode, string> = {
  landing: '/',
  login: '/login',
  register: '/register',
  forgot: '/forgot-password',
};

// Painel visual (logo hexagonal girando + fundo animado) — fica sempre
// visível, só o painel ao lado troca de conteúdo conforme o modo.
const BrandPanel: React.FC = () => {
  const fullText = 'Seu Laboratório Online de Cibersegurança';
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    setTypedText('');
    const intervalId = setInterval(() => {
      setTypedText((current) => {
        if (current.length < fullText.length) return fullText.substring(0, current.length + 1);
        clearInterval(intervalId);
        return current;
      });
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="home-visual">
      <img src={logo} alt="LOCK" className="home-hexagon-logo" />
      <h1>LOCK</h1>
      <p>
        {typedText}
        <span className="typing-cursor" />
      </p>
    </div>
  );
};

const LandingPanel: React.FC<{ onSwitch: (mode: Mode) => void }> = ({ onSwitch }) => (
  <div className="home-form landing-form">
    <h2>Bem-vindo(a)</h2>
    <p>Entre na sua conta ou comece agora sua jornada na cibersegurança.</p>
    <div className="button-container">
      <button className="btn-primary" onClick={() => onSwitch('login')}>Entrar</button>
      <button className="btn-secondary" onClick={() => onSwitch('register')}>Cadastre-se</button>
    </div>
  </div>
);

const LoginPanel: React.FC<{ onSwitch: (mode: Mode) => void }> = ({ onSwitch }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        login(data.user, data.token);
      } else {
        setError(data.message || 'Email ou senha inválidos.');
      }
    } catch {
      setError('Erro de conexão. A API está offline?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="home-form">
      <h1>Login</h1>
      <p>Bem-vindo de volta ao LOCK.</p>
      {error && <div className="error-message">{error}</div>}
      <div className="input-group">
        <input type="text" placeholder="Email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
      </div>
      <div className="input-group password-group">
        <input type={showPassword ? 'text' : 'password'} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
        </span>
      </div>
      <div className="forgot-password-link">
        <button type="button" className="link-btn" onClick={() => onSwitch('forgot')}>Esqueceu a senha?</button>
      </div>
      <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Carregando...' : 'Entrar'}</button>
      <div className="switch-link">
        Não tem conta? <button type="button" className="link-btn" onClick={() => onSwitch('register')}>Cadastre-se</button>
      </div>
    </form>
  );
};

const RegisterPanel: React.FC<{ onSwitch: (mode: Mode) => void }> = ({ onSwitch }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError('Você deve aceitar os Termos de Uso e a Política de Privacidade.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="home-form">
      <h1>Criar Conta</h1>
      <p>Junte-se ao LOCK e comece sua jornada na cibersegurança.</p>
      {error && <div className="error-message">{error}</div>}
      <div className="input-group">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome Completo" required />
      </div>
      <div className="input-group">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" required />
      </div>
      <div className="input-group password-group">
        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha (mín. 8 caracteres)" minLength={8} required />
        <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
        </span>
      </div>
      <div className="terms-container">
        <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
        <label htmlFor="terms">
          Ao criar a conta, aceito os{' '}
          <a href="/Termos_de_Uso_LOCK.pdf" download="Termos_de_Uso_LOCK.pdf">Termos de Uso</a> e a{' '}
          <a href="/Politica_de_Privacidade_LOCK.pdf" download="Politica_de_Privacidade_LOCK.pdf">Política de Privacidade</a>.
        </label>
      </div>
      <button type="submit" className="auth-btn" disabled={loading || !agreedToTerms}>{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
      <div className="switch-link">
        Já tem uma conta? <button type="button" className="link-btn" onClick={() => onSwitch('login')}>Faça Login</button>
      </div>
    </form>
  );
};

const ForgotPanel: React.FC<{ onSwitch: (mode: Mode) => void }> = ({ onSwitch }) => {
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
      if (!response.ok) throw new Error(data.error || data.message || 'Não foi possível enviar o link.');
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="home-form">
        <div className="auth-success-icon"><EnvelopeSimple size={40} weight="bold" /></div>
        <h1>Verifique seu e-mail</h1>
        <p>Se existir uma conta com o e-mail <strong>{email}</strong>, enviamos um link para redefinir sua senha. O link expira em 1 hora.</p>
        <div className="switch-link">
          <button type="button" className="link-btn" onClick={() => onSwitch('login')}>← Voltar para o Login</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="home-form">
      <h1>Redefinir Senha</h1>
      <p>Digite seu e-mail para receber o link de redefinição.</p>
      {error && <div className="error-message">{error}</div>}
      <div className="input-group">
        <input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Enviando...' : 'Enviar Link'}</button>
      <div className="switch-link">
        <button type="button" className="link-btn" onClick={() => onSwitch('login')}>← Voltar para o Login</button>
      </div>
    </form>
  );
};

const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(PATH_TO_MODE[location.pathname] ?? 'landing');
  const skipNextSync = useRef(false);

  // Mantém o modo em sincronia com a URL — cobre navegação direta (link
  // externo, favorito, botão voltar/avançar do navegador).
  useEffect(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }
    setMode(PATH_TO_MODE[location.pathname] ?? 'landing');
  }, [location.pathname]);

  const switchMode = (next: Mode) => {
    skipNextSync.current = true;
    setMode(next);
    navigate(MODE_TO_PATH[next]);
  };

  return (
    <div className="home-shell">
      <HexagonBackground />
      <div className="home-panel">
        <div className="home-panel-card">
          {mode === 'landing' && <LandingPanel onSwitch={switchMode} />}
          {mode === 'login' && <LoginPanel onSwitch={switchMode} />}
          {mode === 'register' && <RegisterPanel onSwitch={switchMode} />}
          {mode === 'forgot' && <ForgotPanel onSwitch={switchMode} />}
          {mode !== 'landing' && (
            <button type="button" className="home-back-btn" onClick={() => switchMode('landing')}>← Voltar</button>
          )}
        </div>
      </div>
      <BrandPanel />
    </div>
  );
};

export default Home;

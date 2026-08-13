import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import { Eye, EyeSlash, EnvelopeSimple, LockSimple, User, Sparkle } from '@phosphor-icons/react';
import NotFound from './NotFound';
import './auth.css';
import './home.css';
import logo from '../assets/Logo lock.png';

type Mode = 'landing' | 'login' | 'register' | 'forgot' | 'verify';

const AUTH_MODE_TO_MODE: Record<string, Mode> = {
  login: 'login',
  register: 'register',
  'forgot-password': 'forgot',
  'verify-email': 'verify',
};

const MODE_TO_AUTH_MODE: Record<Mode, string | undefined> = {
  landing: undefined,
  login: 'login',
  register: 'register',
  forgot: 'forgot-password',
  verify: 'verify-email',
};

// Painel visual (logo hexagonal girando + fundo animado) — fica sempre
// visível, só o painel ao lado troca de conteúdo conforme o modo. A
// animação de digitação só reinicia quando volta pro modo landing — nos
// outros modos ela fica parada no que já tinha digitado.
const BrandPanel: React.FC<{ mode: Mode }> = ({ mode }) => {
  const fullText = 'Seu Laboratório Online de Cibersegurança';
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    if (mode !== 'landing') return;
    setTypedText('');
    const intervalId = setInterval(() => {
      setTypedText((current) => {
        if (current.length < fullText.length) return fullText.substring(0, current.length + 1);
        clearInterval(intervalId);
        return current;
      });
    }, 100);
    return () => clearInterval(intervalId);
  }, [mode]);

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

const LOCKIA_URL = process.env.REACT_APP_LOCKIA_URL || 'https://lockia.onrender.com';

const LandingPanel: React.FC<{ onSwitch: (mode: Mode) => void }> = ({ onSwitch }) => (
  <div className="home-form landing-form">
    <h2>Bem-vindo(a)</h2>
    <p>Entre na sua conta ou comece agora sua jornada na cibersegurança.</p>
    <div className="button-container">
      <button className="btn-primary" onClick={() => onSwitch('login')}>Entrar</button>
      <button className="btn-secondary" onClick={() => onSwitch('register')}>Cadastre-se</button>
    </div>
    <a href={LOCKIA_URL} target="_blank" rel="noopener noreferrer" className="lockia-teaser">
      <Sparkle size={14} weight="fill" /> Experimente também o LOCKIA
    </a>
  </div>
);

const LoginPanel: React.FC<{ onSwitch: (mode: Mode) => void; onNeedsVerification: (email: string) => void }> = ({ onSwitch, onNeedsVerification }) => {
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
      } else if (data.code === 'EMAIL_NOT_VERIFIED') {
        // O identifier pode ser o nome de usuário, não o e-mail — a tela de
        // verificação precisa do e-mail de verdade pra chamar
        // /verify-email e /resend-verification.
        onNeedsVerification(identifier.includes('@') ? identifier : '');
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
      {error && <div className="auth-error-message">{error}</div>}
      <div className="auth-input-group">
        <EnvelopeSimple size={18} className="auth-input-icon" />
        <input type="text" placeholder="Email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
      </div>
      <div className="auth-input-group auth-password-group">
        <LockSimple size={18} className="auth-input-icon" />
        <input type={showPassword ? 'text' : 'password'} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <span className="auth-password-toggle" onClick={() => setShowPassword(!showPassword)}>
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

const RegisterPanel: React.FC<{ onSwitch: (mode: Mode) => void; onRegistered: (email: string) => void }> = ({ onSwitch, onRegistered }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
      await register(name, email);
      onRegistered(email);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="home-form">
      <h1>Criar Conta</h1>
      <p>Junte-se ao LOCK e comece sua jornada na cibersegurança. A sua senha de acesso é gerada automaticamente e enviada para o seu e-mail.</p>
      {error && <div className="auth-error-message">{error}</div>}
      <div className="auth-input-group">
        <User size={18} className="auth-input-icon" />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome Completo" required />
      </div>
      <div className="auth-input-group">
        <EnvelopeSimple size={18} className="auth-input-icon" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" required />
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

const VerifyPanel: React.FC<{ email: string; onSwitch: (mode: Mode) => void }> = ({ email, onSwitch }) => {
  const { verifyEmail, resendVerificationCode } = useAuth();
  const [emailInput, setEmailInput] = useState(email);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Se a tela abrir com um e-mail vindo do cadastro/login (prop `email`),
  // preenche o campo — mas mantém editável, porque também é possível chegar
  // aqui direto pela URL /verify-email sem esse dado (ex: F5 na própria
  // tela perde o estado, já que ele só vive na Home).
  useEffect(() => {
    if (email) setEmailInput(email);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendMessage(null);
    setLoading(true);
    try {
      await verifyEmail(emailInput, code);
    } catch (err: any) {
      setError(err.message || 'Código inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!emailInput) {
      setError('Informe o seu e-mail para reenviar o código.');
      return;
    }
    setError(null);
    setResendMessage(null);
    setResending(true);
    try {
      await resendVerificationCode(emailInput);
      setResendMessage('Se a conta existir e ainda não estiver verificada, um novo código foi enviado.');
    } catch (err: any) {
      setError(err.message || 'Não foi possível reenviar o código.');
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="home-form">
      <h1>Confirme o seu e-mail</h1>
      <p>Enviamos um código de 6 dígitos para o seu e-mail. Ele vale por 30 minutos.</p>
      {error && <div className="auth-error-message">{error}</div>}
      {resendMessage && <div className="auth-success-message">{resendMessage}</div>}
      <div className="auth-input-group">
        <EnvelopeSimple size={18} className="auth-input-icon" />
        <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="Seu e-mail" required />
      </div>
      <div className="auth-input-group">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código de 6 dígitos"
          maxLength={6}
          required
          style={{ letterSpacing: '4px', textTransform: 'uppercase' }}
        />
      </div>
      <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Confirmando...' : 'Confirmar'}</button>
      <div className="switch-link">
        Não recebeu?{' '}
        <button type="button" className="link-btn" onClick={handleResend} disabled={resending}>
          {resending ? 'Enviando...' : 'Reenviar código'}
        </button>
      </div>
      <div className="switch-link">
        <button type="button" className="link-btn" onClick={() => onSwitch('login')}>← Voltar para o Login</button>
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
      {error && <div className="auth-error-message">{error}</div>}
      <div className="auth-input-group">
        <EnvelopeSimple size={18} className="auth-input-icon" />
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
  const { authMode } = useParams<{ authMode?: string }>();
  const navigate = useNavigate();
  // Carrega o e-mail do cadastro/login pra tela de verificação — só vive
  // aqui (não é persistido), então um F5 na tela de verificação perde esse
  // preenchimento automático, mas o campo continua editável nesse caso.
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState('');

  // "/", "/login", "/register" e "/forgot-password" são todos a MESMA rota
  // (path="/:authMode?") — só o parâmetro muda, então React não remonta o
  // componente ao trocar de modo (é o mesmo caso clássico de navegar entre
  // "/users/1" e "/users/2" sem remontar). Isso é o que mantém a animação
  // da tagline e qualquer outro estado do painel visual intactos.
  const mode: Mode | 'notfound' = authMode === undefined ? 'landing' : (AUTH_MODE_TO_MODE[authMode] ?? 'notfound');

  const switchMode = (next: Mode) => {
    const path = MODE_TO_AUTH_MODE[next];
    navigate(path ? `/${path}` : '/');
  };

  if (mode === 'notfound') {
    return <NotFound />;
  }

  return (
    <div className="home-shell">
      <HexagonBackground />
      <div className="home-panel">
        <div className="home-panel-card">
          <div key={mode} className="home-mode-transition">
            {mode === 'landing' && <LandingPanel onSwitch={switchMode} />}
            {mode === 'login' && (
              <LoginPanel
                onSwitch={switchMode}
                onNeedsVerification={(email) => {
                  setPendingVerifyEmail(email);
                  switchMode('verify');
                }}
              />
            )}
            {mode === 'register' && (
              <RegisterPanel
                onSwitch={switchMode}
                onRegistered={(email) => {
                  setPendingVerifyEmail(email);
                  switchMode('verify');
                }}
              />
            )}
            {mode === 'forgot' && <ForgotPanel onSwitch={switchMode} />}
            {mode === 'verify' && <VerifyPanel email={pendingVerifyEmail} onSwitch={switchMode} />}
            {mode !== 'landing' && (
              <button type="button" className="home-back-btn" onClick={() => switchMode('landing')}>← Voltar</button>
            )}
          </div>
        </div>
      </div>
      <BrandPanel mode={mode} />
    </div>
  );
};

export default Home;

import React, { createContext, useState, useContext, useEffect, useRef, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // NOVO: Importa o decodificador

// O LOCK-API devolve 401 tanto por sessão expirada/inválida (JWT) quanto por
// respostas de negócio normais (senha errada, resposta errada de
// laboratório) — nem sempre em rotas diferentes (ex: DELETE /profile usa
// 401 pros dois casos). Por isso o interceptor abaixo não decide pelo status
// sozinho: só dispara logout automático quando a mensagem bate exatamente
// com este texto, que o backend usa somente para falha real de jwtVerify().
const SESSION_EXPIRED_MESSAGE = 'Sessão expirada ou inválida. Faça login novamente.';

// Define a aparência dos dados do usuário
interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

// Define o que o nosso contexto vai fornecer
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  // O cadastro não pede mais senha — o servidor gera uma e manda por
  // e-mail, junto com o código de verificação. Por isso não loga
  // automaticamente mais (ver verifyEmail).
  register: (name: string, email: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// NOVO: Define a aparência do token que sua API envia
interface DecodedToken {
  sub: string;
  name: string;
  email: string;
  avatar_url: string;
  exp: number;
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return !decoded.exp || decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // NOVO: Define o endereço da sua API
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3333';

  // Efeito que "lembra" do usuário ao recarregar a página
  useEffect(() => {
    // Handoff de sessão vindo do LOCKIA (botão "Ir para o LOCK" na sidebar) —
    // o token chega no fragmento da URL (ex: #token=eyJ...), nunca numa query
    // string, porque fragmentos não são enviados ao servidor nem aparecem em
    // logs/Referer. Mesmo padrão já usado no sentido LOCK → LOCKIA.
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const handoffToken = hashParams.get('token');
    if (handoffToken) {
      // Limpa a URL sempre que houver um token no fragmento, mesmo se ele já
      // estiver expirado — senão o JWT (com nome/e-mail decodificáveis) fica
      // exposto na barra de endereço/histórico do navegador indefinidamente.
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      if (!isTokenExpired(handoffToken)) {
        const decoded: DecodedToken = jwtDecode(handoffToken);
        const userData: User = {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          avatar_url: decoded.avatar_url,
        };
        login(userData, handoffToken);
        setLoading(false);
        return;
      }
    }

    const storedUser = localStorage.getItem('lock-user');
    const storedToken = localStorage.getItem('lock-token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        // localStorage corrompido/editado manualmente — trata como deslogado
        localStorage.removeItem('lock-user');
        localStorage.removeItem('lock-token');
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (userData: User, receivedToken: string) => {
    localStorage.setItem('lock-user', JSON.stringify(userData));
    localStorage.setItem('lock-token', receivedToken);
    setUser(userData);
    setToken(receivedToken);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('lock-user');
    localStorage.removeItem('lock-token');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  // Ref pra sempre chamar a versão mais recente de `logout` de dentro do
  // fetch global interceptado (evita fechar sobre uma versão antiga presa
  // no closure do useEffect abaixo, que só roda uma vez).
  const logoutRef = useRef(logout);
  useEffect(() => {
    logoutRef.current = logout;
  });

  // Interceptor global: qualquer chamada ao LOCK-API que devolva a mensagem
  // exata de sessão expirada/inválida desloga automaticamente e manda pro
  // login, em vez de deixar cada página tratar isso por conta própria (ou,
  // como era antes, simplesmente mostrar "erro interno" pro usuário sem
  // explicar que a sessão caiu).
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
      if (response.status === 401 && url.startsWith(apiBaseUrl) && localStorage.getItem('lock-token')) {
        const clone = response.clone();
        clone.json().then((data) => {
          if (data?.message === SESSION_EXPIRED_MESSAGE) {
            logoutRef.current();
          }
        }).catch(() => {
          // corpo não era JSON — não é o caso que estamos tratando, ignora
        });
      }
      return response;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, [apiBaseUrl]);

  // O cadastro cria a conta (senha gerada pelo servidor, mandada por
  // e-mail) mas não loga automaticamente — a conta só fica utilizável
  // depois de confirmada via verifyEmail. Não decodifica token nenhum
  // porque a resposta de /register não traz mais um.
  const register = async (name: string, email: string) => {
    const response = await fetch(`${apiBaseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Falha no registro');
    }
  };

  // Confirma o código de 6 dígitos enviado por e-mail — só a partir daqui
  // a conta vira utilizável. A resposta tem o mesmo formato do /login
  // (user + token), então reaproveita o 'login' existente pra aplicar a
  // sessão.
  const verifyEmail = async (email: string, code: string) => {
    const response = await fetch(`${apiBaseUrl}/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await response.json();
    if (!response.ok || !data.token) {
      throw new Error(data.message || 'Código inválido ou expirado.');
    }
    login(data.user, data.token);
  };

  const resendVerificationCode = async (email: string) => {
    const response = await fetch(`${apiBaseUrl}/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Não foi possível reenviar o código.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        logout,
        register,
        verifyEmail,
        resendVerificationCode,
      }}
    >
      {!loading && children} {/* MODIFICADO: Garante que o app só renderize depois de carregar o user */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
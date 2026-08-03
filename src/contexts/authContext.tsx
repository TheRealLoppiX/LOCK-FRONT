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
  register: (name: string, email: string, password: string) => Promise<void>; // NOVO: Adiciona a função ao "contrato"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// NOVO: Define a aparência do token que sua API envia
interface DecodedToken {
  sub: string;
  name: string;
  email: string;
  avatar_url: string;
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

  // ======================================================
  // NOVO: A FUNÇÃO DE REGISTRO QUE ESTAVA FALTANDO
  // ======================================================
  const register = async (name: string, email: string, password: string) => {
    const response = await fetch(`${apiBaseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      // Se a API retornar um erro (ex: "Email já cadastrado"),
      // pega a mensagem e a joga para a página de registro
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha no registro');
    }

    const { token } = await response.json();

    // Decodifica o token para obter os dados do usuário
    const decodedToken: DecodedToken = jwtDecode(token);
    
    const userData: User = {
      id: decodedToken.sub,
      name: decodedToken.name,
      email: decodedToken.email,
      avatar_url: decodedToken.avatar_url
    };
    
    // Chama a função 'login' existente para salvar o estado e o token
    login(userData, token);
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
        register // NOVO: Fornece a função para o resto do app
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
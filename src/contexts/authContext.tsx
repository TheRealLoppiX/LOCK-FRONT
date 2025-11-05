import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // NOVO: Importa o decodificador

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
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
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
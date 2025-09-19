import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Define a aparência dos dados do utilizador
interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

// Define o que o nosso contexto vai fornecer para a aplicação
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean; // Novo estado para controlar o carregamento inicial
  login: (userData: User, token: string) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Começa como 'true'
  const navigate = useNavigate();

  // ======================================================
  // A LÓGICA DE "MEMÓRIA" QUE FALTAVA
  // ======================================================
  useEffect(() => {
    const storedUser = localStorage.getItem('lock-user');
    const storedToken = localStorage.getItem('lock-token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false); // Termina o carregamento
  }, []);
  // ======================================================

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

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        setUser, 
        isAuthenticated: !!user && !!token,
        loading,
        login, 
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
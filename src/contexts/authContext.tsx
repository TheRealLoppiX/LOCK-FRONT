import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

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
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// Cria o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cria o Provedor do contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Efeito que roda quando a aplicação carrega
  useEffect(() => {
    // Tenta carregar os dados do usuário do localStorage
    const storedUser = localStorage.getItem('lock-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Função de login
  const login = (userData: User) => {
    // Salva os dados do usuário no localStorage
    localStorage.setItem('lock-user', JSON.stringify(userData));
    // Atualiza o estado do usuário
    setUser(userData);
    // Redireciona para a dashboard
    navigate('/dashboard');
  };

  // Função de logout
  const logout = () => {
    // Remove os dados do usuário do localStorage
    localStorage.removeItem('lock-user');
    // Limpa o estado do usuário
    setUser(null);
    // Redireciona para a página de login
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
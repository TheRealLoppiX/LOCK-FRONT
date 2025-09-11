import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Define a aparência dos dados do usuário
interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

// ALTERADO: Define o que o nosso contexto vai fornecer
interface AuthContextType {
  user: User | null;
  token: string | null; // NOVO: para guardar o token JWT
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void; // ALTERADO: login agora recebe o token
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // NOVO: para atualizar o user
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // NOVO: estado para o token
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('lock-user');
    const storedToken = localStorage.getItem('lock-token'); // NOVO: carrega o token
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // ALTERADO: Função de login agora também salva o token
  const login = (userData: User, receivedToken: string) => {
    localStorage.setItem('lock-user', JSON.stringify(userData));
    localStorage.setItem('lock-token', receivedToken); // NOVO: salva o token
    setUser(userData);
    setToken(receivedToken); // NOVO: atualiza o estado do token
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('lock-user');
    localStorage.removeItem('lock-token'); // NOVO: remove o token
    setUser(null);
    setToken(null); // NOVO: limpa o estado do token
    navigate('/login');
  };

  return (
    // ALTERADO: Fornece o token e o setUser para os componentes filhos
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        setUser, 
        isAuthenticated: !!user && !!token, // Mais seguro verificar ambos
        login, 
        logout 
      }}
    >
      {children}
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
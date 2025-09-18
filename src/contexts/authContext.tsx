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
  login: (userData: User, token: string) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Para atualizar o perfil
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [completedLabs, setCompletedLabs] = useState<string[]>([]); // State para o progresso
  const navigate = useNavigate();

  // Função para buscar os laboratórios concluídos na API
  const fetchCompletedLabs = useCallback(async (authToken: string) => {
    if (!authToken) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/labs/completions`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (!response.ok) throw new Error('Falha ao buscar progresso');
      const data = await response.json();
      setCompletedLabs(data);
    } catch (error) {
      console.error("Erro ao buscar laboratórios concluídos:", error);
      setCompletedLabs([]); // Limpa em caso de erro
    }
  }, []);

  // Efeito para carregar dados do localStorage na inicialização
  useEffect(() => {
    const storedUser = localStorage.getItem('lock-user');
    const storedToken = localStorage.getItem('lock-token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      fetchCompletedLabs(storedToken); // Busca o progresso se já estiver logado
    }
  }, [fetchCompletedLabs]);

  // Função de login que guarda dados e busca o progresso
  const login = (userData: User, receivedToken: string) => {
    localStorage.setItem('lock-user', JSON.stringify(userData));
    localStorage.setItem('lock-token', receivedToken);
    setUser(userData);
    setToken(receivedToken);
    fetchCompletedLabs(receivedToken); // Busca o progresso após o login
    navigate('/dashboard');
  };

  // Função de logout que limpa tudo
  const logout = () => {
    localStorage.removeItem('lock-user');
    localStorage.removeItem('lock-token');
    setUser(null);
    setToken(null);
    setCompletedLabs([]); // Limpa o progresso
    navigate('/login');
  };

  // Função para marcar um laboratório como concluído
  const markLabAsCompleted = async (labId: string) => {
    if (completedLabs.includes(labId) || !token) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/labs/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ labId })
      });
      if (!response.ok) throw new Error('Falha ao guardar progresso');
      
      setCompletedLabs(prev => [...prev, labId]); // Atualiza o estado local
    } catch (error) {
      console.error(`Erro ao marcar o lab ${labId} como concluído:`, error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        setUser, 
        isAuthenticated: !!user && !!token,
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
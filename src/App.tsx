import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/authContext';

// Importação das Páginas
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/forgotpassword';
import ResetPassword from './pages/resetpassword';
import Dashboard from './pages/dashboard';
import Settings from './pages/settings';
import Profile from './pages/profile';
import QuizSelectionPage from './pages/QuizSelectionPage'; 
import QuizPlayer from './pages/QuizPlayer';       

// ===================================================================
// COMPONENTE PARA PROTEGER ROTAS
// ===================================================================
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostra uma tela de carregamento enquanto verifica a autenticação
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0d1117', color: 'white' }}>Carregando...</div>;
  }

  // Se não estiver carregando, decide se mostra a página ou redireciona
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// ===================================================================
// COMPONENTE QUE CONTÉM AS ROTAS
// ===================================================================
function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Rotas Protegidas */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      
      {/* Rotas do Quiz */}
      <Route path="/quizzes/:topic" element={<PrivateRoute><QuizSelectionPage /></PrivateRoute>} />
      <Route path="/quiz/player/:topic/:difficulty" element={<PrivateRoute><QuizPlayer /></PrivateRoute>} />

    </Routes>
  );
}

// ===================================================================
// O COMPONENTE PRINCIPAL QUE ORGANIZA TUDO
// ===================================================================
function App() {
  return (
    <Router>      {/* 1. A "estrada" vem primeiro */}
      <AuthProvider>  {/* 2. O "carro" com o GPS vem depois, já na estrada */}
        <AppRoutes /> {/* 3. As rotas são renderizadas aqui dentro */}
      </AuthProvider>
    </Router>
  );
}

export default App;


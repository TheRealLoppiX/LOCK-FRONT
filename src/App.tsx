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
import QuizBurpPage from './pages/QuizBurpPage';
import QuizPlayer from './pages/QuizPlayer';

// ===================================================================
// PrivateRoute ATUALIZADA para lidar com o carregamento inicial
// ===================================================================
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Mostra uma tela de carregamento enquanto verifica a autenticação
    return <div>Verificando autenticação...</div>;
  }

  // Se não estiver carregando, decide se mostra a página ou redireciona
  return isAuthenticated ? children : <Navigate to="/login" />;
};
// ===================================================================

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Rotas Protegidas */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          
          {/* Rotas do Quiz */}
          <Route path="/quizzes/burp-suite" element={<PrivateRoute><QuizBurpPage /></PrivateRoute>} />
          <Route path="/quiz-player/:topic/:difficulty" element={<PrivateRoute><QuizPlayer /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
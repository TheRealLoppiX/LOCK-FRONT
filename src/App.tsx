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
import Biblioteca from './pages/Biblioteca';  
import LabSelectionPage from './pages/labs/LabSelectionPage';
import SqlInjectionLab from './pages/labs/SqlInjectionLab';
import BruteForceLab from './pages/labs/BruteForceLab';
import XSSLab from './pages/labs/XSSLab';  

// Rodapé 
import Footer from './components/Footer';


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
      <Route path="/biblioteca" element={<PrivateRoute><Biblioteca /></PrivateRoute>} />
      
      {/* Rotas do Quiz */}
      <Route path="/quizzes/:topic" element={<PrivateRoute><QuizSelectionPage /></PrivateRoute>} />
      <Route path="/quiz/player/:topic/:difficulty" element={<PrivateRoute><QuizPlayer /></PrivateRoute>} />

      {/* Rotas dos Laboratórios */}
      <Route path="/labs/:topic" element={<PrivateRoute><LabSelectionPage /></PrivateRoute>} />
      <Route path="/labs/sql-injection/1" element={<PrivateRoute><SqlInjectionLab /></PrivateRoute>} />
      <Route path="/labs/brute-force/1" element={<PrivateRoute><BruteForceLab /></PrivateRoute>} />
      <Route path="/labs/xss/1" element={<PrivateRoute><XSSLab /></PrivateRoute>} />

    </Routes>
  );
}

// ===================================================================
// O COMPONENTE PRINCIPAL QUE ORGANIZA TUDO
// ===================================================================
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
export default App;


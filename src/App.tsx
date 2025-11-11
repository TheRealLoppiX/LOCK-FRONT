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
import SqlInjectionLab1 from './pages/labs/SqlInjectionLab1';
import SqlInjectionLab2 from './pages/labs/SqlInjectionLab2';
import SqlInjectionLab3 from './pages/labs/SqlInjectionLab3';
import BruteForceLab1 from './pages/labs/BruteForceLab1';
import BruteForceLab2 from './pages/labs/BruteForceLab2';
import BruteForceLab3 from './pages/labs/BruteForceLab3';
import XSSLab1 from './pages/labs/XSSLab1';  
import XSSLab2 from './pages/labs/XSSLab2'; 
import XSSLab3 from './pages/labs/XSSLab3';
import FormViewer from './pages/FormViewer';

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
const quizformsburpI = "https://forms.gle/SYUA6qkz8tFiv3tC8"
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
      <Route 
            path="/BurpI" 
            element={<FormViewer src={quizformsburpI} title="Exercício de Fixação I - Burp Suite" />} 
          />

      {/* Rotas dos Laboratórios */}
      <Route path="/labs/:topic" element={<PrivateRoute><LabSelectionPage /></PrivateRoute>} />
      <Route path="/labs/sql-injection/1" element={<PrivateRoute><SqlInjectionLab1 /></PrivateRoute>} />
      <Route path="/labs/sql-injection/2" element={<PrivateRoute><SqlInjectionLab2 /></PrivateRoute>} />
      <Route path="/labs/sql-injection/3" element={<PrivateRoute><SqlInjectionLab3 /></PrivateRoute>} />
      <Route path="/labs/brute-force/1" element={<PrivateRoute><BruteForceLab1 /></PrivateRoute>} />
      <Route path="/labs/brute-force/2" element={<PrivateRoute><BruteForceLab2 /></PrivateRoute>} />
      <Route path="/labs/brute-force/3" element={<PrivateRoute><BruteForceLab3 /></PrivateRoute>} />
      <Route path="/labs/xss/1" element={<PrivateRoute><XSSLab1 /></PrivateRoute>} />
      <Route path="/labs/xss/2" element={<PrivateRoute><XSSLab2 /></PrivateRoute>} />
      <Route path="/labs/xss/3" element={<PrivateRoute><XSSLab3 /></PrivateRoute>} />

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


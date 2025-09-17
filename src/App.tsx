import React from 'react';
import { useAuth } from './contexts/authContext';
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from './pages/dashboard';
import { AuthProvider } from './contexts/authContext';
import ForgotPassword from './pages/forgotpassword';
import ResetPassword from './pages/resetpassword';
import Profile from './pages/profile';
import Settings from './pages/settings';
import Quizzes from './pages/Quizzes';
import './App.css';

// NOVO: Importe o componente Footer que você criou
import Footer from './components/Footer'; 

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // Se o usuário não estiver autenticado, redireciona para a página de login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      {/* Envolva tudo com o AuthProvider */}
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/quizzes" element={<PrivateRoute><Quizzes /></PrivateRoute>} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
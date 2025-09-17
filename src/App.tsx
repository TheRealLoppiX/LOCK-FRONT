import React from 'react';
// BrowserRouter é necessário para o sistema de rotas funcionar
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
import SqlInjectionList from './pages/labs/SqlInjectionList';
import LabPage from './pages/labs/LabPage';
import BruteForceList from './pages/labs/BruteForceList';
import XSSList from './pages/labs/XSSList';
import './App.css';

// NOVO: Importe o componente Footer que você criou
import Footer from './components/Footer'; 

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/labs/sql-injection" element={<SqlInjectionList />} />
            <Route path="/labs/sql-injection/:labId" element={<LabPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/labs/xss" element={<XSSList />} />
            <Route path="/labs/brute-force" element={<BruteForceList />} />
            <Route path="/labs/xss/:labId" element={<LabPage />} />
            <Route path="/labs/brute-force/:labId" element={<LabPage />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
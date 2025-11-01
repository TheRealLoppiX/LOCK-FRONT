import React, { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { Link } from "react-router-dom";
import HexagonBackground from "../components/hexagonobg";
import './auth.css'; // Importa o CSS unificado

const Login: React.FC = () => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        login(data.user, data.token);
      } else {
        alert(data.error || "Falha no login");
      }
    } catch {
      alert("Erro ao conectar à API");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // CORRIGIDO: Usando as classes do auth.css
    <div className="auth-page">
      <HexagonBackground />
      <div className="auth-card">
        <h1>Login</h1>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <input 
              type="text"
              placeholder="Email ou Nome de Utilizador"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Palavra-passe" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="auth-input"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? "A carregar..." : "Entrar"}
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/forgot-password">Esqueci a senha</Link>
          <Link to="/register">Não tem conta? Registe-se</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;


import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { Link } from "react-router-dom";
import HexagonBackground from "../components/hexagonobg";
import "./auth.css";

export default function Login() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState(""); // ALTERADO: de 'email' para 'identifier'
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ALTERADO: Enviando 'identifier' em vez de 'email'
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
      } else {
        alert(data.error || "Falha no login");
      }
    } catch {
      alert("Erro ao conectar API");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page">
      <HexagonBackground />
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Login</h1>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input 
                type="text" // ALTERADO: de 'email' para 'text' para aceitar nomes de usuário
                placeholder="Email ou Nome de Usuário" // ALTERADO
                value={identifier} // ALTERADO
                onChange={(e) => setIdentifier(e.target.value)} // ALTERADO
                className="login-input"
                required
              />
            </div>
            
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Senha" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="login-input"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Entrar"}
            </button>
          </form>
          
          <div className="login-links">
          <p>
            <Link to="/forgot-password" className="login-link">Esqueci a senha</Link>
          </p>
          <p>
            Não tem conta? <Link to="/register" className="login-link">Cadastre-se</Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
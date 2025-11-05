import React, { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { Link } from "react-router-dom";
import HexagonBackground from "../components/hexagonobg";
import './login.css'; // CORRETO: Importa o login.css
import { Eye, EyeSlash } from '@phosphor-icons/react'; // NOVO: Ícones de senha

const Login: React.FC = () => {
  const { login } = useAuth(); // 'login' do context só salva o estado
  const [identifier, setIdentifier] = useState(""); // Mantido (bom para email ou nome)
  const [password, setPassword] = useState("");
  
  // NOVO: Estados padronizados
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // A lógica de fetch continua aqui, como no seu original
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Sucesso: chama o 'login' do context para salvar e navegar
        login(data.user, data.token);
      } else {
        // Erro: usa o setError em vez de alert
        setError(data.message || "Email ou senha inválidos.");
      }
    } catch (err) {
      setError("Erro de conexão. A API está offline?");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ATUALIZADO: Classes do auth.css
    <div className="auth-page-container">
      <HexagonBackground />
      <div className="auth-container">
        <form onSubmit={handleLogin} className="auth-form">
          <h1>Login</h1>
          <p>Bem-vindo de volta ao LOCK.</p>
          
          {/* NOVO: Mensagem de erro padronizada */}
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <input 
              type="text"
              placeholder="Email" // PT-BR
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          
          {/* NOVO: Grupo de senha padronizado */}
          <div className="input-group password-group">
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Senha" // PT-BR
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            <span 
              className="password-toggle-icon" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </span>
          </div>
          
          {/* Container específico do login.css */}
          <div className="forgot-password-link">
            <Link to="/forgot-password">Esqueceu a senha?</Link>
          </div>
          
          {/* ATUALIZADO: className */}
          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>
        
        {/* ATUALIZADO: className */}
        <div className="switch-link">
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
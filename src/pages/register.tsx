import { useState } from "react";
import { Link } from "react-router-dom";
import HexagonBackground from "../components/hexagonobg";
import "./auth.css"; // Este arquivo deve importar o auth.css

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sua lógica de cadastro está perfeita e foi mantida
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name || !email || !password) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Cadastro realizado! Bem-vindo, ${data.user.name}`);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        alert(data.error || "Falha no cadastro");
      }
    } catch (err) {
      alert("Erro: não foi possível conectar à API");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // ALTERADO: Usando as classes da página de auth para reutilizar o estilo
    <div className="auth-page">
      <HexagonBackground />
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Criar Conta</h1>
          <p className="register-subtitle">Preencha os dados para se cadastrar</p>
          
          <form onSubmit={handleRegister} className="auth-form">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Nome completo" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="auth-input" // ALTERADO
                required
              />
            </div>
            
            <div className="input-group">
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="auth-input" // ALTERADO
                required
              />
            </div>
            
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Senha (mínimo 6 caracteres)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="auth-input" // ALTERADO
                required
                minLength={6}
              />
            </div>
            
            <button 
              type="submit" 
              className="auth-button" // ALTERADO
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Criar Conta"}
            </button>
          </form>
          
          <div className="auth-links"> {/* ALTERADO */}
            <p>
              Já tem uma conta? <Link to="/auth" className="auth-link">Faça Login</Link> {/* ALTERADO */}
            </p>
            <p>
              <Link to="/" className="auth-link">← Voltar para Home</Link> {/* ALTERADO */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
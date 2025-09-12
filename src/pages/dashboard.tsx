import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext'; // Verifique se o caminho do seu AuthContext está correto
import HexagonBackground from '../components/hexagonobg'; // Verifique se o caminho está correto
import { FaCog } from 'react-icons/fa'; // Ícone de engrenagem
import './dashboard.css';
import defaultAvatar from '../assets/default-avatar.png'; // Verifique se o caminho está correto

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  // Estado para controlar o card expansível
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleLogout = () => { logout(); };

  // Função para abrir/fechar o card de laboratórios
  const toggleLabsCard = () => {
    setExpandedCard(prev => (prev === 'labs' ? null : 'labs'));
  };

  // Lógica para construir a URL do avatar com base no nome do usuário
  const avatarUrl = user?.avatar_url?.includes('dicebear.com')
    ? `${user.avatar_url}?seed=${user.name}`
    : user?.avatar_url;

  return (
    <div className="dashboard-container">
      <HexagonBackground />

      {/* =================================================================== */}
      {/* ESTA É A SEÇÃO DO CABEÇALHO QUE ESTAVA FALTANDO */}
      {/* =================================================================== */}
      <header className="dashboard-header">
        <div className="header-left">
          {user && (
            <Link to="/profile" className="profile-avatar-link">
              <img
                src={avatarUrl || defaultAvatar}
                alt={`Foto de perfil de ${user.name}`}
                className="profile-avatar"
              />
            </Link>
          )}
          <div className="welcome-message">
            <h1>LOCK</h1>
            <p>Bem-vindo(a), {user ? user.name : 'Visitante'}!</p>
          </div>
        </div>
        
        <div className="header-right">
          <Link to="/settings" className="settings-icon-link">
            <FaCog className="settings-icon" />
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </header>
      {/* =================================================================== */}
      {/* FIM DA SEÇÃO DO CABEÇALHO */}
      {/* =================================================================== */}


      <main className="dashboard-grid">
        {/* Card de Laboratórios Interativo */}
        <div 
          className={`dashboard-card lab ${expandedCard === 'labs' ? 'expanded' : ''}`}
          onClick={toggleLabsCard}
        >
          <div className="card-content">
            <h2>Laboratórios</h2>
            <p>Ambientes práticos para testes de cibersegurança.</p>
            <span className="card-action">
              {expandedCard === 'labs' ? 'Fechar ▲' : 'Expandir ▼'}
            </span>
          </div>

          <div className="card-expanded-content">
              Burp Suite
              <div className="card-expanded-content">
                <Link to="/labs/sql-injection" className="lab-option">
                SQL Injection
                </Link>
              </div>
            <Link to="/labs/tcpdump" className="lab-option">
              TCPDump
            </Link>
          </div>
        </div>

        {/* Card de Cursos como Link normal */}
        <Link to="#" className="dashboard-card courses">
          <div className="card-content">
            <h2>Cursos</h2>
            <p>Aprimore suas habilidades com nossos módulos de ensino.</p>
            <span className="card-action">Explorar →</span>
          </div>
        </Link>
      </main>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import './dashboard.css';
// NOVO: Importe uma imagem de avatar padrão como fallback
import defaultAvatar from '../assets/default-avatar.png';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  
  // NOVO: Lógica para construir a URL do avatar com base nas iniciais do nome
  // Isso faz o avatar placeholder (do DiceBear) funcionar corretamente
  const avatarUrl = user?.avatar_url?.includes('dicebear.com') 
    ? `${user.avatar_url}?seed=${user.name}` 
    : user?.avatar_url;

  return (
    <div className="dashboard-container">
      <HexagonBackground />

      <header className="dashboard-header">
        {/* NOVO: Wrapper para agrupar a foto e a mensagem de boas-vindas */}
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
            <p>Bem-vindo(a) de volta, {user ? user.name : 'Visitante'}!</p>
          </div>
        </div>
        
        <button onClick={handleLogout} className="logout-btn">
          Sair
        </button>
      </header>

      <main className="dashboard-grid">
        <Link to="#" className="dashboard-card lab">
          <div className="card-content">
            <h2>Laboratórios</h2>
            <p>Ambientes práticos para testes de cibersegurança.</p>
            <span className="card-action">Acessar →</span>
          </div>
        </Link>

        <Link to="#" className="dashboard-card courses">
          <div className="card-content">
            <h2>Cursos</h2>
            <p>Aprimore suas habilidades com nossos módulos de ensino.</p>
            <span className="card-action">Explorar →</span>
          </div>
        </Link>

        {/* ALTERADO: O link deste card agora aponta para a página de perfil */}
        <Link to="/profile" className="dashboard-card profile">
          <div className="card-content">
            <h2>Meu Perfil</h2>
            <p>Acompanhe seu progresso e gerencie sua conta.</p>
            <span className="card-action">Visualizar →</span>
          </div>
        </Link>

        <Link to="#" className="dashboard-card settings">
          <div className="card-content">
            <h2>Configurações</h2>
            <p>Ajuste as preferências da sua plataforma.</p>
            <span className="card-action">Ajustar →</span>
          </div>
        </Link>
      </main>
    </div>
  );
};

export default Dashboard;
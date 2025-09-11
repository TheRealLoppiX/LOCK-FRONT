import React, { useState } from 'react'; // NOVO: Importa o useState
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import { FaCog } from 'react-icons/fa';
import './dashboard.css';
import defaultAvatar from '../assets/default-avatar.png';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  // NOVO: Estado para controlar qual card está expandido. 'null' significa nenhum.
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleLogout = () => { logout(); };

  // NOVO: Função para abrir/fechar o card de laboratórios
  const toggleLabsCard = () => {
    setExpandedCard(prev => (prev === 'labs' ? null : 'labs'));
  };

  const avatarUrl = user?.avatar_url?.includes('dicebear.com')
    ? `${user.avatar_url}?seed=${user.name}`
    : user?.avatar_url;

  return (
    <div className="dashboard-container">
      <HexagonBackground />

      <header className="dashboard-header">
        {/* ... seu header continua igual ... */}
      </header>

      <main className="dashboard-grid">
        {/* ALTERADO: O card de Laboratórios agora é uma div interativa */}
        <div 
          className={`dashboard-card lab ${expandedCard === 'labs' ? 'expanded' : ''}`}
          onClick={toggleLabsCard}
        >
          <div className="card-content">
            <h2>Laboratórios</h2>
            <p>Ambientes práticos para testes de cibersegurança.</p>
            <span className="card-action">
              {expandedCard === 'labs' ? 'Fechar' : 'Expandir'}
            </span>
          </div>

          {/* NOVO: Conteúdo que aparece quando o card está expandido */}
          <div className="card-expanded-content">
            <Link to="/labs/burp-suite" className="lab-option">
              <span className="lab-icon">
                {/* Você pode adicionar ícones aqui no futuro */}
              </span>
              Burp Suite
            </Link>
            <Link to="/labs/tcpdump" className="lab-option">
              <span className="lab-icon"></span>
              TCPDump
            </Link>
          </div>
        </div>

        {/* O card de Cursos permanece como um Link normal */}
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
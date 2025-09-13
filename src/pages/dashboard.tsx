import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { Gear, SignOut } from '@phosphor-icons/react';
import HexagonBackground from '../components/hexagonobg';
import './dashboard.css';

// Estrutura de dados para as ferramentas e seus laboratórios
const tools = [
  {
    name: 'Burp Suite',
    id: 'burp-suite',
    topics: [
      { name: 'SQL Injection', path: '/labs/sql-injection' },
      { name: 'Brute Force', path: '/labs/brute-force' },
      { name: 'XSS (Cross-Site Scripting)', path: '/labs/xss' },
      // Adicione outros tópicos aqui no futuro
    ]
  },
  {
    name: 'TCPDump',
    id: 'tcpdump',
    topics: [] // Sem laboratórios ainda
  }
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTool = (toolId: string) => {
    setExpandedTool(prev => (prev === toolId ? null : toolId));
  };

  return (
    <div className="dashboard-container">
      <HexagonBackground />
      <header className="dashboard-header">
        <div className="header-left">
          <Link to="/profile" className="profile-avatar-link">
            <img 
              src={user?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`} 
              alt="Avatar do Utilizador" 
              className="profile-avatar"
            />
          </Link>
          <div className="welcome-message">
            <h1>Bem-vindo, {user?.name}!</h1>
            <p>Selecione um laboratório para começar.</p>
          </div>
        </div>
        <div className="header-right">
          <Link to="/settings" className="settings-icon-link" title="Configurações">
            <Gear className="settings-icon" />
          </Link>
          <button onClick={handleLogout} className="logout-btn" title="Sair">
            <SignOut />
          </button>
        </div>
      </header>

      <main className="dashboard-grid">
        {/* Card de Ferramentas (Novo) */}
        <div className="dashboard-card tools-card">
          <div className="card-content">
            <h2>Ferramentas de Cibersegurança</h2>
            <p>Selecione uma ferramenta para ver os laboratórios disponíveis.</p>
          </div>
          <div className="tools-list">
            {tools.map(tool => (
              <div key={tool.id} className="tool-item">
                <div 
                  className={`tool-header ${tool.topics.length > 0 ? 'expandable' : ''}`}
                  onClick={() => tool.topics.length > 0 && toggleTool(tool.id)}
                >
                  <span>{tool.name}</span>
                  {tool.topics.length > 0 && (
                    <span className="expand-icon">{expandedTool === tool.id ? '▲' : '▼'}</span>
                  )}
                </div>
                <div className={`topics-list ${expandedTool === tool.id ? 'expanded' : ''}`}>
                  {tool.topics.map(topic => (
                    <Link key={topic.path} to={topic.path} className="topic-link">
                      {topic.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outros cards que você queira adicionar no futuro */}
        <div className="dashboard-card placeholder-card">
          <h2>Em Breve</h2>
          <p>Novos laboratórios e ferramentas serão adicionados aqui.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import HexagonBackground from '../../components/hexagonobg';
import './BurpSuiteLabs.css'; // Vamos reutilizar e expandir este CSS

const labs = [
  { 
    id: 'sqli-1', 
    title: 'SQL Injection - Recuperar Dados Ocultos',
    description: 'Use uma vulnerabilidade de SQL Injection para contornar um filtro e exibir todos os produtos da base de dados.',
    path: '/labs/sql-injection/1'
  },
  { 
    id: 'sqli-2', 
    title: 'SQL Injection - Contornar Autenticação',
    description: 'Explore uma falha de SQL Injection num formulário de login para aceder como o utilizador administrador.',
    path: '/labs/sql-injection/2'
  },
  { 
    id: 'sqli-3', 
    title: 'SQL Injection - Ataque UNION',
    description: 'Utilize um ataque UNION para extrair dados de uma "tabela" diferente e exibi-los na página.',
    path: '/labs/sql-injection/3'
  },
];

const SqlInjectionList: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="labs-page-container">
      <HexagonBackground />
      <div className="labs-content">
        <header className="labs-header">
          <h1>Laboratórios: SQL Injection</h1>
          <p>Selecione um dos desafios abaixo para começar.</p>
          <Link to="/dashboard" className="back-link">← Voltar para a Dashboard</Link>
        </header>

        <main className="labs-grid">
          {labs.map((lab) => (
            <Link key={lab.id} to={lab.path} className="lab-card">
              <div className="lab-card-content">
                <h2>{lab.title}</h2>
                <p>{lab.description}</p>
                <span className="lab-action">Iniciar Laboratório →</span>
              </div>
            </Link>
          ))}
        </main>
      </div>
    </div>
  );
};

export default SqlInjectionList;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../components/hexagonobg';
import { CaretLeft, Certificate, Play, Star, Trophy } from '@phosphor-icons/react';
import './simulados.css';

interface ExamModule {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  difficulty_level: number;
}

const Simulados: React.FC = () => {
  const [modules, setModules] = useState<ExamModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca a lista de simulados do backend
    fetch(`${process.env.REACT_APP_API_URL}/modules`)
      .then(res => res.json())
      .then(data => {
        setModules(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar simulados:", err);
        setLoading(false);
      });
  }, []);

  // Função auxiliar para renderizar estrelas de dificuldade
  const renderDifficulty = (level: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        weight={i < level ? "fill" : "regular"} 
        color={i < level ? "#FFD700" : "#444"} 
        size={14}
      />
    ));
  };

  return (
    <div className="simulados-container">
      <HexagonBackground />
      
      <div className="simulados-content">
        <header className="simulados-header">
          <Link to="/dashboard" className="back-link-simulado">
            <CaretLeft size={20} /> Voltar
          </Link>
          <div className="header-title">
            <Certificate size={48} color="#00d9ffff" weight="duotone" />
            <div>
              <h1>Centro de Certificações</h1>
              <p>Prepare-se para o mercado com simulados reais.</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="loading-spinner">Carregando simulados...</div>
        ) : (
          <div className="modules-grid">
            {modules.length > 0 ? (
              modules.map((mod) => (
                <div key={mod.id} className="exam-card">
                  <div className="exam-cover">
                    <img src={mod.cover_url || 'https://placehold.co/600x400/1a1a1a/FFD700?text=LOCK'} alt={mod.title} />
                    <div className="exam-overlay">
                      <Link to={`/simulados/${mod.id}/play`} className="play-btn">
                        <Play size={32} weight="fill" /> Iniciar Prova
                      </Link>
                    </div>
                  </div>
                  
                  <div className="exam-info">
                    <div className="exam-meta">
                        <span className="difficulty-label">Dificuldade:</span>
                        <div className="stars-container">{renderDifficulty(mod.difficulty_level)}</div>
                    </div>
                    <h3>{mod.title}</h3>
                    <p>{mod.description}</p>
                    
                    <Link to={`/simulados/${mod.id}/play`} className="start-btn-mobile">
                       Começar Agora
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Trophy size={64} color="#30363d" />
                <p>Nenhum simulado disponível no momento.</p>
                <small>Aguarde o professor cadastrar novos módulos.</small>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulados;
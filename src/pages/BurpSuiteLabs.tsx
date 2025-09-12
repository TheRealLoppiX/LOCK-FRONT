import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import './BurpSuiteLabs.css';

// Estrutura de dados para os laboratórios
const labs = [
  { id: 'sql-injection', title: 'SQL Injection', description: 'Explore como injetar queries SQL para manipular bancos de dados.' },
  { id: 'brute-force', title: 'Brute Force', description: 'Aprenda a automatizar ataques de força bruta contra formulários de login.' },
  {
    id: 'xss',
    title: 'XSS (Cross-Site Scripting)',
    description: 'Entenda os diferentes tipos de ataques XSS e como preveni-los.',
    subtopics: [
      { id: 'xss-stored', title: 'Stored XSS' },
      { id: 'xss-reflected', title: 'Reflected XSS' },
      { id: 'xss-dom', title: 'DOM Based XSS' },
    ],
  },
  { id: 'web-cache-poisoning', title: 'Web Cache Poisoning', description: 'Descubra como envenenar o cache de uma aplicação para atacar múltiplos usuários.' },
  { id: 'macro-automation', title: 'Macro e Automação', description: 'Use macros para automatizar tarefas repetitivas e testes complexos.' },
  { id: 'race-conditions', title: 'Race Conditions', description: 'Explore vulnerabilidades que surgem de eventos fora de sincronia.' },
  { id: 'logic-flaws', title: 'Logic Flaws', description: 'Identifique e explore falhas na lógica de negócio da aplicação.' },
];

const BurpSuiteLabs: React.FC = () => {
  const { user } = useAuth();
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  // Função para expandir/recolher a seção de XSS
  const toggleTopic = (topicId: string) => {
    if (topicId === 'xss') {
      setExpandedTopic(prev => (prev === 'xss' ? null : 'xss'));
    }
  };

  return (
    <div className="labs-page-container">
      <HexagonBackground />
      <div className="labs-content-wrapper">
        <header className="labs-header">
          <h1>Laboratórios: Burp Suite</h1>
          <p>Selecione um tópico para iniciar um ambiente prático.</p>
          <Link to="/dashboard" className="back-to-dashboard-link">← Voltar para a Dashboard</Link>
        </header>

        <ul className="labs-list">
          {labs.map((lab) => (
            <li
              key={lab.id}
              className={`lab-item ${lab.subtopics ? 'expandable' : ''} ${expandedTopic === lab.id ? 'expanded' : ''}`}
              onClick={() => toggleTopic(lab.id)}
            >
              <div className="lab-item-header">
                <h3>{lab.title}</h3>
                {lab.subtopics && (
                  <span className="expand-icon">{expandedTopic === lab.id ? '−' : '+'}</span>
                )}
              </div>
              <p>{lab.description}</p>
              
              {lab.subtopics && (
                <div className="sub-labs-list">
                  {lab.subtopics.map((subtopic) => (
                    <Link key={subtopic.id} to={`/labs/burp-suite/${subtopic.id}`} className="sub-lab-item">
                      {subtopic.title}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BurpSuiteLabs;
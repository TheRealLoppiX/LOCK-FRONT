import React from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import './LabList.css'; // Usando o CSS compartilhado
import { xssLabs } from './LabData';

const XSSList: React.FC = () => (
    <div className="labs-page-container">
        <HexagonBackground />
        <div className="labs-content">
            <header className="labs-header">
                <h1>Laboratórios: Cross-Site Scripting (XSS)</h1>
                <p>Selecione um dos desafios abaixo para começar.</p>
                <Link to="/dashboard" className="back-link">← Voltar para a Dashboard</Link>
            </header>
            <main className="labs-grid">
                {xssLabs.map((lab) => (
                    <Link key={lab.id} to={lab.path} className="lab-card">
                        <div className="lab-card-content">
                            <h2>{lab.title}</h2>
                            <p>{lab.description}</p>
                            <span className="lab-action">Iniciar →</span>
                        </div>
                    </Link>
                ))}
            </main>
        </div>
    </div>
);

export default XSSList;
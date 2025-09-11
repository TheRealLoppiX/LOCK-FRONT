import React from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../components/hexagonobg';
import './home.css';

// VOLTE A USAR ESTA LINHA:
// Lembre-se que salvamos a imagem limpa como 'hexagon-logo-limpo.png'
import hexagonLogo from '../assets/Logo lock.png'; 

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <HexagonBackground />
      
      <div className="home-content">
        {/* E VOLTE A USAR A TAG <img>, removendo as divs do hexágono CSS */}
        <img src={hexagonLogo} alt="Logo LOCK" className="home-hexagon-logo" />

        <h1>Bem-vindo ao LOCK!</h1>
        <p>Seu Laboratório Online de Cibersegurança</p>
        
        <div className="button-container">
          <Link to="/login">
            <button className="btn-primary">Fazer Login</button>
          </Link>
          <Link to="/register">
            <button className="btn-secondary">Criar Conta</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
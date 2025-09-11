import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../components/hexagonobg'; // Verifique o caminho
import './home.css';
import logo from '../assets/logo.png'; // Verifique o caminho

const Home: React.FC = () => {
  // NOVO: Lógica para o efeito de digitação
  const fullText = "Seu Laboratório Online de Cibersegurança";
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    // Garante que o texto comece vazio e digite novamente a cada visita na página
    setTypedText(''); 
    
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(prev => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 100); // Velocidade da digitação (100ms por letra)

    // Limpa o intervalo se o componente for desmontado
    return () => clearInterval(intervalId);
  }, []); // O array vazio [] faz isso rodar apenas uma vez quando o componente monta

  return (
    <div className="home-container">
      <HexagonBackground />
      <div className="home-content">
        <img src={logo} alt="Lock Hexagon Logo" className="home-hexagon-logo" />
        <h1>LOCK</h1>
        
        {/* ALTERADO: O parágrafo agora usa o texto digitado */}
        <p>
          {typedText}
          <span className="typing-cursor"></span> {/* Cursor que pisca */}
        </p>
        
        <div className="button-container">
          <Link to="/login" className="btn-primary">Entrar</Link>
          <Link to="/register" className="btn-secondary">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
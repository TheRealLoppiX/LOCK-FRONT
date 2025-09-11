import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../components/hexagonobg';
import './home.css';
import logo from '../assets/Logo lock.png';

const Home: React.FC = () => {
  const fullText = "Seu Laboratório Online de Cibersegurança";
  const [typedText, setTypedText] = useState('');

  // ===================================================================
  // LÓGICA DE DIGITAÇÃO CORRIGIDA
  // ===================================================================
  useEffect(() => {
    // Garante que o texto comece vazio antes de iniciar
    setTypedText(''); 
    
    const intervalId = setInterval(() => {
      // Usa o estado atual para determinar o próximo caractere
      setTypedText(currentTypedText => {
        // Se o texto atual ainda não atingiu o tamanho do texto completo
        if (currentTypedText.length < fullText.length) {
          // Retorna o texto atual + o próximo caractere
          return fullText.substring(0, currentTypedText.length + 1);
        } else {
          // Para o intervalo quando o texto estiver completo
          clearInterval(intervalId);
          return currentTypedText;
        }
      });
    }, 100); // Velocidade da digitação (100ms por letra)

    // Limpa o intervalo se o componente for desmontado (boa prática)
    return () => clearInterval(intervalId);
  }, []); // O array vazio [] faz isso rodar apenas uma vez quando o componente monta
  // ===================================================================

  return (
    <div className="home-container">
      <HexagonBackground />
      <div className="home-content">
        <img src={logo} alt="Lock Hexagon Logo" className="home-hexagon-logo" />
        <h1>LOCK</h1>
        
        <p>
          {typedText}
          <span className="typing-cursor"></span>
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
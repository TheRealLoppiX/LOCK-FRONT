import React from 'react';
import './Footer.css';
import logoIf from '../assets/Sem_título-removebg-preview.png';
import logoLOCK from '../assets/Logo lock.png';

const Footer: React.FC = () => {
  return (
    <>
      <div className="neon-line-separator"></div>
      <footer className="site-footer">
        
        {/* Caixa da Esquerda */}
        <div className="footer-logo-container">
          <a 
            href="https://ifsertaope.edu.br/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src={logoIf} 
              alt="Logo IFSertãoPE" 
              className="footer-logo" 
            />
          </a>
        </div>

        {/* Texto Central */}
        <p>Todos os direitos reservados © LOCK - 2025</p>

        {/* Caixa da Direita */}
        <div className="footer-logo-container">
          <img 
            src={logoLOCK} 
            alt="LogoLOCK" 
            className="footer-logo rotating-logo" 
          />
        </div>

      </footer>
    </>
  );
};

export default Footer;
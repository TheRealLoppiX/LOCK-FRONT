import React from 'react';
import './Footer.css';
import logoIf from '../assets/Sem_título-removebg-preview.png';
import logoLOCK from '../assets/Logo lock.png';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
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

      <p>Todos os direitos reservados © LOCK - 2025</p>

      <img 
        src={logoLOCK} 
        alt="LogoLOCK" 
        className="footer-logo" 
      />
    </footer>
  );
};

export default Footer;
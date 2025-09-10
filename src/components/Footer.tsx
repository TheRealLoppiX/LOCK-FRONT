// src/components/Footer.tsx

import React from 'react';
import './Footer.css';

// NOVO: Importe as imagens da sua pasta assets
// Confirme se os nomes dos arquivos estão exatamente iguais.
import logoIf from '../assets/Sem_título-removebg-preview.png';
import bandeiraPe from '../assets/Bandeira de Pernambuco.png';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      {/* Imagem da Logo no canto esquerdo */}
      <img 
        src={logoIf} // Use a variável importada aqui
        alt="Logo IFSertãoPE" 
        className="footer-logo" 
      />

      {/* Link do IFSertãoPE centralizado */}
      <a 
        href="https://ifsertaope.edu.br/" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        IFSertãoPE - Instituto Federal do Sertão Pernambucano
      </a>

      {/* Imagem da Bandeira de Pernambuco no canto direito */}
      <img 
        src={bandeiraPe} // Use a variável importada aqui
        alt="Bandeira de Pernambuco" 
        className="footer-flag" 
      />
    </footer>
  );
};

export default Footer;
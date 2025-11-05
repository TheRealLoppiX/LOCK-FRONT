import React, { useState, useEffect } from 'react';
import { 
  X, Users, Question, Envelope, FileText, Atom, CaretLeft 
} from '@phosphor-icons/react';
import './InfoModal.css'; 

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define as "telas" do modal
type ModalView = 'main' | 'about';

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<ModalView>('main');

  // Reseta para o menu principal sempre que o modal for fechado
  useEffect(() => {
    if (!isOpen) {
      // Delay para a animação de "saída" do modal antes de resetar
      setTimeout(() => setView('main'), 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderContent = () => {
    // ========================
    // TELA "SOBRE O APP"
    // ========================
    if (view === 'about') {
      return (
        <>
          <h2 className="modal-title">
            <button className="modal-back-button" onClick={() => setView('main')}>
              <CaretLeft size={20} weight="bold" />
            </button>
            Sobre o Projeto LOCK
          </h2>
          <div className="modal-body">
            <p>
              O Laboratório Online de Cibersegurança com Kali Linux (LOCK) nasce 
              em meio à necessidade de um meio de pesquisa, estudo e aprendizagem 
              prática sobre segurança e pentesting, principalmente na realidade do 
              Instituto Federal do Sertão Pernambucano (IFSertão-PE) - Campus Salgueiro.
            </p>
            <p>
              A equipe, composta por membros do Campus Salgueiro do IFSertão-PE, 
              tem como objetivo investigar, pesquisar, desenvolver, comprovar e 
              aplicar tecnologias relacionadas ao contexto da cibersegurança em 
              estado da atualidade.
            </p>
            <p>
              Diante disso, o grupo busca meios de transformar a cibersegurança em 
              uma aprendizagem prática e dinâmica para incentivar a propagação do 
              conhecimento, mitigar vulnerabilidades comuns, promover boas práticas 
              de segurança da informação e preparar discentes e docentes para 
              enfrentar cenários reais de ameaças cibernéticas.
            </p>
          </div>
        </>
      );
    }

    // ========================
    // TELA PRINCIPAL (MENU)
    // ========================
    return (
      <>
        <h2 className="modal-title">Informações</h2>
        <div className="modal-menu">
          
          <button className="menu-item" disabled title="Em breve">
            <Users size={24} weight="bold" />
            <span>Equipe</span>
          </button>

          <button className="menu-item" disabled title="Em breve">
            <Question size={24} weight="bold" />
            <span>Ajuda</span>
          </button>

          <a className="menu-item" href="mailto:seu-email@ifsertaope.edu.br">
            <Envelope size={24} weight="bold" />
            <span>Contato</span>
          </a>

          <a className="menu-item" href="/Termos_de_Uso_LOCK.pdf" download="Termos_de_Uso_LOCK.pdf">
            <FileText size={24} weight="bold" />
            <span>Termos de Uso</span>
          </a>

          <button className="menu-item" onClick={() => setView('about')}>
            <Atom size={24} weight="bold" />
            <span>Sobre o App</span>
          </button>

        </div>
      </>
    );
  };

  return (
    // O "fundo" escuro que fecha ao clicar
    <div className="modal-overlay" onClick={onClose}>
      {/* O "container" do modal que não fecha ao clicar nele */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Botão de Fechar (X) - sempre visível */}
        <button className="modal-close-button" onClick={onClose}>
          <X size={24} weight="bold" />
        </button>
        
        {/* Renderiza o conteúdo (Menu ou Sobre) */}
        {renderContent()}

      </div>
    </div>
  );
};

export default InfoModal;
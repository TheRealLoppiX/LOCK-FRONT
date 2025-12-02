import React, { useState, useEffect } from 'react';
import { 
  X, Users, Question, Envelope, FileText, Atom, CaretLeft, MagnifyingGlass
} from '@phosphor-icons/react';
import './InfoModal.css'; 

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView = 'main' | 'about';

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<ModalView>('main');

  useEffect(() => {
    if (!isOpen) {
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
            Sobre o App
          </h2>
          <div className="modal-body">
            <p>
              O Laboratório Online de Cibersegurança (LOCK) nasce em meio à 
              necessidade de um meio de pesquisa, estudo e aprendizagem 
              prática sobre segurança e pentesting, principalmente na 
              realidade do IFSertãoPE - Campus Salgueiro. Sendo financiado
              pelo IFSertãoPE, FACEPE e CNPq.
            </p>
            <p>
              A equipe tem como objetivo investigar, pesquisar, desenvolver, 
              comprovar e aplicar tecnologias relacionadas ao contexto da 
              cibersegurança em estado da atualidade.
            </p>
            <p>
              Buscamos transformar a cibersegurança em uma aprendizagem prática 
              e dinâmica para incentivar a propagação do conhecimento e preparar 
              discentes e docentes para enfrentar cenários reais de ameaças.
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
        {/* Título com o cursor neon */}
        <h2 className="modal-title with-cursor">Informações</h2>
        <div className="modal-menu">
          
          {/* Item estilo "Input" (desabilitado) */}
          <div className="menu-item-input disabled">
            <MagnifyingGlass size={20} />
            <span>Equipe</span>
          </div>

          {/* Item estilo "Input" (desabilitado) */}
          <div className="menu-item-input disabled">
            <Question size={20} />
            <span>Ajuda</span>
          </div>

          {/* Item estilo "Botão" (Link de email) */}
          <a className="menu-item-button" href="mailto:contato.lock@ifsertaope.edu.br">
            <Envelope size={20} weight="bold" />
            <span>Contato</span>
          </a>

          {/* Item estilo "Botão" (Link de download) */}
          <a className="menu-item-button" href="/Termos_de_Uso_LOCK.pdf" download>
            <FileText size={20} weight="bold" />
            <span>Termos de Uso</span>
          </a>

          {/* NOVO: Item de Política de Privacidade */}
          <a className="menu-item-button" href="/Politica_de_Privacidade_LOCK.pdf" download>
            <FileText size={20} weight="bold" />
            <span>Política de Privacidade</span>
          </a>

          {/* Item estilo "Botão" (Muda a tela) */}
          <button className="menu-item-button" onClick={() => setView('about')}>
            <Atom size={20} weight="bold" />
            <span>Sobre o App</span>
          </button>

        </div>
      </>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          <X size={24} weight="bold" />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default InfoModal;
import React, { useState, useEffect } from 'react';
import { 
  X, Users, Question, Envelope, FileText, Atom, CaretLeft, MagnifyingGlass,
  BookOpen, Student, ChalkboardTeacher // Novos ícones
} from '@phosphor-icons/react';
import { useAuth } from '../contexts/authContext'; // Importe o contexto de auth
import './InfoModal.css'; 

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Interface para verificar admin
interface UserWithRole {
  is_admin?: boolean;
}

type ModalView = 'main' | 'about' | 'manual';

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<ModalView>('main');
  const { user } = useAuth();
  
  // Verifica se é admin para mostrar o manual extra
  const isAdmin = (user as unknown as UserWithRole)?.is_admin;

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setView('main'), 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderContent = () => {
    // ========================
    // TELA "MANUAL DO SISTEMA"
    // ========================
    if (view === 'manual') {
      return (
        <>
          <h2 className="modal-title">
            <button className="modal-back-button" onClick={() => setView('main')}>
              <CaretLeft size={20} weight="bold" />
            </button>
            Manual do Sistema
          </h2>
          
          <div className="modal-body" style={{ textAlign: 'left' }}>
            {/* MANUAL DO ALUNO */}
            <div className="manual-block" style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#00f0ff', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '10px' }}>
                <Student size={22} /> Guia do Discente
              </h3>
              <div style={{ paddingLeft: '10px', fontSize: '0.9rem', color: '#c9d1d9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p>
                  <strong>1. Dashboard & Rank:</strong> Sua tela inicial é seu centro de comando. Use o checklist "Aprendizado Guiado" na direita para saber seu próximo passo e acompanhe seu XP no Perfil.
                </p>
                <p>
                  <strong>2. Biblioteca Digital:</strong> Acesse livros e artigos sem sair do site. O leitor integrado salva automaticamente a página onde você parou.
                </p>
                <p>
                  <strong>3. Simulados (Certificações):</strong> 
                  <br/>• Treine para provas reais (CompTIA, CEH).
                  <br/>• <u>Regra:</u> Você só pode tentar o mesmo simulado uma vez a cada 24h.
                  <br/>• <u>Aprovação:</u> Acerte 70% ou mais para liberar seu certificado.
                </p>
              </div>
            </div>

            {/* MANUAL DO INSTRUTOR (SÓ APARECE PARA ADMIN) */}
            {isAdmin && (
              <div className="manual-block" style={{ borderTop: '1px solid #30363d', paddingTop: '20px' }}>
                <h3 style={{ color: '#FFD700', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '10px' }}>
                  <ChalkboardTeacher size={22} /> Guia do Instrutor
                </h3>
                <div style={{ paddingLeft: '10px', fontSize: '0.9rem', color: '#c9d1d9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p>
                    <strong>1. Painel Admin:</strong> Acesse o card dourado no topo da Dashboard para gerenciar o sistema.
                  </p>
                  <p>
                    <strong>2. Criar Simulados:</strong> Use a opção "Criar Simulado" para abrir novas turmas ou temas. Defina o <u>Tempo Limite</u> em minutos para o cronômetro da prova.
                  </p>
                  <p>
                    <strong>3. Banco de Questões:</strong> Ao cadastrar uma questão, selecione o Simulado correspondente no menu superior para vinculá-la à prova correta.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      );
    }

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
            <Users size={20} />
            <span>Equipe</span>
          </div>

          {/* BOTÃO MANUAL (Substituindo o antigo "Ajuda" desabilitado) */}
          <button className="menu-item-button" onClick={() => setView('manual')}>
            <BookOpen size={20} weight="bold" />
            <span>Manual do Sistema</span>
          </button>

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
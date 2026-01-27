import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import { 
  CaretLeft, BookOpen, ShieldCheck, Student, 
  ChalkboardTeacher, CheckCircle, Warning 
} from '@phosphor-icons/react';
import './ManualPage.css';

interface UserWithRole {
  is_admin?: boolean;
}

const ManualPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = (user as UserWithRole)?.is_admin;
  
  const [activeTab, setActiveTab] = useState<'aluno' | 'admin'>('aluno');

  return (
    <div className="manual-container">
      <HexagonBackground />
      
      <div className="manual-content">
        <header className="manual-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <CaretLeft size={20} /> Voltar ao Dashboard
          </button>
          
          <div className="header-title">
            <BookOpen size={48} color="#00f0ff" weight="duotone" />
            <div>
              <h1>Documentação do Sistema</h1>
              <p>Guia oficial de operação da plataforma LOCK.</p>
            </div>
          </div>
        </header>

        <div className="manual-layout">
          {/* Navegação Lateral */}
          <aside className="manual-sidebar">
            <button 
              className={`sidebar-btn ${activeTab === 'aluno' ? 'active' : ''}`}
              onClick={() => setActiveTab('aluno')}
            >
              <Student size={24} /> Manual do Aluno
            </button>
            
            {isAdmin && (
              <button 
                className={`sidebar-btn admin ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                <ChalkboardTeacher size={24} /> Manual do Instrutor
              </button>
            )}
          </aside>

          {/* Conteúdo */}
          <main className="manual-body">
            
            {activeTab === 'aluno' && (
              <div className="manual-section fade-in">
                <h2><Student size={32} /> Guia do Discente</h2>
                <hr />
                
                <article>
                  <h3>1. Introdução ao LOCK</h3>
                  <p>Bem-vindo ao Laboratório Online de Cibersegurança. Esta plataforma foi desenhada para levar você do nível iniciante ao avançado em testes de invasão e defesa cibernética.</p>
                </article>

                <article>
                  <h3>2. Dashboard e Gamificação</h3>
                  <p>Sua tela inicial é o seu centro de comando. Acompanhe seu progresso através da barra de XP no seu Perfil.</p>
                  <ul>
                    <li><CheckCircle color="#00ff41" /> <strong>Aprendizado Guiado:</strong> Use o checklist na direita da tela para saber qual o próximo passo ideal.</li>
                    <li><CheckCircle color="#00ff41" /> <strong>Rank:</strong> Conclua livros e simulados para subir de patente (de Script Kiddie a Cyber God).</li>
                  </ul>
                </article>

                <article>
                  <h3>3. Biblioteca Digital</h3>
                  <p>Nossa biblioteca possui um leitor de PDF integrado. Você não precisa baixar os arquivos.</p>
                  <div className="info-box">
                    <strong>Dica:</strong> O sistema salva automaticamente a página onde você parou. Basta clicar em "Continuar Leitura".
                  </div>
                </article>

                <article>
                  <h3>4. Simulados e Certificações</h3>
                  <p>A área de Simulados prepara você para o mercado real (CompTIA, LPI, CEH).</p>
                  <ul>
                    <li><strong>Cronômetro:</strong> Toda prova tem um tempo limite definido pelo instrutor.</li>
                    <li><strong>Bloqueio Diário:</strong> Para incentivar o estudo real, você só pode tentar o mesmo simulado <u>uma vez a cada 24 horas</u>.</li>
                    <li><strong>Aprovação:</strong> É necessário acertar 70% ou mais das questões para gerar o certificado.</li>
                  </ul>
                </article>
              </div>
            )}

            {activeTab === 'admin' && isAdmin && (
              <div className="manual-section fade-in">
                <h2 style={{color: '#FFD700'}}><ChalkboardTeacher size={32} /> Guia Administrativo</h2>
                <hr style={{borderColor: '#FFD700'}} />
                
                <article>
                  <h3>1. Painel do Instrutor</h3>
                  <p>Como administrador, você verá um card exclusivo <strong>"Painel Admin"</strong> (Dourado) no topo da sua Dashboard. Ele é o ponto de acesso para todas as ferramentas de gestão.</p>
                </article>

                <article>
                  <h3>2. Criando Simulados (Módulos)</h3>
                  <p>Para criar uma nova prova ou categoria de estudos:</p>
                  <ol>
                    <li>Acesse "Criar Simulado".</li>
                    <li>Defina o Título (ex: "Prova Semestral de Redes").</li>
                    <li>Insira a URL de uma imagem para a capa.</li>
                    <li><strong>Tempo Limite:</strong> Defina quantos minutos o aluno terá. Se o tempo acabar, a prova é enviada automaticamente.</li>
                  </ol>
                </article>

                <article>
                  <h3>3. Cadastrando Questões</h3>
                  <p>O banco de questões alimenta os simulados.</p>
                  <ul>
                    <li>No menu "Cadastrar Questões", selecione o Simulado desejado no dropdown superior.</li>
                    <li>Preencha o enunciado e as 4 alternativas.</li>
                    <li>Selecione a resposta correta e clique em Salvar.</li>
                  </ul>
                  <div className="warning-box">
                    <Warning size={20} /> <strong>Atenção:</strong> Questões sem módulo vinculado aparecerão apenas nos Quizzes aleatórios ("Modo Treino").
                  </div>
                </article>

                <article>
                  <h3>4. Gestão da Biblioteca</h3>
                  <p>Para adicionar novos materiais:</p>
                  <ul>
                    <li>Acesse "Cadastrar Material".</li>
                    <li>Recomendamos hospedar os PDFs e Imagens no Supabase Storage e colar os links públicos no formulário.</li>
                  </ul>
                </article>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default ManualPage;
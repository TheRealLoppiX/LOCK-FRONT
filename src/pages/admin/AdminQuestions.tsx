import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import HexagonBackground from '../../components/hexagonobg';
import { CaretLeft, CheckCircle, Warning, Question, ListBullets, Sparkle, CircleNotch } from '@phosphor-icons/react';
import AdminItemsList, { AdminListItem } from '../../components/admin/AdminItemsList';
import { useToast } from '../../contexts/toastContext';
import './AdminQuestions.css';

// Interface para os módulos (Simulados)
interface ExamModule {
  id: string;
  title: string;
}

interface QuestionRow {
  id: string;
  question_text: string;
  topic: string;
  difficulty: string;
  module_id: string | null;
}

interface GeneratedQuestion {
  enunciado: string;
  opcao_a: string;
  opcao_b: string;
  opcao_c: string;
  opcao_d: string;
  resposta_correta: string;
  justificativa?: string;
  referencia?: string;
}

const AdminQuestions: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Lista de Módulos carregados do banco
  const [modules, setModules] = useState<ExamModule[]>([]);

  // Lista de questões já cadastradas (para exclusão em lote)
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  // Estados do Formulário
  const [topic, setTopic] = useState('sql-injection');
  const [difficulty, setDifficulty] = useState('fácil');
  const [selectedModule, setSelectedModule] = useState<string>(''); // ID do módulo ou vazio
  const [questionText, setQuestionText] = useState('');
  
  // Opções fixas
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  
  // Resposta correta
  const [correctOption, setCorrectOption] = useState('A');

  // Geração de rascunhos com a Aegis
  const [aiTema, setAiTema] = useState('');
  const [aiQuantidade, setAiQuantidade] = useState(3);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [draftQuestions, setDraftQuestions] = useState<GeneratedQuestion[]>([]);

  // Carrega a lista de módulos ao abrir a página
  useEffect(() => {
    const fetchModules = async () => {
      try {
        // Usa a rota pública que criamos no Passo 2
        const response = await fetch(`${process.env.REACT_APP_API_URL}/modules`);
        if (response.ok) {
          const data = await response.json();
          setModules(data);
        }
      } catch (error) {
        console.error("Erro ao buscar módulos:", error);
      }
    };
    fetchModules();
  }, []);

  const fetchQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setQuestions(await response.json());
      } else {
        showToast({ message: 'Não foi possível carregar as questões cadastradas.', actionLabel: 'Tentar novamente', onAction: fetchQuestions });
      }
    } catch (error) {
      console.error('Erro ao buscar questões cadastradas:', error);
      showToast({ message: 'Não foi possível carregar as questões cadastradas.', actionLabel: 'Tentar novamente', onAction: fetchQuestions });
    } finally {
      setQuestionsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleGenerateDrafts = async () => {
    if (!aiTema.trim()) {
      setAiError('Digite um tema para gerar as questões.');
      return;
    }
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/questions/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tema: aiTema, quantidade: aiQuantidade }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Falha ao gerar questões.');
      setDraftQuestions(data.questoes || []);
    } catch (error: any) {
      setAiError(error.message || 'Erro ao gerar questões com a Aegis.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseDraft = (draft: GeneratedQuestion) => {
    setQuestionText(draft.enunciado || '');
    setOptionA(draft.opcao_a || '');
    setOptionB(draft.opcao_b || '');
    setOptionC(draft.opcao_c || '');
    setOptionD(draft.opcao_d || '');
    const letter = (draft.resposta_correta || 'A').trim().charAt(0).toUpperCase();
    setCorrectOption(['A', 'B', 'C', 'D'].includes(letter) ? letter : 'A');
    setFeedback(null);
    document.querySelector('.admin-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDiscardDraft = (index: number) => {
    setDraftQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    const optionsMap: Record<string, string> = {
      'A': optionA, 'B': optionB, 'C': optionC, 'D': optionD
    };
    
    const finalCorrectAnswer = optionsMap[correctOption];

    const payload = {
      topic,
      difficulty,
      question: questionText,
      options: [optionA, optionB, optionC, optionD],
      correct_answer: finalCorrectAnswer,
      module_id: selectedModule || null // Envia o ID ou null se for questão solta
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback({ type: 'success', msg: 'Questão cadastrada com sucesso!' });
        // Limpar campos principais para facilitar cadastro em massa
        setQuestionText('');
        setOptionA(''); setOptionB(''); setOptionC(''); setOptionD('');
        // Não limpamos o módulo/tópico propositalmente para agilizar o próximo cadastro
        fetchQuestions();
      } else {
        setFeedback({ type: 'error', msg: data.message || 'Erro ao cadastrar.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', msg: 'Erro de conexão com o servidor.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <HexagonBackground />
      
      <div className="admin-content">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <CaretLeft size={20} /> Voltar
        </button>

        <div style={{textAlign: 'center', marginBottom: '10px'}}>
            <Question size={48} color="#FFD700" />
        </div>
        <h1>Cadastro de Questões</h1>
        <p className="admin-subtitle">Adicione perguntas avulsas ou para simulados</p>

        {feedback && (
          <div className={`feedback-message ${feedback.type}`}>
            {feedback.type === 'success' ? <CheckCircle size={24} /> : <Warning size={24} />}
            <span>{feedback.msg}</span>
          </div>
        )}

        <div className="ai-generate-panel">
          <label style={{ color: '#FFD700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkle size={18} weight="fill" /> Gerar rascunhos com a Aegis
          </label>
          <div className="ai-generate-row">
            <input
              type="text"
              placeholder="Tema (ex: SQL Injection, VPN, Criptografia...)"
              value={aiTema}
              onChange={(e) => setAiTema(e.target.value)}
            />
            <input
              type="number"
              min={1}
              max={10}
              value={aiQuantidade}
              onChange={(e) => setAiQuantidade(Number(e.target.value))}
              title="Quantidade de questões"
            />
            <button type="button" onClick={handleGenerateDrafts} disabled={aiLoading}>
              {aiLoading ? <CircleNotch size={16} className="spin-icon" /> : <Sparkle size={16} />}
              {aiLoading ? 'Gerando...' : 'Gerar'}
            </button>
          </div>
          {aiError && <p className="ai-generate-error">{aiError}</p>}

          {draftQuestions.length > 0 && (
            <div className="draft-questions-list">
              {draftQuestions.map((draft, i) => (
                <div key={i} className="draft-question-card">
                  <p className="draft-question-text">{draft.enunciado}</p>
                  <ul className="draft-question-options">
                    <li className={draft.resposta_correta?.trim().toUpperCase().startsWith('A') ? 'correct' : ''}>A) {draft.opcao_a}</li>
                    <li className={draft.resposta_correta?.trim().toUpperCase().startsWith('B') ? 'correct' : ''}>B) {draft.opcao_b}</li>
                    <li className={draft.resposta_correta?.trim().toUpperCase().startsWith('C') ? 'correct' : ''}>C) {draft.opcao_c}</li>
                    <li className={draft.resposta_correta?.trim().toUpperCase().startsWith('D') ? 'correct' : ''}>D) {draft.opcao_d}</li>
                  </ul>
                  {draft.justificativa && <p className="draft-question-justification">{draft.justificativa}</p>}
                  <div className="draft-question-actions">
                    <button type="button" onClick={() => handleUseDraft(draft)}>Usar esta questão</button>
                    <button type="button" className="discard" onClick={() => handleDiscardDraft(i)}>Descartar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="admin-form">

          <div className="form-row">
            {/* Seleção de Módulo (Simulado) */}
            <div className="input-group" style={{gridColumn: '1 / -1'}}>
                <label style={{color: '#FFD700', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <ListBullets size={18} /> Vincular a um Simulado (Opcional)
                </label>
                <select 
                    value={selectedModule} 
                    onChange={e => setSelectedModule(e.target.value)}
                    style={{borderColor: selectedModule ? '#FFD700' : '#30363d'}}
                >
                    <option value="">-- NENHUM (Questão Avulsa / Banco Geral) --</option>
                    {modules.map(mod => (
                        <option key={mod.id} value={mod.id}>
                            {mod.title}
                        </option>
                    ))}
                </select>
                <small style={{color: '#8b949e', marginTop: '4px'}}>
                    Se selecionar um simulado, essa questão aparecerá na prova dele. Caso contrário, aparecerá nos Quizzes aleatórios.
                </small>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Tópico Técnico</label>
              <select value={topic} onChange={e => setTopic(e.target.value)}>
                <option value="sql-injection">SQL Injection</option>
                <option value="xss">XSS (Cross-Site Scripting)</option>
                <option value="brute-force">Brute Force</option>
                <option value="redes">Redes / TCPDump / NMap</option>
                <option value="variado">Variado</option>
                <option value="certificacao">Certificações Gerais</option>
              </select>
            </div>

            <div className="input-group">
              <label>Dificuldade</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option value="fácil">Fácil</option>
                <option value="médio">Médio</option>
                <option value="difícil">Difícil</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Enunciado da Pergunta</label>
            <textarea 
              rows={4}
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              placeholder="Digite a pergunta completa aqui..."
              required
            />
          </div>

          <div className="options-grid">
            <div className="input-group">
              <label>Opção A</label>
              <input type="text" value={optionA} onChange={e => setOptionA(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Opção B</label>
              <input type="text" value={optionB} onChange={e => setOptionB(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Opção C</label>
              <input type="text" value={optionC} onChange={e => setOptionC(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Opção D</label>
              <input type="text" value={optionD} onChange={e => setOptionD(e.target.value)} required />
            </div>
          </div>

          <div className="input-group correct-answer-group">
            <label>Alternativa Correta:</label>
            <div className="radio-options">
              {['A', 'B', 'C', 'D'].map((opt) => (
                <label key={opt} className={`radio-label ${correctOption === opt ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="correctOption" 
                    value={opt} 
                    checked={correctOption === opt}
                    onChange={() => setCorrectOption(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Cadastrar Questão'}
          </button>

        </form>

        <AdminItemsList
          title="Questões Cadastradas"
          loading={questionsLoading}
          items={questions.map((q): AdminListItem => ({
            id: q.id,
            primary: q.question_text,
            secondary: `${q.topic} · ${q.difficulty}${q.module_id ? ` · ${modules.find(m => m.id === q.module_id)?.title || 'simulado'}` : ''}`,
          }))}
          deleteUrl={(id) => `${process.env.REACT_APP_API_URL}/admin/questions/${id}`}
          itemLabelSingular="questão"
          itemLabelPlural="questões"
          token={token}
          onDeleted={(deletedIds) => setQuestions((prev) => prev.filter((q) => !deletedIds.includes(q.id)))}
        />
      </div>
    </div>
  );
};

export default AdminQuestions;
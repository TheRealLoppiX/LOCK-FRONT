import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import HexagonBackground from '../../components/hexagonobg';
import { CaretLeft, CheckCircle, Warning, Question, ListBullets } from '@phosphor-icons/react';
import './AdminQuestions.css';

// Interface para os módulos (Simulados)
interface ExamModule {
  id: string;
  title: string;
}

const AdminQuestions: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Lista de Módulos carregados do banco
  const [modules, setModules] = useState<ExamModule[]>([]);

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
      </div>
    </div>
  );
};

export default AdminQuestions;
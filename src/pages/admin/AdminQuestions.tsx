import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import HexagonBackground from '../../components/hexagonobg';
import { CaretLeft, CheckCircle, Warning } from '@phosphor-icons/react';
import './AdminQuestions.css';

const AdminQuestions: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Estados do Formulário
  const [topic, setTopic] = useState('sql-injection');
  const [difficulty, setDifficulty] = useState('fácil');
  const [questionText, setQuestionText] = useState('');
  
  // Opções fixas em 4 inputs
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  
  // Resposta correta (guarda o valor do texto)
  const [correctOption, setCorrectOption] = useState('A'); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    // Mapeia a letra selecionada para o texto real da opção
    const optionsMap: Record<string, string> = {
      'A': optionA, 'B': optionB, 'C': optionC, 'D': optionD
    };
    
    const finalCorrectAnswer = optionsMap[correctOption];

    const payload = {
      topic,
      difficulty,
      question: questionText,
      options: [optionA, optionB, optionC, optionD],
      correct_answer: finalCorrectAnswer
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
        // Limpar formulário (opcional)
        setQuestionText('');
        setOptionA(''); setOptionB(''); setOptionC(''); setOptionD('');
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

        <h1>Cadastro de Questões</h1>
        <p className="admin-subtitle">Painel Exclusivo de Administrador</p>

        {feedback && (
          <div className={`feedback-message ${feedback.type}`}>
            {feedback.type === 'success' ? <CheckCircle size={24} /> : <Warning size={24} />}
            <span>{feedback.msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          
          <div className="form-row">
            <div className="input-group">
              <label>Tópico</label>
              <select value={topic} onChange={e => setTopic(e.target.value)}>
                <option value="sql-injection">SQL Injection</option>
                <option value="xss">XSS (Cross-Site Scripting)</option>
                <option value="brute-force">Brute Force</option>
                <option value="redes">Redes / TCPDump / NMap</option>
                <option value="variado">Variado</option>
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
              placeholder="Digite a pergunta aqui..."
              required
            />
          </div>

          <div className="options-grid">
            <div className="input-group">
              <label>Opção A</label>
              <input type="text" value={optionA} onChange={e => setOptionA(e.target.value)} required placeholder="Resposta A" />
            </div>
            <div className="input-group">
              <label>Opção B</label>
              <input type="text" value={optionB} onChange={e => setOptionB(e.target.value)} required placeholder="Resposta B" />
            </div>
            <div className="input-group">
              <label>Opção C</label>
              <input type="text" value={optionC} onChange={e => setOptionC(e.target.value)} required placeholder="Resposta C" />
            </div>
            <div className="input-group">
              <label>Opção D</label>
              <input type="text" value={optionD} onChange={e => setOptionD(e.target.value)} required placeholder="Resposta D" />
            </div>
          </div>

          <div className="input-group correct-answer-group">
            <label>Qual é a alternativa correta?</label>
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
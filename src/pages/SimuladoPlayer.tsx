import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import { CaretLeft, CaretRight, CheckCircle, XCircle, Trophy, Timer, Warning } from '@phosphor-icons/react';
import './SimuladoPlayer.css';

// Interfaces para tipagem dos dados
interface Question {
  id: string;
  question: string;
  options: string[]; // Vem como JSONB do banco, aqui será array de strings
  correct_answer: string; // O texto da resposta correta
}

interface ExamModule {
  title: string;
  difficulty_level: number;
}

const SimuladoPlayer: React.FC = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  // Estados de Dados
  const [loading, setLoading] = useState(true);
  const [moduleData, setModuleData] = useState<ExamModule | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Estados do Jogo/Prova
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // Guarda { "id_da_questao": "Texto da Opção Escolhida" }
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carrega os dados ao abrir a página
  useEffect(() => {
    fetchExamData();
  }, [id]);

  const fetchExamData = async () => {
    try {
      // 1. Busca as questões específicas deste módulo
      const res = await fetch(`${process.env.REACT_APP_API_URL}/modules/${id}/questions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        setModuleData(data.module);
        // Embaralha as questões para que a ordem nunca seja a mesma
        const shuffledQuestions = data.questions.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      } else {
        alert("Erro ao carregar o simulado. Tente novamente.");
        navigate('/simulados');
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
    } finally {
      setLoading(false);
    }
  };

  // Regista a opção selecionada pelo utilizador
  const handleOptionSelect = (option: string) => {
    const currentQ = questions[currentQuestionIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: option
    }));
  };

  // Avança para a próxima pergunta ou finaliza
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishExam();
    }
  };

  // Calcula a nota e envia para o backend
  const finishExam = async () => {
    setIsSubmitting(true);
    let finalScore = 0;

    // Calcula acertos
    questions.forEach(q => {
      // Compara a resposta escolhida com a correta
      if (selectedAnswers[q.id] === q.correct_answer) {
        finalScore++;
      }
    });

    setScore(finalScore);
    setIsFinished(true);

    // Envia o resultado para o banco de dados
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/modules/${id}/attempt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          score: finalScore,
          total_questions: questions.length
        })
      });
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      // Não bloqueamos o utilizador se falhar o salvamento, apenas mostramos o resultado local
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDERIZAÇÃO ---

  if (loading) return <div className="loading-screen">A carregar Simulado...</div>;

  if (questions.length === 0) {
    return (
        <div className="player-container">
            <div className="empty-warning">
                <Warning size={48} color="#FFD700" />
                <h2>Este simulado ainda não tem questões cadastradas.</h2>
                <button onClick={() => navigate('/simulados')} className="nav-btn">Voltar</button>
            </div>
        </div>
    )
  }

  // TELA DE RESULTADO FINAL
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70; // Critério de aprovação (70%)

    return (
      <div className="player-container">
        <HexagonBackground />
        <div className="result-card">
          <Trophy size={64} color={passed ? "#00ff41" : "#ff3232"} weight="duotone" />
          
          <h1>{passed ? "Aprovado!" : "Não foi desta vez"}</h1>
          
          <div className="score-details">
            <p>Você acertou <strong>{score}</strong> de <strong>{questions.length}</strong> questões.</p>
          </div>
          
          <div className="score-circle" style={{borderColor: passed ? '#00ff41' : '#ff3232'}}>
            <span className="score-percentage">{percentage}%</span>
            <span className="score-label">Nota Final</span>
          </div>

          <p className="feedback-text">
            {passed 
                ? "Parabéns! Você demonstrou um excelente domínio sobre o tema." 
                : "Continue estudando os materiais da biblioteca e tente novamente."}
          </p>

          <button onClick={() => navigate('/simulados')} className="finish-btn">
            Voltar para Certificações
          </button>
        </div>
      </div>
    );
  }

  // TELA DE PERGUNTA (JOGO)
  const currentQ = questions[currentQuestionIndex];
  // Calcula o progresso (ex: Questão 5 de 10 = 50%)
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="player-container">
      <HexagonBackground />
      
      {/* Cabeçalho do Exame */}
      <div className="exam-header">
        <div className="exam-title-box">
            <h2>{moduleData?.title}</h2>
            <div className="timer-badge"><Timer size={20} /> Modo Simulado</div>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="progress-bar-exam-container">
        <div className="progress-label">
            <span>Questão {currentQuestionIndex + 1}</span>
            <span>{questions.length} total</span>
        </div>
        <div className="progress-bar-exam">
            <div className="fill" style={{width: `${progress}%`}}></div>
        </div>
      </div>

      {/* Cartão da Questão */}
      <div className="question-card">
        <h3 className="q-text">{currentQ.question}</h3>

        <div className="options-list">
          {currentQ.options.map((opt, idx) => {
            // Verifica se esta opção está selecionada
            const isSelected = selectedAnswers[currentQ.id] === opt;
            
            return (
              <button 
                key={idx} 
                className={`option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(opt)}
              >
                <div className="radio-circle">
                    {isSelected && <div className="dot" />}
                </div>
                <span className="option-text">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Rodapé com Navegação */}
        <div className="exam-footer">
          <button 
            className="nav-btn" 
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(p => p - 1)}
          >
            <CaretLeft /> Anterior
          </button>

          <button 
            className="nav-btn next" 
            onClick={handleNext}
            disabled={!selectedAnswers[currentQ.id]} // Obriga a responder antes de avançar
          >
            {currentQuestionIndex === questions.length - 1 ? (
                isSubmitting ? "Finalizando..." : "Finalizar Prova"
            ) : (
                <>Próxima <CaretRight /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimuladoPlayer;
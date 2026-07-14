import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import { CaretLeft, CaretRight, Trophy, Timer, Warning, Clock } from '@phosphor-icons/react';
import './SimuladoPlayer.css';

interface Question {
  id: string;
  question_text: string;
  options: string[];
}

interface ExamModule {
  title: string;
  difficulty_level: number;
  duration_minutes: number; // Novo campo
}

const SimuladoPlayer: React.FC = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(''); // Para mostrar erro de "Já fez hoje"
  
  const [moduleData, setModuleData] = useState<ExamModule | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); 
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // CRONÔMETRO
  const [timeLeft, setTimeLeft] = useState(0); // Em segundos

  useEffect(() => {
    fetchExamData();
  }, [id]);

  // Lógica do Timer
  useEffect(() => {
    if (!loading && !isFinished && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && !loading && !isFinished && moduleData) {
      // TEMPO ACABOU!
      finishExam();
    }
  }, [timeLeft, loading, isFinished]);

  // Formata segundos para MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const fetchExamData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/modules/${id}/questions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        setModuleData(data.module);
        // Define o tempo inicial (minutos * 60)
        setTimeLeft(data.module.duration_minutes * 60);
        
        const shuffledQuestions = data.questions.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      } else {
        // Trata erro de "Já realizou hoje"
        setErrorMsg(data.message || "Erro ao carregar simulado.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      setErrorMsg("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    const currentQ = questions[currentQuestionIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: option
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishExam();
    }
  };

  const finishExam = async () => {
    if (isFinished || isSubmitting) return; // Evita duplo envio
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // A nota é calculada no servidor a partir do gabarito real — o
      // cliente só envia as respostas escolhidas, nunca uma nota pronta.
      const res = await fetch(`${process.env.REACT_APP_API_URL}/modules/${id}/attempt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: selectedAnswers })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Falha ao corrigir a prova.');

      setScore(data.score);
      setIsFinished(true);
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      setSubmitError('Não foi possível corrigir sua prova. Verifique sua conexão e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading-screen">Preparando ambiente de prova...</div>;

  // TELA DE ERRO (Ex: Já fez hoje)
  if (errorMsg) {
    return (
        <div className="player-container">
            <HexagonBackground />
            <div className="empty-warning" style={{borderColor: '#ff3232'}}>
                <Warning size={48} color="#ff3232" />
                <h2 style={{color: '#ff3232', marginTop: '10px'}}>Acesso Negado</h2>
                <p>{errorMsg}</p>
                <button onClick={() => navigate('/simulados')} className="nav-btn" style={{marginTop: '20px'}}>Voltar</button>
            </div>
        </div>
    )
  }

  // TELA DE RESULTADO
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="player-container">
        <HexagonBackground />
        <div className="result-card">
          <Trophy size={64} color={passed ? "#00ff41" : "#ff3232"} weight="duotone" />
          <h1>{timeLeft === 0 && percentage < 70 ? "Tempo Esgotado!" : (passed ? "Aprovado!" : "Reprovado")}</h1>
          
          <div className="score-details">
            <p>Você acertou <strong>{score}</strong> de <strong>{questions.length}</strong> questões.</p>
          </div>
          
          <div className="score-circle" style={{borderColor: passed ? '#00ff41' : '#ff3232'}}>
            <span className="score-percentage">{percentage}%</span>
            <span className="score-label">Nota Final</span>
          </div>

          <button onClick={() => navigate('/simulados')} className="finish-btn">
            Voltar para Certificações
          </button>
        </div>
      </div>
    );
  }

  // TELA DE PERGUNTA (JOGO)
  const currentQ = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  // Cor do timer muda se tiver menos de 1 minuto
  const timerColor = timeLeft < 60 ? '#ff3232' : '#FFD700';

  return (
    <div className="player-container">
      <HexagonBackground />
      
      <div className="exam-header">
        <div className="exam-title-box">
            <h2>{moduleData?.title}</h2>
            {/* TIMER VISUAL */}
            <div className="timer-badge" style={{ borderColor: timerColor, color: timerColor }}>
                <Clock size={20} weight={timeLeft < 60 ? "fill" : "regular"} /> 
                {formatTime(timeLeft)}
            </div>
        </div>
      </div>

      <div className="progress-bar-exam-container">
        <div className="progress-label">
            <span>Questão {currentQuestionIndex + 1} de {questions.length}</span>
        </div>
        <div className="progress-bar-exam">
            <div className="fill" style={{width: `${progress}%`}}></div>
        </div>
      </div>

      <div className="question-card">
        <h3 className="q-text">{currentQ.question_text}</h3>

        <div className="options-list">
          {currentQ.options.map((opt, idx) => {
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

        {submitError && (
          <p style={{ color: '#ff3232', textAlign: 'center', marginTop: '12px' }}>{submitError}</p>
        )}

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
            disabled={!selectedAnswers[currentQ.id] || isSubmitting}
          >
            {currentQuestionIndex === questions.length - 1 ? (
                isSubmitting ? "Finalizando..." : "Entregar Prova"
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
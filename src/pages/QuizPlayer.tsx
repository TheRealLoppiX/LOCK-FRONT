import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import './QuizPlayer.css';
import { Timer, CheckCircle, XCircle, CircleNotch, Robot } from '@phosphor-icons/react';

// A interface agora inclui a propriedade opcional 'image_url'
interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer_index: number;
  image_url?: string; // <-- NOVA PROPRIEDADE (o '?' a torna opcional)
}

const QuizPlayer: React.FC = () => {
  const { topic, difficulty } = useParams<{ topic: string; difficulty: string }>();
  const { token } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const wrongAnswersRef = useRef<string[]>([]);

  const isTimedMode = difficulty === 'temporizado';
  const isTrainingMode = difficulty === 'treinamento';

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!token) {
        setLoading(false);
        setError("Você precisa estar logado para jogar.");
        return;
      }
      setLoading(true);
      setError(null);
      
      const limit = (isTimedMode || isTrainingMode) ? 50 : 10;
      const difficultyParam = (isTimedMode || isTrainingMode) ? 'aleatório' : difficulty;

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/quiz/questions?topic=${topic}&difficulty=${difficultyParam}&limit=${limit}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao buscar perguntas.');
        }
        const data = await response.json();
        if (data.length === 0) {
          throw new Error('Nenhuma pergunta foi encontrada para este modo.');
        }
        setQuestions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [topic, difficulty, token, isTimedMode, isTrainingMode]);

  useEffect(() => {
    if (isTimedMode && !quizFinished && questions.length > 0 && !error) {
      if (timeLeft <= 0) {
        setQuizFinished(true);
        return;
      }
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isTimedMode, quizFinished, timeLeft, questions, error]);

  const handleNextQuestion = useCallback(() => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  }, [currentQuestionIndex, questions.length]);

  useEffect(() => {
    if (!quizFinished || !token || !topic || !difficulty) return;
    fetch(`${process.env.REACT_APP_API_URL}/quiz/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ topic, difficulty, score, totalQuestions: questions.length }),
    }).catch(() => {
      // XP é um bônus — não bloqueia a tela de resultado se falhar
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizFinished]);

  useEffect(() => {
    if (!quizFinished || !token) return;
    const wrong = wrongAnswersRef.current;
    if (wrong.length === 0) return;

    const analyze = async () => {
      setIsAnalyzing(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/ai/analyze-quiz`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ wrongQuestions: wrong.slice(0, 5) })
        });
        const data = await res.json();
        setAiAnalysis(data.analysis || null);
      } catch {
        // análise da IA é opcional — falha silenciosa
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyze();
  }, [quizFinished, token]);

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    const isCorrect = index === questions[currentQuestionIndex].correct_answer_index;

    if (isCorrect) {
      setScore(prev => prev + 1);
      if (isTimedMode) setTimeLeft(prev => prev + 5);
    } else {
      wrongAnswersRef.current.push(questions[currentQuestionIndex].question_text);
    }
    setTimeout(() => handleNextQuestion(), 1500);
  };

  if (loading) {
    return <div className="quiz-player-container"><div>Carregando Quiz...</div></div>;
  }

  if (error) {
    return (
      <div className="quiz-player-container">
        <div className="quiz-summary">
          <h1>Ocorreu um Erro</h1>
          <p className="error-message">{error}</p>
          <Link to={`/quizzes/${topic}`} className="summary-btn secondary">Tentar Novamente</Link>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="quiz-player-container">
        <HexagonBackground />
        <div className="quiz-summary">
          <h1>Quiz Finalizado!</h1>
          <p>Sua pontuação final foi:</p>
          <div className="final-score">{score}</div>
          <p>Você acertou {score} de {isTimedMode || isTrainingMode ? score : questions.length} perguntas.</p>

          {wrongAnswersRef.current.length > 0 && (
            <div className="ai-analysis-box">
              <div className="ai-analysis-header">
                <Robot size={20} weight="duotone" />
                <span>Análise de Erros — Aegis</span>
              </div>
              {isAnalyzing ? (
                <div className="ai-analysis-loading">
                  <CircleNotch size={18} className="spin-icon" /> Analisando seus erros...
                </div>
              ) : aiAnalysis ? (
                <p className="ai-analysis-text">{aiAnalysis}</p>
              ) : null}
            </div>
          )}

          <Link to={`/quizzes/${topic}`} className="summary-btn">Jogar Novamente</Link>
          <Link to="/dashboard" className="summary-btn secondary">Voltar para a Dashboard</Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="quiz-player-container">
      <HexagonBackground />
      <div className="quiz-box">
        <div className="quiz-player-header">
          <h2 style={{ textTransform: 'capitalize' }}>{topic}: {difficulty}</h2>
          <div className="stats">
            <span>Pontuação: {score}</span>
            {isTimedMode && <span className="timer"><Timer size={20} /> {timeLeft}s</span>}
            {!isTimedMode && !isTrainingMode && <span>Pergunta {currentQuestionIndex + 1}/{questions.length}</span>}
          </div>
        </div>
        
        <div className="question-area">
          {/* ====================================================== */}
          {/* ALTERAÇÃO APLICADA AQUI                                */}
          {/* Renderiza a imagem APENAS SE a URL existir na questão */}
          {/* ====================================================== */}
          {currentQuestion.image_url && (
            <img 
              src={currentQuestion.image_url} 
              alt="Ilustração da questão" 
              className="question-image" 
            />
          )}
          <h3>{currentQuestion.question_text}</h3>
        </div>

        <div className="options-grid">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = index === currentQuestion.correct_answer_index;
            let buttonClass = 'option-btn';
            if (isAnswered) {
              if (selectedAnswer === index) buttonClass += isCorrect ? ' correct' : ' incorrect';
              else if (isCorrect) buttonClass += ' correct';
            }
            return (
              <button key={index} className={buttonClass} onClick={() => handleAnswerSelect(index)} disabled={isAnswered}>
                {option}
                {isAnswered && (selectedAnswer === index || isCorrect) && (isCorrect ? <CheckCircle /> : (selectedAnswer === index && <XCircle />))}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;
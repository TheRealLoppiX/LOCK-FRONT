import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import './QuizPlayer.css';
import { Timer, CheckCircle, XCircle } from '@phosphor-icons/react';

// Define a estrutura de uma Pergunta
interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer_index: number;
  difficulty: 'fácil' | 'médio' | 'difícil';
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
  const [error, setError] = useState<string | null>(null); // Estado para controlar erros

  const isTimedMode = difficulty === 'temporizado';
  const isTrainingMode = difficulty === 'treinamento';

  // Busca as perguntas na API
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      const limit = (isTimedMode || isTrainingMode) ? 50 : 10;
      // Garante que a dificuldade 'aleatório' seja enviada para os modos corretos
      const difficultyParam = isTimedMode || isTrainingMode ? 'aleatório' : difficulty;

      try {
        const response = await fetch(`https://lock-api.onrender.com/quiz/questions?topic=${topic}&difficulty=${difficultyParam}&limit=${limit}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao buscar perguntas do servidor.');
        }

        const data = await response.json();
        if (data.length === 0) {
          throw new Error('Não foram encontradas perguntas para este modo. Verifique o tópico e a dificuldade.');
        }

        setQuestions(data);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [topic, difficulty, token, isTimedMode, isTrainingMode]);

  // Lógica do cronômetro
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

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    const isCorrect = index === questions[currentQuestionIndex].correct_answer_index;

    if (isCorrect) {
      setScore(prev => prev + 1);
      if (isTimedMode) setTimeLeft(prev => prev + 5);
    }
    setTimeout(() => handleNextQuestion(), 1500);
  };

  // --- Telas de Renderização ---

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
          <p>Você acertou {score} de {isTimedMode ? score : questions.length} perguntas.</p>
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
          <h2 style={{ textTransform: 'capitalize' }}>{topic}: Modo {difficulty}</h2>
          <div className="stats">
            <span>Pontuação: {score}</span>
            {isTimedMode && <span className="timer"><Timer size={20} /> {timeLeft}s</span>}
            {!isTimedMode && !isTrainingMode && <span>Pergunta {currentQuestionIndex + 1}/{questions.length}</span>}
          </div>
        </div>
        <div className="question-area">
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
                {isAnswered && (isCorrect ? <CheckCircle /> : (selectedAnswer === index && <XCircle />))}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;
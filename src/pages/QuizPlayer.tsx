import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import './QuizPlayer.css';
import { Timer, CheckCircle, XCircle } from '@phosphor-icons/react';

// Define o tipo de uma Pergunta do quiz
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
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  const isTimedMode = difficulty === 'temporizado';
  const isTrainingMode = difficulty === 'treinamento';

  // Busca as perguntas na API quando o componente é montado
  useEffect(() => {
    const fetchQuestions = async () => {
      // No modo temporizado/treinamento, busca mais perguntas
      const limit = (isTimedMode || isTrainingMode) ? 50 : 10;
      try {
        const response = await fetch(`https://lock-api.onrender.com/quiz/questions?topic=${topic}&difficulty=${difficulty}&limit=${limit}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Falha ao buscar perguntas');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [topic, difficulty, token, isTimedMode, isTrainingMode]);

  // Lógica do cronômetro para o modo Temporizado
  useEffect(() => {
    if (isTimedMode && !quizFinished && questions.length > 0) {
      if (timeLeft <= 0) {
        setQuizFinished(true);
        return;
      }
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isTimedMode, quizFinished, timeLeft, questions]);

  // Função para ir para a próxima pergunta
  const handleNextQuestion = useCallback(() => {
    setIsAnswered(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  }, [currentQuestionIndex, questions.length]);

  // Função para lidar com a seleção de uma resposta
  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);
    const isCorrect = index === questions[currentQuestionIndex].correct_answer_index;

    if (isCorrect) {
      setScore(prev => prev + 1);
      if (isTimedMode) {
        setTimeLeft(prev => prev + 5); // Adiciona 5 segundos por resposta certa
      }
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 1500); // Espera 1.5s antes de ir para a próxima
  };
  
  // Renderização
  if (loading) return <div>Carregando...</div>;
  if (questions.length === 0) return <div>Nenhuma pergunta encontrada.</div>;

  const currentQuestion = questions[currentQuestionIndex];

  // Tela de Fim de Jogo
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

  // Tela do Jogo
  return (
    <div className="quiz-player-container">
      <HexagonBackground />
      <div className="quiz-box">
        <div className="quiz-player-header">
          <h2>{topic}: Modo {difficulty}</h2>
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
            if (isAnswered && selectedAnswer === index) {
              buttonClass += isCorrect ? ' correct' : ' incorrect';
            } else if (isAnswered && isCorrect) {
              buttonClass += ' correct';
            }

            return (
              <button key={index} className={buttonClass} onClick={() => handleAnswerSelect(index)} disabled={isAnswered}>
                {option}
                {isAnswered && selectedAnswer === index && (isCorrect ? <CheckCircle /> : <XCircle />)}
                {isAnswered && selectedAnswer !== index && isCorrect && <CheckCircle />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;
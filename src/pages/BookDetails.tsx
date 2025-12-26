import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { supabase } from '../supabase';
import PDFReader from '../components/PDFReader';
import HexagonBackground from '../components/hexagonobg';
import { Star, BookOpen, BookmarkSimple, CheckCircle } from '@phosphor-icons/react';
import './BookDetails.css'; // Vamos criar abaixo

const BookDetails: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [book, setBook] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [isReading, setIsReading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  
  // Estado para nova avaliação
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');

  useEffect(() => {
    fetchBookData();
  }, [id]);

  const fetchBookData = async () => {
    if (!id || !user) return;

    // 1. Busca livro
    const { data: bookData } = await supabase.from('books').select('*').eq('id', id).single();
    setBook(bookData);

    // 2. Busca progresso do usuário
    const { data: progressData } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('book_id', id)
        .maybeSingle(); // maybeSingle não dá erro se não existir
    
    setProgress(progressData || { current_page: 1 });

    // 3. Busca reviews
    const { data: reviewsData } = await supabase
        .from('book_reviews')
        .select('*, users(name, avatar_url)')
        .eq('book_id', id);
    setReviews(reviewsData || []);
  };

  // Salva o progresso a cada página virada
  const handleProgressUpdate = async (page: number, total: number) => {
    if (!user || !id) return;

    // Calcula se completou
    const isCompleted = page >= total;

    const { error } = await supabase.from('reading_progress').upsert({
        user_id: user.id,
        book_id: id,
        current_page: page,
        is_completed: isCompleted,
        last_read_at: new Date()
    }, { onConflict: 'user_id, book_id' });

    if (!error) {
        setProgress({ ...progress, current_page: page, is_completed: isCompleted });
    }
  };

  const handleSendReview = async () => {
      if(userRating === 0) return alert("Selecione uma nota!");
      
      const { error } = await supabase.from('book_reviews').insert({
          user_id: user?.id,
          book_id: id,
          rating: userRating,
          comment: userComment
      });

      if(!error) {
          alert("Avaliação enviada!");
          fetchBookData(); // Recarrega reviews
          setUserComment('');
          setUserRating(0);
      }
  };

  if (!book) return <div className="loading">Carregando dados da Matrix...</div>;

  // Calculo de porcentagem visual
  // Nota: Se o 'total_pages' no banco for 0, usamos 1 para evitar divisão por zero até o PDF carregar
  const totalPagesRef = book.total_pages || 100; 
  const percentage = Math.min(100, Math.round((progress.current_page / totalPagesRef) * 100));

  return (
    <div className="book-details-container">
      <HexagonBackground />
      
      <div className="book-content-wrapper">
        
        {/* Lado Esquerdo: Capa e Status */}
        <aside className="book-sidebar">
            <div className="book-cover-large">
                <img src={book.cover_url || "https://placehold.co/300x450/000/FFF?text=No+Cover"} alt={book.title} />
            </div>

            <div className="reading-status-card">
                <h3>Seu Progresso</h3>
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="progress-text">
                    <span>{percentage}% Concluído</span>
                    {progress.is_completed && <CheckCircle color="#00ff41" weight="fill" />}
                </div>
                <button 
                    className="read-btn" 
                    onClick={() => setIsReading(true)}
                >
                    {percentage > 0 ? "Continuar Leitura" : "Iniciar Leitura"}
                </button>
            </div>
        </aside>

        {/* Lado Direito: Informações ou Leitor */}
        <main className="book-main-area">
            
            {isReading ? (
                <div className="reader-mode">
                    <button className="close-reader" onClick={() => setIsReading(false)}>
                        X Fechar Leitor
                    </button>
                    <PDFReader 
                        pdfUrl={book.pdf_url} 
                        initialPage={progress.current_page}
                        onPageChange={handleProgressUpdate}
                    />
                </div>
            ) : (
                <div className="book-info-mode">
                    <h1 className="book-title">{book.title}</h1>
                    <h2 className="book-author">Por: {book.author}</h2>
                    
                    <div className="book-synopsis">
                        <h3>Sinopse</h3>
                        <p>{book.synopsis}</p>
                    </div>

                    <div className="book-reviews-section">
                        <h3>Avaliações da Comunidade</h3>
                        
                        {/* Formulário de Review */}
                        <div className="add-review-box">
                            <div className="star-rating-input">
                                {[1,2,3,4,5].map(star => (
                                    <Star 
                                        key={star} 
                                        weight={star <= userRating ? "fill" : "regular"}
                                        className="star-icon"
                                        onClick={() => setUserRating(star)}
                                    />
                                ))}
                            </div>
                            <textarea 
                                placeholder="O que você achou desta obra?"
                                value={userComment}
                                onChange={e => setUserComment(e.target.value)}
                            />
                            <button onClick={handleSendReview}>Enviar Avaliação</button>
                        </div>

                        {/* Lista de Reviews */}
                        <div className="reviews-list">
                            {reviews.map(rev => (
                                <div key={rev.id} className="review-item">
                                    <div className="review-header">
                                        <img src={rev.users?.avatar_url} alt="avatar" />
                                        <strong>{rev.users?.name}</strong>
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} weight={i < rev.rating ? "fill" : "regular"} size={14} color="#FFD700"/>
                                            ))}
                                        </div>
                                    </div>
                                    <p>"{rev.comment}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default BookDetails;
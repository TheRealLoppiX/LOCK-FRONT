import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { supabase } from '../supabase';
import PDFReader from '../components/PDFReader';
import HexagonBackground from '../components/hexagonobg';
import { Star, CheckCircle } from '@phosphor-icons/react';
import './BookDetails.css';

const BookDetails: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [book, setBook] = useState<any>(null);

  // MUDANÇA IMPORTANTE: Iniciamos com um objeto padrão para NUNCA ser null
  const [progress, setProgress] = useState<any>({ current_page: 1, is_completed: false });
  
  const [isReading, setIsReading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  
  // Estado para nova avaliação
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');

  useEffect(() => {
    fetchBookData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const fetchBookData = async () => {
    if (!id) return;

    // 1. Busca dados do livro
    const { data: bookData } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();
    
    if (bookData) setBook(bookData);

    // 2. Busca progresso do usuário (se estiver logado)
    if (user) {
        const { data: progressData } = await supabase
            .from('reading_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('book_id', id)
            .maybeSingle();
        
        // Se achou no banco, usa. Se não, mantém o padrão (página 1)
        if (progressData) {
            setProgress(progressData);
        }
    }

    // 3. Busca reviews
    const { data: reviewsData } = await supabase
        .from('book_reviews')
        .select('*, users(name, avatar_url)')
        .eq('book_id', id)
        .order('created_at', { ascending: false });
    
    setReviews(reviewsData || []);
  };

  // Salva o progresso a cada página virada
  const handleProgressUpdate = async (page: number, total: number) => {
    if (!user || !id) return;

    const isCompleted = page >= (total - 1);

    // Atualiza estado local imediatamente para feedback visual rápido
    setProgress((prev: any) => ({ 
        ...prev, 
        current_page: page, 
        is_completed: isCompleted 
    }));

    // Salva no banco em background
    await supabase.from('reading_progress').upsert({
        user_id: user.id,
        book_id: id,
        current_page: page,
        is_completed: isCompleted,
        last_read_at: new Date()
    }, { onConflict: 'user_id, book_id' });
  };

  const handleSendReview = async () => {
      if (!user) return alert("Você precisa estar logado!");
      if (userRating === 0) return alert("Selecione uma nota!");
      
      const { error } = await supabase.from('book_reviews').insert({
          user_id: user.id,
          book_id: id,
          rating: userRating,
          comment: userComment
      });

      if (!error) {
          alert("Avaliação enviada!");
          fetchBookData(); 
          setUserComment('');
          setUserRating(0);
      } else {
          alert("Erro ao enviar avaliação.");
      }
  };

  // --- RENDERIZAÇÃO ---

  if (!book) return <div className="loading">Carregando dados da Matrix...</div>;

  // Cálculos seguros (Progress nunca é null agora)
  const totalPages = book.total_pages || 100;
  // Garante que current_page existe, senão usa 1
  const currentPage = progress.current_page || 1; 
  const percentage = Math.min(100, Math.round((currentPage / totalPages) * 100));

  return (
    <div className="book-details-container">
      <HexagonBackground />
      
      <div className="book-content-wrapper">
        
        {/* Lado Esquerdo: Capa e Status */}
        <aside className="book-sidebar">
            <div className="book-cover-large">
                <img 
                    src={book.cover_url || "https://placehold.co/300x450/000/FFF?text=No+Cover"} 
                    alt={book.title} 
                />
            </div>

            <div className="reading-status-card">
                <h3>Seu Progresso</h3>
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="progress-text">
                    <span>{percentage}% Concluído</span>
                    
                    {/* AQUI ESTAVA O ERRO: Agora é seguro ler progress.is_completed */}
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
                        initialPage={currentPage}
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
                        
                        <div className="add-review-box">
                            <div className="star-rating-input">
                                {[1,2,3,4,5].map(star => (
                                    <Star 
                                        key={star} 
                                        weight={star <= userRating ? "fill" : "regular"}
                                        className="star-icon"
                                        onClick={() => setUserRating(star)}
                                        style={{cursor: 'pointer', marginRight: '5px'}}
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

                        <div className="reviews-list">
                            {reviews.length === 0 && <p>Seja o primeiro a avaliar!</p>}
                            
                            {reviews.map(rev => (
                                <div key={rev.id} className="review-item">
                                    <div className="review-header">
                                        <img 
                                            src={rev.users?.avatar_url || "https://placehold.co/50"} 
                                            alt="avatar" 
                                            style={{width: 40, height: 40, borderRadius: '50%'}}
                                        />
                                        <div>
                                            <strong>{rev.users?.name || "Usuário"}</strong>
                                            <div className="stars">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        weight={i < rev.rating ? "fill" : "regular"} 
                                                        size={14} 
                                                        color="#FFD700"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="review-comment">"{rev.comment}"</p>
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
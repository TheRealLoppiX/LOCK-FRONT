import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import './LabPage.css';

interface Comment {
  author: string;
  site: string;
  comment: string;
}

const XSSLab2: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [site, setSite] = useState('https://meusite.com');
  const [comment, setComment] = useState('');
  
  const fetchComments = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/labs/xss/2/comments`);
    const data = await response.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_API_URL}/labs/xss/2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, site, comment }),
    });
    setAuthor(''); setSite(''); setComment('');
    fetchComments();
  };

  return (
    <div className="lab-page-container">
      <HexagonBackground />
      <div className="lab-content" style={{maxWidth: '700px'}}>
        <h1>Nível 2: A Mensagem Persistente</h1>
        <p className="lab-objective">
          Este blog permite que usuários deixem comentários. O servidor salva o conteúdo do comentário sem qualquer filtro de segurança (sanitização). 
          Deixe um comentário que execute um `alert()` para qualquer um que visitar a página.
        </p>
        <div className="comment-section">
          <h3>Comentários</h3>
          {comments.map((c, i) => (
            <div key={i} className="comment-box">
              <p><strong>{c.author} diz:</strong></p>
              {/* A MÁGICA ESTÁ AQUI */}
              {/* Usamos dangerouslySetInnerHTML para simular a vulnerabilidade de forma controlada */}
              <div dangerouslySetInnerHTML={{ __html: c.comment }} />
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="lab-form">
          <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Seu Nome" />
          <input type="text" value={site} onChange={e => setSite(e.target.value)} placeholder="Seu Site" />
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Seu comentário (injete o payload aqui)" />
          <button type="submit">Postar Comentário</button>
        </form>
         <Link to="/labs/xss" className="back-link">← Voltar</Link>
      </div>
    </div>
  );
};
export default XSSLab2;
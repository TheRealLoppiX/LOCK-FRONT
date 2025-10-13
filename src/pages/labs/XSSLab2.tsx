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
  const [author, setAuthor] = useState('Carlos');
  const [site, setSite] = useState("javascript:alert('XSS Armazenado!')");
  const [comment, setComment] = useState('Ótimo post!');
  
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
    // Limpa o formulário e busca os comentários de novo
    setAuthor(''); setSite(''); setComment('');
    fetchComments();
  };

  return (
    <div className="lab-page-container">
      <HexagonBackground />
      <div className="lab-content" style={{maxWidth: '700px'}}>
        <h1>Nível 2: A Mensagem Persistente</h1>
        <p className="lab-objective">
          O campo "Site" no formulário de comentário não é sanitizado. Deixe um comentário cujo link do seu nome execute um `alert()` para qualquer um que visitar a página.
        </p>
        <div className="comment-section">
          <h3>Comentários</h3>
          {comments.map((c, i) => (
            <div key={i} className="comment-box">
              <p><strong><a href={c.site}>{c.author}</a> diz:</strong></p>
              <p>{c.comment}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="lab-form">
          <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Seu Nome" />
          <input type="text" value={site} onChange={e => setSite(e.target.value)} placeholder="Seu Site (ex: https://...)" />
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Seu comentário" />
          <button type="submit">Postar Comentário</button>
        </form>
         <Link to="/labs/xss" className="back-link">← Voltar</Link>
      </div>
    </div>
  );
};
export default XSSLab2;
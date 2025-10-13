import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import './LabPage.css';

interface Comment {
  author: string;
  site: string;
  comment: string;
}

const XSSLab3: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('Hacker');
  const [site, setSite] = useState('"><img src=x onerror="prompt(1)">');
  const [comment, setComment] = useState('Tentando bypassar o filtro...');
  
  const fetchComments = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/labs/xss/3/comments`);
    const data = await response.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_API_URL}/labs/xss/3`, {
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
        <h1>Nível 3: A Evasão de Filtros</h1>
        <p className="lab-objective">
          O sistema agora remove as palavras `alert` e a tag `script`. Encontre um vetor de ataque diferente para executar um script.
        </p>
        <div className="comment-section">
          <h3>Comentários</h3>
          {comments.map((c, i) => (
            <div key={i} className="comment-box">
              {/* A vulnerabilidade está no Href da tag A */}
              <p><strong><a href={c.site}>{c.author}</a> diz:</strong></p>
              <p>{c.comment}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="lab-form">
          <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Seu Nome" />
          <input type="text" value={site} onChange={e => setSite(e.target.value)} placeholder="Seu Site (vetor do ataque)" />
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Seu comentário" />
          <button type="submit">Postar</button>
        </form>
         <Link to="/labs/xss" className="back-link">← Voltar</Link>
      </div>
    </div>
  );
};
export default XSSLab3;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/hexagonobg';
import { useAuth } from '../../contexts/authContext';
import { markLabComplete } from '../../utils/labProgress';
import HintPanel from '../../components/labs/HintPanel';
import './LabPage.css';

const HINTS = [
  'Repare que o campo "Seu Site" vira o link (href) do seu nome nos comentários — pense em outros esquemas de URL além de http/https que um navegador aceita num atributo href.',
  'Um link com o esquema `javascript:` executaria código ao ser clicado — mas como a palavra "alert" é filtrada, use outra função que abra um popup sem essa palavra, como `confirm()` ou `prompt()`.',
];

interface Comment {
  author: string;
  site: string;
  comment: string;
}

const XSSLab3: React.FC = () => {
  const { token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [site, setSite] = useState('');
  const [comment, setComment] = useState('');
  
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
    // Nível 3 filtra "alert" e "<script>" no servidor — o vetor esperado é
    // o href da tag <a> (ex: javascript:...), então checamos por isso sem
    // depender das palavras já removidas pelo filtro.
    if (/^\s*javascript:/i.test(site) && site.trim().length > 'javascript:'.length) {
      markLabComplete(token, 'xss-3');
    }
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
        <HintPanel labTitle="Nível 3: A Evasão de Filtros" hints={HINTS} />

         <Link to="/labs/xss" className="back-link">← Voltar</Link>
      </div>
    </div>
  );
};
export default XSSLab3;
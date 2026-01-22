import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import HexagonBackground from '../../components/hexagonobg';
import { CaretLeft, CheckCircle, Warning, FolderPlus, Image } from '@phosphor-icons/react';
import './AdminModules.css';

const AdminModules: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [duration, setDuration] = useState(60);

  // Campos do Formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState(1); // 1 a 5
  const [coverUrl, setCoverUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    const payload = {
      title,
      description,
      difficulty_level: Number(difficulty),
      cover_url: coverUrl || 'https://placehold.co/600x400/1a1a1a/FFD700?text=LOCK', 
      duration_minutes: Number(duration)
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setFeedback({ type: 'success', msg: 'Módulo criado com sucesso!' });
        // Limpa o form após sucesso
        setTitle('');
        setDescription('');
        setCoverUrl('');
        setDifficulty(1);
      } else {
        const data = await response.json();
        setFeedback({ type: 'error', msg: data.message || 'Erro ao criar módulo.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', msg: 'Erro de conexão com o servidor.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <HexagonBackground />
      
      <div className="admin-content">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <CaretLeft size={20} /> Voltar ao Dashboard
        </button>

        <div style={{textAlign: 'center', marginBottom: '10px'}}>
            <FolderPlus size={48} color="#FFD700" />
        </div>
        <h1>Criar Novo Simulado</h1>
        <p className="admin-subtitle">Crie a "pasta" para agrupar questões (Ex: CompTIA, CEH).</p>

        {feedback && (
          <div className={`feedback-message ${feedback.type}`}>
            {feedback.type === 'success' ? <CheckCircle size={24} /> : <Warning size={24} />}
            <span>{feedback.msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          
          <div className="input-group">
            <label>Título do Simulado</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: Certificação CompTIA Security+" 
              required 
            />
          </div>
          <div className="input-group">
            <label>Tempo Limite (minutos)</label>
            <input 
                type="number" 
                min="5" 
                value={duration} 
                onChange={e => setDuration(Number(e.target.value))} 
                placeholder="60"
            />
          </div>
          <div className="input-group">
            <label>Descrição Curta</label>
            <textarea 
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="O que o aluno vai aprender neste simulado?"
              required
            />
          </div>

          <div className="form-row">
            <div className="input-group">
                <label>Nível de Dificuldade (1 a 5)</label>
                <input 
                    type="number" 
                    min="1" 
                    max="5" 
                    value={difficulty} 
                    onChange={e => setDifficulty(Number(e.target.value))} 
                />
            </div>

            <div className="input-group">
                <label style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                    <Image size={18} /> URL da Imagem de Capa
                </label>
                <input 
                    type="text" 
                    value={coverUrl} 
                    onChange={e => setCoverUrl(e.target.value)} 
                    placeholder="https://..." 
                />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Criando...' : 'Criar Módulo'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminModules;
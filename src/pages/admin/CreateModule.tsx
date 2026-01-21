import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import HexagonBackground from '../../components/hexagonobg';
import { CaretLeft, CheckCircle, Warning, Certificate } from '@phosphor-icons/react';
import './AdminQuestions.css'; // Reutilizando o CSS de admin

const CreateModule: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_url: '',
    difficulty_level: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback({ type: 'success', msg: 'Módulo criado com sucesso!' });
        setFormData({ title: '', description: '', cover_url: '', difficulty_level: 1 });
      } else {
        setFeedback({ type: 'error', msg: data.message || 'Erro ao criar módulo.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', msg: 'Erro de conexão.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <HexagonBackground />
      
      <div className="admin-content">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <CaretLeft size={20} /> Voltar
        </button>

        <div style={{textAlign: 'center', marginBottom: '10px'}}>
            <Certificate size={48} color="#FFD700" />
        </div>
        <h1>Criar Novo Simulado</h1>
        <p className="admin-subtitle">Adicione uma nova certificação ou pacote de provas</p>

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
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                placeholder="Ex: CompTIA Security+ SY0-601" 
            />
          </div>

          <div className="input-group">
            <label>Descrição Curta</label>
            <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={3}
                placeholder="Ex: Simulado focado em ameaças, ataques e vulnerabilidades..." 
            />
          </div>

          <div className="form-row">
            <div className="input-group">
                <label>URL da Logo/Capa</label>
                <input 
                    name="cover_url" 
                    value={formData.cover_url} 
                    onChange={handleChange} 
                    required 
                    placeholder="https://..." 
                />
            </div>
            
            <div className="input-group">
                <label>Nível de Dificuldade (1-5)</label>
                <select name="difficulty_level" value={formData.difficulty_level} onChange={handleChange}>
                    <option value="1">1 - Iniciante</option>
                    <option value="2">2 - Básico</option>
                    <option value="3">3 - Intermédio</option>
                    <option value="4">4 - Avançado</option>
                    <option value="5">5 - Expert</option>
                </select>
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

export default CreateModule;
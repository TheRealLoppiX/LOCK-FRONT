import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext'; 
import HexagonBackground from '../../components/hexagonobg';
import { CaretLeft, CheckCircle, Warning, UploadSimple } from '@phosphor-icons/react';
import './AdminQuestions.css'; // Podemos reaproveitar o CSS das questões!

const AdminMaterials: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Estados do Formulário
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    type: 'Livro',
    cover_url: '',
    pdf_url: '',
    total_pages: '',
    synopsis: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/materials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback({ type: 'success', msg: 'Material cadastrado com sucesso!' });
        // Limpar formulário
        setFormData({
            title: '', author: '', type: 'Livro', 
            cover_url: '', pdf_url: '', total_pages: '', synopsis: ''
        });
      } else {
        setFeedback({ type: 'error', msg: data.message || 'Erro ao cadastrar.' });
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
          <CaretLeft size={20} /> Voltar
        </button>

        <h1>Cadastro de Materiais</h1>
        <p className="admin-subtitle">Adicione livros e PDFs à Biblioteca</p>

        {feedback && (
          <div className={`feedback-message ${feedback.type}`}>
            {feedback.type === 'success' ? <CheckCircle size={24} /> : <Warning size={24} />}
            <span>{feedback.msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          
          <div className="input-group">
            <label>Título da Obra</label>
            <input name="title" value={formData.title} onChange={handleChange} required placeholder="Ex: Manual de Hacker Ético" />
          </div>

          <div className="form-row">
            <div className="input-group">
                <label>Autor</label>
                <input name="author" value={formData.author} onChange={handleChange} required placeholder="Ex: Mr. Robot" />
            </div>
            <div className="input-group">
                <label>Tipo de Material</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="Livro">Livro</option>
                    <option value="Artigo">Artigo</option>
                    <option value="PDF">PDF Técnico</option>
                    <option value="Apostila">Apostila</option>
                </select>
            </div>
          </div>

          <div className="form-row">
             <div className="input-group">
                <label>Link da Capa (URL)</label>
                <input name="cover_url" value={formData.cover_url} onChange={handleChange} required placeholder="https://..." />
                <small style={{color: '#8b949e', fontSize: '0.8rem'}}>Recomendado: Upload no Supabase Storage</small>
            </div>
            <div className="input-group">
                <label>Link do Arquivo PDF (URL)</label>
                <input name="pdf_url" value={formData.pdf_url} onChange={handleChange} required placeholder="https://..." />
            </div>
          </div>

          <div className="input-group" style={{maxWidth: '150px'}}>
             <label>Total de Páginas</label>
             <input type="number" name="total_pages" value={formData.total_pages} onChange={handleChange} placeholder="Ex: 150" />
          </div>

          <div className="input-group">
            <label>Sinopse / Descrição</label>
            <textarea 
              name="synopsis"
              rows={4}
              value={formData.synopsis}
              onChange={handleChange}
              placeholder="Resumo do conteúdo..."
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? <UploadSimple className="spin" /> : 'Cadastrar Material'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminMaterials;
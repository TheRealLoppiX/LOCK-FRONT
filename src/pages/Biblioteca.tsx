import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import { FilePdf, Article, Book, Link as LinkIcon, PlusCircle, CircleNotch } from '@phosphor-icons/react';
import './Biblioteca.css';

// Atualizamos a interface para ter capa
interface Material {
  id: string;
  title: string;
  description: string;
  url: string; // URL do PDF/Arquivo
  cover_url?: string; // URL da Capa (opcional)
  type: 'PDF' | 'Artigo' | 'Livro' | string;
  status: 'A seguir' | 'Lendo' | 'Parado' | 'Lido' | null;
}

const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FilePdf size={20} />;
      case 'Artigo': return <Article size={20} />;
      case 'Livro': return <Book size={20} />;
      default: return <LinkIcon size={20} />;
    }
};

// --- NOVO COMPONENTE: ITEM DA ESTANTE (Visual de Capa) ---
const BookShelfItem: React.FC<{ 
    material: Material; 
    onStatusChange: (id: string, status: string) => void; 
    onClick: (id: string) => void; 
}> = ({ material, onStatusChange, onClick }) => {
  
  return (
    <div className="book-cover-card" onClick={() => onClick(material.id)}>
        {/* Renderiza imagem ou um placeholder se não tiver capa */}
        {material.cover_url ? (
            <img src={material.cover_url} alt={material.title} className="book-cover-img" />
        ) : (
            <div className="no-cover">
                <span>{material.title}</span>
            </div>
        )}

        {/* Overlay com Nome ao passar o mouse */}
        <div className="book-info-overlay">
            <div className="book-title-mini">
                {material.title}
            </div>
        </div>

        {/* Select de Status Discreto no Canto Superior */}
        <div className="book-actions-hover" onClick={(e) => e.stopPropagation()}>
             <select 
                className="mini-select"
                value={material.status || 'none'} 
                onChange={(e) => onStatusChange(material.id, e.target.value)}
            >
                <option value="A seguir">A seguir</option>
                <option value="Lendo">Lendo</option>
                <option value="Parado">Parado</option>
                <option value="Lido">Lido</option>
             </select>
        </div>
    </div>
  );
};

// Componente principal
const Biblioteca: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/library/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Falha ao buscar dados.');
      const data = await response.json();
      setAllMaterials(data.allMaterials || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleStatusChange = async (materialId: string, status: string) => {
    // Atualização Otimista
    const originalMaterials = [...allMaterials];
    setAllMaterials(prev => prev.map(m => m.id === materialId ? { ...m, status: status as any } : m));

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/library/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ materialId, status }),
      });
    } catch (err) {
      setAllMaterials(originalMaterials); // Reverte em caso de erro
      alert('Erro ao atualizar status.');
    }
  };

  const handleMaterialClick = (id: string) => {
     // Redireciona para a página de detalhes que criamos anteriormente
     navigate(`/biblioteca/${id}`);
  };

  // --- LÓGICA DE ORDENAÇÃO E FILTRO ---
  const estantes = useMemo(() => {
    // 1. Ordena tudo alfabeticamente primeiro
    const sorted = [...allMaterials].sort((a, b) => a.title.localeCompare(b.title));

    // 2. Separa por status
    return {
      aSeguir: sorted.filter(m => m.status === 'A seguir'),
      lendo: sorted.filter(m => m.status === 'Lendo'),
      parado: sorted.filter(m => m.status === 'Parado'),
      lido: sorted.filter(m => m.status === 'Lido'),
      // Itens sem status vão apenas para o "Explorar"
    };
  }, [allMaterials]);

  if (loading) return <div className="loading-container"><CircleNotch size={40} className="spin"/></div>;
  if (error) return <div className="error-msg">Erro: {error}</div>;

  return (
    <div className="biblioteca-container">
      <HexagonBackground />
      <div className="biblioteca-content">
        <header className="biblioteca-header">
          <h1>BIBLIOTECA</h1>
          <p>Organize sua coleção e acompanhe seu progresso.</p>
        </header>

        <div className="biblioteca-layout">
          
          {/* COLUNA ESQUERDA: LISTA SIMPLES PARA EXPLORAR/ADICIONAR */}
          <aside className="coluna-explorar">
            <h2>Explorar Acervo</h2>
            <div className="lista-explorar">
              {allMaterials.map(material => (
                <div key={material.id} className="explorar-item">
                  <div className="explorar-item-info">
                    <span className="icon-type">{getIcon(material.type)}</span>
                    <span onClick={() => handleMaterialClick(material.id)} style={{cursor: 'pointer'}}>
                      {material.title}
                    </span>
                  </div>
                  {/* Só mostra botão de adicionar se não tiver status ainda */}
                  {!material.status && (
                    <button 
                        className="add-button" 
                        title="Adicionar à estante"
                        onClick={() => handleStatusChange(material.id, 'A seguir')}
                    >
                        <PlusCircle size={22} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* COLUNA DIREITA: AS ESTANTES VISUAIS */}
          <main className="coluna-estantes">
            
            {/* LENDO AGORA (Destaque) */}
            <section className="estante-section">
              <h2>📖 Lendo Atualmente</h2>
              <div className="shelf-grid">
                {estantes.lendo.length > 0 ? (
                    estantes.lendo.map(m => (
                        <BookShelfItem 
                            key={m.id} 
                            material={m} 
                            onStatusChange={handleStatusChange} 
                            onClick={handleMaterialClick}
                        />
                    ))
                ) : (
                    <p className="empty-msg">Nenhum livro em leitura no momento.</p>
                )}
              </div>
            </section>

            {/* A SEGUIR */}
            <section className="estante-section">
              <h2>⏳ A Seguir</h2>
              <div className="shelf-grid">
                {estantes.aSeguir.length > 0 ? (
                    estantes.aSeguir.map(m => (
                        <BookShelfItem 
                            key={m.id} 
                            material={m} 
                            onStatusChange={handleStatusChange} 
                            onClick={handleMaterialClick} 
                        />
                    ))
                ) : <p className="empty-msg">Sua lista de espera está vazia.</p>}
              </div>
            </section>

            {/* LIDOS E PARADOS (Menor prioridade visual? Mesma grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <section className="estante-section">
                <h2>✅ Lidos</h2>
                <div className="shelf-grid">
                    {estantes.lido.map(m => (
                        <BookShelfItem key={m.id} material={m} onStatusChange={handleStatusChange} onClick={handleMaterialClick} />
                    ))}
                </div>
                </section>

                <section className="estante-section">
                <h2>⏸️ Parados</h2>
                <div className="shelf-grid">
                    {estantes.parado.map(m => (
                        <BookShelfItem key={m.id} material={m} onStatusChange={handleStatusChange} onClick={handleMaterialClick} />
                    ))}
                </div>
                </section>
            </div>

          </main>
        </div>
        
        <Link to="/dashboard" className="back-link" style={{display: 'inline-block', marginTop: '20px'}}>
            ← Voltar para Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Biblioteca;
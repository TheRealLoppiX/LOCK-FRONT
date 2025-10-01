import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import { FilePdf, Article, Book, Link as LinkIcon, CaretDown, PlusCircle } from '@phosphor-icons/react';
import './Biblioteca.css';

// Define a estrutura de um Material de estudo
interface Material {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'PDF' | 'Artigo' | 'Livro' | string;
  status: 'A seguir' | 'Lendo' | 'Parado' | 'Lido' | null;
}

// Função auxiliar para pegar o ícone correto
const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FilePdf size={24} />;
      case 'Artigo': return <Article size={24} />;
      case 'Livro': return <Book size={24} />;
      default: return <LinkIcon size={24} />;
    }
};

// Componente para um card de material individual (usado na coluna da direita)
const MaterialCard: React.FC<{ material: Material; onStatusChange: (id: string, status: string) => void; onMaterialClick: (id: string) => void; }> = ({ material, onStatusChange, onMaterialClick }) => {
  return (
    <div className="material-card">
      <a href={material.url} target="_blank" rel="noopener noreferrer" className="material-link-main" onClick={() => onMaterialClick(material.id)}>
        <div className="material-icon">{getIcon(material.type)}</div>
        <div className="material-info">
          <span className="material-tipo">{material.type}</span>
          <h2>{material.title}</h2>
          <p>{material.description}</p>
        </div>
      </a>
      <div className="material-status-changer">
        <select value={material.status || 'none'} onChange={(e) => onStatusChange(material.id, e.target.value)}>
          <option value="none" disabled>Mover para...</option>
          <option value="A seguir">A seguir</option>
          <option value="Lendo">Lendo</option>
          <option value="Parado">Parado</option>
          <option value="Lido">Lido</option>
        </select>
        <CaretDown className="select-caret" />
      </div>
    </div>
  );
};

// Componente principal da Biblioteca
const Biblioteca: React.FC = () => {
  const { token } = useAuth();
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [lastAccessed, setLastAccessed] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar os dados da API
  const fetchData = async () => {
    if (!token) {
      setError("Autenticação necessária.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/library/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Falha ao buscar dados da biblioteca.');
      const data = await response.json();
      
      const lastAccessedMaterial = data.allMaterials.find((m: Material) => m.id === data.lastAccessedId) || null;
      setLastAccessed(lastAccessedMaterial);
      setAllMaterials(data.allMaterials);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Função para mudar o status de um material
  const handleStatusChange = async (materialId: string, status: string) => {
    const originalMaterials = [...allMaterials];
    const updatedMaterials = allMaterials.map(m => m.id === materialId ? { ...m, status: status as Material['status'] } : m);
    setAllMaterials(updatedMaterials);

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
      setAllMaterials(originalMaterials);
      alert('Falha ao atualizar o status. Tente novamente.');
    }
  };
  
  // Função para salvar o último material clicado
  const handleMaterialClick = async (materialId: string) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/library/last-accessed/${materialId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Falha ao salvar último acesso.');
    }
  };

  // Separa os materiais em listas para cada estante
  const estantes = useMemo(() => {
    // CORRIGIDO: "A seguir" agora só inclui itens explicitamente adicionados.
    const aSeguir = allMaterials.filter(m => m.status === 'A seguir');
    const lendo = allMaterials.filter(m => m.status === 'Lendo');
    const parado = allMaterials.filter(m => m.status === 'Parado');
    const lido = allMaterials.filter(m => m.status === 'Lido');
    return { aSeguir, lendo, parado, lido };
  }, [allMaterials]);

  if (loading) return <div>Carregando biblioteca...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="biblioteca-container">
      <HexagonBackground />
      <div className="biblioteca-content">
        <header className="biblioteca-header">
          <h1>Biblioteca de Materiais</h1>
          <p>Explore os conteúdos e organize seus estudos.</p>
        </header>

        {/* NOVA ESTRUTURA DE LAYOUT EM DUAS COLUNAS */}
        <div className="biblioteca-layout">
          
          {/* --- COLUNA DA ESQUERDA: EXPLORAR --- */}
          <aside className="coluna-explorar">
            <h2>Explorar Conteúdos</h2>
            <div className="lista-explorar">
              {allMaterials.map(material => (
                <div key={material.id} className="explorar-item">
                  <div className="explorar-item-info">
                    <span className="explorar-item-icon">{getIcon(material.type)}</span>
                    <a href={material.url} target="_blank" rel="noopener noreferrer" onClick={() => handleMaterialClick(material.id)}>
                      {material.title}
                    </a>
                  </div>
                  <button 
                    className="add-button" 
                    title="Adicionar à lista 'A Seguir'"
                    onClick={() => handleStatusChange(material.id, 'A seguir')}
                  >
                    <PlusCircle size={20} />
                  </button>
                </div>
              ))}
            </div>
          </aside>

          {/* --- COLUNA DA DIREITA: MINHAS ESTANTES --- */}
          <main className="coluna-estantes">
            {/* Seção "Continue Estudando" */}
            {lastAccessed && (
              <section className="estante-section continue-estudando">
                <h2>Continue Estudando</h2>
                <div className="materiais-grid">
                  <MaterialCard material={lastAccessed} onStatusChange={handleStatusChange} onMaterialClick={handleMaterialClick} />
                </div>
              </section>
            )}

            {/* Estantes Pessoais */}
            <section className="estante-section">
              <h2>A Seguir ({estantes.aSeguir.length})</h2>
              <div className="materiais-grid">
                {estantes.aSeguir.length > 0 ? 
                  estantes.aSeguir.map(m => <MaterialCard key={m.id} material={m} onStatusChange={handleStatusChange} onMaterialClick={handleMaterialClick} />) :
                  <p className="estante-vazia">Adicione materiais da lista "Explorar" para começar.</p>
                }
              </div>
            </section>

            <section className="estante-section">
              <h2>Lendo ({estantes.lendo.length})</h2>
              <div className="materiais-grid">
                {estantes.lendo.length > 0 ?
                  estantes.lendo.map(m => <MaterialCard key={m.id} material={m} onStatusChange={handleStatusChange} onMaterialClick={handleMaterialClick} />) :
                  <p className="estante-vazia">Mova um item para cá para marcá-lo como "Lendo".</p>
                }
              </div>
            </section>
            
            <section className="estante-section">
              <h2>Parado ({estantes.parado.length})</h2>
              <div className="materiais-grid">
                {estantes.parado.length > 0 ?
                  estantes.parado.map(m => <MaterialCard key={m.id} material={m} onStatusChange={handleStatusChange} onMaterialClick={handleMaterialClick} />) :
                  <p className="estante-vazia">Mova um item para cá se tiver dado uma pausa.</p>
                }
              </div>
            </section>

            <section className="estante-section">
              <h2>Lido ({estantes.lido.length})</h2>
              <div className="materiais-grid">
                {estantes.lido.length > 0 ?
                  estantes.lido.map(m => <MaterialCard key={m.id} material={m} onStatusChange={handleStatusChange} onMaterialClick={handleMaterialClick} />) :
                  <p className="estante-vazia">Parabéns! Mova um item para cá após concluí-lo.</p>
                }
              </div>
            </section>

          </main>
        </div>
        
        <Link to="/dashboard" className="back-link">← Voltar para a Dashboard</Link>
      </div>
    </div>
  );
};

export default Biblioteca;
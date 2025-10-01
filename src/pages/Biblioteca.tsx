import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import { FilePdf, Article, Book, Link as LinkIcon, CaretDown } from '@phosphor-icons/react';
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

// Componente para um card de material individual
const MaterialCard: React.FC<{ material: Material; onStatusChange: (id: string, status: string) => void; onMaterialClick: (id: string) => void; }> = ({ material, onStatusChange, onMaterialClick }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FilePdf size={32} />;
      case 'Artigo': return <Article size={32} />;
      case 'Livro': return <Book size={32} />;
      default: return <LinkIcon size={32} />;
    }
  };

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
    // Atualização Otimista: muda na tela primeiro
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
      // Se der erro, reverte para o estado original
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
    const aSeguir = allMaterials.filter(m => m.status === 'A seguir' || m.status === null);
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
          <p>Organize seus estudos e continue de onde parou.</p>
        </header>

        {/* Seção "Continue Estudando" */}
        {lastAccessed && (
          <section className="estante-section continue-estudando">
            <h2>Continue Estudando</h2>
            <div className="materiais-grid-single">
              <MaterialCard material={lastAccessed} onStatusChange={handleStatusChange} onMaterialClick={handleMaterialClick} />
            </div>
          </section>
        )}

        {/* Estantes de Livros */}
        <section className="estante-section">
          <h2>A Seguir ({estantes.aSeguir.length})</h2>
          <div className="materiais-grid">
            {estantes.aSeguir.map(m => <MaterialCard key={m.id} material={m} onStatusChange={handleStatusChange} onMaterialClick={handleMaterialClick} />)}
          </div>
        </section>

        <section className="estante-section">
          <h2>Lendo ({estantes.lendo.length})</h2>
          <div className="materiais-grid">
            {estantes.lendo.map(m => <MaterialCard key={m.id} material={m} onStatusChange={handleStatusChange} onMaterialClick={handleMaterialClick} />)}
          </div>
        </section>

        <section className="estante-section">
          <h2>Parado ({estantes.parado.length})</h2>
          <div className="materiais-grid">
            {estantes.parado.map(m => <MaterialCard key={m.id} material={m} onStatusChange={handleStatusChange} onMaterialClick={handleMaterialClick} />)}
          </div>
        </section>
        
        <section className="estante-section">
          <h2>Lido ({estantes.lido.length})</h2>
          <div className="materiais-grid">
            {estantes.lido.map(m => <MaterialCard key={m.id} material={m} onStatusChange={handleStatusChange} onMaterialClick={handleMaterialClick} />)}
          </div>
        </section>

        <Link to="/dashboard" className="back-link">← Voltar para a Dashboard</Link>
      </div>
    </div>
  );
};

export default Biblioteca;
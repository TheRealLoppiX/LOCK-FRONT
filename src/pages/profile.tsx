import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import './profile.css';

const Profile: React.FC = () => {
  const { user, token, setUser } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState<'name' | 'photo' | null>(null);
  
  const [newName, setNewName] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setNewName(user?.name || '');
      setNewPhotoUrl(user?.avatar_url || '');
    }
  }, [isModalOpen, user]);
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditField(null);
  };

  const handleUpdate = async () => {
    setIsLoading(true);

    const dataToUpdate: { name?: string; avatar_url?: string } = {};
    if (editField === 'name') dataToUpdate.name = newName;
    if (editField === 'photo') dataToUpdate.avatar_url = newPhotoUrl;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToUpdate)
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar o perfil.');
      }

      const result = await response.json();
      
      setUser(result.user);
      
      alert('Perfil atualizado com sucesso!');
      handleCloseModal();

    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao atualizar o perfil. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para renderizar o conteúdo do modal
  const renderModalContent = () => {
    if (!editField) {
      return (
        <>
          <h3>O que você deseja editar?</h3>
          <div className="modal-options">
            <button onClick={() => setEditField('name')}>Nome</button>
            <button onClick={() => setEditField('photo')}>Foto</button>
          </div>
        </>
      );
    }

    if (editField === 'name') {
      return (
        <>
          <h3>Insira seu novo nome</h3>
          <input 
            type="text" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
            placeholder="Novo nome de usuário" 
          />
          <button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Nome'}
          </button>
        </>
      );
    }
    
    if (editField === 'photo') {
      return (
        <>
          <h3>Insira o link da sua nova foto</h3>
          <input 
            type="text" 
            value={newPhotoUrl} 
            onChange={(e) => setNewPhotoUrl(e.target.value)} 
            placeholder="https://exemplo.com/imagem.png"
          />
          <button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Foto'}
          </button>
        </>
      );
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img 
          src={user?.avatar_url || 'caminho/para/avatar-padrao.png'} 
          alt={`Foto de ${user?.name}`} 
          className="profile-picture" 
        />
        <h1 className="profile-name">{user?.name}</h1>
        <p className="profile-email">{user?.email}</p>

        <div className="profile-actions">
          <button className="edit-profile-btn" onClick={handleOpenModal}>
            Editar Perfil
          </button>
          <Link to="/dashboard" className="back-to-dashboard">
            Voltar para a Dashboard
          </Link>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
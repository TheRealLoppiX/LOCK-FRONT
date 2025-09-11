import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import './profile.css'; // Usaremos um novo CSS para esta página

const Profile: React.FC = () => {
  const { user } = useAuth();
  
  // Estados para controlar os modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState<'name' | 'photo' | null>(null);
  
  // Estados para guardar os novos valores
  const [newName, setNewName] = useState(user?.name || '');
  const [newPhotoUrl, setNewPhotoUrl] = useState(user?.avatar_url || '');
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditField(null); // Reseta o campo de edição ao fechar
  };

  const handleUpdate = () => {
    // AQUI VIRÁ A LÓGICA PARA CHAMAR A API
    console.log("Salvar alterações:", { newName, newPhotoUrl });
    alert("Funcionalidade de salvar ainda não implementada.");
    handleCloseModal();
  };

  const renderModalContent = () => {
    // Se nenhum campo foi escolhido, mostra as opções
    if (!editField) {
      return (
        <>
          <h3>O que você quer editar?</h3>
          <div className="modal-options">
            <button onClick={() => setEditField('name')}>Nome</button>
            <button onClick={() => setEditField('photo')}>Foto</button>
          </div>
        </>
      );
    }

    // Se escolheu 'name', mostra o input de nome
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
          <button onClick={handleUpdate}>Salvar Nome</button>
        </>
      );
    }
    
    // Se escolheu 'photo', mostra o input de foto
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
          <button onClick={handleUpdate}>Salvar Foto</button>
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

      {/* O Modal (só aparece quando isModalOpen é true) */}
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
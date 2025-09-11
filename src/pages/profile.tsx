import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import '../css/profile.css'; 
import defaultAvatar from '../assets/default-avatar.png';

const Profile: React.FC = () => {
  const { user } = useAuth();

  const avatarUrl = user?.avatar_url?.includes('dicebear.com') 
    ? `${user.avatar_url}?seed=${user.name}` 
    : user?.avatar_url;

  if (!user) {
    return (
      <div className="profile-page">
        <p>Carregando perfil...</p>
        <Link to="/login">Faça login para ver seu perfil.</Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <HexagonBackground />
      <div className="profile-card">
        <img 
          src={avatarUrl || defaultAvatar} 
          alt={`Foto de perfil de ${user.name}`} 
          className="profile-pic" 
        />
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-email">{user.email}</p>
        <button className="edit-profile-btn">Editar Perfil</button>
        <Link to="/dashboard" className="back-link">← Voltar para a Dashboard</Link>
      </div>
    </div>
  );
};

export default Profile;
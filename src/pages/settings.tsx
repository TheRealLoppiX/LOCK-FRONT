import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/authContext';
import { useToast } from '../contexts/toastContext';
import ConfirmDialog from '../components/ConfirmDialog';
import './settings.css';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { token, logout } = useAuth();
  const { showToast } = useToast();
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3333';

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const resetPasswordForm = () => {
    setShowPasswordForm(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      showToast({ type: 'error', message: 'A nova senha precisa ter pelo menos 6 caracteres.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast({ type: 'error', message: 'A confirmação não bate com a nova senha.' });
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch(`${apiBaseUrl}/profile/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast({ type: 'error', message: data.message || 'Não foi possível alterar a senha.' });
        return;
      }
      showToast({ type: 'success', message: 'Senha alterada com sucesso!' });
      resetPasswordForm();
    } catch {
      showToast({ type: 'error', message: 'Erro de conexão com o servidor.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/profile`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast({ type: 'error', message: data.message || 'Não foi possível excluir a conta.' });
        setShowDeleteConfirm(false);
        return;
      }
      showToast({ type: 'success', message: 'Conta excluída. Sentiremos sua falta!' });
      logout();
    } catch {
      showToast({ type: 'error', message: 'Erro de conexão com o servidor.' });
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>Configurações</h1>

        <div className="settings-section">
          <h2>Preferências</h2>
          <div className="settings-option">
            <label htmlFor="theme-toggle">
              Tema {theme === 'dark' ? 'Escuro' : 'Claro'}
            </label>
            <button onClick={toggleTheme} className="theme-toggle-btn">
              Mudar para {theme === 'dark' ? 'Claro' : 'Escuro'}
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>Conta</h2>

          <div className="settings-option">
            <p>Alterar Senha</p>
            {!showPasswordForm && (
              <button className="settings-btn" onClick={() => setShowPasswordForm(true)}>
                Alterar
              </button>
            )}
          </div>
          {showPasswordForm && (
            <form
              className="settings-inline-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleChangePassword();
              }}
            >
              <input
                type="password"
                placeholder="Senha atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <input
                type="password"
                placeholder="Nova senha (mín. 6 caracteres)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
              <input
                type="password"
                placeholder="Confirmar nova senha"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
              <div className="settings-inline-form-actions">
                <button type="button" className="settings-btn" onClick={resetPasswordForm} disabled={passwordSaving}>
                  Cancelar
                </button>
                <button type="submit" className="settings-btn" disabled={passwordSaving}>
                  {passwordSaving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          )}

          <div className="settings-option">
            <p>Deletar Conta</p>
            {!showDeleteForm && (
              <button className="settings-btn danger" onClick={() => setShowDeleteForm(true)}>
                Deletar
              </button>
            )}
          </div>
          {showDeleteForm && (
            <form
              className="settings-inline-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!deletePassword) {
                  showToast({ type: 'error', message: 'Digite sua senha para continuar.' });
                  return;
                }
                setShowDeleteConfirm(true);
              }}
            >
              <p className="settings-inline-form-warning">
                Essa ação é irreversível: todo o seu progresso (biblioteca, laboratórios, quizzes, simulados) será apagado. Digite sua senha para continuar.
              </p>
              <input
                type="password"
                placeholder="Sua senha"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <div className="settings-inline-form-actions">
                <button
                  type="button"
                  className="settings-btn"
                  onClick={() => {
                    setShowDeleteForm(false);
                    setDeletePassword('');
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="settings-btn danger">
                  Continuar
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Excluir conta permanentemente?"
        message="Essa ação não pode ser desfeita. Sua conta e todo o seu progresso na plataforma serão apagados para sempre."
        confirmLabel={deleting ? 'Excluindo...' : 'Excluir permanentemente'}
        cancelLabel="Cancelar"
        danger
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default Settings;

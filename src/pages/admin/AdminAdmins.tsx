import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import HexagonBackground from '../../components/hexagonobg';
import { CaretLeft, CheckCircle, Warning, PencilSimple, Trash, ArrowsClockwise, Check, X } from '@phosphor-icons/react';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../contexts/toastContext';
import './AdminQuestions.css';
import './AdminAdmins.css';

interface AdminRow {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

interface InviteRow {
  id: string;
  name: string;
  email: string;
  invited_by_name: string;
  expires_at: string;
  created_at: string;
}

// Gerenciamento de administradores: convite por e-mail (a conta só é criada
// quando o convidado ativa com o código — ver ActivateAdmin.tsx), renomear,
// e remover o acesso (nunca apaga a conta, só desliga is_admin no LOCK-API).
const AdminAdmins: React.FC = () => {
  const { token, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [savingName, setSavingName] = useState(false);

  const [removeTarget, setRemoveTarget] = useState<AdminRow | null>(null);
  const [cancelTarget, setCancelTarget] = useState<InviteRow | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const fetchAdmins = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch(`${apiUrl}/admin/admins`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAdmins(data.admins || []);
      setInvites(data.invites || []);
    } catch {
      showToast({ message: 'Não foi possível carregar os administradores.', actionLabel: 'Tentar novamente', onAction: () => fetchAdmins() });
    } finally {
      setLoadingList(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, apiUrl]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setFeedback(null);
    try {
      const res = await fetch(`${apiUrl}/admin/admins/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao enviar convite.');
      setFeedback({ type: 'success', msg: `Convite enviado para ${email}.` });
      setName('');
      setEmail('');
      fetchAdmins();
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.message || 'Erro ao enviar convite.' });
    } finally {
      setInviting(false);
    }
  };

  const startEdit = (admin: AdminRow) => {
    setEditingId(admin.id);
    setEditingName(admin.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = async (id: string) => {
    if (editingName.trim().length < 3) {
      showToast({ type: 'error', message: 'O nome precisa ter pelo menos 3 caracteres.' });
      return;
    }
    setSavingName(true);
    try {
      const res = await fetch(`${apiUrl}/admin/admins/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editingName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao renomear.');
      setAdmins((prev) => prev.map((a) => (a.id === id ? data.admin : a)));
      showToast({ type: 'success', message: 'Nome atualizado.' });
      cancelEdit();
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Erro ao renomear.' });
    } finally {
      setSavingName(false);
    }
  };

  const confirmRemove = async () => {
    if (!removeTarget) return;
    const target = removeTarget;
    setRemoveTarget(null);
    try {
      const res = await fetch(`${apiUrl}/admin/admins/${target.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao remover administrador.');
      setAdmins((prev) => prev.filter((a) => a.id !== target.id));
      showToast({ type: 'success', message: 'Acesso de administrador removido.' });
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Erro ao remover administrador.' });
    }
  };

  const handleResend = async (invite: InviteRow) => {
    setResendingId(invite.id);
    try {
      const res = await fetch(`${apiUrl}/admin/admins/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: invite.name, email: invite.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao reenviar convite.');
      showToast({ type: 'success', message: `Convite reenviado para ${invite.email}.` });
      fetchAdmins();
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Erro ao reenviar convite.' });
    } finally {
      setResendingId(null);
    }
  };

  const confirmCancelInvite = async () => {
    if (!cancelTarget) return;
    const target = cancelTarget;
    setCancelTarget(null);
    try {
      const res = await fetch(`${apiUrl}/admin/admins/invites/${target.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setInvites((prev) => prev.filter((i) => i.id !== target.id));
      showToast({ type: 'success', message: 'Convite cancelado.' });
    } catch {
      showToast({ type: 'error', message: 'Erro ao cancelar convite.' });
    }
  };

  return (
    <div className="admin-page-container">
      <HexagonBackground />

      <div className="admin-content">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <CaretLeft size={20} /> Voltar
        </button>

        <h1>Gerenciar Administradores</h1>
        <p className="admin-subtitle">Convide, edite ou remova o acesso de administradores</p>

        {feedback && (
          <div className={`feedback-message ${feedback.type}`}>
            {feedback.type === 'success' ? <CheckCircle size={24} /> : <Warning size={24} />}
            <span>{feedback.msg}</span>
          </div>
        )}

        <form onSubmit={handleInvite} className="admin-form">
          <div className="form-row">
            <div className="input-group">
              <label>Nome do convidado</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nome completo" />
            </div>
            <div className="input-group">
              <label>E-mail do convidado</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@exemplo.com" />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={inviting}>
            {inviting ? 'Enviando convite...' : 'Convidar administrador'}
          </button>
        </form>

        <div className="admin-admins-section">
          <h2>Administradores atuais</h2>
          {loadingList ? (
            <p className="admin-admins-empty">Carregando...</p>
          ) : admins.length === 0 ? (
            <p className="admin-admins-empty">Nenhum administrador encontrado.</p>
          ) : (
            <ul className="admin-admins-list">
              {admins.map((admin) => (
                <li key={admin.id} className="admin-admins-row">
                  {editingId === admin.id ? (
                    <>
                      <input
                        className="admin-admins-edit-input"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                      />
                      <div className="admin-admins-row-actions">
                        <button type="button" onClick={() => saveEdit(admin.id)} disabled={savingName} title="Salvar">
                          <Check size={16} />
                        </button>
                        <button type="button" className="discard" onClick={cancelEdit} disabled={savingName} title="Cancelar">
                          <X size={16} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="admin-admins-info">
                        <span className="admin-admins-name">
                          {admin.name}{admin.id === currentUser?.id ? ' (você)' : ''}
                        </span>
                        <span className="admin-admins-email">{admin.email}</span>
                      </div>
                      <div className="admin-admins-row-actions">
                        <button type="button" onClick={() => startEdit(admin)} title="Renomear">
                          <PencilSimple size={16} />
                        </button>
                        <button type="button" className="danger" onClick={() => setRemoveTarget(admin)} title="Remover admin">
                          <Trash size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="admin-admins-section">
          <h2>Convites pendentes</h2>
          {!loadingList && invites.length === 0 ? (
            <p className="admin-admins-empty">Nenhum convite pendente.</p>
          ) : (
            <ul className="admin-admins-list">
              {invites.map((invite) => (
                <li key={invite.id} className="admin-admins-row">
                  <div className="admin-admins-info">
                    <span className="admin-admins-name">{invite.name}</span>
                    <span className="admin-admins-email">
                      {invite.email} · convidado por {invite.invited_by_name} · expira em{' '}
                      {new Date(invite.expires_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="admin-admins-row-actions">
                    <button type="button" onClick={() => handleResend(invite)} disabled={resendingId === invite.id} title="Reenviar convite">
                      <ArrowsClockwise size={16} className={resendingId === invite.id ? 'spin-icon' : ''} />
                    </button>
                    <button type="button" className="danger" onClick={() => setCancelTarget(invite)} title="Cancelar convite">
                      <Trash size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!removeTarget}
        title="Remover administrador?"
        message={`Tem certeza que deseja remover o acesso de administrador de ${removeTarget?.name}? A conta continua existindo como uma conta comum, só o acesso ao painel é removido.`}
        confirmLabel="Remover"
        danger
        onConfirm={confirmRemove}
        onCancel={() => setRemoveTarget(null)}
      />

      <ConfirmDialog
        isOpen={!!cancelTarget}
        title="Cancelar convite?"
        message={`Tem certeza que deseja cancelar o convite enviado para ${cancelTarget?.email}?`}
        confirmLabel="Cancelar convite"
        danger
        onConfirm={confirmCancelInvite}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
};

export default AdminAdmins;

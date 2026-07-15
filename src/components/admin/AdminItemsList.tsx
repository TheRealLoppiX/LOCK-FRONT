import React, { useState } from 'react';
import { CircleNotch, Trash } from '@phosphor-icons/react';
import ConfirmDialog from '../ConfirmDialog';
import { useToast } from '../../contexts/toastContext';
import './AdminItemsList.css';

export interface AdminListItem {
  id: string;
  primary: string;
  secondary?: string;
}

interface AdminItemsListProps {
  title: string;
  items: AdminListItem[];
  loading: boolean;
  emptyMessage?: string;
  deleteUrl: (id: string) => string;
  itemLabelSingular?: string;
  itemLabelPlural?: string;
  onDeleted: (deletedIds: string[]) => void;
  token: string | null;
}

// Lista genérica com seleção múltipla + exclusão em lote, reaproveitada nas
// 3 páginas de admin (questões, materiais, simulados) — nenhuma delas tinha
// uma listagem dos itens já cadastrados, só o formulário de criação.
const AdminItemsList: React.FC<AdminItemsListProps> = ({
  title,
  items,
  loading,
  emptyMessage = 'Nenhum item cadastrado ainda.',
  deleteUrl,
  itemLabelSingular = 'item',
  itemLabelPlural = 'itens',
  onDeleted,
  token,
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) => (prev.size === items.length ? new Set() : new Set(items.map((i) => i.id))));
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    setDeleting(true);
    const ids = Array.from(selected);
    const results = await Promise.allSettled(
      ids.map((id) =>
        fetch(deleteUrl(id), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          if (!res.ok) throw new Error(id);
          return id;
        })
      )
    );

    const succeeded = results
      .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
      .map((r) => r.value);
    const failedCount = results.length - succeeded.length;

    setDeleting(false);
    setSelected(new Set());
    onDeleted(succeeded);

    if (failedCount > 0) {
      showToast({
        type: 'error',
        message:
          succeeded.length > 0
            ? `${succeeded.length} ${succeeded.length === 1 ? itemLabelSingular : itemLabelPlural} excluído(s), mas ${failedCount} falharam.`
            : `Não foi possível excluir. Verifique se não há dados vinculados.`,
      });
    } else if (succeeded.length > 0) {
      showToast({
        type: 'success',
        message: `${succeeded.length} ${succeeded.length === 1 ? itemLabelSingular : itemLabelPlural} excluído(s) com sucesso.`,
      });
    }
  };

  return (
    <div className="admin-items-list">
      <div className="admin-items-list-header">
        <h2>{title}</h2>
        {selected.size > 0 && (
          <button
            type="button"
            className="admin-bulk-delete-btn"
            disabled={deleting}
            onClick={() => setConfirmOpen(true)}
          >
            {deleting ? <CircleNotch size={16} className="spin-icon" /> : <Trash size={16} />}
            Excluir selecionados ({selected.size})
          </button>
        )}
      </div>

      {loading ? (
        <div className="admin-items-list-loading">
          <CircleNotch size={24} className="spin-icon" />
        </div>
      ) : items.length === 0 ? (
        <p className="admin-items-list-empty">{emptyMessage}</p>
      ) : (
        <>
          <label className="admin-items-select-all">
            <input
              type="checkbox"
              checked={selected.size === items.length && items.length > 0}
              onChange={toggleAll}
            />
            Selecionar todos ({items.length})
          </label>
          <ul className="admin-items-list-ul">
            {items.map((item) => (
              <li key={item.id} className={selected.has(item.id) ? 'selected' : ''}>
                <label>
                  <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggle(item.id)} />
                  <div className="admin-item-text">
                    <span className="admin-item-primary">{item.primary}</span>
                    {item.secondary && <span className="admin-item-secondary">{item.secondary}</span>}
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        title={`Excluir ${selected.size === 1 ? itemLabelSingular : itemLabelPlural}?`}
        message={`Tem certeza que deseja excluir ${selected.size} ${selected.size === 1 ? itemLabelSingular : itemLabelPlural}? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default AdminItemsList;

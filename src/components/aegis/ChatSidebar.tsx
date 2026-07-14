import React from 'react';
import { Plus, Trash } from '@phosphor-icons/react';
import './ChatSidebar.css';

export interface AegisConversationSummary {
  id: string;
  title: string;
  createdAt: number;
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `${minutes}min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'ontem';
  if (days < 7) return `${days} dias`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 semana';
  return `${weeks} semanas`;
}

interface ChatSidebarProps {
  conversations: AegisConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ conversations, activeId, onSelect, onNewChat, onDelete }) => {
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Excluir esta conversa? Essa ação não pode ser desfeita.')) {
      onDelete(id);
    }
  };

  return (
    <aside className="chat-sidebar">
      <button className="chat-new-btn" onClick={onNewChat}>
        <Plus weight="bold" /> Novo Chat
      </button>

      <div className="chat-history">
        <span className="chat-history-label">Histórico</span>
        {conversations.length === 0 && (
          <p className="chat-history-empty">Nenhuma conversa ainda.</p>
        )}
        {conversations.map((c) => (
          <button
            key={c.id}
            className={`chat-history-item ${c.id === activeId ? 'active' : ''}`}
            onClick={() => onSelect(c.id)}
          >
            <span className="chat-history-title">{c.title}</span>
            <span className="chat-history-time">{formatRelativeTime(c.createdAt)}</span>
            <span
              className="chat-history-delete"
              role="button"
              aria-label="Excluir conversa"
              title="Excluir conversa"
              onClick={(e) => handleDelete(e, c.id)}
            >
              <Trash size={14} />
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default ChatSidebar;

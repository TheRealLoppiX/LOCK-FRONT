import React, { useCallback, useMemo, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import ChatSidebar from '../components/aegis/ChatSidebar';
import ChatPanel, { AegisMessage, PendingAttachment } from '../components/aegis/ChatPanel';
import './ChatPage.css';

interface AegisConversation {
  id: string;
  title: string;
  createdAt: number;
  messages: AegisMessage[];
}

const CONVERSATIONS_KEY = 'lock-aegis-conversations';
const ACTIVE_ID_KEY = 'lock-aegis-active-id';

const ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'text/plain'];
const MAX_ATTACHMENTS = 3;
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

function loadConversations(): AegisConversation[] {
  try {
    const saved = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || '[]');
    if (Array.isArray(saved)) return saved;
  } catch {
    // ignora dados corrompidos
  }
  return [];
}

function deriveTitle(firstMessage: string, fallback: string): string {
  const trimmed = firstMessage.trim();
  if (!trimmed) return fallback;
  return trimmed.length > 42 ? `${trimmed.slice(0, 42)}...` : trimmed;
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // remove o prefixo "data:mime;base64,"
      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const ChatPage: React.FC = () => {
  const { token } = useAuth();
  const [conversations, setConversations] = useState<AegisConversation[]>(loadConversations);
  const [activeId, setActiveId] = useState<string | null>(() => {
    const saved = localStorage.getItem(ACTIVE_ID_KEY);
    const list = loadConversations();
    return saved && list.some((c) => c.id === saved) ? saved : null;
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  const persist = useCallback((next: AegisConversation[]) => {
    setConversations(next);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(next));
  }, []);

  const setActive = useCallback((id: string | null) => {
    setActiveId(id);
    if (id) localStorage.setItem(ACTIVE_ID_KEY, id);
    else localStorage.removeItem(ACTIVE_ID_KEY);
  }, []);

  const activeMessages = useMemo(
    () => conversations.find((c) => c.id === activeId)?.messages || [],
    [conversations, activeId]
  );

  const handleNewChat = () => {
    setActive(null);
    setInput('');
    setAttachments([]);
    setAttachmentError(null);
  };

  const handleDeleteConversation = (id: string) => {
    const next = conversations.filter((c) => c.id !== id);
    persist(next);
    if (activeId === id) setActive(null);
  };

  const handleAddAttachments = async (files: FileList) => {
    setAttachmentError(null);
    const incoming = Array.from(files);

    if (attachments.length + incoming.length > MAX_ATTACHMENTS) {
      setAttachmentError(`Você pode anexar no máximo ${MAX_ATTACHMENTS} arquivos por mensagem.`);
      return;
    }

    const next: PendingAttachment[] = [...attachments];
    for (const file of incoming) {
      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        setAttachmentError(`Tipo de arquivo não suportado: ${file.name}. Use PNG, JPEG, WEBP, PDF ou TXT.`);
        continue;
      }
      if (file.size > MAX_ATTACHMENT_BYTES) {
        setAttachmentError(`"${file.name}" passa do limite de 5MB.`);
        continue;
      }
      try {
        const data = await readFileAsBase64(file);
        next.push({
          name: file.name,
          mimeType: file.type,
          data,
          previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        });
      } catch {
        setAttachmentError(`Não foi possível ler o arquivo "${file.name}".`);
      }
    }
    setAttachments(next);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => {
      const removed = prev[index];
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSend = async (overrideMessage?: string) => {
    const message = (overrideMessage ?? input).trim();
    const pendingAttachments = attachments;
    if (!message && pendingAttachments.length === 0) return;
    if (isLoading) return;

    setInput('');
    setAttachments([]);
    setAttachmentError(null);
    setIsLoading(true);

    let workingId = activeId;
    let workingList = conversations;

    if (!workingId) {
      workingId = `${Date.now()}`;
      const newConversation: AegisConversation = {
        id: workingId,
        title: deriveTitle(message, pendingAttachments[0]?.name || 'Novo anexo'),
        createdAt: Date.now(),
        messages: [],
      };
      workingList = [newConversation, ...conversations];
      setActive(workingId);
    }

    const userMessage: AegisMessage = {
      role: 'user',
      content: message,
      attachments: pendingAttachments.length > 0
        ? pendingAttachments.map(({ name, mimeType }) => ({ name, mimeType }))
        : undefined,
    };

    const withUserMessage = workingList.map((c) =>
      c.id === workingId ? { ...c, messages: [...c.messages, userMessage] } : c
    );
    persist(withUserMessage);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          attachments: pendingAttachments.length > 0
            ? pendingAttachments.map(({ name, mimeType, data }) => ({ name, mimeType, data }))
            : undefined,
        }),
      });
      const data = await res.json();
      const reply: AegisMessage = {
        role: 'aegis',
        content: res.ok
          ? data.response || 'Não consegui processar sua mensagem. Tente novamente.'
          : data.message || 'Não consegui processar sua mensagem. Tente novamente.',
      };
      persist(withUserMessage.map((c) => (c.id === workingId ? { ...c, messages: [...c.messages, reply] } : c)));
    } catch {
      const reply: AegisMessage = {
        role: 'aegis',
        content: 'Erro de conexão com o servidor. Verifique se a API está rodando.',
      };
      persist(withUserMessage.map((c) => (c.id === workingId ? { ...c, messages: [...c.messages, reply] } : c)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <ChatSidebar
        conversations={conversations.map(({ id, title, createdAt }) => ({ id, title, createdAt }))}
        activeId={activeId}
        onSelect={setActive}
        onNewChat={handleNewChat}
        onDelete={handleDeleteConversation}
      />
      <ChatPanel
        messages={activeMessages}
        isLoading={isLoading}
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        attachments={attachments}
        onAddAttachments={handleAddAttachments}
        onRemoveAttachment={handleRemoveAttachment}
        attachmentError={attachmentError}
      />
    </div>
  );
};

export default ChatPage;

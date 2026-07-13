import React, { useCallback, useMemo, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import ChatSidebar from '../components/aegis/ChatSidebar';
import ChatPanel, { AegisMessage } from '../components/aegis/ChatPanel';
import './ChatPage.css';

interface AegisConversation {
  id: string;
  title: string;
  createdAt: number;
  messages: AegisMessage[];
}

const CONVERSATIONS_KEY = 'lock-aegis-conversations';
const ACTIVE_ID_KEY = 'lock-aegis-active-id';

function loadConversations(): AegisConversation[] {
  try {
    const saved = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || '[]');
    if (Array.isArray(saved)) return saved;
  } catch {
    // ignora dados corrompidos
  }
  return [];
}

function deriveTitle(firstMessage: string): string {
  const trimmed = firstMessage.trim();
  return trimmed.length > 42 ? `${trimmed.slice(0, 42)}...` : trimmed;
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
  };

  const handleSend = async (overrideMessage?: string) => {
    const message = (overrideMessage ?? input).trim();
    if (!message || isLoading) return;

    setInput('');
    setIsLoading(true);

    let workingId = activeId;
    let workingList = conversations;

    if (!workingId) {
      workingId = `${Date.now()}`;
      const newConversation: AegisConversation = {
        id: workingId,
        title: deriveTitle(message),
        createdAt: Date.now(),
        messages: [],
      };
      workingList = [newConversation, ...conversations];
      setActive(workingId);
    }

    const withUserMessage = workingList.map((c) =>
      c.id === workingId ? { ...c, messages: [...c.messages, { role: 'user', content: message } as AegisMessage] } : c
    );
    persist(withUserMessage);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      const reply: AegisMessage = {
        role: 'aegis',
        content: data.response || 'Não consegui processar sua mensagem. Tente novamente.',
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
      />
      <ChatPanel
        messages={activeMessages}
        isLoading={isLoading}
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
};

export default ChatPage;

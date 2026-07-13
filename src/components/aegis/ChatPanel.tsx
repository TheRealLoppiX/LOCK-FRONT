import React, { useEffect, useRef } from 'react';
import { Robot, PaperPlaneTilt, Paperclip, CircleNotch } from '@phosphor-icons/react';
import './ChatPanel.css';

export interface AegisMessage {
  role: 'user' | 'aegis';
  content: string;
}

const SUGGESTED_PROMPTS = [
  'Explique um ataque de SQL Injection',
  'Como funciona um ataque de força bruta?',
  'Revise este payload de XSS',
  'Prepare-me para a prova CompTIA Security+',
];

interface ChatPanelProps {
  messages: AegisMessage[];
  isLoading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: (message?: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, isLoading, input, onInputChange, onSend }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">
        <Robot size={22} weight="duotone" />
        <span>{messages.length === 0 ? 'Nova Conversa' : 'Aegis'}</span>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <div className="chat-empty-icon">
              <Robot size={32} weight="duotone" />
            </div>
            <h1>Aegis</h1>
            <p>Assistente de cibersegurança. Pronta para ajudar com labs, certificações e conceitos de segurança.</p>
            <div className="chat-suggestions">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button key={prompt} className="chat-suggestion-btn" onClick={() => onSend(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                <div className="chat-bubble">{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message aegis">
                <div className="chat-bubble loading">
                  <CircleNotch size={16} className="spin" /> Pensando...
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="chat-input-bar">
          <button className="chat-attach-btn" title="Anexar arquivo (em breve)" disabled>
            <Paperclip size={18} />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre cibersegurança..."
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={() => onSend()}
            disabled={isLoading || !input.trim()}
            className="chat-send-btn"
            title="Enviar"
          >
            <PaperPlaneTilt size={18} weight="fill" />
          </button>
        </div>
        <p className="chat-disclaimer">A IA pode cometer erros. Verifique informações críticas de segurança.</p>
      </div>
    </div>
  );
};

export default ChatPanel;

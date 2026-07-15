import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Robot, PaperPlaneTilt, Paperclip, CircleNotch, X, FileText, Image as ImageIcon, PencilSimple } from '@phosphor-icons/react';
import './ChatPanel.css';

export interface MessageAttachment {
  name: string;
  mimeType: string;
}

export interface AegisMessage {
  role: 'user' | 'aegis';
  content: string;
  attachments?: MessageAttachment[];
}

export interface PendingAttachment {
  name: string;
  mimeType: string;
  data: string; // base64, sem o prefixo data:...;base64,
  previewUrl?: string;
}

const SUGGESTED_PROMPTS = [
  'Explique um ataque de SQL Injection',
  'Como funciona um ataque de força bruta?',
  'Revise este payload de XSS',
  'Prepare-me para a prova CompTIA Security+',
];

const ACCEPTED_TYPES = 'image/png,image/jpeg,image/webp,application/pdf,text/plain';
const MAX_ATTACHMENTS = 3;
const MAX_ATTACHMENT_MB = 5;

interface ChatPanelProps {
  messages: AegisMessage[];
  isLoading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: (message?: string) => void;
  attachments: PendingAttachment[];
  onAddAttachments: (files: FileList) => void;
  onRemoveAttachment: (index: number) => void;
  attachmentError: string | null;
  editingIndex?: number | null;
  onEditMessage?: (index: number) => void;
  onCancelEdit?: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isLoading,
  input,
  onInputChange,
  onSend,
  attachments,
  onAddAttachments,
  onRemoveAttachment,
  attachmentError,
  editingIndex,
  onEditMessage,
  onCancelEdit,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddAttachments(e.target.files);
    }
    e.target.value = ''; // permite selecionar o mesmo arquivo de novo
  };

  const canAttachMore = attachments.length < MAX_ATTACHMENTS;

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
                {msg.role === 'user' && onEditMessage && !isLoading && (
                  <button
                    className="chat-edit-btn"
                    title="Editar e reenviar"
                    onClick={() => onEditMessage(i)}
                  >
                    <PencilSimple size={14} />
                  </button>
                )}
                <div className="chat-bubble">
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="chat-bubble-attachments">
                      {msg.attachments.map((att, j) => (
                        <span key={j} className="chat-attachment-chip">
                          {att.mimeType.startsWith('image/') ? <ImageIcon size={14} /> : <FileText size={14} />}
                          {att.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {msg.role === 'aegis' ? (
                    <div className="chat-markdown">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
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
        {editingIndex != null && (
          <div className="chat-editing-banner">
            <PencilSimple size={14} /> Editando mensagem — reenviar vai apagar as respostas seguintes.
            <button type="button" onClick={onCancelEdit}>Cancelar</button>
          </div>
        )}
        {attachmentError && <p className="chat-attachment-error">{attachmentError}</p>}

        {attachments.length > 0 && (
          <div className="chat-pending-attachments">
            {attachments.map((att, i) => (
              <div key={i} className="chat-pending-chip">
                {att.previewUrl ? (
                  <img src={att.previewUrl} alt={att.name} className="chat-pending-thumb" />
                ) : (
                  <FileText size={16} />
                )}
                <span className="chat-pending-name">{att.name}</span>
                <button onClick={() => onRemoveAttachment(i)} title="Remover anexo">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="chat-input-bar">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            multiple
            hidden
            onChange={handleFileChange}
          />
          <button
            className="chat-attach-btn"
            title={canAttachMore ? `Anexar imagem ou documento (máx. ${MAX_ATTACHMENT_MB}MB, até ${MAX_ATTACHMENTS} arquivos)` : `Limite de ${MAX_ATTACHMENTS} anexos atingido`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || !canAttachMore}
            type="button"
          >
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
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
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

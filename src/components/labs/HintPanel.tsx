import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, ChatCircleDots } from '@phosphor-icons/react';
import './HintPanel.css';

interface HintPanelProps {
  labTitle: string;
  hints: string[];
}

const HintPanel: React.FC<HintPanelProps> = ({ labTitle, hints }) => {
  const [revealed, setRevealed] = useState(0);

  const askAegisPrompt = `Estou travado no laboratório "${labTitle}" da plataforma LOCK. Pode me dar uma dica sobre por onde começar, sem me dar a resposta pronta?`;

  return (
    <div className="hint-panel">
      {hints.slice(0, revealed).map((hint, i) => (
        <p key={i} className="hint-text">
          <Lightbulb size={16} weight="fill" />
          <span>{hint}</span>
        </p>
      ))}
      <div className="hint-actions">
        {revealed < hints.length && (
          <button type="button" className="hint-reveal-btn" onClick={() => setRevealed((r) => r + 1)}>
            <Lightbulb size={16} /> {revealed === 0 ? 'Preciso de uma dica' : 'Mais uma dica'}
          </button>
        )}
        <Link to={`/chat?ask=${encodeURIComponent(askAegisPrompt)}`} className="hint-ask-aegis-btn">
          <ChatCircleDots size={16} /> Perguntar à Aegis
        </Link>
      </div>
    </div>
  );
};

export default HintPanel;

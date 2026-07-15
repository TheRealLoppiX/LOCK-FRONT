import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlass,
  Flask,
  Exam,
  FilePdf,
  BookOpen,
  Certificate,
  Compass,
} from '@phosphor-icons/react';
import { useAuth } from '../contexts/authContext';
import { useCommandPalette } from '../contexts/commandPaletteContext';
import { staticSearchEntries, SearchEntry } from '../utils/searchIndex';
import './CommandPalette.css';

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const categoryIcon: Record<SearchEntry['category'], React.ReactNode> = {
  'Navegação': <Compass size={16} />,
  'Laboratórios': <Flask size={16} />,
  'Quizzes': <Exam size={16} />,
  'Exercícios': <FilePdf size={16} />,
  'Biblioteca': <BookOpen size={16} />,
  'Simulados': <Certificate size={16} />,
};

const CommandPalette: React.FC = () => {
  const { isOpen, close } = useCommandPalette();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [dynamicEntries, setDynamicEntries] = useState<SearchEntry[]>([]);
  const [dynamicLoaded, setDynamicLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Busca materiais da biblioteca e simulados uma única vez, na primeira
  // abertura — evita bater na API a cada Ctrl+K, já que esses dados mudam
  // pouco durante uma sessão.
  useEffect(() => {
    if (!isOpen || dynamicLoaded || !token) return;
    setDynamicLoaded(true);

    Promise.all([
      fetch(`${process.env.REACT_APP_API_URL}/library/all`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : { allMaterials: [] })),
      fetch(`${process.env.REACT_APP_API_URL}/modules`).then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([libraryData, modules]) => {
        const materialEntries: SearchEntry[] = (libraryData.allMaterials || []).map((m: any): SearchEntry => ({
          id: `material-${m.id}`,
          title: m.title,
          subtitle: 'Biblioteca',
          path: `/biblioteca/${m.id}`,
          category: 'Biblioteca',
        }));
        const moduleEntries: SearchEntry[] = (modules || []).map((m: any): SearchEntry => ({
          id: `module-${m.id}`,
          title: m.title,
          subtitle: 'Simulado',
          path: `/simulados/${m.id}/play`,
          category: 'Simulados',
        }));
        setDynamicEntries([...materialEntries, ...moduleEntries]);
      })
      .catch(() => {
        // Falha silenciosa: a busca continua funcional só com o índice estático.
      });
  }, [isOpen, dynamicLoaded, token]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      // Espera o overlay montar antes de focar
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const all = [...staticSearchEntries, ...dynamicEntries];
    const q = normalize(query.trim());
    if (!q) return all.slice(0, 30);
    return all.filter((e) => normalize(e.title).includes(q) || (e.subtitle && normalize(e.subtitle).includes(q)));
  }, [query, dynamicEntries]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const entry = results[activeIndex];
        if (entry) {
          navigate(entry.path);
          close();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, activeIndex, navigate, close]);

  useEffect(() => {
    const activeEl = listRef.current?.querySelector('.command-palette-item.active');
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={close}>
      <div
        className="command-palette-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Busca global"
      >
        <div className="command-palette-input-row">
          <MagnifyingGlass size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar laboratórios, quizzes, biblioteca, simulados..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd>Esc</kbd>
        </div>

        <div className="command-palette-list" ref={listRef}>
          {results.length === 0 ? (
            <p className="command-palette-empty">Nada encontrado para "{query}".</p>
          ) : (
            results.map((entry, index) => (
              <button
                type="button"
                key={entry.id}
                className={`command-palette-item ${index === activeIndex ? 'active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  navigate(entry.path);
                  close();
                }}
              >
                <span className="command-palette-item-icon">{categoryIcon[entry.category]}</span>
                <span className="command-palette-item-text">
                  <span className="command-palette-item-title">{entry.title}</span>
                  {entry.subtitle && <span className="command-palette-item-subtitle">{entry.subtitle}</span>}
                </span>
                <span className="command-palette-item-category">{entry.category}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

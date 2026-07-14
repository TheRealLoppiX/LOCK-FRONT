import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import HexagonBackground from '../components/hexagonobg';
import { Trophy, Medal, CircleNotch } from '@phosphor-icons/react';
import './Leaderboard.css';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar_url: string | null;
  totalXp: number;
  position: number;
}

const medalColor = (position: number): string | null => {
  if (position === 1) return '#FFD700';
  if (position === 2) return '#C0C0C0';
  if (position === 3) return '#CD7F32';
  return null;
};

const Leaderboard: React.FC = () => {
  const { user, token } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Falha ao carregar o ranking.');
        setLeaderboard(data.leaderboard || []);
        setCurrentUser(data.currentUser || null);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar o ranking.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [token]);

  const isCurrentUserInTop = leaderboard.some((entry) => entry.id === user?.id);

  return (
    <div className="leaderboard-container">
      <HexagonBackground />
      <div className="leaderboard-content">
        <header className="leaderboard-header">
          <Trophy size={40} weight="duotone" color="#FFD700" />
          <div>
            <h1>Ranking</h1>
            <p>Os hackers éticos mais ativos da plataforma, por XP.</p>
          </div>
        </header>

        {loading && (
          <div className="leaderboard-loading">
            <CircleNotch size={24} className="spin-icon" /> Carregando ranking...
          </div>
        )}

        {error && <div className="leaderboard-error">{error}</div>}

        {!loading && !error && (
          <>
            <ol className="leaderboard-list">
              {leaderboard.map((entry) => {
                const isMe = entry.id === user?.id;
                const color = medalColor(entry.position);
                return (
                  <li key={entry.id} className={`leaderboard-row ${isMe ? 'is-me' : ''}`}>
                    <span className="leaderboard-position" style={color ? { color } : undefined}>
                      {color ? <Medal size={22} weight="fill" /> : entry.position}
                    </span>
                    <img
                      src={entry.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${entry.name}`}
                      alt={entry.name}
                      className="leaderboard-avatar"
                    />
                    <span className="leaderboard-name">{entry.name}{isMe && ' (você)'}</span>
                    <span className="leaderboard-xp">{entry.totalXp.toLocaleString('pt-BR')} XP</span>
                  </li>
                );
              })}
            </ol>

            {!isCurrentUserInTop && currentUser && (
              <div className="leaderboard-you-card">
                <span className="leaderboard-you-label">Sua posição</span>
                <div className="leaderboard-row is-me">
                  <span className="leaderboard-position">{currentUser.position}</span>
                  <img
                    src={currentUser.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="leaderboard-avatar"
                  />
                  <span className="leaderboard-name">{currentUser.name} (você)</span>
                  <span className="leaderboard-xp">{currentUser.totalXp.toLocaleString('pt-BR')} XP</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

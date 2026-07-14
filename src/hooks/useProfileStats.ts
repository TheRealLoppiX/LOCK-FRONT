import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/authContext';

export interface ProfileStats {
  completedBooks: number;
  passedExams: number;
  completedLabs: number;
  completedQuizzes: number;
  totalXp: number;
  rank: string;
  nextRank: string | null;
  nextRankXp: number | null;
}

const RANK_THRESHOLDS: { name: string; min: number }[] = [
  { name: 'Script Kiddie', min: 0 },
  { name: 'White Hat', min: 500 },
  { name: 'Grey Hat', min: 1500 },
  { name: 'Elite Hacker', min: 3000 },
  { name: 'Cyber God', min: 5000 },
];

// Mesma regra de negócio usada historicamente em profile.tsx (limiares com ">").
export function computeRank(totalXp: number): { rank: string; nextRank: string | null; nextRankXp: number | null } {
  let rankIndex = 0;
  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (totalXp > RANK_THRESHOLDS[i].min) rankIndex = i;
  }
  const next = RANK_THRESHOLDS[rankIndex + 1] || null;
  return {
    rank: RANK_THRESHOLDS[rankIndex].name,
    nextRank: next?.name ?? null,
    nextRankXp: next?.min ?? null,
  };
}

export function useProfileStats() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<ProfileStats>({
    completedBooks: 0,
    passedExams: 0,
    completedLabs: 0,
    completedQuizzes: 0,
    totalXp: 0,
    rank: 'Script Kiddie',
    nextRank: 'White Hat',
    nextRankXp: 500,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user || !token) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/profile/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Falha ao buscar estatísticas.');

      // O XP é sempre calculado no servidor (mesma fórmula usada no
      // leaderboard) — o front só exibe, nunca recalcula.
      const examAttempts: { score: number; total_questions: number }[] = data.examAttempts || [];
      const passedExamsCount = examAttempts.filter((e) => e.score / e.total_questions >= 0.7).length;
      const completedBooks = (data.readBooks || []).length;
      const completedLabs = (data.labCompletions || []).length;
      const quizCombos = new Set((data.quizCompletions || []).map((q: { topic: string; difficulty: string }) => `${q.topic}::${q.difficulty}`));
      const totalXp: number = data.totalXp ?? 0;
      const { rank, nextRank, nextRankXp } = computeRank(totalXp);

      setStats({
        completedBooks,
        passedExams: passedExamsCount,
        completedLabs,
        completedQuizzes: quizCombos.size,
        totalXp,
        rank,
        nextRank,
        nextRankXp,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas do perfil', error);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}

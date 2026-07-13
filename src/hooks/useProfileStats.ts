import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/authContext';
import { supabase } from '../lib/supabase';

export interface ProfileStats {
  completedBooks: number;
  passedExams: number;
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
  const { user } = useAuth();
  const [stats, setStats] = useState<ProfileStats>({
    completedBooks: 0,
    passedExams: 0,
    totalXp: 0,
    rank: 'Script Kiddie',
    nextRank: 'White Hat',
    nextRankXp: 500,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    try {
      const { data: booksData } = await supabase
        .from('user_library')
        .select('book_id')
        .eq('user_id', user.id)
        .eq('status', 'Lido');

      const { data: examsData } = await supabase
        .from('user_exam_attempts')
        .select('id, score, total_questions')
        .eq('user_id', user.id);

      const passedExams = examsData?.filter((e) => e.score / e.total_questions >= 0.7) || [];
      const completedBooks = booksData?.length || 0;
      const passedExamsCount = passedExams.length;
      const totalXp = completedBooks * 50 + passedExamsCount * 500;
      const { rank, nextRank, nextRankXp } = computeRank(totalXp);

      setStats({ completedBooks, passedExams: passedExamsCount, totalXp, rank, nextRank, nextRankXp });
    } catch (error) {
      console.error('Erro ao carregar estatísticas do perfil', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}

import { useState, useEffect } from 'react';

interface StatsData {
  totalResponses: number;
  setorDistribution: Array<{ setor: string; count: number }>;
  alojamentoDistribution: Array<{ alojamento: string; count: number }>;
  ranchoDistribution: Array<{ rancho: string; count: number }>;
  satisfactionStats: Record<string, Array<{ rating: string; count: number }>>;
  lastUpdated: string;
}

interface AnalyticsData {
  satisfactionAverages: Record<string, number>;
  totalResponses: Array<{ count: number }>;
}

export const useStats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [statsResponse, analyticsResponse] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/analytics')
      ]);

      if (!statsResponse.ok || !analyticsResponse.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const statsData = await statsResponse.json();
      const analyticsData = await analyticsResponse.json();

      setStats(statsData);
      setAnalytics(analyticsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    analytics,
    loading,
    error,
    refetch: fetchStats
  };
};

// Helper function to convert rating text to numeric value
export const ratingToNumber = (rating: string): number => {
  switch (rating) {
    case 'Muito Satisfeito':
    case 'Concordo totalmente':
      return 5;
    case 'Satisfeito':
    case 'Concordo':
      return 4;
    case 'Neutro':
    case 'Não concordo e nem discordo':
      return 3;
    case 'Insatisfeito':
    case 'Discordo':
      return 2;
    case 'Muito Insatisfeito':
    case 'Discordo totalmente':
      return 1;
    default:
      return 3;
  }
};

// Helper function to convert numeric rating to percentage
export const ratingToPercentage = (ratings: Array<{ rating: string; count: number }>) => {
  if (!ratings || ratings.length === 0) {
    return { concordo: 0, neutro: 0, discordo: 0 };
  }

  const total = ratings.reduce((sum, r) => sum + r.count, 0);
  if (total === 0) {
    return { concordo: 0, neutro: 0, discordo: 0 };
  }

  let concordo = 0;
  let neutro = 0;
  let discordo = 0;

  ratings.forEach(({ rating, count }) => {
    const value = ratingToNumber(rating);
    const percentage = (count / total) * 100;
    
    if (value >= 4) {
      concordo += percentage;
    } else if (value === 3) {
      neutro += percentage;
    } else {
      discordo += percentage;
    }
  });

  return {
    concordo: Math.round(concordo),
    neutro: Math.round(neutro),
    discordo: Math.round(discordo)
  };
};
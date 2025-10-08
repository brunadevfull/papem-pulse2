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
    case 'Insatisfeito':
    case 'Discordo':
      return 2;
    case 'Muito Insatisfeito':
    case 'Discordo totalmente':
      return 1;
    case 'Neutro':
    case 'Não concordo e nem discordo':
      return 3;
    default:
      return 3;
  }
};

export type RatingPercentageBreakdown = {
  concordoTotalmente: number;
  concordo: number;
  discordo: number;
  discordoTotalmente: number;
  neutro?: number;
};

// Helper function to convert numeric rating to percentage
export const ratingToPercentage = (
  ratings: Array<{ rating: string; count: number }>
): RatingPercentageBreakdown => {
  if (!ratings || ratings.length === 0) {
    return {
      concordoTotalmente: 0,
      concordo: 0,
      discordo: 0,
      discordoTotalmente: 0,
    };
  }

  const counts = {
    concordoTotalmente: 0,
    concordo: 0,
    discordo: 0,
    discordoTotalmente: 0,
    neutro: 0,
  };

  let total = 0;

  ratings.forEach(({ rating, count }) => {
    total += count;
    switch (rating) {
      case 'Concordo totalmente':
      case 'Muito Satisfeito':
        counts.concordoTotalmente += count;
        break;
      case 'Concordo':
      case 'Satisfeito':
        counts.concordo += count;
        break;
      case 'Discordo totalmente':
      case 'Muito Insatisfeito':
        counts.discordoTotalmente += count;
        break;
      case 'Discordo':
      case 'Insatisfeito':
        counts.discordo += count;
        break;
      case 'Não concordo e nem discordo':
      case 'Neutro':
        counts.neutro += count;
        break;
      default:
        {
          const value = ratingToNumber(rating);
          if (value >= 4) {
            counts.concordo += count;
          } else if (value <= 2) {
            counts.discordo += count;
          } else {
            counts.neutro += count;
          }
        }
        break;
    }
  });

  if (total === 0) {
    return {
      concordoTotalmente: 0,
      concordo: 0,
      discordo: 0,
      discordoTotalmente: 0,
    };
  }

  const toPercentage = (value: number) => Math.round((value / total) * 100);

  const base = {
    concordoTotalmente: toPercentage(counts.concordoTotalmente),
    concordo: toPercentage(counts.concordo),
    discordo: toPercentage(counts.discordo),
    discordoTotalmente: toPercentage(counts.discordoTotalmente),
  };

  if (counts.neutro > 0) {
    return {
      ...base,
      neutro: toPercentage(counts.neutro),
    };
  }

  return base;
};

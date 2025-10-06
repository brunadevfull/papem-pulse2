import { useEffect, useMemo, useState } from "react";

import { ratingToNumber } from "./useStats";

export type SectionKey = "environment" | "relationship" | "motivation";

export interface SectionFilters {
  sector?: string;
  lodging?: string;
  rancho?: string;
  escala?: string;
}

export interface SectionQuestionRating {
  rating: string;
  count: number;
}

export interface SectionQuestionStats {
  questionId: string;
  label: string;
  ratings: SectionQuestionRating[];
}

export interface AggregatedRatings {
  totalResponses: number;
  positive: { count: number; percentage: number };
  neutral: { count: number; percentage: number };
  negative: { count: number; percentage: number };
  breakdown: Array<{ label: string; count: number; percentage: number }>;
}

const buildQueryString = (filters?: SectionFilters) => {
  if (!filters) return "";

  const params = new URLSearchParams();
  if (filters.sector) params.set("sector", filters.sector);
  if (filters.lodging) params.set("lodging", filters.lodging);
  if (filters.rancho) params.set("rancho", filters.rancho);
  if (filters.escala) params.set("escala", filters.escala);

  const query = params.toString();
  return query ? `?${query}` : "";
};

export const aggregateRatings = (
  ratings: SectionQuestionRating[]
): AggregatedRatings => {
  const totalResponses = ratings.reduce((sum, { count }) => sum + count, 0);

  const aggregate = ratings.reduce(
    (acc, { rating, count }) => {
      const numeric = ratingToNumber(rating);

      if (numeric >= 4) {
        acc.positive.count += count;
      } else if (numeric === 3) {
        acc.neutral.count += count;
      } else {
        acc.negative.count += count;
      }

      return acc;
    },
    {
      positive: { count: 0, percentage: 0 },
      neutral: { count: 0, percentage: 0 },
      negative: { count: 0, percentage: 0 }
    }
  );

  if (totalResponses > 0) {
    aggregate.positive.percentage = (aggregate.positive.count / totalResponses) * 100;
    aggregate.neutral.percentage = (aggregate.neutral.count / totalResponses) * 100;
    aggregate.negative.percentage = (aggregate.negative.count / totalResponses) * 100;
  }

  const breakdown = ratings.map(({ rating, count }) => ({
    label: rating,
    count,
    percentage: totalResponses > 0 ? (count / totalResponses) * 100 : 0
  }));

  return {
    totalResponses,
    ...aggregate,
    breakdown
  };
};

export const useSectionStats = (
  section: SectionKey,
  filters?: SectionFilters
) => {
  const [data, setData] = useState<SectionQuestionStats[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => buildQueryString(filters), [filters]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/${section}-stats${queryString}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar os dados");
        }

        const payload: SectionQuestionStats[] = await response.json();
        setData(payload);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        console.error(`Erro ao buscar dados de ${section}:`, err);
        setError(
          err instanceof Error ? err.message : "Erro desconhecido ao carregar estatísticas"
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    return () => {
      controller.abort();
    };
  }, [section, queryString]);

  return {
    data,
    loading,
    error
  };
};

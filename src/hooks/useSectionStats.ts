import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SectionKey, SectionStatsResponse } from '@shared/section-metadata';

export interface SectionFilters {
  setor?: string;
  alojamento?: string;
  rancho?: string;
  escala?: string;
}

interface SectionStatsHookState {
  data: SectionStatsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const buildQueryString = (filters: SectionFilters) => {
  const params = new URLSearchParams();
  (Object.entries(filters) as Array<[keyof SectionFilters, string | undefined]>).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  return params.toString();
};

export function useSectionStats(section: SectionKey, filters: SectionFilters): SectionStatsHookState {
  const [data, setData] = useState<SectionStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const queryString = useMemo(
    () => buildQueryString(filters),
    [filters.setor, filters.alojamento, filters.rancho, filters.escala]
  );

  const fetchStats = useCallback(async (signal: AbortSignal) => {
    try {
      setLoading(true);
      const url = `/api/${section}-stats${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas da seção');
      }

      const payload: SectionStatsResponse = await response.json();
      setData(payload);
      setError(null);
    } catch (err) {
      if ((err as any)?.name === 'AbortError') {
        return;
      }
      console.error('Erro ao buscar estatísticas da seção:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [section, queryString]);

  useEffect(() => {
    const controller = new AbortController();
    fetchStats(controller.signal);
    return () => controller.abort();
  }, [fetchStats, refreshIndex]);

  const refetch = useCallback(() => {
    setRefreshIndex((index) => index + 1);
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

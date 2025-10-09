import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CommentRecord } from '@shared/section-metadata';
import type { SectionFilters } from './useSectionStats';

interface OpenCommentsState {
  comments: CommentRecord[];
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

export function useOpenComments(filters: SectionFilters = {}): OpenCommentsState {
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const queryString = useMemo(
    () => buildQueryString(filters),
    [filters.setor, filters.alojamento, filters.rancho, filters.escala]
  );

  const fetchComments = useCallback(async (signal: AbortSignal) => {
    try {
      setLoading(true);
      const url = `/api/comments${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error('Erro ao carregar comentários');
      }
      const payload: { comments: CommentRecord[] } = await response.json();
      setComments(payload.comments || []);
      setError(null);
    } catch (err) {
      if ((err as any)?.name === 'AbortError') {
        return;
      }
      console.error('Erro ao buscar comentários:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    const controller = new AbortController();
    fetchComments(controller.signal);
    return () => controller.abort();
  }, [fetchComments, refreshIndex]);

  const refetch = useCallback(() => setRefreshIndex((index) => index + 1), []);

  return {
    comments,
    loading,
    error,
    refetch,
  };
}

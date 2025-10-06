import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

export type CommentCategoryField =
  | "aspecto_positivo"
  | "aspecto_negativo"
  | "proposta_processo"
  | "proposta_satisfacao";

interface OpenCommentApi {
  id: number | string;
  setor?: string | null;
  setor_trabalho?: string | null;
  aspecto_positivo?: string | null;
  aspecto_negativo?: string | null;
  proposta_processo?: string | null;
  proposta_satisfacao?: string | null;
  created_at?: string | null;
}

export interface OpenComment {
  id: number;
  setor: string;
  aspecto_positivo: string | null;
  aspecto_negativo: string | null;
  proposta_processo: string | null;
  proposta_satisfacao: string | null;
  created_at: string | null;
}

interface OpenCommentsApiResponse {
  comments?: OpenCommentApi[];
  data?: OpenCommentApi[];
  total?: number;
  count?: number;
  sectors?: string[];
  availableSectors?: string[];
}

interface OpenCommentsResult {
  comments: OpenComment[];
  total: number;
  sectors: string[];
}

interface UseOpenCommentsParams {
  sector?: string;
  enabled?: boolean;
}

const normaliseComment = (comment: OpenCommentApi): OpenComment => {
  const id = typeof comment.id === "number" ? comment.id : Number(comment.id);

  return {
    id: Number.isNaN(id) ? 0 : id,
    setor: comment.setor?.trim() || comment.setor_trabalho?.trim() || "Não informado",
    aspecto_positivo: comment.aspecto_positivo ?? null,
    aspecto_negativo: comment.aspecto_negativo ?? null,
    proposta_processo: comment.proposta_processo ?? null,
    proposta_satisfacao: comment.proposta_satisfacao ?? null,
    created_at: comment.created_at ?? null,
  };
};

const buildQueryString = (sector?: string) => {
  const params = new URLSearchParams();

  if (sector && sector !== "all") {
    params.set("setor", sector);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
};

const mapResponse = (response: unknown): OpenCommentsResult => {
  const parsed = response as OpenCommentsApiResponse | OpenCommentApi[] | undefined;

  const rawComments: OpenCommentApi[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.comments)
      ? parsed!.comments!
      : Array.isArray(parsed?.data)
        ? parsed!.data!
        : [];

  const comments = rawComments.map(normaliseComment);

  const sectorsFromResponse = Array.isArray((parsed as OpenCommentsApiResponse)?.sectors)
    ? (parsed as OpenCommentsApiResponse).sectors!
    : Array.isArray((parsed as OpenCommentsApiResponse)?.availableSectors)
      ? (parsed as OpenCommentsApiResponse).availableSectors!
      : [];

  const derivedSectors = new Set<string>();
  sectorsFromResponse.filter(Boolean).forEach((sector) => derivedSectors.add(sector));
  comments
    .map((comment) => comment.setor)
    .filter((sector) => sector && sector !== "Não informado")
    .forEach((sector) => derivedSectors.add(sector));

  const total = typeof (parsed as OpenCommentsApiResponse)?.total === "number"
    ? (parsed as OpenCommentsApiResponse).total!
    : typeof (parsed as OpenCommentsApiResponse)?.count === "number"
      ? (parsed as OpenCommentsApiResponse).count!
      : comments.length;

  return {
    comments,
    total,
    sectors: Array.from(derivedSectors),
  };
};

export const useOpenComments = ({ sector, enabled = true }: UseOpenCommentsParams = {}) => {
  const query = useQuery<OpenCommentsResult, Error>({
    queryKey: ["open-comments", sector ?? "all"],
    queryFn: async () => {
      const response = await fetch(`/api/comments${buildQueryString(sector)}`);

      if (!response.ok) {
        throw new Error("Erro ao carregar comentários abertos");
      }

      const payload = await response.json();
      return mapResponse(payload);
    },
    enabled,
    keepPreviousData: true,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const sectors = useMemo(() => query.data?.sectors ?? [], [query.data?.sectors]);

  return {
    comments: query.data?.comments ?? [],
    total: query.data?.total ?? 0,
    sectors,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
    status: query.status,
  };
};

import type { SurveyResponse } from '@shared/schema';

export type SurveyQuestionKey = Extract<keyof SurveyResponse, string>;

export type RatingCount = {
  rating: string;
  count: number;
};

export type QuestionStats = {
  questionKey: SurveyQuestionKey;
  total: number;
  counts: RatingCount[];
};

export type CommentRecord = Pick<
  SurveyResponse,
  | 'setor_trabalho'
  | 'aspecto_positivo'
  | 'aspecto_negativo'
  | 'proposta_processo'
  | 'proposta_satisfacao'
>;

export type SurveyFilterKey = 'setor' | 'alojamento' | 'rancho' | 'escala';

export type SurveyFilterParams = Partial<Record<SurveyFilterKey, string>>;

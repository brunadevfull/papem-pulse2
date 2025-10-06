import type { SurveyResponse } from "./schema";

export type SectionKey = "environment" | "relationship" | "motivation";

export type QuestionType = "likert" | "categorical";

export interface SectionQuestion {
  id: keyof SurveyResponse;
  label: string;
  type: QuestionType;
}

export const environmentQuestions: SectionQuestion[] = [
  { id: "materiais_fornecidos", label: "Q2. Materiais fornecidos", type: "likert" },
  { id: "materiais_adequados", label: "Q3. Materiais adequados", type: "likert" },
  { id: "atendimento_apoio", label: "Q4. Atendimento do setor de apoio", type: "likert" },
  { id: "limpeza_adequada", label: "Q5. Limpeza adequada", type: "likert" },
  { id: "temperatura_adequada", label: "Q6. Temperatura adequada", type: "likert" },
  { id: "iluminacao_adequada", label: "Q7. Iluminação adequada", type: "likert" },
  { id: "localizacao_alojamento", label: "Q8. Localização do alojamento", type: "categorical" },
  { id: "alojamento_condicoes", label: "Q9. Condições do alojamento", type: "likert" },
  { id: "banheiros_adequados", label: "Q10. Instalações dos banheiros", type: "likert" },
  { id: "praca_darmas_adequada", label: "Q11/12. Praça d'Armas e salão de recreio", type: "likert" },
  { id: "localizacao_rancho", label: "Q12/13. Localização do rancho", type: "categorical" },
  { id: "rancho_instalacoes", label: "Q13/14. Instalações do rancho", type: "likert" },
  { id: "rancho_qualidade", label: "Q14/15. Qualidade da comida do rancho", type: "likert" },
  { id: "escala_atrapalha", label: "Q16. Escala de serviço impacta tarefas", type: "likert" },
  { id: "equipamentos_servico", label: "Q17. Equipamentos utilizados em serviço", type: "likert" },
  { id: "tfm_participa", label: "Q18. Participação no TFM", type: "likert" },
  { id: "tfm_incentivado", label: "Q19. TFM é incentivado", type: "likert" },
  { id: "tfm_instalacoes", label: "Q20. Instalações para TFM", type: "likert" },
];

export const relationshipQuestions: SectionQuestion[] = [
  { id: "chefe_ouve_ideias", label: "Q21. Chefe ouve ideias", type: "likert" },
  { id: "chefe_se_importa", label: "Q22. Chefe se importa", type: "likert" },
  { id: "contribuir_atividades", label: "Q23. Interesse em contribuir", type: "likert" },
  { id: "chefe_delega", label: "Q24. Chefe delega responsabilidades", type: "likert" },
  { id: "pares_auxiliam", label: "Q25. Pares auxiliam", type: "likert" },
  { id: "entrosamento_setores", label: "Q26. Entrosamento entre setores", type: "likert" },
  { id: "entrosamento_tripulacao", label: "Q27. Entrosamento da tripulação", type: "likert" },
  { id: "convivio_agradavel", label: "Q28. Convívio agradável", type: "likert" },
  { id: "confianca_respeito", label: "Q29. Confiança e respeito", type: "likert" },
];

export const motivationQuestions: SectionQuestion[] = [
  { id: "feedback_desempenho", label: "Q30. Feedback de desempenho", type: "likert" },
  { id: "conceito_compativel", label: "Q31. Conceito compatível", type: "likert" },
  { id: "importancia_atividade", label: "Q32. Importância da atividade", type: "likert" },
  { id: "trabalho_reconhecido", label: "Q33. Trabalho reconhecido", type: "likert" },
  { id: "crescimento_estimulado", label: "Q34. Crescimento estimulado", type: "likert" },
  { id: "cursos_suficientes", label: "Q35. Cursos suficientes", type: "likert" },
  { id: "programa_treinamento", label: "Q36. Programa de treinamento", type: "likert" },
  { id: "orgulho_trabalhar", label: "Q37. Orgulho de trabalhar aqui", type: "likert" },
  { id: "bem_aproveitado", label: "Q38. Bem aproveitado na função", type: "likert" },
  { id: "potencial_outra_funcao", label: "Q39. Potencial em outra função", type: "likert" },
  { id: "carga_trabalho_justa", label: "Q40. Carga de trabalho justa", type: "likert" },
  { id: "licenca_autorizada", label: "Q41. Licenças autorizadas", type: "likert" },
];

export const sectionQuestions: Record<SectionKey, SectionQuestion[]> = {
  environment: environmentQuestions,
  relationship: relationshipQuestions,
  motivation: motivationQuestions,
};

export interface RatingBreakdown {
  rating: string;
  count: number;
}

export interface QuestionStats {
  questionId: keyof SurveyResponse;
  label: string;
  type: QuestionType;
  totalResponses: number;
  ratings: RatingBreakdown[];
  average: number | null;
}

export interface SectionStatsResponse {
  section: SectionKey;
  questions: QuestionStats[];
  totalResponses: number;
}

export interface CommentRecord {
  id: number;
  setor_trabalho: string | null;
  aspecto_positivo: string | null;
  aspecto_negativo: string | null;
  proposta_processo: string | null;
  proposta_satisfacao: string | null;
  created_at: string | null;
}

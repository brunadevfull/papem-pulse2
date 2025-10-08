import type { SurveyResponse } from "./schema";

export type SectionKey = "environment" | "relationship" | "motivation";

export type QuestionType = "likert" | "categorical";

export interface SectionQuestion {
  id: keyof SurveyResponse;
  label: string;
  type: QuestionType;
}

export const environmentQuestions: SectionQuestion[] = [
  { id: "setor_localizacao", label: "Localização do setor", type: "categorical" },
  { id: "setor_computadores", label: "Q1. Computadores do setor", type: "likert" },
  { id: "setor_mobiliario", label: "Q2. Mobiliário e instalações do setor", type: "likert" },
  { id: "setor_limpeza", label: "Q3. Limpeza do setor", type: "likert" },
  { id: "setor_temperatura", label: "Q4. Temperatura do setor", type: "likert" },
  { id: "setor_iluminacao", label: "Q5. Iluminação do setor", type: "likert" },
  { id: "alojamento_localizacao", label: "Localização do alojamento", type: "categorical" },
  { id: "alojamento_limpeza", label: "Q6. Limpeza do alojamento", type: "likert" },
  { id: "alojamento_temperatura", label: "Q7. Temperatura do alojamento", type: "likert" },
  { id: "alojamento_iluminacao", label: "Q8. Iluminação do alojamento", type: "likert" },
  { id: "alojamento_armarios_condicao", label: "Q9. Armários em boas condições", type: "likert" },
  { id: "alojamento_armario_preservado", label: "Q10. Preservo o meu armário", type: "likert" },
  { id: "banheiro_localizacao", label: "Localização do banheiro", type: "categorical" },
  { id: "banheiro_vasos_suficientes", label: "Q11. Vasos suficientes", type: "likert" },
  { id: "banheiro_vasos_preservados", label: "Q12. Vasos limpos e preservados", type: "likert" },
  { id: "banheiro_torneiras_funcionam", label: "Q13. Torneiras funcionam adequadamente", type: "likert" },
  { id: "banheiro_chuveiros_suficientes", label: "Q14. Chuveiros suficientes", type: "likert" },
  { id: "banheiro_chuveiros_funcionam", label: "Q15. Chuveiros funcionam adequadamente", type: "likert" },
  { id: "banheiro_limpeza", label: "Q16. Limpeza do banheiro", type: "likert" },
  { id: "banheiro_iluminacao", label: "Q17. Iluminação do banheiro", type: "likert" },
  { id: "recreio_localizacao", label: "Localização do salão de recreio", type: "categorical" },
  { id: "recreio_mobiliario_quantidade", label: "Q18. Quantidade de mobiliário no salão", type: "likert" },
  { id: "recreio_mobiliario_condicao", label: "Q19. Mobiliário do salão em boas condições", type: "likert" },
  { id: "recreio_limpeza", label: "Q20. Limpeza do salão de recreio", type: "likert" },
  { id: "recreio_temperatura", label: "Q21. Temperatura do salão de recreio", type: "likert" },
  { id: "recreio_iluminacao", label: "Q22. Iluminação do salão de recreio", type: "likert" },
  { id: "rancho_localizacao", label: "Localização do rancho", type: "categorical" },
  { id: "rancho_qualidade_comida", label: "Q23. Qualidade da comida do rancho", type: "likert" },
  { id: "rancho_mobiliario_condicao", label: "Q24. Mobiliário do rancho", type: "likert" },
  { id: "rancho_limpeza", label: "Q25. Limpeza do rancho", type: "likert" },
  { id: "rancho_temperatura", label: "Q26. Temperatura do rancho", type: "likert" },
  { id: "rancho_iluminacao", label: "Q27. Iluminação do rancho", type: "likert" },
  { id: "escala_servico_tipo", label: "Escala de serviço", type: "categorical" },
  { id: "escala_equipamentos_condicao", label: "Q28. Equipamentos em boas condições", type: "likert" },
  { id: "escala_pernoite_adequada", label: "Q29. Instalações de pernoite adequadas", type: "likert" },
  { id: "tfm_participa_regularmente", label: "Q36. Participação regular no TFM", type: "likert" },
  { id: "tfm_incentivo_pratica", label: "Q37. Incentivo ao TFM", type: "likert" },
  { id: "tfm_instalacoes_adequadas", label: "Q38. Instalações adequadas para o TFM", type: "likert" },
];

export const relationshipQuestions: SectionQuestion[] = [
  { id: "encarregado_ouve_melhorias", label: "Q1. Encarregado ouve propostas", type: "likert" },
  { id: "encarregado_fornece_meios", label: "Q2. Encarregado fornece meios", type: "likert" },
  { id: "disposicao_contribuir_setor", label: "Q3. Interesse em contribuir com o setor", type: "likert" },
  { id: "encarregado_delega", label: "Q4. Encarregado delega responsabilidades", type: "likert" },
  { id: "pares_auxiliam_setor", label: "Q5. Pares auxiliam quando necessário", type: "likert" },
  { id: "relacionamento_intersetorial", label: "Q6. Relacionamento entre setores", type: "likert" },
  { id: "entrosamento_tripulacao", label: "Q7. Entrosamento da tripulação", type: "likert" },
  { id: "convivencia_regras", label: "Q8. Convivência observa boas práticas", type: "likert" },
  { id: "confianca_respeito_relacoes", label: "Q9. Confiança e respeito no trabalho", type: "likert" },
  { id: "integracao_familia_papem", label: "Q10. Medidas para integrar à Família PAPEM", type: "likert" },
];

export const motivationQuestions: SectionQuestion[] = [
  { id: "feedback_desempenho_regular", label: "Q1. Feedback sobre desempenho", type: "likert" },
  { id: "conceito_compativel_desempenho", label: "Q2. Conceito compatível com o desempenho", type: "likert" },
  { id: "importancia_funcao_papem", label: "Q3. Importância da função na PAPEM", type: "likert" },
  { id: "trabalho_reconhecido_valorizado", label: "Q4. Trabalho reconhecido e valorizado", type: "likert" },
  { id: "crescimento_profissional_estimulado", label: "Q5. Crescimento profissional estimulado", type: "likert" },
  { id: "cursos_suficientes_atividade", label: "Q6. Cursos suficientes para a atividade", type: "likert" },
  { id: "programa_adestramento_regular", label: "Q7. Programa de adestramento ou cursos", type: "likert" },
  { id: "orgulho_trabalhar_papem", label: "Q8. Orgulho de trabalhar na PAPEM", type: "likert" },
  { id: "atuacao_area_especializacao", label: "Q9. Atuação na área de especialização", type: "likert" },
  { id: "potencial_melhor_em_outra_funcao", label: "Q10. Potencial em outra função", type: "likert" },
  { id: "carga_trabalho_justa", label: "Q11. Carga de trabalho justa", type: "likert" },
  { id: "licenca_autorizada_sem_prejuizo", label: "Q12. Licenças autorizadas sem prejuízo", type: "likert" },
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
  setor_localizacao: string | null;
  aspecto_positivo: string | null;
  aspecto_negativo: string | null;
  proposta_processo: string | null;
  proposta_satisfacao: string | null;
  created_at: string | null;
}

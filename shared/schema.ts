import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabela principal para armazenar as respostas da pesquisa
export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  
  // Seção 1: Condições do Ambiente de Trabalho e Conforto
  setor_localizacao: varchar("setor_localizacao", { length: 100 }),
  setor_computadores: varchar("setor_computadores", { length: 50 }),
  setor_mobiliario: varchar("setor_mobiliario", { length: 50 }),
  setor_limpeza: varchar("setor_limpeza", { length: 50 }),
  setor_temperatura: varchar("setor_temperatura", { length: 50 }),
  setor_iluminacao: varchar("setor_iluminacao", { length: 50 }),

  alojamento_localizacao: varchar("alojamento_localizacao", { length: 100 }),
  alojamento_limpeza: varchar("alojamento_limpeza", { length: 50 }),
  alojamento_temperatura: varchar("alojamento_temperatura", { length: 50 }),
  alojamento_iluminacao: varchar("alojamento_iluminacao", { length: 50 }),
  alojamento_armarios_condicao: varchar("alojamento_armarios_condicao", { length: 50 }),
  alojamento_armario_preservado: varchar("alojamento_armario_preservado", { length: 50 }),

  banheiro_localizacao: varchar("banheiro_localizacao", { length: 100 }),
  banheiro_vasos_suficientes: varchar("banheiro_vasos_suficientes", { length: 50 }),
  banheiro_vasos_preservados: varchar("banheiro_vasos_preservados", { length: 50 }),
  banheiro_torneiras_funcionam: varchar("banheiro_torneiras_funcionam", { length: 50 }),
  banheiro_chuveiros_suficientes: varchar("banheiro_chuveiros_suficientes", { length: 50 }),
  banheiro_chuveiros_funcionam: varchar("banheiro_chuveiros_funcionam", { length: 50 }),
  banheiro_limpeza: varchar("banheiro_limpeza", { length: 50 }),
  banheiro_iluminacao: varchar("banheiro_iluminacao", { length: 50 }),

  recreio_localizacao: varchar("recreio_localizacao", { length: 100 }),
  recreio_mobiliario_quantidade: varchar("recreio_mobiliario_quantidade", { length: 50 }),
  recreio_mobiliario_condicao: varchar("recreio_mobiliario_condicao", { length: 50 }),
  recreio_limpeza: varchar("recreio_limpeza", { length: 50 }),
  recreio_temperatura: varchar("recreio_temperatura", { length: 50 }),
  recreio_iluminacao: varchar("recreio_iluminacao", { length: 50 }),

  rancho_localizacao: varchar("rancho_localizacao", { length: 100 }),
  rancho_qualidade_comida: varchar("rancho_qualidade_comida", { length: 50 }),
  rancho_mobiliario_condicao: varchar("rancho_mobiliario_condicao", { length: 50 }),
  rancho_limpeza: varchar("rancho_limpeza", { length: 50 }),
  rancho_temperatura: varchar("rancho_temperatura", { length: 50 }),
  rancho_iluminacao: varchar("rancho_iluminacao", { length: 50 }),

  escala_servico_tipo: varchar("escala_servico_tipo", { length: 100 }),
  escala_equipamentos_condicao: varchar("escala_equipamentos_condicao", { length: 50 }),
  escala_pernoite_adequada: varchar("escala_pernoite_adequada", { length: 50 }),

  tfm_participa_regularmente: varchar("tfm_participa_regularmente", { length: 50 }),
  tfm_incentivo_pratica: varchar("tfm_incentivo_pratica", { length: 50 }),
  tfm_instalacoes_adequadas: varchar("tfm_instalacoes_adequadas", { length: 50 }),
  
  // Seção 2: Relacionamentos
  encarregado_ouve_melhorias: varchar("encarregado_ouve_melhorias", { length: 50 }),
  encarregado_fornece_meios: varchar("encarregado_fornece_meios", { length: 50 }),
  disposicao_contribuir_setor: varchar("disposicao_contribuir_setor", { length: 50 }),
  encarregado_delega: varchar("encarregado_delega", { length: 50 }),
  pares_auxiliam_setor: varchar("pares_auxiliam_setor", { length: 50 }),
  relacionamento_intersetorial: varchar("relacionamento_intersetorial", { length: 50 }),
  entrosamento_tripulacao: varchar("entrosamento_tripulacao", { length: 50 }),
  convivencia_regras: varchar("convivencia_regras", { length: 50 }),
  confianca_respeito_relacoes: varchar("confianca_respeito_relacoes", { length: 50 }),
  integracao_familia_papem: varchar("integracao_familia_papem", { length: 50 }),
  
  // Seção 3: Motivação e Desenvolvimento Profissional
  feedback_desempenho_regular: varchar("feedback_desempenho_regular", { length: 50 }),
  conceito_compativel_desempenho: varchar("conceito_compativel_desempenho", { length: 50 }),
  importancia_funcao_papem: varchar("importancia_funcao_papem", { length: 50 }),
  trabalho_reconhecido_valorizado: varchar("trabalho_reconhecido_valorizado", { length: 50 }),
  crescimento_profissional_estimulado: varchar("crescimento_profissional_estimulado", { length: 50 }),
  cursos_suficientes_atividade: varchar("cursos_suficientes_atividade", { length: 50 }),
  programa_adestramento_regular: varchar("programa_adestramento_regular", { length: 50 }),
  orgulho_trabalhar_papem: varchar("orgulho_trabalhar_papem", { length: 50 }),
  atuacao_area_especializacao: varchar("atuacao_area_especializacao", { length: 50 }),
  potencial_melhor_em_outra_funcao: varchar("potencial_melhor_em_outra_funcao", { length: 50 }),
  carga_trabalho_justa: varchar("carga_trabalho_justa", { length: 50 }),
  licenca_autorizada_sem_prejuizo: varchar("licenca_autorizada_sem_prejuizo", { length: 50 }),
  
  // Seção 4: Comentários e Sugestões
  aspecto_positivo: text("aspecto_positivo"),
  aspecto_negativo: text("aspecto_negativo"),
  proposta_processo: text("proposta_processo"),
  proposta_satisfacao: text("proposta_satisfacao"),
  
  // Metadados
  created_at: timestamp("created_at").defaultNow(),
  ip_address: varchar("ip_address", { length: 45 }), // Para evitar duplicações (IPv4/IPv6)
});

// Tabela para controle de estatísticas
export const surveyStats = pgTable("survey_stats", {
  id: serial("id").primaryKey(),
  total_responses: integer("total_responses").default(0),
  last_updated: timestamp("last_updated").defaultNow(),
});

// Tipos TypeScript inferidos
export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type InsertSurveyResponse = typeof surveyResponses.$inferInsert;

// Schemas de validação com Zod
export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({
  id: true,
  created_at: true,
});

// Schema personalizado com validações
export const surveyValidationSchema = z.object({
  setor_localizacao: z.string().min(1, "Localização do setor é obrigatória"),
  alojamento_localizacao: z.string().min(1, "Localização do alojamento é obrigatória"),
  banheiro_localizacao: z.string().min(1, "Localização do banheiro é obrigatória"),
  recreio_localizacao: z.string().min(1, "Localização do salão de recreio é obrigatória"),
  rancho_localizacao: z.string().min(1, "Localização do rancho é obrigatória"),
  escala_servico_tipo: z.string().min(1, "Escala de serviço é obrigatória"),
});

// Comment out for now since frontend doesn't use actual database operations
// export type InsertSurveyResponseType = z.infer<typeof insertSurveyResponseSchema>;
import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabela principal para armazenar as respostas da pesquisa
export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  
  // Seção 1: Condições de Trabalho, Serviço e TFM
  setor_trabalho: varchar("setor_trabalho", { length: 100 }),
  materiais_fornecidos: varchar("materiais_fornecidos", { length: 50 }),
  materiais_adequados: varchar("materiais_adequados", { length: 50 }),
  atendimento_apoio: varchar("atendimento_apoio", { length: 50 }),
  limpeza_adequada: varchar("limpeza_adequada", { length: 50 }),
  temperatura_adequada: varchar("temperatura_adequada", { length: 50 }),
  iluminacao_adequada: varchar("iluminacao_adequada", { length: 50 }),
  
  // Alojamento (opcional - baseado na localização)
  localizacao_alojamento: varchar("localizacao_alojamento", { length: 100 }),
  alojamento_condicoes: varchar("alojamento_condicoes", { length: 50 }),
  banheiros_adequados: varchar("banheiros_adequados", { length: 50 }),
  
  // Rancho e Praça d'Armas
  praca_darmas_adequada: varchar("praca_darmas_adequada", { length: 50 }),
  localizacao_rancho: varchar("localizacao_rancho", { length: 100 }),
  rancho_instalacoes: varchar("rancho_instalacoes", { length: 50 }),
  rancho_qualidade: varchar("rancho_qualidade", { length: 50 }),
  
  // Escala de Serviço (obrigatório)
  escala_servico: varchar("escala_servico", { length: 100 }),
  escala_atrapalha: varchar("escala_atrapalha", { length: 50 }),
  equipamentos_servico: varchar("equipamentos_servico", { length: 50 }),
  tfm_participa: varchar("tfm_participa", { length: 50 }),
  tfm_incentivado: varchar("tfm_incentivado", { length: 50 }),
  tfm_instalacoes: varchar("tfm_instalacoes", { length: 50 }),
  
  // Seção 2: Relacionamentos
  chefe_ouve_ideias: varchar("chefe_ouve_ideias", { length: 50 }),
  chefe_se_importa: varchar("chefe_se_importa", { length: 50 }),
  contribuir_atividades: varchar("contribuir_atividades", { length: 50 }),
  chefe_delega: varchar("chefe_delega", { length: 50 }),
  pares_auxiliam: varchar("pares_auxiliam", { length: 50 }),
  entrosamento_setores: varchar("entrosamento_setores", { length: 50 }),
  entrosamento_tripulacao: varchar("entrosamento_tripulacao", { length: 50 }),
  convivio_agradavel: varchar("convivio_agradavel", { length: 50 }),
  confianca_respeito: varchar("confianca_respeito", { length: 50 }),
  
  // Seção 3: Motivação e Desenvolvimento Profissional
  feedback_desempenho: varchar("feedback_desempenho", { length: 50 }),
  conceito_compativel: varchar("conceito_compativel", { length: 50 }),
  importancia_atividade: varchar("importancia_atividade", { length: 50 }),
  trabalho_reconhecido: varchar("trabalho_reconhecido", { length: 50 }),
  crescimento_estimulado: varchar("crescimento_estimulado", { length: 50 }),
  cursos_suficientes: varchar("cursos_suficientes", { length: 50 }),
  programa_treinamento: varchar("programa_treinamento", { length: 50 }),
  orgulho_trabalhar: varchar("orgulho_trabalhar", { length: 50 }),
  bem_aproveitado: varchar("bem_aproveitado", { length: 50 }),
  potencial_outra_funcao: varchar("potencial_outra_funcao", { length: 50 }),
  carga_trabalho_justa: varchar("carga_trabalho_justa", { length: 50 }),
  licenca_autorizada: varchar("licenca_autorizada", { length: 50 }),
  
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
  setor_trabalho: z.string().min(1, "Setor de trabalho é obrigatório"),
  localizacao_rancho: z.string().min(1, "Localização do rancho é obrigatória"),
  escala_servico: z.string().min(1, "Escala de serviço é obrigatória"),
});

// Comment out for now since frontend doesn't use actual database operations
// export type InsertSurveyResponseType = z.infer<typeof insertSurveyResponseSchema>;
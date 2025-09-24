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
  ambiente_trabalho: varchar("ambiente_trabalho", { length: 50 }),
  chefia_disponivel: varchar("chefia_disponivel", { length: 50 }),
  chefia_orientacao: varchar("chefia_orientacao", { length: 50 }),
  
  // Alojamento (opcional - baseado na localização)
  localizacao_alojamento: varchar("localizacao_alojamento", { length: 100 }),
  alojamento_condicoes: varchar("alojamento_condicoes", { length: 50 }),
  banheiros_adequados: varchar("banheiros_adequados", { length: 50 }),
  
  // Rancho (obrigatório)
  localizacao_rancho: varchar("localizacao_rancho", { length: 100 }),
  praca_darmas_adequada: varchar("praca_darmas_adequada", { length: 50 }), // Só preenchido se rancho = "Praça D'armas"
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
  pares_auxiliam: varchar("pares_auxiliam", { length: 50 }),
  pares_cooperacao: varchar("pares_cooperacao", { length: 50 }),
  subordinados_orientacao: varchar("subordinados_orientacao", { length: 50 }),
  subordinados_disponibilidade: varchar("subordinados_disponibilidade", { length: 50 }),
  chefia_dialogo: varchar("chefia_dialogo", { length: 50 }),
  chefia_orientacao_relacionamento: varchar("chefia_orientacao_relacionamento", { length: 50 }),
  chefia_disponibilidade: varchar("chefia_disponibilidade", { length: 50 }),
  chefia_competencia: varchar("chefia_competencia", { length: 50 }),
  comunicacao_eficaz: varchar("comunicacao_eficaz", { length: 50 }),
  informacoes_claras: varchar("informacoes_claras", { length: 50 }),
  
  // Seção 3: Motivação e Desenvolvimento Profissional
  reconhecimento_trabalho: varchar("reconhecimento_trabalho", { length: 50 }),
  oportunidades_crescimento: varchar("oportunidades_crescimento", { length: 50 }),
  cursos_capacitacao: varchar("cursos_capacitacao", { length: 50 }),
  atualizacao_conhecimentos: varchar("atualizacao_conhecimentos", { length: 50 }),
  satisfacao_geral: varchar("satisfacao_geral", { length: 50 }),
  recomendar_organizacao: varchar("recomendar_organizacao", { length: 50 }),
  
  // Seção 4: Comentários e Sugestões
  comentarios_gerais: text("comentarios_gerais"),
  sugestoes_melhorias: text("sugestoes_melhorias"),
  
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

// Schema personalizado com validações (usando pick para extrair campos específicos)
export const surveyValidationSchema = insertSurveyResponseSchema.pick({
  setor_trabalho: true,
  localizacao_rancho: true, 
  escala_servico: true,
}).extend({
  setor_trabalho: z.string().min(1, "Setor de trabalho é obrigatório"),
  localizacao_rancho: z.string().min(1, "Localização do rancho é obrigatória"),
  escala_servico: z.string().min(1, "Escala de serviço é obrigatória"),
});

export type InsertSurveyResponseType = z.infer<typeof insertSurveyResponseSchema>;
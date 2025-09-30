import { surveyResponses, surveyStats, type SurveyResponse, type InsertSurveyResponse } from "@shared/schema";
import { db } from "./db";
import { eq, sql, count, desc } from "drizzle-orm";

// Interface para operações de storage
export interface IStorage {
  // Operações de pesquisa
  createSurveyResponse(data: InsertSurveyResponse): Promise<SurveyResponse>;
  getSurveyResponses(): Promise<SurveyResponse[]>;
  getSurveyResponseById(id: number): Promise<SurveyResponse | undefined>;
  
  // Estatísticas
  getTotalResponses(): Promise<number>;
  getResponsesBySetor(): Promise<Record<string, number>>;
  getResponsesByRancho(): Promise<Record<string, number>>;
  getResponsesByEscala(): Promise<Record<string, number>>;
  
  // Análises avançadas
  getLikertStats(field: string): Promise<Record<string, number>>;
  getRecentResponses(limit?: number): Promise<SurveyResponse[]>;
}

// Implementação do storage com PostgreSQL
export class DatabaseStorage implements IStorage {
  
  async createSurveyResponse(data: InsertSurveyResponse): Promise<SurveyResponse> {
    const [response] = await db
      .insert(surveyResponses)
      .values({
        ...data,
        ip_address: data.ip_address || 'unknown',
      })
      .returning();
    
    // Atualizar contador de estatísticas
    await this.updateStats();
    
    return response;
  }

  async getSurveyResponses(): Promise<SurveyResponse[]> {
    return await db.select().from(surveyResponses).orderBy(desc(surveyResponses.created_at));
  }

  async getSurveyResponseById(id: number): Promise<SurveyResponse | undefined> {
    const [response] = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.id, id));
    return response || undefined;
  }

  async getTotalResponses(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(surveyResponses);
    return result.count;
  }

  async getResponsesBySetor(): Promise<Record<string, number>> {
    const results = await db
      .select({
        setor: surveyResponses.setor_trabalho,
        count: count(),
      })
      .from(surveyResponses)
      .where(sql`${surveyResponses.setor_trabalho} IS NOT NULL`)
      .groupBy(surveyResponses.setor_trabalho);

    return results.reduce((acc, { setor, count }) => {
      if (setor) acc[setor] = count;
      return acc;
    }, {} as Record<string, number>);
  }

  async getResponsesByRancho(): Promise<Record<string, number>> {
    const results = await db
      .select({
        rancho: surveyResponses.localizacao_rancho,
        count: count(),
      })
      .from(surveyResponses)
      .where(sql`${surveyResponses.localizacao_rancho} IS NOT NULL`)
      .groupBy(surveyResponses.localizacao_rancho);

    return results.reduce((acc, { rancho, count }) => {
      if (rancho) acc[rancho] = count;
      return acc;
    }, {} as Record<string, number>);
  }

  async getResponsesByEscala(): Promise<Record<string, number>> {
    const results = await db
      .select({
        escala: surveyResponses.escala_servico,
        count: count(),
      })
      .from(surveyResponses)
      .where(sql`${surveyResponses.escala_servico} IS NOT NULL`)
      .groupBy(surveyResponses.escala_servico);

    return results.reduce((acc, { escala, count }) => {
      if (escala) acc[escala] = count;
      return acc;
    }, {} as Record<string, number>);
  }

  async getLikertStats(field: string): Promise<Record<string, number>> {
    // Esta função precisa ser adaptada baseada no campo específico
    // Por ora, retorna uma estrutura básica
    const query = sql`
      SELECT ${sql.raw(field)} as value, COUNT(*) as count 
      FROM survey_responses 
      WHERE ${sql.raw(field)} IS NOT NULL 
      GROUP BY ${sql.raw(field)}
    `;
    
    const results = await db.execute(query);
    
    return (results.rows as any[]).reduce((acc, { value, count }) => {
      if (value) acc[value] = parseInt(count);
      return acc;
    }, {} as Record<string, number>);
  }

  async getRecentResponses(limit: number = 10): Promise<SurveyResponse[]> {
    return await db
      .select()
      .from(surveyResponses)
      .orderBy(desc(surveyResponses.created_at))
      .limit(limit);
  }

  private async updateStats(): Promise<void> {
    const totalCount = await this.getTotalResponses();
    
    // Atualizar ou inserir estatísticas
    const [existing] = await db.select().from(surveyStats).limit(1);
    
    if (existing) {
      await db
        .update(surveyStats)
        .set({
          total_responses: totalCount,
          last_updated: new Date(),
        })
        .where(eq(surveyStats.id, existing.id));
    } else {
      await db.insert(surveyStats).values({
        total_responses: totalCount,
      });
    }
  }
}

export const storage = new DatabaseStorage();
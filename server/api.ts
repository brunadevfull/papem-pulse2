import express from 'express';
import cors from 'cors';
import { db } from './db';
import { surveyResponses, surveyStats } from '@shared/schema';
import { eq, count, sql } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// POST: Submit survey response
app.post('/api/survey', async (req, res) => {
  try {
    const surveyData = req.body;
    
    // Get client IP for duplicate prevention
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    
    // Insert survey response
    const [response] = await db
      .insert(surveyResponses)
      .values({
        ...surveyData,
        ip_address: ip,
      })
      .returning();

    // Update stats
    await updateStats();

    res.status(201).json({
      success: true,
      message: 'Pesquisa enviada com sucesso!',
      id: response.id,
    });
  } catch (error) {
    console.error('Erro ao salvar pesquisa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// GET: Dashboard statistics
app.get('/api/stats', async (req, res) => {
  try {
    // Total responses
    const [totalCount] = await db
      .select({ count: count() })
      .from(surveyResponses);

    // Setor distribution
    const setorStats = await db
      .select({
        setor: surveyResponses.setor_trabalho,
        count: count(),
      })
      .from(surveyResponses)
      .where(sql`${surveyResponses.setor_trabalho} IS NOT NULL`)
      .groupBy(surveyResponses.setor_trabalho)
      .orderBy(sql`count DESC`);

    // Alojamento distribution
    const alojamentoStats = await db
      .select({
        alojamento: surveyResponses.localizacao_alojamento,
        count: count(),
      })
      .from(surveyResponses)
      .where(sql`${surveyResponses.localizacao_alojamento} IS NOT NULL`)
      .groupBy(surveyResponses.localizacao_alojamento)
      .orderBy(sql`count DESC`);

    // Rancho distribution  
    const ranchoStats = await db
      .select({
        rancho: surveyResponses.localizacao_rancho,
        count: count(),
      })
      .from(surveyResponses)
      .where(sql`${surveyResponses.localizacao_rancho} IS NOT NULL`)
      .groupBy(surveyResponses.localizacao_rancho)
      .orderBy(sql`count DESC`);

    // Response satisfaction levels
    const satisfactionFields = [
      'materiais_fornecidos', 'materiais_adequados', 'atendimento_apoio',
      'limpeza_adequada', 'temperatura_adequada', 'iluminacao_adequada',
      'rancho_instalacoes', 'rancho_qualidade', 'equipamentos_servico'
    ];

    const satisfactionStats = {};
    
    for (const field of satisfactionFields) {
      const stats = await db
        .select({
          rating: sql`${surveyResponses[field]}`,
          count: count(),
        })
        .from(surveyResponses)
        .where(sql`${surveyResponses[field]} IS NOT NULL`)
        .groupBy(sql`${surveyResponses[field]}`)
        .orderBy(sql`count DESC`);
      
      satisfactionStats[field] = stats;
    }

    res.json({
      totalResponses: totalCount.count,
      setorDistribution: setorStats,
      alojamentoDistribution: alojamentoStats,
      ranchoDistribution: ranchoStats,
      satisfactionStats,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar estatísticas',
    });
  }
});

// GET: Detailed analytics for admin dashboard
app.get('/api/analytics', async (req, res) => {
  try {
    // Satisfaction averages by category
    const satisfactionQuery = await db
      .select({
        // Trabalho e Materiais
        materiais_fornecidos: sql`avg(case when ${surveyResponses.materiais_fornecidos} = 'Concordo totalmente' then 5 when ${surveyResponses.materiais_fornecidos} = 'Concordo' then 4 when ${surveyResponses.materiais_fornecidos} = 'Não concordo e nem discordo' then 3 when ${surveyResponses.materiais_fornecidos} = 'Discordo' then 2 when ${surveyResponses.materiais_fornecidos} = 'Discordo totalmente' then 1 end)`,
        materiais_adequados: sql`avg(case when ${surveyResponses.materiais_adequados} = 'Concordo totalmente' then 5 when ${surveyResponses.materiais_adequados} = 'Concordo' then 4 when ${surveyResponses.materiais_adequados} = 'Não concordo e nem discordo' then 3 when ${surveyResponses.materiais_adequados} = 'Discordo' then 2 when ${surveyResponses.materiais_adequados} = 'Discordo totalmente' then 1 end)`,
        atendimento_apoio: sql`avg(case when ${surveyResponses.atendimento_apoio} = 'Concordo totalmente' then 5 when ${surveyResponses.atendimento_apoio} = 'Concordo' then 4 when ${surveyResponses.atendimento_apoio} = 'Não concordo e nem discordo' then 3 when ${surveyResponses.atendimento_apoio} = 'Discordo' then 2 when ${surveyResponses.atendimento_apoio} = 'Discordo totalmente' then 1 end)`,
        
        // Ambiente
        limpeza_adequada: sql`avg(case when ${surveyResponses.limpeza_adequada} = 'Concordo totalmente' then 5 when ${surveyResponses.limpeza_adequada} = 'Concordo' then 4 when ${surveyResponses.limpeza_adequada} = 'Não concordo e nem discordo' then 3 when ${surveyResponses.limpeza_adequada} = 'Discordo' then 2 when ${surveyResponses.limpeza_adequada} = 'Discordo totalmente' then 1 end)`,
        temperatura_adequada: sql`avg(case when ${surveyResponses.temperatura_adequada} = 'Concordo totalmente' then 5 when ${surveyResponses.temperatura_adequada} = 'Concordo' then 4 when ${surveyResponses.temperatura_adequada} = 'Não concordo e nem discordo' then 3 when ${surveyResponses.temperatura_adequada} = 'Discordo' then 2 when ${surveyResponses.temperatura_adequada} = 'Discordo totalmente' then 1 end)`,
        iluminacao_adequada: sql`avg(case when ${surveyResponses.iluminacao_adequada} = 'Concordo totalmente' then 5 when ${surveyResponses.iluminacao_adequada} = 'Concordo' then 4 when ${surveyResponses.iluminacao_adequada} = 'Não concordo e nem discordo' then 3 when ${surveyResponses.iluminacao_adequada} = 'Discordo' then 2 when ${surveyResponses.iluminacao_adequada} = 'Discordo totalmente' then 1 end)`,
      })
      .from(surveyResponses);

    res.json({
      satisfactionAverages: satisfactionQuery[0],
      totalResponses: await db.select({ count: count() }).from(surveyResponses),
    });
  } catch (error) {
    console.error('Erro ao buscar analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar analytics',
    });
  }
});

// Helper function to update stats
async function updateStats() {
  const [totalCount] = await db
    .select({ count: count() })
    .from(surveyResponses);

  // Upsert stats record
  const existingStats = await db.select().from(surveyStats).limit(1);
  
  if (existingStats.length > 0) {
    await db
      .update(surveyStats)
      .set({
        total_responses: totalCount.count,
        last_updated: new Date(),
      })
      .where(eq(surveyStats.id, existingStats[0].id));
  } else {
    await db
      .insert(surveyStats)
      .values({
        total_responses: totalCount.count,
      });
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API rodando na porta ${PORT}`);
});

export default app;
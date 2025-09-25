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

// GET: Export complete report for presentation
app.get('/api/export', async (req, res) => {
  try {
    // Fetch all data needed for the report
    const [statsResponse, analyticsResponse] = await Promise.all([
      await getStatsData(),
      await getAnalyticsData()
    ]);

    const reportData = {
      stats: statsResponse,
      analytics: analyticsResponse,
      generatedAt: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Generate HTML report
    const htmlReport = generateHtmlReport(reportData);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(htmlReport);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório'
    });
  }
});

// Helper function to get stats data
async function getStatsData() {
  const [totalCount] = await db
    .select({ count: count() })
    .from(surveyResponses);

  const setorStats = await db
    .select({
      setor: surveyResponses.setor_trabalho,
      count: count(),
    })
    .from(surveyResponses)
    .where(sql`${surveyResponses.setor_trabalho} IS NOT NULL`)
    .groupBy(surveyResponses.setor_trabalho)
    .orderBy(sql`count DESC`);

  const alojamentoStats = await db
    .select({
      alojamento: surveyResponses.localizacao_alojamento,
      count: count(),
    })
    .from(surveyResponses)
    .where(sql`${surveyResponses.localizacao_alojamento} IS NOT NULL`)
    .groupBy(surveyResponses.localizacao_alojamento)
    .orderBy(sql`count DESC`);

  const ranchoStats = await db
    .select({
      rancho: surveyResponses.localizacao_rancho,
      count: count(),
    })
    .from(surveyResponses)
    .where(sql`${surveyResponses.localizacao_rancho} IS NOT NULL`)
    .groupBy(surveyResponses.localizacao_rancho)
    .orderBy(sql`count DESC`);

  return {
    totalResponses: totalCount.count,
    setorDistribution: setorStats,
    alojamentoDistribution: alojamentoStats,
    ranchoDistribution: ranchoStats,
    lastUpdated: new Date().toISOString(),
  };
}

// Helper function to get analytics data
async function getAnalyticsData() {
  const satisfactionFields = [
    'materiais_fornecidos', 'materiais_adequados', 'atendimento_apoio',
    'limpeza_adequada', 'temperatura_adequada', 'iluminacao_adequada',
    'rancho_instalacoes', 'rancho_qualidade', 'equipamentos_servico'
  ];

  const satisfactionAverages = {};
  
  for (const field of satisfactionFields) {
    const ratings = await db
      .select({
        rating: sql`${surveyResponses[field]}`,
        count: count(),
      })
      .from(surveyResponses)
      .where(sql`${surveyResponses[field]} IS NOT NULL`)
      .groupBy(sql`${surveyResponses[field]}`);
      
    if (ratings.length > 0) {
      const weightedSum = ratings.reduce((sum, r) => {
        const value = ratingToNumber(r.rating);
        return sum + (value * r.count);
      }, 0);
      
      const totalCount = ratings.reduce((sum, r) => sum + r.count, 0);
      satisfactionAverages[field] = totalCount > 0 ? weightedSum / totalCount : null;
    } else {
      satisfactionAverages[field] = null;
    }
  }

  return { satisfactionAverages };
}

// Helper function to convert ratings to numbers (same as frontend)
function ratingToNumber(rating) {
  switch (rating) {
    case 'Muito Satisfeito':
    case 'Concordo totalmente':
      return 5;
    case 'Satisfeito':
    case 'Concordo':
      return 4;
    case 'Neutro':
    case 'Não concordo e nem discordo':
      return 3;
    case 'Insatisfeito':
    case 'Discordo':
      return 2;
    case 'Muito Insatisfeito':
    case 'Discordo totalmente':
      return 1;
    default:
      return 3;
  }
}

// Generate comprehensive HTML report
function generateHtmlReport(data) {
  const { stats, analytics, generatedAt } = data;
  
  // Calculate general satisfaction
  const satisfactionValues = Object.values(analytics.satisfactionAverages).filter(v => v !== null) as number[];
  const generalSatisfaction = satisfactionValues.length > 0 
    ? satisfactionValues.reduce((sum, val) => sum + val, 0) / satisfactionValues.length * 20
    : 0;

  // Get most active sector
  const mostActiveSection = stats.setorDistribution.length > 0 
    ? stats.setorDistribution[0].setor 
    : "N/A";

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Clima Organizacional - PAPEM</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 700;
        }
        
        .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
            margin-top: 10px;
        }
        
        .content {
            padding: 40px;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .metric-card {
            background: #f8fafc;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            border-left: 5px solid #4f46e5;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        
        .metric-value {
            font-size: 3em;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }
        
        .metric-label {
            font-size: 1.1em;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .section {
            margin-bottom: 50px;
        }
        
        .section-title {
            font-size: 2em;
            color: #1e293b;
            margin-bottom: 25px;
            padding-bottom: 10px;
            border-bottom: 3px solid #e2e8f0;
        }
        
        .chart-container {
            background: white;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        .data-table th,
        .data-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .data-table th {
            background: #f1f5f9;
            font-weight: 600;
            color: #475569;
        }
        
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #059669);
            transition: width 0.3s ease;
        }
        
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        
        .satisfaction-gauge {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 10px;
        }
        
        .satisfaction-high { background: #10b981; }
        .satisfaction-medium { background: #f59e0b; }
        .satisfaction-low { background: #ef4444; }
        
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Relatório de Clima Organizacional</h1>
            <div class="subtitle">Pesquisa Anônima - PAPEM</div>
            <div class="subtitle">Gerado em: ${generatedAt}</div>
        </div>
        
        <div class="content">
            <!-- Métricas Principais -->
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${stats.totalResponses}</div>
                    <div class="metric-label">Total de Respostas</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${Math.round(generalSatisfaction)}%</div>
                    <div class="metric-label">Satisfação Geral</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${mostActiveSection}</div>
                    <div class="metric-label">Setor Mais Ativo</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${stats.setorDistribution.length}</div>
                    <div class="metric-label">Setores Participantes</div>
                </div>
            </div>

            <!-- Distribuição por Setor -->
            <div class="section">
                <h2 class="section-title">📈 Distribuição por Setor</h2>
                <div class="chart-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Setor</th>
                                <th>Respondentes</th>
                                <th>Percentual</th>
                                <th>Representação</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${stats.setorDistribution.map(setor => {
                              const percentage = ((setor.count / stats.totalResponses) * 100).toFixed(1);
                              return `
                                <tr>
                                    <td><strong>${setor.setor}</strong></td>
                                    <td>${setor.count}</td>
                                    <td>${percentage}%</td>
                                    <td>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${percentage}%"></div>
                                        </div>
                                    </td>
                                </tr>
                              `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Distribuição por Localização de Alojamento -->
            ${stats.alojamentoDistribution.length > 0 ? `
            <div class="section">
                <h2 class="section-title">🏠 Distribuição por Alojamento</h2>
                <div class="chart-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Localização</th>
                                <th>Respondentes</th>
                                <th>Percentual</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${stats.alojamentoDistribution.map(local => {
                              const percentage = ((local.count / stats.totalResponses) * 100).toFixed(1);
                              return `
                                <tr>
                                    <td>${local.alojamento}</td>
                                    <td>${local.count}</td>
                                    <td>${percentage}%</td>
                                </tr>
                              `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : ''}

            <!-- Distribuição por Rancho -->
            <div class="section">
                <h2 class="section-title">🍽️ Distribuição por Rancho</h2>
                <div class="chart-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Localização</th>
                                <th>Respondentes</th>
                                <th>Percentual</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${stats.ranchoDistribution.map(rancho => {
                              const percentage = ((rancho.count / stats.totalResponses) * 100).toFixed(1);
                              return `
                                <tr>
                                    <td>${rancho.rancho}</td>
                                    <td>${rancho.count}</td>
                                    <td>${percentage}%</td>
                                </tr>
                              `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Análise de Satisfação por Área -->
            <div class="section">
                <h2 class="section-title">📊 Análise de Satisfação por Área</h2>
                <div class="chart-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Área Avaliada</th>
                                <th>Nota Média</th>
                                <th>Status</th>
                                <th>Indicador</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(analytics.satisfactionAverages)
                              .filter(([_, avg]) => avg !== null)
                              .map(([field, avg]) => {
                                const friendlyName = getFriendlyFieldName(field);
                                const avgNumber = avg as number;
                                const score = (avgNumber * 20).toFixed(1);
                                const status = avgNumber >= 4 ? 'Excelente' : avgNumber >= 3.5 ? 'Bom' : avgNumber >= 3 ? 'Regular' : 'Necessita Atenção';
                                const gaugeClass = avgNumber >= 3.5 ? 'satisfaction-high' : avgNumber >= 3 ? 'satisfaction-medium' : 'satisfaction-low';
                                return `
                                  <tr>
                                      <td><strong>${friendlyName}</strong></td>
                                      <td>${avgNumber.toFixed(2)}/5.0</td>
                                      <td>${status}</td>
                                      <td>
                                          <span class="satisfaction-gauge ${gaugeClass}"></span>
                                          ${score}%
                                      </td>
                                  </tr>
                                `;
                              }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Resumo Executivo -->
            <div class="section">
                <h2 class="section-title">📋 Resumo Executivo</h2>
                <div class="chart-container">
                    <h3>Principais Insights:</h3>
                    <ul style="font-size: 1.1em; line-height: 1.8;">
                        <li><strong>Participação:</strong> ${stats.totalResponses} colaboradores participaram da pesquisa</li>
                        <li><strong>Satisfação Geral:</strong> ${Math.round(generalSatisfaction)}% de satisfação média geral</li>
                        <li><strong>Setor Mais Engajado:</strong> ${mostActiveSection} com ${stats.setorDistribution[0]?.count || 0} participações</li>
                        <li><strong>Distribuição:</strong> ${stats.setorDistribution.length} setores diferentes representados</li>
                    </ul>
                    
                    <h3>Recomendações:</h3>
                    <ul style="font-size: 1.1em; line-height: 1.8;">
                        ${generalSatisfaction < 70 ? 
                          '<li><strong>Atenção:</strong> Satisfação geral abaixo do ideal. Recomenda-se investigar áreas específicas.</li>' :
                          '<li><strong>Parabéns:</strong> Satisfação geral dentro do esperado. Manter boas práticas.</li>'
                        }
                        <li><strong>Engajamento:</strong> Incentivar participação de setores menos representados</li>
                        <li><strong>Acompanhamento:</strong> Realizar pesquisas periódicas para monitorar evolução</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Relatório gerado automaticamente pelo Sistema de Pesquisa de Clima Organizacional PAPEM</strong></p>
            <p>Este documento pode ser editado e personalizado para apresentações executivas</p>
            <p>Data de geração: ${generatedAt}</p>
        </div>
    </div>
</body>
</html>
  `;
}

// Helper function to get friendly field names for the report
function getFriendlyFieldName(field) {
  const fieldNames = {
    'materiais_fornecidos': 'Materiais Fornecidos',
    'materiais_adequados': 'Adequação dos Materiais', 
    'atendimento_apoio': 'Atendimento e Apoio',
    'limpeza_adequada': 'Limpeza e Higiene',
    'temperatura_adequada': 'Temperatura Ambiente',
    'iluminacao_adequada': 'Iluminação Adequada',
    'rancho_instalacoes': 'Instalações do Rancho',
    'rancho_qualidade': 'Qualidade da Alimentação',
    'equipamentos_servico': 'Equipamentos de Serviço'
  };
  
  return fieldNames[field] || field;
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor API rodando na porta ${PORT}`);
});

export default app;
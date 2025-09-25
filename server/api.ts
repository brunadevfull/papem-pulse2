import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import { db } from './db';
import { surveyResponses, surveyStats } from '@shared/schema';
import { eq, count, sql } from 'drizzle-orm';
import { 
  generateSectorChart, 
  generateRanchoChart, 
  generateSatisfactionChart, 
  generateOverallSatisfactionChart, 
  generateTrendChart 
} from './reportCharts';
import { generatePdfTemplate } from './pdfTemplate';

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
      message: 'Erro interno do servidor',
    });
  }
});

// GET: Analytics with computed averages
app.get('/api/analytics', async (req, res) => {
  try {
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

    res.json({
      satisfactionAverages,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao calcular analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// GET: Export complete report as downloadable PDF file with charts
app.get('/api/export/pdf', async (req, res) => {
  try {
    // Fetch data for report
    const reportData = await fetchReportData();
    
    // Generate all charts
    const charts = {
      sectorChart: await generateSectorChart(reportData.stats.setorDistribution),
      ranchoChart: await generateRanchoChart(reportData.stats.ranchoDistribution),
      satisfactionChart: await generateSatisfactionChart(reportData.analytics.satisfactionAverages),
      overallChart: await generateOverallSatisfactionChart(reportData.generalSatisfaction),
      trendChart: await generateTrendChart()
    };

    // Generate HTML with embedded charts
    const htmlContent = generatePdfTemplate({
      ...reportData,
      charts
    });

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '1cm',
          right: '1cm',
          bottom: '1cm',
          left: '1cm'
        }
      });

      const fileName = `Relatorio_Clima_Organizacional_PAPEM_${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(pdfBuffer);
      
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório PDF'
    });
  }
});

// Helper function to fetch report data (DRY principle)
async function fetchReportData() {
  // Fetch data
  const [totalCount] = await db.select({ count: count() }).from(surveyResponses);
  
  const setorStats = await db
    .select({
      setor: surveyResponses.setor_trabalho,
      count: count(),
    })
    .from(surveyResponses)
    .where(sql`${surveyResponses.setor_trabalho} IS NOT NULL`)
    .groupBy(surveyResponses.setor_trabalho)
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

  // Calculate satisfaction averages
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

  // Calculate general satisfaction
  const satisfactionValues = Object.values(satisfactionAverages).filter(v => v !== null) as number[];
  const generalSatisfaction = satisfactionValues.length > 0 
    ? satisfactionValues.reduce((sum, val) => sum + val, 0) / satisfactionValues.length * 20
    : 0;

  // Generate date
  const generatedAt = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long'
  });

  return {
    stats: {
      totalResponses: totalCount.count,
      setorDistribution: setorStats,
      ranchoDistribution: ranchoStats
    },
    analytics: { satisfactionAverages },
    generalSatisfaction,
    generatedAt
  };
}

// GET: Export complete report as downloadable HTML file
app.get('/api/export', async (req, res) => {
  try {
    const data = await fetchReportData();
    const htmlReport = generateReport(data);
    const fileName = `Relatorio_Clima_Organizacional_PAPEM_${new Date().toISOString().split('T')[0]}.html`;
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(htmlReport);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório'
    });
  }
});

// Generate professional HTML report (easily convertible to DOC/PDF)
function generateReport(data) {
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
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            margin: 2cm;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #1e3c72;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #1e3c72;
            font-size: 28px;
            margin: 0;
            font-weight: bold;
        }
        .header p {
            color: #666;
            font-size: 16px;
            margin: 10px 0;
        }
        .section {
            margin: 30px 0;
        }
        .section h2 {
            color: #1e3c72;
            font-size: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .metric {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #1e3c72;
        }
        .metric-value {
            font-size: 32px;
            font-weight: bold;
            color: #1e3c72;
            margin-bottom: 5px;
        }
        .metric-label {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #1e3c72;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        .status-excelente { color: #22c55e; font-weight: bold; }
        .status-bom { color: #3b82f6; font-weight: bold; }
        .status-regular { color: #f59e0b; font-weight: bold; }
        .status-atencao { color: #ef4444; font-weight: bold; }
        
        @media print {
            body { margin: 1cm; }
            .metric { page-break-inside: avoid; }
            table { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>RELATÓRIO DE CLIMA ORGANIZACIONAL</h1>
        <p><strong>PAPEM - Pesquisa Anônima</strong></p>
        <p>Gerado em: ${generatedAt}</p>
        <p><em>Dados 100% reais extraídos do banco de dados PostgreSQL</em></p>
    </div>

    <div class="section">
        <h2>📊 RESUMO EXECUTIVO</h2>
        <div class="metrics">
            <div class="metric">
                <div class="metric-value">${stats.totalResponses}</div>
                <div class="metric-label">Total de Respostas</div>
            </div>
            <div class="metric">
                <div class="metric-value">${Math.round(generalSatisfaction)}%</div>
                <div class="metric-label">Satisfação Geral</div>
            </div>
            <div class="metric">
                <div class="metric-value">${mostActiveSection}</div>
                <div class="metric-label">Setor Mais Ativo</div>
            </div>
            <div class="metric">
                <div class="metric-value">${stats.setorDistribution.length}</div>
                <div class="metric-label">Setores Participantes</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>📈 DISTRIBUIÇÃO POR SETOR</h2>
        <table>
            <thead>
                <tr>
                    <th>Setor</th>
                    <th>Respondentes</th>
                    <th>Percentual</th>
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
                    </tr>
                  `;
                }).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>🍽️ DISTRIBUIÇÃO POR RANCHO</h2>
        <table>
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

    <div class="section">
        <h2>📊 ANÁLISE DE SATISFAÇÃO POR ÁREA</h2>
        <table>
            <thead>
                <tr>
                    <th>Área Avaliada</th>
                    <th>Nota Média (1-5)</th>
                    <th>Percentual</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(analytics.satisfactionAverages)
                  .filter(([_, avg]) => avg !== null)
                  .map(([field, avg]) => {
                    const avgNumber = avg as number;
                    const friendlyName = getFriendlyFieldName(field);
                    const score = (avgNumber * 20).toFixed(1);
                    const status = avgNumber >= 4 ? 'Excelente' : avgNumber >= 3.5 ? 'Bom' : avgNumber >= 3 ? 'Regular' : 'Necessita Atenção';
                    const statusClass = avgNumber >= 4 ? 'status-excelente' : avgNumber >= 3.5 ? 'status-bom' : avgNumber >= 3 ? 'status-regular' : 'status-atencao';
                    
                    return `
                      <tr>
                          <td><strong>${friendlyName}</strong></td>
                          <td>${avgNumber.toFixed(2)}/5.0</td>
                          <td>${score}%</td>
                          <td><span class="${statusClass}">${status}</span></td>
                      </tr>
                    `;
                  }).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>📋 CONCLUSÕES E RECOMENDAÇÕES</h2>
        
        <h3>Principais Insights:</h3>
        <ul>
            <li><strong>Participação:</strong> ${stats.totalResponses} colaboradores participaram da pesquisa</li>
            <li><strong>Satisfação Geral:</strong> ${Math.round(generalSatisfaction)}% de satisfação média geral</li>
            <li><strong>Setor Mais Engajado:</strong> ${mostActiveSection} com ${stats.setorDistribution[0]?.count || 0} participações</li>
            <li><strong>Distribuição:</strong> ${stats.setorDistribution.length} setores diferentes representados</li>
        </ul>
        
        <h3>Recomendações:</h3>
        <ul>
            <li><strong>${generalSatisfaction < 70 ? 'Atenção' : 'Parabéns'}:</strong> ${generalSatisfaction < 70 ? 'Satisfação geral abaixo do ideal. Recomenda-se investigar áreas específicas.' : 'Satisfação geral dentro do esperado. Manter boas práticas.'}</li>
            <li><strong>Engajamento:</strong> Incentivar participação de setores menos representados</li>
            <li><strong>Acompanhamento:</strong> Realizar pesquisas periódicas para monitorar evolução</li>
        </ul>
    </div>

    <div class="footer">
        <p><strong>Relatório gerado automaticamente pelo Sistema de Pesquisa de Clima Organizacional PAPEM</strong></p>
        <p>Este documento pode ser editado e personalizado para apresentações executivas</p>
        <p>Data de geração: ${generatedAt} | Todos os dados são extraídos em tempo real do banco PostgreSQL</p>
    </div>
</body>
</html>
  `;
}

// Helper functions
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

async function updateStats() {
  try {
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
  } catch (error) {
    console.error('Erro ao atualizar estatísticas:', error);
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
// PDF template with embedded charts for professional reports
export function generatePdfTemplate(data: {
  stats: any;
  analytics: any;
  generatedAt: string;
  chartsHtml: string;
}) {
  const { stats, analytics, generatedAt, chartsHtml } = data;
  
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
        @page {
            size: A4;
            margin: 2cm;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .cover-page {
            text-align: center;
            padding: 100px 40px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            page-break-after: always;
            border-radius: 20px;
            margin-bottom: 40px;
        }
        
        .cover-page h1 {
            font-size: 42px;
            font-weight: bold;
            margin: 0 0 20px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .cover-page .subtitle {
            font-size: 24px;
            margin: 20px 0;
            opacity: 0.9;
        }
        
        .cover-page .org-name {
            font-size: 32px;
            font-weight: bold;
            margin: 40px 0;
            border: 3px solid white;
            padding: 20px;
            border-radius: 15px;
        }
        
        .cover-page .generated-date {
            font-size: 18px;
            margin-top: 60px;
            opacity: 0.8;
        }
        
        .section {
            margin: 40px 0;
            page-break-inside: avoid;
        }
        
        .section h2 {
            color: #1e3c72;
            font-size: 24px;
            border-bottom: 3px solid #1e3c72;
            padding-bottom: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .section h3 {
            color: #2a5298;
            font-size: 18px;
            margin: 25px 0 15px 0;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin: 30px 0;
        }
        
        .metric-card {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            border-left: 6px solid #1e3c72;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .metric-value {
            font-size: 48px;
            font-weight: bold;
            color: #1e3c72;
            margin-bottom: 10px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        .metric-label {
            font-size: 16px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: bold;
        }
        
        .chart-container {
            text-align: center;
            margin: 40px 0;
            page-break-inside: avoid;
        }
        
        .chart-container img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }
        
        .chart-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin: 40px 0;
        }
        
        .chart-grid .chart-container {
            margin: 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            font-size: 14px;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        
        th {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        tr:nth-child(even) {
            background-color: #f8fafc;
        }
        
        tr:hover {
            background-color: #e2e8f0;
        }
        
        .status-excelente { 
            color: #22c55e; 
            font-weight: bold;
            background: #dcfce7;
            padding: 5px 10px;
            border-radius: 20px;
        }
        
        .status-bom { 
            color: #3b82f6; 
            font-weight: bold;
            background: #dbeafe;
            padding: 5px 10px;
            border-radius: 20px;
        }
        
        .status-regular { 
            color: #f59e0b; 
            font-weight: bold;
            background: #fef3c7;
            padding: 5px 10px;
            border-radius: 20px;
        }
        
        .status-atencao { 
            color: #ef4444; 
            font-weight: bold;
            background: #fee2e2;
            padding: 5px 10px;
            border-radius: 20px;
        }
        
        .insights-box {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-left: 6px solid #0ea5e9;
            padding: 30px;
            margin: 30px 0;
            border-radius: 10px;
        }
        
        .recommendations-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border-left: 6px solid #22c55e;
            padding: 30px;
            margin: 30px 0;
            border-radius: 10px;
        }
        
        .insights-box h3,
        .recommendations-box h3 {
            margin-top: 0;
            color: #1e40af;
        }
        
        .insights-box ul,
        .recommendations-box ul {
            list-style-type: none;
            padding: 0;
        }
        
        .insights-box li,
        .recommendations-box li {
            margin: 15px 0;
            padding-left: 30px;
            position: relative;
        }
        
        .insights-box li:before {
            content: "💡";
            position: absolute;
            left: 0;
            top: 0;
        }
        
        .recommendations-box li:before {
            content: "✅";
            position: absolute;
            left: 0;
            top: 0;
        }
        
        .footer {
            margin-top: 60px;
            text-align: center;
            color: #64748b;
            font-size: 12px;
            border-top: 2px solid #e2e8f0;
            padding-top: 30px;
            page-break-inside: avoid;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        .no-break {
            page-break-inside: avoid;
        }
        
        .highlight {
            background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #f59e0b;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="cover-page">
        <h1>RELATÓRIO DE CLIMA ORGANIZACIONAL</h1>
        <div class="org-name">PAPEM</div>
        <div class="subtitle">Pesquisa Anônima de Ambiente de Trabalho</div>
        <div class="generated-date">
            <strong>Relatório gerado em:</strong><br>
            ${generatedAt}
        </div>
    </div>

    <!-- Executive Summary -->
    <div class="section">
        <h2>📊 RESUMO EXECUTIVO</h2>
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
                <div class="metric-value">${stats.setorDistribution.length}</div>
                <div class="metric-label">Setores Participantes</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${mostActiveSection}</div>
                <div class="metric-label">Setor Mais Ativo</div>
            </div>
        </div>
        
        <div class="highlight">
            <strong>Status Geral:</strong> ${generalSatisfaction >= 80 ? 'Excelente' : generalSatisfaction >= 70 ? 'Bom' : generalSatisfaction >= 60 ? 'Regular' : 'Necessita Atenção'}
            <br><strong>Nota:</strong> Esta pesquisa anônima reflete a percepção de ${stats.totalResponses} colaboradores sobre o clima organizacional no PAPEM.
        </div>
    </div>

    <!-- Charts Section -->
    <div class="section page-break">
        <h2>📈 ANÁLISE VISUAL DE DADOS</h2>
        ${chartsHtml}
    </div>

    <!-- Detailed Tables -->
    <div class="section page-break">
        <h2>📋 DADOS DETALHADOS</h2>
        
        <h3>Distribuição por Setor</h3>
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

        <h3>Distribuição por Rancho</h3>
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

        <h3>Análise de Satisfação por Área</h3>
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

    <!-- Insights and Recommendations -->
    <div class="section page-break">
        <h2>🎯 ANÁLISES E RECOMENDAÇÕES</h2>
        
        <div class="insights-box">
            <h3>💡 Principais Insights</h3>
            <ul>
                <li><strong>Participação:</strong> ${stats.totalResponses} colaboradores participaram da pesquisa, representando um bom engajamento</li>
                <li><strong>Satisfação Geral:</strong> ${Math.round(generalSatisfaction)}% de satisfação média geral ${generalSatisfaction >= 70 ? 'indica um ambiente positivo' : 'requer atenção especial'}</li>
                <li><strong>Setor Mais Engajado:</strong> ${mostActiveSection} com ${stats.setorDistribution[0]?.count || 0} participações demonstra alto interesse</li>
                <li><strong>Distribuição:</strong> ${stats.setorDistribution.length} setores diferentes participaram, mostrando abrangência organizacional</li>
                <li><strong>Áreas de Destaque:</strong> ${Object.entries(analytics.satisfactionAverages)
                  .filter(([_, avg]) => avg !== null && avg >= 4)
                  .map(([field, _]) => getFriendlyFieldName(field))
                  .slice(0, 3)
                  .join(', ') || 'Necessário análise detalhada'}</li>
            </ul>
        </div>
        
        <div class="recommendations-box">
            <h3>✅ Recomendações Estratégicas</h3>
            <ul>
                <li><strong>Satisfação Geral:</strong> ${generalSatisfaction < 70 ? 
                  'Implementar plano de ação focado nas áreas com menor satisfação' : 
                  'Manter as boas práticas atuais e identificar oportunidades de melhoria'}</li>
                <li><strong>Engajamento:</strong> Promover campanhas para aumentar participação em setores menos representados</li>
                <li><strong>Comunicação:</strong> Divulgar os resultados e ações planejadas para demonstrar transparência</li>
                <li><strong>Monitoramento:</strong> Estabelecer pesquisas trimestrais para acompanhar evolução</li>
                <li><strong>Ações Específicas:</strong> Focar nos itens com menor satisfação para implementação de melhorias</li>
                <li><strong>Reconhecimento:</strong> Destacar setores com alta participação e satisfação como exemplos</li>
            </ul>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p><strong>🏛️ RELATÓRIO OFICIAL DE CLIMA ORGANIZACIONAL - PAPEM</strong></p>
        <p>Sistema de Pesquisa Anônima | Dados 100% Reais do Banco PostgreSQL</p>
        <p>Documento gerado automaticamente em: ${generatedAt}</p>
        <p><em>Este relatório pode ser editado e personalizado para apresentações executivas</em></p>
    </div>
</body>
</html>
  `;
}

// Helper function to get friendly field names
function getFriendlyFieldName(field: string): string {
  const fieldNames: Record<string, string> = {
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
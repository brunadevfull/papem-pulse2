// Simple HTML/CSS charts for PDF reports (no external dependencies)

// Colors for consistent theming
const COLORS = [
  '#1e40af', '#dc2626', '#059669', '#d97706', '#7c3aed',
  '#be185d', '#0891b2', '#65a30d', '#4338ca', '#ea580c'
];

// Generate simple CSS-based sector pie chart
export function generateSectorChartHtml(sectorDistribution: any[]): string {
  const total = sectorDistribution.reduce((sum, s) => sum + s.count, 0);
  
  let cumulativePercentage = 0;
  const segments = sectorDistribution.map((sector, index) => {
    const percentage = (sector.count / total) * 100;
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
    const endAngle = (cumulativePercentage + percentage) * 3.6;
    cumulativePercentage += percentage;
    
    return {
      sector: sector.setor,
      count: sector.count,
      percentage: percentage.toFixed(1),
      color: COLORS[index % COLORS.length],
      startAngle,
      endAngle
    };
  });

  const legendItems = segments.map(segment => `
    <div class="legend-item">
      <div class="legend-color" style="background-color: ${segment.color}"></div>
      <span>${segment.sector}: ${segment.count} (${segment.percentage}%)</span>
    </div>
  `).join('');

  return `
    <div class="chart-container">
      <h3>Distribuição por Setor</h3>
      <div class="pie-chart">
        <svg width="300" height="300" viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="120" fill="transparent" stroke="#e5e7eb" stroke-width="2"/>
          ${segments.map((segment, index) => {
            const x1 = 150 + 120 * Math.cos((segment.startAngle - 90) * Math.PI / 180);
            const y1 = 150 + 120 * Math.sin((segment.startAngle - 90) * Math.PI / 180);
            const x2 = 150 + 120 * Math.cos((segment.endAngle - 90) * Math.PI / 180);
            const y2 = 150 + 120 * Math.sin((segment.endAngle - 90) * Math.PI / 180);
            const largeArcFlag = segment.percentage > 50 ? 1 : 0;
            
            return `
              <path d="M 150,150 L ${x1},${y1} A 120,120 0 ${largeArcFlag},1 ${x2},${y2} Z" 
                    fill="${segment.color}" 
                    stroke="white" 
                    stroke-width="2"/>
            `;
          }).join('')}
        </svg>
      </div>
      <div class="chart-legend">
        ${legendItems}
      </div>
    </div>
  `;
}

// Generate simple CSS-based horizontal bar chart for rancho
export function generateRanchoChartHtml(ranchoDistribution: any[]): string {
  const maxCount = Math.max(...ranchoDistribution.map(r => r.count));
  
  const bars = ranchoDistribution.map((rancho, index) => {
    const percentage = (rancho.count / maxCount) * 100;
    const color = COLORS[index % COLORS.length];
    
    return `
      <div class="bar-item">
        <div class="bar-label">${rancho.rancho}</div>
        <div class="bar-container">
          <div class="bar" style="width: ${percentage}%; background-color: ${color}"></div>
          <span class="bar-value">${rancho.count}</span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="chart-container">
      <h3>Distribuição por Rancho</h3>
      <div class="bar-chart">
        ${bars}
      </div>
    </div>
  `;
}

// Generate simple CSS-based satisfaction chart
export function generateSatisfactionChartHtml(satisfactionAverages: Record<string, number>): string {
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

  const validData = Object.entries(satisfactionAverages)
    .filter(([_, avg]) => avg !== null)
    .map(([field, avg]) => ({
      label: fieldNames[field] || field,
      value: (avg as number) * 20, // Convert to percentage
      rawValue: avg as number
    }))
    .sort((a, b) => b.value - a.value);

  const bars = validData.map((item, index) => {
    const color = item.value >= 80 ? '#10b981' : 
                  item.value >= 70 ? '#3b82f6' : 
                  item.value >= 60 ? '#f59e0b' : '#ef4444';
    
    return `
      <div class="satisfaction-item">
        <div class="satisfaction-label">${item.label}</div>
        <div class="satisfaction-container">
          <div class="satisfaction-bar" style="width: ${item.value}%; background-color: ${color}"></div>
          <span class="satisfaction-value">${item.value.toFixed(1)}%</span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="chart-container">
      <h3>Satisfação por Área</h3>
      <div class="satisfaction-chart">
        ${bars}
      </div>
    </div>
  `;
}

// Generate simple doughnut chart for overall satisfaction
export function generateOverallSatisfactionHtml(overallSatisfaction: number): string {
  const satisfaction = Math.round(overallSatisfaction);
  const remaining = 100 - satisfaction;
  
  const satisfactionAngle = (satisfaction / 100) * 360;
  const color = satisfaction >= 80 ? '#10b981' : 
                satisfaction >= 70 ? '#3b82f6' : 
                satisfaction >= 60 ? '#f59e0b' : '#ef4444';

  return `
    <div class="chart-container">
      <h3>Satisfação Geral: ${satisfaction}%</h3>
      <div class="doughnut-chart">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="transparent" stroke="#e5e7eb" stroke-width="20"/>
          <circle cx="100" cy="100" r="80" 
                  fill="transparent" 
                  stroke="${color}" 
                  stroke-width="20"
                  stroke-dasharray="${(satisfactionAngle / 360) * 502.65} 502.65"
                  stroke-dashoffset="125.66"
                  transform="rotate(-90 100 100)"/>
          <text x="100" y="105" text-anchor="middle" font-size="24" font-weight="bold" fill="${color}">
            ${satisfaction}%
          </text>
        </svg>
      </div>
      <div class="doughnut-legend">
        <div class="legend-item">
          <div class="legend-color" style="background-color: ${color}"></div>
          <span>Satisfação: ${satisfaction}%</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #e5e7eb"></div>
          <span>Margem de Melhoria: ${remaining}%</span>
        </div>
      </div>
    </div>
  `;
}

// Generate trend chart (simple line chart)
export function generateTrendChartHtml(timeline: { month: string; count: number }[]): string {
  if (timeline.length === 0) {
    return `
      <div class="chart-container">
        <h3>Evolução de Participação</h3>
        <p class="chart-empty">Sem dados de participação suficientes para exibir o gráfico.</p>
      </div>
    `;
  }

  const counts = timeline.map((item) => item.count);
  const maxValue = Math.max(...counts, 1);
  const chartWidth = 300;
  const chartHeight = 200;
  const paddingLeft = 50;
  const paddingTop = 50;
  const baseLine = paddingTop + chartHeight;
  const xSpacing = timeline.length > 1 ? chartWidth / (timeline.length - 1) : 0;

  const pathData = timeline.map((item, index) => {
    const x = paddingLeft + (index * xSpacing);
    const y = baseLine - ((item.count / maxValue) * (chartHeight - 20));
    return index === 0 ? `M ${x},${y}` : `L ${x},${y}`;
  }).join(' ');

  return `
    <div class="chart-container">
      <h3>Evolução de Participação</h3>
      <div class="line-chart">
        <svg width="360" height="300" viewBox="0 0 360 300">
          <!-- Grid lines -->
          <defs>
            <pattern id="grid" width="${timeline.length > 1 ? xSpacing : chartWidth}" height="30" patternUnits="userSpaceOnUse">
              <path d="M ${timeline.length > 1 ? xSpacing : chartWidth} 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="${chartWidth}" height="${chartHeight}" x="${paddingLeft}" y="${paddingTop}" fill="url(#grid)"/>

          <!-- Line -->
          <path d="${pathData}" fill="none" stroke="#3b82f6" stroke-width="3"/>

          <!-- Points -->
          ${timeline.map((item, index) => {
            const x = paddingLeft + (index * xSpacing);
            const y = baseLine - ((item.count / maxValue) * (chartHeight - 20));
            return `<circle cx="${x}" cy="${y}" r="4" fill="#1d4ed8"/>`;
          }).join('')}

          <!-- Labels -->
          ${timeline.map((item, index) => {
            const x = paddingLeft + (index * xSpacing);
            return `<text x="${x}" y="${baseLine + 25}" text-anchor="middle" font-size="12" fill="#6b7280">${item.month}</text>`;
          }).join('')}

          <!-- Values -->
          ${timeline.map((item, index) => {
            const x = paddingLeft + (index * xSpacing);
            const y = baseLine - ((item.count / maxValue) * (chartHeight - 20)) - 15;
            return `<text x="${x}" y="${y}" text-anchor="middle" font-size="11" fill="#374151">${item.count}</text>`;
          }).join('')}
        </svg>
      </div>
    </div>
  `;
}

// Generate all charts HTML
export function generateAllChartsHtml(data: {
  sectorDistribution: any[];
  ranchoDistribution: any[];
  satisfactionAverages: Record<string, number>;
  overallSatisfaction: number;
  participationTimeline: { month: string; count: number }[];
}): string {
  return `
    <style>
      .chart-container {
        margin: 40px 0;
        text-align: center;
        page-break-inside: avoid;
      }
      
      .chart-container h3 {
        color: #1e3c72;
        font-size: 18px;
        margin-bottom: 20px;
      }
      
      .pie-chart {
        display: inline-block;
        margin: 20px 0;
      }
      
      .chart-legend {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
        margin-top: 20px;
        text-align: left;
      }
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
      }
      
      .legend-color {
        width: 16px;
        height: 16px;
        border-radius: 3px;
      }
      
      .bar-chart {
        max-width: 600px;
        margin: 0 auto;
      }
      
      .bar-item, .satisfaction-item {
        display: flex;
        align-items: center;
        margin: 15px 0;
        gap: 15px;
      }
      
      .bar-label, .satisfaction-label {
        width: 200px;
        text-align: right;
        font-size: 14px;
        font-weight: 500;
      }
      
      .bar-container, .satisfaction-container {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .bar, .satisfaction-bar {
        height: 25px;
        border-radius: 4px;
        min-width: 20px;
      }
      
      .bar-value, .satisfaction-value {
        font-size: 14px;
        font-weight: bold;
        color: #374151;
        min-width: 40px;
      }
      
      .doughnut-chart {
        display: inline-block;
        margin: 20px 0;
      }
      
      .doughnut-legend {
        display: flex;
        justify-content: center;
        gap: 30px;
        margin-top: 20px;
      }
      
      .line-chart {
        display: inline-block;
        margin: 20px 0;
      }

      .chart-empty {
        color: #6b7280;
        font-size: 14px;
        margin: 20px 0;
      }
    </style>

    <div class="charts-section">
      ${generateSectorChartHtml(data.sectorDistribution)}
      ${generateOverallSatisfactionHtml(data.overallSatisfaction)}
      ${generateRanchoChartHtml(data.ranchoDistribution)}
      ${generateSatisfactionChartHtml(data.satisfactionAverages)}
      ${generateTrendChartHtml(data.participationTimeline)}
    </div>
  `;
}

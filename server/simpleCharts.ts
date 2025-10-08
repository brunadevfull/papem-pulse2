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
    'setor_computadores': 'Computadores do Setor',
    'setor_mobiliario': 'Mobiliário do Setor',
    'setor_limpeza': 'Limpeza do Setor',
    'rancho_qualidade_comida': 'Qualidade da Comida do Rancho',
    'escala_equipamentos_condicao': 'Equipamentos em Serviço',
    'escala_pernoite_adequada': 'Instalações de Pernoite',
    'tfm_participa_regularmente': 'Participação no TFM',
    'tfm_incentivo_pratica': 'Incentivo ao TFM',
    'tfm_instalacoes_adequadas': 'Instalações para o TFM'
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
export function generateTrendChartHtml(timeline: Array<{ label: string; count: number }>): string {
  if (!timeline || timeline.length === 0) {
    return `
      <div class="chart-container">
        <h3>Evolução de Participação</h3>
        <p>Sem registros suficientes para exibir a evolução de participação.</p>
      </div>
    `;
  }

  const counts = timeline.map((item) => item.count);
  const maxValue = Math.max(...counts, 1);
  const step = timeline.length > 1 ? 250 / (timeline.length - 1) : 0;

  const points = timeline.map((item, index) => {
    const x = 50 + (index * step);
    const y = 250 - ((item.count / maxValue) * 180);
    return { x, y, value: item.count, label: item.label || `Mês ${index + 1}` };
  });

  const pathData = points
    .map((point, index) => (index === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`))
    .join(' ');

  return `
    <div class="chart-container">
      <h3>Evolução de Participação</h3>
      <div class="line-chart">
        <svg width="350" height="300" viewBox="0 0 350 300">
          <defs>
            <pattern id="grid" width="50" height="30" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="300" height="200" x="50" y="50" fill="url(#grid)"/>

          <path d="${pathData}" fill="none" stroke="#3b82f6" stroke-width="3"/>

          ${points.map((point) => `
            <circle cx="${point.x}" cy="${point.y}" r="4" fill="#1d4ed8"/>
          `).join('')}

          ${points.map((point) => `
            <text x="${point.x}" y="275" text-anchor="middle" font-size="12" fill="#6b7280">${point.label}</text>
          `).join('')}

          ${points.map((point) => `
            <text x="${point.x}" y="${point.y - 15}" text-anchor="middle" font-size="11" fill="#374151">${point.value}</text>
          `).join('')}
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
  timeline: Array<{ label: string; count: number }>;
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
    </style>
    
    <div class="charts-section">
      ${generateSectorChartHtml(data.sectorDistribution)}
      ${generateOverallSatisfactionHtml(data.overallSatisfaction)}
      ${generateRanchoChartHtml(data.ranchoDistribution)}
      ${generateSatisfactionChartHtml(data.satisfactionAverages)}
      ${generateTrendChartHtml(data.timeline)}
    </div>
  `;
}
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import Chart from 'chart.js/auto';

// Configure chart renderer
const chartRenderer = new ChartJSNodeCanvas({
  width: 800,
  height: 400,
  chartCallback: (ChartJS) => {
    // Add custom configurations if needed
    ChartJS.defaults.font.family = 'Arial, sans-serif';
    ChartJS.defaults.font.size = 12;
  },
});

// Common color palette for consistency
const COLORS = [
  '#1e40af', '#dc2626', '#059669', '#d97706', '#7c3aed',
  '#be185d', '#0891b2', '#65a30d', '#4338ca', '#ea580c'
];

// Generate sector distribution pie chart
export async function generateSectorChart(sectorDistribution: any[]) {
  const config = {
    type: 'pie' as const,
    data: {
      labels: sectorDistribution.map(s => s.setor),
      datasets: [{
        data: sectorDistribution.map(s => s.count),
        backgroundColor: COLORS.slice(0, sectorDistribution.length),
        borderColor: '#ffffff',
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Distribuição por Setor',
          font: { size: 16, weight: 'bold' },
          color: '#1f2937',
          padding: 20
        },
        legend: {
          position: 'bottom' as const,
          labels: {
            padding: 15,
            usePointStyle: true,
            font: { size: 11 }
          }
        }
      }
    }
  };

  return await chartRenderer.renderToDataURL(config);
}

// Generate rancho distribution horizontal bar chart
export async function generateRanchoChart(ranchoDistribution: any[]) {
  const config = {
    type: 'bar' as const,
    data: {
      labels: ranchoDistribution.map(r => r.rancho),
      datasets: [{
        label: 'Respondentes',
        data: ranchoDistribution.map(r => r.count),
        backgroundColor: '#3b82f6',
        borderColor: '#1d4ed8',
        borderWidth: 1,
      }]
    },
    options: {
      indexAxis: 'y' as const,
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Distribuição por Rancho',
          font: { size: 16, weight: 'bold' },
          color: '#1f2937',
          padding: 20
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: '#e5e7eb' },
          ticks: { color: '#6b7280' }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#6b7280' }
        }
      }
    }
  };

  return await chartRenderer.renderToDataURL(config);
}

// Generate satisfaction levels horizontal bar chart
export async function generateSatisfactionChart(satisfactionAverages: Record<string, number>) {
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
      value: (avg as number) * 20 // Convert to percentage
    }))
    .sort((a, b) => b.value - a.value); // Sort by satisfaction level

  const config = {
    type: 'bar' as const,
    data: {
      labels: validData.map(d => d.label),
      datasets: [{
        label: 'Satisfação (%)',
        data: validData.map(d => d.value),
        backgroundColor: validData.map(d => 
          d.value >= 80 ? '#10b981' : 
          d.value >= 70 ? '#3b82f6' : 
          d.value >= 60 ? '#f59e0b' : '#ef4444'
        ),
        borderWidth: 0,
      }]
    },
    options: {
      indexAxis: 'y' as const,
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Satisfação por Área (%)',
          font: { size: 16, weight: 'bold' },
          color: '#1f2937',
          padding: 20
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          grid: { color: '#e5e7eb' },
          ticks: { 
            color: '#6b7280',
            callback: function(value) {
              return value + '%';
            }
          }
        },
        y: {
          grid: { display: false },
          ticks: { 
            color: '#6b7280',
            font: { size: 10 }
          }
        }
      }
    }
  };

  return await chartRenderer.renderToDataURL(config);
}

// Generate overall satisfaction doughnut chart
export async function generateOverallSatisfactionChart(overallSatisfaction: number) {
  const satisfactionLevel = overallSatisfaction;
  const remaining = 100 - satisfactionLevel;

  const config = {
    type: 'doughnut' as const,
    data: {
      labels: ['Satisfação', 'Margem de Melhoria'],
      datasets: [{
        data: [satisfactionLevel, remaining],
        backgroundColor: [
          satisfactionLevel >= 80 ? '#10b981' : 
          satisfactionLevel >= 70 ? '#3b82f6' : 
          satisfactionLevel >= 60 ? '#f59e0b' : '#ef4444',
          '#e5e7eb'
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      cutout: '60%',
      plugins: {
        title: {
          display: true,
          text: `Satisfação Geral: ${Math.round(satisfactionLevel)}%`,
          font: { size: 16, weight: 'bold' },
          color: '#1f2937',
          padding: 20
        },
        legend: {
          position: 'bottom' as const,
          labels: {
            padding: 15,
            usePointStyle: true,
            font: { size: 12 }
          }
        }
      }
    }
  };

  return await chartRenderer.renderToDataURL(config);
}

// Generate trend chart (mock data for presentation)
export async function generateTrendChart() {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const responses = [45, 52, 48, 61, 58, 65]; // Mock monthly response data
  
  const config = {
    type: 'line' as const,
    data: {
      labels: months,
      datasets: [{
        label: 'Respostas por Mês',
        data: responses,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#1d4ed8',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Evolução de Participação',
          font: { size: 16, weight: 'bold' },
          color: '#1f2937',
          padding: 20
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: { color: '#e5e7eb' },
          ticks: { color: '#6b7280' }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#e5e7eb' },
          ticks: { 
            color: '#6b7280',
            callback: function(value) {
              return value + ' respostas';
            }
          }
        }
      }
    }
  };

  return await chartRenderer.renderToDataURL(config);
}
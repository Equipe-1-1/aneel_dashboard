// src/mockPlots.js

const generateRandomData = (count, min, max) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push(Math.random() * (max - min) + min);
  }
  return data;
};

const mockPlots = {
  // Novo mock para /dummy_data/
  "/dummy_data/": {
    data: [
      {
        type: "scatter",
        mode: "markers",
        x: generateRandomData(50, 1000, 50000), // Exemplo de GDP per capita
        y: generateRandomData(50, 40, 80),    // Exemplo de expectativa de vida
        marker: {
          size: generateRandomData(50, 10, 60), // Exemplo de tamanho da população
          color: generateRandomData(50, 0, 1).map(val => `rgba(${Math.floor(val*255)}, ${Math.floor(val*255)}, ${Math.floor(val*255)}, 0.8)`), // Cores randômicas
          sizemode: 'area',
          sizeref: 2. * 60 / (20.**2), // Ajuste de referência de tamanho
          sizemin: 4
        },
        text: Array.from({length: 50}, (_, i) => `País ${i+1}`), // Texto para hover
        hovertemplate: '<b>País</b>: %{text}<br>' +
                       '<b>GDP per capita</b>: %{x:.2f}<br>' +
                       '<b>Expectativa de Vida</b>: %{y:.1f}<extra></extra>'
      }
    ],
    layout: {
      title: "Dados Dummy (Gapminder Mock)",
      xaxis: { title: "GDP per capita (log scale)", type: "log" },
      yaxis: { title: "Expectativa de Vida" },
      height: 500
    }
  },
  "/api/plots/power_by_source": {
    data: [
      {
        type: "pie",
        labels: ["Solar", "Eólica", "Hídrica", "Biomassa", "Outras"],
        values: generateRandomData(5, 1000, 5000),
        hole: 0.4,
        marker: {
          colors: ['#FFC300', '#DAF7A6', '#C70039', '#900C3F', '#4A4A4A']
        }
      }
    ],
    layout: {
      title: "Potência Total por Fonte (Mock)",
      showlegend: true,
      height: 450 // Ajuste para o card
    }
  },
  "/api/plots/monthly_growth": {
    data: [
      {
        type: "scatter",
        mode: "lines+markers",
        name: "Instalações Mensais",
        x: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        y: generateRandomData(12, 50, 200),
        marker: { color: '#3498db' }
      },
      {
        type: "scatter",
        mode: "lines+markers",
        name: "Potência Acumulada",
        x: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        y: generateRandomData(12, 500, 2000).sort((a, b) => a - b), // Crescente
        marker: { color: '#2ecc71' }
      }
    ],
    layout: {
      title: "Evolução Temporal (Mock)",
      xaxis: { title: "Mês" },
      yaxis: { title: "Quantidade / Potência (kW)" },
      height: 450
    }
  },
  "/api/plots/modality_distribution": {
    data: [
      {
        type: "bar",
        x: ["Autoconsumo Remoto", "Geração Compartilhada", "Múltiplas UC's", "Micro/Minigeração"],
        y: generateRandomData(4, 1000, 5000),
        marker: { color: ['#1abc9c', '#3498db', '#9b59b6', '#f1c40f'] }
      }
    ],
    layout: {
      title: "Distribuição por Modalidade (Mock)",
      xaxis: { title: "Modalidade" },
      yaxis: { title: "Número de Instalações" },
      height: 650 // Ajuste para o estilo
    }
  },
  "/api/plots/modality_trends": {
    data: [
      {
        type: "scatter",
        mode: "lines",
        name: "Autoconsumo Remoto",
        x: ["2022", "2023", "2024", "2025"],
        y: generateRandomData(4, 100, 1000).sort((a, b) => a - b),
        line: { color: '#27ae60' }
      },
      {
        type: "scatter",
        mode: "lines",
        name: "Geração Compartilhada",
        x: ["2022", "2023", "2024", "2025"],
        y: generateRandomData(4, 50, 800).sort((a, b) => a - b),
        line: { color: '#e67e22' }
      }
    ],
    layout: {
      title: "Evolução das Modalidades (Mock)",
      xaxis: { title: "Ano" },
      yaxis: { title: "Potência Instalada (kW)" },
      height: 500
    }
  },
  "/api/plots/regional_distribution": {
    data: [
      {
        type: "bar",
        x: ["Sudeste", "Sul", "Nordeste", "Norte", "Centro-Oeste"],
        y: generateRandomData(5, 10000, 50000),
        marker: { color: ['#f39c12', '#d35400', '#c0392b', '#7f8c8d', '#2c3e50'] }
      }
    ],
    layout: {
      title: "Potência Instalada por Região (Mock)",
      xaxis: { title: "Região" },
      yaxis: { title: "Potência (kW)" },
      height: 550 // Ajuste para o estilo
    }
  },
  "/api/plots/top_states": {
    data: [
      {
        type: "bar",
        x: ["SP", "MG", "RS", "PR", "BA", "SC", "GO", "RJ", "CE", "PE"],
        y: generateRandomData(10, 5000, 20000).sort((a, b) => b - a), // Decrescente
        marker: { color: '#8e44ad' }
      }
    ],
    layout: {
      title: "Top 10 Estados (Mock)",
      xaxis: { title: "Estado" },
      yaxis: { title: "Potência (kW)" },
      height: 500
    }
  },
  "/api/plots/adoption_trend": {
    data: [
      {
        type: "scatter",
        mode: "lines",
        name: "Adoção",
        x: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
        y: generateRandomData(8, 1000, 10000).sort((a, b) => a - b),
        line: { color: '#e74c3c', width: 3 }
      }
    ],
    layout: {
      title: "Tendência de Adoção (Mock)",
      xaxis: { title: "Ano" },
      yaxis: { title: "Número de Unidades Conectadas" },
      height: 550 // Ajuste para o estilo
    }
  },
  "/api/plots/yearly_comparison": {
    data: [
      {
        type: "bar",
        name: "2024",
        x: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
        y: generateRandomData(6, 200, 800),
        marker: { color: '#34495e' }
      },
      {
        type: "bar",
        name: "2025",
        x: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
        y: generateRandomData(6, 300, 1000),
        marker: { color: '#95a5a6' }
      }
    ],
    layout: {
      title: "Comparativo Anual (Mock)",
      xaxis: { title: "Mês", tickangle: -45 },
      yaxis: { title: "Novas Conexões" },
      barmode: 'group',
      height: 500
    }
  }
};

// Funções para dados regionais dinâmicos
const getRegionalPlotData = (regionId, type) => {
  const regionData = {
    norte: { states: ["AM", "PA", "AC", "RO", "RR", "AP", "TO"], types: ["Solar", "Hídrica", "Biomassa"] },
    nordeste: { states: ["BA", "CE", "PE", "RN", "PB", "AL", "SE", "PI", "MA"], types: ["Solar", "Eólica", "Hídrica"] },
    sudeste: { states: ["SP", "MG", "RJ", "ES"], types: ["Solar", "Hídrica", "Biomassa"] },
    sul: { states: ["RS", "PR", "SC"], types: ["Solar", "Eólica", "Hídrica"] },
    "centro-oeste": { states: ["GO", "MT", "MS", "DF"], types: ["Solar", "Biomassa", "Outras"] }
  };

  const selectedRegion = regionData[regionId];
  if (!selectedRegion) return null;

  if (type === "power_by_state") {
    return {
      data: [
        {
          type: "bar",
          x: selectedRegion.states,
          y: generateRandomData(selectedRegion.states.length, 500, 5000),
          marker: { color: '#2980b9' }
        }
      ],
      layout: {
        title: `Potência por Estado - Região ${regionId.toUpperCase()} (Mock)`,
        xaxis: { title: "Estado" },
        yaxis: { title: "Potência (kW)" },
        height: 500
      }
    };
  } else if (type === "generation_types") {
    return {
      data: [
        {
          type: "pie",
          labels: selectedRegion.types,
          values: generateRandomData(selectedRegion.types.length, 100, 1000),
          hole: 0.3,
          marker: {
            colors: ['#f1c40f', '#2ecc71', '#3498db']
          }
        }
      ],
      layout: {
        title: `Tipos de Geração - Região ${regionId.toUpperCase()} (Mock)`,
        showlegend: true,
        height: 500
      }
    };
  }
  return null;
};

export { mockPlots, getRegionalPlotData };
// src/components/PlotComponent.jsx (ou .tsx)

import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import './PlotComponent.css'; // Estilos específicos
import { mockPlots, getRegionalPlotData } from '../mockPlots'; // Importe os dados mockados

function PlotComponent({ endpoint, style = {}, className = '' }) {
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPlotData(null); // Limpa dados anteriores

    // Simula um atraso de rede
    const mockFetchDelay = setTimeout(() => {
      let dataToSet = null;

      // Lógica para endpoints regionais dinâmicos
      if (endpoint.startsWith("/api/plots/region/")) {
        const parts = endpoint.split('/');
        const regionId = parts[4]; // Ex: /api/plots/region/norte/power_by_state -> "norte"
        const chartType = parts[5]; // Ex: /api/plots/region/norte/power_by_state -> "power_by_state"
        dataToSet = getRegionalPlotData(regionId, chartType);
      } else {
        // Lógica para endpoints estáticos
        dataToSet = mockPlots[endpoint];
      }

      if (dataToSet) {
        setPlotData(dataToSet);
      } else {
        setError(new Error(`Dados mockados não encontrados para o endpoint: ${endpoint}`));
      }
      setLoading(false);
    }, 500); // Simula 0.5 segundo de carregamento

    return () => clearTimeout(mockFetchDelay); // Limpa o timeout se o componente for desmontado
  }, [endpoint]);

  if (loading) return <div className="plot-loading">Carregando gráfico...</div>;
  if (error) return <div className="plot-error">Erro: {error.message}</div>;
  if (!plotData) return <div className="plot-no-data">Dados não disponíveis</div>;

  return (
    <div className={`plot-container ${className}`} style={style}>
      <Plot
        data={plotData.data}
        layout={{
          ...plotData.layout,
          autosize: true,
          margin: { t: 40, r: 30, b: 40, l: 50 }
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          scrollZoom: true
        }}
        useResizeHandler
        style={{ width: '100%', height: '100%', minHeight: '500px' }}
      />
    </div>
  );
}

export default PlotComponent;
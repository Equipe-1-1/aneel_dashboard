import React from 'react';
import PlotComponent from '../components/PlotCard';
import './trends.css';

function Trends() {
  return (
    <div className="trends-container">
      <h2>Tendências Temporais</h2>
      
      <div className="trend-chart">
        <h3>Adoção ao Longo do Tempo</h3>
        <PlotComponent 
          endpoint="/api/plots/adoption_trend" 
          style={{ height: '600px' }}
        />
      </div>
      
      <div className="trend-chart">
        <h3>Comparativo Anual</h3>
        <PlotComponent 
          endpoint="/api/plots/yearly_comparison" 
        />
      </div>
    </div>
  );
}

export default Trends;
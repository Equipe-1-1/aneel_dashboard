import React from 'react';
import PlotComponent from '../components/PlotComponent';
import './national.css';

function National() {
  return (
    <div className="national-container">
      <h2>Panorama Nacional</h2>
      
      <div className="chart-section">
        <h3>Distribuição por Região</h3>
        <PlotComponent 
          endpoint="/api/plots/regional_distribution" 
          style={{ height: '600px' }}
        />
      </div>
      
      <div className="chart-section">
        <h3>Top 10 Estados</h3>
        <PlotComponent 
          endpoint="/api/plots/top_states" 
        />
      </div>
    </div>
  );
}

export default National;
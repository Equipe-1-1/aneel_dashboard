import React from 'react';
import PlotComponent from '../components/PlotComponent';
import './modalities.css';

function Modalities() {
  return (
    <div className="modalities-container">
      <h2>Modalidades de Geração</h2>
      
      <div className="modality-chart">
        <h3>Distribuição por Modalidade</h3>
        <PlotComponent 
          endpoint="/api/plots/modality_distribution" 
          style={{ height: '700px' }}
        />
      </div>
      
      <div className="modality-chart">
        <h3>Evolução das Modalidades</h3>
        <PlotComponent 
          endpoint="/api/plots/modality_trends" 
        />
      </div>
    </div>
  );
}

export default Modalities;
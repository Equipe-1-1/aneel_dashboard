import React, { useState } from 'react';
import PlotComponent from '../components/PlotCard';
import './regional.css';

const regions = [
  { id: 'norte', name: 'Norte' },
  { id: 'nordeste', name: 'Nordeste' },
  { id: 'sudeste', name: 'Sudeste' },
  { id: 'sul', name: 'Sul' },
  { id: 'centro-oeste', name: 'Centro-Oeste' }
];

function Regional() {
  const [selectedRegion, setSelectedRegion] = useState('sudeste');

  return (
    <div className="regional-container">
      <h2>Panorama Regional</h2>
      
      <div className="region-selector">
        <label htmlFor="region-select">Selecione a região:</label>
        <select
          id="region-select"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          {regions.map(region => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="chart-grid">
        <div className="chart-card">
          <h3>Potência por Estado</h3>
          <PlotComponent 
            endpoint={`/api/plots/region/${selectedRegion}/power_by_state`} 
          />
        </div>
        
        <div className="chart-card">
          <h3>Tipos de Geração</h3>
          <PlotComponent 
            endpoint={`/api/plots/region/${selectedRegion}/generation_types`} 
          />
        </div>
      </div>
    </div>
  );
}

export default Regional;
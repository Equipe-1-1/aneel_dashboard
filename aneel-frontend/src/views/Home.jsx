// src/pages/Home.jsx
import React from 'react';
import PlotComponent from '../components/PlotComponent';
import './home.css';

function Home() {
  return (
    <div className="dashboard">
      <h2>Bem-vindo ao Dashboard de Geração Distribuída</h2>

      <div className="grid-container">
        <div className="card">
          <h3>Potência Total por Fonte</h3>
          <PlotComponent
            endpoint="/api/plots/power_by_source" // Este endpoint agora é mockado
            className="power-source-chart"
          />
        </div>

        <div className="card">
          <h3>Evolução Temporal</h3>
          <PlotComponent
            endpoint="/api/plots/monthly_growth" // Este endpoint agora é mockado
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

function PlotComponent({ endpoint }) {
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlotData = async () => {
      try {
      const response = await fetch('http://localhost:8000' + endpoint)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const rawData = await response.text();
        let parsedData;

        try {
            parsedData = JSON.parse(rawData)
        } catch (parseError) {
            console.error("Failed to parse JSON:", parseError)
            console.error("Raw data:", rawData)
            throw new Error("Failed to parse plot data as JSON.")
        }

        setPlotData(parsedData);
      } catch (error) { 
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlotData();
  }, []);

  if (loading) {
    return <div>Loading plot...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!plotData) {
    return <div>No plot data available.</div>;
  }

  return (
    <div style={{ width: '100%', minHeight: '500px' }}>
      <Plot
        data={plotData.data}
        layout={plotData.layout}
        frames={plotData.frames}
        config={{ responsive: true }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default PlotComponent;
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

function PlotComponent() {
  // State variables, no explicit type annotations needed in JS
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlotData = async () => {
      try {
        const response = await fetch('http://localhost:8000/plot-data/'); // Adjust port if needed
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the response as raw text first, then explicitly parse it as JSON
        // This handles cases where response.json() might not automatically parse
        const rawData = await response.text();
        let parsedData;

        try {
            parsedData = JSON.parse(rawData); // Parse the string into a JS object
        } catch (parseError) {
            console.error("Failed to parse JSON:", parseError);
            console.error("Raw data:", rawData);
            throw new Error("Failed to parse plot data as JSON.");
        }

        setPlotData(parsedData);
      } catch (error) { // 'error' type is inferred by JS, no explicit 'any' needed
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

  // console.log("Plot Data Received:", plotData); // Uncomment for debugging if needed

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Plot
        data={plotData.data}
        layout={plotData.layout}
        frames={plotData.frames} // frames is optional
        config={{ responsive: true }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default PlotComponent;
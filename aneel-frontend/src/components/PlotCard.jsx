import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Spinner, Card } from 'react-bootstrap';
import styled from 'styled-components';

function PlotCard({ endpoint, className, style }) {
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

        setPlotData(parsedData)
      } catch (error) { 
        setError(error)
      } finally {
        setLoading(false)
      }
    };

    fetchPlotData();
  }, []);

  const handleMouseEnter = () => {
    document.body.classList.add("no-scroll");
  };

  const handleMouseLeave = () => {
    document.body.classList.remove("no-scroll");
  };

  const FrameWork = ({ children }) => (
    <StyledCard
      className={className}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <StyledCardBody>
        <Card.Title>Plot</Card.Title>
        {children}
      </StyledCardBody>
    </StyledCard>
  );

  if (loading) {
    return (
    <FrameWork>
      <Spinner animation="border" />
    </FrameWork>
    )
  }

  if (error) {
    return <FrameWork>Error: {error.message}</FrameWork>
  }

  if (!plotData) {
    return <FrameWork>No plot data available.</FrameWork>
  }

  return (
    <FrameWork>
      <Plot
        data={plotData.data}
        layout={{
          ...plotData.layout,
          autosize: true,
          width: undefined,
          height: undefined,
        }}
        frames={plotData.frames}
        config={{ responsive: true }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%", minHeight: 500 }}
      />
    </FrameWork>
  );
}

export default PlotCard

const StyledCard = styled(Card)`
  background: white;
  border-radius: 10px;
  margin-bottom: 30px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;
    &:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    transform: translateY(-4px) scale(1.01);
    cursor: pointer;
  }
`

const StyledCardBody = styled(Card.Body)`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-width: 0;
`
import PlotCard from '../components/PlotCard';
import styled from 'styled-components';

function National() {
  return (
  <Main className="national-container" >
    <FlexContainer>
      <PlotCard style={{ flex: "2 1 0" }} endpoint="/national_production_horizontal_by_region/" />
      <PlotCard style={{ flex: "1 1 0" }} endpoint="/national_production_vertical_by_region/" />
    </FlexContainer>
    <PlotCard endpoint="/national_production_map/" />
  </Main>
  )
}

export default National;

const Main = styled.main`
  padding: 20px;
  margin: 0 auto;
  width: 100%;
  min-width: 500px;
`

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 1000px) {
    flex-direction: column;
  }
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;
`
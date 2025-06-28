import PlotComponent from "../components/PlotComponent";
import '../styles/national.css';

function National() {
  return <div className="by_region" >
    <PlotComponent endpoint="/national_production_horizontal_by_region/" />
    <PlotComponent endpoint="/national_production_vertical_by_region/" />
  </div>
}

export default  National;
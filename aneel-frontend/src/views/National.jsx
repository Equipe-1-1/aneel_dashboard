import PlotComponent from "../components/PlotComponent";
import '../styles/national.css';

function National() {
  return <div className="by_region" >
    <PlotComponent endpoint="/national-horizontal/"/>
  </div>
}

export default  National;
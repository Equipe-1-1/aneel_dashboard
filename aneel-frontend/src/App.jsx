import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PlotComponent from './components/PlotComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>My Resampled Plot (TypeScript)</h1>
      <PlotComponent />
    </div>
  )
}

export default App

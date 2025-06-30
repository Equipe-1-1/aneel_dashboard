import React, { useState } from 'react'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PlotComponent from './components/PlotCard'
import OptionBar from './components/OptionBar'
import National from './views/National';
import Regional from './views/Regional';
import Trends from './views/Trends';
import Modalities from './views/Modalities';
import Home from './views/Home';

function App() {
  return (
    <>
      <React.StrictMode>
        <Router>
          <OptionBar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/national" element={<National />} />
            <Route path="/regional" element={<Regional />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/modalities" element={<Modalities />} />
          </Routes>

        </Router>
      </React.StrictMode>

    </>
  )
}

export default App

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Career from './pages/Career';
import Lab from './pages/Lab';
import Dev from './pages/Dev';

function App() {
  return (
    <Router>
      {/* HIER KÖNNTE DEINE GLOBALE NAVBAR STEHEN (wird auf jeder Seite angezeigt) */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/career" element={<Career />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/dev" element={<Dev />} />
      </Routes>
    </Router>
  );
}

export default App;
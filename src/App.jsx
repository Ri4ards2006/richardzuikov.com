import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Career from './pages/Career';
import Lab from './pages/Lab';
import Dev from './pages/Dev';

function App() {
  return (
    <Router>
      {/* GLOBALER HEADER (Auf jeder Unterseite sichtbar) */}
      <header>
        <Link to="/" className="site-name">Richard Zuikov</Link>
        <nav>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">Über mich</Link>
          <Link to="/career" className="nav-link">Quest Log</Link>
          <Link to="/lab" className="nav-link">Labor</Link>
          <Link to="/dev" className="nav-link">Dev Log</Link>
        </nav>
        <div className="header-right">
          <span className="nav-hook">SL 19 · Nerd</span>
        </div>
      </header>

      {/* SEITEN-INHALT */}
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
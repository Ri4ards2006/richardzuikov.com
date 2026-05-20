import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Career from './pages/Career'; // Das wird dein altes timeline.html
import Lab from './pages/Lab';       // Das wird dein altes projects.html
import Dev from './pages/Dev';       // Dein Tech-Logbuch
import Contact from './pages/Contact'; // Dein altes worktogether.html

function Navigation() {
  const location = useLocation();

  return (
    <nav>
      <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
      <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>Über mich</Link>
      <Link to="/career" className={`nav-link ${location.pathname === '/career' ? 'active' : ''}`}>Quest Log</Link>
      <Link to="/lab" className={`nav-link ${location.pathname === '/lab' ? 'active' : ''}`}>Labor</Link>
      <Link to="/dev" className={`nav-link ${location.pathname === '/dev' ? 'active' : ''}`}>Dev Log</Link>
      <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Kontakt</Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <header>
        <Link to="/" className="site-name">Richard Zuikov</Link>
        <Navigation />
        <div className="header-right">
          <button className="lang-toggle" id="langToggle">EN</button>
          <button className="theme-toggle" id="themeToggle" aria-label="Toggle theme">
            <svg className="icon-sun" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <svg className="icon-moon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
          <span className="nav-hook" style={{ marginLeft: '15px', fontSize: '0.65rem', opacity: 0.6 }}>SL 20 · Nerd</span>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/career" element={<Career />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/dev" element={<Dev />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
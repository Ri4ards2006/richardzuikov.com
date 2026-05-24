import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  return (
    <header className="main-header">
      <Link to="/" className="site-name">Richard Zuikov</Link>
      <nav>
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
        <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
        <Link to="/career" className={`nav-link ${location.pathname === '/career' ? 'active' : ''}`}>Timeline</Link>
        <Link to="/lab" className={`nav-link ${location.pathname === '/lab' ? 'active' : ''}`}>Projects</Link>
        <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
      </nav>
      <div className="header-right">
        <span className="nav-hook">RZ 20 · Embedded Systems</span>
        <button className="lang-toggle">EN</button>
      </div>
    </header>
  );
}

export default Header;
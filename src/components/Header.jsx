import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  return (
    <header className="main-header">
      <Link to="/" className="site-name">Richard Zuikov</Link>
      <nav>
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
        <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>Lore</Link>
        <Link to="/lab" className={`nav-link ${location.pathname === '/lab' ? 'active' : ''}`}>Armory</Link>
        <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Bonfire</Link>
      </nav>
      <div className="header-right">
        <span className="nav-hook">SL 19 · Embedded Systems · Ashen One</span>
        <button className="lang-toggle" id="langToggle">EN</button>
      </div>
    </header>
  );
}

export default Header;
import React from 'react';
import { Link } from 'react-router-dom';
import bossImg from '../assets/Me_Picture.png';

function Home() {
  return (
    <main className="home-main">
      <div className="home-hero">
        <div className="home-img-wrap">
          <img src={bossImg} alt="Richard Zuikov" className="boss-img" />
        </div>
        <div className="home-text">
          <p className="home-label">Flensburg, DE · Soul Level 19</p>
          <h1 className="home-name">Richard<br /><em>Zuikov</em></h1>
          <p className="home-tagline">Low-Level Architekt, Hardware Enthusiast<br />& Linux Guardian.</p>
          
          <div className="home-buttons">
            <Link to="/career" className="btn-primary">Quest Log ansehen</Link>
            <Link to="/contact" className="btn-secondary">Beschwörung anfordern</Link>
          </div>
        </div>
      </div>

      <div className="home-footer-bar">
        <span>C++ · Go · Linux · Embedded</span>
        <span className="dot">·</span>
        <span className="status-online">Available for Co-op</span>
      </div>
    </main>
  );
}

export default Home;
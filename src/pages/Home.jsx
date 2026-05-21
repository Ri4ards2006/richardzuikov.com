import React from 'react';
import { Link } from 'react-router-dom';
import bossImg from '../assets/Me_Picture.png';
// Importiere das neue MacBook!
import { MacbookScroll } from '../components/MacbookScroll';
// Falls du ein Bild im Mac anzeigen willst, importierst du es hier:
// import labScreen from '../assets/Home_Lab.jpeg';

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

      {/* HIER ENTSTEHT DAS ANIMIERTE MACBOOK */}
      <div className="macbook-section-wrapper">
        <MacbookScroll 
          title="ARMORY INCOMING · HARDWARE ENVIRONMENT"
          src={bossImg} // Hier kannst du später dein Lab-Bild reinbauen!
          badge={<span style={{color: 'red'}}>SL 19</span>}
        />
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
import React from 'react';

function Home() {
  return (
    <main className="home-main">
      <div className="home-hero">
        <div className="home-img-wrap">
          {/* Wichtig: Der Pfad zu deinen Assets bleibt derselbe */}
          <img src="/assets-shared/img/Me_Picture.png" alt="Richard Zuikov" />
        </div>
        
        <div className="home-text">
          <p className="home-label">Flensburg, DE · Soul Level 19</p>
          <h1 className="home-name">
            Richard<br /><em>Zuikov</em>
          </h1>
          <p className="home-tagline">
            Low-Level Architekt, Hardware Enthusiast & Linux Geek
          </p>
          
          <div className="home-buttons">
            <a href="/timeline" className="btn-primary">Quest Log ansehen</a>
            <a href="/worktogether" className="btn-secondary">Beschwörung anfordern</a>
          </div>
        </div>
      </div>

      <div className="home-footer-bar">
        <span>© {new Date().getFullYear()} Richard Zuikov. All rights reserved.</span>
        <span className="dot">·</span>
        <a href="https://github.com/Ri4ards2006" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </main>
  );
}

export default Home;
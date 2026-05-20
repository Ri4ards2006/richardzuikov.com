import React from 'react';

function About() {
  return (
    <main className="page-main">
      <div className="page-header">
        <h1 className="page-title">About</h1>
      </div>
      
      <div className="about-layout">
        {/* Linke Spalte: Sticky-Sidebar */}
        <div className="about-sidebar">
          <div className="sidebar-img-wrap">
            <img 
              src="/assets-shared/img/Me_Picture.png" 
              alt="Richard Zuikov" 
              className="sidebar-img" 
            />
          </div>
        </div>

        {/* Rechte Spalte: Der eigentliche Content */}
        <div className="about-body">
          <section className="about-section">
            <h2 className="about-section-title">Profile</h2>
            <p className="about-p">
              20-year-old IT Systems Electronics apprentice (IT-Systemelektroniker) at R2P GmbH in Flensburg, Germany. 
              Working at the intersection of hardware and software — from soldering embedded targets to writing Go parsers 
              that consume the data those targets produce.
            </p>
            <p className="about-p">
              Previously completed a 3-year ITA apprenticeship at RBZ-Eckener covering MATLAB, Kotlin, Java, 
              Jetpack Compose, Docker, electrical engineering, and networking. Volunteer firefighter. Always building.
            </p>
          </section>

          <section className="about-section">
            <h2 className="about-section-title">Field</h2>
            <div className="field-list">
              <span>Embedded Systems & Hardware</span>
              <span>Low-Level Programming</span>
              <span>Networking & OpSec</span>
              <span>Digital Logic / FPGA</span>
              <span>Home Lab & Self-Hosting</span>
              <span>PCB Design (KiCad / EasyEDA)</span>
              <span>Signal Analysis & Messtechnik</span>
            </div>
          </section>

          <section className="about-section">
            <h2 className="about-section-title">Skills</h2>
            <div className="skills-table">
              <div className="skill-row">
                <span className="skill-cat">Hardware</span>
                <span className="skill-items">ESP32 · ATmega · Arduino Mega · STM32 · Tang Nano 9K · Raspberry Pi · Oszilloskop · Signalgenerator</span>
              </div>
              <div className="skill-row">
                <span className="skill-cat">Languages</span>
                <span className="skill-items">C++ · Go · C · Kotlin · Java · Python · Assembly (learning)</span>
              </div>
              <div className="skill-row">
                <span className="skill-cat">Protocols</span>
                <span className="skill-items">SPI · I2C · UART · PWM · TCP/IP · VLANs · VPN</span>
              </div>
              <div className="skill-row">
                <span className="skill-cat">Tools</span>
                <span className="skill-items">Docker · Linux · Git · KiCad · EasyEDA · TIA Portal · VS Code</span>
              </div>
              <div className="skill-row">
                <span className="skill-cat">Spoken</span>
                <span className="skill-items">Latvian · Russian (native) · German C1 · English C1 · Danish A2 · Mandarin (learning)</span>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2 className="about-section-title">Currently</h2>
            <div className="currently-list">
              <div className="currently-item">
                <span className="c-label">Apprenticeship</span>
                <span className="c-value">IT-Systemelektroniker @ R2P GmbH — finishing summer 2027</span>
              </div>
              <div className="currently-item">
                <span className="c-label">Learning</span>
                <span className="c-value">Go · CCNA (May 2026) · Tang Nano 9K FPGA · Calculus</span>
              </div>
              <div className="currently-item">
                <span className="c-label">Building</span>
                <span className="c-value">GO-CORE-LAB · richardzuikov.com · Home lab</span>
              </div>
              <div className="currently-item">
                <span className="c-label">Reading</span>
                <span className="c-value">Fourier & Laplace · Dostoevsky · Orthodox Study Bible</span>
              </div>
              <div className="currently-item">
                <span className="c-label">Interests</span>
                <span className="c-value">Chess · Strength training · Soldering · Traveling · Cooking</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default About;
import React from 'react';

function Lab() {
  return (
    <main className="page-main">
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">Selected work — hardware, embedded, and software</p>
      </div>

      <div className="projects-grid">
        {/* PROJECT 1: AD-LED Clock */}
        <a 
          href="https://github.com/Ri4ards2006/Analog-Digital-Clock" 
          className="project-card" 
          data-year="2024" 
          target="_blank" 
          rel="noreferrer"
        >
          <div className="project-card-img">
            <img src="/src/assets/AD_DA_Clock.png" alt="AD-LED Clock" />
          </div>
          <div className="project-card-body">
            <div className="project-card-meta">
              <span className="project-year">2024</span>
              <span className="project-type">Embedded · Hardware</span>
            </div>
            <h3 class="project-card-title">AD-LED Clock</h3>
            <p className="project-card-desc">
              ATmega8535 driven LED-Matrix clock with shift registers, brightness control, and time sync. 
              Pure C++ at register level — no external libraries. Circuit designed in KiCad, housing fully 3D-printed.
            </p>
            <div className="project-card-tags">
              <span>C++</span><span>ATmega8535</span><span>LED Matrix</span><span>KiCad</span><span>3D Print</span>
            </div>
          </div>
        </a>

        {/* PROJECT 2: Traffic Light System */}
        <a 
          href="https://github.com/Ri4ards2006/Traffic-Light" 
          className="project-card" 
          data-year="2024" 
          target="_blank" 
          rel="noreferrer"
        >
          <div className="project-card-img">
            <img src="/src/assets/Traffic_System.jpg" alt="Traffic Light System" />
          </div>
          <div className="project-card-body">
            <div className="project-card-meta">
              <span className="project-year">2024</span>
              <span className="project-type">Embedded · Hardware</span>
            </div>
            <h3 className="project-card-title">Traffic Light System</h3>
            <p className="project-card-desc">
              Full street crossing simulation — traffic lights, pedestrian signals, day/night mode, ultrasonic sensors. 
              Arduino Mega, LN298, interrupt-driven pedestrian buttons. Traffic light housings fully 3D-printed and CAD-designed.
            </p>
            <div className="project-card-tags">
              <span>C++</span><span>Arduino Mega</span><span>Ultraschall</span><span>3D Print</span><span>CAD</span>
            </div>
          </div>
        </a>

        {/* PROJECT 3: Weather Station 2.0 */}
        <a 
          href="https://github.com/Ri4ards2006/Weather_Station2.0" 
          className="project-card" 
          data-year="2024" 
          target="_blank" 
          rel="noreferrer"
        >
          <div className="project-card-img">
            <img src="/src/assets/Weather_Station.png" alt="Weather Station 2.0" />
          </div>
          <div className="project-card-body">
            <div className="project-card-meta">
              <span className="project-year">2024</span>
              <span className="project-type">Embedded · IoT</span>
            </div>
            <h3 className="project-card-title">Weather Station 2.0</h3>
            <p className="project-card-desc">
              Modular IoT weather station on ESP32. Multi-sensor fusion, WiFi telemetry, clean data pipeline. 
              Each sensor module independently swappable — designed for extensibility from the start.
            </p>
            <div className="project-card-tags">
              <span>C++</span><span>ESP32</span><span>IoT</span><span>WiFi</span><span>Modular</span>
            </div>
          </div>
        </a>

        {/* PROJECT 4: GO-CORE-LAB */}
        <a 
          href="https://github.com/Ri4ards2006/GO-CORE-LAB" 
          className="project-card" 
          data-year="2025" 
          target="_blank" 
          rel="noreferrer"
        >
          <div className="project-card-img">
            <img src="/src/assets/Go_Lab_Reworked.png" alt="GO-CORE-LAB" />
          </div>
          <div className="project-card-body">
            <div className="project-card-meta">
              <span className="project-year">2025</span>
              <span className="project-type">Software · Research</span>
            </div>
            <h3 className="project-card-title">GO-CORE-LAB</h3>
            <p className="project-card-desc">
              Personal low-level research framework in Go. ELF/PE binary parsing, hardware bridge for 
              SPI/I2C/UART capture from embedded targets, network probe module. Statically compiled — drop anywhere and run.
            </p>
            <div className="project-card-tags">
              <span>Go</span><span>ELF Parser</span><span>Binary Analysis</span><span>Networking</span>
            </div>
          </div>
        </a>

        {/* PROJECT 5: Home Lab */}
        <div className="project-card" data-year="2025">
          <div className="project-card-img">
            <img src="/src/assets/Home_Lab.jpeg" alt="Home Lab Server" />
          </div>
          <div className="project-card-body">
            <div className="project-card-meta">
              <span className="project-year">2025</span>
              <span className="project-type">Infrastructure · Self-Hosting</span>
            </div>
            <h3 className="project-card-title">Home Lab — Server & Network</h3>
            <p className="project-card-desc">
              Private server infrastructure on Ugreen NAS. Docker services, Cloudflare Tunnels, VPN, VLANs, 
              switch administration, monitoring. This website runs on it. Built and maintained entirely by hand.
            </p>
            <div className="project-card-tags">
              <span>Docker</span><span>Linux</span><span>Cloudflare</span><span>VPN</span><span>VLANs</span>
            </div>
          </div>
        </div>

        {/* PROJECT 6: Electronics Workbench */}
        <div className="project-card" data-year="2025">
          <div className="project-card-img">
            <img src="/src/assets/Home_Soldering_Station.jpeg" alt="Electronics Workbench" />
          </div>
          <div className="project-card-body">
            <div className="project-card-meta">
              <span className="project-year">2025</span>
              <span className="project-type">Hardware · Lab</span>
            </div>
            <h3 className="project-card-title">Electronics Workbench</h3>
            <p className="project-card-desc">
              Personal electronics lab for embedded development and signal analysis. Oscilloscope, signal generator, 
              bench PSU, SMD/THT soldering station. Signal capture (PWM, UART, I2C), PCB design with KiCad and EasyEDA, 
              rapid prototyping with 3D print.
            </p>
            <div className="project-card-tags">
              <span>Oszilloskop</span><span>SMD/THT</span><span>KiCad</span><span>EasyEDA</span><span>3D Print</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Lab;
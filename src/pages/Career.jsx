import React from 'react';

function Career() {
  return (
    <main className="page-main">
      <div className="page-header">
        <h1 className="page-title">Quest Log</h1>
        <p className="page-subtitle">Wie ich dahin kam, wo ich heute bin — Stationen und Erfolge</p>
      </div>

      <div className="timeline">

        {/* QUEST 1: R2P Ausbildung */}
        <div className="tl-item">
          <div className="tl-year">2025–27</div>
          <div className="tl-content">
            <span className="tl-tag">Aktuell · Ausbildung</span>
            <h3 className="tl-title">IT-Systemelektroniker — R2P GmbH</h3>
            <p className="tl-desc">
              Verkürzter Ausbildungsgang, Abschluss Sommer 2027. Montage, Inbetriebnahme und Wartung von video- 
              und netzwerkbasierten Sicherheitssystemen. Technische Fehlersuche auf Hardware- und Systemebene. 
              Nebenher Mini-Job im IT-Support (Helpdesk, Tickets, Netzwerk).
            </p>
            <div className="tl-meta">
              <span>Flensburg</span><span className="dot">·</span><span>CCNA Mai 2026</span><span class="dot">·</span><span>Sicherheitssysteme</span>
            </div>
          </div>
        </div>

        {/* QUEST 2: R2P Praktikum */}
        <div className="tl-item">
          <div className="tl-year">2024–25</div>
          <div className="tl-content">
            <span className="tl-tag">Praktikum · IT</span>
            <h3 className="tl-title">Fachinformatiker Systemintegration — R2P GmbH</h3>
            <p className="tl-desc">
              Aufbau, Reparatur und Installation von IT-Arbeitsplätzen. Linux-basierte Systemarbeit: 
              Bash-Workflows, bootfähige USB-Images, Deployment-Prozesse.
            </p>
            <div className="tl-meta"><span>Linux · Bash · Deployment</span></div>
          </div>
        </div>

        {/* QUEST 3: GO-CORE-LAB */}
        <div className="tl-item">
          <div className="tl-year">2025</div>
          <div className="tl-content">
            <span className="tl-tag">Projekt · Software</span>
            <h3 className="tl-title">GO-CORE-LAB</h3>
            <p className="tl-desc">
              Persönliches Low-Level Forschungsframework in Go. ELF/PE Binary Parsing, Hardware-Bridge für 
              SPI/I2C/UART, Netzwerk-Probe. Statisch kompiliert — überall lauffähig.
            </p>
            <div className="tl-meta"><span>Go</span><span class="dot">·</span><span>Binary Analysis</span><span class="dot">·</span><span>Self-Hosted NAS</span></div>
          </div>
        </div>

        {/* QUEST 4: Embedded Projects */}
        <div className="tl-item">
          <div className="tl-year">2024</div>
          <div className="tl-content">
            <span className="tl-tag">Projekt · Hardware</span>
            <h3 className="tl-title">Embedded Projekte & Home Lab</h3>
            <p className="tl-desc">
              AD-LED Clock auf ATmega8535 (KiCad PCB, 3D-Druck, ISR-Level C++). Ampelkreuzung Simulation 
              (Arduino Mega, LN298, Ultraschall, 3D-gedruckte Gehäuse). Weather Station 2.0 auf ESP32. 
              Aufbau des Messplatzes mit Oszilloskop, Signalgenerator, Labornetzteil.
            </p>
            <div className="tl-meta"><span>C++</span><span class="dot">·</span><span>ATmega · ESP32 · Arduino</span><span class="dot">·</span><span>KiCad · 3D Druck</span></div>
          </div>
        </div>

        {/* QUEST 5: M. Jürgensen */}
        <div className="tl-item">
          <div className="tl-year">2023</div>
          <div className="tl-content">
            <span className="tl-tag">Praktikum · Elektronik</span>
            <h3 className="tl-title">Elektroniker für Betriebstechnik — M. Jürgensen</h3>
            <p className="tl-desc">
              Löten und Reparatur elektronischer Bauteile und Maschinen. Miniprojekt: Heizofen-Reparatur. 
              Erste Erfahrungen mit SPS-Systemen.
            </p>
            <div className="tl-meta"><span>Löten · SPS · Reparatur</span></div>
          </div>
        </div>

        {/* QUEST 6: RBZ-Eckener */}
        <div className="tl-item">
          <div className="tl-year">2022–25</div>
          <div className="tl-content">
            <span className="tl-tag">Abschluss · Ausbildung</span>
            <h3 className="tl-title">Informationstechnischer Assistent — RBZ-Eckener</h3>
            <p className="tl-desc">
              3-jährige Ausbildung. Netzwerktechnik, Elektrotechnik, Digitaltechnik, Kommunikationstechnik. 
              Programmierung & Embedded Systems (Arduino, MATLAB). Kotlin, Java, Jetpack Compose, Docker. Abschluss mit FHR.
            </p>
            <div className="tl-meta"><span>Java · Kotlin · Docker · MATLAB</span><span class="dot">·</span><span>Elektrotechnik · Netzwerke</span></div>
          </div>
        </div>

        {/* QUEST 7: ETS GmbH */}
        <div className="tl-item">
          <div className="tl-year">2021</div>
          <div className="tl-content">
            <span className="tl-tag">Praktikum · Elektrotechnik</span>
            <h3 className="tl-title">Elektroniker für Gebäudetechnik — ETS GmbH</h3>
            <p className="tl-desc">
              Planung, Aufbau und Montage von Schaltanlagen. Erste praktische Erfahrungen mit SPS-Steuerungen 
              und ESMR-Technik.
            </p>
            <div className="tl-meta"><span>Schaltanlagen · SPS · ESMR</span></div>
          </div>
        </div>

        {/* QUEST 8: MSA */}
        <div className="tl-item">
          <div className="tl-year">2016–22</div>
          <div className="tl-content">
            <span className="tl-tag">Schule</span>
            <h3 className="tl-title">Mittlere Schulreife (MSA)</h3>
            <p className="tl-desc">
              Schulabschluss. Ehrenamtlich aktiv in der Feuerwehr & Jugendfeuerwehr, Gemeindeaktionen, SV-Team. 
              Erste Berührungen mit Technik und Programmierung.
            </p>
            <div className="tl-meta"><span>Flensburg</span><span class="dot">·</span><span>Feuerwehr & Jugendfeuerwehr</span></div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default Career;
import React from 'react';
// Importiert die frisch installierte Timeline mit dem scrollenden Lichtstrahl
import { Timeline } from "../components/ui/timeline";

function Career() {
  // Das Daten-Array, das die Timeline füttert
  const timelineData = [
    {
      title: "2025–2027",
      content: (
        <div className="bg-[#161b22] border border-gray-800 p-6 rounded-lg shadow-xl">
          <span className="inline-block bg-[#00979D]/10 text-[#00979D] text-xs font-bold px-2.5 py-1 rounded mb-3 border border-[#00979D]/20">
            Aktuell · Ausbildung
          </span>
          <h3 className="text-xl font-bold text-white mb-2">IT-Systemelektroniker — R2P GmbH</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Verkürzter Ausbildungsgang. Montage, Inbetriebnahme und Wartung von video- 
            und netzwerkbasierten Sicherheitssystemen. Technische Fehlersuche auf Hardware- und Systemebene. 
            Nebenher Mini-Job im IT-Support (Helpdesk, Tickets, Netzwerk).
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-500">
            <span className="bg-[#21262d] px-2 py-1 rounded">Flensburg</span>
            <span className="bg-[#21262d] px-2 py-1 rounded text-[#00979D]">CCNA Mai 2026</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">Sicherheitssysteme</span>
          </div>
        </div>
      ),
    },
    {
      title: "2024–2025",
      content: (
        <div className="bg-[#161b22] border border-gray-800 p-6 rounded-lg shadow-xl">
          <span className="inline-block bg-blue-500/10 text-blue-400 text-xs font-bold px-2.5 py-1 rounded mb-3 border border-blue-500/20">
            Praktikum · IT
          </span>
          <h3 className="text-xl font-bold text-white mb-2">Fachinformatiker Systemintegration — R2P GmbH</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Aufbau, Reparatur und Installation von IT-Arbeitsplätzen. Linux-basierte Systemarbeit: 
            Bash-Workflows, bootfähige USB-Images, Deployment-Prozesse.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-500">
            <span className="bg-[#21262d] px-2 py-1 rounded">Linux</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">Bash</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">Deployment</span>
          </div>
        </div>
      ),
    },
    {
      title: "2025",
      content: (
        <div className="bg-[#161b22] border border-gray-800 p-6 rounded-lg shadow-xl">
          <span className="inline-block bg-[#00979D]/10 text-[#00979D] text-xs font-bold px-2.5 py-1 rounded mb-3 border border-[#00979D]/20">
            Projekt · Software
          </span>
          <h3 className="text-xl font-bold text-white mb-2">GO-CORE-LAB</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Persönliches Low-Level Forschungsframework in Go. ELF/PE Binary Parsing, Hardware-Bridge für 
            SPI/I2C/UART, Netzwerk-Probe. Statisch kompiliert — überall lauffähig.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-500">
            <span className="bg-[#21262d] px-2 py-1 rounded text-white">Go</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">Binary Analysis</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">Self-Hosted NAS</span>
          </div>
        </div>
      ),
    },
    {
      title: "2024",
      content: (
        <div className="bg-[#161b22] border border-gray-800 p-6 rounded-lg shadow-xl">
          <span className="inline-block bg-purple-500/10 text-purple-400 text-xs font-bold px-2.5 py-1 rounded mb-3 border border-purple-500/20">
            Projekt · Hardware
          </span>
          <h3 className="text-xl font-bold text-white mb-2">Embedded Projekte & Home Lab</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            AD-LED Clock auf ATmega8535 (KiCad PCB, 3D-Druck, ISR-Level C++). Ampelkreuzung Simulation 
            (Arduino Mega, LN298, Ultraschall, 3D-gedruckte Gehäuse). Weather Station 2.0 auf ESP32. 
            Aufbau des Messplatzes mit Oszilloskop, Signalgenerator, Labornetzteil.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-500">
            <span className="bg-[#21262d] px-2 py-1 rounded text-white">C++</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">ATmega</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">ESP32</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">KiCad</span>
          </div>
        </div>
      ),
    },
    {
      title: "2023",
      content: (
        <div className="bg-[#161b22] border border-gray-800 p-6 rounded-lg shadow-xl">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-bold px-2.5 py-1 rounded mb-3 border border-orange-500/20">
            Praktikum · Elektronik
          </span>
          <h3 className="text-xl font-bold text-white mb-2">Elektroniker für Betriebstechnik — M. Jürgensen</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Löten und Reparatur elektronischer Bauteile und Maschinen. Miniprojekt: Heizofen-Reparatur. 
            Erste Erfahrungen mit SPS-Systemen.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-500">
            <span className="bg-[#21262d] px-2 py-1 rounded">Löten</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">SPS</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">Reparatur</span>
          </div>
        </div>
      ),
    },
    {
      title: "2022–2025",
      content: (
        <div className="bg-[#161b22] border border-gray-800 p-6 rounded-lg shadow-xl">
          <span className="inline-block bg-green-500/10 text-green-400 text-xs font-bold px-2.5 py-1 rounded mb-3 border border-green-500/20">
            Abschluss · Ausbildung
          </span>
          <h3 className="text-xl font-bold text-white mb-2">Informationstechnischer Assistent — RBZ-Eckener</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            3-jährige Ausbildung mit Fachhochschulreife. Netzwerktechnik, Elektrotechnik, Digitaltechnik, Kommunikationstechnik. 
            Programmierung & Embedded Systems (Arduino, MATLAB). Kotlin, Java, Jetpack Compose, Docker.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-500">
            <span className="bg-[#21262d] px-2 py-1 rounded">Java / Kotlin</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">Docker</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">Digitaltechnik</span>
          </div>
        </div>
      ),
    },
    {
      title: "2021",
      content: (
        <div className="bg-[#161b22] border border-gray-800 p-6 rounded-lg shadow-xl">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-bold px-2.5 py-1 rounded mb-3 border border-orange-500/20">
            Praktikum · Elektrotechnik
          </span>
          <h3 className="text-xl font-bold text-white mb-2">Elektroniker für Gebäudetechnik — ETS GmbH</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Planung, Aufbau und Montage von Schaltanlagen. Erste praktische Erfahrungen mit SPS-Steuerungen 
            und ESMR-Technik.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-500">
            <span className="bg-[#21262d] px-2 py-1 rounded">Schaltanlagen</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">SPS</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">ESMR</span>
          </div>
        </div>
      ),
    },
    {
      title: "2016–2022",
      content: (
        <div className="bg-[#161b22] border border-gray-800 p-6 rounded-lg shadow-xl">
          <span className="inline-block bg-gray-500/10 text-gray-400 text-xs font-bold px-2.5 py-1 rounded mb-3 border border-gray-500/20">
            Schule
          </span>
          <h3 className="text-xl font-bold text-white mb-2">Mittlere Schulreife (MSA)</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Schulabschluss. Ehrenamtlich aktiv in der Feuerwehr & Jugendfeuerwehr, Gemeindeaktionen, SV-Team. 
            Erste Berührungen mit Technik und Programmierung.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-500">
            <span className="bg-[#21262d] px-2 py-1 rounded">Flensburg</span>
            <span className="bg-[#21262d] px-2 py-1 rounded">Feuerwehr</span>
          </div>
        </div>
      ),
    }
  ];

  return (
    <main className="page-main min-h-screen bg-black text-white py-12">
      {/* Brutalistischer Header im Marine-Stil */}
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center md:text-left">
        <h1 className="text-5xl font-extrabold tracking-wider text-white uppercase mb-2">
          Quest Log
        </h1>
        <p className="text-gray-400 text-lg font-mono">
      
        </p>
      </div>

      {/* Die leuchtende Aceternity-Timeline */}
      <div className="w-full">
        <Timeline data={timelineData} />
      </div>
    </main>
  );
}

export default Career;
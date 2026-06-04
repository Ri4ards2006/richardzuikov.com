"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ChevronDown } from 'lucide-react';

export default function Portfolio() {
  // State für die Klickboxen: Speichert, welcher Index offen ist (null = alle zu)
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  const row1Text = "RICHARD ZUIKOV SYSTEM ENGINEER LOW-LEVEL DEV ";
  const row2Text = "BARE METAL AVR ARCHITECTURE LINUX KERNEL ";
  const row3Text = "INFRASTRUCTURE NETWORK SECURITY TELEMETRY ";

  // Deine echten Daten aus der Career.jsx – strukturiert für die interaktiven Klickboxen
  const careerTimeline = [
    {
      year: "2025–2027",
      type: "Aktuell · Ausbildung",
      title: "IT-Systemelektroniker — R2P GmbH",
      location: "Flensburg",
      desc: "Verkürzter Ausbildungsgang. Montage, Inbetriebnahme und Wartung von video- und netzwerkbasierten Sicherheitssystemen. Technische Fehlersuche auf Hardware- und Systemebene. Nebenher Mini-Job im IT-Support (Helpdesk, Tickets, Netzwerk).",
      tags: ["Flensburg", "CCNA Mai 2026", "Sicherheitssysteme"]
    },
    {
      year: "2024–2025",
      type: "Praktikum · IT",
      title: "Fachinformatiker Systemintegration — R2P GmbH",
      location: "Flensburg",
      desc: "Aufbau, Reparatur und Installation von IT-Arbeitsplätzen. Linux-basierte Systemarbeit: Bash-Workflows, bootfähige USB-Images, Deployment-Prozesse.",
      tags: ["Linux", "Bash", "Deployment"]
    },
    {
      year: "2025",
      type: "Projekt · Software",
      title: "GO-CORE-LAB Forschungsframework",
      location: "Self-Hosted",
      desc: "Persönliches Low-Level Forschungsframework in Go. ELF/PE Binary Parsing, Hardware-Bridge für SPI/I2C/UART, Netzwerk-Probe. Statisch kompiliert — überall lauffähig.",
      tags: ["Go", "Binary Analysis", "Self-Hosted NAS"]
    },
    {
      year: "2024",
      type: "Projekt · Hardware",
      title: "Embedded Projekte & Home Lab",
      location: "Lab Node",
      desc: "AD-LED Clock auf ATmega8535 (KiCad PCB, 3D-Druck, ISR-Level C++). Ampelkreuzung Simulation (Arduino Mega, LN298, Ultraschall, 3D-gedruckte Gehäuse). Weather Station 2.0 auf ESP32. Aufbau des Messplatzes mit Oszilloskop, Signalgenerator, Labornetzteil.",
      tags: ["C++", "ATmega", "ESP32", "KiCad"]
    },
    {
      year: "2023",
      type: "Praktikum · Elektronik",
      title: "Elektroniker für Betriebstechnik — M. Jürgensen",
      location: "Germany",
      desc: "Löten und Reparatur elektronischer Bauteile und Maschinen. Miniprojekt: Heizofen-Reparatur. Erste Erfahrungen mit SPS-Systemen.",
      tags: ["Löten", "SPS", "Reparatur"]
    },
    {
      year: "2022–2025",
      type: "Abschluss · Ausbildung",
      title: "Informationstechnischer Assistent — RBZ-Eckener",
      location: "Eckernförde/Flensburg",
      desc: "3-jährige Ausbildung mit Fachhochschulreife. Netzwerktechnik, Elektrotechnik, Digitaltechnik, Kommunikationstechnik. Programmierung & Embedded Systems (Arduino, MATLAB). Kotlin, Java, Jetpack Compose, Docker.",
      tags: ["Java / Kotlin", "Docker", "Digitaltechnik"]
    },
    {
      year: "2021",
      type: "Praktikum · Elektrotechnik",
      title: "Elektroniker für Gebäudetechnik — ETS GmbH",
      location: "Germany",
      desc: "Planung, Aufbau und Montage von Schaltanlagen. Erste praktische Erfahrungen mit SPS-Steuerungen und ESMR-Technik.",
      tags: ["Schaltanlagen", "SPS", "ESMR"]
    },
    {
      year: "2016–2022",
      type: "Schule",
      title: "Mittlere Schulreife (MSA)",
      location: "Flensburg",
      desc: "Schulabschluss. Ehrenamtlich aktiv in der Feuerwehr & Jugendfeuerwehr, Gemeindeaktionen, SV-Team. Erste Berührungen mit Technik und Programmierung.",
      tags: ["Flensburg", "Feuerwehr"]
    }
  ];

  const toggleBox = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <main className="relative min-h-screen bg-[#FAF9F5] text-zinc-900 dark:bg-[#060606] dark:text-[#F5F5F7] overflow-x-hidden selection:bg-white/20 font-sans antialiased transition-colors duration-300">
      
      {/* ─── LAYER 1: MARQUEES IM VORDERGRUND (Z-10) ─── */}
      <div className="absolute left-0 w-screen overflow-hidden pointer-events-none select-none z-10 pt-[45vh] space-y-6 opacity-[0.015] dark:opacity-[0.03] transition-opacity duration-300">
        <div className="w-full flex whitespace-nowrap">
          <motion.div animate={{ x: [-1000, 0] }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} className="flex gap-12 text-[10vw] font-black uppercase tracking-tighter">
            {Array(8).fill(row1Text).map((text, i) => <span key={i}>{text}</span>)}
          </motion.div>
        </div>
        <div className="w-full flex whitespace-nowrap">
          <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }} className="flex gap-12 text-[10vw] font-black uppercase tracking-tighter">
            {Array(8).fill(row2Text).map((text, i) => <span key={i}>{text}</span>)}
          </motion.div>
        </div>
        <div className="w-full flex whitespace-nowrap">
          <motion.div animate={{ x: [-1000, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex gap-12 text-[10vw] font-black uppercase tracking-tighter">
            {Array(8).fill(row3Text).map((text, i) => <span key={i}>{text}</span>)}
          </motion.div>
        </div>
      </div>

      {/* ─── LAYER 2: TOP NAVIGATION ─── */}
      <div className="absolute top-16 left-8 md:left-24 z-50">
        <Link to="/lab" className="group flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors duration-300">
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>BACK // LAB</span>
        </Link>
      </div>

      {/* ─── LAYER 3: CONTENT LAYER (Z-20) ─── */}
      <div className="relative z-20 max-w-5xl mx-auto px-8 md:px-24 pt-64 pb-48 flex flex-col space-y-64">
        
        {/* HEADER BLOCK */}
        <section className="space-y-16">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-extralight tracking-tighter leading-none text-zinc-955 dark:text-white select-none transition-colors duration-300">
              Portfolio ver.2026
            </h1>
          </div>
          <div className="font-mono text-xs space-y-4 max-w-xl text-zinc-500">
            <div className="flex">
              <span className="w-24 shrink-0">URL：</span>
              <a href="https://richardzuikov.com" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
                https://richardzuikov.com <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            <div className="flex">
              <span className="w-24 shrink-0">Type：</span>
              <span className="text-zinc-400">System Engineering Portfolio</span>
            </div>
            <div className="flex pt-4">
              <a 
                href="/cv/CV_Richard_Zuikov.pdf" 
                download="CV_Richard_Zuikov.pdf"
                className="inline-flex items-center gap-2 px-6 py-2.5 font-mono text-xs border border-zinc-800 hover:border-zinc-500 rounded bg-zinc-950/40 hover:bg-zinc-900/60 hover:text-white text-zinc-300 transition-all duration-300"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>DOWNLOAD CV (PDF)</span>
              </a>
            </div>
          </div>
        </section>


        {/* OVERVIEW SECTION */}
        <section className="space-y-10 max-w-4xl">
          <span className="text-xs font-mono tracking-[0.4em] text-zinc-500 dark:text-zinc-600 uppercase block select-none">
            OVERVIEW
          </span>
          <p className="text-xl md:text-3xl font-light leading-relaxed tracking-tight text-zinc-700 dark:text-zinc-300 transition-colors duration-300">
            Ich entwickle keine klassischen Webseiten. Ich konzipiere und implementiere die 
            technische Architektur, auf der kritische Systeme atmen. Von hardwarenahen 
            AVR-Register-Interaktionen bis hin zu automatisierten, containerisierten Servernetzwerken.
          </p>
        </section>

        {/* ─── INTERAKTIVE TIMELINE-KLICKBOXEN (OHNE LINIEN, EXTREM CLEAN) ─── */}
        <section className="space-y-16">
          <span className="text-xs font-mono tracking-[0.4em] text-zinc-600 uppercase block select-none">
            TIMELINE & EXPERIENCES
          </span>

          <div className="space-y-4 max-w-4xl">
            {careerTimeline.map((item, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-[#0a0a0a]/40 border border-zinc-200 dark:border-transparent hover:bg-zinc-50 dark:hover:bg-[#0c0c0c] rounded-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => toggleBox(idx)}
                >
                  {/* Sichtbarer Header der Box */}
                  <div className="flex items-center justify-between p-6 md:p-8 select-none">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12 font-mono">
                      <span className="text-lg text-zinc-950 dark:text-white font-light tracking-wide w-32 shrink-0">{item.year}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-600 tracking-wider uppercase">{item.type}</span>
                      <span className="text-sm text-zinc-650 dark:text-zinc-400 font-sans font-normal tracking-tight">{item.title}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-zinc-450 dark:text-zinc-600 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-zinc-950 dark:text-white' : ''}`} />
                  </div>

                  {/* Aufklappbarer Inhalt (Framer Motion) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-8 md:px-8 md:pb-10 pt-2 space-y-6 md:pl-44 border-t border-zinc-200 dark:border-zinc-950">
                          <p className="text-zinc-600 dark:text-zinc-500 font-sans font-light text-sm leading-relaxed max-w-2xl">
                            {item.desc}
                          </p>
                          {/* Tech-Tags im Takuya-Stil */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {item.tags.map((tag, tagIdx) => (
                              <span key={tagIdx} className="bg-zinc-100 dark:bg-[#121212] border border-zinc-200 dark:border-zinc-900 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 px-2.5 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* DETAILS GRID */}
        <section className="space-y-32">
          <h2 className="text-4xl md:text-6xl font-extralight tracking-tighter text-zinc-950 dark:text-white transition-colors duration-300">DETAILS</h2>

          {/* TABLE: INFO */}
          <div className="space-y-12">
            <h3 className="text-xs font-mono tracking-[0.4em] text-zinc-500 dark:text-zinc-600 uppercase">// INFO</h3>
            <div className="space-y-8 font-mono text-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <span className="md:col-span-4 text-zinc-500 dark:text-zinc-655 uppercase tracking-wider">URL</span>
                <span className="md:col-span-8 text-zinc-700 dark:text-zinc-300 font-sans font-light">https://richardzuikov.com</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <span className="md:col-span-4 text-zinc-500 dark:text-zinc-655 uppercase tracking-wider">Release Date</span>
                <span className="md:col-span-8 text-zinc-700 dark:text-zinc-300">2026.05.24</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <span className="md:col-span-4 text-zinc-500 dark:text-zinc-655 uppercase tracking-wider">Type</span>
                <span className="md:col-span-8 text-zinc-700 dark:text-zinc-300 font-sans font-light">Portfolio Site</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <span className="md:col-span-4 text-zinc-500 dark:text-zinc-655 uppercase tracking-wider">Technologies</span>
                <span className="md:col-span-8 text-zinc-600 dark:text-zinc-400 font-sans font-light leading-relaxed">
                  C++ / Assembly (AVR RISC) / Linux Kernel Customization / Go / Python / Docker / 
                  VLAN Management / WireGuard VPN / KiCad PCB Layout / Tailwind CSS / Framer Motion / React
                </span>
              </div>
            </div>
          </div>

          {/* TABLE: ROLE */}
          <div className="space-y-12 pt-16">
            <h3 className="text-xs font-mono tracking-[0.4em] text-zinc-500 dark:text-zinc-600 uppercase">// ROLE</h3>
            <div className="space-y-8 font-mono text-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <span className="md:col-span-4 text-zinc-500 dark:text-zinc-655 uppercase tracking-wider">Planning</span>
                <span className="md:col-span-8 text-zinc-700 dark:text-zinc-300 font-sans font-light">Richard Zuikov</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <span className="md:col-span-4 text-zinc-500 dark:text-zinc-655 uppercase tracking-wider">Architecture</span>
                <span className="md:col-span-8 text-zinc-700 dark:text-zinc-300 font-sans font-light">Richard Zuikov</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <span className="md:col-span-4 text-zinc-500 dark:text-zinc-655 uppercase tracking-wider">Frontend</span>
                <span className="md:col-span-8 text-zinc-700 dark:text-zinc-300 font-sans font-light">Richard Zuikov</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <span className="md:col-span-4 text-zinc-500 dark:text-zinc-655 uppercase tracking-wider">Systems</span>
                <span className="md:col-span-8 text-zinc-700 dark:text-zinc-300 font-sans font-light">Richard Zuikov Infrastructure Node</span>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM WORKS LINK */}
        <section className="pt-16 border-t border-zinc-200 dark:border-zinc-900">
          <Link to="/lab" className="group inline-flex items-center gap-3 font-mono text-sm tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-zinc-955 dark:hover:text-white transition-colors duration-300">
            <span className="transform group-hover:-translate-x-1 transition-transform">➔</span> 
            <span className="border-b border-zinc-300 dark:border-zinc-800 group-hover:border-zinc-900 dark:group-hover:border-white pb-0.5 transition-all">Works list</span>
          </Link>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="w-full py-16 px-8 md:px-24 border-t border-zinc-200 dark:border-zinc-955 bg-white dark:bg-[#040404] flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[10px] text-zinc-500 dark:text-zinc-600 tracking-widest uppercase select-none transition-colors duration-300">
        <span>©2026 Richard Zuikov All rights reserved</span>
        <span className="text-zinc-400 dark:text-zinc-500">Portfolio ver.2026｜Works｜Richard Zuikov</span>
      </footer>
    </main>
  );
}
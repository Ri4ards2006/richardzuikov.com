"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Award, ShieldCheck, FileCode } from 'lucide-react';

export default function Career() {
  const [expandedIndex, setExpandedIndex] = useState(null);

const certificates = [
    { 
      title: "AZ-900: Microsoft Azure Fundamentals", 
      issuer: "Microsoft", 
      date: "Mai 2026", 
      id: "7Y5OLV313LZX", 
      icon: <ShieldCheck className="w-5 h-5 text-zinc-400" /> 
    },
    { 
      title: "Linux & Private Cloud Admin on IBM Power Systems", 
      issuer: "Red Hat", 
      date: "Mai 2026", 
      id: "T6LTXVIVD8PF", 
      icon: <FileCode className="w-5 h-5 text-zinc-400" /> 
    },
    { 
      title: "Google IT Automation with Python", 
      issuer: "Google", 
      date: "Apr. 2026", 
      id: "P9EALFL0QGOT", 
      icon: <Award className="w-5 h-5 text-zinc-400" /> 
    },
    { 
      title: "IBM Systems and Solutions Architect", 
      issuer: "IBM", 
      date: "Apr. 2026", 
      id: "ZXZ4ANI6JFX4", 
      icon: <Award className="w-5 h-5 text-zinc-400" /> 
    }
  ];

  const careerTimeline = [
    { year: "2025–2027", type: "Aktuell · Duale Entwicklung", title: "IT-Systemelektroniker — R2P GmbH", desc: "Verkürzter Ausbildungsgang aufgrund hoher Vorkenntnisse. Montage, Inbetriebnahme und Wartung von video- und netzwerkbasierten Sicherheitssystemen. Technische Fehlersuche auf Hardware- und Systemebene. Nebenher IT-Support (Helpdesk, Tickets, Enterprise-Netzwerke).", tags: ["Enterprise Network", "Hardware Diagnostics", "CCNA Systems"] },
    { year: "2024–2025", type: "Infrastruktur-Fokus", title: "Fachinformatiker Systemintegration — R2P GmbH", desc: "Aufbau, Reparatur und Provisionierung von IT-Arbeitsplätzen. Linux-basierte Systemarbeit: Entwicklung von Bash-Workflows, automatisierten Deployment-Prozessen und maßgeschneiderten, bootfähigen USB-Images.", tags: ["Linux", "Bash Scripting", "Automated Deployment"] },
    { year: "2025", type: "Forschung & Software", title: "GO-CORE-LAB Framework", desc: "Persönliches Low-Level Forschungsframework in Go. Parsing von ELF/PE Binaries, direkte Hardware-Bridges für serielle Busse (SPI/I2C/UART) und Netzwerk-Probes. Statisch kompiliert für universelle Infrastruktur-Kompatibilität.", tags: ["Go / Systems", "Binary Analysis", "Hardware Bridge"] },
    { year: "2024", type: "Hardware-Labor", title: "Embedded Systems & Messtechnik", desc: "Entwicklung einer AD-LED Clock auf ATmega8535 (KiCad PCB-Layout, 3D-gedrucktes Gehäuse, ISR-Level C++). Simulation von Verkehrskreuzen per Arduino Mega & Sensorik. Aufbau eines professionellen Messplatzes (Oszilloskop, Labornetzteil, Signalgenerator).", tags: ["C++", "AVR / ATmega", "KiCad PCB Design", "Lab Gear"] },
    { year: "2022–2025", type: "Akademisches Fundament", title: "Informationstechnischer Assistent — RBZ-Eckener", desc: "3-jährige vollschulische Ausbildung gekoppelt mit der Fachhochschulreife. Fundierte Ausbildung in Netzwerktechnik, Elektrotechnik, Digitaltechnik und Kommunikationstechnik. Angewandte Programmierung in Kotlin, Java, Jetpack Compose und Docker.", tags: ["Network Tech", "Digital & E-Tech", "Docker", "Java / Kotlin"] },
    { year: "2023", type: "Industrie-Praktikum", title: "Elektroniker für Betriebstechnik — M. Jürgensen", desc: "Löten und messtechnische Reparatur komplexer elektronischer Baugruppen und Industriemaschinen. Fehleranalyse in Heizöfen und erste praktische Berührungspunkte mit speicherprogrammierbaren Steuerungen (SPS).", tags: ["Löten / Reparatur", "SPS Basics", "Industrial Electronics"] },
    { year: "2021", type: "Anlagen-Praktikum", title: "Elektroniker für Gebäudetechnik — ETS GmbH", desc: "Planung, Strukturierung und physische Montage von industriellen Schaltanlagen. Erste praxisnahe Berührungen mit Steuerungstechnik und ESMR-Infrastrukturen.", tags: ["Schaltanlagen", "SPS", "ESMR-Technik"] }
  ];

  return (
    <main className="relative min-h-screen bg-[#060606] text-[#F5F5F7] overflow-x-hidden selection:bg-white/20 font-sans antialiased">
      
      <div className="absolute top-16 left-8 md:left-24 z-50">
        <Link to="/" className="group flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 hover:text-white transition-colors duration-300">
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>BACK</span>
        </Link>
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-8 md:px-24 pt-48 pb-48 flex flex-col space-y-32">
        
        <section className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white">Richard Zuikov</h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-zinc-400 font-mono text-sm uppercase tracking-widest">
            <span>System Engineer</span>
            <span className="hidden md:block text-zinc-700">•</span>
            <span>5+ Years Experience</span>
            <span className="hidden md:block text-zinc-700">•</span>
            <span>Flensburg, DE</span>
          </div>
        </section>

        <section>
          <p className="text-xl md:text-2xl font-light leading-relaxed text-zinc-300 max-w-3xl">
            Spezialisiert auf die Schnittstelle zwischen Hardware und Software. Fokus auf Konzeption robuster 
            IT & E-Tech-Systeme. von der Register-Ebene über automatisiertes Linux-Deployment bis zur 
            Inbetriebnahme industrieller Netzwerke.
          </p>
        </section>

       {/* SKILLS */}
<section className="space-y-12 pt-12">
  <h2 className="text-2xl font-bold text-white tracking-tight">Technical Stack</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    
    {/* 1. Systems & Low-Level */}
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Systems</h3>
      <div className="space-y-2 text-zinc-400 font-light">
        <p>Go (Automation)</p>
        <p>C / C++ / Assembly</p>
        <p>VHDL / FPGA</p>
        <p>Python / MATLAB</p>
      </div>
    </div>

    {/* 2. Web & Frontend */}
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Web / FE</h3>
      <div className="space-y-2 text-zinc-400 font-light">
        <p>React / Next.js</p>
        <p>TypeScript / JavaScript</p>
        <p>CSS / SCSS / Tailwind</p>
        <p>WordPress / CMS</p>
      </div>
    </div>

    {/* 3. Infra & Hardware */}
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Infra</h3>
      <div className="space-y-2 text-zinc-400 font-light">
        <p>Linux / Bash</p>
        <p>Docker / Git</p>
        <p>PCB (KiCad)</p>
        <p>AVR / ARM</p>
      </div>
    </div>

    {/* 4. Design & Strategy */}
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Design / Other</h3>
      <div className="space-y-2 text-zinc-400 font-light">
        <p>Figma / UI Design</p>
        <p>Photoshop / Video</p>
        <p>Web Planning / Dir.</p>
        <p>Web Marketing</p>
      </div>
    </div>

  </div>
</section>



       {/* CREDENTIALS */}
        <section className="space-y-8 pt-12">
          <h2 className="text-2xl font-bold text-white tracking-tight">Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert, idx) => (
              <div key={idx} className="bg-[#0a0a0a] p-6 rounded-xl flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-950 rounded-lg shrink-0">{cert.icon}</div>
                  <h3 className="text-base font-medium text-white">{cert.title}</h3>
                </div>
                <div className="pl-[52px]">
                  <p className="text-sm text-zinc-400 font-light">{cert.issuer} • {cert.date}</p>
                  <p className="text-xs text-zinc-600 font-mono mt-1">ID: {cert.id}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

    {/* CHRONOLOGY */}
        <section className="space-y-8 pt-12">
          <h2 className="text-2xl font-bold text-white tracking-tight">Chronology</h2>
          <div className="space-y-6">
            {careerTimeline.map((item, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-[#0a0a0a] rounded-xl overflow-hidden cursor-pointer transition-colors hover:bg-[#0f0f0f]" 
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                >
                  <div className="flex items-center justify-between p-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                      <span className="text-white font-bold text-xl tracking-tight">{item.year}</span>
                      <div className="flex flex-col">
                        <span className="text-zinc-200 text-lg font-medium">{item.title}</span>
                        <span className="text-zinc-500 text-sm font-mono uppercase tracking-wider mt-1">{item.type}</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-zinc-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }} 
                        className="px-8 pb-8 text-zinc-400 text-base leading-relaxed"
                      >
                        {item.desc}
                        
                        {/* Optionale Tags für mehr Tiefe */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.tags.map(tag => (
                            <span key={tag} className="text-[10px] uppercase tracking-widest bg-zinc-950 px-2 py-1 rounded text-zinc-600 font-mono">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
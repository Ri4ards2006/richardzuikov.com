"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useOutsideClick } from "../hooks/use-outside-click";

// DEIN STANDARD-HINTERGRUNDBILD
import bossImg from "../assets/Me_Picture.png";

// Echte Projekt-Bilder importieren
import adLedClockImg from "../assets/AD_DA_Clock.png";
import trafficSystemImg from "../assets/Traffic_System.jpg";
import weatherStationImg from "../assets/Weather_Station.png";
import goCoreLabImg from "../assets/Go_Lab_Reworked.png";
import homeLabImg from "../assets/Home_Lab.jpeg";
import workbenchImg from "../assets/Home_Soldering_Station.jpeg";

export default function Lab() {
  const [active, setActive] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const id = useId();
  const ref = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  // Takuya Background Engine Logik
  const currentBgImage = active?.src || hoveredCard?.src || bossImg;

  return (
    <main className="relative min-h-screen bg-[#020202] text-[#F5F5F7] overflow-x-hidden selection:bg-white/20 font-sans">
      
      {/* ─── DYNAMIC FULLSCREEN BACKGROUND ─── */}
      <div className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none select-none">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentBgImage}
            src={currentBgImage}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.60, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover object-center filter contrast-100 brightness-100"
            alt="System Background"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#020202_100%)]" />
      </div>

      {/* ─── SCROLLABLE PORTFOLIO CONTAINER ─── */}
      <div className="relative z-10 max-w-7xl mx-auto py-24 px-6 md:px-16 flex flex-col min-h-screen justify-between">
        
        {/* Minimal Header */}
        <header className="mb-24 text-center md:text-left select-none">
          <span className="text-[10px] font-mono tracking-[0.5em] text-zinc-600 uppercase block mb-2">
            // CORE.SYSTEM.LAB
          </span>
          <h1 className="text-5xl md:text-6xl font-light tracking-tighter text-[#F5F5F7]">
            Works
          </h1>
        </header>

        {/* ─── PORTFOLIO LISTE MIT MIT REDIRECT-LOGIK FÜR 01 ─── */}
        <div className="w-full border-t border-zinc-900">
          {projectCards(bossImg, adLedClockImg, trafficSystemImg, weatherStationImg, goCoreLabImg, homeLabImg, workbenchImg).map((card) => {
            
            // Einheitliches Innendesign für alle Listenelemente (01 bis 07)
            const cardInnerContent = (
              <>
                {/* Riesige Index-Zahl + Projekttitel */}
                <div className="flex items-center space-x-8 md:space-x-16 z-10">
                  <span className="text-5xl md:text-7xl font-mono font-extralight text-zinc-800 group-hover:text-zinc-400 transition-colors duration-400 tracking-tighter">
                    {card.id}
                  </span>
                  
                  <div className="flex flex-col">
                    <h3 className="text-3xl md:text-5xl font-light text-zinc-500 group-hover:text-[#F5F5F7] transition-all duration-300 tracking-tight">
                      {card.title}
                    </h3>
                    <span className="text-xs font-mono text-zinc-700 group-hover:text-zinc-500 transition-colors duration-300 mt-1 uppercase tracking-wider">
                      {card.description}
                    </span>
                  </div>
                </div>

                {/* Tech-Tag */}
                <div className="flex items-center mt-4 md:mt-0 z-10 font-mono text-xs text-zinc-700 group-hover:text-zinc-400 transition-colors duration-300">
                  <span className="tracking-widest uppercase border border-zinc-900 group-hover:border-zinc-800 px-3 py-1 rounded">
                    {card.tag.split(" · ")[0]}
                  </span>
                </div>

                {/* Hover-Overlay */}
                <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </>
            );

            // WENN ID "01" IST -> GEH DIREKT PER ROUTER-LINK AUF DIE PORTFOLIO SEITE
            if (card.id === "01") {
              return (
                <Link
                  key={card.title}
                  to="/portfolio"
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-zinc-900 cursor-pointer transition-all duration-300"
                >
                  {cardInnerContent}
                </Link>
              );
            }

            // FÜR ALLE ANDEREN PROJEKTE (02 - 07) -> ÖFFNE DAS PREVIEW-MODAL CHILLIG AUF DER SEITE
            return (
              <motion.div
                key={card.title}
                layoutId={`card-${card.title}-${id}`}
                onClick={() => setActive(card)}
                onMouseEnter={() => setHoveredCard(card)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-zinc-900 cursor-pointer transition-all duration-300"
              >
                {cardInnerContent}
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-24 flex justify-between items-center font-mono text-[9px] text-zinc-800 uppercase tracking-widest select-none">
          <span>INDEX // SYSTEM_STABLE</span>
          <span>© RICHARD ZUIKOV</span>
        </footer>
      </div>

      {/* ─── EXPANDED PORTFOLIO MODAL ─── */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4 bg-black/80 backdrop-blur-lg">
            
            <button
              className="absolute top-6 right-6 flex items-center justify-center bg-[#0d0d0d] border border-zinc-900 text-zinc-400 rounded-full h-12 w-12 hover:text-white hover:border-zinc-700 transition z-[110]"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </button>
            
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[750px] h-auto max-h-[85vh] flex flex-col bg-[#080808] border border-zinc-900 rounded-lg overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)]"
            >
              <div className="overflow-y-auto p-8 md:p-12 space-y-8 custom-scrollbar">
                
                <div className="border-b border-zinc-900 pb-6">
                  <span className="text-[10px] font-mono px-2 py-1 bg-zinc-950 border border-zinc-900 text-zinc-500 uppercase tracking-widest">
                    {active.tag}
                  </span>
                  <h2 className="font-light text-4xl text-[#F5F5F7] mt-6 tracking-tight">
                    {active.title}
                  </h2>
                </div>

                <div className="text-zinc-400 text-sm leading-relaxed space-y-4 font-mono border-b border-zinc-900 pb-6">
                  {typeof active.content === "function" ? active.content() : active.content}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {active.tags.map((tag, idx) => (
                      <span key={idx} className="bg-[#0d0d0d] border border-zinc-900 text-zinc-600 font-mono text-[10px] px-2.5 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {active.ctaLink && (
                    <a
                      href={active.ctaLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-center text-center px-5 py-2.5 text-xs font-mono tracking-wider rounded border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-500 transition duration-300"
                    >
                      {active.ctaText}
                    </a>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="6" />
  </svg>
);

const projectCards = (bossImg, img1, img2, img3, img4, img5, img6) => [
  {
    id: "01",
    tag: "Overview · Showreel",
    title: "Portfolio",
    description: "Systems Engineering & Hardware Architecture Core",
    src: bossImg,
    ctaText: null,
    ctaLink: null,
    tags: ["Low-Level", "Hardware", "Embedded", "Kernel Research"],
    content: () => (
      <p>Welcome to the central engineering directory. This space logs physical computing modules, low-level register interactions, automated telemetry frameworks, and dedicated self-hosted network arrays. Select any system node below to inspect deep documentation.</p>
    ),
  },
  {
    id: "02",
    tag: "Embedded · Hardware",
    title: "AD-LED Clock",
    description: "AVR RISC Register Level",
    src: img1,
    ctaText: "CODEBASE",
    ctaLink: "https://github.com/Ri4ards2006/Analog-Digital-Clock",
    tags: ["C++", "ATmega8535", "LED Matrix", "KiCad"],
    content: () => (
      <p>ATmega8535 driven LED-Matrix clock with shift registers. Pure C++ at register level — no external libraries. Circuit designed in KiCad, housing fully 3D-printed.</p>
    ),
  },
  {
    id: "03",
    tag: "Embedded · Hardware",
    title: "Traffic Light System",
    description: "Arduino Mega 2560 Architecture",
    src: img2,
    ctaText: "CODEBASE",
    ctaLink: "https://github.com/Ri4ards2006/Traffic-Light",
    tags: ["C++", "Arduino Mega", "Ultraschall", "3D Print"],
    content: () => (
      <p>Full street crossing simulation — traffic lights, pedestrian signals, day/night mode, ultrasonic sensors. Arduino Mega, LN298, interrupt-driven pedestrian buttons.</p>
    ),
  },
  {
    id: "04",
    tag: "Embedded · IoT",
    title: "Weather Station 2.0",
    description: "ESP32 Dual-Core Telemetry",
    src: img3,
    ctaText: "CODEBASE",
    ctaLink: "https://github.com/Ri4ards2006/Weather_Station2.0",
    tags: ["C++", "ESP32", "IoT", "WiFi"],
    content: () => (
      <p>Modular IoT weather station on ESP32. Multi-sensor fusion, WiFi telemetry, clean data pipeline. Each sensor module independently swappable.</p>
    ),
  },
  {
    id: "05",
    tag: "Software · Research",
    title: "GO-CORE-LAB",
    description: "Static Go Binary Analysis Engine",
    src: img4,
    ctaText: "CODEBASE",
    ctaLink: "https://github.com/Ri4ards2006/GO-CORE-LAB",
    tags: ["Go", "ELF Parser", "Binary Analysis"],
    content: () => (
      <p>Personal low-level research framework in Go. ELF/PE binary parsing, hardware bridge for SPI/I2C/UART capture from embedded targets, network probe module.</p>
    ),
  },
  {
    id: "06",
    tag: "Infrastructure",
    title: "Home Lab Infrastructure",
    description: "Private Server & Switch Administration",
    src: img5,
    ctaText: null,
    ctaLink: null,
    tags: ["Docker", "Linux", "Cloudflare", "VPN"],
    content: () => (
      <p>Private server infrastructure on Ugreen NAS. Docker services, Cloudflare Tunnels, VPN, VLANs, switch administration, monitoring. This website runs on it.</p>
    ),
  },
  {
    id: "07",
    tag: "Hardware · Lab",
    title: "Electronics Workbench",
    description: "Signal Analysis & Rapid Prototyping Hardware",
    src: img6,
    ctaText: null,
    ctaLink: null,
    tags: ["Oszilloskop", "SMD/THT", "KiCad", "3D Print"],
    content: () => (
      <p>Personal electronics lab for embedded development and signal analysis. Signal capture (PWM, UART, I2C), PCB design with KiCad and EasyEDA, rapid prototyping with 3D print.</p>
    ),
  },
];
"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";

export default function Lab() {
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <main className="page-main min-h-screen bg-black text-white py-12 px-4">
      {/* Header passend zu deinem Style */}
      <div className="max-w-6xl mx-auto mb-12 text-center md:text-left">
        <h1 className="text-5xl font-extrabold tracking-wider text-white uppercase mb-2">
          Projects
        </h1>
        <p className="text-[#00979D] text-lg font-mono">
         
        </p>
      </div>

      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 h-full w-full z-10 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-4 right-4 items-center justify-center bg-zinc-900 border border-zinc-800 text-white rounded-full h-8 w-8 hover:bg-zinc-800 transition"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[650px] h-auto max-h-[90vh] flex flex-col bg-[#161b22] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  src={active.src}
                  alt={active.title}
                  className="w-full h-64 md:h-72 object-cover object-center border-b border-zinc-800"
                />
              </motion.div>

              <div className="overflow-y-auto p-6 custom-scrollbar">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <motion.span 
                      layoutId={`tag-${active.tag}-${id}`}
                      className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase"
                    >
                      {active.tag}
                    </motion.span>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-2xl text-white mt-1"
                    >
                      {active.title}
                    </motion.h3>
                  </div>

                  {active.ctaLink && (
                    <motion.a
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      href={active.ctaLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 text-xs font-mono font-bold rounded border border-[#00979D] text-[#00979D] hover:bg-[#00979D]/10 transition"
                    >
                      {active.ctaText}
                    </motion.a>
                  )}
                </div>

                <motion.p
                  layoutId={`description-${active.description}-${id}`}
                  className="text-[#00979D] font-mono text-xs mb-4"
                >
                  {active.year} · {active.description}
                </motion.p>

                <div className="text-zinc-300 text-sm leading-relaxed space-y-4 font-sans border-t border-zinc-800/60 pt-4">
                  {typeof active.content === "function" ? active.content() : active.content}
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {active.tags.map((tag, idx) => (
                    <span key={idx} className="bg-[#21262d] text-zinc-400 font-mono text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Das Grid mit deinen echten Assets */}
      <ul className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectCards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col bg-[#111418] border border-zinc-800/80 rounded-xl cursor-pointer hover:border-[#00979D]/50 hover:bg-[#161b22] transition group"
          >
            <div className="flex gap-4 flex-col w-full">
              <motion.div layoutId={`image-${card.title}-${id}`} className="overflow-hidden rounded-lg">
                <img
                  src={card.src}
                  alt={card.title}
                  className="h-48 w-full object-cover object-center group-hover:scale-102 transition duration-300"
                />
              </motion.div>
              <div className="flex flex-col p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase">
                    {card.tag}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">{card.year}</span>
                </div>
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-bold text-lg text-white group-hover:text-[#00979D] transition"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-zinc-400 text-xs mt-1 line-clamp-2"
                >
                  {card.rawDesc}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </main>
  );
}

export const CloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="12" />
    </svg>
  );
};

// Hier sind 100% deine echten Daten, Pfade und Links drin!
const projectCards = [
  {
    year: "2024",
    tag: "Embedded · Hardware",
    title: "AD-LED Clock",
    description: "Target: AVR RISC Register Level",
    rawDesc: "ATmega8535 driven LED-Matrix clock with shift registers, brightness control, and time sync.",
    src: "/src/assets/AD_DA_Clock.png",
    ctaText: "GitHub Repo",
    ctaLink: "https://github.com/Ri4ards2006/Analog-Digital-Clock",
    tags: ["C++", "ATmega8535", "LED Matrix", "KiCad", "3D Print"],
    content: () => (
      <div className="space-y-4">
        <p>
          ATmega8535 driven LED-Matrix clock with shift registers, brightness control, and time sync. 
          Pure C++ at register level — no external libraries. Circuit designed in KiCad, housing fully 3D-printed.
        </p>
        <p>
          Die Ansteuerung erfolgt hardwarenah über direkte Registermanipulation, um maximale Performance und 
          präzise Timings ohne Overhead zu garantieren.
        </p>
      </div>
    ),
  },
  {
    year: "2024",
    tag: "Embedded · Hardware",
    title: "Traffic Light System",
    description: "Target: Arduino Mega 2560",
    rawDesc: "Full street crossing simulation — traffic lights, pedestrian signals, day/night mode, ultrasonic sensors.",
    src: "/src/assets/Traffic_System.jpg",
    ctaText: "GitHub Repo",
    ctaLink: "https://github.com/Ri4ards2006/Traffic-Light",
    tags: ["C++", "Arduino Mega", "Ultraschall", "3D Print", "CAD"],
    content: () => (
      <div className="space-y-4">
        <p>
          Full street crossing simulation — traffic lights, pedestrian signals, day/night mode, ultrasonic sensors. 
          Arduino Mega, LN298, interrupt-driven pedestrian buttons. Traffic light housings fully 3D-printed and CAD-designed.
        </p>
      </div>
    ),
  },
  {
    year: "2024",
    tag: "Embedded · IoT",
    title: "Weather Station 2.0",
    description: "Target: ESP32 Dual-Core",
    rawDesc: "Modular IoT weather station on ESP32. Multi-sensor fusion, WiFi telemetry, clean data pipeline.",
    src: "/src/assets/Weather_Station.png",
    ctaText: "GitHub Repo",
    ctaLink: "https://github.com/Ri4ards2006/Weather_Station2.0",
    tags: ["C++", "ESP32", "IoT", "WiFi", "Modular"],
    content: () => (
      <div className="space-y-4">
        <p>
          Modular IoT weather station on ESP32. Multi-sensor fusion, WiFi telemetry, clean data pipeline. 
          Each sensor module independently swappable — designed for extensibility from the start.
        </p>
      </div>
    ),
  },
  {
    year: "2025",
    tag: "Software · Research",
    title: "GO-CORE-LAB",
    description: "Target: Static Go Binary",
    rawDesc: "Personal low-level research framework in Go. ELF/PE binary parsing, hardware bridge for SPI/I2C/UART.",
    src: "/src/assets/Go_Lab_Reworked.png",
    ctaText: "GitHub Repo",
    ctaLink: "https://github.com/Ri4ards2006/GO-CORE-LAB",
    tags: ["Go", "ELF Parser", "Binary Analysis", "Networking"],
    content: () => (
      <div className="space-y-4">
        <p>
          Personal low-level research framework in Go. ELF/PE binary parsing, hardware bridge for 
          SPI/I2C/UART capture from embedded targets, network probe module. Statically compiled — drop anywhere and run.
        </p>
      </div>
    ),
  },
  {
    year: "2025",
    tag: "Infrastructure",
    title: "Home Lab — Server & Network",
    description: "Target: Self-Hosted Infrastructure",
    rawDesc: "Private server infrastructure on Ugreen NAS. Docker services, Cloudflare Tunnels, VPN, VLANs.",
    src: "/src/assets/Home_Lab.jpeg",
    ctaText: null,
    ctaLink: null,
    tags: ["Docker", "Linux", "Cloudflare", "VPN", "VLANs"],
    content: () => (
      <div className="space-y-4">
        <p>
          Private server infrastructure on Ugreen NAS. Docker services, Cloudflare Tunnels, VPN, VLANs, 
          switch administration, monitoring. This website runs on it. Built and maintained entirely by hand.
        </p>
      </div>
    ),
  },
  {
    year: "2025",
    tag: "Hardware · Lab",
    title: "Electronics Workbench",
    description: "Target: Signal Analysis & Prototyping",
    rawDesc: "Personal electronics lab for embedded development and signal analysis. Oscilloscope, signal generator.",
    src: "/src/assets/Home_Soldering_Station.jpeg",
    ctaText: null,
    ctaLink: null,
    tags: ["Oszilloskop", "SMD/THT", "KiCad", "EasyEDA", "3D Print"],
    content: () => (
      <div className="space-y-4">
        <p>
          Personal electronics lab for embedded development and signal analysis. Oscilloscope, signal generator, 
          bench PSU, SMD/THT soldering station. Signal capture (PWM, UART, I2C), PCB design with KiCad and EasyEDA, 
          rapid prototyping with 3D print.
        </p>
      </div>
    ),
  },
];
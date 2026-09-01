"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github, Cpu, X, Box } from "lucide-react";
import { useLanguage } from "../hooks/use-language";
import { useOutsideClick } from "../hooks/use-outside-click";

// Asset imports
import bossImg from "../assets/Me_Picture.png";
import adLedClockImg from "../assets/AD_DA_Clock.png";
import trafficSystemImg from "../assets/Traffic_System.jpg";
import weatherStationImg from "../assets/Weather_Station.png";
import goCoreLabImg from "../assets/Go_Lab_Reworked.png";
import homeLabImg from "../assets/Home_Lab.jpeg";
import workbenchImg from "../assets/Home_Soldering_Station.jpeg";

export default function Lab() {
  const { t } = useLanguage();
  const [active, setActive] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const id = useId();
  const ref = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useOutsideClick(ref, () => setActive(null));

  // Map images to translated project definitions
  const projectImages = {
    "01": homeLabImg,
    "02": adLedClockImg,
    "03": trafficSystemImg,
    "04": weatherStationImg,
    "05": goCoreLabImg,
    "06": homeLabImg,
    "07": workbenchImg
  };

  const currentBgImage = active ? projectImages[active.id] || bossImg : (hoveredCard ? projectImages[hoveredCard.id] || bossImg : bossImg);

  return (
    <main className="relative min-h-screen bg-white text-zinc-900 dark:bg-[#09090b] dark:text-[#f4f4f5] overflow-x-hidden selection:bg-[#FFB000]/30 font-sans transition-colors duration-300">
      
      {/* ─── TOP NAVIGATION ─── */}
      <div className="pt-12 px-6 sm:px-12 md:px-24 max-w-6xl mx-auto flex items-center justify-between relative z-50">
        <Link 
          to="/" 
          className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>{t.nav.backHome.toUpperCase()}</span>
        </Link>

        <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-600 hidden sm:inline tracking-wider">
          RZ.LAB · HARDWARE & SYSTEMS R&D
        </span>
      </div>

      {/* ─── DYNAMIC SUBTLE FULLSCREEN BACKGROUND ─── */}
      <div className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none select-none opacity-20 dark:opacity-30 transition-opacity duration-500">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentBgImage}
            src={currentBgImage}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover object-center filter grayscale contrast-125"
            alt="System Canvas"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/90 dark:from-[#09090b] dark:via-[#09090b]/80 dark:to-[#09090b]/90 transition-colors duration-300" />
      </div>

      {/* ─── SCROLLABLE PORTFOLIO CONTAINER ─── */}
      <div className="relative z-10 max-w-6xl mx-auto py-12 px-6 sm:px-12 md:px-24 flex flex-col min-h-[85vh] justify-between space-y-16">
        
        {/* Header */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/60 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-[#FFB000]" />
            <span>// R&D DIRECTORY</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extralight tracking-tight text-zinc-950 dark:text-white">
            {t.lab.title}
          </h1>
          <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400 max-w-2xl">
            {t.lab.subtitle}
          </p>
        </header>
 
        {/* ─── EDITORIAL PROJECT SHOWCASE LIST ─── */}
        <div className="w-full border-t border-zinc-200 dark:border-zinc-800/80 divide-y divide-zinc-200 dark:divide-zinc-800/80">
          {t.lab.projects.map((project) => {
            const projectImg = projectImages[project.id] || bossImg;

            return (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredCard(project)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group py-8 sm:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 cursor-pointer"
                onClick={() => setActive(project)}
              >
                {/* Left: ID & Title & Summary */}
                <div className="flex items-start sm:items-center gap-6 sm:gap-10 z-10">
                  <span className="text-3xl sm:text-5xl font-mono font-extralight text-zinc-300 dark:text-zinc-700 group-hover:text-[#FFB000] transition-colors duration-300 tracking-tighter shrink-0">
                    {project.id}
                  </span>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl sm:text-3xl font-light text-zinc-900 dark:text-zinc-100 group-hover:text-[#FFB000] transition-colors duration-300 tracking-tight">
                        {project.title}
                      </h2>
                      {project.isLiveApp && (
                        <span className="px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[9px] uppercase tracking-wider">
                          3D APP
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs sm:text-sm font-mono text-zinc-500 dark:text-zinc-400 max-w-xl">
                      {project.desc}
                    </p>
                  </div>
                </div>

                {/* Right: Category tag & action indicator */}
                <div className="flex items-center gap-4 z-10 self-start md:self-auto font-mono text-xs text-zinc-500">
                  <span className="px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-[11px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    {project.tag}
                  </span>
                  <span className="text-[11px] text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors hidden sm:inline">
                    INSPECT ↗
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal Footer Info */}
        <footer className="pt-12 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[10px] text-zinc-500">
          <span>{t.telemetry.overview.toUpperCase()} · FLENSBURG LAB NODE</span>
          <span>© {new Date().getFullYear()} RICHARD ZUIKOV</span>
        </footer>
      </div>

      {/* ─── EXPANDED PROJECT INSPECTOR MODAL ─── */}
      <AnimatePresence>
        {active && (
          <div 
            className="fixed inset-0 grid place-items-center z-[1000] p-4 sm:p-6 bg-black/70 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              className="fixed top-6 right-6 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full h-12 w-12 hover:text-black hover:dark:text-white hover:border-zinc-400 dark:hover:border-zinc-600 transition z-[1010] cursor-pointer shadow-lg"
              onClick={() => setActive(null)}
              aria-label={t.nav.closeMenu}
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Modal Card */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-10 transition-colors duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Preview Image Header */}
              {projectImages[active.id] && (
                <div className="relative aspect-[16/8] w-full overflow-hidden border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950">
                  <img 
                    src={projectImages[active.id]} 
                    alt={active.title} 
                    className="w-full h-full object-cover grayscale contrast-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-full border border-zinc-900/40 bg-zinc-950/80 backdrop-blur-md text-[10px] font-mono text-white tracking-wider uppercase">
                      {active.tag}
                    </span>
                  </div>
                </div>
              )}

              {/* Modal Body */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
                
                <div className="space-y-1 border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
                  <span className="text-[10px] font-mono text-[#FFB000] uppercase tracking-wider block">
                    // PROJECT_ID_{active.id}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-light text-zinc-950 dark:text-white tracking-tight">
                    {active.title}
                  </h2>
                </div>

                <div className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed font-light space-y-3">
                  <p>{active.fullText || active.desc}</p>
                </div>

                {/* Tech Tags */}
                {active.tags && (
                  <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                      {t.telemetry.specs}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {active.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs px-2.5 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dual Action Buttons (Source Code + Live App) */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
                  {active.repo && (
                    <a
                      href={active.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 text-xs font-mono transition-colors duration-200"
                    >
                      <Github className="w-4 h-4" />
                      <span>{t.telemetry.sourceCode}</span>
                    </a>
                  )}

                  {active.liveUrl && (
                    <a
                      href={active.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white text-xs font-mono font-semibold transition-colors duration-200 shadow-md"
                    >
                      <span>{active.isLiveApp ? t.telemetry.sandbox : t.telemetry.liveDemo}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
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
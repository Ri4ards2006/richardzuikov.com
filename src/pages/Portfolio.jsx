"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../hooks/use-language';

export default function Portfolio() {
  const { t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  const row1Text = "RICHARD ZUIKOV SYSTEM ENGINEER LOW-LEVEL DEV ";
  const row2Text = "BARE METAL AVR ARCHITECTURE LINUX KERNEL ";
  const row3Text = "INFRASTRUCTURE NETWORK SECURITY TELEMETRY ";

  const toggleBox = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <main className="relative min-h-screen bg-white text-zinc-900 dark:bg-[#09090b] dark:text-[#f4f4f5] overflow-x-hidden selection:bg-[#FFB000]/30 font-sans antialiased transition-colors duration-300">
      
      {/* ─── LAYER 1: MARQUEES BACKGROUND ─── */}
      <div className="absolute left-0 w-screen overflow-hidden pointer-events-none select-none z-10 pt-[45vh] space-y-6 opacity-[0.02] dark:opacity-[0.03] transition-opacity duration-300">
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
      </div>

      {/* ─── LAYER 2: TOP NAVIGATION ─── */}
      <div className="pt-12 px-6 sm:px-12 md:px-24 max-w-5xl mx-auto flex items-center justify-between relative z-50">
        <Link to="/lab" className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors duration-300">
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>{t.nav.back.toUpperCase()} · {t.nav.lab.toUpperCase()}</span>
        </Link>

        <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-600 hidden sm:inline tracking-wider">
          RZ.SPEC · PORTFOLIO_V2
        </span>
      </div>

      {/* ─── LAYER 3: CONTENT LAYER ─── */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 sm:px-12 md:px-24 pt-16 pb-32 flex flex-col space-y-32">
        
        {/* HEADER BLOCK */}
        <section className="space-y-8 border-b border-zinc-200 dark:border-zinc-800/80 pb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/60 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 tracking-wider">
              <span>SYSTEMS ARCHITECT DIRECTORY</span>
            </div>
            <h1 className="text-4xl sm:text-7xl font-extralight tracking-tight text-zinc-950 dark:text-white">
              Portfolio Architecture
            </h1>
          </div>

          <div className="font-mono text-xs space-y-3 max-w-xl text-zinc-500">
            <div className="flex">
              <span className="w-24 shrink-0">URL:</span>
              <a href="https://richardzuikov.com" className="text-zinc-700 dark:text-zinc-300 hover:text-[#FFB000] transition-colors flex items-center gap-1">
                https://richardzuikov.com <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            <div className="flex">
              <span className="w-24 shrink-0">Domain:</span>
              <span className="text-zinc-700 dark:text-zinc-300">Systems Engineering & Low-Level Architecture</span>
            </div>
            <div className="flex pt-3">
              <a 
                href="/cv/CV_Richard_Zuikov.pdf" 
                download="CV_Richard_Zuikov.pdf"
                className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-all duration-200"
              >
                <span>DOWNLOAD CV (PDF)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* OVERVIEW SECTION */}
        <section className="space-y-6 max-w-3xl">
          <span className="text-xs font-mono tracking-[0.2em] text-zinc-400 dark:text-zinc-500 uppercase block">
            CORE PHILOSOPHY
          </span>
          <p className="text-xl sm:text-2xl font-light leading-relaxed tracking-tight text-zinc-700 dark:text-zinc-300">
            {t.career.summary}
          </p>
        </section>

        {/* TIMELINE SECTION */}
        <section className="space-y-8">
          <span className="text-xs font-mono tracking-[0.2em] text-zinc-400 dark:text-zinc-500 uppercase block">
            {t.career.chronologyTitle.toUpperCase()}
          </span>

          <div className="space-y-4 max-w-4xl">
            {t.career.timeline.map((item, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-zinc-50/50 dark:bg-[#121212]/50 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl transition-all duration-200 overflow-hidden cursor-pointer"
                  onClick={() => toggleBox(idx)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 sm:p-7 select-none">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 font-mono">
                      <span className="text-sm sm:text-base text-zinc-950 dark:text-white font-medium w-28 shrink-0">{item.year}</span>
                      <span className="text-[11px] text-zinc-500 uppercase tracking-wider">{item.type}</span>
                      <span className="text-sm text-zinc-800 dark:text-zinc-200 font-sans">{item.title}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-zinc-950 dark:text-white' : ''}`} />
                  </div>

                  {/* Body */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-2 space-y-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                          <p className="text-zinc-600 dark:text-zinc-400 font-light text-sm leading-relaxed">
                            {item.desc}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {item.tags.map((tag, tagIdx) => (
                              <span key={tagIdx} className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 px-2.5 py-1 rounded">
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

        {/* DETAILS TABLE */}
        <section className="space-y-12 border-t border-zinc-200 dark:border-zinc-800/80 pt-16">
          <h2 className="text-2xl sm:text-4xl font-extralight tracking-tight text-zinc-950 dark:text-white">
            System Specifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-3">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">CORE PLATFORM</span>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                React 18 · Vite · Tailwind CSS · Framer Motion · Geist Mono / Sans Variable Fonts
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-3">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">SYSTEM DISCIPLINES</span>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Modern C++ · Go · AVR Assembly · Linux Deployment · Docker · KiCad PCB · CCNA Networking
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="w-full py-12 px-6 sm:px-12 md:px-24 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[10px] text-zinc-500 tracking-wider">
        <span>© {new Date().getFullYear()} Richard Zuikov · All rights reserved</span>
        <div className="flex gap-4">
          <Link to="/lab" className="hover:text-zinc-900 dark:hover:text-white transition-colors uppercase">
            {t.nav.lab}
          </Link>
          <span>·</span>
          <Link to="/impressum" className="hover:text-zinc-900 dark:hover:text-white transition-colors uppercase">
            {t.nav.legal}
          </Link>
        </div>
      </footer>
    </main>
  );
}
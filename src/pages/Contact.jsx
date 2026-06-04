"use client";
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/use-language';

export default function Contact() {
  const [language] = useLanguage();

  return (
    <main className="relative min-h-screen bg-white text-black dark:bg-[#060606] dark:text-[#F5F5F7] overflow-x-hidden selection:bg-white/20 font-sans antialiased flex flex-col justify-between transition-colors duration-300">
      
      {/* ─── TOP NAVIGATION ─── */}
      <div className="absolute top-16 left-8 md:left-24 z-50">
        <Link 
          to="/" 
          className="group flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>{language === 'de' ? 'ZURÜCK // START' : 'BACK // HOME'}</span>
        </Link>
      </div>

      {/* ─── MAIN HERO CONTENT ─── */}
      <div className="w-full max-w-5xl mx-auto px-8 md:px-24 pt-64 flex-grow flex flex-col justify-center space-y-12">
        
        {/* Deine Tech-Inhalte oben drüber */}
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-mono tracking-[0.4em] text-zinc-600 uppercase block select-none">
          
          </span>
          <p className="text-sm md:text-base font-mono text-zinc-500 dark:text-zinc-400 leading-relaxed uppercase tracking-wider">
            {language === 'de' 
              ? 'Kontaktieren Sie mich für Projektanfragen. Von Web-Design & Frontend über komplexe Netzwerktechnik bis hin zu Elektronik und Systemreparaturen.' 
              : 'Contact me for project inquiries. From web design & frontend, complex network engineering, to electronics and system repairs.'
            }
          </p>
        </div>

        {/* Monumentale E-Mail Headline */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-7xl font-extralight tracking-tighter text-zinc-950 dark:text-white leading-none break-all select-all">
            <a 
              href="mailto:contact@richardzuikov.com" 
              className="hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors duration-500"
            >
              contact@richardzuikov.com
            </a>
          </h1>
        </div>

        {/* Die plumpen, minimalistischen Icons (Native SVGs — 100% crashsicher) */}
        <div className="flex items-center gap-8 pt-4 select-none">
          
          {/* LINKEDIN */}
          <a 
            href="https://www.linkedin.com/in/richard-zuikov-526745343" 
            target="_blank" 
            rel="noreferrer"
            className="text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-white transform hover:scale-105 transition-all duration-300"
            aria-label="LinkedIn"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>

          {/* GITHUB */}
          <a 
            href="https://github.com/Ri4ards2006" 
            target="_blank" 
            rel="noreferrer"
            className="text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-white transform hover:scale-105 transition-all duration-300"
            aria-label="GitHub"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>

          {/* INSTAGRAM */}
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noreferrer"
            className="text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-white transform hover:scale-105 transition-all duration-300"
            aria-label="Instagram"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>

      </div>


      {/* ─── MINIMAL FOOTER ─── */}
      <footer className="w-full max-w-5xl mx-auto px-8 md:px-24 pb-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 font-mono text-[10px] text-zinc-600 tracking-widest uppercase select-none">
        <div className="space-y-1">
          <div>Available for technical co-op</div>
          <div>Engineering base: Flensburg, DE 🇩🇪</div>
        </div>
        <div className="text-zinc-700">
          ©2026 Richard Zuikov · All rights reserved
        </div>
      </footer>

    </main>
  );
}
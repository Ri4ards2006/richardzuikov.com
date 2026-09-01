"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Sun, Moon, X } from 'lucide-react';
import { useTheme } from '../hooks/use-theme';
import { useLanguage } from '../hooks/use-language';

export default function MenuOverlay({ onClose }) {
  const [theme, toggleTheme] = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const menuItems = [
    { id: "01", path: "/", label: t.nav.home, sub: language === 'de' ? "Hauptseite" : "Main Screen" },
    { id: "02", path: "/about", label: t.nav.about, sub: language === 'de' ? "Profil & Info" : "Profile & Info" },
    { id: "03", path: "/career", label: t.nav.career, sub: t.home.careerSub },
    { id: "04", path: "/lab", label: t.nav.lab, sub: t.home.worksSub },
    { id: "05", path: "/contact", label: t.nav.contact, sub: t.home.contactSub }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/98 dark:bg-[#09090b]/98 backdrop-blur-xl transition-colors duration-300"
    >
      {/* Rotated vertical MENU text on the far left edge */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 select-none pointer-events-none">
        <span className="text-zinc-200/60 dark:text-zinc-900/35 font-sans text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-black tracking-[0.25em] [writing-mode:vertical-lr] uppercase leading-none">
          MENU
        </span>
      </div>

      {/* Top Right Controls Group */}
      <div className="fixed top-8 right-8 z-[10000] flex items-center gap-3 md:gap-4 select-none">
        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage}
          className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-200 font-mono text-xs font-bold cursor-pointer"
          title={t.nav.switchLang}
          aria-label={t.nav.switchLang}
        >
          {language === 'de' ? 'EN' : 'DE'}
        </button>

        {/* Theme switcher */}
        <button 
          onClick={toggleTheme}
          className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-200 cursor-pointer"
          title={t.nav.switchTheme}
          aria-label={t.nav.switchTheme}
        >
          {theme === 'dark' ? <Sun size={20} className="text-[#FFB000]" /> : <Moon size={20} />}
        </button>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-200 cursor-pointer"
          aria-label={t.nav.closeMenu}
        >
          <X size={20} />
        </button>
      </div>

      {/* Inner Full-Width Container */}
      <div className="w-full h-full flex flex-col justify-between py-16 pl-16 md:pl-28 pr-8 md:pr-16 lg:pr-24">
        
        {/* Main Content Area */}
        <div className="flex justify-end items-center my-auto w-full pr-4 md:pr-12">
          <nav className="flex flex-col space-y-4 md:space-y-6 select-none items-end">
            {menuItems.map((item) => {
              const isActive = window.location.pathname === item.path;
              return (
                <Link 
                  key={item.id} 
                  to={item.path} 
                  onClick={onClose}
                  className="group flex items-baseline justify-end gap-3 text-right transform hover:-translate-x-2 transition-transform duration-300 w-full"
                >
                  {/* Sub-label (left of label, visible on hover) */}
                  <span className="text-[10px] font-mono tracking-widest text-[#FFB000] opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase mr-3 hidden sm:inline">
                    {item.sub}
                  </span>
                  {/* Label */}
                  <span className={`text-3xl md:text-4xl lg:text-5xl font-extralight tracking-wide transition-all duration-300 ${
                    isActive 
                      ? 'text-zinc-900 dark:text-white font-normal' 
                      : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 group-hover:dark:text-white'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Socials & Biography Panel */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between mt-auto gap-6 select-none">
          
          {/* Left Side: Biography text */}
          <div className="max-w-md text-left font-mono text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            <span className="text-[#FFB000] uppercase block mb-1 font-semibold tracking-wider">SYSTEM ARCHITECTURE · LAB</span>
            {language === 'de' 
              ? "Hallo Welt, ich bin Richard Zuikov. Ich arbeite als System- und Softwarearchitekt an der Schnittstelle zwischen Hardware und Low-Level-Software. Diese Webseite zeigt meine Projekte und meinen Werdegang." 
              : "Hello world, I'm Richard Zuikov. I work as a systems and low-level software architect at the boundary where hardware and software collide. This website showcases my projects and career."}
            <div className="mt-2 flex gap-3 text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
              <Link 
                to="/impressum" 
                onClick={onClose}
                className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors underline decoration-zinc-300 dark:decoration-zinc-800 underline-offset-2"
              >
                {t.nav.legal}
              </Link>
            </div>
          </div>

          {/* Right Side: Social Icons */}
          <div className="flex gap-6 text-zinc-400 dark:text-zinc-500 items-center shrink-0 pb-1">
            <a 
              href="https://github.com/Ri4ards2006" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-zinc-900 dark:hover:text-white transition-colors duration-200" 
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/in/richard-zuikov-526745343" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-zinc-900 dark:hover:text-white transition-colors duration-200" 
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a 
              href="mailto:contact@richardzuikov.com" 
              className="hover:text-zinc-900 dark:hover:text-white transition-colors duration-200" 
              aria-label="Mail"
            >
              <Mail size={18} />
            </a>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
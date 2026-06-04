import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Sun, Moon, X } from 'lucide-react';
import { useTheme } from '../hooks/use-theme';
import { useLanguage } from '../hooks/use-language';

export default function MenuOverlay({ onClose }) {
  const [theme, toggleTheme] = useTheme();
  const [language, toggleLanguage] = useLanguage();

  const menuItems = [
    { id: "01", path: "/", label: { de: "Start", en: "Home" }, sub: { de: "Hauptseite", en: "Main Screen" } },
    { id: "02", path: "/about", label: { de: "Über mich", en: "About" }, sub: { de: "Profil & Info", en: "Profile & Info" } },
    { id: "03", path: "/career", label: { de: "Werdegang", en: "Career" }, sub: { de: "Entwicklung", en: "Development" } },
    { id: "04", path: "/lab", label: { de: "Lab", en: "Works" }, sub: { de: "Hardware & Systeme", en: "Hardware & Systems" } },
    { id: "05", path: "/contact", label: { de: "Kontakt", en: "Contact" }, sub: { de: "Kontaktieren", en: "Get in touch" } }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF9F5]/98 dark:bg-[#030303]/98 backdrop-blur-xl transition-colors duration-300"
    >
      {/* Top Right Controls Group (Equal circular buttons aligned in a row) */}
      <div className="fixed top-8 right-8 z-[10000] flex items-center gap-3 md:gap-4 select-none">
        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage}
          className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-zinc-650 dark:text-zinc-400 hover:text-zinc-955 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-305 font-mono text-xs font-bold"
          title={language === 'de' ? 'Switch to English' : 'Wechsle zu Deutsch'}
          aria-label="Toggle Language"
        >
          {language === 'de' ? 'EN' : 'DE'}
        </button>

        {/* Theme switcher */}
        <button 
          onClick={toggleTheme}
          className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-zinc-650 dark:text-zinc-400 hover:text-zinc-955 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-305"
          title={language === 'de' ? 'Theme wechseln' : 'Switch Theme'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} className="text-[#FFB000]" /> : <Moon size={20} />}
        </button>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-zinc-650 dark:text-zinc-400 hover:text-zinc-955 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-305"
          aria-label="Close Menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Inner Centered Container */}
      <div className="w-full max-w-6xl h-full flex flex-col justify-between py-16 px-8 md:px-16">
        
        {/* Main Grid content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-auto w-full">
          
          {/* Left Column: Vertically Rotated MENU text (Takuya Oshima Inspiration) */}
          <div className="hidden md:flex col-span-4 items-center justify-center border-r border-zinc-200 dark:border-zinc-900/80 pr-12 h-80">
            <span className="text-zinc-400 dark:text-zinc-600 font-mono text-xs tracking-[1.5em] select-none [writing-mode:vertical-lr] rotate-180 uppercase font-light">
              MENU // RZ.OS.V2
            </span>
          </div>

          {/* Right Column: Menu Links (Right aligned) */}
          <div className="col-span-12 md:col-span-8 flex flex-col justify-center items-end text-right md:pr-12 space-y-6 md:space-y-8 select-none w-full">
            <nav className="flex flex-col space-y-4 md:space-y-6 w-full">
              {menuItems.map((item) => {
                const isActive = window.location.pathname === item.path;
                return (
                  <Link 
                    key={item.id} 
                    to={item.path} 
                    onClick={onClose}
                    className="group flex items-baseline justify-end gap-4 md:gap-6 text-right transform hover:-translate-x-2 transition-transform duration-300 w-full"
                  >
                    {/* Sub-label (left of label, visible on hover) */}
                    <span className="text-[10px] font-mono tracking-widest text-[#FFB000] opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase mr-2 hidden sm:inline">
                      {item.sub[language]} //
                    </span>
                    {/* Index number */}
                    <span className="font-mono text-xs md:text-sm text-zinc-400 dark:text-zinc-600 group-hover:text-[#FFB000] transition-colors duration-300">
                      {item.id}
                    </span>
                    {/* Label (Increased size to text-5xl md:text-7xl lg:text-8xl) */}
                    <span className={`text-5xl md:text-7xl lg:text-8xl font-extralight tracking-wide transition-all duration-300 ${
                      isActive 
                        ? 'text-zinc-900 dark:text-white font-normal' 
                        : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 group-hover:dark:text-white'
                    }`}>
                      {item.label[language]}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Socials Panel */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between border-t border-zinc-200 dark:border-zinc-900/60 pt-8 mt-auto gap-6 select-none">
          
          {/* Status Label */}
          <div className="font-mono text-[9px] text-zinc-400 dark:text-zinc-650 tracking-widest uppercase">
            SYS.V2 // {language === 'de' ? 'STABIL' : 'STABLE'}
          </div>

          {/* Social Icons */}
          <div className="flex gap-6 text-zinc-400 dark:text-zinc-500 items-center">
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
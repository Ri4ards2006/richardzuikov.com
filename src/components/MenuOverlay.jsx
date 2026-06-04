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
      {/* Close Button */}
      <button 
        onClick={onClose} 
        className="fixed top-8 right-8 z-[10000] w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-zinc-650 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-300"
        aria-label="Close Menu"
      >
        <X size={20} />
      </button>

      {/* Inner Centered Container */}
      <div className="w-full max-w-6xl h-full flex flex-col justify-between py-16 px-8 md:px-16">
        
        {/* Main Grid content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-auto w-full">
          
          {/* Left Column: Vertically Rotated MENU text (Takuya Oshima Inspiration) */}
          <div className="hidden md:flex col-span-4 items-center justify-center border-r border-zinc-200 dark:border-zinc-900/80 pr-12 h-72">
            <span className="text-zinc-400 dark:text-zinc-600 font-mono text-xs tracking-[1.5em] select-none [writing-mode:vertical-lr] rotate-180 uppercase font-light">
              MENU // RZ.OS.V2
            </span>
          </div>

          {/* Right Column: Menu Links */}
          <div className="col-span-12 md:col-span-8 flex flex-col justify-center items-start md:pl-16 space-y-6 md:space-y-8 select-none">
            <nav className="flex flex-col space-y-4 md:space-y-6 w-full">
              {menuItems.map((item) => {
                const isActive = window.location.pathname === item.path;
                return (
                  <Link 
                    key={item.id} 
                    to={item.path} 
                    onClick={onClose}
                    className="group flex items-baseline gap-4 md:gap-6 text-left transform hover:translate-x-2 transition-transform duration-300 w-full"
                  >
                    {/* Index number */}
                    <span className="font-mono text-xs md:text-sm text-zinc-400 dark:text-zinc-600 group-hover:text-[#FFB000] transition-colors duration-300">
                      {item.id}
                    </span>
                    {/* Label */}
                    <span className={`text-4xl md:text-6xl font-extralight tracking-wide transition-all duration-300 ${
                      isActive 
                        ? 'text-zinc-900 dark:text-white font-normal' 
                        : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 group-hover:dark:text-white'
                    }`}>
                      {item.label[language]}
                    </span>
                    {/* Sub-label */}
                    <span className="text-[10px] font-mono tracking-widest text-[#FFB000] opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase ml-4 hidden sm:inline">
                      // {item.sub[language]}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Settings & Socials Panel */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between border-t border-zinc-200 dark:border-zinc-900/60 pt-8 mt-auto gap-6 select-none">
          
          {/* Status Label */}
          <div className="font-mono text-[9px] text-zinc-400 dark:text-zinc-600 tracking-widest uppercase">
            SYS.V2 // {language === 'de' ? 'STABIL' : 'STABLE'}
          </div>

          {/* Controls: Language toggle + Theme switcher + Socials */}
          <div className="flex flex-wrap items-center gap-8 md:gap-12">
            
            {/* Language Switcher */}
            <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-400 dark:text-zinc-550">
              <button 
                onClick={() => language !== 'de' && toggleLanguage()}
                className={`transition-all duration-200 py-1 px-2.5 rounded ${
                  language === 'de' 
                    ? 'border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white bg-zinc-100/80 dark:bg-zinc-900/80 font-medium shadow-sm' 
                    : 'hover:text-zinc-900 dark:hover:text-white border border-transparent'
                }`}
              >
                DE
              </button>
              <span className="text-zinc-350 dark:text-zinc-800 px-0.5">/</span>
              <button 
                onClick={() => language !== 'en' && toggleLanguage()}
                className={`transition-all duration-200 py-1 px-2.5 rounded ${
                  language === 'en' 
                    ? 'border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white bg-zinc-100/80 dark:bg-zinc-900/80 font-medium shadow-sm' 
                    : 'hover:text-zinc-900 dark:hover:text-white border border-transparent'
                }`}
              >
                EN
              </button>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors duration-250 py-1 px-2.5 border border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/30 dark:bg-zinc-900/30 rounded hover:border-zinc-350 dark:hover:border-zinc-700"
              title={language === 'de' ? 'Theme wechseln' : 'Switch Theme'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={14} className="text-[#FFB000]" />
                  <span>LIGHT</span>
                </>
              ) : (
                <>
                  <Moon size={14} />
                  <span>DARK</span>
                </>
              )}
            </button>

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

      </div>
    </motion.div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Globe, Sun, Moon, X } from 'lucide-react';
import { useTheme } from '../hooks/use-theme';

export default function MenuOverlay({ onClose }) {
  const [theme, toggleTheme] = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
    >
      {/* Close Button (Gleiche Position/Style wie der Menü-Button für perfekten Übergang) */}
      <button 
        onClick={onClose} 
        className="fixed top-8 right-8 z-[10000] w-12 h-12 flex items-center justify-center rounded-full border border-zinc-800 hover:border-zinc-500 bg-zinc-900/60 backdrop-blur-md text-zinc-400 hover:text-white transition-all duration-300"
        aria-label="Close Menu"
      >
        <X size={20} />
      </button>

      {/* Menü Links */}
      <nav className="flex flex-col items-center space-y-8 select-none">
        {['Home', 'About', 'Career', 'Lab', 'Contact'].map((item) => (
          <Link 
            key={item} 
            to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
            onClick={onClose}
            className="text-4xl md:text-5xl font-light text-zinc-400 hover:text-white hover:scale-105 transition-all duration-300 tracking-widest"
          >
            {item}
          </Link>
        ))}
      </nav>

      {/* Bottom Settings & Socials */}
      <div className="absolute bottom-16 flex flex-col items-center gap-8 select-none">
        
        {/* Settings */}
        <div className="flex gap-8 text-zinc-500">
          <button className="hover:text-white transition-colors" title="Sprache ändern">
            <Globe size={20} />
          </button>
          <button 
            className="hover:text-white transition-colors" 
            onClick={toggleTheme}
            title="Theme wechseln"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        
        {/* Social Icons */}
        <div className="flex gap-8 text-zinc-500 items-center">
          <a href="https://github.com/Ri4ards2006" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/richard-zuikov-526745343" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a href="mailto:contact@richardzuikov.com" className="hover:text-white transition-colors" aria-label="Mail"><Mail size={20} /></a>
        </div>
      </div>
    </motion.div>
  );
}
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Globe, Sun, Moon } from 'lucide-react';

export default function MenuOverlay({ isOpen, onClose }) {
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-red-600"
        >
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-10 right-10 text-white font-mono hover:text-zinc-200 text-xl"
          >
            [ CLOSE ]
          </button>

          {/* Menü Links */}
          <nav className="flex flex-col items-center space-y-8">
            {['Home', 'About', 'Career', 'Lab', 'Contact'].map((item) => (
              <Link 
                key={item} 
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                onClick={onClose}
                className="text-4xl font-light text-white hover:text-black transition-all tracking-widest"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Bottom Settings & Socials */}
          <div className="absolute bottom-16 flex flex-col items-center gap-8">
            
            {/* Settings */}
            <div className="flex gap-8 text-white">
              <button className="hover:text-black transition-colors" title="Sprache ändern">
                <Globe size={24} />
              </button>
              <button 
                className="hover:text-black transition-colors" 
                onClick={() => setIsDarkMode(!isDarkMode)}
                title="Theme wechseln"
              >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-8 text-white">
              <a href="https://github.com/Ri4ards2006" target="_blank" rel="noreferrer" className="hover:text-black">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com/in/dein-profil" target="_blank" rel="noreferrer" className="hover:text-black">
                <Linkedin size={24} />
              </a>
              <a href="mailto:deine@email.com" className="hover:text-black">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
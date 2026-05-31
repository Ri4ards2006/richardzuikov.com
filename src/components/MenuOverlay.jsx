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
         className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
>
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-10 right-10 text-white font-mono hover:text-zinc-400">
            [ CLOSE ]
          </button>

          {/* Menü Links */}
          <nav className="flex flex-col items-center space-y-8">
            {['Home', 'About', 'Career', 'Lab', 'Contact'].map((item) => (
              <Link 
                key={item} 
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                onClick={onClose}
                className="text-4xl font-light text-white hover:text-zinc-500 transition-all tracking-widest"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Bottom Settings & Socials */}
          <div className="absolute bottom-16 flex flex-col items-center gap-8">
            
            {/* Settings */}
            <div className="flex gap-8 text-zinc-400">
              <button className="hover:text-white transition-colors" title="Sprache ändern">
                <Globe size={20} />
              </button>
              <button 
                className="hover:text-white transition-colors" 
                onClick={() => setIsDarkMode(!isDarkMode)}
                title="Theme wechseln"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-8 text-zinc-500">
              <a href="https://github.com/Ri4ards2006" target="_blank" rel="noreferrer" className="hover:text-white"><Github size={20} /></a>
              <a href="https://linkedin.com/in/dein-profil" target="_blank" rel="noreferrer" className="hover:text-white"><Linkedin size={20} /></a>
              <a href="mailto:deine@email.com" className="hover:text-white"><Mail size={20} /></a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
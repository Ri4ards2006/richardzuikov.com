import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/use-language';

export default function Footer() {
  const [language] = useLanguage();

  return (
    <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 mt-24 transition-colors duration-300">
      <div className="max-w-6xl mx-auto py-12 px-6 sm:px-12 md:px-24 flex flex-col sm:flex-row justify-between items-center gap-6 font-mono text-[11px] text-zinc-500 dark:text-zinc-500 tracking-wider">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Richard Zuikov</span>
          <span className="text-zinc-300 dark:text-zinc-800">·</span>
          <span>Flensburg</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-[10px] sm:text-[11px]">
          <a 
            href="https://github.com/Ri4ards2006" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase"
          >
            GitHub
          </a>
          <span className="text-zinc-300 dark:text-zinc-800">·</span>
          <Link 
            to="/contact" 
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase"
          >
            {language === 'de' ? 'Kontakt' : 'Contact'}
          </Link>
          <span className="text-zinc-300 dark:text-zinc-800">·</span>
          <Link 
            to="/impressum" 
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase"
          >
            {language === 'de' ? 'Impressum' : 'Legal'}
          </Link>
          <span className="text-zinc-300 dark:text-zinc-800">·</span>
          <Link 
            to="/datenschutz" 
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase"
          >
            {language === 'de' ? 'Datenschutz' : 'Privacy'}
          </Link>
        </div>
      </div>
    </footer>
  );
}
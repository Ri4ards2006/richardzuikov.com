import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/use-language';

export default function Footer() {
  const [language] = useLanguage();

  return (
    <footer className="w-full py-10 px-6 md:px-24 border-t border-zinc-200 dark:border-zinc-900 mt-20 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-500">
        <div>
          <span>© {new Date().getFullYear()} RICHARD ZUIKOV</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-[11px] tracking-wider">
          <a 
            href="https://github.com/Ri4ards2006" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            GITHUB
          </a>
          <Link 
            to="/contact" 
            className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            {language === 'de' ? 'KONTAKT' : 'CONTACT'}
          </Link>
          <span className="text-zinc-300 dark:text-zinc-800">/</span>
          <Link 
            to="/impressum" 
            className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors underline decoration-zinc-300 dark:decoration-zinc-800 underline-offset-4"
          >
            {language === 'de' ? 'IMPRESSUM' : 'LEGAL NOTICE'}
          </Link>
          <Link 
            to="/datenschutz" 
            className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors underline decoration-zinc-300 dark:decoration-zinc-800 underline-offset-4"
          >
            {language === 'de' ? 'DATENSCHUTZ' : 'PRIVACY'}
          </Link>
        </div>
      </div>
    </footer>
  );
}
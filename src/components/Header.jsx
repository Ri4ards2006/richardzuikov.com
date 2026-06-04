import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import MenuOverlay from './MenuOverlay';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Menu Button */}
      <button 
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-8 right-8 z-[999] w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all duration-300"
        aria-label="Open Menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="6" cy="12" r="1.5" />
          <circle cx="18" cy="12" r="1.5" />
        </svg>
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <MenuOverlay onClose={() => setIsMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
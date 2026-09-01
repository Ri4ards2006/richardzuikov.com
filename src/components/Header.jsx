import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import MenuOverlay from './MenuOverlay';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Editorial Floating Menu Trigger */}
      <button 
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-8 right-8 sm:top-10 sm:right-10 z-[999] w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-all duration-300 cursor-pointer shadow-sm"
        aria-label="Open Navigation Menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
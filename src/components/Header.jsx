// Header.jsx
import React, { useState } from 'react';
import MenuOverlay from './MenuOverlay';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-8 right-8 z-[999] w-12 h-12 flex items-center justify-center rounded-full border border-zinc-400 hover:border-black transition-all"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="7" cy="12" r="1.5" />
          <circle cx="17" cy="12" r="1.5" />
        </svg>
      </button>

      {/* Das Overlay wird nur gerendert, wenn isMenuOpen true ist */}
      {isMenuOpen && <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}
    </>
  );
}
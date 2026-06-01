import React, { useState } from 'react';
import MenuOverlay from './MenuOverlay'; // Hier importieren

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <button 
  onClick={() => {
    console.log("Button geklickt!");
    setIsMenuOpen(true);
  }}
  className="fixed top-8 right-8 z-[999] p-4 bg-white border border-black"
>
  MENU
</button>

      {/* DIESE ZEILE HAT GEFEHLT! */}
      {isMenuOpen && (
        <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      )}
    </>
  );
}
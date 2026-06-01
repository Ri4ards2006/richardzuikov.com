import React, { useState } from 'react';
import MenuOverlay from './MenuOverlay';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 999999,
          cursor: 'pointer',
          padding: '15px 25px',
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '50px',
          fontFamily: 'monospace'
        }}
        onClick={() => setIsMenuOpen(true)}
      >
        [ MENU ]
      </div>

      {isMenuOpen && (
        <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      )}
    </>
  );
}
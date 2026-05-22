import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    // min-h-screen zwingt den Viewport auf die volle Höhe, flex-col stapelt Header, Content und Footer
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Dein globaler Header */}
      <Header />
      
      {/* flex-grow dehnt den Content aus, damit der Footer nach ganz unten gedrückt wird */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Dein neuer, ausbalancierter High-End Footer */}
      <Footer />
    </div>
  );
}
import React from 'react';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
}



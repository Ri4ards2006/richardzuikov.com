import React from 'react';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
}




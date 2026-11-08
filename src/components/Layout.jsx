import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-white text-black dark:bg-[#09090b] dark:text-white transition-colors duration-300">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}

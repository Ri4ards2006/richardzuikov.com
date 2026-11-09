import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/use-language';
import { isAtlusPath } from '../lib/atlus';

export default function Footer() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const linkClass = 'inline-block py-3 hover:text-zinc-950 dark:hover:text-white transition-colors uppercase';

  return (
    <div className={isAtlusPath(pathname) ? 'dark contents' : 'contents'}>
    <footer className="relative z-10 w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b]">
      <div className="max-w-6xl mx-auto py-8 px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs text-zinc-600 dark:text-zinc-400 tracking-wider">
        <span>© {new Date().getFullYear()} Richard Zuikov · Flensburg</span>
        <div className="flex flex-wrap items-center gap-5">
          <Link to="/impressum" className={linkClass}>{t.nav.impressum}</Link>
          <Link to="/datenschutz" className={linkClass}>{t.nav.datenschutz}</Link>
        </div>
      </div>
    </footer>
    </div>
  );
}

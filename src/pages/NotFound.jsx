import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/use-language';
import { useDocumentTitle } from '../hooks/use-document-title';

export default function NotFound() {
  useDocumentTitle('404 — Richard Zuikov');
  const { t } = useLanguage();
  const { title, subtitle, button } = t.atlus.notFound;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-6 px-5 py-20 text-center bg-white text-ash-900 dark:bg-ash-900 dark:text-ash-100">
      <h1 className="font-cinzel font-bold uppercase text-4xl sm:text-7xl tracking-wide">{title}</h1>
      <p className="font-mono text-xs sm:text-sm tracking-wider text-ash-700 dark:text-ash-300">{subtitle}</p>
      <Link to="/" className="slab mt-4 font-mono tracking-widest">{button}</Link>
    </div>
  );
}

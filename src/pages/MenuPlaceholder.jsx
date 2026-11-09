import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/use-document-title';
import { useLanguage } from '../hooks/use-language';
import { QUICK_PATH } from '../lib/sections';

// Temporary "/" until the menu home replaces it; the full landing lives at /quick.
export default function MenuPlaceholder() {
  useDocumentTitle('Richard Zuikov — Embedded Systems & Hardware Developer');
  const { t } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ash-900 flex flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-anton uppercase text-6xl sm:text-8xl tracking-wide text-ash-100">Richard Zuikov</h1>
      <p className="font-cinzel text-lg text-ash-300">{t.landing.menuPlaceholder.label}</p>
      <Link to={QUICK_PATH} className="inline-flex items-center min-h-11 font-mono text-xs uppercase tracking-widest text-accent underline underline-offset-4">
        {t.landing.menuPlaceholder.quickRead}
      </Link>
    </div>
  );
}

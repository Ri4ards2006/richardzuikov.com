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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-5xl sm:text-7xl tracking-tight">Richard Zuikov</h1>
      <p className="font-mono text-xs tracking-widest uppercase">{t.landing.menuPlaceholder.label}</p>
      <Link to={QUICK_PATH} className="inline-flex items-center min-h-11 underline underline-offset-4">
        {t.landing.menuPlaceholder.quickRead}
      </Link>
    </div>
  );
}

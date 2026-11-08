import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/use-language';
import { useDocumentTitle } from '../hooks/use-document-title';

const copy = {
  de: { title: 'Seite nicht gefunden', text: 'Unter dieser Adresse gibt es nichts.' },
  en: { title: 'Page not found', text: 'There is nothing at this address.' },
};

export default function NotFound() {
  useDocumentTitle('404 — Richard Zuikov');
  const { t, language } = useLanguage();
  const { title, text } = copy[language] ?? copy.en;

  return (
    <div className="relative min-h-screen bg-white text-zinc-900 dark:bg-[#09090b] dark:text-[#f4f4f5] selection:bg-[#FFB000]/30 font-sans antialiased flex flex-col justify-center transition-colors duration-300">
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-12 md:px-24 py-20 space-y-6">
        <p className="font-mono text-[11px] text-[#FFB000] tracking-wider">RZ.ERROR · 404</p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">{title}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{text}</p>
        <Link
          to="/"
          className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>{t.nav.backHome.toUpperCase()}</span>
        </Link>
      </div>
    </div>
  );
}

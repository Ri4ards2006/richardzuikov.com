import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Download, MapPin } from 'lucide-react';
import { useLanguage } from '../../hooks/use-language';
import HeroPortrait from './HeroPortrait';
import SocialLinks from './SocialLinks';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="top" aria-labelledby="top-title" className="relative scroll-mt-16 bg-white dark:bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 pt-12 pb-28 md:pt-16 md:pb-36 md:min-h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div className="space-y-6">
          <span aria-hidden="true" className="block font-black leading-none text-7xl md:text-9xl text-zinc-200 dark:text-white/40 select-none">
            00
          </span>
          <h1 id="top-title" className="heading-skew text-5xl sm:text-7xl font-light tracking-tight text-zinc-950 dark:text-white">
            Richard Zuikov
          </h1>
          <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300">{t.career.role}</p>
          <p className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-zinc-600 dark:text-zinc-400">
            <MapPin aria-hidden="true" className="w-4 h-4" />
            {t.telemetry.location}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/quick#work" className="inline-flex items-center gap-2 min-h-11 px-5 py-3 rounded-lg bg-zinc-950 text-white dark:bg-[#f4f4f0] dark:text-[#050505] text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-white transition-colors duration-200">
              {t.landing.viewWork}
              <ArrowDown aria-hidden="true" className="w-4 h-4" />
            </Link>
            <a href="/cv/CV_Richard_Zuikov.pdf" download className="inline-flex items-center gap-2 min-h-11 px-5 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-800 dark:text-zinc-200 hover:border-zinc-500 transition-colors duration-200">
              {t.landing.downloadCv}
              <Download aria-hidden="true" className="w-4 h-4" />
            </a>
            <SocialLinks />
          </div>
        </div>
        <HeroPortrait className="w-full h-auto rounded-2xl" />
      </div>
    </section>
  );
}

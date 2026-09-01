"use client";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Copy, Check } from 'lucide-react';
import { useLanguage } from '../hooks/use-language';

export default function Contact() {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [emailString, setEmailString] = useState('');

  useEffect(() => {
    const user = 'contact';
    const domain = 'richardzuikov.com';
    setEmailString(`${user}@${domain}`);
  }, []);

  const handleCopy = (e) => {
    e.preventDefault();
    if (!emailString) return;
    navigator.clipboard.writeText(emailString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative min-h-screen bg-white text-zinc-900 dark:bg-[#09090b] dark:text-[#f4f4f5] overflow-x-hidden selection:bg-[#FFB000]/30 font-sans antialiased flex flex-col justify-between transition-colors duration-300">
      
      {/* ─── TOP NAVIGATION ─── */}
      <div className="pt-12 px-6 sm:px-12 md:px-24 max-w-5xl mx-auto w-full flex items-center justify-between z-50">
        <Link 
          to="/" 
          className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>{t.nav.backHome.toUpperCase()}</span>
        </Link>

        <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-600 hidden sm:inline tracking-wider">
          RZ.CONTACT · DIRECT INQUIRIES
        </span>
      </div>

      {/* ─── MAIN HERO CONTENT ─── */}
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-12 md:px-24 py-20 flex-grow flex flex-col justify-center space-y-12">
        
        {/* Intro Subtitle */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/60 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 tracking-wider">
            <Mail className="w-3.5 h-3.5 text-[#FFB000]" />
            <span>{t.contact.tag.toUpperCase()}</span>
          </div>

          <p className="text-sm md:text-base font-mono text-zinc-500 dark:text-zinc-400 leading-relaxed tracking-wide">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Monumental Email Headline with 1-Click Copy Action */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tighter text-zinc-950 dark:text-white leading-none break-all select-all">
              {emailString ? (
                <a 
                  href={`mailto:${emailString}`}
                  className="hover:text-[#FFB000] dark:hover:text-[#FFB000] transition-colors duration-300"
                >
                  {emailString}
                </a>
              ) : (
                <span>contact@richardzuikov.com</span>
              )}
            </h1>

            <button
              onClick={handleCopy}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 font-mono text-xs transition-all duration-200 cursor-pointer shrink-0 self-start sm:self-auto"
              title={t.telemetry.copyId}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">{t.telemetry.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.telemetry.copyId}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Minimal Social Channels */}
        <div className="flex items-center gap-6 pt-4 select-none">
          {/* LINKEDIN */}
          <a 
            href="https://www.linkedin.com/in/richard-zuikov-526745343" 
            target="_blank" 
            rel="noreferrer"
            className="p-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all duration-300"
            aria-label="LinkedIn"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>

          {/* GITHUB */}
          <a 
            href="https://github.com/Ri4ards2006" 
            target="_blank" 
            rel="noreferrer"
            className="p-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all duration-300"
            aria-label="GitHub"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
        </div>

      </div>

      {/* ─── MINIMAL FOOTER ─── */}
      <footer className="w-full max-w-5xl mx-auto px-6 sm:px-12 md:px-24 pb-14 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 font-mono text-[10px] text-zinc-500 tracking-wider">
        <div className="space-y-1">
          <div>{t.telemetry.coop}</div>
          <div>{t.telemetry.engineeringBase}</div>
        </div>
        <div className="flex items-center gap-3">
          <span>© {new Date().getFullYear()} Richard Zuikov</span>
          <span className="text-zinc-300 dark:text-zinc-800">·</span>
          <Link to="/impressum" className="hover:text-zinc-900 dark:hover:text-white transition-colors underline decoration-zinc-300 dark:decoration-zinc-800 underline-offset-2">
            {t.nav.legal}
          </Link>
        </div>
      </footer>

    </main>
  );
}
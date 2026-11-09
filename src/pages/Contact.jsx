import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, Download, Mail } from 'lucide-react';
import { useLanguage } from '../hooks/use-language';
import { useTheme } from '../hooks/use-theme';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useContactEmail } from '../hooks/use-contact-email';
import { grainTexture } from '../lib/noise-textures';
import { useScreen } from '../components/atlus/Screen';
import { socialLinks } from '../components/home/SocialLinks';
import EmberCanvas from '../components/home/EmberCanvas';
import Checkpoint from '../components/home/Checkpoint';

const canAnimate = () => typeof IntersectionObserver !== 'undefined' && typeof ResizeObserver !== 'undefined';

export default function Contact() {
  const { t } = useLanguage();
  const [theme] = useTheme();
  const reducedMotion = useReducedMotion();
  const { email, copied, copy } = useContactEmail();
  const { headingRef, handleBack } = useScreen('contact', t.landing.nav.contact);
  const effects = theme === 'dark';
  const motion = effects && !reducedMotion && canAnimate();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden flex flex-col bg-white text-ash-900 dark:bg-ash-900 dark:text-ash-100">
      {effects && (
        <>
          <div aria-hidden="true" className="ember-glow" />
          {motion && <EmberCanvas glow={false} />}
          <div aria-hidden="true" className="ember-vignette" />
          <div aria-hidden="true" className="ember-grain" style={{ backgroundImage: grainTexture() }} />
        </>
      )}
      {motion && (
        <Checkpoint text={t.atlus.contact.kindled} storageKey="seen-kindled" textClassName="font-cinzel font-bold text-xl sm:text-3xl tracking-[0.25em] text-center text-accent bg-ash-900/90 px-8 py-4" />
      )}

      <div className="relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-12 pt-8">
        <Link to="/" onClick={handleBack} className="inline-flex items-center min-h-11 font-mono text-xs tracking-widest text-ash-700 dark:text-ash-300 hover:underline underline-offset-4">
          {t.atlus.back}
        </Link>
      </div>

      <div className="relative z-10 flex-1 w-full max-w-3xl mx-auto px-5 sm:px-12 pb-20 flex flex-col justify-center text-center">
        <h1 ref={headingRef} tabIndex={-1} className="outline-none font-cinzel font-bold uppercase text-4xl sm:text-6xl tracking-wide leading-tight">
          {t.atlus.contact.headline}
        </h1>
        <p className="mt-5 text-base font-light leading-relaxed text-ash-700 dark:text-ash-300">{t.contact.subtitle}</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <a href={email ? `mailto:${email}` : undefined} className="slab sm:col-span-2 justify-center break-all">
            <Mail aria-hidden="true" className="w-4 h-4 shrink-0" />
            {email}
          </a>
          <button type="button" onClick={copy} className="slab">
            {copied ? <Check aria-hidden="true" className="w-4 h-4" /> : <Copy aria-hidden="true" className="w-4 h-4" />}
            <span role="status">{copied ? t.telemetry.copied : t.landing.copyEmail}</span>
          </button>
          <a href="/cv/CV_Richard_Zuikov.pdf" download className="slab">
            <Download aria-hidden="true" className="w-4 h-4" />
            {t.landing.downloadCv}
          </a>
          {socialLinks.map(({ label, href, icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="slab">
              <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {icon}
              </svg>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

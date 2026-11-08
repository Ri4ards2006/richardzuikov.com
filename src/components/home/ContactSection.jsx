import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, Mail } from 'lucide-react';
import { useLanguage } from '../../hooks/use-language';
import { useTheme } from '../../hooks/use-theme';
import { useReducedMotion } from '../../hooks/use-reduced-motion';
import Section from './Section';
import SocialLinks from './SocialLinks';
import EmberCanvas from './EmberCanvas';
import Checkpoint from './Checkpoint';

const canAnimate = () => typeof IntersectionObserver !== 'undefined' && typeof ResizeObserver !== 'undefined';

export default function ContactSection({ number }) {
  const { t } = useLanguage();
  const [theme] = useTheme();
  const reducedMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  // Assembled at runtime so the address is not in the static markup.
  useEffect(() => {
    setEmail(`contact@${'richardzuikov.com'}`);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const showEffects = theme === 'dark' && !reducedMotion && canAnimate();
  const background = showEffects ? (
    <>
      <EmberCanvas />
      <Checkpoint text={t.landing.checkpoint} />
    </>
  ) : null;

  return (
    <Section id="contact" number={number} title={t.landing.nav.contact} background={background}>
      <div className="space-y-8 max-w-2xl min-h-[40vh]">
        <p className="text-lg font-light leading-relaxed text-zinc-800 dark:text-zinc-200">{t.contact.subtitle}</p>
        <div className="flex flex-wrap items-center gap-3">
          <a href={email ? `mailto:${email}` : undefined} className="inline-flex items-center gap-2 min-h-11 px-5 py-3 rounded-lg bg-[#FFB000] text-[#09090b] text-sm font-semibold hover:bg-[#ffc233] transition-colors duration-200 break-all">
            <Mail aria-hidden="true" className="w-4 h-4 shrink-0" />
            {email}
          </a>
          <button type="button" onClick={handleCopy} className="inline-flex items-center gap-2 min-h-11 px-5 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-800 dark:text-zinc-200 hover:border-zinc-500 transition-colors duration-200">
            {copied ? <Check aria-hidden="true" className="w-4 h-4" /> : <Copy aria-hidden="true" className="w-4 h-4" />}
            <span role="status">{copied ? t.telemetry.copied : t.landing.copyEmail}</span>
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a href="/cv/CV_Richard_Zuikov.pdf" download className="inline-flex items-center gap-2 min-h-11 px-5 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-800 dark:text-zinc-200 hover:border-zinc-500 transition-colors duration-200">
            {t.landing.downloadCv}
            <Download aria-hidden="true" className="w-4 h-4" />
          </a>
          <SocialLinks />
        </div>
      </div>
    </Section>
  );
}

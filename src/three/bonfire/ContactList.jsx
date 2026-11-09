import React from 'react';
import { Check, Copy } from 'lucide-react';
import { useLanguage } from '../../hooks/use-language';
import { useContactEmail } from '../../hooks/use-contact-email';
import { socialLinks } from '../../components/home/SocialLinks';

const rowClass = 'abyss-row group font-mono uppercase tracking-widest text-sm';

// Import this file directly: index.js pulls in three.js, which must stay out of the initial bundle.
export default function ContactList() {
  const { t } = useLanguage();
  const { email, copied, copy } = useContactEmail();

  const githubLink = socialLinks.find((s) => s.label.toLowerCase() === 'github')?.href || 'https://github.com/Ri4ards2006';
  const linkedinLink = socialLinks.find((s) => s.label.toLowerCase() === 'linkedin')?.href || 'https://www.linkedin.com/in/richard-zuikov-526745343';

  return (
    <div className="mt-8">
      {/* Displayed Email with small copy box next to it */}
      <div className="flex items-center justify-between gap-3 p-3 bg-ash-800/90 border border-ash-700 font-mono text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-ash-400 select-none">EMAIL //</span>
          <span className="text-ash-100 font-medium truncate select-all">{email}</span>
        </div>
        <button
          type="button"
          onClick={copy}
          title={copied ? t.telemetry.copied : t.landing.copyEmail}
          aria-label={copied ? t.telemetry.copied : t.landing.copyEmail}
          className="shrink-0 p-1.5 border border-ash-600 hover:border-ash-300 bg-ash-900/60 hover:bg-ash-700 text-ash-200 transition-colors"
        >
          {copied ? (
            <Check aria-hidden="true" className="w-3.5 h-3.5 text-ember-gold" />
          ) : (
            <Copy aria-hidden="true" className="w-3.5 h-3.5 text-ash-300" />
          )}
          <span className="sr-only" role="status">
            {copied ? t.telemetry.copied : t.landing.copyEmail}
          </span>
        </button>
      </div>

      {/* Souls-style prompt action list: > SEND MAIL · > CV (PDF) · > GITHUB · > LINKEDIN */}
      <ul className="mt-4 border-t border-ash-700">
        <li>
          <a href={email ? `mailto:${email}` : undefined} className={rowClass}>
            <span aria-hidden="true" className="text-ash-500 group-hover:text-ember-hot transition-colors select-none">&gt;</span>
            <span>SEND MAIL</span>
          </a>
        </li>
        <li>
          <a href="/cv/CV_Richard_Zuikov.pdf" download className={rowClass}>
            <span aria-hidden="true" className="text-ash-500 group-hover:text-ember-hot transition-colors select-none">&gt;</span>
            <span>CV (PDF)</span>
          </a>
        </li>
        <li>
          <a href={githubLink} target="_blank" rel="noreferrer" className={rowClass}>
            <span aria-hidden="true" className="text-ash-500 group-hover:text-ember-hot transition-colors select-none">&gt;</span>
            <span>GITHUB</span>
          </a>
        </li>
        <li>
          <a href={linkedinLink} target="_blank" rel="noreferrer" className={rowClass}>
            <span aria-hidden="true" className="text-ash-500 group-hover:text-ember-hot transition-colors select-none">&gt;</span>
            <span>LINKEDIN</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

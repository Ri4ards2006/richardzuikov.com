import React from 'react';
import { Check, Copy, Download, Mail } from 'lucide-react';
import { useLanguage } from '../../hooks/use-language';
import { useContactEmail } from '../../hooks/use-contact-email';
import { socialLinks } from '../../components/home/SocialLinks';

const rowClass = 'abyss-row';

// Import this file directly: index.js pulls in three.js, which must stay out of the initial bundle.
export default function ContactList() {
  const { t } = useLanguage();
  const { email, copied, copy } = useContactEmail();

  return (
    <ul className="mt-8 border-t border-ash-700 font-mono text-sm">
      <li><a href={email ? `mailto:${email}` : undefined} className={rowClass}><Mail aria-hidden="true" className="w-4 h-4 shrink-0" /><span className="break-all">{email}</span></a></li>
      <li>
        <button type="button" onClick={copy} className={rowClass}>
          {copied ? <Check aria-hidden="true" className="w-4 h-4" /> : <Copy aria-hidden="true" className="w-4 h-4" />}
          <span role="status">{copied ? t.telemetry.copied : t.landing.copyEmail}</span>
        </button>
      </li>
      <li><a href="/cv/CV_Richard_Zuikov.pdf" download className={rowClass}><Download aria-hidden="true" className="w-4 h-4" />{t.landing.downloadCv}</a></li>
      {socialLinks.map(({ label, href, icon }) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noreferrer" className={rowClass}>
            <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

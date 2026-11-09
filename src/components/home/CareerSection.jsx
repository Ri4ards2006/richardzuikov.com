import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../../hooks/use-language';
import Section from './Section';

export default function CareerSection({ number }) {
  const { t } = useLanguage();

  return (
    <Section id="career" number={number} title={t.landing.nav.career} tone="alt">
      <h3 className="text-sm font-mono tracking-wider text-zinc-600 dark:text-zinc-400 mb-6">{t.career.chronologyTitle}</h3>
      <ol className="border-l border-zinc-300 dark:border-zinc-700 space-y-6">
        {t.career.timeline.map((entry) => (
          <li key={entry.title} className="relative pl-6">
            <span aria-hidden="true" className="absolute -left-[4.5px] top-2 w-2 h-2 rounded-full bg-zinc-950 dark:bg-white" />
            <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{entry.year} · {entry.type}</p>
            <p className="mt-1 text-base text-zinc-950 dark:text-zinc-100">{entry.title}</p>
          </li>
        ))}
      </ol>

      <h3 className="mt-16 text-sm font-mono tracking-wider text-zinc-600 dark:text-zinc-400 mb-6">{t.career.credentialsTitle}</h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {t.career.certificates.map((cert) => (
          <li key={cert.id} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
            <p className="text-sm text-zinc-950 dark:text-zinc-100">{cert.title}</p>
            <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{cert.issuer} · {cert.date}</p>
            {/* verifyUrl is only set when it points at this exact credential. */}
            {cert.verifyUrl && (
              <a href={cert.verifyUrl} target="_blank" rel="noreferrer" aria-label={`${t.telemetry.verifyOnPortal}: ${cert.title}`} className="mt-auto inline-flex items-center gap-1.5 min-h-11 text-xs text-zinc-900 dark:text-white underline underline-offset-4">
                {t.telemetry.verifyOnPortal}
                <ExternalLink aria-hidden="true" className="w-3.5 h-3.5" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

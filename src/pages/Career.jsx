import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../hooks/use-language';
import Screen from '../components/atlus/Screen';

export default function Career() {
  const { t } = useLanguage();

  return (
    <Screen id="career" number="04" title={t.landing.nav.career} hud={t.atlus.hud.career}>
      <h2 className="font-mono text-xs tracking-widest text-ash-300 mb-4">{t.atlus.timeline}</h2>
      <ol className="space-y-2">
        {t.career.timeline.map((entry, index) => {
          const [role, org] = entry.title.split(' | ');
          return (
            <li key={entry.title} className="-skew-x-6 bg-ash-800 border-l-4 border-accent">
              <div className="skew-x-6 grid grid-cols-[2rem_minmax(0,1fr)] sm:grid-cols-[2.5rem_8rem_minmax(0,1fr)_auto] items-baseline gap-x-3 px-4 py-3">
                <span aria-hidden="true" className="font-anton text-xl text-accent">{String(index + 1).padStart(2, '0')}</span>
                <span className="font-mono text-xs text-ash-300">{entry.year}</span>
                <span className="col-start-2 sm:col-start-auto font-anton uppercase text-lg tracking-wide text-ash-100">{role}</span>
                <span className="col-start-2 sm:col-start-auto font-mono text-xs text-ash-300">{org ?? entry.type}</span>
              </div>
            </li>
          );
        })}
      </ol>

      <h2 className="font-mono text-xs tracking-widest text-ash-300 mt-12 mb-4">{t.atlus.certificates}</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {t.career.certificates.map((cert) => (
          <li key={cert.id} className="flex flex-col gap-1 p-3 border border-ash-600">
            <p className="text-sm text-ash-100">{cert.title}</p>
            <p className="font-mono text-[11px] text-ash-300">{cert.issuer} · {cert.date}</p>
            {/* verifyUrl is only set when it points at this exact credential. */}
            {cert.verifyUrl && (
              <a href={cert.verifyUrl} target="_blank" rel="noreferrer" aria-label={`${t.telemetry.verifyOnPortal}: ${cert.title}`} className="mt-auto inline-flex items-center gap-1.5 min-h-11 text-xs text-accent underline underline-offset-4">
                {t.telemetry.verifyOnPortal}
                <ExternalLink aria-hidden="true" className="w-3.5 h-3.5" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </Screen>
  );
}

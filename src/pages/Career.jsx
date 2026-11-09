import React from 'react';
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

    </Screen>
  );
}

import React, { useState } from 'react';
import { useLanguage } from '../hooks/use-language';
import { stackLevels } from '../data/stack-levels';
import Screen from '../components/atlus/Screen';

const pad = (value) => String(value).padStart(2, '0');

export default function Stack() {
  const { t } = useLanguage();
  const domains = Object.entries(t.career.domains);
  const [selected, setSelected] = useState(domains[0][0]);
  const selectedIndex = domains.findIndex(([key]) => key === selected);
  const domain = t.career.domains[selected];

  return (
    <Screen id="stack" number="03" title={t.landing.nav.stack} hud={t.atlus.hud.stack}>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8">
        <div className="has-message">
          <ul className="space-y-2">
          {domains.map(([key, item], index) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => setSelected(key)}
                aria-pressed={selected === key}
                className={`w-full flex items-center gap-4 min-h-11 px-3 py-2 text-left transition-colors duration-150 ${selected === key ? 'bg-ash-100 text-ash-900' : 'text-ash-200 hover:bg-ash-800'}`}
              >
                <span aria-hidden="true" className="font-anton text-5xl leading-none">{pad(index + 1)}</span>
                <span className="min-w-0">
                  <span className="block font-mono text-[11px] tracking-widest">{t.atlus.rank} {pad(index + 1)}</span>
                  <span className="block font-anton uppercase text-xl tracking-wide">{item.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
          <span aria-hidden="true" className="ground-message mt-2">{t.atlus.hints.stack}</span>
        </div>

        <section aria-label={domain.name} className="border border-ash-600 p-4 sm:p-6">
          <p className="flex flex-wrap justify-between gap-x-4 font-mono text-xs tracking-widest text-accent">
            <span>{pad(selectedIndex + 1)} {t.atlus.skills}</span>
            <span>{domain.items.length}/{domain.items.length}</span>
          </p>
          <h2 className="font-anton uppercase text-3xl tracking-wide mt-2">{domain.name}</h2>
          <p className="mt-1 text-sm text-ash-300">{domain.desc}</p>
          <ol className="mt-5 divide-y divide-ash-700">
            {domain.items.map((item, index) => {
              const level = stackLevels[selected]?.[index] ?? null;
              return (
                <li key={item} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-3 py-3">
                  <span aria-hidden="true" className="font-mono text-xs text-ash-400">{pad(index + 1)}</span>
                  <span className="text-sm text-ash-100">{item}</span>
                  <span className="font-mono text-[11px] tracking-wider text-ash-300">{level ?? t.atlus.unrated}</span>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </Screen>
  );
}

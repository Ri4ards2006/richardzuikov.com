import React, { useState } from 'react';
import { useLanguage } from '../hooks/use-language';
import { portraits } from '../data/portraits';
import Screen, { SubMenu } from '../components/atlus/Screen';
import PanelIllustration from '../components/stage/PanelIllustration';

export default function About() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const portrait = portraits.about;
  // Age is left out; focus, target and location are the facts a visitor needs here.
  const stats = t.about.quickFacts.slice(1);
  const entries = t.about.logEntries;
  const items = [{ id: 'profile', label: t.atlus.about.who }, ...entries.map((entry) => ({ id: entry.title, label: entry.title }))];
  const entry = active > 0 ? entries[active - 1] : null;

  return (
    <Screen id="about" number="01" title={t.landing.nav.about} hud={t.atlus.hud.about} prop="domeCamera">
      <div className="scr-body">
        <SubMenu label={t.landing.nav.about} items={items} active={active} onSelect={setActive} />
        <section key={active} aria-live="polite" className="scr-detail slash-wipe">
          {entry ? (
            <>
              <div className="flex items-start justify-between gap-5">
                <span aria-hidden="true" className="font-anton text-6xl leading-none text-ash-600">{String(active).padStart(2, '0')}</span>
                <PanelIllustration index={active - 1} />
              </div>
              <h2 className="font-anton uppercase text-3xl tracking-wide mt-3">{entry.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-ash-200">{entry.desc}</p>
              {/* TODO strings are placeholders for facts still to be supplied, so visitors never see them. */}
              {import.meta.env.DEV && <p className="mt-3 font-mono text-xs text-ash-300">{entry.todo}</p>}
            </>
          ) : (
            <div className="grid gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start">
              <img
                src={portrait.large}
                srcSet={portrait.isPlaceholder ? undefined : `${portrait.small} 700h, ${portrait.large} 1400h`}
                alt={portrait.isPlaceholder ? '' : 'Richard Zuikov'}
                className="w-full max-h-[22rem] object-contain object-bottom grayscale"
              />
              <div className="space-y-4">
                <h2 className="font-anton uppercase text-3xl tracking-wide">{t.atlus.about.who}</h2>
                <p className="text-base leading-relaxed text-ash-100">{t.about.headline}</p>
                <p className="text-sm leading-relaxed text-ash-300">{t.career.summary}</p>
                <dl className="space-y-2">
                  {stats.map((stat) => (
                    <div key={stat.label} className="scr-stat">
                      <dt>{stat.label}</dt>
                      <dd>{stat.val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </section>
      </div>
    </Screen>
  );
}

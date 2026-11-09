import React from 'react';
import { useLanguage } from '../hooks/use-language';
import { portraits } from '../data/portraits';
import Screen from '../components/atlus/Screen';

export default function About() {
  const { t } = useLanguage();
  const portrait = portraits.about;
  // Age is left out; focus, target and location are the facts a visitor needs here.
  const stats = t.about.quickFacts.slice(1);

  return (
    <Screen id="about" number="01" title={t.landing.nav.about} hud={t.atlus.hud.about}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <img
          src={portrait.large}
          srcSet={portrait.isPlaceholder ? undefined : `${portrait.small} 700h, ${portrait.large} 1400h`}
          alt={portrait.isPlaceholder ? '' : 'Richard Zuikov'}
          fetchpriority="high"
          className="w-full max-h-[70vh] object-contain object-bottom"
        />
        <div className="space-y-6">
          <p className="text-lg font-light leading-relaxed text-ash-200">{t.about.headline}</p>
          <p className="text-base font-light leading-relaxed text-ash-300">{t.career.summary}</p>
          <dl className="space-y-3">
            {stats.map((stat) => (
              <div key={stat.label} className="-skew-x-6 bg-ash-800 border-l-4 border-accent px-4 py-2">
                <div className="skew-x-6 flex flex-wrap justify-between gap-x-4">
                  <dt className="font-mono text-xs tracking-widest text-ash-300 uppercase">{stat.label}</dt>
                  <dd className="font-mono text-xs text-ash-100">{stat.val}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Screen>
  );
}

import React from 'react';
import { useLanguage } from '../../hooks/use-language';
import { useSectionEnter } from '../../hooks/use-section-enter';
import { nowEntries } from '../../data/now';

const pick = (value, language) => (typeof value === 'string' ? value : value[language]);

// One animated line drawing per entry, CSS only, paused off screen like the descent panels.
function NowIllustration({ id }) {
  if (id === 'trich') {
    return (
      <div aria-hidden="true" className="now-ill now-trits">
        {[1.3, 2.2, 0.9, 1.7, 2.6, 1.1, 1.9, 0.7, 2.4].map((period, index) => (
          <span key={period} style={{ '--period': `${period}s`, '--delay': `${index * -0.41}s` }}>
            <span>−</span><span>0</span><span>+</span>
          </span>
        ))}
      </div>
    );
  }
  if (id === 'cluster') {
    return (
      <svg aria-hidden="true" className="now-ill now-rack" viewBox="0 0 160 56">
        {[4, 22, 40].map((y, row) => (
          <g key={y}>
            <rect x="2" y={y} width="78" height="12" />
            <circle className="now-led" style={{ '--delay': `${row * -0.6}s` }} cx="70" cy={y + 6} r="2" />
          </g>
        ))}
        <path className="now-link" d="M80 10 H104 V28 H158 M80 46 H104 V28" />
        <path className="now-packet" d="M80 10 H104 V28 H158" pathLength="100" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" className="now-ill now-cam" viewBox="0 0 160 56">
      <path d="M4 8 H40 M22 8 V16" />
      <path className="now-cam-head" d="M10 16 H34 L38 30 H6 Z" />
      <path className="now-link" d="M22 30 V48 H156" />
      <path className="now-packet" d="M22 30 V48 H156" pathLength="100" />
      <path className="now-cone" d="M38 22 L92 6 M38 26 L92 42" />
    </svg>
  );
}

function QuestBar({ entry, language }) {
  const known = entry.done !== null;
  return (
    <div className="quest">
      <ol className={`quest-steps ${known ? '' : 'is-unknown'}`} style={{ '--steps': entry.steps.length }}>
        {entry.steps.map((step, index) => {
          let state = '';
          if (known && index < entry.done) state = 'is-done';
          else if (known && index === entry.done && entry.current) state = 'is-current';
          return <li key={step} className={state}><span>{step}</span></li>;
        })}
      </ol>
      <p className="quest-status">{known ? `${Math.min(entry.done + 1, entry.steps.length)} / ${entry.steps.length}` : '— / —'} · {language === 'de' ? 'IN ARBEIT' : 'IN PROGRESS'}</p>
    </div>
  );
}

export default function NowSection() {
  const { language, t } = useLanguage();
  const ref = useSectionEnter();
  return (
    <section id="now" ref={ref} aria-labelledby="now-title" className="stage-now scroll-mt-16">
      <p className="font-mono text-xs tracking-widest text-ash-300">{t.atlus.now.label}</p>
      <h2 id="now-title" className="heading-skew font-anton uppercase text-5xl sm:text-7xl tracking-wide leading-tight mt-2">{t.atlus.now.title}</h2>
      <ul className="now-list">
        {nowEntries.map((entry, index) => (
          <li key={entry.id} className="now-panel" style={{ '--i': index }}>
            <div className="flex items-start justify-between gap-4">
              <span aria-hidden="true" className="font-anton text-5xl leading-none text-ash-600">{String(index + 1).padStart(2, '0')}</span>
              <NowIllustration id={entry.id} />
            </div>
            <p className="mt-3 font-mono text-[11px] tracking-widest uppercase text-ash-300">{pick(entry.kicker, language)}</p>
            <h3 className="font-anton uppercase text-3xl tracking-wide mt-1">{pick(entry.title, language)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ash-200">{pick(entry.lines, language)}</p>
            <QuestBar entry={entry} language={language} />
            {/* TODO strings are placeholders for facts still to be supplied, so visitors never see them. */}
            {import.meta.env.DEV && <p className="mt-2 font-mono text-[11px] text-ash-300">{pick(entry.todo, language)}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

import React from 'react';
import { useLanguage } from '../../hooks/use-language';
import { useSectionEnter } from '../../hooks/use-section-enter';
import { nowEntries } from '../../data/now';
import { Icon } from '../atlus/glyphs';

const pick = (value, language) => (typeof value === 'string' ? value : value[language]);
const isTodo = (text) => typeof text === 'string' && text.startsWith('TODO');

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
  // Helm: the helmet line icon (design/assets-src/icons/viking-helmet.svg).
  return <Icon name="vikingHelmet" className="now-ill now-helm" />;
}

function QuestBar({ entry, language }) {
  const known = entry.done !== null;
  return (
    <div className="quest">
      <ol className={`quest-steps ${known ? '' : 'is-unknown'}`} style={{ '--steps': Math.max(1, entry.steps.length) }}>
        {/* No steps known yet: one empty segment that scans. */}
        {!entry.steps.length && <li><span /></li>}
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
        {nowEntries.map((source, index) => {
          // Entries with i18n read their texts from translations (atlus.now.<key>).
          const text = source.i18n && t.atlus.now[source.i18n];
          const entry = text ? { ...source, title: text.title, kicker: text.kicker, lines: text.summary, todo: [text.summary, text.progress].filter(isTodo).join(' · ') } : source;
          const lines = pick(entry.lines, language);
          return (
          <li key={entry.id} className="now-panel" style={{ '--i': index }}>
            <div className="flex items-start justify-between gap-4">
              <span aria-hidden="true" className="font-anton text-5xl leading-none text-ash-600">{String(index + 1).padStart(2, '0')}</span>
              <NowIllustration id={entry.id} />
            </div>
            <p className="mt-3 font-mono text-[11px] tracking-widest uppercase text-ash-300">{pick(entry.kicker, language)}</p>
            <h3 className="font-anton uppercase text-3xl tracking-wide mt-1">{pick(entry.title, language)}</h3>
            {!isTodo(lines) && <p className="mt-2 text-sm leading-relaxed text-ash-200">{lines}</p>}
            <QuestBar entry={entry} language={language} />
            {/* TODO strings are placeholders for facts still to be supplied, so visitors never see them. */}
            {import.meta.env.DEV && entry.todo && <p className="mt-2 font-mono text-[11px] text-ash-300">{pick(entry.todo, language)}</p>}
          </li>
          );
        })}
      </ul>
    </section>
  );
}

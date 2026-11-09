import React, { useState } from 'react';
import { useLanguage } from '../../hooks/use-language';
import { useSectionEnter } from '../../hooks/use-section-enter';
import { stackUses } from '../../data/stack-uses';
import SkillVignette from './SkillVignette';

const pad = (value) => String(value).padStart(2, '0');

export default function SkillBoard() {
  const { t } = useLanguage();
  const domains = Object.entries(t.career.domains);
  const [selected, setSelected] = useState(domains[0][0]);
  const selectedIndex = domains.findIndex(([key]) => key === selected);
  const domain = t.career.domains[selected];
  const boardRef = useSectionEnter();

  return (
    <div ref={boardRef} className="skill-board">
      <div className="has-message">
        <ul className="skill-slabs">
          {domains.map(([key, item], index) => (
            <li key={key} style={{ '--i': index }}>
              <button type="button" onClick={() => setSelected(key)} aria-pressed={selected === key} className={`skill-slab ${selected === key ? 'is-active' : ''}`}>
                <span aria-hidden="true" className="font-anton text-5xl leading-none">{pad(index + 1)}</span>
                <span className="block font-anton uppercase text-xl tracking-wide">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
        <span aria-hidden="true" className="ground-message mt-2">{t.atlus.hints.stack}</span>
      </div>

      {/* The key replays the slash wipe and the row reveal on every category change. */}
      <section key={selected} aria-label={domain.name} className="skill-panel slash-wipe">
        <SkillVignette category={selected} />
        <p className="font-mono text-xs tracking-widest text-ash-300">{pad(selectedIndex + 1)} / {t.atlus.skills}</p>
        <h3 className="font-anton uppercase text-3xl tracking-wide mt-2">{domain.name}</h3>
        <p className="mt-1 text-sm text-ash-300">{domain.desc}</p>
        <ol className="mt-5 divide-y divide-ash-700">
          {domain.items.map((item, index) => {
            const uses = stackUses[selected]?.[index];
            return (
              <li key={item} style={{ '--i': index }} className="skill-row grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-3 py-3">
                <span aria-hidden="true" className="font-mono text-xs text-ash-400">{pad(index + 1)}</span>
                <div className="min-w-0">
                  <span className="text-sm text-ash-100">{item}</span>
                  {uses && (
                    <ul aria-label={t.atlus.usedIn} className="mt-1.5 flex flex-wrap gap-1.5">
                      {uses.map((use) => <li key={use} className="stack-use">{use}</li>)}
                    </ul>
                  )}
                  {/* TODO strings are placeholders for facts still to be supplied, so visitors never see them. */}
                  {!uses && import.meta.env.DEV && <p className="mt-1.5 font-mono text-[11px] text-ash-300">{t.atlus.todoStackUse}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

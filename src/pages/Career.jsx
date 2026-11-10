import React, { useState } from 'react';
import { useLanguage } from '../hooks/use-language';
import { ROMAN } from '../lib/atlus';
import Screen from '../components/atlus/Screen';
import RecordBoard from '../components/atlus/RecordBoard';

// RecordBoard is the sub-menu (one bar per entry); the panel shows the entry under the pointer or focus.
export default function Career() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const entry = t.career.timeline[active];
  const [role, org] = entry.title.split(' | ');

  return (
    <Screen id="career" number="04" title={t.landing.nav.career} hud={t.atlus.hud.career} prop="rackUnit">
      <div className="scr-body is-career">
        <RecordBoard onActive={setActive} />
        <section key={active} aria-live="polite" className="scr-detail slash-wipe">
          <p aria-hidden="true" className="scr-rank">{ROMAN[active] ?? active + 1}</p>
          <h2 className="font-anton uppercase text-3xl tracking-wide">{role}</h2>
          <p className="mt-1 font-mono text-xs tracking-widest text-ash-300">{org ?? entry.type} · {entry.year}</p>
          {entry.desc && <p className="mt-4 text-sm leading-relaxed text-ash-200">{entry.desc}</p>}
          {entry.tags.length > 0 && <ul className="inspect-tags mt-4">{entry.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
        </section>
      </div>
    </Screen>
  );
}

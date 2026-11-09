import React from 'react';
import { useLanguage } from '../../hooks/use-language';
import { ROMAN } from '../../lib/atlus';
import DetailScreen from './DetailScreen';
import { TraceStar } from './glyphs';

// Career entry detail: rank, role, company, period, bullets, skills gained.
// Bullets come from career.timeline[].bullets; entries without them show their description to
// visitors and a TODO key in development.
export default function CareerDetail({ index, onIndex, onClose }) {
  const { t } = useLanguage();
  const timeline = t.career.timeline;
  const entry = timeline[index];
  const [role, org] = entry.title.split(' | ');

  return (
    <DetailScreen label={role} index={index} count={timeline.length} onIndex={onIndex} onClose={onClose}>
      <div className="dts-grid">
        <p aria-hidden="true" className="dts-rank">{ROMAN[index] ?? index + 1}</p>
        <div className="min-w-0">
          <p className="font-mono text-xs tracking-widest text-ash-300">{entry.type}</p>
          <h2 className="dts-title">{role}</h2>
          <p className="mt-2 font-mono text-sm tracking-wider text-ash-200">{org} · {entry.year}</p>
          {entry.bullets?.length ? (
            <ul className="dts-bullets">
              {entry.bullets.map((bullet) => <li key={bullet}><TraceStar small />{bullet}</li>)}
            </ul>
          ) : (
            <>
              {entry.desc && <p className="mt-5 text-base leading-relaxed text-ash-200">{entry.desc}</p>}
              {/* TODO strings are placeholders for facts still to be supplied, so visitors never see them. */}
              {import.meta.env.DEV && <p className="mt-3 font-mono text-xs text-ash-300">{t.atlus.detail.todoBullets}</p>}
            </>
          )}
          {entry.tags.length > 0 && (
            <>
              <h3 className="dts-label">{t.atlus.detail.skills}</h3>
              <ul className="inspect-tags">{entry.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            </>
          )}
        </div>
      </div>
    </DetailScreen>
  );
}

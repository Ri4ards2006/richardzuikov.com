import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../hooks/use-language';
import { useSectionEnter } from '../../hooks/use-section-enter';
import { ROMAN } from '../../lib/atlus';

const DETAIL_SENTENCES = 2;
const ACTIVE_LINE = 0.45;

const firstSentences = (text) => text.split(/(?<=\.)\s+/).slice(0, DETAIL_SENTENCES).join(' ');

function FlipDigit({ value }) {
  const previous = useRef(value);
  const old = previous.current;
  useEffect(() => { previous.current = value; }, [value]);
  return (
    <span className="flip-digit">
      {old !== value && <span key={`old-${old}`} className="flip-old">{old}</span>}
      <span key={value} className={old !== value ? 'flip-new' : undefined}>{value}</span>
    </span>
  );
}

export default function RecordBoard({ onEnter }) {
  const { t } = useLanguage();
  const timeline = t.career.timeline;
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(null);
  const barRefs = useRef([]);
  const boardRef = useSectionEnter(onEnter);

  // The numeral follows the bar nearest the reading line while the page scrolls.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * ACTIVE_LINE;
      let best = 0;
      let bestDistance = Infinity;
      barRefs.current.forEach((bar, index) => {
        if (!bar) return;
        const rect = bar.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - line);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [timeline.length]);

  return (
    <div ref={boardRef} className="record-board">
      <span aria-hidden="true" className="travel-lines" />
      <div aria-hidden="true" className="record-year">
        {[...timeline[active].year.slice(0, 4)].map((digit, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <FlipDigit key={index} value={digit} />
        ))}
      </div>
      <ol className="record-list">
        {timeline.map((entry, index) => {
          const [role, org] = entry.title.split(' | ');
          const isOpen = open === index;
          return (
            <li key={entry.title} ref={(node) => { barRefs.current[index] = node; }} className="record-item" style={{ '--i': index }}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : index)} className={`record-bar ${index === active ? 'is-active' : ''} ${isOpen ? 'is-open' : ''}`}>
                <span aria-hidden="true" className="record-rank">{ROMAN[index] ?? index + 1}</span>
                <span className="record-role">{role}</span>
                <span className="record-meta">{org ?? entry.type} · {entry.year}</span>
              </button>
              {isOpen && (
                <div className="record-detail slash-wipe">
                  <p>{firstSentences(entry.desc)}</p>
                  {/* TODO strings are placeholders for facts still to be supplied, so visitors never see them. */}
                  {import.meta.env.DEV && <p className="mt-2 font-mono text-[11px] text-ash-300">{t.atlus.todoRecord}</p>}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

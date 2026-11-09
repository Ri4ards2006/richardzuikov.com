import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../hooks/use-language';
import { useSectionEnter } from '../../hooks/use-section-enter';
import { ROMAN } from '../../lib/atlus';

const DETAIL_SENTENCES = 2;
const HEADER_PX = 64;

// Periods such as "Dec 2024 – Aug 2025" flip to their first four-digit year.
const firstYear = (period) => period.match(/\d{4}/)?.[0] ?? period.slice(0, 4);

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
  const listRef = useRef(null);
  const boardRef = useSectionEnter(onEnter);

  // The numeral follows the bar nearest a reading line placed where the first bar rests on landing.
  // Layout offsets, because the bars are still transformed during their entrance.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const board = boardRef.current;
      const anchor = board.closest('section') ?? board.parentElement;
      const listTop = listRef.current.getBoundingClientRect().top;
      const centre = (bar) => bar.offsetTop + bar.offsetHeight / 2;
      const bars = barRefs.current.filter(Boolean);
      const line = HEADER_PX + (listTop - anchor.getBoundingClientRect().top) + centre(bars[0]);
      let best = 0;
      bars.forEach((bar, index) => {
        if (Math.abs(listTop + centre(bar) - line) < Math.abs(listTop + centre(bars[best]) - line)) best = index;
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
        {[...firstYear(timeline[active].year)].map((digit, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <FlipDigit key={index} value={digit} />
        ))}
      </div>
      <ol ref={listRef} className="record-list">
        {timeline.map((entry, index) => {
          const [role, org] = entry.title.split(' | ');
          const isOpen = open === index;
          return (
            <li key={entry.title} ref={(node) => { barRefs.current[index] = node; }} className="record-item" style={{ '--i': index }} onMouseEnter={() => setActive(index)}>
              <button type="button" onFocus={() => setActive(index)} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : index)} className={`record-bar ${index === active ? 'is-active' : ''} ${isOpen ? 'is-open' : ''}`}>
                <span aria-hidden="true" className="record-rank">{ROMAN[index] ?? index + 1}</span>
                <span className="record-role">{role}</span>
                <span className="record-meta">{org ?? entry.type} · {entry.year}</span>
              </button>
              {isOpen && (
                <div className="record-detail slash-wipe">
                  {entry.desc && <p>{firstSentences(entry.desc)}</p>}
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

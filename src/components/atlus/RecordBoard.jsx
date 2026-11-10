import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLanguage } from '../../hooks/use-language';
import { useSectionEnter } from '../../hooks/use-section-enter';
import { ROMAN } from '../../lib/atlus';
import { useReducedMotion } from '../../hooks/use-reduced-motion';
import CareerDetail from './CareerDetail';

const HEADER_PX = 64;
// Camera turn in (DESIGN.md §15): scroll spent on the 90° yaw, as a share of the viewport height.
const YAW_SHARE = 0.55;
// Hand-over (v6): after the last role the camera rolls 90°, spread over this share of the pin's
// own scroll-out, so the next section rises in as the timeline turns upward. Reversible on scroll-up.
const ROLL_SHARE = 0.8;
// Speedlines move this much faster than the bars.
const LINE_SPEED = 1.6;
const RIDE_QUERY = '(min-width: 768px)';

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const ease = (t) => t * t * (3 - 2 * t);

// Desktop without reduced motion; phones keep the vertical list.
function useRideEnabled(requested) {
  const reducedMotion = useReducedMotion();
  const [wide, setWide] = useState(() => window.matchMedia(RIDE_QUERY).matches);
  useEffect(() => {
    const media = window.matchMedia(RIDE_QUERY);
    const onChange = () => setWide(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return requested && wide && !reducedMotion;
}

// Persona speedlines for the ride: tapered wedges, irregular spacing and thickness, ~-8°.
// One period of lines, drawn twice side by side so the strip wraps seamlessly.
const SPEEDLINES = Array.from({ length: 15 }, (_, i) => {
  const r = (n) => ((Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { top: 6 + r(1) * 88, left: r(2) * 70, width: 12 + r(3) * 34, thick: 1 + Math.round(r(4) * 5), alpha: 0.08 + r(5) * 0.17 };
});

export function SpeedLines() {
  const half = (key) => (
    <span key={key} className="ride-lines-half">
      {SPEEDLINES.map((line, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <span key={index} style={{ top: `${line.top}%`, left: `${line.left}%`, width: `${line.width}%`, height: `${line.thick}px`, opacity: line.alpha }} />
      ))}
    </span>
  );
  return <div aria-hidden="true" className="ride-lines"><div className="ride-lines-strip">{[half('a'), half('b')]}</div></div>;
}

// Periods such as "Dec 2024 – Aug 2025" flip to their first four-digit year.
const firstYear = (period) => period.match(/\d{4}/)?.[0] ?? period.slice(0, 4);


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

// ride: on the home page the section pins and vertical scroll drives a horizontal ride along the timeline.
// onRide({ yaw, out, roll, shift }) reports the camera state: yaw 1…0 (turn in), roll 0…1 (hand-over), shift in px.
export default function RecordBoard({ onEnter, ride: rideRequested = false, onRide, onActive }) {
  const ride = useRideEnabled(rideRequested);
  const onRideRef = useRef(onRide);
  onRideRef.current = onRide;
  const { t } = useLanguage();
  const timeline = t.career.timeline;
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(null);
  const barRefs = useRef([]);
  const listRef = useRef(null);
  const boardRef = useSectionEnter(onEnter);
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;
  useEffect(() => { onActiveRef.current?.(active); }, [active]);

  const scrollToEntry = (index) => {
    const section = boardRef.current.closest('section');
    const bars = barRefs.current.filter(Boolean);
    const offset = Number(section.dataset.landOffset) + bars[index].offsetLeft - bars[0].offsetLeft;
    window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - HEADER_PX + offset, behavior: 'instant' });
  };

  // The numeral follows the bar nearest a reading line placed where the first bar rests on landing.
  // Layout offsets, because the bars are still transformed during their entrance.
  useEffect(() => {
    if (ride) return undefined;
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
  }, [timeline.length, ride]);

  // The ride: section height = pinned screen + both yaws + the track length; scroll maps onto that.
  useLayoutEffect(() => {
    const board = boardRef.current;
    const section = board.closest('section');
    if (!ride || !section) return undefined;
    section.classList.add('record-ride');
    let frame = 0;
    let geometry = null;
    let lastActive = -1;
    const measure = () => {
      const bars = barRefs.current.filter(Boolean);
      const pin = section.querySelector('.record-pin');
      const yawLen = window.innerHeight * YAW_SHARE;
      const track = bars[bars.length - 1].offsetLeft - bars[0].offsetLeft;
      // No extra pinned scroll after the last role: the roll happens while the pin scrolls out.
      section.style.height = `${pin.offsetHeight + yawLen + track}px`;
      section.dataset.landOffset = String(Math.round(yawLen));
      geometry = { yawLen, track, step: bars.length > 1 ? track / (bars.length - 1) : 1, rollLen: pin.offsetHeight * ROLL_SHARE, period: section.querySelector('.ride-lines')?.offsetWidth || window.innerWidth };
    };
    const update = () => {
      frame = 0;
      if (!geometry) return;
      const { yawLen, track, step, rollLen, period } = geometry;
      const travelled = HEADER_PX - section.getBoundingClientRect().top;
      const inT = clamp01(travelled / yawLen);
      const outT = clamp01((travelled - yawLen - track) / rollLen);
      const shift = clamp01((travelled - yawLen) / Math.max(1, track)) * track;
      const yaw = 1 - ease(inT);
      const roll = ease(outT);
      section.style.setProperty('--yaw', `${(yaw * 90).toFixed(2)}deg`);
      section.style.setProperty('--roll', `${(roll * 90).toFixed(2)}deg`);
      section.style.setProperty('--shift', `${shift.toFixed(1)}px`);
      // Lines stream with the ride (and the roll), and rest when it rests.
      section.style.setProperty('--lines-x', `${(-((shift * LINE_SPEED + outT * period * 0.5) % period)).toFixed(1)}px`);
      const next = Math.round(shift / step);
      if (next !== lastActive) {
        lastActive = next;
        setActive(next);
      }
      onRideRef.current?.({ yaw, out: outT, roll, shift, inside: travelled > -window.innerHeight && outT < 1 });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      update();
    };
    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
      section.classList.remove('record-ride');
      section.style.height = '';
      section.style.removeProperty('--yaw');
      section.style.removeProperty('--shift');
      section.style.removeProperty('--roll');
      section.style.removeProperty('--lines-x');
      delete section.dataset.landOffset;
      onRideRef.current?.({ yaw: 0, out: 0, roll: 0, shift: 0, inside: false });
    };
  }, [ride, timeline.length]);

  return (
    <div ref={boardRef} className="record-board">
      <span aria-hidden="true" className="travel-lines" />
      <div aria-hidden="true" className="record-year">
        {[...firstYear(timeline[active].year)].map((digit, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <FlipDigit key={index} value={digit} />
        ))}
      </div>
      <div className="record-track">
      <ol ref={listRef} className="record-list">
        {timeline.map((entry, index) => {
          const [role, org] = entry.title.split(' | ');
          const isOpen = open === index;
          return (
            <li key={entry.title} ref={(node) => { barRefs.current[index] = node; }} className="record-item" style={{ '--i': index }} onMouseEnter={ride ? undefined : () => setActive(index)}>
              <button type="button" onFocus={(event) => {
                if (!ride) setActive(index);
                // Keyboard in the ride: scroll so the focused role sits on the reading line.
                else if (event.currentTarget.matches(':focus-visible')) scrollToEntry(index);
              }} aria-haspopup="dialog" onClick={() => setOpen(index)} className={`record-bar ${index === active ? 'is-active' : ''} ${isOpen ? 'is-open' : ''}`}>
                <span aria-hidden="true" className="record-rank">{ROMAN[index] ?? index + 1}</span>
                <span className="record-role">{role}</span>
                <span className="record-meta">{org ?? entry.type} · {entry.year}</span>
              </button>
            </li>
          );
        })}
      </ol>
      </div>
      {open !== null && <CareerDetail index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

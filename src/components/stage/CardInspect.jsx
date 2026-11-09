import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../hooks/use-language';
import { useReducedMotion } from '../../hooks/use-reduced-motion';

const ZOOM_MS = 600;
const FLIP_DELAY_MS = 430;
const FLIP_MS = 380;
const RETURN_MS = 300;
const OVERSHOOT = 'cubic-bezier(0.2, 1.3, 0.35, 1)';

// card: { numeral, title, image, imageLift, lines, details, tags, link: { href, label } }
export default function CardInspect({ card, sourceEl, onClosed }) {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const rootRef = useRef(null);
  const shellRef = useRef(null);
  const innerRef = useRef(null);
  const firstActionRef = useRef(null);
  const closingRef = useRef(false);

  const startTransform = () => {
    const from = sourceEl.getBoundingClientRect();
    const to = shellRef.current.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${from.width / to.width}, ${from.height / to.height})`;
  };

  useLayoutEffect(() => {
    // One painted frame in the closed state, so the dim and the colour can transition.
    const frame = requestAnimationFrame(() => setOpen(true));
    const focusAction = () => firstActionRef.current?.focus({ preventScroll: true });
    if (reducedMotion) {
      innerRef.current.style.transform = 'rotateY(180deg)';
      focusAction();
      return () => cancelAnimationFrame(frame);
    }
    shellRef.current.animate([{ transform: startTransform() }, { transform: 'none' }], { duration: ZOOM_MS, easing: OVERSHOOT });
    innerRef.current.animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(180deg)' }], { duration: FLIP_MS, delay: FLIP_DELAY_MS, easing: 'ease-in-out', fill: 'both' })
      .finished.then(focusAction).catch(() => {});
    return () => cancelAnimationFrame(frame);
  }, []);

  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setOpen(false);
    if (reducedMotion) {
      onClosed();
      return;
    }
    innerRef.current.getAnimations().forEach((animation) => animation.cancel());
    innerRef.current.animate([{ transform: 'rotateY(180deg)' }, { transform: 'rotateY(0deg)' }], { duration: RETURN_MS * 0.7, fill: 'both' });
    const flight = shellRef.current.animate([{ transform: 'none' }, { transform: startTransform() }], { duration: RETURN_MS, easing: 'cubic-bezier(0.5, 0, 0.8, 0.4)', fill: 'both' });
    flight.finished.then(onClosed).catch(onClosed);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopImmediatePropagation();
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...rootRef.current.querySelectorAll('.inspect-back a[href], .inspect-back button')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    // Only the copy may scroll, so the card can never drift from the slot it returns to.
    const onWheel = (event) => {
      if (!event.target.closest('.inspect-copy')) event.preventDefault();
    };
    const root = rootRef.current;
    window.addEventListener('keydown', onKeyDown, true);
    root.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      root.removeEventListener('wheel', onWheel);
    };
  }, []);

  const photo = (
    <span className="deck-image" style={card.imageLift ? { '--image-lift': card.imageLift } : undefined}>
      <img src={card.image} alt="" draggable="false" />
    </span>
  );

  return createPortal(
    <div ref={rootRef} role="dialog" aria-modal="true" aria-label={card.title} className={`inspect ${open ? 'is-open' : ''}`}>
      <div aria-hidden="true" className="inspect-dim" onClick={close} />
      <div ref={shellRef} className="inspect-card">
        <div ref={innerRef} className="inspect-inner">
          <div aria-hidden="true" className="inspect-face">
            <span className="deck-roman">{card.numeral}</span>
            {photo}
            <span className="deck-title inspect-front-title">{card.title}</span>
          </div>
          <div className="inspect-face inspect-back">
            <span aria-hidden="true" className="deck-roman">{card.numeral}</span>
            <div className="inspect-photo">{photo}</div>
            <h3 className="font-anton uppercase text-3xl tracking-wide mt-2">{card.title}</h3>
            <div className="inspect-copy" tabIndex={-1}>
              {showDetails ? (
                <ul className="inspect-details">
                  {card.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
              ) : (
                <>
                  <p>{card.lines}</p>
                  <ul className="inspect-tags">
                    {card.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </>
              )}
            </div>
            <div className="inspect-actions">
              {card.link && (
                <a ref={firstActionRef} href={card.link.href} target="_blank" rel="noreferrer" className="inspect-btn is-primary">{card.link.label} ↗</a>
              )}
              <button ref={card.link ? undefined : firstActionRef} type="button" aria-expanded={showDetails} onClick={() => setShowDetails((value) => !value)} className="inspect-btn">{t.atlus.inspect.details}</button>
            </div>
            <button type="button" onClick={close} className="inspect-back-link">← {t.atlus.inspect.back}</button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../hooks/use-language';

// Full-screen detail overlay for Career entries and Stack skills (DESIGN.md §16): slash
// transition, ←/→ for previous / next, ESC back. Esc and the arrows stop here, so a screen
// underneath does not also go back.
export default function DetailScreen({ label, index, count, onIndex, onClose, children }) {
  const { t } = useLanguage();
  const rootRef = useRef(null);
  const closeRef = useRef(null);
  const step = (delta) => onIndex((index + delta + count) % count);

  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus({ preventScroll: true });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        onClose();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        event.stopImmediatePropagation();
        step(event.key === 'ArrowRight' ? 1 : -1);
      } else if (event.key === 'Tab') {
        const focusable = rootRef.current.querySelectorAll('a[href], button');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  });

  return createPortal(
    <div ref={rootRef} role="dialog" aria-modal="true" aria-label={label} className="dts">
      <div aria-hidden="true" className="dts-dim" onClick={onClose} />
      <div key={index} className="dts-panel slash-wipe">
        {children}
        <div className="dts-nav">
          <button type="button" onClick={() => step(-1)} className="inspect-btn">← {t.atlus.detail.prev}</button>
          <button ref={closeRef} type="button" onClick={onClose} className="inspect-btn is-primary">{t.atlus.detail.close} · ESC</button>
          <button type="button" onClick={() => step(1)} className="inspect-btn">{t.atlus.detail.next} →</button>
        </div>
        <p aria-hidden="true" className="dts-keys">{t.atlus.detail.keys} · {index + 1} / {count}</p>
      </div>
    </div>,
    document.body,
  );
}

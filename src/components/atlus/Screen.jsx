import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/use-document-title';
import { useLanguage } from '../../hooks/use-language';
import { setActiveMenuId } from '../../lib/atlus';
import PropViewer from './PropViewer';

// Shared sub-screen behaviour: title, focus, menu memory, Esc and back.
export function useScreen(id, title) {
  useDocumentTitle(`${title} — Richard Zuikov`);
  const navigate = useNavigate();
  const { state } = useLocation();
  const headingRef = useRef(null);
  // Opened from the menu or a home OPEN SCREEN slab: back is a history step (scroll position kept).
  const fromMenu = Boolean(state?.fromMenu || state?.fromHome);

  useEffect(() => {
    setActiveMenuId(id);
    headingRef.current?.focus({ preventScroll: true });
  }, [id]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      if (fromMenu) navigate(-1);
      else navigate('/');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [fromMenu, navigate]);

  const handleBack = (event) => {
    if (!fromMenu) return;
    event.preventDefault();
    navigate(-1);
  };

  return { headingRef, handleBack };
}

// Persona sub-screen (DESIGN.md §16): big title slab, one 3D prop beside it, then the page's
// sub-menu and detail panel. Idle motion: drifting screentone, the prop's sway.
export default function Screen({ id, number, title, hud, prop, children }) {
  const { t } = useLanguage();
  const { headingRef, handleBack } = useScreen(id, title);

  return (
    <div className="scr">
      <div aria-hidden="true" className="scr-tone" />
      <div className="scr-inner">
        <Link to="/" onClick={handleBack} className="scr-back">{t.atlus.back} · ESC</Link>
        <header className="scr-head">
          <div>
            <p className="font-mono text-xs tracking-widest text-ash-300">{number} / {hud}</p>
            <h1 ref={headingRef} tabIndex={-1} className="scr-title"><span>{title}</span></h1>
          </div>
          {prop && <PropViewer name={prop} className="scr-prop" />}
        </header>
        {children}
      </div>
    </div>
  );
}

// Sub-menu of a screen: one slab per category or entry; ↑ / ↓ move and select.
export function SubMenu({ label, items, active, onSelect }) {
  const refs = useRef([]);
  const onKeyDown = (event, index) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const next = (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    onSelect(next);
    refs.current[next]?.focus();
  };
  return (
    <nav aria-label={label} className="scr-tabs">
      <ul>
        {items.map((item, index) => (
          <li key={item.id} style={{ '--i': index }}>
            <button
              ref={(node) => { refs.current[index] = node; }}
              type="button"
              aria-pressed={index === active}
              onClick={() => onSelect(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`scr-tab ${index === active ? 'is-active' : ''}`}
            >
              <span aria-hidden="true" className="scr-tab-number">{item.number ?? String(index + 1).padStart(2, '0')}</span>
              <span className="scr-tab-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

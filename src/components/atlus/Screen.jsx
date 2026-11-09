import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/use-document-title';
import { useLanguage } from '../../hooks/use-language';
import { setActiveMenuId } from '../../lib/atlus';

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

export default function Screen({ id, number, title, hud, children }) {
  const { t } = useLanguage();
  const { headingRef, handleBack } = useScreen(id, title);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-x-clip bg-ash-900 text-ash-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-12 py-8 md:py-12">
        <Link to="/" onClick={handleBack} className="inline-flex items-center min-h-11 font-mono text-xs tracking-widest text-ash-300 hover:text-accent transition-colors duration-150">
          {t.atlus.back}
        </Link>
        <p className="mt-6 font-mono text-xs tracking-widest text-accent">{number} / {hud}</p>
        <h1 ref={headingRef} tabIndex={-1} className="heading-skew outline-none font-anton uppercase text-6xl sm:text-8xl tracking-wide leading-tight mt-5 mb-10">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}

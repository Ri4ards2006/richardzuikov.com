import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/use-document-title';
import { useLanguage } from '../hooks/use-language';
import { QUICK_PATH } from '../lib/sections';
import { getActiveMenuId, menuItems, setActiveMenuId } from '../lib/atlus';
import { portraits } from '../data/portraits';
import CausticsBackground from '../components/atlus/CausticsBackground';

// Functional stand-in for the designed menu: keyboard selection and selection memory.
export default function MenuPlaceholder() {
  useDocumentTitle('Richard Zuikov — Embedded Systems & Hardware Developer');
  const { t } = useLanguage();
  const [active, setActive] = useState(getActiveMenuId);
  const linksRef = useRef({});

  useEffect(() => {
    linksRef.current[getActiveMenuId()]?.focus({ preventScroll: true });
  }, []);

  const select = (id) => {
    setActive(id);
    setActiveMenuId(id);
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const index = menuItems.findIndex((item) => item.id === active);
    const step = event.key === 'ArrowDown' ? 1 : -1;
    const next = menuItems[(index + step + menuItems.length) % menuItems.length];
    select(next.id);
    linksRef.current[next.id]?.focus();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-x-clip flex items-center">
      <CausticsBackground />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-12 py-10 flex items-center justify-between gap-8">
        <div>
          <h1 className="font-anton uppercase text-5xl sm:text-7xl tracking-wide text-ash-100">Richard Zuikov</h1>
          <nav aria-label={t.atlus.menuNav} className="mt-8">
            <ul onKeyDown={handleKeyDown} className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    ref={(node) => { linksRef.current[item.id] = node; }}
                    to={item.path}
                    state={{ fromMenu: true }}
                    aria-current={active === item.id ? 'true' : undefined}
                    onMouseEnter={() => select(item.id)}
                    onFocus={() => select(item.id)}
                    className={`inline-flex items-baseline gap-4 font-anton uppercase text-4xl sm:text-5xl tracking-wide transition-colors duration-150 ${active === item.id ? 'text-accent' : 'text-ash-300'}`}
                  >
                    <span aria-hidden="true" className="font-mono text-xs tracking-widest">{item.number}</span>
                    {t.landing.nav[item.id]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link to={QUICK_PATH} className="mt-8 inline-flex items-center min-h-11 font-mono text-xs uppercase tracking-widest text-accent underline underline-offset-4">
            {t.landing.menuPlaceholder.quickRead}
          </Link>
        </div>
        <img src={portraits[active].small} alt="" className="hidden md:block h-[60vh] w-auto" />
      </div>
    </div>
  );
}

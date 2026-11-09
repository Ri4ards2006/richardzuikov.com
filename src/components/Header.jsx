import React, { Suspense, lazy, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/use-language';
import { useTheme } from '../hooks/use-theme';
import { useScrollSpy } from '../hooks/use-scroll-spy';
import { QUICK_PATH, sections } from '../lib/sections';
import { isAtlusPath, isForcedDark } from '../lib/atlus';

// The overlay is only fetched once the menu is first opened.
const MenuOverlay = lazy(() => import('./MenuOverlay'));

const sectionIds = [...sections.map((section) => section.id)];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const menuButtonRef = useRef(null);
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const [theme] = useTheme();
  const active = useScrollSpy(sectionIds, pathname === QUICK_PATH);
  const atlus = isAtlusPath(pathname);

  const openMenu = () => {
    setMenuLoaded(true);
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <div className={isForcedDark(pathname, theme) ? 'dark contents' : 'contents'}>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#09090b]/95 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto h-16 px-6 sm:px-12 flex items-center justify-between gap-6">
          <Link to="/" aria-label="RZ · Richard Zuikov" className="font-mono text-sm font-bold tracking-widest text-zinc-950 dark:text-white">
            RZ
          </Link>

          {!atlus && (
            <nav aria-label={t.landing.sectionNav} className="hidden md:block">
              <ul className="flex items-center gap-6">
                {sections.map(({ id }) => (
                  <li key={id}>
                    <Link
                      to={`${QUICK_PATH}#${id}`}
                      aria-current={active === id ? 'true' : undefined}
                      className={`inline-block py-2 font-mono text-xs uppercase tracking-wider border-b-2 transition-colors duration-150 ${
                        active === id
                          ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
                          : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      {t.landing.nav[id]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <span aria-hidden="true" className="w-11" />
        </div>
      </header>

      <button ref={menuButtonRef} type="button" onClick={openMenu} aria-label={t.nav.openMenu} aria-expanded={isMenuOpen} className="menu-dots">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      {menuLoaded && (
        <Suspense fallback={null}>
          <MenuOverlay open={isMenuOpen} onClose={closeMenu} />
        </Suspense>
      )}
    </div>
  );
}

import React, { Suspense, lazy, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../hooks/use-language';
import { useTheme } from '../hooks/use-theme';
import { useScrollSpy } from '../hooks/use-scroll-spy';
import { QUICK_PATH, sections } from '../lib/sections';
import { CONTACT_PATH, isAtlusPath, isForcedDark } from '../lib/atlus';

// Keeps framer-motion out of the initial bundle until the menu is first opened.
const MenuOverlay = lazy(() => import('./MenuOverlay'));

const sectionIds = [...sections.map((section) => section.id)];
const iconButton = 'w-11 h-11 flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-500 transition-colors duration-200';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const menuButtonRef = useRef(null);
  const { pathname } = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const [theme, toggleTheme] = useTheme();
  const active = useScrollSpy(sectionIds, pathname === QUICK_PATH);
  const atlus = isAtlusPath(pathname);
  const isContact = pathname === CONTACT_PATH;

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

          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleLanguage} title={t.nav.switchLang} aria-label={`${language === 'de' ? 'EN' : 'DE'} · ${t.nav.switchLang}`} className={`${iconButton} ${atlus ? 'flex' : 'hidden md:flex'} font-mono text-xs font-bold`}>
              {language === 'de' ? 'EN' : 'DE'}
            </button>
            {(!atlus || isContact) && (
              <>
                <button type="button" onClick={toggleTheme} title={t.nav.switchTheme} aria-label={t.nav.switchTheme} className={`${iconButton} ${isContact ? 'flex' : 'hidden md:flex'}`}>
                  {theme === 'dark' ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
                </button>
                <button ref={menuButtonRef} type="button" onClick={openMenu} aria-label={t.nav.openMenu} aria-expanded={isMenuOpen} className={`${iconButton} ${isContact ? 'hidden' : 'md:hidden'}`}>
                  <Menu aria-hidden="true" size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        {menuLoaded && (
          <Suspense fallback={null}>
            <MenuOverlay open={isMenuOpen} onClose={closeMenu} />
          </Suspense>
        )}
      </header>
    </div>
  );
}

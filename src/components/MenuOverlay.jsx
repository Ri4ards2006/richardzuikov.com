import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useTheme } from '../hooks/use-theme';
import { useLanguage } from '../hooks/use-language';
import { useContactEmail } from '../hooks/use-contact-email';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { getActiveMenuId, landOnSection, menuItems, scrollTargets } from '../lib/atlus';
import { QUICK_PATH } from '../lib/sections';
import { socialLinks } from './home/SocialLinks';
import { portraits } from '../data/portraits';

const LETTERS = ['M', 'E', 'N', 'U'];

function Panel({ closing, onClose, onExited }) {
  const [theme, toggleTheme] = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { email } = useContactEmail();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const panelRef = useRef(null);
  const slabRefs = useRef([]);
  // Opens on the item last chosen, like the stage menu.
  const [active, setActive] = useState(() => Math.max(0, menuItems.findIndex((item) => item.id === getActiveMenuId())));

  // Set when an entry leaves for another place, so closing doesn't restore the old scroll position.
  const leaving = useRef(false);

  useEffect(() => {
    // The active slab takes focus so the arrow keys work at once, like the stage menu.
    slabRefs.current[active]?.focus();
    // Real pause (DESIGN.md §18): the page can't scroll, can't be focused and is hidden from assistive tech.
    // The site scrolls natively (no Lenis), so the lock is overflow on <html> plus the remembered position.
    const scrollY = window.scrollY;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const paused = [...document.querySelectorAll('main, footer')].filter((node) => !panelRef.current?.contains(node));
    paused.forEach((node) => { node.inert = true; node.setAttribute('aria-hidden', 'true'); });
    // Wheel and touch never reach the page's own listeners; inside the overlay they may scroll it (mobile).
    const block = (event) => {
      event.stopPropagation();
      if (!panelRef.current?.contains(event.target)) event.preventDefault();
    };
    window.addEventListener('wheel', block, { capture: true, passive: false });
    window.addEventListener('touchmove', block, { capture: true, passive: false });
    // Only the overlay may show: the stage menu, name and portrait hide at once (no second menu
    // peeking through the wipe) and come back when the overlay has fully closed.
    root.classList.add('gm-open');
    // The stage slabs stay in the DOM but are hidden and unreachable (no second menu, no focus bleed).
    const stageMenus = [...document.querySelectorAll('.stage-menu')];
    stageMenus.forEach((node) => { node.inert = true; });
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        // Deep pages also use Escape to go back; while the menu is open it only closes the menu.
        event.stopImmediatePropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = panelRef.current.querySelectorAll('a[href], button');
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
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      root.style.overflow = previousOverflow;
      root.classList.remove('gm-open');
      paused.forEach((node) => { node.inert = false; node.removeAttribute('aria-hidden'); });
      stageMenus.forEach((node) => { node.inert = false; });
      window.removeEventListener('wheel', block, true);
      window.removeEventListener('touchmove', block, true);
      window.removeEventListener('keydown', onKeyDown, true);
      // Back exactly where the page was paused, unless an entry sent the visitor somewhere else.
      if (!leaving.current) window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  useEffect(() => {
    if (closing && reducedMotion) onExited();
  }, [closing, reducedMotion, onExited]);

  const handleSection = (event, item) => {
    const target = scrollTargets[item.id];
    // On the home page the camera flies there; anywhere else the link's own navigation applies.
    leaving.current = true;
    if (target && pathname === '/') {
      event.preventDefault();
      landOnSection(target);
    }
    onClose();
  };

  const handleSlabKey = (event, index) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const step = event.key === 'ArrowDown' ? 1 : -1;
    slabRefs.current[(index + step + menuItems.length) % menuItems.length]?.focus();
  };

  const goLegal = (path) => {
    leaving.current = true;
    onClose();
    navigate(path);
  };

  const activeItem = menuItems[active] ?? menuItems[0];

  return (
    <>
    <div aria-hidden="true" className={`gm-dim ${closing ? 'is-closing' : ''}`} />
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.menu}
      className={`gm ${closing ? 'is-closing' : ''}`}
      onAnimationEnd={(event) => { if (closing && event.animationName === 'gm-out') onExited(); }}
    >
      <div aria-hidden="true" className="gm-shards">
        <span /><span /><span />
      </div>
      <button type="button" onClick={onClose} aria-label={t.nav.closeMenu} className="gm-close">
        <X aria-hidden="true" size={20} />
      </button>

      {/* 12-column pause screen: cols 1-2 MENU, 3-6 the list, 7-12 the preview; footer row below. */}
      <div className="gm-grid">
        <div className="gm-menu">
          <div aria-hidden="true" className="gm-letters">
            {LETTERS.map((letter) => <span key={letter}>{letter}</span>)}
          </div>
          <nav aria-label={t.atlus.menuNav} className="gm-main">
            <ul className="gm-list">
              {menuItems.map((item, index) => {
                const target = scrollTargets[item.id];
                return (
                  <li key={item.id} style={{ '--i': index }} className={index === active ? 'is-active' : undefined}>
                    <span aria-hidden="true" className="gm-number">{item.number} /</span>
                    <Link
                      ref={(node) => { slabRefs.current[index] = node; }}
                      to={target ? `/#${target}` : item.path}
                      onClick={(event) => handleSection(event, item)}
                      onKeyDown={(event) => handleSlabKey(event, index)}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      className="gm-slab"
                    >
                      {t.landing.nav[item.id]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Preview of the selected section, with name and portrait as on the stage. */}
        <div aria-hidden="true" className="gm-preview">
          <p className="gm-name">Richard Zuikov <span>{t.career.role}</span></p>
          <img src={portraits.stage.large} alt="" className="gm-portrait" />
          <div key={activeItem.id} className="gm-echo">
            <p className="gm-kicker">{activeItem.number} / {t.atlus.hud[activeItem.id] ?? ''}</p>
            <p className="gm-label">{t.landing.nav[activeItem.id]}</p>
            <p className="gm-teaser">{t.atlus.menuPreview[activeItem.id]}</p>
          </div>
        </div>

        <div className="gm-foot">
          <div className="gm-zone is-settings">
            <button type="button" onClick={toggleLanguage} aria-label={t.nav.switchLang} className="gm-chip gm-lang">
              <span>{language === 'de' ? <b>DE</b> : 'DE'} / {language === 'en' ? <b>EN</b> : 'EN'}</span>
            </button>
            <button type="button" onClick={toggleTheme} aria-label={t.nav.switchTheme} className="gm-chip">
              <span aria-hidden="true">{theme === 'dark' ? '☾' : '☼'}</span> {t.nav.theme}
            </button>
          </div>
          <p className="gm-zone gm-legal">
            <button type="button" onClick={() => goLegal('/impressum')}>{t.nav.impressum}</button>
            <span aria-hidden="true"> · </span>
            <button type="button" onClick={() => goLegal('/datenschutz')}>{t.nav.datenschutz}</button>
          </p>
          <div className="gm-zone is-links">
            {socialLinks.map(({ label, href }) => <a key={label} href={href} target="_blank" rel="noreferrer" className="gm-chip">{label} ↗</a>)}
            <a href={email ? `mailto:${email}` : undefined} className="gm-chip">Mail ↗</a>
            <Link to={QUICK_PATH} onClick={() => { leaving.current = true; onClose(); }} className="gm-chip gm-quick">{t.landing.menuPlaceholder.quickRead} →</Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default function MenuOverlay({ open, onClose }) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  if (!mounted && !open) return null;
  return <Panel closing={!open} onClose={onClose} onExited={() => setMounted(false)} />;
}

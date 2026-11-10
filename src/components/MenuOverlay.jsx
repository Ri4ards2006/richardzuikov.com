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

  useEffect(() => {
    // The active slab takes focus so the arrow keys work at once, like the stage menu.
    slabRefs.current[active]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Only the overlay may show: the stage menu, name and portrait hide at once (no second menu
    // peeking through the wipe) and come back when the overlay has fully closed.
    document.documentElement.classList.add('gm-open');
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
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove('gm-open');
      window.removeEventListener('keydown', onKeyDown, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  useEffect(() => {
    if (closing && reducedMotion) onExited();
  }, [closing, reducedMotion, onExited]);

  const handleSection = (event, item) => {
    const target = scrollTargets[item.id];
    // On the home page the camera flies there; anywhere else the link's own navigation applies.
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
      <div aria-hidden="true" className="gm-letters">
        {LETTERS.map((letter) => <span key={letter}>{letter}</span>)}
      </div>
      <p aria-hidden="true" key={activeItem.id} className="gm-echo">{activeItem.number} {t.landing.nav[activeItem.id]}</p>

      <button type="button" onClick={onClose} aria-label={t.nav.closeMenu} className="gm-close">
        <X aria-hidden="true" size={20} />
      </button>

      <div className="gm-main">
        <nav aria-label={t.atlus.menuNav}>
          <ul className="gm-list">
            {menuItems.map((item, index) => {
              const target = scrollTargets[item.id];
              return (
                <li key={item.id} style={{ '--i': index, '--o': index % 2 }} className={index === active ? 'is-active' : undefined}>
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
        <Link to={QUICK_PATH} onClick={onClose} className="gm-chip gm-quick">{t.landing.menuPlaceholder.quickRead} →</Link>
      </div>

      <div className="gm-corner is-left">
        <button type="button" onClick={toggleLanguage} aria-label={t.nav.switchLang} className="gm-chip gm-lang">
          <span>{language === 'de' ? <b>DE</b> : 'DE'} / {language === 'en' ? <b>EN</b> : 'EN'}</span>
        </button>
        <button type="button" onClick={toggleTheme} aria-label={t.nav.switchTheme} className="gm-chip">
          <span aria-hidden="true">{theme === 'dark' ? '☾' : '☼'}</span> {t.nav.theme}
        </button>
      </div>

      <div className="gm-corner is-right">
        {socialLinks.map(({ label, href }) => <a key={label} href={href} target="_blank" rel="noreferrer" className="gm-chip">{label} ↗</a>)}
        <a href={email ? `mailto:${email}` : undefined} className="gm-chip">Mail ↗</a>
      </div>

      <p className="gm-legal">
        <button type="button" onClick={() => goLegal('/impressum')}>{t.nav.impressum}</button>
        <span aria-hidden="true"> · </span>
        <button type="button" onClick={() => goLegal('/datenschutz')}>{t.nav.datenschutz}</button>
      </p>
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

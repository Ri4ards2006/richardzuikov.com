import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useTheme } from '../hooks/use-theme';
import { useLanguage } from '../hooks/use-language';
import { useContactEmail } from '../hooks/use-contact-email';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { landOnSection, menuItems, scrollTargets } from '../lib/atlus';
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

  useEffect(() => {
    // The first slab takes focus so the arrow keys work at once, like the stage menu.
    slabRefs.current[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
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
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
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

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.menu}
      className={`gm ${closing ? 'is-closing' : ''}`}
      onAnimationEnd={() => { if (closing) onExited(); }}
    >
      <button type="button" onClick={onClose} aria-label={t.nav.closeMenu} className="gm-close">
        <X aria-hidden="true" size={20} />
      </button>

      <div aria-hidden="true" className="gm-letters">
        {LETTERS.map((letter) => <span key={letter}>{letter}</span>)}
      </div>

      <nav aria-label={t.atlus.menuNav}>
        <ul className="gm-list">
          {menuItems.map((item, index) => {
            const target = scrollTargets[item.id];
            return (
              <li key={item.id} style={{ '--i': index }}>
                <span aria-hidden="true" className="gm-number">{item.number} /</span>
                <Link
                  ref={(node) => { slabRefs.current[index] = node; }}
                  to={target ? `/#${target}` : item.path}
                  onClick={(event) => handleSection(event, item)}
                  onKeyDown={(event) => handleSlabKey(event, index)}
                  className="gm-slab"
                >
                  {t.landing.nav[item.id]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="gm-side">
        <div className="gm-group">
          <Link to={QUICK_PATH} onClick={onClose}>{t.landing.menuPlaceholder.quickRead} →</Link>
          <button type="button" onClick={toggleLanguage} aria-label={t.nav.switchLang} className="gm-lang">
            <span>{language === 'de' ? <b>DE</b> : 'DE'} / {language === 'en' ? <b>EN</b> : 'EN'}</span>
          </button>
          <button type="button" onClick={toggleTheme}>{t.nav.switchTheme} · {theme === 'dark' ? '☾' : '☼'}</button>
        </div>
        <div className="gm-group">
          {socialLinks.map(({ label, href }) => <a key={label} href={href} target="_blank" rel="noreferrer">{label} ↗</a>)}
          <a href={email ? `mailto:${email}` : undefined}>Mail ↗</a>
          <button type="button" onClick={() => goLegal('/impressum')}>{t.nav.impressum}</button>
          <button type="button" onClick={() => goLegal('/datenschutz')}>{t.nav.datenschutz}</button>
        </div>
      </div>
    </div>
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

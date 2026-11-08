import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../hooks/use-theme';
import { useLanguage } from '../hooks/use-language';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { sections } from '../lib/sections';

const CLOSED = 'polygon(0% 0%, 0% 0%, -20% 100%, -20% 100%)';
const OPEN = 'polygon(0% 0%, 120% 0%, 100% 100%, -20% 100%)';
const roundButton = 'w-11 h-11 flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors duration-200';

function Panel({ onClose }) {
  const [theme, toggleTheme] = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
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

  const linkClass = 'block py-1 text-3xl font-light tracking-wide text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors duration-150';

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.menu}
      initial={{ clipPath: CLOSED }}
      animate={{ clipPath: OPEN }}
      exit={{ clipPath: CLOSED }}
      transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white dark:bg-[#09090b]"
    >
      <div className="flex justify-end gap-2 p-6">
        <button type="button" onClick={toggleLanguage} title={t.nav.switchLang} aria-label={`${language === 'de' ? 'EN' : 'DE'} · ${t.nav.switchLang}`} className={`${roundButton} font-mono text-xs font-bold`}>
          {language === 'de' ? 'EN' : 'DE'}
        </button>
        <button type="button" onClick={toggleTheme} title={t.nav.switchTheme} aria-label={t.nav.switchTheme} className={roundButton}>
          {theme === 'dark' ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
        </button>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t.nav.closeMenu} className={roundButton}>
          <X aria-hidden="true" size={20} />
        </button>
      </div>

      <nav aria-label={t.landing.sectionNav} className="flex-1 flex items-center px-8">
        <ul className="space-y-3">
          {sections.map(({ id, number }) => (
            <li key={id} className="flex items-baseline gap-4">
              <span aria-hidden="true" className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{number}</span>
              <Link to={`/#${id}`} onClick={onClose} className={linkClass}>{t.landing.nav[id]}</Link>
            </li>
          ))}
          <li className="flex items-baseline gap-4">
            <span aria-hidden="true" className="font-mono text-xs text-zinc-600 dark:text-zinc-400">→</span>
            <Link to="/lab" onClick={onClose} className={linkClass}>{t.nav.lab}</Link>
          </li>
        </ul>
      </nav>
    </motion.div>
  );
}

export default function MenuOverlay({ open, onClose }) {
  return <AnimatePresence>{open && <Panel onClose={onClose} />}</AnimatePresence>;
}

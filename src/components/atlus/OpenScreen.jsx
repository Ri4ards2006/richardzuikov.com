import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/use-language';

export const RETURN_KEY = 'atlus-return';

// "OPEN SCREEN →" slab on a home section (DESIGN.md §16). Remembers the scroll position so
// ESC / BACK on the screen returns to the same place on "/".
export default function OpenScreen({ to }) {
  const { t } = useLanguage();
  const remember = () => {
    try {
      sessionStorage.setItem(RETURN_KEY, String(Math.round(window.scrollY)));
    } catch {
      // Without storage the return lands at the top of the page.
    }
  };
  return (
    <Link to={to} state={{ fromHome: true }} onClick={remember} className="open-screen">
      <span>{t.atlus.openScreen} →</span>
    </Link>
  );
}

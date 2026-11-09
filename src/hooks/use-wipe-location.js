import { useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CONTACT_PATH, isAtlusPath } from '../lib/atlus';
import { prefersReducedMotion } from './use-reduced-motion';

const MIDPOINT_MS = { wipe: 175, fog: 300 };

function pickTransition(from, to) {
  if (from === to || prefersReducedMotion()) return null;
  if (from === CONTACT_PATH || to === CONTACT_PATH) return null;
  return isAtlusPath(from) && isAtlusPath(to) ? 'wipe' : null;
}

// Delays the rendered route until the transition covers the screen. Driven by the
// location itself, so links, Esc and browser back all share one transition.
export function useWipeLocation() {
  const location = useLocation();
  const [displayed, setDisplayed] = useState(location);
  const [transition, setTransition] = useState(null);

  useLayoutEffect(() => {
    if (location.key === displayed.key) return undefined;
    const type = pickTransition(displayed.pathname, location.pathname);
    if (!type) {
      setDisplayed(location);
      return undefined;
    }
    setTransition({ type, key: location.key });
    const timer = setTimeout(() => setDisplayed(location), MIDPOINT_MS[type]);
    return () => clearTimeout(timer);
  }, [location, displayed.key, displayed.pathname]);

  return { displayed, transition, clearTransition: () => setTransition(null) };
}

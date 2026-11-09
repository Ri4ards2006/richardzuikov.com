import { useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isAtlusPath } from '../lib/atlus';
import { prefersReducedMotion } from './use-reduced-motion';

const WIPE_MIDPOINT_MS = 175;

// Delays the rendered route until the wipe panel covers the screen. Driven by the
// location itself, so links, Esc and browser back all share one transition.
export function useWipeLocation() {
  const location = useLocation();
  const [displayed, setDisplayed] = useState(location);
  const [wipeKey, setWipeKey] = useState(0);

  useLayoutEffect(() => {
    if (location.key === displayed.key) return undefined;
    const wipes = location.pathname !== displayed.pathname
      && isAtlusPath(location.pathname)
      && isAtlusPath(displayed.pathname)
      && !prefersReducedMotion();
    if (!wipes) {
      setDisplayed(location);
      return undefined;
    }
    setWipeKey((key) => key + 1);
    const timer = setTimeout(() => setDisplayed(location), WIPE_MIDPOINT_MS);
    return () => clearTimeout(timer);
  }, [location, displayed.key, displayed.pathname]);

  return { displayed, wipeKey, clearWipe: () => setWipeKey(0) };
}

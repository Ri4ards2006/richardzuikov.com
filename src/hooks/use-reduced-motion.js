import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

export const prefersReducedMotion = () => window.matchMedia(QUERY).matches;

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, prefersReducedMotion);
}

import { useLayoutEffect, useRef } from 'react';
import { prefersReducedMotion } from './use-reduced-motion';

// IntersectionObserver delivers an initial callback right after observe().
const OBSERVER_FAILSAFE_MS = 1000;

// Content is visible by default: it is only hidden once the observer exists and
// the element is off-screen, and the failsafe shows it if the observer stays silent.
export function useReveal() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) return undefined;

    const { top, bottom } = el.getBoundingClientRect();
    if (top < window.innerHeight && bottom > 0) return undefined;

    let observer;
    let timer;
    const show = () => {
      clearTimeout(timer);
      observer?.disconnect();
      el.classList.add('reveal-in');
      el.classList.remove('reveal-hidden');
    };

    try {
      let alive = false;
      observer = new IntersectionObserver((entries) => {
        alive = true;
        if (entries.some((entry) => entry.isIntersecting)) show();
      }, { rootMargin: '0px 0px -10% 0px' });
      el.classList.add('reveal-hidden');
      observer.observe(el);
      timer = setTimeout(() => { if (!alive) show(); }, OBSERVER_FAILSAFE_MS);
    } catch {
      show();
    }

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, []);

  return ref;
}

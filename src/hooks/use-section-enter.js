import { useLayoutEffect, useRef } from 'react';

// Arms an element's entrance once and plays it when the element reaches the viewport.
// Adds is-armed / is-in for the entrance and toggles is-live so idle animations pause off screen.
export function useSectionEnter(onEnter) {
  const ref = useRef(null);
  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;

  useLayoutEffect(() => {
    const element = ref.current;
    if (!('IntersectionObserver' in window)) return undefined;
    element.classList.add('is-armed');
    const enter = new IntersectionObserver(([entry]) => {
      // Already above the viewport (deep link, fast scroll): it must not stay hidden.
      if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
      element.classList.add('is-in');
      enter.disconnect();
      if (entry.isIntersecting) onEnterRef.current?.();
    }, { threshold: 0.08 });
    enter.observe(element);
    const live = new IntersectionObserver(([entry]) => element.classList.toggle('is-live', entry.isIntersecting));
    live.observe(element);
    return () => {
      enter.disconnect();
      live.disconnect();
    };
  }, []);

  return ref;
}

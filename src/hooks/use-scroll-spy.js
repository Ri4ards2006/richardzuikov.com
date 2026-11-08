import { useEffect, useState } from 'react';

// Marks the section crossing the middle of the viewport as active.
export function useScrollSpy(ids, enabled) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    setActive(null);
    if (!enabled || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver((entries) => {
      const hit = entries.find((entry) => entry.isIntersecting);
      if (hit) setActive(hit.target.id);
    }, { rootMargin: '-45% 0px -50% 0px' });

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids, enabled]);

  return active;
}

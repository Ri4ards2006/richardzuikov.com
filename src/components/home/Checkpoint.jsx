import React, { useEffect, useRef, useState } from 'react';

const readSeen = (storageKey) => {
  try {
    return sessionStorage.getItem(storageKey) === 'true';
  } catch {
    return true; // Storage blocked: "once per session" cannot be kept, so stay quiet.
  }
};

const DEFAULT_TEXT_CLASS = 'px-6 py-2 bg-[#09090b]/80 font-mono text-sm sm:text-lg tracking-[0.4em] text-zinc-900 dark:text-zinc-100';

export default function Checkpoint({ text, storageKey = 'seen-checkpoint', textClassName = DEFAULT_TEXT_CLASS }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readSeen(storageKey)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      sessionStorage.setItem(storageKey, 'true');
      setVisible(true);
    }, { threshold: 0.25 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [storageKey]);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
      {visible && (
        <span onAnimationEnd={() => setVisible(false)} className={`checkpoint-line ${textClassName}`}>
          {text}
        </span>
      )}
    </div>
  );
}

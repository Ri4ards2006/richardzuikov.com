import React, { useEffect, useRef, useState } from 'react';

// Real-photo portrait (DESIGN.md §2 + §18 "Portraits"): the black-and-white cut-out at rest, the
// colour cut-out cross-faded on top on hover / focus (300 ms ease-out, CSS), instantly under reduced
// motion. Touch (no hover): colour on tap or while the portrait sits in the middle band of the
// viewport. `colour` forces it from outside (e.g. the stage → about turn).
const srcSet = (set, layer, format) => set.sizes.map(({ w, h }) => `${set[layer][h][format]} ${w}w`).join(', ');

const TOUCH = '(hover: none)';

export default function CutoutPortrait({ set, alt = '', sizes, colour = false, focusable = false, className = '', ...rest }) {
  const ref = useRef(null);
  const [tapped, setTapped] = useState(false);
  const [centred, setCentred] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !window.matchMedia(TOUCH).matches) return undefined;
    // Centred = the portrait's centre sits in the middle 20 % of the viewport (same rule as the scene).
    let frame = 0;
    const check = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const mid = (rect.top + rect.bottom) / 2;
      setCentred(rect.height > 0 && mid > window.innerHeight * 0.4 && mid < window.innerHeight * 0.6);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const onClick = () => {
    if (window.matchMedia(TOUCH).matches) setTapped((value) => !value);
  };

  const small = set.sizes[0];
  const on = colour || tapped || centred;
  return (
    <span
      ref={ref}
      className={`cutout ${on ? 'is-colour' : ''} ${className}`}
      style={{ '--cutout-aspect': `${small.w} / ${small.h}` }}
      tabIndex={focusable ? 0 : undefined}
      role={focusable ? 'img' : undefined}
      aria-label={focusable ? alt : undefined}
      onClick={onClick}
      {...rest}
    >
      <picture className="cutout-bw">
        <source type="image/avif" srcSet={srcSet(set, 'bw', 'avif')} sizes={sizes} />
        <img src={set.bw[small.h].webp} srcSet={srcSet(set, 'bw', 'webp')} sizes={sizes} width={small.w} height={small.h} alt={focusable ? '' : alt} decoding="async" />
      </picture>
      <picture className="cutout-colour" aria-hidden="true">
        <source type="image/avif" srcSet={srcSet(set, 'color', 'avif')} sizes={sizes} />
        <img src={set.color[small.h].webp} srcSet={srcSet(set, 'color', 'webp')} sizes={sizes} width={small.w} height={small.h} alt="" decoding="async" fetchpriority="low" />
      </picture>
    </span>
  );
}

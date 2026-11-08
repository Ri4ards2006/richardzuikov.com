import React from 'react';
import heroLarge from '../../assets/me-hero-1200.webp';
import heroSmall from '../../assets/me-hero-640.webp';

// LCP image: never lazy-load. Lowercase fetchpriority is the form React 18 passes to the DOM.
export default function HeroPortrait({ className }) {
  return (
    <img
      src={heroLarge}
      srcSet={`${heroSmall} 640w, ${heroLarge} 1200w`}
      sizes="(min-width: 768px) 40vw, 100vw"
      width={1200}
      height={900}
      alt="Richard Zuikov"
      fetchpriority="high"
      decoding="async"
      className={className}
    />
  );
}

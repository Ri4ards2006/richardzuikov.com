import React from 'react';
import { useReveal } from '../../hooks/use-reveal';

const tones = {
  base: 'bg-white dark:bg-[#09090b]',
  alt: 'bg-zinc-50 dark:bg-[#131316]',
};

export default function Section({ id, number, title, tone = 'base', background, children }) {
  const contentRef = useReveal();

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`section-diagonal relative scroll-mt-16 ${tones[tone]}`}>
      {background}
      <div ref={contentRef} className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 py-20 md:py-28">
        <div className="flex items-end gap-4 sm:gap-6 mb-12 md:mb-16">
          <span aria-hidden="true" className="font-black leading-none text-7xl md:text-9xl text-zinc-200 dark:text-white/20 select-none">
            {number}
          </span>
          <h2 id={`${id}-title`} className="heading-skew text-3xl md:text-5xl font-light tracking-tight text-zinc-950 dark:text-white pb-1">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

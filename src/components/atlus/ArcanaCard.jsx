import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../../hooks/use-language';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export default function ArcanaCard({ project, index, fan }) {
  const { language, t } = useLanguage();
  const [flipped, setFlipped] = useState(false);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    (flipped ? backRef : frontRef).current?.focus({ preventScroll: true });
  }, [flipped]);

  const { specs } = project[language];

  return (
    <article className="arcana" style={{ '--fan': `${fan}deg` }}>
      <div className={`arcana-inner ${flipped ? 'is-flipped' : ''}`}>
        <button
          ref={frontRef}
          type="button"
          onClick={() => setFlipped(true)}
          inert={flipped ? '' : undefined}
          aria-label={`${project.title}: ${t.atlus.flip}`}
          className="arcana-face flex flex-col"
        >
          <span aria-hidden="true" className="block text-center font-mono text-sm tracking-widest text-ash-300 py-3">{ROMAN[index] ?? index + 1}</span>
          <span className="relative block flex-1 min-h-0 mx-3 overflow-hidden">
            <img src={project.image} width={project.width} height={project.height} alt="" loading="lazy" decoding="async" className="arcana-image" />
            <span aria-hidden="true" className="arcana-halftone" />
            <span aria-hidden="true" className="ground-message">{t.atlus.hints.card}</span>
          </span>
          <span className="block text-center font-anton uppercase text-2xl tracking-wide text-ash-100 py-3 px-2">{project.title}</span>
        </button>

        <div inert={flipped ? undefined : ''} className="arcana-face arcana-back flex flex-col gap-3 p-4 overflow-y-auto">
          <h2 className="font-anton uppercase text-xl tracking-wide text-ash-100">{project.title}</h2>
          <ul className="list-disc pl-4 space-y-1 text-xs leading-relaxed text-ash-200 marker:text-accent">
            {specs.map((spec) => <li key={spec}>{spec}</li>)}
          </ul>
          <ul className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li key={tag} className="px-1.5 py-0.5 border border-ash-600 font-mono text-[11px] text-ash-200">{tag}</li>
            ))}
          </ul>
          <a href={project.href} target="_blank" rel="noreferrer" aria-label={`${t.lab.viewCode}: ${project.title}`} className="mt-auto inline-flex items-center gap-1.5 min-h-11 text-xs text-accent underline underline-offset-4">
            {t.lab.viewCode}
            <ExternalLink aria-hidden="true" className="w-3.5 h-3.5" />
          </a>
          <button ref={backRef} type="button" onClick={() => setFlipped(false)} className="min-h-11 text-left font-mono text-xs tracking-widest text-ash-300 hover:text-accent">
            ↺ {t.atlus.flipBack}
          </button>
        </div>
      </div>
    </article>
  );
}

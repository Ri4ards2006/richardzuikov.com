import React, { useLayoutEffect, useRef, useState } from 'react';
import { useLanguage } from '../../hooks/use-language';
import { projectImages } from '../../data/project-images';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export default function ProjectDeck() {
  const { t } = useLanguage();
  const projects = t.lab.projects.filter((project) => !project.isLiveApp);
  const [selected, setSelected] = useState(() => Math.floor((t.lab.projects.length - 1) / 2));
  const cardRefs = useRef([]);

  const layout = (position) => {
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const offset = index - position;
      const distance = Math.abs(offset);
      const lift = Math.max(0, 1 - distance);
      card.style.transform = `translateX(calc(${offset.toFixed(3)} * var(--deck-spread))) translateY(calc(${(distance * distance * 0.5).toFixed(3)}rem - ${lift.toFixed(3)} * 1.25rem)) rotateZ(${(offset * 6).toFixed(2)}deg) scale(${(1 + lift * 0.08).toFixed(3)})`;
      card.style.zIndex = String(100 - Math.round(distance * 10));
      card.style.opacity = distance > 3.2 ? '0' : '1';
    });
  };

  useLayoutEffect(() => layout(selected), [selected, projects.length]);

  return (
    <div className="deck-wrap">
      <h3 className="font-mono text-xs tracking-widest text-ash-300">{t.atlus.deck.label}</h3>
      <div className="deck" role="group" aria-label={t.atlus.deck.label}>
        {projects.map((project, index) => (
          <div key={project.id} ref={(node) => { cardRefs.current[index] = node; }} className={`deck-card ${index === selected ? 'is-selected' : ''}`}>
            <button type="button" onClick={() => setSelected(index)} aria-pressed={index === selected} aria-label={project.title} className="deck-face">
              <span aria-hidden="true" className="deck-roman">{ROMAN[index] ?? index + 1}</span>
              <span className="deck-image">
                <img src={projectImages[project.id]} alt="" loading="lazy" decoding="async" draggable="false" />
              </span>
              <span className="deck-title">{project.title}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

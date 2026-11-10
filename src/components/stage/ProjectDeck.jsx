import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLanguage } from '../../hooks/use-language';
import { projectImageLift, projectImages } from '../../data/project-images';
import { ROMAN } from '../../lib/atlus';
import { CardFrame } from '../atlus/glyphs';

const DRAG_THRESHOLD_PX = 6;
const WHEEL_STEP = 60;
const WHEEL_COOLDOWN_MS = 180;

export default function ProjectDeck({ onInspect }) {
  const { t } = useLanguage();
  const projects = t.lab.projects;
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

  const inspect = (index, element) => {
    const project = projects[index];
    // The Rack Configurator's repo entry is only the profile link, so it opens the live app instead.
    const link = project.liveUrl
      ? { href: project.liveUrl, label: t.lab.launch3d.toUpperCase() }
      : project.repo && !project.isLiveApp && { href: project.repo, label: t.atlus.inspect.source };
    onInspect({
      numeral: ROMAN[index] ?? String(index + 1),
      title: project.title,
      image: projectImages[project.id],
      imageLift: projectImageLift[project.id],
      lines: project.desc,
      details: [project.fullText],
      tags: project.tags,
      link: link || null,
    }, element);
  };

  const clampIndex = (index) => Math.max(0, Math.min(projects.length - 1, index));
  const step = (delta) => setSelected((current) => clampIndex(current + delta));

  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const deckRef = useRef(null);
  const drag = useRef(null);
  const suppressClick = useRef(false);

  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    suppressClick.current = false;
    drag.current = { x: event.clientX, spread: cardRefs.current[1]?.offsetWidth * 0.7 || 150, active: false, pointer: event.pointerId };
  };

  const onPointerMove = (event) => {
    const state = drag.current;
    if (!state) return;
    const dx = event.clientX - state.x;
    if (!state.active) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      state.active = true;
      deckRef.current.setPointerCapture(state.pointer);
      deckRef.current.classList.add('is-dragging');
    }
    state.position = Math.max(-0.4, Math.min(projects.length - 0.6, selected - dx / state.spread));
    layout(state.position);
  };

  const endDrag = () => {
    const state = drag.current;
    drag.current = null;
    if (!state?.active) return;
    suppressClick.current = true;
    deckRef.current.classList.remove('is-dragging');
    const next = clampIndex(Math.round(state.position));
    if (next === selected) layout(selected);
    else setSelected(next);
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      step(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setSelected(event.key === 'Home' ? 0 : projects.length - 1);
    } else if (event.key === 'Enter' && event.target === deckRef.current) {
      event.preventDefault();
      inspect(selected, cardRefs.current[selected].querySelector('button'));
    }
  };

  // React attaches wheel listeners passively, and the deck has to be able to stop the page scrolling.
  useEffect(() => {
    const deck = deckRef.current;
    let accumulated = 0;
    let lastStep = 0;
    const onWheel = (event) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const direction = Math.sign(delta);
      const index = selectedRef.current;
      // At either end the page keeps scrolling, so the deck can never trap the wheel.
      if (!direction || (direction < 0 && index === 0) || (direction > 0 && index === projects.length - 1)) return;
      event.preventDefault();
      accumulated += delta;
      const now = performance.now();
      if (Math.abs(accumulated) < WHEEL_STEP || now - lastStep < WHEEL_COOLDOWN_MS) return;
      accumulated = 0;
      lastStep = now;
      step(direction);
    };
    deck.addEventListener('wheel', onWheel, { passive: false });
    return () => deck.removeEventListener('wheel', onWheel);
  }, [projects.length]);

  // A drag that ends on a card or link must not also count as a click on it.
  const onClickCapture = (event) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const onCardClick = (index, element) => {
    if (index === selected) inspect(index, element);
    else setSelected(index);
  };

  return (
    <div className="deck-wrap">
      <h3 className="flex flex-wrap justify-between gap-x-6 font-mono text-xs tracking-widest text-ash-300">
        <span>{t.atlus.deck.label}</span>
      </h3>
      <div
        ref={deckRef}
        className="deck"
        role="group"
        tabIndex={0}
        aria-label={`${t.atlus.deck.label}. ${t.atlus.deck.hint}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
      >
        {projects.map((project, index) => {
          return (
            <div key={project.id} ref={(node) => { cardRefs.current[index] = node; }} className={`deck-card ${index === selected ? 'is-selected' : ''}`}>
              <div className="deck-inner">
                <button
                  type="button"
                  onClick={(event) => onCardClick(index, event.currentTarget)}
                  aria-pressed={index === selected}
                  aria-label={index === selected ? `${project.title}: ${t.atlus.flip}` : project.title}
                  className="deck-face"
                >
                  <CardFrame />
                  <span aria-hidden="true" className="deck-roman">{ROMAN[index] ?? index + 1}</span>
                  <span className="deck-image" style={projectImageLift[project.id] ? { '--image-lift': projectImageLift[project.id] } : undefined}>
                    <img src={projectImages[project.id]} alt="" loading="lazy" decoding="async" draggable="false" />
                  </span>
                  <span className="deck-title">{project.title}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/use-language';
import { projectImageLift, projectImages } from '../data/project-images';
import { ROMAN } from '../lib/atlus';
import Screen, { SubMenu } from '../components/atlus/Screen';
import { CardFrame } from '../components/atlus/glyphs';
import CardInspect from '../components/stage/CardInspect';

// Work screen: one tab per project (the same deck as on "/"), the framed card in the detail panel;
// the card opens the inspect view. location.state.project preselects a project (from Stack details).
export default function Work() {
  const { t } = useLanguage();
  const { state } = useLocation();
  const projects = t.lab.projects;
  const [active, setActive] = useState(() => Math.max(0, projects.findIndex((project) => project.id === state?.project)));
  const [inspected, setInspected] = useState(null);
  const cardRef = useRef(null);
  const project = projects[active];
  const link = project.liveUrl
    ? { href: project.liveUrl, label: t.lab.launch3d.toUpperCase() }
    : (project.repo && !project.isLiveApp && { href: project.repo, label: t.atlus.inspect.source }) || null;

  const open = () => {
    cardRef.current.style.visibility = 'hidden';
    setInspected({
      numeral: ROMAN[active] ?? String(active + 1),
      title: project.title,
      image: projectImages[project.id],
      imageLift: projectImageLift[project.id],
      lines: project.desc,
      details: [project.fullText],
      tags: project.tags,
      link,
    });
  };
  const close = () => {
    cardRef.current.style.visibility = '';
    setInspected(null);
    cardRef.current.focus({ preventScroll: true });
  };

  return (
    <Screen id="work" number="02" title={t.landing.nav.work} hud={t.atlus.hud.work} prop="monitor">
      <div className="scr-body">
        <SubMenu label={t.atlus.deck.label} items={projects.map((p) => ({ id: p.id, label: p.title, number: ROMAN[projects.indexOf(p)] }))} active={active} onSelect={setActive} />
        <section key={project.id} aria-live="polite" className="scr-detail slash-wipe scr-work">
          <button ref={cardRef} type="button" onClick={open} aria-label={`${project.title}: ${t.atlus.flip}`} className="deck-face scr-card">
            <CardFrame />
            <span aria-hidden="true" className="deck-roman">{ROMAN[active] ?? active + 1}</span>
            <span className="deck-image" style={projectImageLift[project.id] ? { '--image-lift': projectImageLift[project.id] } : undefined}>
              <img src={projectImages[project.id]} alt="" draggable="false" />
            </span>
            <span className="deck-title">{project.title}</span>
          </button>
          <div className="min-w-0">
            <p className="font-mono text-xs tracking-widest text-ash-300">{project.tag}</p>
            <h2 className="font-anton uppercase text-3xl tracking-wide mt-1">{project.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ash-200">{project.fullText}</p>
            <ul className="inspect-tags mt-4">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={open} className="inspect-btn">{t.atlus.inspect.details}</button>
              {link && <a href={link.href} target="_blank" rel="noreferrer" className="inspect-btn is-primary">{link.label} ↗</a>}
            </div>
          </div>
        </section>
      </div>
      {inspected && <CardInspect card={inspected} sourceEl={cardRef.current} onClosed={close} />}
    </Screen>
  );
}

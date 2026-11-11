import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/use-language';
import { stackUses } from '../../data/stack-uses';
import { stackWhat, useToProject } from '../../data/stack-details';
import { projectImageLift, projectImages } from '../../data/project-images';
import { ROMAN } from '../../lib/atlus';
import DetailScreen from './DetailScreen';
import { CardFrame } from './glyphs';
import { DEV_HINTS } from '../../lib/dev-hints';

// Stack skill detail: what it is, where it was used (project cards that open the Work screen on
// that project), experience in words. No ratings. ←/→ browse the items of the category.
export default function StackDetail({ category, index, onIndex, onClose }) {
  const { language, t } = useLanguage();
  const domain = t.career.domains[category];
  const item = domain.items[index];
  const what = stackWhat[category]?.[index]?.[language];
  const uses = stackUses[category]?.[index] ?? [];
  const projects = t.lab.projects;

  return (
    <DetailScreen label={item} index={index} count={domain.items.length} onIndex={onIndex} onClose={onClose}>
      <p className="font-mono text-xs tracking-widest text-ash-300">{String(index + 1).padStart(2, '0')} / {domain.name}</p>
      <h2 className="dts-title">{item}</h2>

      <h3 className="dts-label">{t.atlus.detail.what}</h3>
      <p className="text-base leading-relaxed text-ash-100 max-w-[68ch]">{what ?? (DEV_HINTS ? t.atlus.detail.todoWhat : '')}</p>

      <h3 className="dts-label">{t.atlus.detail.where}</h3>
      {uses.length ? (
        <ul className="dts-uses">
          {uses.map((use) => {
            const id = useToProject[use];
            const projectIndex = projects.findIndex((project) => project.id === id);
            if (projectIndex < 0) return <li key={use}><span className="stack-use">{use}</span></li>;
            const project = projects[projectIndex];
            return (
              <li key={use}>
                <Link to="/work" state={{ project: id, fromMenu: true }} onClick={onClose} className="deck-face dts-card" aria-label={`${project.title} →`}>
                  <CardFrame />
                  <span aria-hidden="true" className="deck-roman">{ROMAN[projectIndex]}</span>
                  <span className="deck-image" style={projectImageLift[id] ? { '--image-lift': projectImageLift[id] } : undefined}>
                    <img src={projectImages[id]} alt="" loading="lazy" draggable="false" />
                  </span>
                  <span className="deck-title">{project.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-ash-300">{t.atlus.detail.noUse}</p>
      )}

      {/* Experience in words is still missing: a TODO key in development, nothing (not even the
          heading) for visitors. */}
      {DEV_HINTS && (
        <>
          <h3 className="dts-label">{t.atlus.detail.experience}</h3>
          <p className="font-mono text-xs text-ash-300">{t.atlus.detail.todoExperience}</p>
        </>
      )}
    </DetailScreen>
  );
}

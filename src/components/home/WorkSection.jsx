import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../hooks/use-language';
import { featuredProjects } from '../../data/featured-projects';
import Section from './Section';

export default function WorkSection({ number }) {
  const { language, t } = useLanguage();

  return (
    <Section id="work" number={number} title={t.landing.nav.work} tone="alt">
      <div className="space-y-10">
        {featuredProjects.map((project) => {
          const { summary, specs } = project[language];
          return (
            <article key={project.title} className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b]">
              <img
                src={project.image}
                width={project.width}
                height={project.height}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-64 md:h-80 object-cover rounded-xl"
              />
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-light text-zinc-950 dark:text-white">{project.title}</h3>
                <p className="text-zinc-700 dark:text-zinc-300">{summary}</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700 dark:text-zinc-300 marker:text-zinc-500">
                  {specs.map((spec) => <li key={spec}>{spec}</li>)}
                </ul>
                <ul className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-700 dark:text-zinc-300">{tag}</li>
                  ))}
                </ul>
                <a href={project.href} target="_blank" rel="noreferrer" aria-label={`${t.lab.viewCode}: ${project.title}`} className="mt-auto inline-flex items-center gap-2 min-h-11 text-sm font-medium text-zinc-900 dark:text-white underline underline-offset-4">
                  {t.lab.viewCode}
                  <ExternalLink aria-hidden="true" className="w-4 h-4" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
      <Link to="/lab" className="mt-10 inline-flex items-center gap-2 min-h-11 text-base font-medium text-zinc-900 dark:text-white underline underline-offset-4">
        {t.landing.allProjects}
        <ArrowRight aria-hidden="true" className="w-4 h-4" />
      </Link>
    </Section>
  );
}

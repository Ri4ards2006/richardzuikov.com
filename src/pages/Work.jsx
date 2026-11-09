import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/use-language';
import { featuredProjects } from '../data/featured-projects';
import Screen from '../components/atlus/Screen';
import ArcanaCard from '../components/atlus/ArcanaCard';

const FAN_STEP = 5;

export default function Work() {
  const { t } = useLanguage();
  const middle = (featuredProjects.length - 1) / 2;

  return (
    <Screen id="work" number="02" title={t.landing.nav.work} hud={t.atlus.hud.work}>
      <div className="flex flex-wrap justify-center gap-8 lg:gap-4 py-4">
        {featuredProjects.map((project, index) => (
          <ArcanaCard key={project.title} project={project} index={index} fan={(index - middle) * FAN_STEP} />
        ))}
      </div>
      <Link to="/#arcana" className="mt-10 inline-flex items-center min-h-11 font-anton uppercase text-2xl tracking-wide text-accent underline underline-offset-4">
        {t.atlus.allProjects}
      </Link>
    </Screen>
  );
}

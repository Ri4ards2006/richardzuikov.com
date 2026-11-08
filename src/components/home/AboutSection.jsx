import React from 'react';
import { useLanguage } from '../../hooks/use-language';
import Section from './Section';
import workbenchImg from '../../assets/Home_Soldering_Station.jpeg';

export default function AboutSection({ number }) {
  const { t } = useLanguage();

  return (
    <Section id="about" number={number} title={t.landing.nav.about} tone="alt">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5 text-lg font-light leading-relaxed text-zinc-800 dark:text-zinc-200">
          <p>{t.about.headline}</p>
          <p>{t.career.summary}</p>
        </div>
        <img
          src={workbenchImg}
          width={2000}
          height={819}
          alt={t.landing.aboutPhotoAlt}
          loading="lazy"
          decoding="async"
          className="w-full h-auto rounded-2xl"
        />
      </div>
    </Section>
  );
}

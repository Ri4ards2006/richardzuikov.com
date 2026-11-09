import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/use-document-title';
import { sections } from '../lib/sections';
import Hero from '../components/home/Hero';
import AboutSection from '../components/home/AboutSection';
import DirectionSection from '../components/home/DirectionSection';
import WorkSection from '../components/home/WorkSection';
import StackSection from '../components/home/StackSection';
import CareerSection from '../components/home/CareerSection';
import ContactSection from '../components/home/ContactSection';

const components = {
  about: AboutSection,
  direction: DirectionSection,
  work: WorkSection,
  stack: StackSection,
  career: CareerSection,
  contact: ContactSection,
};

export default function Quick() {
  useDocumentTitle('Quick Read — Richard Zuikov');
  const { hash, key } = useLocation();

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash, key]);

  return (
    <div className="overflow-x-clip">
      <Hero />
      {sections.map(({ id, number }) => {
        const SectionComponent = components[id];
        return <SectionComponent key={id} number={number} />;
      })}
    </div>
  );
}

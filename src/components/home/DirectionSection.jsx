import React from 'react';
import { useLanguage } from '../../hooks/use-language';
import Section from './Section';

export default function DirectionSection({ number }) {
  const { t } = useLanguage();
  // TODO strings are placeholders for facts still to be supplied, so visitors never see them.
  const todos = import.meta.env.DEV ? [t.landing.todoStudies, t.landing.todoNextGoals] : [];

  return (
    <Section id="direction" number={number} title={t.landing.nav.direction}>
      <h3 className="text-sm font-mono tracking-wider text-zinc-600 dark:text-zinc-400 mb-6">{t.about.insightsTitle}</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {t.about.logEntries.map((entry) => (
          <li key={entry.title} className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <h4 className="text-base font-medium text-zinc-950 dark:text-zinc-100">{entry.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{entry.desc}</p>
          </li>
        ))}
      </ul>
      <div className="mt-12 border-l-2 border-zinc-950 dark:border-white pl-6 space-y-3">
        <h3 className="text-sm font-mono tracking-wider text-zinc-600 dark:text-zinc-400">{t.about.philosophyTitle}</h3>
        <p className="text-xl font-light text-zinc-900 dark:text-zinc-100">{t.about.philosophyQuote}</p>
        <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">{t.about.statusNote}</p>
      </div>
      {todos.map((todo) => (
        <p key={todo} className="mt-4 text-sm font-mono text-zinc-600 dark:text-zinc-400">{todo}</p>
      ))}
    </Section>
  );
}

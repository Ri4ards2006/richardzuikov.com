import React from 'react';
import { Cpu, Server, CircuitBoard, Layers } from 'lucide-react';
import { useLanguage } from '../../hooks/use-language';
import Section from './Section';

const icons = { lowLevel: Cpu, infra: Server, hardware: CircuitBoard, software: Layers };

export default function StackSection({ number }) {
  const { t } = useLanguage();

  return (
    <Section id="stack" number={number} title={t.landing.nav.stack}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(t.career.domains).map(([key, domain]) => {
          const Icon = icons[key];
          return (
            <div key={key} className="p-6 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <Icon aria-hidden="true" className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                </span>
                <div>
                  <h3 className="text-base font-medium text-zinc-950 dark:text-zinc-100">{domain.name}</h3>
                  <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">{domain.desc}</p>
                </div>
              </div>
              <ul className="flex flex-wrap gap-2">
                {domain.items.map((item) => (
                  <li key={item} className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-700 dark:text-zinc-300">{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

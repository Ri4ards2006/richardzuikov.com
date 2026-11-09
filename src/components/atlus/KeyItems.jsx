import React, { useRef, useState } from 'react';
import { Boxes, Cloud, Network, Server, ServerCog, Terminal } from 'lucide-react';
import { useLanguage } from '../../hooks/use-language';
import { ROMAN } from '../../lib/atlus';
import CardInspect from '../stage/CardInspect';

// Generic line icons, one per entry of career.certificates, same order. No brand logos (DESIGN.md §9).
const ICONS = [Cloud, Server, Terminal, ServerCog, Network, Boxes];
const TAGS_ON_CARD = 3;

export default function KeyItems() {
  const { t } = useLanguage();
  const [inspected, setInspected] = useState(null);
  const sourceRef = useRef(null);

  const open = (certificate, index, element) => {
    sourceRef.current = element;
    element.style.visibility = 'hidden';
    const Icon = ICONS[index % ICONS.length];
    setInspected({
      numeral: ROMAN[index] ?? String(index + 1),
      title: certificate.title,
      icon: <Icon aria-hidden="true" strokeWidth={1} />,
      lines: `${certificate.issuer} · ${certificate.date}`,
      details: certificate.skills,
      tags: certificate.skills.slice(0, TAGS_ON_CARD),
      // verifyUrl is only set when it points at this exact credential.
      link: certificate.verifyUrl ? { href: certificate.verifyUrl, label: t.atlus.boards.verify } : null,
    });
  };

  const close = () => {
    const element = sourceRef.current;
    element.style.visibility = '';
    setInspected(null);
    element.focus({ preventScroll: true });
  };

  return (
    <div className="key-items">
      <h3 className="font-mono text-xs tracking-widest text-ash-300">{t.atlus.boards.keyItems}</h3>
      <ul className="key-grid">
        {t.career.certificates.map((certificate, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <li key={certificate.id} style={{ '--i': index }}>
              <button type="button" onClick={(event) => open(certificate, index, event.currentTarget)} aria-label={`${certificate.title}: ${t.atlus.flip}`} className="key-card">
                <span aria-hidden="true" className="deck-roman">{ROMAN[index] ?? index + 1}</span>
                <span aria-hidden="true" className="key-icon"><Icon strokeWidth={1} /></span>
                <span className="key-title">{certificate.title}</span>
                <span className="key-meta">{certificate.issuer} · {certificate.date}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {inspected && <CardInspect card={inspected} sourceEl={sourceRef.current} onClosed={close} />}
    </div>
  );
}

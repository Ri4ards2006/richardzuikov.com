import React, { useRef, useState } from 'react';
import { useLanguage } from '../../hooks/use-language';
import { ROMAN } from '../../lib/atlus';
import CardInspect from '../stage/CardInspect';
import { CardFrame, Icon } from './glyphs';

// Official badges of earned credentials, src/assets/badges/<certificate id>.png (see the README there).
const BADGES = import.meta.glob('../../assets/badges/*.png', { eager: true, query: '?url', import: 'default' });
const badgeFor = (id) => BADGES[`../../assets/badges/${id}.png`] ?? null;

// Small generic line glyphs, one per entry of career.certificates, same order. No brand logos (DESIGN.md §7).
// AZ-900, IBM Power Linux, Google IT Automation, IBM Systems Architect, CCNA, CKA.
const ICONS = ['cloudServer', 'terminalPrompt', 'scriptScroll', 'microchip', 'networkTopology', 'orchestrationWheel'];
const iconFor = (index) => ICONS[index] ?? 'certificate';
const TAGS_ON_CARD = 3;

export default function KeyItems() {
  const { t } = useLanguage();
  const [inspected, setInspected] = useState(null);
  const sourceRef = useRef(null);

  const open = (certificate, index, element) => {
    sourceRef.current = element;
    element.style.visibility = 'hidden';
    setInspected({
      numeral: ROMAN[index] ?? String(index + 1),
      title: certificate.title,
      icon: <Icon name={iconFor(index)} />,
      // Back of the card: the official badge, unmodified and in colour; the front keeps the emblem.
      badge: badgeFor(certificate.id) && { src: badgeFor(certificate.id), href: certificate.verifyUrl, alt: `${certificate.title} badge` },
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
      <h3 className="flex items-center gap-2 font-mono text-xs tracking-widest text-ash-300"><Icon name="certificate" className="key-heading-icon" />{t.atlus.boards.keyItems}</h3>
      <ul className="key-grid">
        {t.career.certificates.map((certificate, index) => {
          return (
            <li key={certificate.id} style={{ '--i': index }}>
              <button type="button" onClick={(event) => open(certificate, index, event.currentTarget)} aria-label={`${certificate.title}: ${t.atlus.flip}`} className="key-card">
                <span aria-hidden="true" className="deck-roman">{ROMAN[index] ?? index + 1}</span>
                <CardFrame className="no-divider" />
                <span aria-hidden="true" className="key-emblem">
                  <span className="key-code" style={{ '--len': certificate.emblem.length }}>{certificate.emblem}</span>
                  <Icon name={iconFor(index)} className="key-glyph" />
                </span>
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

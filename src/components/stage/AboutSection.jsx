import React, { forwardRef } from 'react';
import { useLanguage } from '../../hooks/use-language';
import { portraits } from '../../data/portraits';
import { InkSplat } from '../atlus/glyphs';
import OpenScreen from '../atlus/OpenScreen';

// Fixed so the letters do not shift between renders (DESIGN.md §3).
const LETTER_TILT = [-5, 3, -2, 6, -4, 2, -6, 4, -3];
const LETTER_STYLE = ['is-paper is-anton', 'is-ink is-cinzel', 'is-paper is-mono', 'is-ink is-anton', 'is-paper is-cinzel'];

function RansomTitle({ id, text }) {
  let n = 0;
  return (
    <h2 id={id} aria-label={text} className="ransom">
      {text.split(' ').map((word) => (
        <span key={word} aria-hidden="true" className="ransom-word">
          {[...word].map((letter, i) => {
            n += 1;
            return (
              // eslint-disable-next-line react/no-array-index-key
              <span key={i} className={`ransom-letter ${LETTER_STYLE[n % LETTER_STYLE.length]}`} style={{ '--tilt': `${LETTER_TILT[n % LETTER_TILT.length]}deg` }}>{letter}</span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

const AboutSection = forwardRef(function AboutSection({ portraitRef, webgl }, ref) {
  const { t } = useLanguage();
  const copy = t.atlus.about;
  // TODO strings are placeholders for facts still to be supplied, so visitors never see them.
  const into = import.meta.env.DEV ? copy.todoInto : null;

  return (
    <section id="about" ref={ref} aria-labelledby="about-title" className="stage-about scroll-mt-16">
      <div className="about-copy">
        <InkSplat variant={2} className="ink-about" />
        <p className="font-mono text-xs tracking-widest text-ash-300">01 / {t.landing.nav.about}</p>
        <RansomTitle id="about-title" text={copy.title} />
        <div className="about-panel">
          <h3 className="about-label">{copy.who}</h3>
          <p className="text-base leading-relaxed text-ash-100">{t.about.headline}</p>
          <h3 className="about-label">{copy.what}</h3>
          <ul className="about-tags">
            {t.about.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          {into && (
            <>
              <h3 className="about-label">{copy.into}</h3>
              <p className="text-base leading-relaxed text-ash-300">{into}</p>
            </>
          )}
        </div>
        <OpenScreen to="/about" />
      </div>
      <div ref={portraitRef} className="about-portrait">
        {!webgl && <img src={portraits.about.large} alt="" className="h-full w-full object-contain grayscale" />}
      </div>
    </section>
  );
});

export default AboutSection;

import React from 'react';
import { portraits, posters } from '../../data/portraits';
import PosterPortrait from './PosterPortrait';

// Side-profile portrait on /about with HUD rings (DESIGN.md §18). The poster pipeline's output
// (v7 task 6) when it exists, the silhouette until then. Idle motion: the rings turn, the figure
// breathes; both stop under reduced motion (CSS).
export default function ProfilePortrait({ label }) {
  const portrait = portraits.about;
  const poster = posters.about;
  return (
    <figure className="prof-portrait">
      <svg aria-hidden="true" className="prof-rings" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="94" className="prof-ring is-outer" />
        <circle cx="100" cy="100" r="80" className="prof-ring is-dash" />
        <circle cx="100" cy="100" r="64" className="prof-ring is-inner" />
        <path d="M100 2v10M100 188v10M2 100h10M188 100h10" className="prof-ring-ticks" />
      </svg>
      {poster ? (
        <PosterPortrait set={poster} alt={label} className="prof-figure" sizes="(min-width: 1024px) 26vw, (min-width: 640px) 36vw, 12rem" />
      ) : (
        <img
          src={portrait.large}
          srcSet={portrait.isPlaceholder ? undefined : `${portrait.small} 700h, ${portrait.large} 1400h`}
          alt={portrait.isPlaceholder ? '' : label}
          className="prof-figure"
        />
      )}
    </figure>
  );
}

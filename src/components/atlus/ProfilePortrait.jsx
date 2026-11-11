import React from 'react';
import { cutouts, portraits } from '../../data/portraits';
import CutoutPortrait from './CutoutPortrait';

// Side-profile portrait on /about with HUD rings (DESIGN.md §18): the real `about` cut-out, B/W at
// rest, colour on hover / focus / tap (§2). Plain ink behind it, no slab. Idle motion: the rings
// turn, the figure breathes; both stop under reduced motion (CSS).
export default function ProfilePortrait({ label }) {
  const set = cutouts.about;
  const portrait = portraits.about;
  return (
    <figure className="prof-portrait">
      <svg aria-hidden="true" className="prof-rings" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="94" className="prof-ring is-outer" />
        <circle cx="100" cy="100" r="80" className="prof-ring is-dash" />
        <circle cx="100" cy="100" r="64" className="prof-ring is-inner" />
        <path d="M100 2v10M100 188v10M2 100h10M188 100h10" className="prof-ring-ticks" />
      </svg>
      {set ? (
        <CutoutPortrait set={set} alt={label} focusable className="prof-figure" sizes="(min-width: 1024px) 26vw, (min-width: 640px) 36vw, 12rem" />
      ) : (
        <img src={portrait.large} alt="" className="prof-figure" />
      )}
    </figure>
  );
}

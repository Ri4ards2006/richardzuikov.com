import React from 'react';

// Hand-cut tear: both halves share one jagged edge.
const TEAR = [50, 46, 53, 47, 51, 44, 54, 49, 48, 52, 45, 50, 47];
const edge = TEAR.map((x, i) => `${x}% ${(i / (TEAR.length - 1)) * 100}%`);
const leftClip = `polygon(0 0, ${edge.join(', ')}, 0 100%)`;
const rightClip = `polygon(100% 0, ${edge.join(', ')}, 100% 100%)`;

export default function IntroOverlay({ phase, loading, skip, onTearEnd }) {
  return (
    <div aria-hidden="true" className={`stage-intro is-${phase}`}>
      <div className="stage-tear stage-tear-l" style={{ clipPath: leftClip }} onAnimationEnd={onTearEnd} />
      <div className="stage-tear stage-tear-r" style={{ clipPath: rightClip }} />
      {phase === 'boot' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 font-mono text-[11px] tracking-[0.3em] text-ash-200">
          <span>{loading}</span>
          <span className="block w-56 h-px bg-ash-700"><span className="stage-bar block h-full bg-ash-100" /></span>
          <span className="tracking-widest text-ash-400 mt-4">{skip}</span>
        </div>
      )}
    </div>
  );
}

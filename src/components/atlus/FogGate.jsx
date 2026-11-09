import React from 'react';

const noise = (frequency, seed) => `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='4' seed='${seed}'/><feColorMatrix values='0 0 0 0 .78 0 0 0 0 .78 0 0 0 0 .76 2.4 0 0 0 -.75'/></filter><rect width='512' height='512' filter='url(#f)'/></svg>`,
)}")`;

const layers = [noise(0.008, 3), noise(0.016, 11), noise(0.03, 29)];

export default function FogGate({ onDone }) {
  const handleEnd = (event) => {
    if (event.target === event.currentTarget) onDone();
  };

  return (
    <div aria-hidden="true" className="fog-gate" onAnimationEnd={handleEnd}>
      {layers.map((backgroundImage) => <span key={backgroundImage} style={{ backgroundImage }} />)}
    </div>
  );
}

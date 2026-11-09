import React from 'react';
import { fogTexture } from '../../lib/noise-textures';

const LAYER_CELLS = [4, 7, 12];

export default function FogGate({ onDone }) {
  const handleEnd = (event) => {
    if (event.target === event.currentTarget) onDone();
  };

  return (
    <div aria-hidden="true" className="fog-gate" onAnimationEnd={handleEnd}>
      {LAYER_CELLS.map((cells) => <span key={cells} style={{ backgroundImage: fogTexture(cells) }} />)}
    </div>
  );
}

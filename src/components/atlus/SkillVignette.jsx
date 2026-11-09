import React from 'react';

// One small looping monochrome scene per skill category (DESIGN.md §7 Card 04). CSS only.
const SOURCE = ['PORTB |= 1 << 5;', 'while (!done);', 'return sum;', 'x = a + b;'];
const ASM = ['sbi 0x18,5', 'rjmp .-4', 'ret', 'add r24,r22'];
const HEX = ['C5 9A', 'FF CF', '08 95', '86 0F'];

function LowLevel() {
  return (
    <div className="vg-columns">
      {[SOURCE, ASM, HEX].map((lines, column) => (
        <div key={lines[0]} className="vg-column" style={{ '--speed': `${5 + column}s` }}>
          <div className="vg-scroll">
            {[...lines, ...lines].map((line, index) => <span key={`${line}-${index % lines.length}-${index >= lines.length}`}>{line}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

const LED_PERIODS = [0.9, 1.7, 0.6, 2.3, 1.2, 0.8, 1.9, 1.4];

function Systems() {
  return (
    <svg viewBox="0 0 240 72" role="presentation" preserveAspectRatio="none" className="vg-svg">
      {[0, 1, 2, 3].map((unit) => (
        <g key={unit} transform={`translate(0 ${unit * 18})`}>
          <rect className="vg-line" x="1" y="1" width="238" height="15" />
          {[0, 1, 2, 3, 4, 5].map((bay) => <rect key={bay} className="vg-faint" x={12 + bay * 22} y="5" width="16" height="7" />)}
          {[0, 1].map((led) => (
            <rect key={led} className="vg-led" x={200 + led * 16} y="6" width="6" height="5" style={{ '--period': `${LED_PERIODS[(unit * 2 + led) % 8]}s` }} />
          ))}
        </g>
      ))}
    </svg>
  );
}

const WAVE = Array.from({ length: 121 }, (_, i) => `${i ? 'L' : 'M'}${i * 2} ${36 + Math.sin(i * 0.26) * (14 + Math.sin(i * 0.05) * 10)}`).join(' ');

function Hardware() {
  return (
    <svg viewBox="0 0 240 72" role="presentation" preserveAspectRatio="none" className="vg-svg">
      {[40, 80, 120, 160, 200].map((x) => <path key={x} className="vg-faint" d={`M${x} 0 V72`} />)}
      {[18, 36, 54].map((y) => <path key={y} className="vg-faint" d={`M0 ${y} H240`} />)}
      <path className="vg-scope" d={WAVE} pathLength="100" />
    </svg>
  );
}

const WIRE = [[0, 0, 240, 12], [8, 20, 104, 8], [8, 34, 80, 6], [8, 46, 92, 6], [130, 20, 102, 44], [8, 58, 44, 8]];

function Software() {
  return (
    <svg viewBox="0 0 240 72" role="presentation" preserveAspectRatio="none" className="vg-svg">
      <rect className="vg-line" x="1" y="1" width="238" height="70" />
      {WIRE.map(([x, y, width, height], index) => (
        <rect key={`${x}-${y}`} className="vg-wire" x={x} y={y} width={width} height={height} style={{ '--step': index }} />
      ))}
    </svg>
  );
}

const VIGNETTES = { lowLevel: LowLevel, infra: Systems, hardware: Hardware, software: Software };

export default function SkillVignette({ category }) {
  const Vignette = VIGNETTES[category];
  return Vignette ? <div aria-hidden="true" className="skill-vignette"><Vignette /></div> : null;
}

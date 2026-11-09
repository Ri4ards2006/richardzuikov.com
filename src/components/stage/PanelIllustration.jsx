import React from 'react';

// One small animated line drawing per descent panel. CSS only, so nothing runs on the main thread.
const BIT_PERIODS = [1.6, 2.7, 1.1, 3.4, 2.1, 1.3, 2.9, 1.9];

function Bits() {
  return (
    <div className="ill-bits">
      <span className="ill-label">PORTB</span>
      <div className="ill-bit-row">
        {BIT_PERIODS.map((period, index) => (
          <span key={period} className="ill-bit" style={{ '--period': `${period}s`, '--delay': `${index * -0.37}s` }}>
            <span>0</span>
            <span>1</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const PERIOD = 160;
const clockPath = (y0, y1) => Array.from({ length: 16 }, (_, i) => `H${i * 10 + 10} V${i % 2 ? y0 : y1}`).join(' ');
const CLOCK = `M0 ${18} ${clockPath(18, 4)}`;
const DATA_BITS = [1, 0, 1, 1, 0, 0, 1, 0];
const dataPath = (y0, y1) => {
  const yOf = (bit) => (bit ? y1 : y0);
  return DATA_BITS.reduce((path, bit, i) => `${path} H${i * 20} V${yOf(bit)}`, `M0 ${yOf(DATA_BITS[0])}`) + ` H${PERIOD}`;
};

function Wave() {
  return (
    <svg className="ill-wave" viewBox="0 0 200 58" role="presentation">
      <text x="0" y="16">SCK</text>
      <text x="0" y="47">MOSI</text>
      <svg x="36" y="0" width="164" height="58" viewBox="0 0 164 58">
        <g className="ill-scroll">
          {[0, PERIOD].map((x) => (
            <g key={x} transform={`translate(${x} 0)`}>
              <path d={CLOCK} />
              <path d={dataPath(52, 36)} />
            </g>
          ))}
        </g>
      </svg>
    </svg>
  );
}

const CODE_LINES = ['while (!(SPSR & (1 << SPIF)));', 'go func() { ch <- read(bus) }()'];

function Code() {
  return (
    <div className="ill-code">
      {CODE_LINES.map((line, index) => (
        <span key={line} className={`ill-line is-line-${index + 1}`} style={{ '--chars': line.length }}>{line}</span>
      ))}
    </div>
  );
}

function Trace() {
  return (
    <svg className="ill-trace" viewBox="0 0 200 58" role="presentation">
      <path className="ill-trace-base" d="M4 50 H44 L68 26 H112 L134 10 H196" />
      <path className="ill-trace-pulse" d="M4 50 H44 L68 26 H112 L134 10 H196" pathLength="100" />
      {[[4, 50], [68, 26], [134, 10], [196, 10]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="3.2" />)}
    </svg>
  );
}

// Pods leave the control plane, land on a worker node and a heartbeat runs underneath.
const NODE_YS = [4, 20, 36];
const PODS = [[0, 0], [1, 1], [2, 0], [0, 1], [1, 0], [2, 1]];
const POD_X = (slot) => 138 + slot * 18;
const HEARTBEAT = 'M0 58 H70 L78 58 L85 46 L93 64 L99 58 H200';

function Nodes() {
  return (
    <svg className="ill-trace ill-nodes" viewBox="0 0 200 66" role="presentation">
      <rect className="ill-node" x="2" y="16" width="34" height="20" />
      <text x="7" y="30">K3S</text>
      {NODE_YS.map((y) => (
        <g key={y}>
          <path className="ill-trace-base" d={`M36 26 L120 ${y + 6}`} />
          <rect className="ill-node" x="120" y={y} width="62" height="12" />
        </g>
      ))}
      {PODS.map(([node, slot], index) => (
        <rect
          key={`${node}-${slot}`}
          className="ill-pod"
          x={POD_X(slot) - 4}
          y={NODE_YS[node] + 2}
          width="8"
          height="8"
          style={{ '--from-x': `${36 - POD_X(slot)}px`, '--from-y': `${22 - NODE_YS[node]}px`, '--delay': `${index * 1}s` }}
        />
      ))}
      <path className="ill-trace-base" d={HEARTBEAT} />
      <path className="ill-trace-pulse" d={HEARTBEAT} pathLength="100" />
    </svg>
  );
}

const ILLUSTRATIONS = [Bits, Wave, Code, Nodes, Trace];

export default function PanelIllustration({ index }) {
  const Illustration = ILLUSTRATIONS[index % ILLUSTRATIONS.length];
  return <div aria-hidden="true" className="panel-illustration"><Illustration /></div>;
}

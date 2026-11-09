import React from 'react';
import { useSectionEnter } from '../../hooks/use-section-enter';
// SVG sources: design/assets-src (PR #11), optimized with svgo into src/assets/svg.
import traceStar from '../../assets/svg/tracestar.svg?raw';
import traceStarSmall from '../../assets/svg/tracestar-16.svg?raw';
import cardFrame from '../../assets/svg/card-frame.svg?raw';
import ink1 from '../../assets/svg/ink-01.svg?raw';
import ink2 from '../../assets/svg/ink-02.svg?raw';
import ink3 from '../../assets/svg/ink-03.svg?raw';
import ink4 from '../../assets/svg/ink-04.svg?raw';
import ink5 from '../../assets/svg/ink-05.svg?raw';
import certificate from '../../assets/svg/icons/certificate.svg?raw';
import circuitBoard from '../../assets/svg/icons/circuit-board.svg?raw';
import cloudServer from '../../assets/svg/icons/cloud-server.svg?raw';
import microchip from '../../assets/svg/icons/microchip.svg?raw';
import networkTopology from '../../assets/svg/icons/network-topology.svg?raw';
import orchestrationWheel from '../../assets/svg/icons/orchestration-wheel.svg?raw';
import scriptScroll from '../../assets/svg/icons/script-scroll.svg?raw';
import terminalPrompt from '../../assets/svg/icons/terminal-prompt.svg?raw';

const INK = [ink1, ink2, ink3, ink4, ink5];

export const ICONS = { certificate, circuitBoard, cloudServer, microchip, networkTopology, orchestrationWheel, scriptScroll, terminalPrompt };

// Card frame stretched to its box; strokes keep their width (CSS: vector-effect).
export const CARD_FRAME_SVG = cardFrame.replace('<svg ', '<svg preserveAspectRatio="none" ');

function Raw({ svg, className, style }) {
  return <span aria-hidden="true" className={className} style={style} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function TraceStar({ small = false, className = '' }) {
  return <Raw svg={small ? traceStarSmall : traceStar} className={`trace-star ${className}`} />;
}

export function CardFrame({ className = '' }) {
  return <Raw svg={CARD_FRAME_SVG} className={`card-frame ${className}`} />;
}

export function Icon({ name, className = '' }) {
  return <Raw svg={ICONS[name] ?? certificate} className={`glyph-icon ${className}`} />;
}

// Ink splatter with boil (§5): three jittered states at 12 fps; still under reduced motion.
export function InkSplat({ variant = 0, className = '', style }) {
  return <Raw svg={INK[variant % INK.length]} className={`ink-splat ${className}`} style={style} />;
}

// Impact moment: the splatter slams in once when it reaches the viewport.
export function ImpactInk({ variant = 3, className = '' }) {
  const ref = useSectionEnter();
  return (
    <span ref={ref} aria-hidden="true" className={`impact-ink ${className}`}>
      <InkSplat variant={variant} />
    </span>
  );
}

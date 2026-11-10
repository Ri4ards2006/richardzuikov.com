import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/use-reduced-motion';

// Lazy three.js prop for a screen. name: chip | pcb | monitor | rackUnit | domeCamera | oscilloscope | browserFrame.
// A change of name spins the prop and swaps it. Decoration only.
export default function PropViewer({ name, className = '' }) {
  const canvasRef = useRef(null);
  const viewerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const initial = useRef(name);

  useEffect(() => {
    if (!('WebGL2RenderingContext' in window)) return undefined;
    let cancelled = false;
    import('../stage/prop-viewer').then(({ createPropViewer }) => {
      if (cancelled || !canvasRef.current) return;
      viewerRef.current = createPropViewer(canvasRef.current, initial.current, { still: reducedMotion });
    }).catch(() => {});
    return () => {
      cancelled = true;
      viewerRef.current?.dispose();
      viewerRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    initial.current = name;
    viewerRef.current?.select(name);
  }, [name]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`prop-viewer ${className}`} />;
}

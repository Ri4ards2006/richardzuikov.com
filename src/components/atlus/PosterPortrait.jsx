import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/use-reduced-motion';
import { DEFAULT_PARAMS } from './poster-gl';

// Poster portrait (DESIGN.md §18, v7 task 6). WebGL: 5-tone shader with edge pass and paper rim.
// No WebGL2 or reduced motion: the static poster from the pipeline. colorReveal (default off):
// hover / focus dissolves the poster into the colour photo.
const srcSet = (layer, widths, format) => widths.map((w) => `${layer[w][format]} ${w}w`).join(', ');

export default function PosterPortrait({ set, alt, colorReveal = false, params, sizes = '(min-width: 1024px) 30vw, 60vw', className = '' }) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef(null);
  const posterRef = useRef(null);
  const [gl, setGl] = useState(false);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    if (reducedMotion || !('WebGL2RenderingContext' in window)) return undefined;
    let cancelled = false;
    const canvas = canvasRef.current;
    // Texture width: the smallest one that covers the displayed width at this DPR.
    const need = (canvas.parentElement?.clientWidth || 600) * Math.min(window.devicePixelRatio || 1, 2);
    const width = set.widths.find((w) => w >= need) ?? set.widths.at(-1);
    import('./poster-gl').then(({ createPoster }) => createPoster(canvas, { gray: set.gray[width].webp, color: set.color[width].webp }, { ...DEFAULT_PARAMS, ...paramsRef.current }))
      .then((poster) => {
        if (cancelled) { poster.dispose(); return; }
        posterRef.current = poster;
        setGl(true);
      })
      .catch(() => setGl(false));
    return () => {
      cancelled = true;
      posterRef.current?.dispose();
      posterRef.current = null;
      setGl(false);
    };
  }, [set, reducedMotion]);

  useEffect(() => {
    if (params) posterRef.current?.set(params);
  }, [params]);

  // Hover dissolve: 450 ms toward the target, reversible mid-way.
  const animRef = useRef({ value: 0, frame: 0 });
  const revealTo = (target) => {
    if (!colorReveal) return;
    const anim = animRef.current;
    cancelAnimationFrame(anim.frame);
    let last = performance.now();
    const step = (now) => {
      const dt = (now - last) / 450;
      last = now;
      anim.value = target > anim.value ? Math.min(target, anim.value + dt) : Math.max(target, anim.value - dt);
      posterRef.current?.reveal(anim.value);
      if (anim.value !== target) anim.frame = requestAnimationFrame(step);
    };
    anim.frame = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(animRef.current.frame), []);
  useEffect(() => { if (!colorReveal) { animRef.current.value = 0; posterRef.current?.reveal(0); } }, [colorReveal]);

  const widths = set.widths;
  return (
    <span
      className={`poster ${gl ? 'is-gl' : ''} ${colorReveal ? 'has-reveal' : ''} ${className}`}
      onPointerEnter={() => revealTo(1)}
      onPointerLeave={() => revealTo(0)}
    >
      <picture className="poster-static">
        <source type="image/avif" srcSet={srcSet(set.poster, widths, 'avif')} sizes={sizes} />
        <img src={set.poster[widths[0]].webp} srcSet={srcSet(set.poster, widths, 'webp')} sizes={sizes} alt={alt} />
      </picture>
      {colorReveal && !gl && (
        <picture className="poster-color" aria-hidden="true">
          <source type="image/avif" srcSet={srcSet(set.color, widths, 'avif')} sizes={sizes} />
          <img src={set.color[widths[0]].webp} srcSet={srcSet(set.color, widths, 'webp')} sizes={sizes} alt="" />
        </picture>
      )}
      <canvas ref={canvasRef} aria-hidden="true" className="poster-gl" />
    </span>
  );
}

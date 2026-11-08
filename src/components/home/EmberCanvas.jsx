import React, { useEffect, useRef } from 'react';

const MAX_PARTICLES = 80;
const MAX_DPR = 1.5;
const FRAME_MS = 33; // ~30 fps

const random = (min, max) => min + Math.random() * (max - min);

export default function EmberCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;
    let last = 0;

    const spawn = (particle, scatter) => {
      particle.x = random(0, width);
      particle.y = scatter ? random(height * 0.3, height) : height + 4;
      particle.speed = random(15, 50);
      particle.phase = random(0, Math.PI * 2);
      particle.radius = random(0.8, 2.4);
      particle.max = random(3, 7);
      particle.life = scatter ? random(0, particle.max) : 0;
      return particle;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(MAX_PARTICLES, Math.floor(width / 16));
      particles = Array.from({ length: count }, () => spawn({}, true));
    };

    const draw = (time) => {
      frame = requestAnimationFrame(draw);
      if (time - last < FRAME_MS) return;
      const dt = Math.min((time - last) / 1000, 0.1);
      last = time;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of particles) {
        p.life += dt;
        if (p.life >= p.max || p.y < -4) spawn(p, false);
        p.y -= p.speed * dt;
        p.x += Math.sin(p.phase + p.life * 1.5) * 12 * dt;
        ctx.fillStyle = `rgba(255, 176, 0, ${Math.sin((Math.PI * p.life) / p.max) * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const start = () => { if (!frame) { last = performance.now(); frame = requestAnimationFrame(draw); } };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibility.observe(canvas);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none bg-[radial-gradient(ellipse_70%_100%_at_50%_100%,rgba(255,176,0,0.2),transparent_70%)]" />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />
    </>
  );
}

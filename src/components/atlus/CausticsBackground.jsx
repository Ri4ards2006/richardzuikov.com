import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/use-reduced-motion';

const MAX_DPR = 1.5;
const RENDER_SCALE = 0.6;
const FRAME_MS = 1000 / 30 - 1;
const LIGHT_LERP = 0.08;

const VERTEX_SHADER = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uResolution;
uniform vec2 uLight;
uniform float uTime;

const vec3 ASH_900 = vec3(0.043, 0.043, 0.047);
const vec3 ASH_100 = vec3(0.949, 0.941, 0.925);
const vec3 AMBER = vec3(1.0, 0.69, 0.0);
const mat2 TURN = mat2(0.8, 0.6, -0.6, 0.8);

float ridge(vec2 p, float t) {
  vec2 w = p + 0.7 * vec2(sin(p.y * 1.3 + t * 0.9), cos(p.x * 1.1 - t * 0.7));
  float wave = sin(w.x * 1.7 + t * 0.7) + sin(w.y * 1.9 - t * 0.6) + sin((w.x + w.y) * 1.2 + t * 0.5);
  return 1.0 - abs(wave) / 3.0;
}

float caustics(vec2 p, float t) {
  float a = ridge(p * 4.2, t);
  float b = ridge(TURN * p * 6.3 + vec2(3.1, 1.7), t * 0.8 + 4.0);
  return pow(a, 14.0) * 0.6 + pow(b, 18.0) * 0.35 + pow(a * b, 7.0) * 0.9;
}

float godRays(vec2 uv, float t, float aspect) {
  vec2 ray = uv - vec2(aspect * (0.5 + sin(t * 0.07) * 0.15), 1.35);
  float angle = atan(ray.x, -ray.y);
  float beams = (0.5 + 0.5 * sin(angle * 17.0 + t * 0.22)) * (0.5 + 0.5 * sin(angle * 31.0 - t * 0.15));
  beams += 0.35 * (0.5 + 0.5 * sin(angle * 7.0 - t * 0.09));
  float fade = smoothstep(0.0, 1.0, uv.y);
  return beams * fade * fade;
}

float grain(vec2 coord, float t) {
  return fract(sin(dot(coord, vec2(12.9898, 78.233)) + t) * 43758.5453) - 0.5;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = gl_FragCoord.xy / uResolution.y;
  vec2 toLight = uv - vec2(uLight.x * aspect, uLight.y);
  float spot = exp(-dot(toLight, toLight) * 4.5);

  float light = caustics(uv + vec2(uTime * 0.02, uTime * 0.008), uTime * 0.18);
  float rays = godRays(uv, uTime, aspect);
  float value = 0.05 + 0.1 * uv.y + rays * (0.22 + 0.3 * spot) + light * (0.16 + 0.85 * spot);

  vec3 color = mix(ASH_900, ASH_100, clamp(value, 0.0, 1.0) * 0.62);
  color = mix(color, AMBER, smoothstep(0.55, 0.95, value) * 0.1);
  color += grain(gl_FragCoord.xy, mod(uTime, 10.0)) * 0.035;
  gl_FragColor = vec4(color, 1.0);
}
`;

// Also the backdrop while the first WebGL frame is pending.
const fallbackBackground = [
  'radial-gradient(ellipse 60% 45% at 50% 30%, rgb(var(--ash-600) / 0.5), transparent 70%)',
  'radial-gradient(ellipse 90% 60% at 50% 0%, rgb(var(--ash-700) / 0.8), transparent 75%)',
  'linear-gradient(to bottom, rgb(var(--ash-800)), rgb(var(--ash-900)) 75%)',
].join(', ');

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function createRenderer(gl) {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.useProgram(program);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  return {
    resolution: gl.getUniformLocation(program, 'uResolution'),
    light: gl.getUniformLocation(program, 'uLight'),
    time: gl.getUniformLocation(program, 'uTime'),
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}

export default function CausticsBackground() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const animate = !reducedMotion && !failed;

  useEffect(() => {
    if (!animate) return undefined;
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    const renderer = gl && createRenderer(gl);
    if (!renderer) {
      setFailed(true);
      return undefined;
    }

    const target = { x: 0.5, y: 0.7 };
    const light = { ...target };
    let frame = 0;
    let last = 0;
    let time = 0;
    let onScreen = true;

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, MAX_DPR) * RENDER_SCALE;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(renderer.resolution, canvas.width, canvas.height);
    };

    const draw = (now) => {
      frame = requestAnimationFrame(draw);
      if (now - last < FRAME_MS) return;
      time += Math.min((now - last) / 1000, 0.1);
      last = now;
      light.x += (target.x - light.x) * LIGHT_LERP;
      light.y += (target.y - light.y) * LIGHT_LERP;
      gl.uniform1f(renderer.time, time);
      gl.uniform2f(renderer.light, light.x, light.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const sync = () => {
      const shouldRun = onScreen && !document.hidden;
      if (shouldRun && !frame) {
        last = performance.now() - FRAME_MS;
        frame = requestAnimationFrame(draw);
      } else if (!shouldRun && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const onPointerMove = (event) => {
      target.x = event.clientX / window.innerWidth;
      target.y = 1 - event.clientY / window.innerHeight;
    };
    const onContextLost = (event) => {
      event.preventDefault();
      setFailed(true);
    };

    resize();
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    resizeObserver?.observe(canvas);
    const visibility = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    visibility?.observe(canvas);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', sync);
    canvas.addEventListener('webglcontextlost', onContextLost);
    sync();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      visibility?.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', sync);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      renderer.dispose();
    };
  }, [animate]);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none" style={{ background: fallbackBackground }}>
      {animate && <canvas ref={canvasRef} className="w-full h-full block" />}
    </div>
  );
}

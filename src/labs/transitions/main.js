import { createChapterA, createChapterB } from './dummy-chapters.js';
import { CandidateRoll } from './candidate-roll.js';
import { CandidateZoom } from './candidate-zoom.js';
import { CandidateCorridor } from './candidate-corridor.js';
import { CandidateInk } from './candidate-ink.js';
import { PerfMonitor } from './perf-monitor.js';
import { grainTexture } from '../../lib/noise-textures.js';

// Setup DOM Root
const root = document.getElementById('lab-root');

// Background noise texture layer (Atlus grain)
const grainEl = document.createElement('div');
grainEl.className = 'stage-grain';
grainEl.style.cssText = `
  position: fixed;
  inset: -64px;
  z-index: 40;
  pointer-events: none;
  opacity: 0.08;
  background-image: ${grainTexture()};
`;
root.appendChild(grainEl);

// Viewport container
const stageContainer = document.createElement('div');
stageContainer.id = 'transition-stage';
stageContainer.style.cssText = `
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #050505;
`;
root.appendChild(stageContainer);

// Create Chapters
const chapterA = createChapterA();
const chapterB = createChapterB();
stageContainer.appendChild(chapterA);
stageContainer.appendChild(chapterB);

// State
let currentCandidateIndex = 0; // 0: Roll, 1: Zoom, 2: Corridor, 3: Ink
let scrollProgress = 0.0;
let targetProgress = 0.0;
let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CANDIDATES = [
  { name: '1: 90° Roll (Speedlines)', cls: CandidateRoll },
  { name: '2: Zoom-Through (+800%)', cls: CandidateZoom },
  { name: '3: 3D Corridor (Z-Fog)', cls: CandidateCorridor },
  { name: '4: Ink Dive (Sumi-e Wipe)', cls: CandidateInk },
];

let activeController = null;
const perf = new PerfMonitor();

function initCandidate(index) {
  if (activeController) {
    activeController.destroy();
  }
  currentCandidateIndex = index;
  const entry = CANDIDATES[index];
  activeController = new entry.cls(stageContainer, chapterA, chapterB);
  updateToggleUI();
}

// Dev Controls (Bottom-Left)
const controls = document.createElement('div');
controls.id = 'lab-controls';
controls.style.cssText = `
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(18, 18, 18, 0.92);
  border: 1px solid #3f3f46;
  padding: 0.75rem 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.6);
  font-family: monospace;
  font-size: 0.75rem;
  backdrop-filter: blur(8px);
`;

controls.innerHTML = `
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #27272a; padding-bottom: 0.4rem;">
    <span style="color: #ff6a00; font-weight: bold; letter-spacing: 0.1em;">TRANSITION LAB [1-4]</span>
    <span id="motion-indicator" style="color: ${isReducedMotion ? '#ff6a00' : '#71717a'}; cursor: pointer;">
      [MOTION: ${isReducedMotion ? 'REDUCED' : 'FULL'}]
    </span>
  </div>
  <div id="candidate-buttons" style="display: flex; gap: 0.4rem; margin-top: 0.3rem;"></div>
  <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.2rem;">
    <span style="color: #a1a1aa;">SCRUB:</span>
    <input type="range" id="scrub-slider" min="0" max="1000" value="0" style="flex: 1; accent-color: #ff6a00; cursor: pointer;" />
    <span id="scrub-val" style="color: #f4f4f0; width: 42px; text-align: right;">0.0%</span>
  </div>
`;
root.appendChild(controls);

const buttonsContainer = controls.querySelector('#candidate-buttons');
CANDIDATES.forEach((cand, idx) => {
  const btn = document.createElement('button');
  btn.id = `btn-cand-${idx + 1}`;
  btn.innerText = `${idx + 1}`;
  btn.title = cand.name;
  btn.style.cssText = `
    background: ${idx === currentCandidateIndex ? '#f4f4f0' : '#27272a'};
    color: ${idx === currentCandidateIndex ? '#050505' : '#d4d4d8'};
    border: none;
    padding: 0.35rem 0.65rem;
    cursor: pointer;
    font-weight: bold;
    font-family: monospace;
    font-size: 0.8rem;
    transition: all 0.15s ease;
  `;
  btn.addEventListener('click', () => initCandidate(idx));
  buttonsContainer.appendChild(btn);
});

function updateToggleUI() {
  const btns = buttonsContainer.querySelectorAll('button');
  btns.forEach((b, i) => {
    b.style.background = i === currentCandidateIndex ? '#f4f4f0' : '#27272a';
    b.style.color = i === currentCandidateIndex ? '#050505' : '#d4d4d8';
  });
}

// Toggle Reduced Motion on click
controls.querySelector('#motion-indicator').addEventListener('click', () => {
  isReducedMotion = !isReducedMotion;
  controls.querySelector('#motion-indicator').innerText = `[MOTION: ${isReducedMotion ? 'REDUCED' : 'FULL'}]`;
  controls.querySelector('#motion-indicator').style.color = isReducedMotion ? '#ff6a00' : '#71717a';
});

// Scrub Slider
const slider = controls.querySelector('#scrub-slider');
const scrubVal = controls.querySelector('#scrub-val');
slider.addEventListener('input', (e) => {
  targetProgress = Number(e.target.value) / 1000;
  scrollProgress = targetProgress;
  scrubVal.innerText = `${(targetProgress * 100).toFixed(0)}%`;
});

// Top-Right Perf Readout
const hud = document.createElement('div');
hud.id = 'lab-hud';
hud.style.cssText = `
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 50;
  background: rgba(18, 18, 18, 0.92);
  border: 1px solid #3f3f46;
  padding: 0.6rem 0.9rem;
  font-family: monospace;
  font-size: 0.75rem;
  color: #f4f4f0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.6);
  pointer-events: none;
  backdrop-filter: blur(8px);
`;
hud.innerHTML = `
  <div style="display: flex; justify-content: space-between; gap: 1rem;">
    <span style="color: #71717a;">FPS:</span>
    <span id="hud-fps" style="color: #10b981; font-weight: bold;">60</span>
  </div>
  <div style="display: flex; justify-content: space-between; gap: 1rem;">
    <span style="color: #71717a;">FRAME:</span>
    <span id="hud-frame">16.6 ms</span>
  </div>
  <div style="display: flex; justify-content: space-between; gap: 1rem;">
    <span style="color: #71717a;">ACTIVE:</span>
    <span id="hud-candidate" style="color: #ff6a00;">${CANDIDATES[0].name.split(' ')[1]}</span>
  </div>
`;
root.appendChild(hud);

// Keyboard Toggle 1-4
window.addEventListener('keydown', (e) => {
  if (['1', '2', '3', '4'].includes(e.key)) {
    const idx = parseInt(e.key, 10) - 1;
    initCandidate(idx);
  }
});

// Wheel / Touch Scrubbing
window.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    const delta = e.deltaY * 0.0008;
    targetProgress = Math.max(0, Math.min(1, targetProgress + delta));
    slider.value = Math.round(targetProgress * 1000);
    scrubVal.innerText = `${(targetProgress * 100).toFixed(0)}%`;
  },
  { passive: false }
);

// Touch drag support
let touchStartY = 0;
window.addEventListener(
  'touchstart',
  (e) => {
    if (e.touches.length > 0) touchStartY = e.touches[0].clientY;
  },
  { passive: true }
);

window.addEventListener(
  'touchmove',
  (e) => {
    if (e.touches.length > 0) {
      const delta = (touchStartY - e.touches[0].clientY) * 0.0018;
      touchStartY = e.touches[0].clientY;
      targetProgress = Math.max(0, Math.min(1, targetProgress + delta));
      slider.value = Math.round(targetProgress * 1000);
      scrubVal.innerText = `${(targetProgress * 100).toFixed(0)}%`;
    }
  },
  { passive: true }
);

// Window resize
window.addEventListener('resize', () => {
  if (activeController && typeof activeController.resize === 'function') {
    activeController.resize();
  }
});

// Render Loop
function tick() {
  const { fps, frameTime } = perf.update();

  // Smooth interpolation towards targetProgress (unless reduced motion)
  if (isReducedMotion) {
    scrollProgress = targetProgress;
  } else {
    scrollProgress += (targetProgress - scrollProgress) * 0.22;
    if (Math.abs(targetProgress - scrollProgress) < 0.001) {
      scrollProgress = targetProgress;
    }
  }

  if (activeController) {
    activeController.render(scrollProgress, isReducedMotion);
  }

  // Update HUD
  const fpsEl = document.getElementById('hud-fps');
  const frameEl = document.getElementById('hud-frame');
  const candEl = document.getElementById('hud-candidate');
  if (fpsEl) {
    fpsEl.innerText = `${fps}`;
    fpsEl.style.color = fps >= 55 ? '#10b981' : fps >= 30 ? '#eab308' : '#ef4444';
  }
  if (frameEl) frameEl.innerText = `${frameTime} ms`;
  if (candEl) candEl.innerText = CANDIDATES[currentCandidateIndex].name.split(' ')[1];

  requestAnimationFrame(tick);
}

// Initial Candidate
initCandidate(0);
requestAnimationFrame(tick);

// Expose state for Playwright automated benchmarking and recording
window.__transitionLab = {
  setCandidate: (idx) => initCandidate(idx),
  setProgress: (p) => {
    targetProgress = Math.max(0, Math.min(1, p));
    scrollProgress = targetProgress;
    slider.value = Math.round(targetProgress * 1000);
    scrubVal.innerText = `${(targetProgress * 100).toFixed(0)}%`;
    if (activeController) activeController.render(scrollProgress, isReducedMotion);
  },
  setReducedMotion: (val) => {
    isReducedMotion = !!val;
    controls.querySelector('#motion-indicator').innerText = `[MOTION: ${isReducedMotion ? 'REDUCED' : 'FULL'}]`;
  },
  getMetrics: () => ({
    fps: perf.fps,
    frameTime: perf.frameTime,
    candidate: CANDIDATES[currentCandidateIndex].name,
    progress: scrollProgress,
  }),
};

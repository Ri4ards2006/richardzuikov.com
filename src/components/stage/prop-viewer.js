import * as THREE from 'three';
import { chip, domeCamera, material, monitor, pcb, rackUnit } from './descent-props';
import { browserFrame, oscilloscope } from './skill-props';

// One low-poly prop in its own small canvas, for the screens (DESIGN.md §16). The home page keeps
// its single shared canvas; a screen replaces the home route, so there is never a second context
// alive next to it.
const PAPER = 0xf4f4f0;
const BUILDERS = { chip, pcb, monitor, rackUnit, domeCamera, oscilloscope, browserFrame };
const TILTS = { chip: 0.7, pcb: 0.7, monitor: 0.12, rackUnit: 0.42, domeCamera: -0.38, oscilloscope: 0.18, browserFrame: -0.12 };
const FRAME_MS = 1000 / 30;
const SPIN_MS = 360;

function build(name) {
  const { geometry, outline, extras = [], tick, aim, scale = 1 } = BUILDERS[name]();
  const group = new THREE.Group();
  group.add(new THREE.Mesh(geometry, material));
  group.add(new THREE.LineSegments(new THREE.EdgesGeometry(outline), new THREE.LineBasicMaterial({ color: PAPER, transparent: true, opacity: 0.32 })));
  extras.forEach((extra) => group.add(extra));
  outline.dispose();
  group.rotation.x = TILTS[name] ?? 0.3;
  group.scale.setScalar(scale);
  return { group, tick, aim };
}

export function createPropViewer(canvas, initial, { still = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  camera.position.set(0, 0, 4.2);
  const pivot = new THREE.Group();
  scene.add(pivot);
  let prop = build(initial);
  pivot.add(prop.group);
  const state = { name: initial, next: initial, spinStart: -1, frame: 0, last: 0, visible: true, disposed: false };
  const pointer = new THREE.Vector3(0, -0.5, 4);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const onPointer = (event) => {
    pointer.set((event.clientX / window.innerWidth - 0.5) * 6, -(event.clientY / window.innerHeight - 0.5) * 4, 4);
  };

  const render = (now) => {
    const time = now / 1000;
    let spin = 0;
    if (state.spinStart >= 0) {
      const p = Math.min(1, (now - state.spinStart) / SPIN_MS);
      if (p >= 0.5 && state.name !== state.next) {
        pivot.remove(prop.group);
        prop.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
        prop = build(state.next);
        pivot.add(prop.group);
        state.name = state.next;
      }
      spin = (1 - (1 - p) ** 3) * Math.PI * 2;
      if (p >= 1) state.spinStart = -1;
    }
    // Idle sway keeps the front toward the viewer, like the Skill prop on the home page.
    pivot.rotation.y = -0.25 + Math.sin(time * 0.45) * 0.35 + spin;
    pivot.position.y = Math.sin(time * 0.8) * 0.04;
    prop.tick?.(time);
    prop.aim?.(pointer);
    renderer.render(scene, camera);
  };

  const tick = (now) => {
    state.frame = requestAnimationFrame(tick);
    if (!state.visible || now - state.last < FRAME_MS - 1) return;
    state.last = now;
    render(now);
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const seen = new IntersectionObserver(([entry]) => { state.visible = entry.isIntersecting; });
  seen.observe(canvas);
  resize();
  if (still) render(0);
  else {
    window.addEventListener('pointermove', onPointer, { passive: true });
    state.frame = requestAnimationFrame(tick);
  }

  return {
    select(name) {
      if (name === state.next || !BUILDERS[name]) return;
      state.next = name;
      state.spinStart = performance.now();
      if (still) {
        state.spinStart = -1;
        pivot.remove(prop.group);
        prop = build(name);
        pivot.add(prop.group);
        state.name = name;
        render(0);
      }
    },
    dispose() {
      state.disposed = true;
      cancelAnimationFrame(state.frame);
      observer.disconnect();
      seen.disconnect();
      window.removeEventListener('pointermove', onPointer);
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
      renderer.dispose();
    },
  };
}

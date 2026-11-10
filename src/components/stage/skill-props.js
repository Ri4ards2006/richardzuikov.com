import * as THREE from 'three';
import { box, chip, flat, material, rackUnit } from './descent-props';

// One low-poly prop beside the Skill panel per category (DESIGN.md §15), swapped with a quick spin.
const PAPER = 0xf4f4f0;
const SPIN_MS = 360;
const SIZE = 1.25;

// A bench oscilloscope: case, screen with a moving trace, knobs.
export function oscilloscope() {
  const parts = [box(1.2, 0.72, 0.6), box(1.24, 0.76, 0.04, 0, 0, 0.3)];
  for (let i = 0; i < 3; i += 1) parts.push(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 8).rotateX(Math.PI / 2).translate(0.4, 0.2 - i * 0.18, 0.34));
  parts.push(box(0.9, 0.06, 0.5, 0, -0.39, 0.02));
  const points = Array.from({ length: 33 }, (_, i) => new THREE.Vector3(-0.42 + i * 0.024, 0, 0.33));
  const trace = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: PAPER }));
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.5).translate(-0.18, 0, 0.322), new THREE.MeshBasicMaterial({ color: 0x0d0d0d }));
  const position = trace.geometry.attributes.position;
  return {
    geometry: flat(parts),
    outline: box(1.2, 0.72, 0.6),
    extras: [screen, trace],
    tick: (time) => {
      for (let i = 0; i < position.count; i += 1) {
        const x = i / (position.count - 1);
        // A square-ish wave sliding across the screen, like the SCK trace in the descent.
        position.setY(i, (Math.sin((x * 3 - time * 0.8) * Math.PI * 2) > 0 ? 0.13 : -0.13) + Math.sin(time * 9 + i) * 0.006);
      }
      position.needsUpdate = true;
    },
  };
}

// A browser frame: window with tab strip, address bar and content blocks.
export function browserFrame() {
  const parts = [box(1.3, 0.86, 0.05), box(1.3, 0.1, 0.07, 0, 0.38, 0.01), box(0.34, 0.08, 0.08, -0.4, 0.46, 0)];
  parts.push(box(0.9, 0.05, 0.07, 0.1, 0.26, 0.02));
  parts.push(box(0.5, 0.32, 0.07, -0.3, 0.0, 0.02), box(0.5, 0.06, 0.07, 0.3, 0.12, 0.02), box(0.42, 0.06, 0.07, 0.26, 0.0, 0.02), box(0.46, 0.06, 0.07, 0.28, -0.12, 0.02));
  parts.push(box(1.1, 0.08, 0.07, 0, -0.3, 0.02));
  // Edges of every block, so tab strip, address bar and content read as lines.
  const geometry = flat(parts);
  return { geometry, outline: geometry.clone() };
}

// Same order as career.domains: lowLevel, infra, hardware, software.
const BUILDERS = [chip, rackUnit, oscilloscope, browserFrame];
const TILTS = [0.7, 0.4, 0.18, -0.12];

export function createSkillProp() {
  const root = new THREE.Group();
  const props = BUILDERS.map((build, index) => {
    const { geometry, outline, extras = [], tick } = build();
    const group = new THREE.Group();
    group.add(new THREE.Mesh(geometry, material));
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(outline), new THREE.LineBasicMaterial({ color: PAPER, transparent: true, opacity: 0.32 })));
    extras.forEach((extra) => group.add(extra));
    outline.dispose();
    group.rotation.x = TILTS[index];
    group.visible = index === 0;
    root.add(group);
    return { group, tick };
  });
  const state = { current: 0, next: 0, spinStart: -1, placed: false };

  return {
    group: root,
    layout(rect, toWorld) {
      state.placed = Boolean(rect && rect.width > 0);
      root.visible = state.placed;
      if (!state.placed) return;
      const world = toWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);
      root.position.set(world.x, world.y, -0.2);
      root.scale.setScalar(SIZE * Math.min(1, rect.width / 260));
    },
    select(index) {
      if (index === state.next) return;
      state.next = index;
      state.spinStart = performance.now();
    },
    update(time, now, camY) {
      if (!state.placed) return;
      const near = Math.abs(root.position.y - camY) < 9;
      root.visible = near;
      if (!near) return;
      let spin = 0;
      if (state.spinStart >= 0) {
        const p = Math.min(1, (now - state.spinStart) / SPIN_MS);
        // Half a turn out, swap at the edge-on moment, half a turn in.
        if (p >= 0.5 && state.current !== state.next) {
          props[state.current].group.visible = false;
          state.current = state.next;
          props[state.current].group.visible = true;
        }
        spin = (1 - (1 - p) ** 3) * Math.PI * 2;
        root.scale.y = root.scale.x * (1 - Math.sin(p * Math.PI) * 0.25);
        if (p >= 1) {
          state.spinStart = -1;
          root.scale.y = root.scale.x;
        }
      }
      // Idle sway keeps the front (screen, bays, address bar) toward the viewer.
      root.rotation.y = -0.25 + Math.sin(time * 0.45) * 0.35 + spin;
      props[state.current].tick?.(time);
    },
  };
}

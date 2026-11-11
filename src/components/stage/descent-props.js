import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PROP_IDS } from './prop-ids';

const PAPER = 0xf4f4f0;
// Below this width there is no gutter beside the panels, so the props are hidden.
const GUTTER_SCREEN = 1024;
// Half the screen footprint of a prop while it rotates, in world units at SIZE 1; plus a clear margin in px.
const PROP_RADIUS = 0.82;
const SPIN = 0.22;
// v8 (§19): 1.5× the v7 size; the slot (16.5rem) is what actually bounds it.
const SIZE = 1.6;
// Depth of the prop plane in world units (the camera sits at z = 10).
const PLANE_Z = -0.4;
// Without a mouse the dome camera pans slowly on its own.
const fallbackAim = new THREE.Vector3();

export const material = new THREE.ShaderMaterial({
  vertexShader: 'varying vec3 vPos; void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vPos=mv.xyz;gl_Position=projectionMatrix*mv;}',
  // The same three hard ink bands as the floating shards.
  fragmentShader: `
    varying vec3 vPos;
    void main(){
      vec3 n=normalize(cross(dFdx(vPos),dFdy(vPos)));
      float l=dot(n,normalize(vec3(-.45,.7,.55)))*.5+.5;
      gl_FragColor=vec4(vec3(l<.42?.07:l<.74?.17:.34),1.);
    }`,
});

export const box = (w, h, d, x = 0, y = 0, z = 0) => new THREE.BoxGeometry(w, h, d).translate(x, y, z);
export const flat = (geometry) => {
  const merged = mergeGeometries(geometry.map((g) => g.toNonIndexed()));
  geometry.forEach((g) => g.dispose());
  return merged;
};

// A QFP package: flat body with gull-wing pins along four sides.
export function chip() {
  const parts = [box(0.72, 0.1, 0.72)];
  for (let i = 0; i < 10; i += 1) {
    const at = -0.3 + i * (0.6 / 9);
    parts.push(box(0.16, 0.02, 0.03, 0.44, -0.04, at), box(0.16, 0.02, 0.03, -0.44, -0.04, at));
    parts.push(box(0.03, 0.02, 0.16, at, -0.04, 0.44), box(0.03, 0.02, 0.16, at, -0.04, -0.44));
  }
  return { geometry: flat(parts), outline: box(0.72, 0.1, 0.72) };
}

// A small populated board: a few ICs, raised traces with 45° bends and a pin header.
export function pcb() {
  const parts = [box(1.3, 0.05, 0.9)];
  parts.push(box(0.36, 0.08, 0.24, -0.3, 0.065, -0.12), box(0.22, 0.07, 0.22, 0.34, 0.06, 0.12), box(0.14, 0.06, 0.3, 0.02, 0.055, 0.24));
  const trace = (length, x, z, angle) => new THREE.BoxGeometry(length, 0.012, 0.024).rotateY(angle).translate(x, 0.031, z);
  parts.push(trace(0.42, -0.02, -0.12, 0), trace(0.2, 0.23, -0.05, -Math.PI / 4), trace(0.3, 0.34, 0.08 - 0.15, Math.PI / 2));
  parts.push(trace(0.34, -0.33, 0.15, 0), trace(0.18, -0.12, 0.22, Math.PI / 4), trace(0.26, -0.5, 0.0, Math.PI / 2));
  parts.push(box(1.0, 0.06, 0.07, 0, 0.055, -0.38));
  for (let i = 0; i < 9; i += 1) parts.push(box(0.025, 0.22, 0.025, -0.44 + i * 0.11, 0.13, -0.38));
  return { geometry: flat(parts), outline: box(1.3, 0.05, 0.9) };
}

// Code lines on a monitor screen: one canvas texture, scrolled through its UV offset.
function codeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, 0, 128, 256);
  ctx.fillStyle = '#cfccc5';
  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let line = 0; line < 21; line += 1) {
    let x = 8 + Math.floor(rand() * 3) * 10;
    const y = 6 + line * 12;
    const words = 1 + Math.floor(rand() * 4);
    for (let w = 0; w < words && x < 116; w += 1) {
      const width = 8 + Math.floor(rand() * 26);
      ctx.fillRect(x, y, Math.min(width, 120 - x), 4);
      x += width + 6;
    }
  }
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(1, 0.55);
  return map;
}

// A small monitor on a stand; the screen scrolls code.
export function monitor() {
  const parts = [box(1.2, 0.78, 0.08, 0, 0.25, 0), box(0.12, 0.36, 0.08, 0, -0.3, -0.06), box(0.62, 0.04, 0.36, 0, -0.48, -0.04)];
  const map = codeTexture();
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.06, 0.64).translate(0, 0.25, 0.041), new THREE.MeshBasicMaterial({ map }));
  return {
    geometry: flat(parts),
    outline: box(1.2, 0.78, 0.08, 0, 0.25, 0),
    extras: [screen],
    tick: (time) => { map.offset.y = (time * 0.06) % 1; },
  };
}

// A 1U rack unit: drive-bay front, vent ribs on top, status LEDs that blink on their own clocks.
export function rackUnit() {
  const parts = [box(1.2, 0.16, 0.8), box(1.24, 0.2, 0.04, 0, 0, 0.41)];
  for (let i = 0; i < 5; i += 1) parts.push(box(0.14, 0.11, 0.02, -0.5 + i * 0.16, 0, 0.435));
  for (let i = 0; i < 7; i += 1) parts.push(box(0.05, 0.02, 0.5, -0.42 + i * 0.14, 0.09, -0.1));
  const leds = Array.from({ length: 4 }, (_, i) => new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.04, 0.02).translate(0.34 + i * 0.07, 0.03, 0.44),
    new THREE.MeshBasicMaterial({ color: PAPER }),
  ));
  const rates = [1.7, 3.1, 0.9, 5.3];
  return {
    geometry: flat(parts),
    outline: box(1.2, 0.16, 0.8),
    extras: leds,
    tick: (time) => leds.forEach((led, i) => {
      const on = Math.sin(time * rates[i] * Math.PI + i * 1.3) + Math.sin(time * 7.7 + i) * 0.35 > -0.1;
      led.material.color.setHex(on ? PAPER : 0x2a2a2a);
    }),
  };
}

// A ceiling dome camera, seen from below: mount, smoked dome, lens with a paper bezel that follows the cursor.
export function domeCamera() {
  const parts = [new THREE.CylinderGeometry(0.42, 0.44, 0.08, 12).translate(0, 0.04, 0), new THREE.CylinderGeometry(0.4, 0.4, 0.05, 12).translate(0, -0.02, 0)];
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2).translate(0, -0.04, 0),
    new THREE.MeshBasicMaterial({ color: 0x1e1e1e, transparent: true, opacity: 0.32, depthWrite: false }),
  );
  shell.renderOrder = 2;
  const rim = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.36, 0.36, 0.001, 16).translate(0, -0.045, 0)),
    new THREE.LineBasicMaterial({ color: PAPER, transparent: true, opacity: 0.5 }),
  );
  const lens = new THREE.Group();
  lens.position.set(0, -0.19, 0);
  lens.add(new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), material));
  lens.add(new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.1, 0.16, 12).rotateX(Math.PI / 2).translate(0, 0, 0.14), material));
  lens.add(new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.016, 6, 16).translate(0, 0, 0.225), new THREE.MeshBasicMaterial({ color: PAPER })));
  lens.add(new THREE.Mesh(new THREE.CircleGeometry(0.062, 14).translate(0, 0, 0.226), new THREE.MeshBasicMaterial({ color: 0x050505 })));
  lens.add(new THREE.Mesh(new THREE.CircleGeometry(0.016, 8).translate(-0.02, 0.02, 0.228), new THREE.MeshBasicMaterial({ color: PAPER })));
  return {
    geometry: flat(parts),
    outline: new THREE.CylinderGeometry(0.42, 0.44, 0.08, 12).translate(0, 0.04, 0),
    extras: [lens, shell, rim],
    spin: false,
    scale: 1.45,
    aim: (point) => lens.lookAt(point),
  };
}

// Fixed map (DESIGN.md §18): 01 PCB tile · 02 chip · 03 monitor · 04 rack unit · 05 security camera.
// `id` is the data-slot of the prop's reserved gutter slot and the data-prop of its DOM proxy.
const PROPS = [
  { id: 'pcb', panel: 0, build: pcb, tilt: 0.7 },
  { id: 'chip', panel: 1, build: chip, tilt: 0.62 },
  { id: 'monitor', panel: 2, build: monitor, tilt: 0.12 },
  { id: 'rack', panel: 3, build: rackUnit, tilt: 0.42 },
  { id: 'dome', panel: 4, build: domeCamera, tilt: -0.38 },
];
if (PROPS.some(({ id }) => !PROP_IDS.includes(id))) throw new Error('descent props: unknown id');

// Same clamp as the panels' --depth (scene.js), so a prop moves exactly with its panel.
export const DEPTH_LIMIT = 1.6;
const clampDepth = (depth) => Math.max(-DEPTH_LIMIT, Math.min(DEPTH_LIMIT, depth));
// Idle drift in px: a pure function of time.
const IDLE_X = 3;
const IDLE_Y = 6;
// Kick: critically damped spring (target 0) driven by the clamped scroll velocity; back within ~600 ms.
const KICK_OMEGA = 10;
const KICK_GAIN = 0.6;
const KICK_VELOCITY_LIMIT = 4000;

export function createDescentProps() {
  const group = new THREE.Group();
  const projected = new THREE.Vector3();
  const items = PROPS.map(({ id, panel, build, tilt }, index) => {
    const { geometry, outline, extras = [], tick, aim, spin = true, scale = 1 } = build();
    const root = new THREE.Group();
    root.add(new THREE.Mesh(geometry, material));
    root.add(new THREE.LineSegments(new THREE.EdgesGeometry(outline), new THREE.LineBasicMaterial({ color: PAPER, transparent: true, opacity: 0.32 })));
    extras.forEach((extra) => root.add(extra));
    outline.dispose();
    // Five small props: never frustum-culled, so a stale bounding sphere can't drop one (v7).
    root.traverse((node) => { node.frustumCulled = false; });
    root.rotation.x = tilt;
    root.visible = false;
    group.add(root);
    return { id, root, panel, phase: index * 2.1, tick, aim, spin, scale, anchor: null, depthAt: 0, parallax: 0, radius: 0, kick: 0, kickV: 0, proxy: null, shown: null };
  });
  const view = { w: 1, h: 1, k: 0.01 };

  // Viewport px -> the world point on the prop plane (z = PLANE_Z) that the camera draws at that pixel.
  // Through the actual camera of this frame, so neither its damping nor perspective moves a prop off its slot.
  const ray = new THREE.Vector3();
  const onPlane = (camera, sx, sy, out) => {
    ray.set((sx / view.w) * 2 - 1, 1 - (sy / view.h) * 2, 0.5).unproject(camera).sub(camera.position);
    return out.copy(camera.position).addScaledVector(ray, (PLANE_Z - camera.position.z) / ray.z);
  };

  return {
    group,
    // slots: one per prop, { id, rect, panelRect, parallax } in page px with transforms ignored. The slot is
    // a reserved gutter cell next to its panel (Stage.jsx), so a prop can't touch text by construction.
    // Visibility depends on the breakpoint only: >= 1024 px all five, below none (DESIGN.md §18).
    layout({ slots, viewportWidth, viewportHeight, k, proxies = [] }) {
      view.w = viewportWidth;
      view.h = viewportHeight;
      view.k = k;
      const shown = viewportWidth >= GUTTER_SCREEN;
      items.forEach((item) => {
        item.proxy = proxies.find((node) => node.dataset.prop === item.id) ?? null;
        const slot = slots.find((entry) => entry.id === item.id);
        item.anchor = shown && slot ? { x: slot.rect.left + slot.rect.width / 2, y: slot.rect.top + slot.rect.height / 2 } : null;
        if (!item.anchor) return;
        // The prop takes its panel's depth and parallax, i.e. exactly the panel's CSS translateY.
        item.depthAt = slot.panelRect.top + slot.panelRect.height / 2;
        item.parallax = slot.parallax;
        // Drawn size: the prop's own, shrunk to fit its slot if needed.
        const scale = Math.min(SIZE * item.scale, (Math.min(slot.rect.width, slot.rect.height) / 2) * k / PROP_RADIUS);
        item.radius = (PROP_RADIUS * scale) / k;
        item.root.scale.setScalar(scale);
      });
    },
    // pos = slot(layout) + panel parallax(scroll) + idle(time) + kick. Nothing is read back from the meshes.
    update({ time, dt, scroll, velocity, camera, aimAt }) {
      const force = Math.max(-KICK_VELOCITY_LIMIT, Math.min(KICK_VELOCITY_LIMIT, velocity)) * KICK_GAIN;
      // Semi-implicit Euler in small steps, so long frames stay stable.
      const steps = Math.max(1, Math.ceil(dt / 0.016));
      const h = dt / steps;
      camera?.updateMatrixWorld();
      items.forEach((item) => {
        for (let i = 0; i < steps; i += 1) {
          item.kickV += (force - KICK_OMEGA * KICK_OMEGA * item.kick - 2 * KICK_OMEGA * item.kickV) * h;
          item.kick += item.kickV * h;
        }
        item.root.visible = Boolean(item.anchor);
        if (!item.anchor) {
          this.sync(item, null);
          return;
        }
        // Viewport px: the slot's rest position at this scroll, then idle drift and kick on top.
        const restY = item.anchor.y - scroll + clampDepth((item.depthAt - scroll - view.h / 2) / view.h) * item.parallax;
        item.rest = { x: item.anchor.x, y: restY };
        if (!camera) return;
        const x = item.anchor.x + Math.cos(time * 0.7 + item.phase) * IDLE_X;
        const y = restY + Math.sin(time * 0.9 + item.phase) * IDLE_Y + item.kick;
        onPlane(camera, x, y, item.root.position);
        if (item.spin) item.root.rotation.y = item.phase + time * SPIN;
        else item.root.rotation.y = Math.sin(time * 0.3) * 0.2;
        item.tick?.(time);
        if (item.aim) item.aim(aimAt ?? fallbackAim.set(item.root.position.x + Math.sin(time * 0.5) * 2, item.root.position.y - 1, 4));
        this.sync(item, camera);
      });
    },
    // Test hook only (scene.js, ?e2e=1 or dev): each mesh's world position projected with the camera
    // that just rendered it, in viewport px. Independent of the DOM proxies.
    screenPositions(camera) {
      const world = new THREE.Vector3();
      const frustum = new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
      return items.map((item) => {
        const mesh = item.root.children[0];
        mesh.updateWorldMatrix(true, false);
        const inFrustum = frustum.intersectsObject(mesh);
        let top = item.root;
        while (top.parent) top = top.parent;
        item.root.getWorldPosition(world).project(camera);
        return {
          id: item.id,
          visible: item.root.visible,
          inFrustum,
          scene: top.isScene ? top.name || 'scene' : 'detached',
          // Rest position (slot + parallax, no idle/kick) in viewport px; the slot centre at this scroll.
          rest: item.rest && item.anchor ? { x: Number(item.rest.x.toFixed(2)), y: Number(item.rest.y.toFixed(2)) } : null,
          x: Number(((world.x + 1) / 2 * view.w).toFixed(2)),
          y: Number(((1 - world.y) / 2 * view.h).toFixed(2)),
        };
      });
    },
    // Mirrors a prop onto its DOM proxy in viewport px: transform = where it is drawn now,
    // data-rest = its rest position (anchor + parallax), data-kick = the spring offset.
    sync(item, camera) {
      const node = item.proxy;
      if (!node) return;
      if (!camera) {
        if (item.shown !== false) {
          node.dataset.visible = 'false';
          item.shown = false;
        }
        return;
      }
      projected.copy(item.root.position).project(camera);
      const sx = (projected.x + 1) / 2 * view.w;
      const sy = (1 - projected.y) / 2 * view.h;
      const rx = item.rest.x;
      const ry = item.rest.y;
      const size = item.radius * 2;
      if (item.shown !== true) {
        node.dataset.visible = 'true';
        item.shown = true;
      }
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
      node.style.transform = `translate(${(sx - size / 2).toFixed(1)}px, ${(sy - size / 2).toFixed(1)}px)`;
      node.dataset.rest = `${rx.toFixed(1)},${ry.toFixed(1)}`;
      node.dataset.kick = item.kick.toFixed(2);
    },
  };
}

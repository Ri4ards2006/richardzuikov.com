import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PROP_IDS } from './prop-ids';

const PAPER = 0xf4f4f0;
// Below this width there is no gutter beside the panels, so the props are hidden.
const GUTTER_SCREEN = 1024;
// Half the screen footprint of a prop while it rotates, in world units at SIZE 1; plus a clear margin in px.
const PROP_RADIUS = 0.82;
const GUTTER_MARGIN = 24;
const SPIN = 0.22;
const SIZE = 1.05;
const CULL_DISTANCE = 9;
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

// Each prop belongs to one descent panel, by panel index. `id` is the data-prop of its DOM proxy.
const PROPS = [
  { panel: 0, build: chip, tilt: 0.62 },
  { panel: 1, build: pcb, tilt: 0.7 },
  { panel: 2, build: monitor, tilt: 0.12 },
  { panel: 3, build: rackUnit, tilt: 0.42 },
  { panel: 4, build: domeCamera, tilt: -0.38 },
].map((prop) => ({ ...prop, id: PROP_IDS[prop.panel] }));

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
// Depths of the prop's panel swept by the collision check (every scroll position where it can be on screen).
const SWEEP = Array.from({ length: 33 }, (_, i) => -DEPTH_LIMIT + (i * DEPTH_LIMIT) / 16);

const PARALLAX_CANDIDATES = [0, 40, -60, 90, -130, 150];

const overlaps = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
// Overlap that is actually on screen; top/bottom of both boxes are viewport px here.
const overlapsOnScreen = (a, b, viewportHeight) => overlaps(a, b) && Math.max(a.top, b.top) < viewportHeight && Math.min(a.bottom, b.bottom) > 0;

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
    root.rotation.x = tilt;
    root.visible = false;
    group.add(root);
    return { id, root, panel, phase: index * 2.1, tick, aim, spin, scale, anchor: null, parallax: 0, radius: 0, kick: 0, kickV: 0, proxy: null, shown: null };
  });
  const view = { w: 1, h: 1, k: 0.01 };

  // Page px -> world units for a camera that sits at scroll (camera y = -scroll * k).
  const worldX = (x) => (x - view.w / 2) * view.k;
  const worldY = (y) => -(y - view.h / 2) * view.k;

  return {
    group,
    // panels: layout rects (page px, transforms ignored) with their CSS parallax in px.
    // obstacles: the same for every text block and heading. proxies: DOM nodes with data-prop.
    // Anchors come only from layout, never from where a prop currently is (DESIGN.md §17).
    layout({ panels, obstacles = [], viewportWidth, viewportHeight, k, proxies = [] }) {
      view.w = viewportWidth;
      view.h = viewportHeight;
      view.k = k;
      const narrow = viewportWidth < GUTTER_SCREEN;
      items.forEach((item) => {
        item.proxy = proxies.find((node) => node.dataset.prop === item.id) ?? null;
        item.anchor = null;
        const panel = panels[item.panel];
        if (!panel || narrow) return;
        const { rect } = panel;
        const radius = (PROP_RADIUS * SIZE * item.scale) / k;
        const onRight = rect.left + rect.width / 2 > viewportWidth / 2;
        const gutterStart = onRight ? 0 : rect.left + rect.width;
        const gutterEnd = onRight ? rect.left : viewportWidth;
        if (gutterEnd - gutterStart < radius * 2 + GUTTER_MARGIN * 2) return;
        const x = (gutterStart + gutterEnd) / 2;
        const y = rect.top + rect.height / 2;
        // Collision on the final positions: sweep the panel depths at which the prop is on screen and
        // shift every obstacle by its parallax relative to the prop's.
        const reach = radius + GUTTER_MARGIN;
        // The prop's own parallax: its panel's if that stays clear of the neighbouring column (near and far
        // panels drift ~280 px apart), else the first clear constant. Still a pure function of scroll.
        const collides = (parallax) => SWEEP.some((depth) => {
          // Scroll position at which the prop's panel has this depth; everything below is in viewport px.
          const scroll = y - viewportHeight / 2 - depth * viewportHeight;
          const own = depth * parallax;
          const box = { left: x - reach, right: x + reach, top: y + own - reach - scroll, bottom: y + own + reach - scroll };
          return obstacles.some((o) => {
            const dy = clampDepth(depth + (o.rect.top + o.rect.height / 2 - y) / viewportHeight) * o.parallax;
            const top = o.rect.top + dy - scroll;
            return overlapsOnScreen(box, { left: o.rect.left, right: o.rect.left + o.rect.width, top, bottom: top + o.rect.height }, viewportHeight);
          });
        });
        const parallax = [panel.parallax, ...PARALLAX_CANDIDATES].find((candidate) => !collides(candidate));
        if (parallax === undefined) return;
        item.anchor = { x, y };
        item.parallax = parallax;
        item.radius = radius;
        item.root.scale.setScalar(SIZE * item.scale);
      });
    },
    // pos = anchor(layout) + parallax(scroll) + idle(time) + kick. Nothing is read back from the meshes.
    update({ time, dt, scroll, velocity, camera, camY, aimAt }) {
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
        if (!item.anchor) {
          item.root.visible = false;
          this.sync(item, null);
          return;
        }
        const rest = item.anchor.y + clampDepth((item.anchor.y - scroll - view.h / 2) / view.h) * item.parallax;
        const x = item.anchor.x + Math.cos(time * 0.7 + item.phase) * IDLE_X;
        const y = rest + Math.sin(time * 0.9 + item.phase) * IDLE_Y + item.kick;
        item.root.position.set(worldX(x), worldY(y), -0.4);
        const near = Math.abs(item.root.position.y - camY) < CULL_DISTANCE;
        item.root.visible = near;
        if (!near) {
          this.sync(item, null);
          return;
        }
        if (item.spin) item.root.rotation.y = item.phase + time * SPIN;
        else item.root.rotation.y = Math.sin(time * 0.3) * 0.2;
        item.tick?.(time);
        if (item.aim) item.aim(aimAt ?? fallbackAim.set(item.root.position.x + Math.sin(time * 0.5) * 2, item.root.position.y - 1, 4));
        this.sync(item, camera, worldX(item.anchor.x), worldY(rest));
      });
    },
    // Test hook only (scene.js, ?e2e=1 or dev): each mesh's world position projected with the camera
    // that just rendered it, in viewport px. Independent of the DOM proxies.
    screenPositions(camera) {
      const world = new THREE.Vector3();
      return items.map((item) => {
        item.root.getWorldPosition(world).project(camera);
        return {
          id: item.id,
          visible: item.root.visible,
          x: Number(((world.x + 1) / 2 * view.w).toFixed(1)),
          y: Number(((1 - world.y) / 2 * view.h).toFixed(1)),
        };
      });
    },
    // Mirrors a prop onto its DOM proxy in viewport px: transform = where it is drawn now,
    // data-rest = its rest position (anchor + parallax), data-kick = the spring offset.
    sync(item, camera, restX, restY) {
      const node = item.proxy;
      if (!node) return;
      if (!camera) {
        if (item.shown !== false) {
          node.dataset.visible = 'false';
          item.shown = false;
        }
        return;
      }
      const toScreen = (x, y) => {
        projected.set(x, y, -0.4).project(camera);
        return [(projected.x + 1) / 2 * view.w, (1 - projected.y) / 2 * view.h];
      };
      const [sx, sy] = toScreen(item.root.position.x, item.root.position.y);
      const [rx, ry] = toScreen(restX, restY);
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

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const PAPER = 0xf4f4f0;
const SMALL_SCREEN = 768;
const SPIN = 0.22;
const SIZE = 1.05;
const SMALL_SIZE = 0.42;
const CULL_DISTANCE = 9;
// Without a mouse the dome camera pans slowly on its own.
const fallbackAim = new THREE.Vector3();

const material = new THREE.ShaderMaterial({
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

const box = (w, h, d, x = 0, y = 0, z = 0) => new THREE.BoxGeometry(w, h, d).translate(x, y, z);
const flat = (geometry) => {
  const merged = mergeGeometries(geometry.map((g) => g.toNonIndexed()));
  geometry.forEach((g) => g.dispose());
  return merged;
};

// A QFP package: flat body with gull-wing pins along four sides.
function chip() {
  const parts = [box(0.72, 0.1, 0.72)];
  for (let i = 0; i < 10; i += 1) {
    const at = -0.3 + i * (0.6 / 9);
    parts.push(box(0.16, 0.02, 0.03, 0.44, -0.04, at), box(0.16, 0.02, 0.03, -0.44, -0.04, at));
    parts.push(box(0.03, 0.02, 0.16, at, -0.04, 0.44), box(0.03, 0.02, 0.16, at, -0.04, -0.44));
  }
  return { geometry: flat(parts), outline: box(0.72, 0.1, 0.72) };
}

// A small populated board: a few ICs, raised traces with 45° bends and a pin header.
function pcb() {
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
function monitor() {
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
function rackUnit() {
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
function domeCamera() {
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

// Each prop belongs to one descent panel, by panel index.
const PROPS = [
  { panel: 0, build: chip, tilt: 0.62 },
  { panel: 1, build: pcb, tilt: 0.7 },
  { panel: 2, build: monitor, tilt: 0.12 },
  { panel: 3, build: rackUnit, tilt: 0.42 },
  { panel: 4, build: domeCamera, tilt: -0.38 },
];

export function createDescentProps() {
  const group = new THREE.Group();
  const items = PROPS.map(({ panel, build, tilt }, index) => {
    const { geometry, outline, extras = [], tick, aim, spin = true, scale = 1 } = build();
    const root = new THREE.Group();
    root.add(new THREE.Mesh(geometry, material));
    root.add(new THREE.LineSegments(new THREE.EdgesGeometry(outline), new THREE.LineBasicMaterial({ color: PAPER, transparent: true, opacity: 0.32 })));
    extras.forEach((extra) => root.add(extra));
    outline.dispose();
    root.rotation.x = tilt;
    group.add(root);
    return { root, panel, phase: index * 2.1, tick, aim, spin, scale };
  });

  return {
    group,
    // rects: viewport-size page rects of the panels. toWorld maps a page point to world units.
    layout(rects, viewportWidth, toWorld) {
      const small = viewportWidth < SMALL_SCREEN;
      items.forEach((item) => {
        const rect = rects[item.panel];
        item.root.visible = Boolean(rect);
        if (!rect) return;
        let x;
        let y;
        if (small) {
          // No free side on a phone: the prop sits in the gutter above its panel.
          x = viewportWidth * 0.76;
          y = rect.top - 52;
        } else {
          const onRight = rect.left + rect.width / 2 > viewportWidth / 2;
          const free = onRight ? rect.left : viewportWidth - (rect.left + rect.width);
          const offset = Math.min(300, free / 2);
          x = onRight ? rect.left - offset : rect.left + rect.width + offset;
          y = rect.top + rect.height / 2;
        }
        const world = toWorld(x, y);
        item.root.position.set(world.x, world.y, -0.4);
        item.root.scale.setScalar((small ? SMALL_SIZE : SIZE) * item.scale);
      });
    },
    // aimAt: world point the dome camera's lens looks at (the cursor), or null.
    update(time, camY, aimAt) {
      items.forEach((item) => {
        const near = Math.abs(item.root.position.y - camY) < CULL_DISTANCE;
        item.root.children.forEach((child) => { child.visible = near; });
        if (!near) return;
        if (item.spin) item.root.rotation.y = item.phase + time * SPIN;
        else item.root.rotation.y = Math.sin(time * 0.3) * 0.2;
        item.tick?.(time);
        if (item.aim) item.aim(aimAt ?? fallbackAim.set(item.root.position.x + Math.sin(time * 0.5) * 2, item.root.position.y - 1, 4));
      });
    },
  };
}

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const PAPER = 0xf4f4f0;
const SMALL_SCREEN = 768;
const SPIN = 0.22;
const SIZE = 1.05;
const SMALL_SIZE = 0.42;
const CULL_DISTANCE = 9;

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

// A radial electrolytic capacitor on two legs.
function capacitor() {
  const can = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8);
  const parts = [can.clone().translate(0, 0.15, 0), new THREE.CylinderGeometry(0.24, 0.3, 0.05, 8).translate(0, 0.575, 0), box(0.03, 0.42, 0.03, 0.12, -0.46, 0), box(0.03, 0.42, 0.03, -0.12, -0.46, 0)];
  return { geometry: flat(parts), outline: can.translate(0, 0.15, 0) };
}

// A 1U server blade with a drive-bay front and vent ribs on top.
function blade() {
  const parts = [box(1.2, 0.16, 0.8), box(1.24, 0.2, 0.04, 0, 0, 0.41)];
  for (let i = 0; i < 6; i += 1) parts.push(box(0.14, 0.11, 0.02, -0.46 + i * 0.16, 0, 0.435));
  for (let i = 0; i < 7; i += 1) parts.push(box(0.05, 0.02, 0.5, -0.42 + i * 0.14, 0.09, -0.1));
  return { geometry: flat(parts), outline: box(1.2, 0.16, 0.8) };
}

// Each prop belongs to one descent panel, by panel index.
const PROPS = [{ panel: 0, build: chip, tilt: 0.62 }, { panel: 1, build: capacitor, tilt: 0.28 }, { panel: 3, build: blade, tilt: 0.42 }];

export function createDescentProps() {
  const group = new THREE.Group();
  const items = PROPS.map(({ panel, build, tilt }, index) => {
    const { geometry, outline } = build();
    const root = new THREE.Group();
    root.add(new THREE.Mesh(geometry, material));
    root.add(new THREE.LineSegments(new THREE.EdgesGeometry(outline), new THREE.LineBasicMaterial({ color: PAPER, transparent: true, opacity: 0.32 })));
    outline.dispose();
    root.rotation.x = tilt;
    group.add(root);
    return { root, panel, phase: index * 2.1 };
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
        item.root.scale.setScalar(small ? SMALL_SIZE : SIZE);
      });
    },
    update(time, camY) {
      items.forEach((item) => {
        const near = Math.abs(item.root.position.y - camY) < CULL_DISTANCE;
        item.root.children.forEach((child) => { child.visible = near; });
        if (near) item.root.rotation.y = item.phase + time * SPIN;
      });
    },
  };
}

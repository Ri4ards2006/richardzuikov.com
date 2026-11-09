import * as THREE from 'three';
import { makeCanvas, texture } from '../utils';
import { paint } from './geometry';

const LENGTH = 3.05;

function chromeMatcap() {
  const size = 128;
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const fill = ctx.createLinearGradient(0, 0, 0, size);
  [[0, '#1b1b1d'], [0.32, '#efeae2'], [0.44, '#55534f'], [0.62, '#141312'], [0.82, '#c9722c'], [1, '#ffd9a0']]
    .forEach(([stop, color]) => fill.addColorStop(stop, color));
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, size, size);
  return texture(canvas);
}

function lathe(points, radial) {
  return new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), radial);
}

function ribbed(from, to, pitch, outer, inner) {
  const points = [];
  for (let y = from, i = 0; y < to; y += pitch, i += 1) points.push([i % 2 ? inner : outer, y]);
  return points;
}

// Built along +Y with the tip at the origin. Lathe profiles need y rising so normals face out.
export function buildIron(q) {
  const steel = [
    // conical tip
    [0.001, 0], [0.018, 0.03], [0.06, 0.42], [0.042, 0.45],
    // thin shaft
    [0.03, 0.47], [0.03, 1.42],
    // heat-sink sleeve
    [0.09, 1.45], ...ribbed(1.47, 2.03, 0.05, 0.102, 0.074), [0.098, 2.05],
    // collar
    [0.122, 2.06], [0.122, 2.13],
  ];
  const rubber = [
    [0.1, 2.13], [0.112, 2.2],
    ...ribbed(2.22, 2.9, 0.046, 0.138, 0.114),
    [0.126, 2.92], [0.116, 3.0], [0.08, 3.04], [0.001, LENGTH],
  ];

  const metalGeometry = paint(lathe(steel, q.radial), (p, c) => {
    // The tip takes on heat colour where it enters the fire.
    const heat = 1 - THREE.MathUtils.smoothstep(p.y, 0, 0.75);
    c.setRGB(1, 1 - heat * 0.32, 1 - heat * 0.62);
  });
  const metalMaterial = new THREE.MeshMatcapMaterial({ matcap: chromeMatcap(), vertexColors: true });
  const metal = new THREE.Mesh(metalGeometry, metalMaterial);

  const grip = new THREE.Mesh(
    lathe(rubber, q.radial),
    new THREE.MeshStandardMaterial({ color: 0x2b2a29, roughness: 0.62 }),
  );

  const iron = new THREE.Group();
  iron.add(metal, grip);
  iron.position.set(0.1, 0.22, 0.62);
  iron.rotation.set(0.06, 0, -0.52);
  return { iron, matcap: metalMaterial.matcap };
}

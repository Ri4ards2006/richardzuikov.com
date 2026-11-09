import * as THREE from 'three';
import { hash } from '../utils';
import { merge, paint } from './geometry';

// Displaced by position, not by vertex index, so the shared corners of the icosahedron stay welded.
function displaced(detail, seed) {
  const geometry = new THREE.IcosahedronGeometry(1, detail);
  const position = geometry.attributes.position;
  const p = new THREE.Vector3();
  const s = seed * 17;
  for (let i = 0; i < position.count; i += 1) {
    p.fromBufferAttribute(position, i);
    const bump = Math.sin(p.x * 2.1 + s) + Math.sin(p.y * 3.3 + s * 1.7) * 0.7 + Math.sin(p.z * 2.7 + s * 2.3) * 0.6;
    p.multiplyScalar(1 + bump * 0.13);
    position.setXYZ(i, p.x, p.y, p.z);
  }
  return geometry;
}

function stone(q, seed, x, z, size) {
  const geometry = displaced(q.stoneDetail, seed);
  const sy = size * (0.55 + hash(seed + 2) * 0.5);
  geometry.scale(size * (0.9 + hash(seed + 1) * 0.55), sy, size * (0.8 + hash(seed + 3) * 0.4));
  geometry.rotateY(hash(seed + 4) * Math.PI * 2);
  geometry.rotateZ((hash(seed + 5) - 0.5) * 0.35);
  geometry.translate(x, sy * 0.38, z);

  const tone = 0.42 + hash(seed + 6) * 0.5;
  const warm = hash(seed + 7) * 0.09;
  return paint(geometry, (p, c) => {
    // Soot on the side facing the fire.
    const reach = Math.hypot(p.x, p.z);
    const soot = 0.35 + 0.65 * THREE.MathUtils.smoothstep(reach, 1.2, 1.75);
    c.setRGB((tone + warm) * soot, tone * soot, (tone - warm) * soot);
  });
}

export function buildStones(q) {
  const parts = [];
  for (let i = 0; i < q.ringStones; i += 1) {
    const a = ((i + (hash(i + 30) - 0.5) * 0.55) / q.ringStones) * Math.PI * 2;
    const r = 1.52 + (hash(i + 50) - 0.5) * 0.2;
    // Mostly mid-sized stones with a few large and small ones breaking the rhythm.
    const roll = hash(i + 70);
    const size = roll > 0.8 ? 0.33 + hash(i) * 0.08 : roll < 0.25 ? 0.13 + hash(i) * 0.05 : 0.2 + hash(i) * 0.07;
    parts.push(stone(q, i + 1, Math.cos(a) * r, Math.sin(a) * r, size));
  }
  for (let i = 0; i < q.strayStones; i += 1) {
    const a = hash(i + 110) * Math.PI * 2;
    const r = 2 + hash(i + 130) * 1.3;
    parts.push(stone(q, i + 200, Math.cos(a) * r, Math.sin(a) * r, 0.06 + hash(i + 150) * 0.11));
  }
  return new THREE.Mesh(
    merge(parts),
    new THREE.MeshStandardMaterial({ color: 0x8c8a85, roughness: 0.95, flatShading: true, vertexColors: true }),
  );
}

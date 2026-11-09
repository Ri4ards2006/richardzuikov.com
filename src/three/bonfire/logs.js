import * as THREE from 'three';
import { hash, makeCanvas, texture } from '../utils';
import { merge } from './geometry';

function barkTextures() {
  const w = 256;
  const h = 128;
  const base = makeCanvas(w, h);
  const baseCtx = base.getContext('2d');
  const glow = makeCanvas(w, h);
  const glowCtx = glow.getContext('2d');
  baseCtx.fillStyle = '#16120e';
  baseCtx.fillRect(0, 0, w, h);
  glowCtx.fillStyle = '#000';
  glowCtx.fillRect(0, 0, w, h);
  // Charring splits along the grain; the splits glow.
  for (let i = 0; i < 46; i += 1) {
    const x = hash(i) * w;
    const y = hash(i + 60) * h;
    const length = 14 + hash(i + 120) * 50;
    baseCtx.fillStyle = '#060504';
    baseCtx.fillRect(x, y, 3, length);
    if (hash(i + 180) > 0.42) {
      glowCtx.fillStyle = '#fff';
      glowCtx.fillRect(x + 1, y, 1.5, length);
    }
  }
  return { base: texture(base), glow: texture(glow) };
}

const up = new THREE.Vector3(0, 1, 0);

function log(radius, from, to, seed) {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const axis = end.clone().sub(start);
  const geometry = new THREE.CylinderGeometry(radius * 0.8, radius, axis.length(), 7, 5);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    const y = position.getY(i);
    const a = Math.atan2(position.getZ(i), position.getX(i));
    const k = 1 + Math.sin(y * 7 + seed) * 0.08 + Math.sin(a * 3 + seed * 2) * 0.1;
    position.setX(i, position.getX(i) * k);
    position.setZ(i, position.getZ(i) * k);
  }
  geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, axis.clone().normalize()));
  geometry.translate((start.x + end.x) / 2, (start.y + end.y) / 2, (start.z + end.z) / 2);
  return geometry;
}

const LOGS = [
  [0.13, [-0.86, 0.06, -0.28], [0.12, 1.42, 0]],
  [0.12, [0.84, 0.06, -0.42], [-0.1, 1.5, -0.05]],
  [0.14, [0.08, 0.06, -0.92], [0.02, 1.34, 0.12]],
  [0.11, [-1.12, 0.12, 0.34], [0.46, 0.2, -0.56]],
  [0.1, [1.08, 0.12, 0.2], [-0.42, 0.26, -0.64]],
];

export function buildLogs(q) {
  const { base, glow } = barkTextures();
  const parts = LOGS.slice(0, q.logs).map(([radius, from, to], i) => log(radius, from, to, i + 1));
  const material = new THREE.MeshStandardMaterial({
    map: base,
    emissiveMap: glow,
    emissive: 0xff6a00,
    emissiveIntensity: 1.2,
    roughness: 1,
    flatShading: true,
  });
  return { logs: new THREE.Mesh(merge(parts), material), glow };
}

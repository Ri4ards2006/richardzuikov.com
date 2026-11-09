import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Merges to one draw call. Attributes must match, so every part is non-indexed.
export function merge(parts) {
  const flat = parts.map((part) => (part.index ? part.toNonIndexed() : part));
  const merged = mergeGeometries(flat, false);
  parts.forEach((part) => part.dispose());
  flat.forEach((part) => part.dispose());
  return merged;
}

export function paint(geometry, colorAt) {
  const position = geometry.attributes.position;
  const colors = new Float32Array(position.count * 3);
  const p = new THREE.Vector3();
  const c = new THREE.Color();
  for (let i = 0; i < position.count; i += 1) {
    p.fromBufferAttribute(position, i);
    colorAt(p, c);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}

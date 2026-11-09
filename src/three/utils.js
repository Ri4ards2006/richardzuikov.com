import * as THREE from 'three';

export const smooth = (v) => v * v * (3 - 2 * v);

export const hash = (n) => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

export function makeCanvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

export function texture(canvas) {
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return map;
}

export function pointsMaterial(vertexShader, fragmentShader, uniforms, blending = THREE.NormalBlending) {
  return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending, uniforms, vertexShader, fragmentShader });
}

export function seededPoints(count, material) {
  const seeds = new Float32Array(count * 3);
  for (let i = 0; i < seeds.length; i += 1) seeds[i] = Math.random();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return points;
}

// Frees the geometries, materials and material maps of a subtree.
export function disposeObject(root) {
  root.traverse((object) => {
    object.geometry?.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      material?.map?.dispose();
      material?.dispose();
    });
  });
}

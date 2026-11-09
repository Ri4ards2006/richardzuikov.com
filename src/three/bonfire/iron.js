import * as THREE from 'three';
import { makeCanvas, texture } from '../utils';
import { paint } from './geometry';

// Professional electronics soldering iron (DESIGN.md §7 Card 05 & §13)
// Features: fine conical tip, slim barrel, 6-sided hex retaining nut, flanged finger-guard disc,
// thick ribbed ergonomic grip, and flexible strain-relief stub (no cable).

function chromeMatcap() {
  const size = 128;
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const fill = ctx.createLinearGradient(0, 0, 0, size);
  [[0, '#1c1c1f'], [0.28, '#faf7f2'], [0.42, '#706e6a'], [0.6, '#181716'], [0.8, '#d47c32'], [1, '#ffe0a8']]
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
  for (let y = from, i = 0; y < to; y += pitch, i += 1) {
    points.push([i % 2 ? inner : outer, y]);
  }
  return points;
}

export function buildIron(q) {
  const radial = q.radial || 20;

  // 1. Metal Tip & Barrel profile
  // Lathe coordinates [radius, y] starting at tip apex y=0
  const tipProfile = [
    [0.002, 0.0],
    [0.010, 0.02],
    [0.026, 0.18],  // fine conical needle tip
    [0.028, 0.22],
    [0.024, 0.23],  // tip collar step
    [0.028, 0.25],  // stainless heating barrel
    [0.028, 0.62],
    [0.032, 0.63],
  ];

  const metalGeo = paint(lathe(tipProfile, radial), (p, c) => {
    // Thermal blue/amber annealing gradient where tip enters 350°C heat
    const heat = 1 - THREE.MathUtils.smoothstep(p.y, 0, 0.35);
    c.setRGB(1, 1 - heat * 0.35, 1 - heat * 0.72);
  });
  const metalMat = new THREE.MeshMatcapMaterial({ matcap: chromeMatcap(), vertexColors: true });
  const metalMesh = new THREE.Mesh(metalGeo, metalMat);

  // 2. Hex retaining nut at base of metal barrel
  const hexNutGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.07, 6);
  hexNutGeo.translate(0, 0.665, 0);
  const hexNutMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.9,
    roughness: 0.28,
  });
  const hexNutMesh = new THREE.Mesh(hexNutGeo, hexNutMat);

  // 3. Iconic Finger-Guard Disc (protective flanged rim between barrel and grip)
  const guardProfile = [
    [0.042, 0.70],
    [0.125, 0.72],
    [0.138, 0.745], // outer flange rim
    [0.138, 0.77],
    [0.095, 0.79], // step to grip
  ];
  const guardGeo = lathe(guardProfile, radial);
  const guardMat = new THREE.MeshStandardMaterial({
    color: 0x1f1f1e,
    roughness: 0.8,
    metalness: 0.1,
  });
  const guardMesh = new THREE.Mesh(guardGeo, guardMat);

  // 4. Thick Ribbed Ergonomic Grip
  // Ribbed rubber sleeve with tactile finger grooves
  const gripProfile = [
    [0.095, 0.79],
    [0.108, 0.82],
    ...ribbed(0.84, 1.42, 0.042, 0.114, 0.098),
    [0.106, 1.44],
    [0.096, 1.50],
    [0.088, 1.54],
  ];
  const gripGeo = lathe(gripProfile, radial);
  const gripMat = new THREE.MeshStandardMaterial({
    color: 0x242423,
    roughness: 0.88,
    metalness: 0.05,
  });
  const gripMesh = new THREE.Mesh(gripGeo, gripMat);

  // 5. Short Molded Strain-Relief Stub at the end (strictly NO cable)
  const bootProfile = [
    [0.088, 1.54],
    [0.082, 1.57],
    [0.068, 1.62],
    [0.062, 1.66],
    [0.052, 1.71],
    [0.046, 1.76],
    [0.002, 1.77], // closed clean socket cap
  ];
  const bootGeo = lathe(bootProfile, radial);
  const bootMat = new THREE.MeshStandardMaterial({
    color: 0x181817,
    roughness: 0.95,
  });
  const bootMesh = new THREE.Mesh(bootGeo, bootMat);

  const iron = new THREE.Group();
  iron.add(metalMesh, hexNutMesh, guardMesh, gripMesh, bootMesh);

  // Scale down relative to the bonfire pile for realistic tool proportions
  iron.scale.setScalar(0.72);

  // Stuck in at ~20° from vertical (0.35 rad) into the ember/PCB mound
  iron.position.set(0.18, 0.08, 0.32);
  iron.rotation.set(0.06, 0.10, -0.35);

  return { iron, matcap: metalMat.matcap };
}

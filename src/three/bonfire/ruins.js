import * as THREE from 'three';
import { hash } from '../utils';
import { merge, paint } from './geometry';

// Procedural Dark-Souls medieval ruins (DESIGN.md §7 Card 05 & §13)
// Features: broken tower, gothic arch silhouettes, crumbling curtain walls on the right (x > 0),
// anchored with a weathered low stone wall on the bottom-left, fading into atmospheric abyss fog.
// The left background stays pitch dark to guarantee AA contrast for "REST HERE, TRAVELLER".

function brokenTower(x, z, radius, height, seed) {
  const segments = 8;
  const geometry = new THREE.CylinderGeometry(radius * 0.85, radius, height, segments, 6);
  const pos = geometry.attributes.position;
  const p = new THREE.Vector3();

  for (let i = 0; i < pos.count; i += 1) {
    p.fromBufferAttribute(pos, i);
    // Jagged crumbling top parapet
    if (p.y > height * 0.35) {
      const angle = Math.atan2(p.z, p.x);
      const jagged = Math.sin(angle * 3 + seed) * 0.4 + hash(i + seed) * 0.35;
      if (jagged < 0.2) {
        p.y -= height * 0.22 * (0.5 - jagged);
      }
    }
    // Weathered stonework bulging
    const bump = (hash(i * 3 + seed) - 0.5) * 0.08;
    p.x += bump;
    p.z += bump;
    pos.setXYZ(i, p.x, p.y, p.z);
  }
  geometry.computeVertexNormals();
  geometry.translate(x, height * 0.5 - 0.2, z);
  return geometry;
}

function gothicArch(x, z, width, height, thickness, seed) {
  const parts = [];
  const pillarW = thickness;
  const pillarH = height * 0.72;

  // Left & right pillars
  const leftPillar = new THREE.BoxGeometry(pillarW, pillarH, thickness);
  leftPillar.translate(x - width * 0.5, pillarH * 0.5 - 0.2, z);
  parts.push(leftPillar);

  // Right pillar (may be broken lower for ruined silhouette)
  const rightH = pillarH * (0.65 + hash(seed) * 0.35);
  const rightPillar = new THREE.BoxGeometry(pillarW, rightH, thickness);
  rightPillar.translate(x + width * 0.5, rightH * 0.5 - 0.2, z);
  parts.push(rightPillar);

  // Segmented arch top connecting pillars
  const archSteps = 5;
  const radius = width * 0.5;
  for (let i = 0; i < archSteps; i += 1) {
    // Only build intact arch segments
    if (i > archSteps - 2 && hash(seed + i) > 0.45) continue;
    const a1 = (i / archSteps) * Math.PI;
    const a2 = ((i + 1) / archSteps) * Math.PI;
    const midA = (a1 + a2) * 0.5;
    const segX = x + Math.cos(Math.PI - midA) * radius;
    const segY = pillarH - 0.2 + Math.sin(midA) * (radius * 0.85);

    const seg = new THREE.BoxGeometry(width / archSteps * 1.1, thickness * 0.9, thickness);
    seg.rotateZ(midA - Math.PI * 0.5);
    seg.translate(segX, segY, z);
    parts.push(seg);
  }

  return merge(parts);
}

function curtainWall(x1, z1, x2, z2, height, thickness, seed) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const len = Math.hypot(dx, dz);
  const angle = Math.atan2(dz, dx);

  const geo = new THREE.BoxGeometry(len, height, thickness, 6, 3);
  const pos = geo.attributes.position;
  const p = new THREE.Vector3();

  for (let i = 0; i < pos.count; i += 1) {
    p.fromBufferAttribute(pos, i);
    // Crumbling jagged top edge
    if (p.y > height * 0.25) {
      const crumble = hash(i + seed * 7) * 0.45;
      p.y -= crumble * height * 0.4;
    }
    pos.setXYZ(i, p.x, p.y, p.z);
  }
  geo.computeVertexNormals();
  geo.rotateY(-angle);
  geo.translate((x1 + x2) * 0.5, height * 0.5 - 0.2, (z1 + z2) * 0.5);
  return geo;
}

function bottomLeftStoneWall(q) {
  // Low ruined stone wall framing the bottom-left foreground/midground
  // Kept low and dark so it grounds the composition without interfering with typography
  const blocks = [];
  const startX = -3.4;
  const startZ = 1.4;
  const endX = -1.6;
  const endZ = 0.4;
  const count = q.small ? 5 : 9;

  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    const bx = THREE.MathUtils.lerp(startX, endX, t) + (hash(i * 13) - 0.5) * 0.15;
    const bz = THREE.MathUtils.lerp(startZ, endZ, t) + (hash(i * 17) - 0.5) * 0.15;
    const bw = 0.42 + hash(i * 19) * 0.22;
    const bh = 0.24 + hash(i * 23) * 0.20;
    const bd = 0.38 + hash(i * 29) * 0.18;

    const block = new THREE.BoxGeometry(bw, bh, bd);
    block.rotateY((hash(i * 31) - 0.5) * 0.25);
    block.rotateZ((hash(i * 37) - 0.5) * 0.08);
    block.translate(bx, bh * 0.5 - 0.18, bz);
    blocks.push(block);

    // Weathered fallen rubble block nearby
    if (hash(i * 41) > 0.45) {
      const rubble = new THREE.BoxGeometry(bw * 0.5, bh * 0.5, bd * 0.5);
      rubble.rotateY(hash(i * 43) * Math.PI);
      rubble.translate(bx + (hash(i) - 0.5) * 0.4, 0.04, bz + 0.3);
      blocks.push(rubble);
    }
  }

  return merge(blocks);
}

export function buildRuins(q) {
  const parts = [];

  // --- 1. Distant Medieval Ruins behind fire on the RIGHT (x > 0.8, z < -3.5) ---
  // Broken Watchtower silhouette on the far right
  parts.push(brokenTower(3.2, -6.2, 0.95, 5.2, 101));

  // Secondary crumbling tower stump (desktop only to preserve mobile draw budget)
  if (!q.small) {
    parts.push(brokenTower(4.6, -7.5, 0.80, 3.8, 102));
  }

  // Gothic Arches framing the right horizon
  parts.push(gothicArch(1.8, -4.8, 1.4, 2.8, 0.28, 201));
  if (!q.small) {
    parts.push(gothicArch(3.5, -5.4, 1.2, 2.5, 0.26, 202));
  }

  // Broken curtain walls connecting and stepping down
  parts.push(curtainWall(1.0, -4.5, 2.5, -5.2, 1.7, 0.32, 301));
  parts.push(curtainWall(2.5, -5.2, 4.2, -6.4, 2.2, 0.35, 302));
  if (!q.small) {
    parts.push(curtainWall(3.8, -6.0, 5.2, -7.2, 1.5, 0.30, 303));
  }

  // Scattered crumbled masonry blocks on the right rear ground
  const rubbleCount = q.small ? 3 : 8;
  for (let i = 0; i < rubbleCount; i += 1) {
    const rx = 1.4 + hash(i * 7 + 50) * 3.0;
    const rz = -3.8 - hash(i * 11 + 60) * 3.0;
    const block = new THREE.BoxGeometry(0.35 + hash(i) * 0.25, 0.2 + hash(i + 1) * 0.2, 0.35 + hash(i + 2) * 0.25);
    block.rotateY(hash(i + 3) * Math.PI);
    block.translate(rx, 0.05, rz);
    parts.push(block);
  }

  // --- 2. Low weathered stone wall on the BOTTOM-LEFT ---
  parts.push(bottomLeftStoneWall(q));

  const mergedGeo = merge(parts);

  // Paint with atmospheric depth fade:
  // Foreground / bottom-left: deep dark charcoal stone (0x121214)
  // Distance (-z < -3.5): smoothly dissolves into the pitch dark abyss fog (0x060608)
  const paintedGeo = paint(mergedGeo, (p, c) => {
    // Depth factor: z runs from +1.5 (foreground) down to -8.0 (distant horizon)
    const distFade = THREE.MathUtils.smoothstep(p.z, -3.0, -7.5);
    // Base stone reflectance (very dark low-poly silhouette)
    const baseTone = 0.07 + hash(p.x * 3.7 + p.y * 5.3) * 0.02;
    // Ambient rim warmth where fire light reflects on near surfaces
    const fireDist = Math.hypot(p.x, p.z);
    const fireWarmth = (1.0 - THREE.MathUtils.smoothstep(fireDist, 1.5, 4.5)) * 0.04;

    const finalTone = THREE.MathUtils.lerp(baseTone, 0.02, distFade);
    c.setRGB(finalTone + fireWarmth, finalTone + fireWarmth * 0.4, finalTone);
  });

  const material = new THREE.MeshStandardMaterial({
    roughness: 0.98,
    metalness: 0.02,
    flatShading: true,
    vertexColors: true,
  });

  const mesh = new THREE.Mesh(paintedGeo, material);
  return { mesh, material, geometry: paintedGeo };
}

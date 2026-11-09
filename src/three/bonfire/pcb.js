import * as THREE from 'three';
import { hash, makeCanvas, texture } from '../utils';
import { merge } from './geometry';

const CELLS = 4;
// The last atlas cell is the glowing broken edge used on the board sides.
const EDGE_CELL = CELLS * CELLS - 1;

function drawTraces(ctx, cx, cy, cell, seed) {
  for (let i = 0; i < 9; i += 1) {
    let x = cx + hash(seed + i) * cell;
    let y = cy;
    ctx.beginPath();
    ctx.moveTo(x, y);
    // Straight runs with 45-degree bends, as on a routed board.
    while (y < cy + cell) {
      const run = cell * (0.08 + hash(y + i + seed) * 0.2);
      y += run;
      ctx.lineTo(x, y);
      const bend = (hash(x + seed) - 0.5) * cell * 0.24;
      x += bend;
      y += Math.abs(bend);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  for (let i = 0; i < 14; i += 1) {
    ctx.beginPath();
    ctx.arc(cx + hash(seed + i * 3) * cell, cy + hash(seed + i * 5) * cell, cell * 0.018, 0, Math.PI * 2);
    ctx.fill();
  }
}

function buildAtlas(size) {
  const cell = size / CELLS;
  const base = makeCanvas(size, size);
  const baseCtx = base.getContext('2d');
  const glow = makeCanvas(size, size);
  const glowCtx = glow.getContext('2d');
  baseCtx.fillStyle = '#14160f';
  baseCtx.fillRect(0, 0, size, size);
  glowCtx.fillStyle = '#000';
  glowCtx.fillRect(0, 0, size, size);
  baseCtx.strokeStyle = '#6f5a38';
  baseCtx.fillStyle = '#8a7446';
  glowCtx.strokeStyle = '#fff';
  glowCtx.fillStyle = '#fff';
  baseCtx.lineWidth = glowCtx.lineWidth = Math.max(1, size / 240);

  for (let i = 0; i < EDGE_CELL; i += 1) {
    const cx = (i % CELLS) * cell;
    const cy = Math.floor(i / CELLS) * cell;
    drawTraces(baseCtx, cx, cy, cell, i * 11 + 1);
    drawTraces(glowCtx, cx, cy, cell, i * 11 + 1);
    // Burnt-out patches cut the glow and blacken the board.
    for (let k = 0; k < 7; k += 1) {
      const x = cx + hash(i * 7 + k) * cell;
      const y = cy + hash(i * 9 + k + 3) * cell;
      const r = cell * (0.1 + hash(i + k * 13) * 0.24);
      [baseCtx, glowCtx].forEach((ctx) => {
        const fade = ctx.createRadialGradient(x, y, 0, x, y, r);
        fade.addColorStop(0, ctx === baseCtx ? 'rgba(4,4,3,.96)' : 'rgba(0,0,0,1)');
        fade.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = fade;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      });
    }

    // Glowing hot ember nodes (incandescent solder joints and substrate cracks)
    for (let e = 0; e < 10; e += 1) {
      const ex = cx + hash(i * 17 + e * 5) * cell;
      const ey = cy + hash(i * 29 + e * 7) * cell;
      const er = cell * (0.025 + hash(i * 3 + e * 11) * 0.04);
      const emberGrad = glowCtx.createRadialGradient(ex, ey, 0, ex, ey, er * 2.2);
      emberGrad.addColorStop(0, '#ffffff');
      emberGrad.addColorStop(0.35, 'rgba(255, 200, 100, 0.95)');
      emberGrad.addColorStop(0.7, 'rgba(255, 80, 0, 0.6)');
      emberGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      glowCtx.fillStyle = emberGrad;
      glowCtx.beginPath();
      glowCtx.arc(ex, ey, er * 2.2, 0, Math.PI * 2);
      glowCtx.fill();

      baseCtx.fillStyle = '#ff7a18';
      baseCtx.beginPath();
      baseCtx.arc(ex, ey, er * 0.65, 0, Math.PI * 2);
      baseCtx.fill();
    }
    baseCtx.fillStyle = '#8a7446';
    glowCtx.fillStyle = '#fff';
  }
  const ex = (EDGE_CELL % CELLS) * cell;
  const ey = Math.floor(EDGE_CELL / CELLS) * cell;
  baseCtx.fillStyle = '#050505';
  baseCtx.fillRect(ex, ey, cell, cell);
  glowCtx.fillStyle = '#fff';
  glowCtx.fillRect(ex, ey, cell, cell);
  return { base: texture(base), glow: texture(glow) };
}

// BoxGeometry faces are +x -x +y -y +z -z, four vertices each. The board is thin along y.
function mapFaces(geometry, cellIndex) {
  const uv = geometry.attributes.uv;
  const place = (index, u, v) => {
    const col = index % CELLS;
    const row = Math.floor(index / CELLS);
    // Canvas rows run downward, texture v runs upward.
    return [(col + u) / CELLS, 1 - (row + 1 - v) / CELLS];
  };
  for (let i = 0; i < uv.count; i += 1) {
    const face = Math.floor(i / 4);
    const [u, v] = place(face === 2 || face === 3 ? cellIndex : EDGE_CELL, uv.getX(i), uv.getY(i));
    uv.setXY(i, u, v);
  }
}

const dummy = new THREE.Object3D();

function board(index, width, depth, position, rotation) {
  const geometry = new THREE.BoxGeometry(width, 0.026, depth);
  mapFaces(geometry, index % EDGE_CELL);
  dummy.position.set(...position);
  dummy.rotation.set(...rotation);
  dummy.updateMatrix();
  geometry.applyMatrix4(dummy.matrix);
  return geometry;
}

export function buildPcbPile(q) {
  const { base, glow } = buildAtlas(q.atlas);
  // Large boards propped up at the front so the traces read from the low camera.
  const parts = [
    board(0, 0.82, 0.62, [-0.72, 0.42, 0.72], [1.02, 0.3, 0.26]),
    board(1, 0.62, 0.5, [0.62, 0.34, 0.86], [1.12, -0.36, -0.22]),
    board(2, 0.58, 0.46, [-0.08, 0.3, 1.0], [1.26, 0.1, 0.1]),
  ];
  for (let i = 3; i < q.pcbs; i += 1) {
    const a = hash(i + 300) * Math.PI * 2;
    const r = 0.25 + hash(i + 320) * 0.72;
    const lean = 0.35 + hash(i + 340) * 0.8;
    parts.push(board(
      i,
      0.26 + hash(i + 360) * 0.46,
      0.2 + hash(i + 380) * 0.36,
      [Math.cos(a) * r, 0.14 + (1 - r / 0.97) * 0.6, Math.sin(a) * r],
      [Math.sin(a) * lean, hash(i + 400) * Math.PI, -Math.cos(a) * lean],
    ));
  }
  const material = new THREE.MeshStandardMaterial({
    map: base,
    emissiveMap: glow,
    emissive: 0xff6a00,
    emissiveIntensity: 1.4,
    roughness: 0.82,
    metalness: 0.15,
  });
  return { pile: new THREE.Mesh(merge(parts), material), glow, material };
}

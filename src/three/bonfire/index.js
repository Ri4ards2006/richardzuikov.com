import * as THREE from 'three';
import { disposeObject, hash, smooth } from '../utils';
import { buildFlames } from './flames';
import { paint } from './geometry';
import { buildIron } from './iron';
import { buildLogs } from './logs';
import { buildParticles } from './particles';
import { buildPcbPile } from './pcb';
import { bonfireQuality } from './quality';
import { buildRuins } from './ruins';
import { buildStones } from './stones';

function noise1(t) {
  const i = Math.floor(t);
  return THREE.MathUtils.lerp(hash(i), hash(i + 1), smooth(t - i));
}

function buildBonfire(emberCount, q) {
  const group = new THREE.Group();
  const textures = [];

  // Poly Haven CC0 stone floor PBR textures (logged in design/ASSETS.md)
  const loader = new THREE.TextureLoader();
  const diffMap = loader.load('/textures/bonfire/stone_floor_diff.jpg');
  diffMap.wrapS = diffMap.wrapT = THREE.RepeatWrapping;
  diffMap.repeat.set(1.5, 1.5);
  textures.push(diffMap);

  const roughMap = loader.load('/textures/bonfire/stone_floor_rough.jpg');
  roughMap.wrapS = roughMap.wrapT = THREE.RepeatWrapping;
  roughMap.repeat.set(1.5, 1.5);
  textures.push(roughMap);

  const norMap = loader.load('/textures/bonfire/stone_floor_nor.jpg');
  norMap.wrapS = norMap.wrapT = THREE.RepeatWrapping;
  norMap.repeat.set(1.5, 1.5);
  textures.push(norMap);

  const stone = new THREE.MeshStandardMaterial({
    color: 0x6a6a66,
    map: diffMap,
    roughnessMap: roughMap,
    normalMap: norMap,
    normalScale: new THREE.Vector2(0.85, 0.85),
    roughness: 0.92,
    metalness: 0.05,
  });

  const ixMin = q.small ? -3 : -5;
  const ixMax = q.small ? 3 : 5;
  const izMin = q.small ? -4 : -6;
  const izMax = 1;
  const slabCount = (ixMax - ixMin + 1) * (izMax - izMin + 1);
  const slabs = new THREE.InstancedMesh(new THREE.BoxGeometry(1.62, 0.3, 1.62), stone, slabCount);
  const matrix = new THREE.Matrix4();
  const euler = new THREE.Euler();
  const quat = new THREE.Quaternion();
  let n = 0;
  for (let ix = ixMin; ix <= ixMax; ix += 1) {
    for (let iz = izMin; iz <= izMax; iz += 1) {
      const r = hash(ix * 13.7 + iz * 7.3);
      euler.set((r - 0.5) * 0.07, (r - 0.5) * 0.25, (hash(r * 9) - 0.5) * 0.07);
      quat.setFromEuler(euler);
      matrix.compose(new THREE.Vector3(ix * 1.75, -0.2 + (r - 0.5) * 0.12, iz * 1.75), quat, new THREE.Vector3(1, 1, 1));
      slabs.setMatrixAt(n, matrix);
      n += 1;
    }
  }
  group.add(slabs);

  const ruins = buildRuins(q);
  group.add(ruins.mesh);

  group.add(buildStones(q));

  const ashGeo = paint(new THREE.IcosahedronGeometry(1, 2), (p, c) => {
    const r = Math.hypot(p.x, p.z);
    const heat = Math.max(0, 1 - r * 1.1) * THREE.MathUtils.smoothstep(p.y, -0.3, 0.5);
    const soot = 0.28 + hash(p.x * 7 + p.z * 11) * 0.12;
    c.setRGB(soot + heat * 0.8, soot + heat * 0.35, soot * (1 - heat * 0.4));
  });
  const ashMat = new THREE.MeshStandardMaterial({
    roughness: 0.95,
    flatShading: true,
    vertexColors: true,
    emissive: 0xff4800,
    emissiveIntensity: 0.4,
  });
  const ash = new THREE.Mesh(ashGeo, ashMat);
  ash.scale.set(1.25, 0.34, 1.25);
  group.add(ash);

  const { logs, glow: logGlow } = buildLogs(q);
  group.add(logs);
  textures.push(logGlow);

  const { iron, matcap } = buildIron(q);
  group.add(iron);
  textures.push(matcap);

  const { pile, glow, material: pcbMaterial } = buildPcbPile(q);
  group.add(pile);
  textures.push(glow);

  const flames = buildFlames(q);
  group.add(flames.group);

  const light = new THREE.PointLight(0xff6600, 60, 26, 1.7);
  light.position.set(0, 1.15, 0.2);
  group.add(light);
  group.add(new THREE.HemisphereLight(0x3a3a3a, 0x050505, 0.32));

  const particles = buildParticles(emberCount, q);
  group.add(particles.group);

  return { group, light, flames, particles, textures, pcbMaterial, ashMat, iron };
}

// getLayout() returns the world placement { x, y, scale, pixel } measured by the stage.
export function createBonfire({ emberCount, getLayout }) {
  const q = bonfireQuality();
  const { group, light, flames, particles, textures, pcbMaterial, ashMat, iron } = buildBonfire(emberCount, q);
  group.visible = false;
  let parent = null;
  let time = 0;

  return {
    // camera is part of the interface for camera-facing flames (DESIGN.md §13).
    mount(scene, camera) {
      parent = scene;
      scene.add(group);
      if (typeof window !== 'undefined') {
        window.__bonfire = { scene, camera, group, iron, THREE };
      }
    },
    // progress: 0 while out of range, rising to 1 at the end of the page.
    update(dt, progress) {
      time += dt;
      const { x, y, scale, pixel } = getLayout();
      group.position.set(x, y, 0);
      group.scale.setScalar(scale);

      group.visible = progress > 0;
      if (!group.visible) return;

      // Φ(t) = base + A1·sin(ω1t) + A2·sin(ω2t) + A3·noise(4t)
      const base = 56;
      const A1 = 8 * Math.sin(time * 11.3);
      const A2 = 5 * Math.sin(time * 23.7);
      const A3 = 14 * (noise1(time * 4) - 0.5) * 2;
      const intensity = Math.max(26, base + A1 + A2 + A3);
      const flicker = intensity / 56;

      light.intensity = intensity;
      pcbMaterial.emissiveIntensity = 0.95 + flicker * 1.25;
      ashMat.emissiveIntensity = 0.35 + flicker * 0.45;
      light.position.x = (noise1(time * 5 + 9) - 0.5) * 0.25;
      light.position.z = 0.2 + (noise1(time * 4 + 3) - 0.5) * 0.15;

      flames.update(time, flicker);
      particles.update(time, pixel);
    },
    dispose() {
      if (typeof window !== 'undefined' && window.__bonfire?.group === group) {
        delete window.__bonfire;
      }
      parent?.remove(group);
      parent = null;
      disposeObject(group);
      flames.dispose();
      particles.dispose();
      textures.forEach((map) => map.dispose());
    },
  };
}

import * as THREE from 'three';
import { disposeObject, hash, smooth } from '../utils';
import { buildFlames } from './flames';
import { buildIron } from './iron';
import { buildLogs } from './logs';
import { buildParticles } from './particles';
import { buildPcbPile } from './pcb';
import { bonfireQuality } from './quality';
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

  const slabs = new THREE.InstancedMesh(new THREE.BoxGeometry(1.62, 0.3, 1.62), stone, 11 * 8);
  const matrix = new THREE.Matrix4();
  const euler = new THREE.Euler();
  const quat = new THREE.Quaternion();
  let n = 0;
  for (let ix = -5; ix <= 5; ix += 1) {
    for (let iz = -6; iz <= 1; iz += 1) {
      const r = hash(ix * 13.7 + iz * 7.3);
      euler.set((r - 0.5) * 0.07, (r - 0.5) * 0.25, (hash(r * 9) - 0.5) * 0.07);
      quat.setFromEuler(euler);
      matrix.compose(new THREE.Vector3(ix * 1.75, -0.2 + (r - 0.5) * 0.12, iz * 1.75), quat, new THREE.Vector3(1, 1, 1));
      slabs.setMatrixAt(n, matrix);
      n += 1;
    }
  }
  group.add(slabs);

  group.add(buildStones(q));

  const ash = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 2), new THREE.MeshStandardMaterial({ color: 0x8a8a86, roughness: 1, flatShading: true }));
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

  return { group, light, flames, particles, textures, pcbMaterial, iron };
}

// getLayout() returns the world placement { x, y, scale, pixel } measured by the stage.
export function createBonfire({ emberCount, getLayout }) {
  const q = bonfireQuality();
  const { group, light, flames, particles, textures, pcbMaterial, iron } = buildBonfire(emberCount, q);
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
      pcbMaterial.emissiveIntensity = 0.85 + flicker * 1.15;
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

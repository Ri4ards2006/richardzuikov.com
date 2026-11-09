import * as THREE from 'three';
import { disposeObject, hash, makeCanvas, pointsMaterial, seededPoints, smooth, texture } from '../utils';

function noise1(t) {
  const i = Math.floor(t);
  return THREE.MathUtils.lerp(hash(i), hash(i + 1), smooth(t - i));
}

function pcbTexture() {
  const canvas = makeCanvas(256, 360);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1c1c1b';
  ctx.fillRect(0, 0, 256, 360);
  ctx.strokeStyle = '#b5b5b1';
  ctx.lineWidth = 3;
  for (let i = 0; i < 18; i += 1) {
    let x = 20 + hash(i) * 216;
    let y = hash(i + 40) * 40;
    ctx.beginPath();
    ctx.moveTo(x, y);
    while (y < 360) {
      y += 30 + hash(y + i) * 50;
      x += (hash(x + i) - 0.5) * 60;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  return texture(canvas);
}

function buildBonfire(emberCount) {
  const group = new THREE.Group();
  const stone = new THREE.MeshStandardMaterial({ color: 0x4a4a48, roughness: 0.95, flatShading: true });
  const char = new THREE.MeshStandardMaterial({ color: 0x1a1a19, roughness: 1, flatShading: true });
  const metal = new THREE.MeshStandardMaterial({ color: 0xbdbdb8, roughness: 0.35, metalness: 0.85 });

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

  const ash = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 2), new THREE.MeshStandardMaterial({ color: 0x8a8a86, roughness: 1, flatShading: true }));
  ash.scale.set(1.25, 0.34, 1.25);
  group.add(ash);

  const logGeometry = new THREE.CylinderGeometry(0.11, 0.15, 1.9, 6);
  for (let i = 0; i < 7; i += 1) {
    const log = new THREE.Mesh(logGeometry, char);
    const a = (i / 7) * Math.PI * 2;
    log.position.set(Math.cos(a) * 0.55, 0.42, Math.sin(a) * 0.55);
    log.rotation.set(Math.sin(a) * 0.62, a * 0.3, -Math.cos(a) * 0.62);
    group.add(log);
  }

  // Soldering iron driven tip-first into the ash.
  const iron = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.085, 1.05, 10), new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.6 }));
  handle.position.y = 2.25;
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.1, 10), metal);
  grip.position.y = 1.7;
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.5, 8), metal);
  shaft.position.y = 0.92;
  const cable = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.024, 6, 18, Math.PI * 1.15), new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.8 }));
  cable.position.set(0.4, 2.82, 0);
  iron.add(handle, grip, shaft, cable);
  iron.position.set(0, 0.04, 0.05);
  iron.rotation.set(0.1, 0.4, -0.13);
  group.add(iron);

  const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.86, 0.035), new THREE.MeshStandardMaterial({ map: pcbTexture(), roughness: 0.55, metalness: 0.2 }));
  pcb.position.set(-0.86, 0.48, 0.55);
  pcb.rotation.set(-0.3, 0.5, 0.28);
  group.add(pcb);

  const flames = [0xff6a00, 0xff8218, 0xff9a2e, 0xff6a00, 0xff9a2e].map((color, i) => {
    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.3 + i * 0.03, 1 + hash(i) * 0.7, 5),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    const a = i * 1.26;
    flame.position.set(Math.cos(a) * 0.26, 0.82, Math.sin(a) * 0.26);
    group.add(flame);
    return flame;
  });

  const light = new THREE.PointLight(0xff6600, 60, 26, 1.7);
  light.position.set(0, 1.25, 0.25);
  group.add(light);
  group.add(new THREE.HemisphereLight(0x3a3a3a, 0x050505, 0.32));

  const emberUniforms = { uTime: { value: 0 }, uPixel: { value: 1 } };
  const embers = seededPoints(emberCount, pointsMaterial(
    `attribute vec3 aSeed; uniform float uTime,uPixel; varying float vLife;
     void main(){
       float life=fract(aSeed.z+uTime*(.09+.12*aSeed.x)); vLife=life;
       vec3 p=vec3((aSeed.x-.5)*1.6+sin(uTime*.9+aSeed.z*6.3)*.45*life,.4+life*5.5,(aSeed.y-.5)*1.6);
       vec4 mv=modelViewMatrix*vec4(p,1.);
       gl_Position=projectionMatrix*mv;
       gl_PointSize=uPixel*(22.+aSeed.y*46.)/-mv.z;
     }`,
    `varying float vLife;
     void main(){
       float d=length(gl_PointCoord-.5); if(d>.5)discard;
       vec3 c=mix(vec3(.55,.55,.53),vec3(1.,.416,0.),smoothstep(.08,.45,vLife));
       gl_FragColor=vec4(c,(1.-smoothstep(.1,.5,d))*(1.-vLife)*min(1.,vLife*8.));
     }`,
    emberUniforms,
    THREE.AdditiveBlending,
  ));
  group.add(embers);

  return { group, light, flames, emberUniforms };
}

// getLayout() returns the world placement { x, y, scale, pixel } measured by the stage.
export function createBonfire({ emberCount, getLayout }) {
  const { group, light, flames, emberUniforms } = buildBonfire(emberCount);
  group.visible = false;
  let parent = null;
  let time = 0;

  return {
    // camera is part of the interface for camera-facing flames (DESIGN.md §13).
    mount(scene, camera) {
      parent = scene;
      scene.add(group);
    },
    // progress: 0 while out of range, rising to 1 at the end of the page.
    update(dt, progress) {
      time += dt;
      const { x, y, scale, pixel } = getLayout();
      group.position.set(x, y, 0);
      group.scale.setScalar(scale);
      emberUniforms.uPixel.value = pixel;

      group.visible = progress > 0;
      if (!group.visible) return;
      const flicker = 0.68 + noise1(time * 7) * 0.42 + Math.sin(time * 19) * 0.05 + Math.sin(time * 3.1) * 0.05;
      light.intensity = 60 * flicker;
      light.position.x = (noise1(time * 5 + 9) - 0.5) * 0.3;
      emberUniforms.uTime.value = time;
      flames.forEach((flame, i) => {
        const n = noise1(time * 6 + i * 3);
        flame.scale.set(0.8 + n * 0.4, 0.75 + n * 0.7, 0.8 + n * 0.4);
        flame.rotation.y = time * (0.4 + i * 0.2);
      });
    },
    dispose() {
      parent?.remove(group);
      parent = null;
      disposeObject(group);
    },
  };
}

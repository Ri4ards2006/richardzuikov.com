import * as THREE from 'three';
import { hash, smooth } from '../../three/utils';

const PUSH_RADIUS = 2.1;
const PUSH_FORCE = 34;
const SPRING = 11;
const DAMPING = 4.5;
// How much of the descent one shard takes to shrink away into ash.
const THIN_SPAN = 0.24;

const vertexShader = `
  attribute float aTone; varying vec3 vPos; varying float vTone;
  void main(){
    vTone=aTone;
    vec4 mv=modelViewMatrix*instanceMatrix*vec4(position,1.);
    vPos=mv.xyz;
    gl_Position=projectionMatrix*mv;
  }`;

// Face normal from screen derivatives; three hard bands keep the ink look without scene lights.
const fragmentShader = `
  varying vec3 vPos; varying float vTone;
  void main(){
    vec3 n=normalize(cross(dFdx(vPos),dFdy(vPos)));
    float l=dot(n,normalize(vec3(-.45,.7,.55)))*.5+.5;
    float band=l<.42?.34:l<.74?.66:1.;
    float depth=mix(.28,1.,smoothstep(-13.,-9.,vPos.z));
    gl_FragColor=vec4(vec3(mix(.16,.56,vTone)*band*depth+.02*(1.-depth)),1.);
  }`;

export function createFloatingShards(count) {
  const geometry = new THREE.TetrahedronGeometry(1, 0);
  const tones = new Float32Array(count);
  const items = Array.from({ length: count }, (_, i) => {
    tones[i] = hash(i + 500);
    // A few large shards give the field a foreground.
    const large = hash(i + 600) > 0.86 ? 1.8 : 1;
    return {
      nx: hash(i + 510) * 2 - 1,
      ny: hash(i + 520) * 2 - 1,
      z: -3.2 + hash(i + 530) * 2.9,
      size: [(0.055 + hash(i + 540) * 0.16) * large, (0.04 + hash(i + 550) * 0.1) * large, 0.025 + hash(i + 560) * 0.06],
      thinAt: 0.02 + hash(i + 700) * 0.72,
      spin: [(hash(i + 570) - 0.5) * 0.7, (hash(i + 580) - 0.5) * 0.7],
      phase: hash(i + 590) * Math.PI * 2,
      base: new THREE.Vector2(),
      offset: new THREE.Vector2(),
      velocity: new THREE.Vector2(),
    };
  });
  geometry.setAttribute('aTone', new THREE.InstancedBufferAttribute(tones, 1));
  const mesh = new THREE.InstancedMesh(geometry, new THREE.ShaderMaterial({ vertexShader, fragmentShader }), count);
  mesh.frustumCulled = false;

  const view = { tan: 1, aspect: 1, camZ: 10 };
  const dummy = new THREE.Object3D();
  const away = new THREE.Vector2();

  const halfHeight = (z) => view.tan * (view.camZ - z);

  return {
    mesh,
    layout(tanHalfFov, aspect, camZ) {
      Object.assign(view, { tan: tanHalfFov, aspect, camZ });
      items.forEach((item) => {
        const h = halfHeight(item.z);
        item.base.set(item.nx * h * aspect, item.ny * h);
      });
    },
    // story: 0 on the stage, 1 where the last shard has turned into ash.
    update(dt, time, pointer, story) {
      items.forEach((item, i) => {
        if (pointer) {
          const h = halfHeight(item.z);
          away.set(item.base.x + item.offset.x - pointer.x * h * view.aspect, item.base.y + item.offset.y - pointer.y * h);
          const distance = away.length();
          if (distance < PUSH_RADIUS && distance > 0.001) {
            item.velocity.addScaledVector(away, ((1 - distance / PUSH_RADIUS) * PUSH_FORCE * dt) / distance);
          }
        }
        item.velocity.addScaledVector(item.offset, -SPRING * dt);
        item.velocity.multiplyScalar(Math.exp(-DAMPING * dt));
        item.offset.addScaledVector(item.velocity, dt);

        const thin = smooth(Math.min(1, Math.max(0, (story - item.thinAt) / THIN_SPAN)));
        dummy.position.set(item.base.x + item.offset.x, item.base.y + item.offset.y + Math.sin(time * 0.4 + item.phase) * 0.07 + thin * 1.4, item.z);
        dummy.rotation.set(item.phase + time * item.spin[0], item.phase * 2 + time * item.spin[1], item.phase);
        const keep = Math.max(1 - thin, 0.0001);
        dummy.scale.set(item.size[0] * keep, item.size[1] * keep, item.size[2] * keep);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}

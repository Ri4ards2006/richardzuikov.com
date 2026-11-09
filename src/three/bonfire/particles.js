import * as THREE from 'three';
import { pointsMaterial, seededPoints } from '../utils';

// Sparks (embers) and thin smoke (DESIGN.md §7 Card 05 & §13)
export function buildParticles(emberCount, q) {
  const group = new THREE.Group();

  // --- 1. Sparks / Embers ---
  const emberUniforms = { uTime: { value: 0 }, uPixel: { value: 1 } };
  const count = q.small ? 60 : 120; // 120 desktop per spec, 60 mobile

  const emberVertexShader = `
    attribute vec3 aSeed;
    uniform float uTime, uPixel;
    varying float vLife;
    varying float vSeed;

    void main() {
      // Loop life over time with random velocity offset per particle
      float speed = 0.14 + aSeed.x * 0.18;
      float life = fract(aSeed.z + uTime * speed);
      vLife = life;
      vSeed = aSeed.y;

      // Upward motion with sine drift and slight helical swirl
      float swirl = uTime * 1.4 + aSeed.z * 6.28;
      // Occasional energetic spark burst
      float pop = smoothstep(0.72, 1.0, aSeed.x) * sin(life * 3.1415) * 0.32;
      float radius = (0.24 + life * 0.72 + pop) * (0.6 + aSeed.x * 0.6);
      vec3 p = vec3(
        sin(swirl) * radius + (aSeed.x - 0.5) * 0.45,
        0.30 + life * 5.4,
        cos(swirl) * radius + (aSeed.y - 0.5) * 0.45
      );

      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = uPixel * (22.0 + aSeed.y * 38.0) / -mv.z;
    }
  `;

  const emberFragmentShader = `
    uniform float uTime;
    varying float vLife;
    varying float vSeed;

    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;

      // High-frequency erratic sparkle and flickering intensity
      float sparkle = 0.62 + 0.38 * sin(uTime * 38.0 + vSeed * 73.1);
      float pop = smoothstep(0.85, 1.0, sin(uTime * 14.0 + vSeed * 47.9)) * 0.5;
      float flicker = sparkle + pop;

      // Color transition: incandescent gold -> rich flame orange -> cooling charcoal flake -> fade
      vec3 cHot = vec3(1.0, 0.90, 0.45);
      vec3 cMid = vec3(1.0, 0.46, 0.04);
      vec3 cAsh = vec3(0.42, 0.36, 0.32);

      vec3 c = mix(cHot, cMid, smoothstep(0.0, 0.32, vLife));
      c = mix(c, cAsh, smoothstep(0.45, 0.90, vLife));

      float softEdge = 1.0 - smoothstep(0.12, 0.5, d);
      float lifeFade = (1.0 - vLife) * min(1.0, vLife * 9.0);
      gl_FragColor = vec4(c * flicker, softEdge * lifeFade * flicker * 0.96);
    }
  `;

  const embers = seededPoints(
    count,
    pointsMaterial(emberVertexShader, emberFragmentShader, emberUniforms, THREE.AdditiveBlending)
  );
  group.add(embers);

  // --- 2. Thin Smoke ---
  const smokeUniforms = { uTime: { value: 0 }, uPixel: { value: 1 } };
  const smokeCount = q.small ? 18 : 36;

  const smokeVertexShader = `
    attribute vec3 aSeed;
    uniform float uTime, uPixel;
    varying float vLife;

    void main() {
      float speed = 0.06 + aSeed.x * 0.06;
      float life = fract(aSeed.z + uTime * speed);
      vLife = life;

      // Rising plume expanding horizontally as it climbs
      float plume = life * 0.95;
      vec3 p = vec3(
        sin(uTime * 0.6 + aSeed.y * 5.0) * plume + (aSeed.x - 0.5) * 0.6,
        1.6 + life * 3.8,
        cos(uTime * 0.5 + aSeed.z * 5.0) * plume + (aSeed.y - 0.5) * 0.6
      );

      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = uPixel * (35.0 + life * 95.0) / -mv.z;
    }
  `;

  const smokeFragmentShader = `
    varying float vLife;

    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;

      // Soft gaussian-like smoke puff with slow dissolve
      float softEdge = 1.0 - smoothstep(0.0, 0.5, d);
      float lifeFade = sin(vLife * 3.1415) * 0.12;

      vec3 smokeCol = vec3(0.18, 0.16, 0.15);
      gl_FragColor = vec4(smokeCol, softEdge * lifeFade);
    }
  `;

  const smoke = seededPoints(
    smokeCount,
    pointsMaterial(smokeVertexShader, smokeFragmentShader, smokeUniforms, THREE.NormalBlending)
  );
  group.add(smoke);

  return {
    group,
    embers,
    smoke,
    update(time, pixel) {
      emberUniforms.uTime.value = time;
      emberUniforms.uPixel.value = pixel;
      smokeUniforms.uTime.value = time;
      smokeUniforms.uPixel.value = pixel;
    },
    dispose() {
      embers.geometry.dispose();
      embers.material.dispose();
      smoke.geometry.dispose();
      smoke.material.dispose();
    },
  };
}

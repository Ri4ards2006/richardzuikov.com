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
      float speed = 0.12 + aSeed.x * 0.16;
      float life = fract(aSeed.z + uTime * speed);
      vLife = life;
      vSeed = aSeed.y;

      // Upward motion with sine drift and slight helical swirl
      float swirl = uTime * 1.2 + aSeed.z * 6.28;
      float radius = (0.25 + life * 0.7) * (0.6 + aSeed.x * 0.6);
      vec3 p = vec3(
        sin(swirl) * radius + (aSeed.x - 0.5) * 0.45,
        0.35 + life * 5.2,
        cos(swirl) * radius + (aSeed.y - 0.5) * 0.45
      );

      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = uPixel * (24.0 + aSeed.y * 36.0) / -mv.z;
    }
  `;

  const emberFragmentShader = `
    varying float vLife;
    varying float vSeed;

    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;

      // Color transition: hot gold -> flame orange -> cooling ash flake -> fade
      vec3 cHot = vec3(1.0, 0.85, 0.35);
      vec3 cMid = vec3(1.0, 0.42, 0.0);
      vec3 cAsh = vec3(0.38, 0.38, 0.36);

      vec3 c = mix(cHot, cMid, smoothstep(0.0, 0.35, vLife));
      c = mix(c, cAsh, smoothstep(0.45, 0.9, vLife));

      float softEdge = 1.0 - smoothstep(0.12, 0.5, d);
      float lifeFade = (1.0 - vLife) * min(1.0, vLife * 9.0);
      gl_FragColor = vec4(c, softEdge * lifeFade * 0.95);
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
      // Smoke expands with age
      gl_PointSize = uPixel * (35.0 + life * 95.0) / -mv.z;
    }
  `;

  const smokeFragmentShader = `
    varying float vLife;

    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;

      // Soft gaussian-like falloff for smoke puff
      float soft = smoothstep(0.5, 0.0, d);
      // Faint ash charcoal tint
      vec3 cSmoke = vec3(0.16, 0.16, 0.15);
      // Fades in above flame and dissolves smoothly into darkness
      float alpha = soft * smoothstep(0.0, 0.25, vLife) * (1.0 - smoothstep(0.6, 1.0, vLife)) * 0.18;
      gl_FragColor = vec4(cSmoke, alpha);
    }
  `;

  const smoke = seededPoints(
    smokeCount,
    pointsMaterial(smokeVertexShader, smokeFragmentShader, smokeUniforms, THREE.NormalBlending)
  );
  group.add(smoke);

  return {
    group,
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

import * as THREE from 'three';

// Layered crossed-billboard FBM flame shader (DESIGN.md §7 Card 05 & §13)
const flameVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const flameFragmentShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uCore;
  varying vec2 vUv;

  // Fast 2D procedural noise
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.55;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = rot * p * 2.05 + vec2(0.0, uTime * 0.4);
      a *= 0.48;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;

    // Upward flow with horizontal turbulent flutter
    float t = uTime * uSpeed;
    float flutter = sin(uv.y * 7.0 - t * 4.0) * 0.08 * uv.y;
    vec2 p = vec2((uv.x - 0.5 + flutter) * 2.6, uv.y * 1.9 - t * 2.2);

    float n = fbm(p);

    // Teardrop flame silhouette envelope
    float widthMask = 1.0 - smoothstep(0.0, 0.52, abs(uv.x - 0.5) * (1.0 + uv.y * 1.1));
    float heightMask = smoothstep(0.02, 0.18, uv.y) * (1.0 - smoothstep(0.45, 1.0, uv.y));
    float mask = widthMask * heightMask;

    float intensity = n * mask * 2.1;
    if (intensity < 0.04) discard;

    // Thermal color grading: incandescent core -> fire gold -> ember hot -> smoke rim
    vec3 cCore  = vec3(1.0, 0.96, 0.78);
    vec3 cGold  = vec3(1.0, 0.62, 0.04);
    vec3 cEmber = vec3(1.0, 0.28, 0.0);
    vec3 cDark  = vec3(0.55, 0.08, 0.0);

    vec3 col = mix(cDark, cEmber, smoothstep(0.08, 0.32, intensity));
    col = mix(col, cGold, smoothstep(0.32, 0.72, intensity));
    col = mix(col, cCore, smoothstep(0.72, 1.25, intensity) * uCore);

    float alpha = smoothstep(0.04, 0.35, intensity) * 0.95;
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

export function buildFlames(q) {
  const group = new THREE.Group();
  const uniforms = {
    uTime: { value: 0 },
    uSpeed: { value: 1.0 },
    uCore: { value: 1.0 },
  };

  const mat = new THREE.ShaderMaterial({
    vertexShader: flameVertexShader,
    fragmentShader: flameFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

  // Layered crossed billboards intersecting at 60-degree angles
  const angles = q.small ? [0, Math.PI / 2] : [0, Math.PI / 3, (Math.PI * 2) / 3];
  const meshes = [];

  const w = 0.95;
  const h = 1.95;
  const geo = new THREE.PlaneGeometry(w, h, 1, 1);
  geo.translate(0, h * 0.48, 0);

  angles.forEach((rotY, i) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.y = rotY;
    mesh.position.set(0, 0.22, 0);
    // Subtle scale variations per billboard layer
    const s = 1.0 - i * 0.06;
    mesh.scale.set(s, s * 1.05, s);
    group.add(mesh);
    meshes.push(mesh);
  });

  // Hot interior core billboard (smaller, brighter)
  const coreGeo = new THREE.PlaneGeometry(w * 0.62, h * 0.65, 1, 1);
  coreGeo.translate(0, h * 0.32, 0);
  const coreMat = new THREE.ShaderMaterial({
    vertexShader: flameVertexShader,
    fragmentShader: flameFragmentShader,
    uniforms: {
      uTime: uniforms.uTime,
      uSpeed: { value: 1.2 },
      uCore: { value: 1.5 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.rotation.y = Math.PI / 4;
  coreMesh.position.set(0, 0.22, 0);
  group.add(coreMesh);
  meshes.push(coreMesh);

  return {
    group,
    material: mat,
    coreMaterial: coreMat,
    geometry: geo,
    coreGeometry: coreGeo,
    update(time, flicker) {
      uniforms.uTime.value = time;
      // Flame height breathes with light flicker
      const pulseY = 0.92 + flicker * 0.16;
      const pulseXZ = 0.95 + flicker * 0.08;
      meshes.forEach((m) => {
        m.scale.y = pulseY;
        m.scale.x = pulseXZ;
      });
    },
    dispose() {
      geo.dispose();
      coreGeo.dispose();
      mat.dispose();
      coreMat.dispose();
    },
  };
}

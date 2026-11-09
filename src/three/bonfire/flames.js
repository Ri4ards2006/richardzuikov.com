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
    float a = 0.54;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.12 + vec2(0.0, uTime * 0.35);
      a *= 0.46;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;

    // Upward convective flow with turbulent horizontal flutter
    float t = uTime * uSpeed;
    float flutter = sin(uv.y * 8.0 - t * 4.5) * 0.07 * uv.y
                  + sin(uv.y * 16.0 + t * 6.2) * 0.03 * uv.y;
    vec2 p = vec2((uv.x - 0.5 + flutter) * 2.6, uv.y * 2.1 - t * 2.6);

    // Multi-tier domain warping for curling, licking flame tongues
    vec2 warp1 = vec2(
      noise(p * 1.4 + vec2(1.7, 9.2) - vec2(0.0, t * 1.6)),
      noise(p * 1.4 + vec2(8.3, 2.8) - vec2(0.0, t * 1.9))
    );
    vec2 warp2 = vec2(
      noise(p * 2.6 + warp1 * 1.8 - vec2(0.0, t * 2.8)),
      noise(p * 2.6 + warp1 * 1.8 + vec2(4.1, 1.2) - vec2(0.0, t * 2.3))
    );
    float n = fbm(p * 1.6 + warp2 * 0.75);

    // Tapered aerodynamic teardrop envelope
    float widthMask = 1.0 - smoothstep(0.0, 0.46, abs(uv.x - 0.5) * (1.0 + uv.y * 1.35));
    float heightMask = smoothstep(0.01, 0.14, uv.y) * (1.0 - smoothstep(0.58, 1.0, uv.y));
    float mask = widthMask * heightMask;

    // Distinct licking flame tongues via threshold shaping
    float tongueShape = smoothstep(0.24, 0.88, n * mask * 2.6);
    float intensity = tongueShape * 2.4;
    if (intensity < 0.03) discard;

    // Incandescent thermal palette: White-gold core -> fiery amber -> crimson ember -> smoke rim
    vec3 cCore  = vec3(1.0, 0.98, 0.90);
    vec3 cGold  = vec3(1.0, 0.68, 0.08);
    vec3 cFlame = vec3(1.0, 0.32, 0.01);
    vec3 cCrimson = vec3(0.68, 0.09, 0.01);

    vec3 col = mix(cCrimson, cFlame, smoothstep(0.04, 0.30, intensity));
    col = mix(col, cGold, smoothstep(0.30, 0.72, intensity));
    col = mix(col, cCore, smoothstep(0.72, 1.35, intensity) * uCore);

    float alpha = smoothstep(0.03, 0.32, intensity) * 0.95;
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

// Tighter bright incandescent inner core shader
const coreFragmentShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uCore;
  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 567.21));
    p += dot(p, p + 65.32);
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

  void main() {
    vec2 uv = vUv;
    float t = uTime * uSpeed;
    float flutter = sin(uv.y * 10.0 - t * 5.0) * 0.04 * uv.y;
    vec2 p = vec2((uv.x - 0.5 + flutter) * 3.2, uv.y * 2.8 - t * 3.2);

    float n = noise(p) * 0.65 + noise(p * 2.2 + vec2(1.4, 7.3)) * 0.35;

    // Tight teardrop core envelope hugging the fuel bed
    float widthMask = 1.0 - smoothstep(0.0, 0.40, abs(uv.x - 0.5) * (1.0 + uv.y * 2.2));
    float heightMask = smoothstep(0.01, 0.12, uv.y) * (1.0 - smoothstep(0.48, 0.95, uv.y));
    float mask = widthMask * heightMask;

    float intensity = n * mask * 2.8;
    if (intensity < 0.05) discard;

    // Blinding incandescent white-amber core (over 2000K glow)
    vec3 cWhite = vec3(1.0, 0.99, 0.94);
    vec3 cIncandescent = vec3(1.0, 0.85, 0.35);
    vec3 cAmber = vec3(1.0, 0.50, 0.05);

    vec3 col = mix(cAmber, cIncandescent, smoothstep(0.1, 0.55, intensity));
    col = mix(col, cWhite, smoothstep(0.55, 1.1, intensity) * uCore);

    float alpha = smoothstep(0.05, 0.4, intensity);
    gl_FragColor = vec4(col * alpha * 1.1, alpha);
  }
`;

// Subtle convective heat haze shader above the fire tips
const hazeFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(314.15, 926.53));
    p += dot(p, p + 58.97);
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

  void main() {
    vec2 uv = vUv;
    float t = uTime * 2.8;

    // Upward refractive heat mirage shimmer
    vec2 p = vec2(uv.x * 5.0, uv.y * 4.0 - t);
    float n1 = noise(p);
    float n2 = noise(p * 2.2 + vec2(3.1, -t * 1.5));
    float ripple = sin((n1 + n2 * 0.5) * 12.0 + t * 4.0);

    // Bounded haze envelope directly above the flame tongues
    float widthMask = 1.0 - smoothstep(0.0, 0.48, abs(uv.x - 0.5) * (1.0 + (1.0 - uv.y) * 0.5));
    float heightMask = smoothstep(0.05, 0.3, uv.y) * (1.0 - smoothstep(0.7, 1.0, uv.y));
    float envelope = widthMask * heightMask;

    // Subtle warm atmospheric refraction glow
    float shimmer = abs(ripple) * envelope * 0.085;
    if (shimmer < 0.005) discard;

    vec3 hazeCol = vec3(1.0, 0.88, 0.65);
    gl_FragColor = vec4(hazeCol * shimmer, shimmer * 0.7);
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

  // Tighter bright incandescent inner core (dual crossed quads)
  const coreAngles = q.small ? [Math.PI / 4] : [Math.PI / 4, (Math.PI * 3) / 4];
  const coreGeo = new THREE.PlaneGeometry(w * 0.56, h * 0.60, 1, 1);
  coreGeo.translate(0, h * 0.30, 0);
  const coreMat = new THREE.ShaderMaterial({
    vertexShader: flameVertexShader,
    fragmentShader: coreFragmentShader,
    uniforms: {
      uTime: uniforms.uTime,
      uSpeed: { value: 1.3 },
      uCore: { value: 1.6 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

  const coreMeshes = [];
  coreAngles.forEach((rotY) => {
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.rotation.y = rotY;
    coreMesh.position.set(0, 0.20, 0);
    group.add(coreMesh);
    coreMeshes.push(coreMesh);
  });

  // Subtle convective heat haze quad above the flames
  const hazeGeo = new THREE.PlaneGeometry(w * 1.15, h * 0.95, 1, 1);
  hazeGeo.translate(0, h * 0.48, 0);
  const hazeMat = new THREE.ShaderMaterial({
    vertexShader: flameVertexShader,
    fragmentShader: hazeFragmentShader,
    uniforms: { uTime: uniforms.uTime },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const hazeMesh = new THREE.Mesh(hazeGeo, hazeMat);
  hazeMesh.position.set(0, 1.45, 0);
  group.add(hazeMesh);

  return {
    group,
    material: mat,
    coreMaterial: coreMat,
    hazeMaterial: hazeMat,
    geometry: geo,
    coreGeometry: coreGeo,
    hazeGeometry: hazeGeo,
    update(time, flicker) {
      uniforms.uTime.value = time;
      // Flame height breathes with light flicker
      const pulseY = 0.92 + flicker * 0.16;
      const pulseXZ = 0.95 + flicker * 0.08;
      meshes.forEach((m) => {
        m.scale.y = pulseY;
        m.scale.x = pulseXZ;
      });
      coreMeshes.forEach((cm) => {
        cm.scale.y = 0.95 + flicker * 0.12;
        cm.scale.x = 0.96 + flicker * 0.06;
      });
      hazeMesh.scale.y = 1.0 + flicker * 0.1;
    },
    dispose() {
      geo.dispose();
      coreGeo.dispose();
      hazeGeo.dispose();
      mat.dispose();
      coreMat.dispose();
      hazeMat.dispose();
    },
  };
}

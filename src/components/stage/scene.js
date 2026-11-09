import * as THREE from 'three';

const FOV = 40;
const CAM_Z = 10;
const INK = 0x050505;
const CHARCOAL = 0x121212;
const PAPER = 0xf4f4f0;
const DIVE_MS = 1300;
const MAX_DPR = 1.5;
const MIN_DPR = 0.75;
const SLOW_FRAME_MS = 24;
const IDLE_FRAME_MS = 1000 / 30;
const ACTIVE_WINDOW_MS = 500;
const SMALL_SCREEN = 768;
const TILTS = [[-3, 4, -2], [2, -3, 3], [-4, -4, 1.5], [3, 2, -3]];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

const rad = THREE.MathUtils.degToRad;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);

const hash = (n) => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

function noise1(t) {
  const i = Math.floor(t);
  return THREE.MathUtils.lerp(hash(i), hash(i + 1), smooth(t - i));
}

function makeCanvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

function texture(canvas) {
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return map;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Voronoi cells of a rectangle by clipping it against every bisector.
function voronoiCells(w, h, count) {
  const seeds = Array.from({ length: count }, () => [(Math.random() - 0.5) * w, (Math.random() - 0.5) * h]);
  const clip = (poly, [ax, ay], [bx, by]) => {
    const mx = (ax + bx) / 2;
    const my = (ay + by) / 2;
    const nx = bx - ax;
    const ny = by - ay;
    const side = ([x, y]) => (x - mx) * nx + (y - my) * ny;
    const out = [];
    poly.forEach((p, i) => {
      const q = poly[(i + 1) % poly.length];
      const sp = side(p);
      const sq = side(q);
      if (sp <= 0) out.push(p);
      if (sp * sq < 0) {
        const f = sp / (sp - sq);
        out.push([p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]);
      }
    });
    return out;
  };
  return seeds.map((seed) => {
    let poly = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]];
    seeds.forEach((other) => {
      if (other !== seed && poly.length) poly = clip(poly, seed, other);
    });
    return { seed, poly };
  }).filter((cell) => cell.poly.length > 2);
}

function drawHalftone(ctx, img, x, y, w, h, cell) {
  const cols = Math.floor(w / cell);
  const rows = Math.floor(h / cell);
  const sample = makeCanvas(cols, rows);
  const sctx = sample.getContext('2d', { willReadFrequently: true });
  const scale = Math.max(cols / img.width, rows / img.height);
  sctx.drawImage(img, (cols - img.width * scale) / 2, (rows - img.height * scale) / 2, img.width * scale, img.height * scale);
  const { data } = sctx.getImageData(0, 0, cols, rows);
  ctx.fillStyle = '#f4f4f0';
  ctx.beginPath();
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const i = (r * cols + c) * 4;
      const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      const radius = Math.sqrt(clamp01(lum * 1.35)) * cell * 0.72;
      if (radius > 0.3) {
        const px = x + (c + 0.5) * cell;
        const py = y + (r + 0.5) * cell;
        ctx.moveTo(px + radius, py);
        ctx.arc(px, py, radius, 0, Math.PI * 2);
      }
    }
  }
  ctx.fill();
}

function drawCard(canvas, project, index, img) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, w, h);
  if (img) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(30, 86, w - 60, h - 200);
    ctx.clip();
    drawHalftone(ctx, img, 30, 86, w - 60, h - 200, 7);
    ctx.restore();
  }
  ctx.strokeStyle = '#f4f4f0';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, w - 20, h - 20);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(19, 19, w - 38, h - 38);
  ctx.fillStyle = '#f4f4f0';
  ctx.textAlign = 'center';
  ctx.font = '26px ui-monospace, monospace';
  ctx.fillText(ROMAN[index] ?? String(index + 1), w / 2, 62);
  ctx.font = '50px Anton, Impact, sans-serif';
  ctx.fillText(project.title.toUpperCase(), w / 2, h - 44, w - 70);
}

function screentone() {
  const canvas = makeCanvas(256, 256);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#3a3a39';
  for (let y = 0; y < 256; y += 8) {
    for (let x = (y / 8) % 2 ? 4 : 0; x < 256; x += 8) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const map = texture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  return map;
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

function createPortrait(map) {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { uMap: { value: map } },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `
      varying vec2 vUv; uniform sampler2D uMap;
      void main(){
        vec4 c=texture2D(uMap,vUv);
        if(c.a<.5)discard;
        float lum=dot(c.rgb,vec3(.299,.587,.114));
        float tone=max(lum,.1+.62*smoothstep(.32,.95,vUv.x));
        vec2 cell=fract(mat2(.707,-.707,.707,.707)*gl_FragCoord.xy/5.)-.5;
        float on=1.-smoothstep(.0,.08,length(cell)-sqrt(tone)*.62);
        gl_FragColor=vec4(mix(vec3(.02),vec3(.957,.957,.941),on),1.);
      }`,
  });
}

function pointsMaterial(vertexShader, fragmentShader, uniforms, blending = THREE.NormalBlending) {
  return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending, uniforms, vertexShader, fragmentShader });
}

function seededPoints(count, material) {
  const seeds = new Float32Array(count * 3);
  for (let i = 0; i < seeds.length; i += 1) seeds[i] = Math.random();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return points;
}

function createBonfire(emberCount) {
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

  const flames = [0xff5500, 0xff7a00, 0xff9900, 0xff5500, 0xff9900].map((color, i) => {
    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.3 + i * 0.03, 1 + hash(i) * 0.7, 5),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    const a = i * 1.26;
    flame.position.set(Math.cos(a) * 0.26, 0.82, Math.sin(a) * 0.26);
    group.add(flame);
    return flame;
  });

  const light = new THREE.PointLight(0xff7a1a, 60, 26, 1.7);
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
       vec3 c=mix(vec3(.55,.55,.53),vec3(1.,.6,0.),smoothstep(.08,.45,vLife));
       gl_FragColor=vec4(c,(1.-smoothstep(.1,.5,d))*(1.-vLife)*min(1.,vLife*8.));
     }`,
    emberUniforms,
    THREE.AdditiveBlending,
  ));
  group.add(embers);

  return { group, light, flames, emberUniforms };
}

export function createStage({ canvas, anchors, projects, portraitSrc, onDiveEnd }) {
  const isSmall = window.innerWidth < SMALL_SCREEN;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isSmall, powerPreference: 'high-performance' });
  renderer.setClearColor(INK);
  let pixelRatio = isSmall ? 1 : Math.min(window.devicePixelRatio || 1, MAX_DPR);
  renderer.setPixelRatio(pixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80);
  camera.position.z = CAM_Z;

  const state = { lastInput: 0, w: 1, h: 1, k: 0.01, scroll: window.scrollY, camY: 0, frame: 0, last: 0, time: 0, slow: 0, count: 0, spent: 0, hover: -1, abyssTop: 1e9, fireY: 0, panels: [] };
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  const dust = seededPoints(isSmall ? 70 : 180, pointsMaterial(
    `attribute vec3 aSeed; uniform float uTime,uPixel;
     void main(){
       vec3 p=vec3((aSeed.x-.5)*20.,mod(aSeed.y*16.+uTime*.18,16.)-8.,(aSeed.z-.5)*10.);
       vec4 mv=modelViewMatrix*vec4(p,1.);
       gl_Position=projectionMatrix*mv;
       gl_PointSize=uPixel*(16.+aSeed.z*24.)/-mv.z;
     }`,
    'void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(.957,.957,.941,(1.-d*2.)*.7);}',
    { uTime: { value: 0 }, uPixel: { value: 1 } },
  ));
  scene.add(dust);

  // Hero group: portrait layers and HUD rings.
  const hero = new THREE.Group();
  scene.add(hero);
  const heroLayers = [];
  const rings = [1.55, 1.95, 2.3].map((radius, i) => {
    const pts = [];
    const segments = 96;
    for (let s = 0; s < segments; s += 1) {
      const a = (s / segments) * Math.PI * 2;
      const outer = s % 8 === 0 ? radius + 0.09 : radius;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0), new THREE.Vector3(Math.cos(a) * outer, Math.sin(a) * outer, 0));
      if (i !== 1 || s % 3) pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0), new THREE.Vector3(Math.cos(a + 0.0654) * radius, Math.sin(a + 0.0654) * radius, 0));
    }
    const ring = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: PAPER, transparent: true, opacity: 0.32 - i * 0.07 }));
    ring.position.z = -0.8 - i * 0.2;
    hero.add(ring);
    heroLayers.push({ object: ring, depth: 0.12 + i * 0.05, base: new THREE.Vector3(0, 0, ring.position.z) });
    return ring;
  });

  const toneMap = screentone();
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1.5, 48), new THREE.MeshBasicMaterial({ map: toneMap }));
  disc.position.z = -0.6;
  hero.add(disc);
  heroLayers.push({ object: disc, depth: 0.2, base: new THREE.Vector3(0, 0, -0.6) });

  loadImage(portraitSrc).then((img) => {
    if (state.disposed) return;
    const map = new THREE.Texture(img);
    map.needsUpdate = true;
    const aspect = img.width / img.height;
    const figure = new THREE.Mesh(new THREE.PlaneGeometry(3.1 * aspect, 3.1), createPortrait(map));
    hero.add(figure);
    heroLayers.push({ object: figure, depth: 0.42, base: new THREE.Vector3(0, -0.1, 0) });
  }).catch(() => {});

  // Ink slash in front of the portrait.
  const slash = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.045), new THREE.MeshBasicMaterial({ color: PAPER }));
  slash.rotation.z = rad(-24);
  hero.add(slash);
  heroLayers.push({ object: slash, depth: 0.75, base: new THREE.Vector3(0, -0.9, 0.7) });

  // Inclined screentone panels behind the descent.
  const backPanels = Array.from({ length: 6 }, (_, i) => {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(9, 5.4), new THREE.MeshBasicMaterial({ map: toneMap, color: 0xaaaaaa }));
    panel.rotation.set(rad(i % 2 ? -14 : 12), rad(i % 2 ? 24 : -22), rad(i % 2 ? 5 : -6));
    scene.add(panel);
    return panel;
  });

  // Tarot cards positioned over measured DOM slots.
  const cards = projects.map((project, index) => {
    const face = makeCanvas(512, 878);
    drawCard(face, project, index, null);
    const map = texture(face);
    const side = new THREE.MeshBasicMaterial({ color: CHARCOAL });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), [side, side, side, side, new THREE.MeshBasicMaterial({ map }), side]);
    const tilt = TILTS[index % TILTS.length];
    const group = new THREE.Group();
    group.add(mesh);
    scene.add(group);
    document.fonts?.load('50px Anton').then(() => {
      if (state.disposed) return;
      drawCard(face, project, index, null);
      map.needsUpdate = true;
    });
    return { project, index, face, map, mesh, group, tilt, lift: 0, base: new THREE.Vector3() };
  });

  const bonfire = createBonfire(isSmall ? 60 : 80);
  bonfire.group.visible = false;
  scene.add(bonfire.group);

  let shards = null;

  function buildShards() {
    const distance = 16 - 7;
    const viewH = 2 * Math.tan(rad(FOV / 2)) * distance * 1.35;
    const viewW = viewH * (state.w / state.h) * 1.1;
    const root = new THREE.Group();
    root.position.z = 7;
    const items = voronoiCells(viewW, viewH, isSmall ? 12 : 38).map(({ seed, poly }) => {
      const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
      const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
      const shape = new THREE.Shape(poly.map(([x, y]) => new THREE.Vector2(x - cx, y - cy)));
      const fill = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color: hash(seed[0]) > 0.86 ? 0x1b1b1b : 0x0a0a0a, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
      const edge = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(poly.map(([x, y]) => new THREE.Vector3(x - cx, y - cy, 0.002))), new THREE.LineBasicMaterial({ color: PAPER, transparent: true }));
      const piece = new THREE.Group();
      piece.add(fill, edge);
      piece.position.set(cx, cy, 0);
      root.add(piece);
      return {
        piece, fill, edge, from: piece.position.clone(),
        to: new THREE.Vector3(-viewW * 0.3 + (Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * viewH * 0.5, -3 - Math.random() * 3),
        spin: new THREE.Vector3((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 3),
        delay: Math.min(0.32, (Math.hypot(cx, cy) / viewH) * 0.5),
      };
    });
    scene.add(root);
    return { root, items };
  }

  const dive = { active: false, start: 0 };

  function disposeShards() {
    if (!shards) return;
    scene.remove(shards.root);
    shards.items.forEach(({ fill, edge }) => {
      fill.geometry.dispose();
      fill.material.dispose();
      edge.geometry.dispose();
      edge.material.dispose();
    });
    shards = null;
  }

  function endDive() {
    if (!dive.active) return;
    dive.active = false;
    disposeShards();
    camera.position.z = CAM_Z;
    camera.rotation.set(0, 0, 0);
    onDiveEnd?.();
  }

  function worldOf(rect) {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + state.scroll + rect.height / 2;
    return { x: (cx - state.w / 2) * state.k, y: -(cy - state.h / 2) * state.k, w: rect.width * state.k, h: rect.height * state.k };
  }

  function measure() {
    state.w = canvas.clientWidth || window.innerWidth;
    state.h = canvas.clientHeight || window.innerHeight;
    state.k = (2 * Math.tan(rad(FOV / 2)) * CAM_Z) / state.h;
    state.scroll = window.scrollY;
    renderer.setSize(state.w, state.h, false);
    camera.aspect = state.w / state.h;
    camera.updateProjectionMatrix();
    const pixel = (state.h / 800) * pixelRatio;
    dust.material.uniforms.uPixel.value = pixel;
    bonfire.emberUniforms.uPixel.value = pixel;

    const a = anchors();
    const portrait = worldOf(a.portrait.getBoundingClientRect());
    hero.position.set(portrait.x, portrait.y, 0);
    hero.scale.setScalar(Math.min(portrait.h / 5, portrait.w / 4.8));

    a.slots.forEach((slot, i) => {
      const card = cards[i];
      if (!card) return;
      const rect = worldOf(slot.getBoundingClientRect());
      card.base.set(rect.x, rect.y, 0);
      card.mesh.scale.set(rect.w, rect.h, 0.05);
    });

    state.panels = a.panels.map((el) => {
      const r = el.getBoundingClientRect();
      return { el, top: r.top + state.scroll, height: r.height };
    });
    state.panels.forEach(({ top, height }, i) => {
      const panel = backPanels[i];
      if (!panel) return;
      panel.position.set((i % 2 ? 2.2 : -2.2) * (state.w / state.h) * 0.7, -(top + height / 2 - state.h / 2) * state.k, -3 - (i % 3) * 0.7);
    });
    backPanels.forEach((panel, i) => { panel.visible = i < state.panels.length; });

    const fire = worldOf(a.fire.getBoundingClientRect());
    const fireScale = Math.min(fire.h / 4.2, fire.w / 3.4);
    bonfire.group.scale.setScalar(fireScale);
    state.fireY = fire.y - fire.h / 2 + 0.2 * fireScale;
    bonfire.group.position.set(fire.x, state.fireY, 0);
    state.abyssTop = a.abyss.getBoundingClientRect().top + state.scroll;
    state.maxScroll = Math.max(1, document.documentElement.scrollHeight - state.h);
  }

  async function loadCardImage(card) {
    const img = await loadImage(card.project.image);
    const bitmap = await createImageBitmap(img, { resizeWidth: 512, resizeQuality: 'medium' });
    await new Promise((resolve) => { requestAnimationFrame(resolve); });
    if (state.disposed) return;
    drawCard(card.face, card.project, card.index, bitmap);
    card.map.needsUpdate = true;
    bitmap.close();
  }

  function tick(now) {
    state.frame = requestAnimationFrame(tick);
    const interacting = dive.active || now - state.lastInput < ACTIVE_WINDOW_MS;
    const minFrame = isSmall || !interacting ? IDLE_FRAME_MS : 0;
    if (now - state.last < minFrame - 1) return;
    const dtMs = Math.min(now - state.last, 100);
    state.last = now;
    const dt = dtMs / 1000;
    state.time += dt;
    const { time } = state;

    state.spent += dtMs;
    state.count += 1;
    if (state.count === 90) {
      const limit = minFrame ? IDLE_FRAME_MS * 1.5 : SLOW_FRAME_MS;
      if (state.spent / state.count > limit && pixelRatio > MIN_DPR) {
        pixelRatio = Math.max(MIN_DPR, pixelRatio - 0.25);
        renderer.setPixelRatio(pixelRatio);
        measure();
      }
      state.count = 0;
      state.spent = 0;
    }

    if (window.scrollY !== state.scroll) state.lastInput = now;
    state.scroll = window.scrollY;
    const follow = 1 - Math.exp(-dt * 18);
    state.camY += (-state.scroll * state.k - state.camY) * follow;
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;

    const abyss = smooth(clamp01((state.scroll - (state.abyssTop - state.h * 0.7)) / (state.maxScroll - (state.abyssTop - state.h * 0.7))));
    camera.position.y = state.camY - abyss * 1.0;
    if (dive.active) {
      const p = clamp01((now - dive.start) / DIVE_MS);
      const eased = 1 - (1 - p) ** 3;
      camera.position.z = THREE.MathUtils.lerp(16, CAM_Z, eased);
      camera.rotation.set(0, 0, rad(12) * (1 - eased));
      shards?.items.forEach((item) => {
        const local = clamp01((p - item.delay) / (1 - item.delay));
        const e = local * local * (3 - 2 * local);
        item.piece.position.lerpVectors(item.from, item.to, e);
        item.piece.rotation.set(item.spin.x * e, item.spin.y * e, item.spin.z * e);
        const fade = 1 - clamp01((local - 0.55) / 0.45);
        item.fill.material.opacity = fade;
        item.edge.material.opacity = fade * 0.7;
      });
      if (p >= 1) endDive();
    } else {
      camera.position.z = CAM_Z - abyss * 2.4;
      camera.rotation.set(abyss * rad(7), 0, 0);
    }

    dust.position.y = state.camY;
    dust.material.uniforms.uTime.value = time;

    hero.visible = state.scroll < state.h * 1.4;
    if (hero.visible) {
      heroLayers.forEach(({ object, depth, base }) => {
        object.position.set(base.x + mouse.x * depth, base.y - mouse.y * depth * 0.6, base.z);
      });
      rings.forEach((ring, i) => { ring.rotation.z = time * (i % 2 ? -0.05 : 0.07); });
    }

    if (!dive.active && !state.loadingCard) {
      const next = cards.find((card) => !card.loaded && Math.abs(card.base.y - state.camY) < state.h * state.k * 2.5);
      if (next) {
        next.loaded = true;
        state.loadingCard = true;
        loadCardImage(next).catch(() => {}).finally(() => { state.loadingCard = false; });
      }
    }

    cards.forEach((card) => {
      const visible = Math.abs(card.base.y - state.camY) < 12;
      card.group.visible = visible;
      if (!visible) return;
      const hovered = state.hover === card.index ? 1 : 0;
      card.lift += (hovered - card.lift) * follow;
      card.group.position.set(card.base.x, card.base.y, card.base.z + card.lift * 0.9);
      card.group.scale.setScalar(1 + card.lift * 0.05);
      card.group.rotation.set(
        rad(card.tilt[0]) * (1 - card.lift) - mouse.y * 0.28 * card.lift,
        rad(card.tilt[1]) * (1 - card.lift) + mouse.x * 0.34 * card.lift,
        rad(card.tilt[2]) * (1 - card.lift),
      );
    });

    state.panels.forEach(({ el, top, height }) => {
      const depth = (top + height / 2 - state.scroll - state.h / 2) / state.h;
      if (Math.abs(depth) < 1.6) el.style.setProperty('--depth', depth.toFixed(3));
    });

    bonfire.group.visible = abyss > 0 || state.scroll + state.h * 1.6 > state.abyssTop;
    if (bonfire.group.visible) {
      const flicker = 0.68 + noise1(time * 7) * 0.42 + Math.sin(time * 19) * 0.05 + Math.sin(time * 3.1) * 0.05;
      bonfire.light.intensity = 60 * flicker;
      bonfire.light.position.x = (noise1(time * 5 + 9) - 0.5) * 0.3;
      bonfire.emberUniforms.uTime.value = time;
      bonfire.flames.forEach((flame, i) => {
        const n = noise1(time * 6 + i * 3);
        flame.scale.set(0.8 + n * 0.4, 0.75 + n * 0.7, 0.8 + n * 0.4);
        flame.rotation.y = time * (0.4 + i * 0.2);
      });
    }

    renderer.render(scene, camera);
  }

  const onPointerMove = (event) => {
    mouse.tx = (event.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (event.clientY / window.innerHeight - 0.5) * 2;
    state.lastInput = performance.now();
  };
  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(state.frame);
      state.frame = 0;
    } else if (!state.frame) {
      state.last = performance.now();
      state.frame = requestAnimationFrame(tick);
    }
  };

  measure();
  state.camY = -state.scroll * state.k;
  const observer = new ResizeObserver(measure);
  observer.observe(document.documentElement);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);

  return {
    start() {
      state.last = performance.now();
      state.frame = requestAnimationFrame(tick);
    },
    // Compiles every program off the render path so no later frame stalls on a shader.
    async prepare({ intro }) {
      if (intro) shards = buildShards();
      const fireVisible = bonfire.group.visible;
      bonfire.group.visible = true;
      try {
        await renderer.compileAsync(scene, camera);
      } catch {
        // Falls back to compiling on first use.
      }
      bonfire.group.visible = fireVisible;
      if (shards) shards.root.visible = false;
    },
    prepareDive() {
      if (shards) shards.root.visible = true;
      dive.active = true;
      dive.start = Infinity;
    },
    playDive() {
      dive.active = true;
      dive.start = performance.now();
    },
    skipDive() {
      if (dive.active || shards) {
        dive.active = true;
        endDive();
      }
    },
    setHover(index) {
      state.hover = index;
    },
    dispose() {
      state.disposed = true;
      cancelAnimationFrame(state.frame);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
      scene.traverse((object) => {
        object.geometry?.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          material?.map?.dispose();
          material?.dispose();
        });
      });
      renderer.dispose();
    },
  };
}

import * as THREE from 'three';
import { createBonfire } from '../../three/bonfire';
import { createFloatingShards } from './floating-shards';
import { createInkWater } from './ink-water';
import { disposeObject, hash, makeCanvas, pointsMaterial, seededPoints, smooth, texture } from '../../three/utils';

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
// Follow rates of the delayed copies, nearest first.
const GHOST_FOLLOW = [15, 11, 8, 6, 4.5, 3.4];
const TILTS = [[-3, 4, -2], [2, -3, 3], [-4, -4, 1.5], [3, 2, -3]];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

const rad = THREE.MathUtils.degToRad;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

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

function createPortrait(map, { ghost = false } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: !ghost,
    uniforms: { uMap: { value: map }, uOpacity: { value: 1 }, uDissolve: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `
      varying vec2 vUv; uniform sampler2D uMap; uniform float uOpacity,uDissolve;
      void main(){
        vec4 c=texture2D(uMap,vUv);
        if(c.a<.5)discard;
        float lum=dot(c.rgb,vec3(.299,.587,.114));
        float tone=max(lum,.1+.62*smoothstep(.32,.95,vUv.x));
        vec2 cell=fract(mat2(.707,-.707,.707,.707)*gl_FragCoord.xy/(5.+uDissolve*11.))-.5;
        float on=1.-smoothstep(.0,.08,length(cell)-sqrt(tone)*.62*(1.-uDissolve*uDissolve));
        if(uDissolve>0.&&on<.5)discard;
        gl_FragColor=vec4(mix(vec3(.02),vec3(.957,.957,.941),on),uOpacity);
      }`,
  });
}

export function createStage({ canvas, anchors, projects, portraitSrc, profileSrc, onDiveEnd }) {
  const isSmall = window.innerWidth < SMALL_SCREEN;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isSmall, powerPreference: 'high-performance' });
  renderer.setClearColor(INK);
  let pixelRatio = isSmall ? 1 : Math.min(window.devicePixelRatio || 1, MAX_DPR);
  renderer.setPixelRatio(pixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80);
  camera.position.z = CAM_Z;

  const state = { lastInput: 0, w: 1, h: 1, k: 0.01, scroll: window.scrollY, camY: 0, frame: 0, last: 0, time: 0, slow: 0, count: 0, spent: 0, hover: -1, abyssTop: 1e9, panels: [], fireProgress: 0, fire: { x: 0, y: 0, scale: 1, pixel: 1 } };
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
  let heroFigure = null;
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

  const water = createInkWater();
  scene.add(water.mesh);

  loadImage(portraitSrc).then((img) => {
    if (state.disposed) return;
    const map = new THREE.Texture(img);
    map.needsUpdate = true;
    const aspect = img.width / img.height;
    const figure = new THREE.Mesh(new THREE.PlaneGeometry(3.1 * aspect, 3.1), createPortrait(map));
    heroFigure = figure;
    hero.add(figure);
    heroLayers.push({ object: figure, depth: 0.42, base: new THREE.Vector3(0, -0.1, 0) });
  }).catch(() => {});

  // Side-profile figure of the About section.
  const profile = { ghosts: [], mesh: null, map: null, geometry: null, aspect: 1, box: { w: 1, h: 1 }, to: new THREE.Vector3(), top: 0, height: 1 };
  loadImage(profileSrc).then((img) => {
    if (state.disposed) return;
    profile.map = new THREE.Texture(img);
    profile.map.needsUpdate = true;
    profile.aspect = img.width / img.height;
    profile.geometry = new THREE.PlaneGeometry(profile.aspect, 1);
    profile.mesh = new THREE.Mesh(profile.geometry, createPortrait(profile.map));
    scene.add(profile.mesh);
    profile.ghosts = GHOST_FOLLOW.map((follow) => {
      const material = createPortrait(profile.map, { ghost: true });
      const mesh = new THREE.Mesh(profile.geometry, material);
      mesh.visible = false;
      mesh.renderOrder = -1;
      scene.add(mesh);
      return { mesh, material, follow, p: 0 };
    });
  }).catch(() => {});

  const profileHeight = () => Math.min(profile.box.h, profile.box.w / profile.aspect);

  // p: 0 on the stage, 1 settled in About. The figure turns edge-on, then the profile turns in.
  function placeProfile(mesh, p) {
    mesh.position.lerpVectors(hero.position, profile.to, p);
    mesh.position.z = Math.sin(p * Math.PI) * 1.4;
    mesh.scale.setScalar(THREE.MathUtils.lerp(hero.scale.x * 3.1, profileHeight(), p));
    mesh.rotation.y = rad(-90) * (1 - smooth(clamp01((p - 0.5) / 0.5)));
  }

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

  const floating = createFloatingShards(isSmall ? 40 : 56);
  scene.add(floating.mesh);
  const pointer = new THREE.Vector2();
  let pointerSeen = false;

  const bonfire = createBonfire({ emberCount: isSmall ? 60 : 80, getLayout: () => state.fire });
  bonfire.mount(scene, camera);

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

    floating.layout(Math.tan(rad(FOV / 2)), state.w / state.h, CAM_Z);

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

    const about = worldOf(a.aboutPortrait.getBoundingClientRect());
    profile.to.set(about.x, about.y, 0);
    profile.box = about;
    const aboutRect = a.about.getBoundingClientRect();
    profile.top = aboutRect.top + state.scroll;
    profile.height = aboutRect.height;

    const fire = worldOf(a.fire.getBoundingClientRect());
    const fireScale = Math.min(fire.h / 4.2, fire.w / 3.4);
    state.fire = { x: fire.x, y: fire.y - fire.h / 2 + 0.2 * fireScale, scale: fireScale, pixel };
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
    floating.mesh.visible = hero.visible;
    water.mesh.visible = hero.visible;
    if (hero.visible) {
      water.update(time, clamp01(state.scroll / (state.h * 0.55)) * 1.2);
      floating.update(dt, time, pointerSeen ? pointer.set(mouse.x, -mouse.y) : null);
      heroLayers.forEach(({ object, depth, base }) => {
        object.position.set(base.x + mouse.x * depth, base.y - mouse.y * depth * 0.6, base.z);
      });
      rings.forEach((ring, i) => { ring.rotation.z = time * (i % 2 ? -0.05 : 0.07); });
    }

    const aboutEnter = smooth(clamp01(state.scroll / Math.max(1, profile.top * 0.95)));
    if (heroFigure) heroFigure.rotation.y = rad(90) * smooth(clamp01(aboutEnter / 0.5));
    if (profile.mesh) {
      placeProfile(profile.mesh, aboutEnter);
      const dissolve = clamp01((state.scroll - (profile.top + profile.height * 0.42)) / (profile.height * 0.5));
      profile.mesh.material.uniforms.uDissolve.value = dissolve;
      profile.mesh.visible = aboutEnter > 0.5 && dissolve < 1;
      profile.ghosts.forEach((ghost, i) => {
        ghost.p += (aboutEnter - ghost.p) * (1 - Math.exp(-dt * ghost.follow));
        const opacity = clamp01(Math.abs(aboutEnter - ghost.p) * 7) * (0.42 - i * 0.06);
        ghost.mesh.visible = opacity > 0.01 && ghost.p > 0.64;
        if (!ghost.mesh.visible) return;
        placeProfile(ghost.mesh, ghost.p);
        ghost.material.uniforms.uOpacity.value = opacity;
      });
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

    const fireStart = state.abyssTop - state.h * 1.6;
    state.fireProgress = clamp01((state.scroll - fireStart) / (state.maxScroll - fireStart));
    bonfire.update(dt, state.fireProgress);

    renderer.render(scene, camera);
  }

  const onPointerMove = (event) => {
    mouse.tx = (event.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (event.clientY / window.innerHeight - 0.5) * 2;
    if (event.pointerType === 'mouse') pointerSeen = true;
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
      bonfire.update(0, 1);
      try {
        await renderer.compileAsync(scene, camera);
      } catch {
        // Falls back to compiling on first use.
      }
      bonfire.update(0, state.fireProgress);
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
      bonfire.dispose();
      profile.map?.dispose();
      disposeObject(scene);
      renderer.dispose();
    },
  };
}

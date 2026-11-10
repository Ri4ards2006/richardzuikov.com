import * as THREE from 'three';
import { createBonfire } from '../../three/bonfire';
import { createFloatingShards } from './floating-shards';
import { createInkWater } from './ink-water';
import { createDescentProps, DEPTH_LIMIT } from './descent-props';
import { createSkillProp } from './skill-props';
import { disposeObject, hash, makeCanvas, pointsMaterial, seededPoints, smooth, texture } from '../../three/utils';
import cardFrameSvg from '../../assets/svg/card-frame.svg?raw';

const FOV = 40;
const CAM_Z = 10;
const INK = 0x050505;
const CHARCOAL = 0x121212;
const PAPER = 0xf4f4f0;
const DIVE_MS = 1300;
const MAX_DPR = 1.5;
const MIN_DPR = 0.75;
const SLOW_FRAME_MS = 24;
// Record ride: a full 90° yaw would face empty space, so the WebGL camera whips (max 28°) while the
// DOM board makes the full turn; the camera also drifts sideways at a quarter of the timeline speed.
// Arcana cards (v4: finer): texture 1.5× the v3 size for crisper type, frame strokes at 1.15× their
// 400-unit width on a 768 px texture, i.e. thinner on screen than v3's 1.4× on 512 px.
const CARD_W = 768;
const CARD_H = 1317;
const FRAME_STROKE = 1.15;
const RIDE_WHIP = 28 * Math.PI / 180;
const RIDE_DRIFT = 0.25;
const IDLE_FRAME_MS = 1000 / 30;
const ACTIVE_WINDOW_MS = 500;
const SMALL_SCREEN = 768;
const TRAVEL_MS = 900;
const TRAVEL_DOLLY = 1.4;
const TRAVEL_RISE = 5;
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

// High-contrast grayscale with a 3 px screentone, fine enough to keep the object recognisable.
const TONE = Array.from({ length: 9 }, (_, i) => Math.sin(((i % 3) + 0.5) * (Math.PI * 2 / 3)) * Math.sin((Math.floor(i / 3) + 0.5) * (Math.PI * 2 / 3)));

function drawToned(ctx, img, x, y, w, h) {
  const scale = Math.max(w / img.width, h / img.height);
  ctx.drawImage(img, x + (w - img.width * scale) / 2, y + (h - img.height * scale) / 2, img.width * scale, img.height * scale);
  const pixels = ctx.getImageData(x, y, w, h);
  const { data } = pixels;
  const lumAt = (i) => (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;

  // Per-image levels: dark photos would otherwise sink into black under the contrast curve.
  const histogram = new Uint32Array(256);
  for (let i = 0; i < data.length; i += 4) histogram[Math.round(lumAt(i) * 255)] += 1;
  const total = data.length / 4;
  const percentile = (fraction) => {
    let sum = 0;
    for (let bin = 0; bin < 256; bin += 1) {
      sum += histogram[bin];
      if (sum >= total * fraction) return bin / 255;
    }
    return 1;
  };
  const low = percentile(0.02);
  const high = Math.max(low + 0.05, percentile(0.985));
  const mean = histogram.reduce((sum, count, bin) => sum + count * clamp01((bin / 255 - low) / (high - low)), 0) / total;
  const gamma = THREE.MathUtils.clamp(Math.log(0.42) / Math.log(Math.max(mean, 0.01)), 0.45, 1);

  for (let i = 0; i < data.length; i += 4) {
    const px = (i / 4) % w;
    const py = Math.floor(i / 4 / w);
    const lum = clamp01((lumAt(i) - low) / (high - low)) ** gamma;
    const contrast = clamp01((lum - 0.5) * 1.7 + 0.52);
    // Finer screentone (v4): lower amplitude on a texture 1.5× denser than before.
    const toned = clamp01(contrast + TONE[(py % 3) * 3 + (px % 3)] * 0.075);
    const value = Math.round(toned * 255);
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }
  ctx.putImageData(pixels, x, y);
}

// Card frame from design/assets-src/card-frame.svg, rasterised once at texture size.
// Strokes scaled up so they survive the texture's downsampling on screen.
let frameImage = null;
function cardFrameImage(w, h) {
  if (frameImage) return frameImage;
  const svg = cardFrameSvg
    .replace('<svg ', `<svg width="${w}" height="${h}" preserveAspectRatio="none" `)
    .replace(/currentColor/g, '#f4f4f0')
    .replace(/stroke-width="([\d.]+)"/g, (m, v) => `stroke-width="${(+v * FRAME_STROKE).toFixed(2)}"`)
    .replace('stroke="currentColor"', `stroke="#f4f4f0" stroke-width="${FRAME_STROKE}"`);
  frameImage = new Image(w, h);
  frameImage.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  return frameImage;
}

function drawCard(canvas, project, index, img) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, w, h);
  // Integer rect: drawToned indexes pixels by row width.
  const imageX = Math.round(w * 0.07);
  const imageY = Math.round(h * 0.165);
  const imageW = w - imageX * 2;
  const imageH = Math.round(h * 0.845) - imageY;
  if (img) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(imageX, imageY, imageW, imageH);
    ctx.clip();
    drawToned(ctx, img, imageX, imageY, imageW, imageH);
    ctx.restore();
  }
  const frame = cardFrameImage(w, h);
  // Before it has decoded, the redraw after fonts and frame load fills it in.
  if (frame.complete && frame.naturalWidth) ctx.drawImage(frame, 0, 0, w, h);
  ctx.fillStyle = '#f4f4f0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const u = w / 512;
  ctx.font = `700 ${30 * u}px Cinzel, serif`;
  ctx.fillText(ROMAN[index] ?? String(index + 1), w / 2, h * 0.12 + 2 * u);
  ctx.font = `${42 * u}px Anton, Impact, sans-serif`;
  ctx.letterSpacing = `${1.5 * u}px`;
  ctx.fillText(project.title.toUpperCase(), w / 2, h * 0.925, w * 0.62);
  ctx.letterSpacing = '0px';
  ctx.textBaseline = 'alphabetic';
}

// About portrait: high-contrast grayscale, fine screentone only in the shadows, so features stay readable.
const SOFT_PORTRAIT = `
  varying vec2 vUv; uniform sampler2D uMap; uniform float uOpacity,uDissolve,uShade;
  void main(){
    vec4 c=texture2D(uMap,vUv);
    if(c.a<.5)discard;
    float lum=dot(c.rgb,vec3(.299,.587,.114));
    float tone=mix(lum,.05+.72*smoothstep(.1,.85,1.-vUv.x),uShade);
    float v=clamp((tone-.5)*1.6+.5,0.,1.);
    vec2 fine=fract(mat2(.707,-.707,.707,.707)*gl_FragCoord.xy/3.5)-.5;
    v+=(1.-smoothstep(.14,.4,v))*(1.-smoothstep(.2,.3,length(fine)))*.34;
    if(uDissolve>0.){
      vec2 cell=fract(mat2(.707,-.707,.707,.707)*gl_FragCoord.xy/(5.+uDissolve*11.))-.5;
      if(length(cell)>(1.-uDissolve)*.9)discard;
    }
    gl_FragColor=vec4(mix(vec3(.02),vec3(.957,.957,.941),v),uOpacity);
  }`;

function createPortrait(map, { ghost = false, soft = false, placeholder = false } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: !ghost,
    uniforms: { uMap: { value: map }, uOpacity: { value: 1 }, uDissolve: { value: 0 }, uShade: { value: placeholder ? 1 : 0 } },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: soft ? SOFT_PORTRAIT : `
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

export function createStage({ canvas, anchors, projects, portraitSrc, profileSrc, profilePlaceholder, onDiveEnd }) {
  const isSmall = window.innerWidth < SMALL_SCREEN;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isSmall, powerPreference: 'high-performance' });
  renderer.setClearColor(INK);
  let pixelRatio = isSmall ? 1 : Math.min(window.devicePixelRatio || 1, MAX_DPR);
  renderer.setPixelRatio(pixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80);
  camera.position.z = CAM_Z;

  const state = { lastInput: 0, w: 1, h: 1, k: 0.01, scroll: window.scrollY, camY: 0, frame: 0, last: 0, time: 0, rise: 0, story: 0, slow: 0, count: 0, spent: 0, hover: -1, hiddenCard: -1, ride: { yaw: 0, yawNow: 0, x: 0, xNow: 0 }, abyssTop: 1e9, panels: [], fireProgress: 0, fire: { x: 0, y: 0, scale: 1, pixel: 1 } };
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  // Screentone dust on the stage, rising ash through the descent, embers at the bonfire.
  const dust = seededPoints(isSmall ? 90 : 220, pointsMaterial(
    `attribute vec3 aSeed; uniform float uTime,uRise,uStory,uEmber,uPixel; varying float vShow,vHeat;
     void main(){
       float y=mod(aSeed.y*16.+uRise,16.)-8.;
       vec3 p=vec3((aSeed.x-.5)*20.+sin(uTime*.6+aSeed.y*40.)*.35*uStory,y,(aSeed.z-.5)*10.);
       vShow=smoothstep(-.03,.03,.4+uStory*.7-fract(aSeed.x*7.3));
       vHeat=smoothstep(fract(aSeed.z*5.1)*.7,fract(aSeed.z*5.1)*.7+.3,uEmber);
       vec4 mv=modelViewMatrix*vec4(p,1.);
       gl_Position=projectionMatrix*mv;
       gl_PointSize=uPixel*(16.+aSeed.z*24.)*(1.+uStory*.8+vHeat*.5)/-mv.z;
     }`,
    `uniform float uStory; varying float vShow,vHeat;
     void main(){
       float d=length(gl_PointCoord-.5);
       if(d>.5||vShow<.01)discard;
       vec3 ash=mix(vec3(.957,.957,.941),vec3(.56,.56,.54),uStory);
       gl_FragColor=vec4(mix(ash,vec3(1.,.42,0.),vHeat),(1.-d*(2.-uStory*.8))*(.7+uStory*.3)*vShow);
     }`,
    { uTime: { value: 0 }, uRise: { value: 0 }, uStory: { value: 0 }, uEmber: { value: 0 }, uPixel: { value: 1 } },
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
  const profile = { ghosts: [], mesh: null, map: null, geometry: null, aspect: 1, box: { w: 1, h: 1 }, to: new THREE.Vector3(), top: 0, settle: 1, height: 1 };
  loadImage(profileSrc).then((img) => {
    if (state.disposed) return;
    profile.map = new THREE.Texture(img);
    profile.map.needsUpdate = true;
    profile.aspect = img.width / img.height;
    profile.geometry = new THREE.PlaneGeometry(profile.aspect, 1);
    profile.mesh = new THREE.Mesh(profile.geometry, createPortrait(profile.map, { soft: true, placeholder: profilePlaceholder }));
    scene.add(profile.mesh);
    profile.ghosts = GHOST_FOLLOW.map((follow) => {
      const material = createPortrait(profile.map, { ghost: true, soft: true, placeholder: profilePlaceholder });
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
    const face = makeCanvas(CARD_W, CARD_H);
    drawCard(face, project, index, null);
    const map = texture(face);
    map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const side = new THREE.MeshBasicMaterial({ color: CHARCOAL });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), [side, side, side, side, new THREE.MeshBasicMaterial({ map }), side]);
    const tilt = TILTS[index % TILTS.length];
    const group = new THREE.Group();
    group.add(mesh);
    scene.add(group);
    Promise.all([document.fonts?.load('46px Anton'), document.fonts?.load('700 30px Cinzel'), cardFrameImage(CARD_W, CARD_H).decode().catch(() => {})]).then(() => {
      if (state.disposed) return;
      drawCard(face, project, index, null);
      map.needsUpdate = true;
    });
    return { project, index, face, map, mesh, group, tilt, lift: 0, base: new THREE.Vector3() };
  });

  const floating = createFloatingShards(isSmall ? 30 : 38);
  scene.add(floating.mesh);
  const props = createDescentProps();
  const skillProp = createSkillProp();
  scene.add(skillProp.group);
  const propAim = new THREE.Vector3();
  scene.add(props.group);
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

  // Page rect from the layout boxes (offset chain): CSS transforms are ignored.
  function layoutRect(el) {
    let left = 0;
    let top = 0;
    for (let node = el; node; node = node.offsetParent) {
      left += node.offsetLeft;
      top += node.offsetTop;
    }
    return { left, top, width: el.offsetWidth, height: el.offsetHeight };
  }

  function measure() {
    // Leaving the route unmounts the DOM before the effect cleanup disposes the stage; a resize
    // callback in between finds the anchors gone.
    if (state.disposed || !canvas.isConnected) return;
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

    // Layout rects, not getBoundingClientRect: the panels carry a scroll-dependent parallax transform,
    // and measuring it mid-scroll used to bake the current offset into every anchor (prop drift, v6).
    const parallaxOf = (el) => (el.classList.contains('manga-panel') ? parseFloat(getComputedStyle(el).getPropertyValue('--parallax')) || 0 : 0);
    state.panels = a.panels.map((el) => {
      const r = layoutRect(el);
      return { el, top: r.top, height: r.height, depth: '' };
    });
    props.layout({
      panels: a.panels.map((el) => ({ rect: layoutRect(el), parallax: parallaxOf(el) })),
      obstacles: (a.obstacles ?? []).map((el) => ({ rect: layoutRect(el), parallax: parallaxOf(el) })),
      viewportWidth: state.w,
      viewportHeight: state.h,
      k: state.k,
      proxies: a.propProxies ?? [],
    });

    const skillRect = a.skillProp?.getBoundingClientRect();
    skillProp.layout(skillRect && { left: skillRect.left, width: skillRect.width, top: skillRect.top + state.scroll, height: skillRect.height }, (x, y) => ({ x: (x - state.w / 2) * state.k, y: -(y - state.h / 2) * state.k }));

    const about = worldOf(a.aboutPortrait.getBoundingClientRect());
    profile.to.set(about.x, about.y, 0);
    profile.box = about;
    const aboutRect = a.about.getBoundingClientRect();
    profile.top = aboutRect.top + state.scroll;
    // The scroll position a menu jump lands on, so the figure is fully turned exactly there.
    profile.settle = Math.max(1, profile.top - parseFloat(getComputedStyle(a.about).scrollMarginTop || 0));
    profile.height = aboutRect.height;

    const fire = worldOf(a.fire.getBoundingClientRect());
    const fireScale = Math.min(fire.h / 4.2, fire.w / 3.4);
    state.fire = { x: fire.x, y: fire.y - fire.h / 2 + 0.2 * fireScale, scale: fireScale, pixel };
    state.abyssTop = a.abyss.getBoundingClientRect().top + state.scroll;
    state.maxScroll = Math.max(1, document.documentElement.scrollHeight - state.h);
  }

  async function loadCardImage(card) {
    const img = await loadImage(card.project.image);
    const bitmap = await createImageBitmap(img, { resizeWidth: CARD_W, resizeQuality: 'medium' });
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
    const scrollVelocity = dt > 0 ? (window.scrollY - state.scroll) / dt : 0;
    state.scroll = window.scrollY;
    const follow = 1 - Math.exp(-dt * 18);
    state.camY += (-state.scroll * state.k - state.camY) * follow;
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;

    // A short dolly and a rush of ash when the Record section is entered.
    const travelP = state.travelStart ? clamp01((now - state.travelStart) / TRAVEL_MS) : 1;
    const travel = Math.sin(travelP * Math.PI);
    if (travelP < 1) state.lastInput = now;

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
      camera.position.z = CAM_Z - abyss * 2.4 - travel * TRAVEL_DOLLY;
      // Record ride: the camera whips through its turn and drifts sideways with the timeline.
      const ride = state.ride;
      ride.yawNow += (ride.yaw - ride.yawNow) * follow;
      ride.xNow += (ride.x - ride.xNow) * follow;
      camera.position.x = ride.xNow;
      camera.rotation.set(abyss * rad(7), ride.yawNow, 0);
    }

    dust.position.y = state.camY;
    // The rest of the story runs on scroll: shards thin out and the ash thickens and heats up.
    const ashEnd = Math.max(1, state.abyssTop - state.h);
    const story = clamp01((state.scroll - state.h * 0.3) / Math.max(1, ashEnd - state.h * 0.3));
    const emberStart = state.abyssTop - state.h * 0.8;
    const ember = smooth(clamp01((state.scroll - emberStart) / Math.max(1, state.maxScroll - emberStart)));
    state.rise += dt * (0.18 + story * 0.42 + travel * TRAVEL_RISE);
    Object.assign(dust.material.uniforms.uStory, { value: story });
    dust.material.uniforms.uEmber.value = ember;
    dust.material.uniforms.uRise.value = state.rise;
    dust.material.uniforms.uTime.value = time;

    hero.visible = state.scroll < state.h * 1.4;
    floating.mesh.position.y = state.camY;
    floating.mesh.visible = story < 1;
    if (floating.mesh.visible) floating.update(dt, time, pointerSeen ? pointer.set(mouse.x, -mouse.y) : null, story);
    water.mesh.visible = hero.visible;
    if (hero.visible) {
      water.update(time, clamp01(state.scroll / (state.h * 0.55)) * 1.2);
      heroLayers.forEach(({ object, depth, base }) => {
        object.position.set(base.x + mouse.x * depth, base.y - mouse.y * depth * 0.6, base.z);
      });
      rings.forEach((ring, i) => { ring.rotation.z = time * (i % 2 ? -0.05 : 0.07); });
    }

    const aboutEnter = smooth(clamp01(state.scroll / profile.settle));
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
      const visible = Math.abs(card.base.y - state.camY) < 12 && card.index !== state.hiddenCard;
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

    skillProp.update(time, now, state.camY);
    // The cursor as a world point in front of the props, for the dome camera's lens.
    // Panel depth is a pure function of the scroll position (clamped, never frozen mid-way).
    state.panels.forEach((panel) => {
      const depth = Math.max(-DEPTH_LIMIT, Math.min(DEPTH_LIMIT, (panel.top + panel.height / 2 - state.scroll - state.h / 2) / state.h)).toFixed(3);
      if (depth !== panel.depth) {
        panel.el.style.setProperty('--depth', depth);
        panel.depth = depth;
      }
    });
    props.update({
      time,
      dt,
      scroll: state.scroll,
      velocity: scrollVelocity,
      camera,
      camY: state.camY,
      aimAt: pointerSeen ? propAim.set(mouse.x * state.w * 0.5 * state.k, state.camY - mouse.y * state.h * 0.5 * state.k, 3) : null,
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
    travel() {
      state.travelStart = performance.now();
    },
    setSkillCategory(index) {
      skillProp.select(index);
      state.lastInput = performance.now();
    },
    // yaw −1…1 from the Record ride (in / out turn), shift: px along the timeline, out: 0…1 of the turn back.
    setRide({ yaw, shift, out }) {
      state.ride.yaw = Math.sin(yaw * Math.PI) * RIDE_WHIP;
      state.ride.x = shift * state.k * RIDE_DRIFT * (1 - out);
      state.lastInput = performance.now();
    },
    setHidden(index) {
      state.hiddenCard = index;
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

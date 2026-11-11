import silhouette from '../assets/portraits/silhouette.svg';
import profileSilhouette from '../assets/portraits/profile-silhouette.svg';
import frontSilhouette from '../assets/portraits/front-silhouette.svg';

const files = import.meta.glob('../assets/portraits/*.webp', { eager: true, query: '?url', import: 'default' });

export const menuIds = ['about', 'work', 'stack', 'career', 'contact'];

const portraitPair = (id, placeholder = silhouette) => {
  const large = files[`../assets/portraits/${id}-1400.webp`];
  const small = files[`../assets/portraits/${id}-700.webp`];
  if (large && small) return { large, small, isPlaceholder: false };
  return { large: placeholder, small: placeholder, isPlaceholder: true };
};

// Menu id -> { large, small, isPlaceholder }. Missing photos use a silhouette (legacy ink-art slots).
export const portraits = {
  ...Object.fromEntries(menuIds.map((id) => [id, portraitPair(id)])),
  stage: portraitPair('stage', frontSilhouette),
  about: portraitPair('about', profileSilhouette),
};

// Real photo cut-outs from `npm run cutout` (DESIGN.md §18 "Portraits"):
// src/assets/portraits/cutout/<id>-<color|bw>-<w>x<h>.<avif|webp>, only the heights the source
// allowed (≤ 1.75× Lanczos). Mapping: stage → hero (desktop) · about → profile (/about and the
// stage's About beat) · head → pause-menu preview + mobile hero · night → behind FLAGS.nightPortrait.
// `night` is left out of the eager glob, so its files never reach the bundle while the flag is off.
export const FLAGS = { nightPortrait: false };

// Edges where the figure hits the frame of its source photo, measured on the cut-outs (share of the
// edge that is opaque: stage bottom 72 % / right 11 %, about bottom 99 % / right 55 %, head bottom
// 100 % / left 43 % / right 41 %). Each one fades into ink over this share of the figure (18–25 %,
// DESIGN.md §19), so no cut-out ends in a hard straight line, wherever it is shown.
export const CUTOUT_FADE = {
  stage: { left: 0, right: 0.2, bottom: 0.2 },
  about: { left: 0, right: 0.22, bottom: 0.22 },
  head: { left: 0.2, right: 0.2, bottom: 0.2 },
  night: { left: 0, right: 0, bottom: 0.2 },
};
const NO_FADE = { left: 0, right: 0, bottom: 0 };

const cutoutFiles = import.meta.glob(['../assets/portraits/cutout/*.{avif,webp}', '!../assets/portraits/cutout/night-*'], { eager: true, query: '?url', import: 'default' });

// -> { sizes: [{ w, h }], color: { [h]: { avif, webp } }, bw: { … }, aspect, fade } | null
export function cutoutSet(id, source = cutoutFiles) {
  const set = { sizes: [], color: {}, bw: {} };
  Object.entries(source).forEach(([path, url]) => {
    const match = path.match(/\/([a-z]+)-(color|bw)-(\d+)x(\d+)\.(avif|webp)$/);
    if (!match || match[1] !== id) return;
    const [, , layer, w, h, format] = match;
    const height = Number(h);
    set[layer][height] = { ...set[layer][height], [format]: url };
    if (!set.sizes.some((size) => size.h === height)) set.sizes.push({ w: Number(w), h: height });
  });
  set.sizes.sort((a, b) => a.h - b.h);
  if (!set.sizes.length) return null;
  set.aspect = set.sizes[0].w / set.sizes[0].h;
  set.fade = CUTOUT_FADE[id] ?? NO_FADE;
  return set;
}

// Cut-out id of a file URL (`…/stage-bw-562x900.webp` → 'stage'), for textures loaded by URL.
export const cutoutIdOf = (url) => url?.match(/\/([a-z]+)-(?:color|bw)-\d+x\d+[^/]*$/)?.[1] ?? null;

export const fadeOf = (id) => CUTOUT_FADE[id] ?? NO_FADE;

// CSS custom properties of an edge fade (CutoutPortrait's mask, style.scss).
export function fadeVars(fade, prefix = 'fade') {
  return {
    [`--${prefix}-l`]: `${fade.left * 100}%`,
    [`--${prefix}-r`]: `${fade.right * 100}%`,
    [`--${prefix}-b`]: `${fade.bottom * 100}%`,
  };
}

export const cutouts = { stage: cutoutSet('stage'), about: cutoutSet('about'), head: cutoutSet('head') };

// The flagged night set loads on demand (never while FLAGS.nightPortrait is false).
export const loadNightCutout = async () => {
  if (!FLAGS.nightPortrait) return null;
  const lazy = import.meta.glob('../assets/portraits/cutout/night-*.{avif,webp}', { query: '?url', import: 'default' });
  const entries = await Promise.all(Object.entries(lazy).map(async ([path, load]) => [path, await load()]));
  return cutoutSet('night', Object.fromEntries(entries));
};

// URL of the size whose height covers `px` device pixels (largest otherwise).
export const cutoutUrl = (set, layer, px, format = 'webp') => {
  const size = set.sizes.find((s) => s.h >= px) ?? set.sizes.at(-1);
  return set[layer][size.h][format];
};

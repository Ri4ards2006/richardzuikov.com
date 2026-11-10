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

// Menu id -> { large, small, isPlaceholder }. Missing photos use a silhouette.
// `stage` looks into the camera, `about` is the side profile.
export const portraits = {
  ...Object.fromEntries(menuIds.map((id) => [id, portraitPair(id)])),
  stage: portraitPair('stage', frontSilhouette),
  about: portraitPair('about', profileSilhouette),
};

// Poster sets from `npm run poster` (v7 task 6): src/assets/portraits/poster/<id>-<layer>-<width>.<avif|webp>,
// layer = gray (shader input) | color (colorReveal) | poster (static fallback). Widths 900 / 1400 / 1800,
// only those the source allowed (never upscaled). Missing id -> null, the silhouette stays.
const posterFiles = import.meta.glob('../assets/portraits/poster/*.{avif,webp}', { eager: true, query: '?url', import: 'default' });

const posterSet = (id) => {
  const set = { widths: [], gray: {}, color: {}, poster: {} };
  Object.entries(posterFiles).forEach(([path, url]) => {
    const match = path.match(/\/([a-z]+)-(gray|color|poster)-(\d+)\.(avif|webp)$/);
    if (!match || match[1] !== id) return;
    const [, , layer, width, format] = match;
    const w = Number(width);
    set[layer][w] = { ...set[layer][w], [format]: url };
    if (!set.widths.includes(w)) set.widths.push(w);
  });
  set.widths.sort((a, b) => a - b);
  return set.widths.length ? set : null;
};

export const posters = { about: posterSet('about'), stage: posterSet('stage') };
